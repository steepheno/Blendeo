package Blendeo.backend.chat.service;

import Blendeo.backend.chat.dto.ChatMessageRes;
import Blendeo.backend.chat.dto.ChatRoomPariticipantRes;
import Blendeo.backend.chat.dto.RoomUserInfoRes;
import Blendeo.backend.chat.dto.UserChatInfoRes;
import Blendeo.backend.chat.entity.ChatMessage;
import Blendeo.backend.chat.entity.ChatMessages;
import Blendeo.backend.chat.entity.ChatRoom;
import Blendeo.backend.chat.entity.ChatRoomParticipant;
import Blendeo.backend.chat.repoository.ChatMessageRepository;
import Blendeo.backend.chat.repoository.ChatRoomParticipantRepository;
import Blendeo.backend.chat.repoository.ChatRoomRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j // JPA 트랜잭션 매니저 설정
public class ChatService {

    private final RedisTemplate<String, Object> chatRedisTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomParticipantRepository chatRoomParticipantRepository;
    private final UserRepository userRepository;

    public ChatService(@Qualifier("chatRedisTemplate") RedisTemplate<String, Object> chatRedisTemplate, ChatMessageRepository chatMessageRepository, ChatRoomRepository chatRoomRepository, ChatRoomParticipantRepository chatRoomParticipantRepository, UserRepository userRepository) {
        this.chatRedisTemplate = chatRedisTemplate;
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.chatRoomParticipantRepository = chatRoomParticipantRepository;
        this.userRepository = userRepository;
    }

    public void sendMessage(ChatMessage message) {

        // DB에 메시지 저장
        ChatMessages chatMessage = ChatMessages.builder()
                .chatRoomId(message.getChatRoomId())
                .userId(message.getUserId())
                .content(message.getContent())
                .build();
        log.info("Sending message: {}", chatMessage.getContent());
        ChatMessages savedMessage = chatMessageRepository.save(chatMessage);

        // Redis에 메시지 발행
        log.info("Attempting to publish to Redis...");
        chatRedisTemplate.convertAndSend("/sub/chat/room/" + message.getChatRoomId(), message);
        log.info("Successfully published to Redis");
    }

    public List<ChatMessageRes> getChatHistoryDto(List<ChatMessage> chatMessages) {
        return chatMessages.stream()
                .map(chatMessage -> ChatMessageRes.builder()
                        .type(chatMessage.getType())
                        .chatRoomId(chatMessage.getChatRoomId())
                        .userId(chatMessage.getUserId())
                        .nickname(userRepository.findById(chatMessage.getUserId())
                                .orElseThrow(()-> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()))
                                .getNickname())
                        .profileImage(userRepository.findById(chatMessage.getUserId())
                                .orElseThrow(()-> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()))
                                .getProfileImage())
                        .content(chatMessage.getContent())
                        .createdAt(chatMessage.getCreatedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

    public List<ChatMessage> getChatHistory(Long roomId) {
        return chatMessageRepository.findByChatRoomIdOrderByCreatedAtDesc(roomId)
                .stream()
                .map(this::convertToChatMessage)
                .collect(Collectors.toList());
    }

    public List<ChatRoom> getMyChatRooms(int userId) {
        List<ChatRoomParticipant> chatRoomParticipants = chatRoomParticipantRepository.findByUserId(userId);

        List<ChatRoom> chatRooms = new ArrayList<>();
        chatRoomParticipants.forEach(participant -> {
            chatRooms.add(chatRoomRepository.findById(participant.getChatRoomId()).orElseThrow(()->new EntityNotFoundException(ErrorCode.CHATROOM_NOT_FOUND, ErrorCode.CHATROOM_NOT_FOUND.toString())));
        });
        return chatRooms;
    }

    private ChatMessage convertToChatMessage(ChatMessages entity) {
        return new ChatMessage(
                ChatMessage.MessageType.TALK,
                entity.getChatRoomId(),
                entity.getUserId(),
                entity.getContent(),
                entity.getCreatedAt()
        );
    }

    public void inviteUser(Long roomId, int userId) {
        ChatRoomParticipant chatRoomParticipant = ChatRoomParticipant.builder()
                .chatRoomId(roomId)
                .user(userRepository.findById(userId)
                        .orElseThrow(()->new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage())))
                .build();
        chatRoomParticipantRepository.save(chatRoomParticipant);
    }

    public ChatRoom createRoom(String roomName) {
        ChatRoom chatRoom = chatRoomRepository.save(new ChatRoom(roomName));
        return chatRoom;
    }

    public void participateIn(Long roomId, int userId) {
        chatRoomParticipantRepository.save(
                ChatRoomParticipant.builder()
                        .chatRoomId(roomId)
                        .user(userRepository.findById(userId)
                                .orElseThrow(()->new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage())))
                        .build()
        );
    }

    // 내가 그 채팅방을 참여하고 있는지 확인
    public boolean isInThatChatRoom(Long roomId, int userId) {
        boolean isExist = false;
        List<ChatRoomParticipant> roomParticipants = chatRoomParticipantRepository.findAllByChatRoomId(roomId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.CHATROOM_NOT_FOUND, ErrorCode.CHATROOM_NOT_FOUND.getMessage()));
        for (ChatRoomParticipant chatRoomParticipant : roomParticipants) {
            if (chatRoomParticipant.getUser().getId() == userId) {
                isExist = true;
            }
        };
        return isExist;
    }

    public List<RoomUserInfoRes> getRoomParticipantsByRoomId(Long roomId) {
        List<ChatRoomParticipant> chatRoomParticipants = chatRoomParticipantRepository.findByChatRoomId(roomId);

        return chatRoomParticipants.stream()
                .map(chatRoomParticipant -> RoomUserInfoRes.builder()
                        .userId(chatRoomParticipant.getUser().getId())
                        .email(chatRoomParticipant.getUser().getEmail())
                        .nickname(chatRoomParticipant.getUser().getNickname())
                        .profileImage(chatRoomParticipant.getUser().getProfileImage())
                        .build())
                .collect(Collectors.toList());
    }

    public long getChatRoomExist(List<Integer> userIds) {

        // 만약에 멤버들이 모두 존재하는 값이 있다면!
        // 3명이라면 모두가 포함된 것이 존재하는 지 판별.

        // 채팅방의 구성원 리스트를 가져오자.
        List<ChatRoomPariticipantRes> chatRoomPariticipantRes = null;
        List<Long> chatRoomIds = chatRoomParticipantRepository.findDistinctChatRoomIds();

        chatRoomPariticipantRes = chatRoomIds.stream()
                .map(chatRoomId -> {
                    List<Integer> tmpUserIds = chatRoomParticipantRepository.findUserIdsByChatRoomId(chatRoomId);
                    return new ChatRoomPariticipantRes(chatRoomId, tmpUserIds);
                })
                .toList();
        // 해당 방의 인원수와 일치하는 지 확인.
        for (ChatRoomPariticipantRes chatRoomParticipant : chatRoomPariticipantRes) {
            log.info("start: " + chatRoomParticipant.getChatRoomId());

            boolean isExist = true;
            for (Integer userId : userIds) {
                if (!chatRoomParticipant.getUserIds().contains(userId)) {
                    isExist = false;
                }
            }
            if (isExist && userIds.size() == chatRoomParticipant.getUserIds().size()) {
                return chatRoomParticipant.getChatRoomId();
            }
        }

        return 0;
    }

    public void editRoomName(long roomId, String roomName) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(()-> new EntityNotFoundException(ErrorCode.CHATROOM_NOT_FOUND, ErrorCode.CHATROOM_NOT_FOUND.getMessage()));

        chatRoom.update(roomName);

        chatRoomRepository.save(chatRoom);
    }
}

package Blendeo.backend.chat.service;

import Blendeo.backend.chat.entity.ChatMessage;
import Blendeo.backend.chat.entity.ChatMessages;
import Blendeo.backend.chat.entity.ChatRoom;
import Blendeo.backend.chat.entity.ChatRoomParticipant;
import Blendeo.backend.chat.repoository.ChatMessageRepository;
import Blendeo.backend.chat.repoository.ChatRoomParticipantRepository;
import Blendeo.backend.chat.repoository.ChatRoomRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j // JPA 트랜잭션 매니저 설정
public class ChatService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomParticipantRepository participantRepository;
    private final ChatRoomParticipantRepository chatRoomParticipantRepository;

    public void sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());

        // DB에 메시지 저장
        ChatMessages chatMessage = ChatMessages.builder()
                .chatRoomId(message.getChatRoomId())
                .userId(message.getUserId())
                .content(message.getContent())
                .createdAt(message.getTimestamp())
                .build();
        log.info("Sending message: {}", chatMessage.getContent());
        ChatMessages savedMessage = chatMessageRepository.save(chatMessage);

        // Redis에 메시지 발행
        log.info("Attempting to publish to Redis...");
        redisTemplate.convertAndSend("/sub/chat/room/" + message.getChatRoomId(), message);
        log.info("Successfully published to Redis");
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
                .userId(userId)
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
                        .userId(userId)
                        .build()
        );
    }

    // 내가 그 채팅방을 참여하고 있는지 확인
    public boolean isInThatChatRoom(Long roomId, int userId) {
        boolean isExist = false;
        List<ChatRoomParticipant> roomParticipants = chatRoomParticipantRepository.findAllByChatRoomId(roomId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.CHATROOM_NOT_FOUND, ErrorCode.CHATROOM_NOT_FOUND.toString()));
        for (ChatRoomParticipant chatRoomParticipant : roomParticipants) {
            if (chatRoomParticipant.getUserId().equals(userId)) {
                isExist = true;
            }
        };
        return isExist;
    }
}

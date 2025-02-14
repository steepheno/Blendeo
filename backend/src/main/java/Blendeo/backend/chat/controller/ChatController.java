package Blendeo.backend.chat.controller;

import Blendeo.backend.chat.dto.ChatRoomCreateRes;
import Blendeo.backend.chat.dto.UserChatInfoRes;
import Blendeo.backend.chat.entity.ChatMessage;
import Blendeo.backend.chat.entity.ChatRoom;
import Blendeo.backend.chat.entity.ChatRoomParticipant;
import Blendeo.backend.chat.repoository.ChatRoomParticipantRepository;
import Blendeo.backend.chat.repoository.ChatRoomRepository;
import Blendeo.backend.chat.service.ChatService;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.search.service.SearchService;
import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final ChatService chatService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final SearchService searchService;
    private final UserService userService;
    private final ChatRoomRepository chatRoomRepository;

    // 채팅방에 들어와서 메시지 전송
    @MessageMapping("/chat/message") // 클라이언트에서 보낸 /pub/chat/message 처리!
    public void message(ChatMessage message) {
        // 현재 인증된 사용자 정보 가져오기
        Integer userId = Integer.parseInt(String.valueOf(message.getUserId()));
        message.setUserId(userId);

        chatService.sendMessage(message);

        // 구독자들에게 메시지를 브로드캐스트 : 구독한 모든 클라이언트에게 전송됨.
        messagingTemplate.convertAndSend(
                "/sub/chat/room/" + message.getChatRoomId(),
                message
        );
    }
    
    // 채팅방 생성 및 나도 그 채팅방에 들어가기
    @Operation(summary = "채팅방 생성 및 나 + 들어오는 userId 값. 그 채팅방에 들어가기")
    @PostMapping("/api/v1/chat/rooms/create")
    @Transactional
    public ResponseEntity<?> createRoom(@RequestParam("userIds") List<Integer> userIds) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 채팅방이 존재하는 지 확인
        long roomNo = chatService.getChatRoomExist(userIds);

        if (roomNo != 0) { // 채팅방이 존재함.
            ChatRoom chatRoom = chatRoomRepository.findById(roomNo)
                    .orElseThrow(()->new EntityNotFoundException(ErrorCode.CHATROOM_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
            ChatRoomCreateRes chatRoomCreateRes = ChatRoomCreateRes.builder()
                    .roomId(chatRoom.getId())
                    .roomName(chatRoom.getName())
                    .participants(userIds).build();
            return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomCreateRes);
        }

        // 채팅방 생성
        // 채팅방 이름 임의로 생성
        String roomName = "" + userService.getUser(Integer.parseInt(user.getUsername())).getNickname() + ", ";

        for (int index = 0; index < userIds.size() - 1; index++) {
            roomName += userService.getUser(userIds.get(index)).getNickname() +", ";
        }

        roomName += userService.getUser(userIds.get(userIds.size() - 1)).getNickname();

        ChatRoom chatRoom = chatService.createRoom(roomName);
        // 채팅방 내가 들어가기
        chatService.participateIn(chatRoom.getId(), Integer.parseInt(user.getUsername()));

        // 다른 유저들 들어가기
        for (Integer userId : userIds) {
            // 내가 들어오면 참여 X (이미 참여시켰기 때문)
            if (userId == Integer.parseInt(user.getUsername())) {
                continue;
            }
            // 다른 유저들만 참여시킴
            chatService.participateIn(chatRoom.getId(), userId);
        }

        ChatRoomCreateRes chatRoomCreateRes = ChatRoomCreateRes.builder()
                .roomId(chatRoom.getId())
                .roomName(chatRoom.getName())
                .participants(userIds).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomCreateRes);
    }

    @PatchMapping("/api/v1/chat/room/name/edit")
    public ResponseEntity<?> editRoomName(@RequestParam("roomId") long roomId, @RequestParam("roomName") String roomName) {
        chatService.editRoomName(roomId, roomName);

        return ResponseEntity.ok().build();
    }

    // 채팅방의 메시지 조회
    @Operation(summary = "채팅방 내역 조회")
    @GetMapping("/api/v1/chat/rooms/{roomId}/messages")
    public ResponseEntity<?> getChatHistory(@PathVariable("roomId") Long roomId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 내가 있는 채팅방인지 확인하기
        if (!chatService.isInThatChatRoom(roomId, Integer.parseInt(user.getUsername()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        };
        return ResponseEntity.ok(chatService.getChatHistoryDto(chatService.getChatHistory(roomId)));
    }

    // 채팅방 초대하기
//    @Operation(summary = "채팅방 다른 친구 초대하기")
//    @PostMapping("/api/v1/chat/rooms/{roomId}/users/{userId}")
//    public ResponseEntity<String> inviteUser(@PathVariable("roomId") Long roomId, @PathVariable("userId") int userId) {
//        chatService.inviteUser(roomId, userId);
//
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    // 내가 들어가있는 채팅방 조회하기
    @Operation(summary = "내가 들어가있는 채팅방 조회하기")
    @GetMapping("/api/v1/chat/my/rooms")
    public ResponseEntity<List<ChatRoom>> getMyChatRooms() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<ChatRoom> chatRooms = chatService.getMyChatRooms(Integer.parseInt(user.getUsername()));

        return ResponseEntity.ok(chatRooms);
    }

    // 아이디로 유저 정보 조회하기
    @Operation(summary = "아이디로 유저 정보 조회하기")
    @GetMapping("/api/v1/chat/search/user/email")
    public ResponseEntity<List<UserChatInfoRes>> searchUserByEmail(@RequestParam(value="email", required=false) String email,
                                                                   @RequestParam(defaultValue = "0", value = "page") int page,
                                                                   @RequestParam(defaultValue = "10", value = "size") int size){
        return ResponseEntity.ok().body(searchService.searchUserByEmail(email, page, size)
                .stream().map(userInfoGetRes -> UserChatInfoRes.builder()
                        .userId(userInfoGetRes.getId())
                        .email(userInfoGetRes.getEmail())
                        .profileImage(userInfoGetRes.getProfileImage())
                        .build())
                .collect(Collectors.toList()));
    }

    // 단일 채팅방 참여 유저 조회
    @Operation(summary = "단일 채팅방 참여 유저 조회")
    @GetMapping("/api/v1/room/participants")
    public ResponseEntity<?> getRoomParticipantsByRoomId(@RequestParam("roomId") Long roomId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 내가 그 방에 들어가 있는 유저인지 조회

        return ResponseEntity.ok().body(chatService.getRoomParticipantsByRoomId(roomId));
    }

}
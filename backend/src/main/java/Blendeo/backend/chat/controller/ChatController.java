package Blendeo.backend.chat.controller;

import Blendeo.backend.chat.entity.ChatMessage;
import Blendeo.backend.chat.entity.ChatRoom;
import Blendeo.backend.chat.entity.ChatRoomParticipant;
import Blendeo.backend.chat.repoository.ChatRoomParticipantRepository;
import Blendeo.backend.chat.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final ChatService chatService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatRoomParticipantRepository chatRoomParticipantRepository;

    // 채팅방에 들어와서 메시지 전송
    @MessageMapping("/chat/message") // 클라이언트에서 보낸 /pub/chat/message 처리!
    public void message(ChatMessage message) {
        // 현재 인증된 사용자 정보 가져오기
        Integer userId = Integer.parseInt(String.valueOf(message.getUserId()));
        message.setUserId(userId);
        log.info("Controller: " + message.toString());

        chatService.sendMessage(message);

        // 구독자들에게 메시지를 브로드캐스트 : 구독한 모든 클라이언트에게 전송됨.
        messagingTemplate.convertAndSend(
                "/sub/chat/room/" + message.getChatRoomId(),
                message
        );
    }
    
    // 채팅방 생성 및 나도 그 채팅방에 들어가기
    @Operation(summary = "채팅방 생성 및 나도 그 채팅방에 들어가기")
    @PostMapping("/api/v1/chat/rooms/create")
    public ResponseEntity<?> createRoom(@RequestParam("roomName") String roomName) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 채팅방 생성
        ChatRoom chatRoom = chatService.createRoom(roomName);
        // 채팅방 내가 들어가기
        chatService.participateIn(chatRoom.getId(), Integer.parseInt(user.getUsername()));

        return ResponseEntity.status(HttpStatus.CREATED).body(chatRoom);
    }

    // 채팅방의 메시지 조회
    @Operation(summary = "채팅방 내역 조회")
    @GetMapping("/api/v1/chat/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable("roomId") Long roomId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 내가 있는 채팅방인지 확인하기
        if (!chatService.isInThatChatRoom(roomId, Integer.parseInt(user.getUsername()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        };
        log.warn("ChatController: getChatHistory");
        return ResponseEntity.ok(chatService.getChatHistory(roomId));
    }

    // 채팅방 초대하기
    @Operation(summary = "채팅방 다른 친구 초대하기")
    @PostMapping("/api/v1/chat/rooms/{roomId}/users/{userId}")
    public ResponseEntity<String> inviteUser(@PathVariable("roomId") Long roomId, @PathVariable("userId") int userId) {
        chatService.inviteUser(roomId, userId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 내가 들어가있는 채팅방 조회하기
    @Operation(summary = "내가 들어가있는 채팅방 조회하기")
    @GetMapping("/api/v1/chat/my/rooms")
    public ResponseEntity<List<ChatRoom>> getMyChatRooms() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<ChatRoom> chatRooms = chatService.getMyChatRooms(Integer.parseInt(user.getUsername()));

        return ResponseEntity.ok(chatRooms);
    }
}
package Blendeo.backend.notification.controller;

import Blendeo.backend.infrastructure.redis.RedisPublisher;
import Blendeo.backend.infrastructure.redis.RedisSubscriber;
import Blendeo.backend.notification.dto.NotificationRedisDTO;
import Blendeo.backend.notification.dto.NotificationRes;
import Blendeo.backend.notification.entity.Notification;
import Blendeo.backend.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequestMapping("/api/v1/notify")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class NotificationController {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final RedisSubscriber redisSubscriber;
    private final NotificationService notificationService;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        redisSubscriber.addEmitter(userId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connection Established"));
        } catch (IOException e) {
            log.error("연결 메시지 전송 실패", e);
        }

        return emitter;
    }

    @PostMapping("/test-direct-send")
    public ResponseEntity<String> testDirectSend(
            @RequestParam int userId,
            @RequestParam String message
    ) {
        NotificationRedisDTO notificationRedisDTO = NotificationRedisDTO.builder()
                .content(message)
                .build();

        try {
            redisSubscriber.sendNotificationToEmitters(userId, notificationRedisDTO);
            return ResponseEntity.ok("알림 전송 완료" + notificationRedisDTO.getContent());
        } catch (Exception e) {
            log.error("알림 전송 실패", e);
            return ResponseEntity.internalServerError().body("알림 전송 실패: " + e.getMessage());
        }
    }

    @Operation(
            summary = "알림 읽음 처리(단건)"
    )
    @PatchMapping("/read-one")
    public ResponseEntity<String> readOne(
            @RequestParam("notificationId") Long notificationId
    ){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        try {
            notificationService.readNotification(userId, notificationId);
            return ResponseEntity.ok("알림 읽음 처리 성공");
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("알림 읽음 실패: " + e.getMessage());
        }
    }

    @Operation(
            summary = "알림 전체 읽음 처리(다건)"
    )
    @PatchMapping("/read-all")
    public ResponseEntity<String> readAll(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        try {
            notificationService.readAllNotification(userId);
            return ResponseEntity.ok("모든 알림 읽음 처리 성공");
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("모든 알림 읽음 실패: " + e.getMessage());
        }
    }

    @Operation(
            summary = "일주일 간의 알림 조회"
    )
    @GetMapping("/get/week")
    public ResponseEntity<List<NotificationRes>> getWeekNotification(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());
        List<NotificationRes> weekNotifications = notificationService.getWeekNotification(userId);
        return ResponseEntity.ok(weekNotifications);
    }
}

package Blendeo.backend.notification.controller;

import Blendeo.backend.infrastructure.redis.RedisPublisher;
import Blendeo.backend.infrastructure.redis.RedisSubscriber;
import Blendeo.backend.notification.entity.Notification;
import Blendeo.backend.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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
    public SseEmitter subscribe(@RequestParam int userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        redisSubscriber.addEmitter(userId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("연결됨"));
        } catch (IOException e) {
            log.error("연결 메시지 전송 실패", e);
        }

        return emitter;
    }

    // 테스트용 직접 알림 전송 엔드포인트
    @PostMapping("/test-direct-send")
    public ResponseEntity<String> testDirectSend(
            @RequestParam int userId,
            @RequestParam String message
    ) {
        Notification notification = new Notification();
        notification.setContent(message);

        try {
            redisSubscriber.sendNotificationToEmitters(userId, notification);
            return ResponseEntity.ok("알림 전송 완료" + notification.getContent());
        } catch (Exception e) {
            log.error("알림 전송 실패", e);
            return ResponseEntity.internalServerError().body("알림 전송 실패: " + e.getMessage());
        }
    }



//    @Operation(
//            summary = "클라이언트 알림 구독"
//    )
//    @GetMapping(value = "/notifications")
//    public ResponseEntity<SseEmitter> notificationSubscribe(int userId) {
//        return ResponseEntity.ok(notificationService.createEmitter(userId));
//    }
}

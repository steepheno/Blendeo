package Blendeo.backend.infrastructure.redis;

import Blendeo.backend.notification.entity.Notification;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
public class RedisSubscriber {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    private final Map<Integer, List<SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);

    public RedisSubscriber(
            RedisTemplate<String, Object> redisTemplate,
            ObjectMapper objectMapper
    ) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    // Redis 메시지 수신
    public void onMessage(String channel, String message) {
        log.info("Received channel: {} message: {}", channel, message);

        String cleanedMessage = message.replace("\"", "");
        log.debug("Cleaned message: {}", cleanedMessage);

        processMessage(cleanedMessage, 5); // 최대 5번 재시도
    }

    // 메시지 처리 -> 최대 5번 재시도
    private void processMessage(String key, int retriesLeft) {
        scheduledExecutorService.submit(() -> {
            try {
                String notificationJson = null;
                for (int attempt = 0; attempt < retriesLeft; attempt++) {
                    notificationJson = (String) redisTemplate.opsForValue().get(key);
                    if (notificationJson != null) {
                        break;
                    }
                    log.debug("Retrying to get key -> {} :: attempt -> {}", key, attempt + 1);
                    try {
                        Thread.sleep(200);
                    } catch (InterruptedException e) {
                        log.error("Sleep interrupted", e);
                        Thread.currentThread().interrupt();
                        return;
                    }
                }

                // 메시지가 정상적으로 가지고 와지면 json으로 파싱하여 notification 객체로 변환
                if (notificationJson != null) {
                    Notification notification = objectMapper.readValue(notificationJson, Notification.class);
                    int userId = notification.getReceiver().getId();
                    log.debug("Received notification-> {} :: userId -> {}", notification, userId);

                    sendNotificationToEmitters(userId, notification);
                }
            } catch (Exception e) {
                log.error("Exception during message processing for key -> {} error -> {}", key, e.getMessage());
            }
        });
    }

    // 수신자 id를 기반으로 해당 유저의 모든 SseEmitter에 메시지 전송
    public void sendNotificationToEmitters(int userId, Notification notification) {
        List<SseEmitter> userEmitters = emitters.get(userId);
        if (userEmitters != null && !userEmitters.isEmpty()) {
            List<SseEmitter> deadEmitters = new ArrayList<>();
            for (SseEmitter emitter : userEmitters) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("newComment")
                            .data(notification.getContent()));
                    log.info("Sent SSE to user -> {} :: notification -> {} :: time -> {}", userId, notification.getContent(),
                            System.currentTimeMillis());

                } catch (IOException e) {
                    log.error("Exception during sending SSE to user -> {} error -> {}", userId, e.getMessage());
                    deadEmitters.add(emitter);
                }
            }
            userEmitters.removeAll(deadEmitters);
        } else {
            log.warn("No emitters found for user -> {}", userId);
        }
    }

    // SSE Emitter 추가
    public void addEmitter(int userId, SseEmitter emitter) {
        emitters.computeIfAbsent(userId, k -> new ArrayList<>()).add(emitter);
        log.info("Emitter added for user -> {}", userId);

        emitter.onCompletion(() -> {
            removeEmitter(userId, emitter);
            log.info("Emitter removed for user -> {}", userId);
        });

        emitter.onTimeout(() -> {
            removeEmitter(userId, emitter);
            log.info("Emitter time out for user -> {}", userId);
        });

        emitter.onError((Throwable t) -> {
            removeEmitter(userId, emitter);
            log.error("Emitter error for user -> {} :: message -> {}", userId, t.getMessage());
        });
    }

    // SSE Emitter 제거
    public void removeEmitter(int userId, SseEmitter emitter) {
        List<SseEmitter> userEmitters = emitters.get(userId);
        if (userEmitters != null) {
            userEmitters.remove(emitter);
            if (userEmitters.isEmpty()) {
                emitters.remove(userId);
            }
        }
        log.info("emitter removed for user -> {}", userId);
    }
}

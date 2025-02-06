package Blendeo.backend.infrastructure.redis;

import Blendeo.backend.notification.dto.NotificationRedisDTO;
import Blendeo.backend.notification.entity.Notification;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RedisPublisher {

    private final RedisTemplate<String, Object> notificationRedisTemplate;
    private final ObjectMapper objectMapper;

    public RedisPublisher(RedisTemplate<String, Object> notificationRedisTemplate, ObjectMapper objectMapper) {
        this.notificationRedisTemplate = notificationRedisTemplate;
        this.objectMapper = objectMapper;
    }

    public void publish(String channel, Object message) {
        log.info("publishing message to channel : channel -> {} :: time -> {} :: message -> {}", channel,
                System.currentTimeMillis(), message);
        notificationRedisTemplate.convertAndSend(channel, message);
        log.info("published message to channel : channel -> {} :: time -> {} :: message -> {}", channel,
                System.currentTimeMillis(), message);
    }

    public void saveNotificationWithTTL(String key, NotificationRedisDTO notification, long ttl, TimeUnit timeUnit) {
        try {
            String notificationJson = objectMapper.writeValueAsString(notification);
            notificationRedisTemplate.opsForValue().set(key, notificationJson, ttl, timeUnit);
            log.debug("saved notification to redis : key -> {} :: ttl -> {} :: timeUnit -> {}", key, ttl, timeUnit);

        } catch (Exception e) {
            log.error("error saving notification to redis : key -> {} :: ttl -> {} :: timeUnit -> {} :: error -> {}",
                    key, ttl, timeUnit, e.getMessage());
        }
    }
}

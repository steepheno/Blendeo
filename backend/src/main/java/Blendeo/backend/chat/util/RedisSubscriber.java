package Blendeo.backend.chat.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RedisSubscriber {
    @EventListener
    public void handleRedisMessage(Message<String> message) {
        log.info("Received message from Redis: {}", message.getPayload());
    }
}

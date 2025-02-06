package Blendeo.backend.notification.dto;

import Blendeo.backend.notification.entity.Notification;
import Blendeo.backend.notification.entity.Notification.NotificationType;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonSerialize
public class NotificationRedisDTO {
    private Long id;
    private int receiverId;
    private int senderId;
    private String content;
    private Boolean isRead;
    private String notificationType;
    private LocalDateTime createdAt;

    @Builder
    public NotificationRedisDTO(Notification notification){
        this.id = notification.getId();
        this.receiverId = notification.getReceiver().getId();
        this.senderId = notification.getSender().getId();
        this.content = notification.getContent();
        this.isRead = notification.getIsRead();
        this.notificationType = notification.getNotificationType().name();
        this.createdAt = notification.getCreatedAt();
    }

}

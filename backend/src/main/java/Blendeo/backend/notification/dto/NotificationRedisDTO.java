package Blendeo.backend.notification.dto;

import Blendeo.backend.comment.dto.CommentRes;
import Blendeo.backend.comment.entity.Comment;
import Blendeo.backend.notification.entity.Notification;
import Blendeo.backend.notification.entity.Notification.NotificationType;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonDeserialize
public class NotificationRedisDTO {
    private Long id;
    private int receiverId;
    private int senderId;
    private String content;
    private Boolean isRead;

    @JsonProperty("notificationType")
    private String notificationType;

    private String createdAt;

    @Builder
    public NotificationRedisDTO (Long id, int receiverId, int senderId, String content, Boolean isRead, String notificationType, String createdAt) {
        this.id = id;
        this.receiverId = receiverId;
        this.senderId = senderId;
        this.content = content;
        this.isRead = isRead;
        this.notificationType = notificationType;
        this.createdAt = createdAt;
    }

    public static NotificationRedisDTO from(Notification notification){
        return NotificationRedisDTO.builder()
                .id(notification.getId())
                .receiverId(notification.getReceiver().getId())
                .senderId(notification.getSender().getId())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .notificationType(notification.getNotificationType().name())
                .createdAt(notification.getCreatedAt().toString())
                .build();
    }
}

package Blendeo.backend.notification.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Notification {
    private int id;
    private int receiverId;
    private int senderId;
    private String content;
    private Boolean isRead;
    private LocalDateTime sendTime;
    private NotificationType notificationType;

    public enum NotificationType {
        CHAT, COMMENT, LIKE, SCRAP, FOLLOW, SYSTEM
    }

    @Builder
    public Notification(int receiverId, int senderId, String content,
                        Boolean isRead, LocalDateTime sendTime, NotificationType notificationType) {

        this.receiverId = receiverId;
        this.senderId = senderId;
        this.content = content;
        this.isRead = isRead;
        this.sendTime = sendTime;
        this.notificationType = notificationType;
    }

}
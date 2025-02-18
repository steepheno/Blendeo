package Blendeo.backend.notification.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.net.URL;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NotificationRes {
    private long notificationId;
    private int receiverId;
    private int senderId;
    private boolean isRead;
    private String content;
    private URL profileImage;
    private LocalDateTime createdAt;

    @Builder
    public NotificationRes(long notificationId, int receiverId, int senderId, boolean isRead, String content, URL profileImage) {
        this.notificationId = notificationId;
        this.receiverId = receiverId;
        this.senderId = senderId;
        this.isRead = isRead;
        this.content = content;
        this.profileImage = profileImage;
        this.createdAt = LocalDateTime.now();
    }
}

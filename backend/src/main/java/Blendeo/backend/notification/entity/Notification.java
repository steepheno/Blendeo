package Blendeo.backend.notification.entity;

import Blendeo.backend.global.entity.BaseTimeEntity;
import Blendeo.backend.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Notification extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private String content;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column
    private LocalDateTime sendTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;

    public Notification() {
    }

    public enum NotificationType {
        CHAT, COMMENT, LIKE, SCRAP, FOLLOW, SYSTEM
    }

    @Builder
    public Notification(User user, String content, Boolean isRead, NotificationType notificationType,
                        LocalDateTime sendTime) {
        this.user = user;
        this.content = content;
        this.isRead = isRead;
        this.notificationType = notificationType;
        this.sendTime = sendTime;
    }


}

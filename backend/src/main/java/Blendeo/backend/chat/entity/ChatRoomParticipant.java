package Blendeo.backend.chat.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chat_room_participants")
public class ChatRoomParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long chatRoomId;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    @Builder
    public ChatRoomParticipant(Long chatRoomId, Integer userId) {
        this.chatRoomId = chatRoomId;
        this.userId = userId;
        this.joinedAt = LocalDateTime.now();
    }
}
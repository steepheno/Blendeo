package Blendeo.backend.chat.entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage implements Serializable {
    private MessageType type;
    private Long chatRoomId;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;

    public enum MessageType {
        ENTER, TALK, LEAVE
    }
}
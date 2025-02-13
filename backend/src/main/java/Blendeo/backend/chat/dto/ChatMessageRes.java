package Blendeo.backend.chat.dto;

import Blendeo.backend.chat.entity.ChatMessage;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

import java.net.URL;
import java.time.LocalDateTime;

@Getter
public class ChatMessageRes {

    private ChatMessage.MessageType type;
    private Long chatRoomId;
    private Integer userId;
    private String nickname;
    private URL profileImage;
    private String content;
    private LocalDateTime timestamp;

    @Builder
    public ChatMessageRes(ChatMessage.MessageType type, Long chatRoomId, Integer userId, String nickname, URL profileImage, String content) {
        this.type = type;
        this.chatRoomId = chatRoomId;
        this.userId = userId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
}

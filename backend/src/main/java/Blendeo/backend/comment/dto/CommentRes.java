package Blendeo.backend.comment.dto;

import Blendeo.backend.comment.entity.Comment;
import java.net.URL;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentRes {
    private long id;
    private String comment;
    private LocalDateTime createdAt;
    private int userId;
    private String userNickname;
    private URL userProfile;

    @Builder
    public CommentRes(long id, String comment, LocalDateTime createdAt, int userId, String userNickname, URL userProfile) {
        this.id = id;
        this.comment = comment;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userNickname = userNickname;
        this.userProfile = userProfile;
    }

    public static CommentRes from(Comment comment){
        return CommentRes.builder()
                .id(comment.getId())
                .comment(comment.getComment())
                .createdAt(comment.getCreatedAt())
                .userId(comment.getUser().getId())
                .userNickname(comment.getUser().getNickname())
                .userProfile(comment.getUser().getProfileImage())
                .build();
    }
}

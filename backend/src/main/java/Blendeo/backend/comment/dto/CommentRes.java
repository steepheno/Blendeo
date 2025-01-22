package Blendeo.backend.comment.dto;

import Blendeo.backend.comment.entity.Comment;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentRes {
    private long id;
    private String comment;
    private LocalDateTime createdAt;
    private User user;
    private Project project;

    @Builder
    public CommentRes(long id, String comment, LocalDateTime createdAt, User user, Project project) {
        this.id = id;
        this.comment = comment;
        this.createdAt = createdAt;
        this.user = user;
        this.project = project;
    }

    public static CommentRes from(Comment comment){
        return CommentRes.builder()
                .id(comment.getId())
                .comment(comment.getComment())
                .createdAt(comment.getCreatedAt())
                .user(comment.getUser())
                .project(comment.getProject())
                .build();
    }
}

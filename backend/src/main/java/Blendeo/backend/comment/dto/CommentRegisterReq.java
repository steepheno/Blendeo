package Blendeo.backend.comment.dto;

import lombok.Getter;

@Getter
public class CommentRegisterReq {
    private Long projectId;
    private String comment;
}

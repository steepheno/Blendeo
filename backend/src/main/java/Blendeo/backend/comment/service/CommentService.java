package Blendeo.backend.comment.service;

import Blendeo.backend.comment.dto.CommentRegisterReq;

public interface CommentService {
    void registerComment(String userEmail, CommentRegisterReq commentRegisterReq);
    void deleteComment(String userEmail, Long commentId);
}

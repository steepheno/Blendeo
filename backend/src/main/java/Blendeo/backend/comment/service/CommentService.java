package Blendeo.backend.comment.service;

import Blendeo.backend.comment.dto.CommentRegisterReq;
import Blendeo.backend.comment.dto.CommentRes;

import java.util.List;

public interface CommentService {
    void registerComment(String userEmail, CommentRegisterReq commentRegisterReq);
    void deleteComment(String userEmail, Long commentId);
    List<CommentRes> getComments(Long projectId);
}

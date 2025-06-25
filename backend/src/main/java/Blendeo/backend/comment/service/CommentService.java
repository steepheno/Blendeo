package Blendeo.backend.comment.service;

import Blendeo.backend.comment.dto.CommentRegisterReq;
import Blendeo.backend.comment.dto.CommentRes;

import java.util.List;

public interface CommentService {
    void registerComment(int userId, CommentRegisterReq commentRegisterReq);
    void deleteComment(int userId, Long commentId);
    List<CommentRes> getComments(Long projectId);
}

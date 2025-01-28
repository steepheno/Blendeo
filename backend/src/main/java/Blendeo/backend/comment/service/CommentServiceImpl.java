package Blendeo.backend.comment.service;

import Blendeo.backend.comment.dto.CommentRegisterReq;
import Blendeo.backend.comment.dto.CommentRes;
import Blendeo.backend.comment.entity.Comment;
import Blendeo.backend.comment.repository.CommentRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.exception.InvalidCommentException;
import Blendeo.backend.exception.UnauthorizedAccessException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void registerComment(int userId, CommentRegisterReq commentRegisterReq) {

        if (commentRegisterReq.getComment() == null || commentRegisterReq.getComment().trim().isEmpty()) {
            throw new InvalidCommentException();
        }

        Project project = projectRepository.findById(commentRegisterReq.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("해당하는 프로젝트가 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        Comment comment = Comment.builder()
                .comment(commentRegisterReq.getComment())
                .user(user)
                .project(project)
                .build();

        commentRepository.save(comment);
    }


    @Override
    @Transactional
    public void deleteComment(int userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.COMMENT_NOT_FOUND, ErrorCode.COMMENT_NOT_FOUND.getMessage()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        if (comment.getUser().getId() != user.getId()) {
            throw new UnauthorizedAccessException(ErrorCode.UNAUTHORIZED_ACCESS, ErrorCode.UNAUTHORIZED_ACCESS.getMessage());
        }

        commentRepository.delete(comment);
    }

    @Override
    public List<CommentRes> getComments(Long projectId) {

        List<Comment> comments = commentRepository.findCommentByProjectId(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.COMMENT_NOT_FOUND, ErrorCode.COMMENT_NOT_FOUND.getMessage()));

        return comments.stream()
                .map(CommentRes::from)
                .collect(Collectors.toList());
    }
}

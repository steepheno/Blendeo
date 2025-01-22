package Blendeo.backend.comment.service;

import Blendeo.backend.comment.dto.CommentRegisterReq;
import Blendeo.backend.comment.entity.Comment;
import Blendeo.backend.comment.repository.CommentRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.exception.InvalidCommentException;
import Blendeo.backend.exception.UnauthorizedAccessException;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;

import jakarta.transaction.Transactional;
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
    public void registerComment(String userEmail, CommentRegisterReq commentRegisterReq) {

        if (commentRegisterReq.getComment() == null || commentRegisterReq.getComment().trim().isEmpty()) {
            throw new InvalidCommentException();
        }

        Project project = projectRepository.findById(commentRegisterReq.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("해당하는 프로젝트가 없습니다."));

        User user = userRepository.findByEmail(userEmail);

        if(user == null) throw new EntityNotFoundException("");

        Comment comment = Comment.builder()
                .comment(commentRegisterReq.getComment())
                .user(user)
                .project(project)
                .build();

        commentRepository.save(comment);
    }


    @Override
    @Transactional
    public void deleteComment(String userEmail, Long commentId) {
        // 댓글 존재 여부 확인
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다: "));

        User user = userRepository.findByEmail(userEmail);

        if(user == null) throw new EntityNotFoundException("");

        if (comment.getUser().getId() != user.getId()) {
            throw new UnauthorizedAccessException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }
}

package Blendeo.backend.comment.repository;

import Blendeo.backend.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<List<Comment>> findCommentByProjectId(Long projectId);

    int countByProjectId(Long projectId);
}

package Blendeo.backend.project.repository;

import Blendeo.backend.project.entity.Like;
import Blendeo.backend.project.entity.LikeId;
import org.springframework.data.repository.CrudRepository;

public interface LikeRepository extends CrudRepository<Like, LikeId> {
    // long countByProjectId(Long projectId);
    // boolean existsByUserIdAndProjectId(Long userId, Long projectId);
}
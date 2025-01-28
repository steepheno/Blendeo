package Blendeo.backend.project.repository;

import Blendeo.backend.project.entity.Likes;
import Blendeo.backend.project.entity.LikeId;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface LikeRepository extends CrudRepository<Likes, LikeId> {
    boolean existsByUserIdAndProjectId(int userId, long projectId);
    void deleteByUserIdAndProjectId(int userId, long projectId);
}
package Blendeo.backend.project.repository;

import Blendeo.backend.project.entity.Likes;
import Blendeo.backend.project.entity.LikeId;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Likes, LikeId> {
    boolean existsByUserIdAndProjectId(int userId, long projectId);
    void deleteByUserIdAndProjectId(int userId, long projectId);

    @Query("SELECT l.project.id FROM Likes l GROUP BY l.project.id ORDER BY COUNT(l.user.id) DESC")
    List<Long> getProjectRanking();

    int countByProjectId(long projectId);
}
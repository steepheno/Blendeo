package Blendeo.backend.project.repository;

import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT new Blendeo.backend.project.dto.ProjectRankRes(p.id, p.title, p.author.id, p.author.nickname) " +
            "FROM Project p " +
            "JOIN p.author " +
            "WHERE p.id IN :projectIds")
     List<ProjectRankRes> findProjectsWithAuthorByIds(@Param("projectIds") List<Long> projectIds);

    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    Page<Project> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.author.id = :userId ORDER BY p.createdAt DESC")
    Page<Project> findByAuthorId(@Param("userId") int userId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p " +
            "JOIN Follow f ON f.followPK.following.id = p.author.id " +
            "WHERE f.followPK.follower.id = :userId " +
            "ORDER BY p.createdAt DESC")
    Page<Project> findByFollowingUserAtDesc(@Param("userId") int userId, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.id IN :ids")
    Page<Project> findAllByIdIn(@Param("ids") List<Long> ids, Pageable pageable);

    @Modifying
    @Query("UPDATE Project p SET p.viewCnt = p.viewCnt + 1 WHERE p.id = :projectId")
    void updateViewCount(@Param("projectId") Long projectId);

    @Query(value = "SELECT p.id FROM Project p ORDER BY p.viewCnt DESC LIMIT 10")
    List<Long> getProjectRankingByViews();

    @Query("select p.author from Project p where p.id= :id")
    Optional<User> findAuthorById(@Param("id") Long id);

    @Query("select count(*) from Project p where p.forkId = :id")
    int findCountByForkId(@Param("id") Long id);
}

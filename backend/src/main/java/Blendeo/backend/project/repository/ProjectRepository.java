package Blendeo.backend.project.repository;

import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.entity.User;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @Query("select id from Project order by id asc")
    List<Long> getAllIds();

    @Query("SELECT p.id FROM Project p")
    List<Long> findAllIds();

    default Optional<Project> findRandomProject() {
        List<Long> ids = findAllIds();
        if (ids.isEmpty()){
            return Optional.empty();
        }

        int randomIndex = ThreadLocalRandom.current().nextInt(ids.size());
        Long randomId = ids.get(randomIndex);

        return findById(randomId);
    }

    @Query(value = """

            WITH RECURSIVE ParentProject AS (
        SELECT id, fork_id, 1 as depth
        FROM project
        WHERE id = :projectId
        UNION ALL
        SELECT p.id, p.fork_id, pp.depth + 1
        FROM project p
        JOIN ParentProject pp ON p.id = pp.fork_id
        WHERE pp.depth < 10  -- 깊이 제한
    ),
    ChildProjects AS (
        SELECT id, 1 as depth
        FROM project
        WHERE fork_id = (SELECT fork_id FROM ParentProject ORDER BY id LIMIT 1)
        UNION ALL
        SELECT p.id, cp.depth + 1
        FROM project p
        JOIN ChildProjects cp ON p.fork_id = cp.id
        WHERE cp.depth < 10  -- 깊이 제한
    )
    SELECT *\s
    FROM project
    WHERE id IN (SELECT id FROM ParentProject
                UNION
                SELECT id FROM ChildProjects)   
    """, nativeQuery = true)
    List<Project> getHierarchy2(@Param("projectId") Long projectId);

}

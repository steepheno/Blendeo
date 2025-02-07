package Blendeo.backend.project.repository;

import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT new Blendeo.backend.project.dto.ProjectRankRes(p.id, p.title, p.author.id, p.author.nickname) " +
            "FROM Project p " +
            "JOIN p.author " +
            "WHERE p.id IN :projectIds")
    List<ProjectRankRes> findProjectsWithAuthorByIds(@Param("projectIds") List<Long> projectIds);
    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    Page<Project> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.id IN :ids")
    List<Project> findAllByIdIn(@Param("ids") List<Long> ids);

    @Modifying
    @Query("UPDATE Project p SET p.viewCnt = p.viewCnt + 1 WHERE p.id = :projectId")
    void updateViewCount(@Param("projectId") Long projectId);

    @Query(value = "SELECT p.id FROM Project p ORDER BY p.viewCnt DESC LIMIT 10")
    List<Long> getProjectRankingByViews();

    @Query("select p.author from Project p where p.id= :id")
    Optional<User> findAuthorById(Long id);
}

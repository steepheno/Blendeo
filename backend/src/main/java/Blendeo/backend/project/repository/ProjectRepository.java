package Blendeo.backend.project.repository;

import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.entity.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT new Blendeo.backend.project.dto.ProjectRankRes(p.id, p.title, p.author.id, p.author.nickname) " +
            "FROM Project p " +
            "JOIN p.author " +
            "WHERE p.id IN :projectIds")
    List<ProjectRankRes> findProjectsWithAuthorByIds(@Param("projectIds") List<Long> projectIds);
}

package Blendeo.backend.search.repository;

import Blendeo.backend.project.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.title LIKE %:title%")
    Page<Project> findByTitleContaining(@Param("title") String title, Pageable pageable);

    @Query("SELECT p From Project p WHERE p.author.nickname LIKE %:nickname% ORDER BY p.createdAt DESC")
    Page<Project> findByAuthorNicknameContaining(@Param("nickname") String nickname, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p " +
            "JOIN ProjectInstrument pi ON p.id = pi.projectId " +
            "WHERE pi.instrument.id IN (SELECT i.id FROM Instrument i WHERE i.name LIKE %:keyword%) " +
            "OR pi.etcInstrument.id IN (SELECT ei.id FROM EtcInstrument ei WHERE ei.name LIKE %:keyword%)")
    Page<Project> findProjectsByInstrumentNameOrEtcInstrumentName(@Param("keyword") String keyword, Pageable pageable);
}

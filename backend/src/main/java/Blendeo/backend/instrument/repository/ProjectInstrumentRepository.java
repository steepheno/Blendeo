package Blendeo.backend.instrument.repository;

import Blendeo.backend.instrument.entity.ProjectInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectInstrumentRepository extends JpaRepository<ProjectInstrument, Integer> {
    List<ProjectInstrument> getAllByProjectId(Long projectId);
}

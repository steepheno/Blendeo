package Blendeo.backend.project.repository;

import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("select p.author from Project p where p.id= :id")
    Optional<User> findAuthorById(Long id);
}

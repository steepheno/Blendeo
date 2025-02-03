package Blendeo.backend.project.repository;

import Blendeo.backend.project.entity.Scrap;
import Blendeo.backend.project.entity.ScrapId;
import Blendeo.backend.user.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScrapRepository extends JpaRepository<Scrap, ScrapId> {
    Optional<List<Scrap>> findAllByUser(User user);
}

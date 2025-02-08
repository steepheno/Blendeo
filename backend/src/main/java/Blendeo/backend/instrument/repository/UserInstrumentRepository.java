package Blendeo.backend.instrument.repository;

import Blendeo.backend.instrument.entity.UserInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInstrumentRepository extends JpaRepository<UserInstrument, Integer> {
    Optional<List<UserInstrument>> getUserInstrumentsByUserId(int userId);
}

package Blendeo.backend.instrument.repository;

import Blendeo.backend.instrument.entity.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, Integer> {
}

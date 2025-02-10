package Blendeo.backend.instrument.repository;

import Blendeo.backend.instrument.entity.EtcInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtcInstrumentRepository extends JpaRepository<EtcInstrument, Integer> {

}

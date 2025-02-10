package Blendeo.backend.instrument.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@RequiredArgsConstructor
public class EtcInstrument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Builder
    public EtcInstrument(int id, String instrument_name) {
        this.id = id;
        this.name = instrument_name;
    }
}

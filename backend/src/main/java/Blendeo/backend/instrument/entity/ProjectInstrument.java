package Blendeo.backend.instrument.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

@Entity
@Getter
public class ProjectInstrument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private long projectId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instrument_id", nullable = true) // 필수 아님
    private Instrument instrument;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etc_id", nullable = true) // 필수 아님
    private EtcInstrument etcInstrument;

    @Builder
    public ProjectInstrument(long projectId, Instrument instrument, EtcInstrument etcInstrument) {
        this.projectId = projectId;
        this.instrument = instrument;
        this.etcInstrument = etcInstrument;
    }

    public ProjectInstrument() {

    }
}

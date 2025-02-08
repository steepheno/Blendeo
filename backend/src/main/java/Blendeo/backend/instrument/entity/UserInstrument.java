package Blendeo.backend.instrument.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class UserInstrument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column
    private int userId;

    @ManyToOne(fetch = FetchType.EAGER) // 데이터를 모든 시점에 가져옴.
    @JoinColumn(name = "instrument_id", nullable = false)
    private Instrument instrument;
    @Builder
    public UserInstrument(int id, int userId, Instrument instrument) {
        this.id = id;
        this.userId = userId;
        this.instrument = instrument;
    }

}

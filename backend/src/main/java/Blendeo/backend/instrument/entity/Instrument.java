package Blendeo.backend.instrument.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Instrument {
    @Id
    private int id;
    @Column
    private String name;

    @Builder
    public Instrument(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

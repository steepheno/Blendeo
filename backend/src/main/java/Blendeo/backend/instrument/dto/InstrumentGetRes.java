package Blendeo.backend.instrument.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class InstrumentGetRes {
    private int instrument_id;
    private String instrument_name;

    @Builder
    public InstrumentGetRes(int instrument_id, String instrument_name) {
        this.instrument_id = instrument_id;
        this.instrument_name = instrument_name;
    }
}

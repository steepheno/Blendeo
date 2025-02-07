package Blendeo.backend.instrument.controller;

import Blendeo.backend.instrument.entity.Instrument;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/instrument")
public class InstrumentController {

    // 악기 조회하기
    @GetMapping("")
    public ResponseEntity<List<Instrument>> getInstruments() {

        return new ResponseEntity<>();
    }
}

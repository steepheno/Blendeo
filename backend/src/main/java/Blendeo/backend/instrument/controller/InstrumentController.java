package Blendeo.backend.instrument.controller;

import Blendeo.backend.instrument.entity.Instrument;
import Blendeo.backend.instrument.service.InstrumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/instrument")
@RequiredArgsConstructor
public class InstrumentController {

    private final InstrumentService instrumentService;

    // 악기 조회하기
    @GetMapping("")
    public ResponseEntity<List<Instrument>> getInstruments() {

        List<Instrument> instruments = instrumentService.getInstruments();
        return new ResponseEntity<>(instruments, HttpStatus.OK);
    }
}

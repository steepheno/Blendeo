package Blendeo.backend.instrument.controller;

import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.Instrument;
import Blendeo.backend.instrument.service.InstrumentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/instrument")
@RequiredArgsConstructor
@Slf4j
public class InstrumentController {

    private final InstrumentService instrumentService;

    // 악기 조회하기
    @GetMapping("")
    public ResponseEntity<List<Instrument>> getInstruments() {

        List<Instrument> instruments = instrumentService.getInstruments();
        return new ResponseEntity<>(instruments, HttpStatus.OK);
    }
}

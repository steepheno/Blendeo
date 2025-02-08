package Blendeo.backend.instrument.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.instrument.dto.UserInstrumentRes;
import Blendeo.backend.instrument.entity.Instrument;
import Blendeo.backend.instrument.entity.UserInstrument;
import Blendeo.backend.instrument.repository.InstrumentRepository;
import Blendeo.backend.instrument.repository.UserInstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstrumentService {

    private final InstrumentRepository instrumentRepository;
    private final UserInstrumentRepository userInstrumentRepository;

    public List<Instrument> getInstruments() {
        return instrumentRepository.findAll();
    }

    public void saveInstrument(int userId, List<Integer> instrumentIds) {
        for (int instrumentId : instrumentIds) {
            System.out.println(instrumentId);
            Instrument instrument = instrumentRepository.findById(instrumentId)
                    .orElseThrow(()->new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND, ErrorCode.ENTITY_NOT_FOUND.getMessage()));
            userInstrumentRepository.save(UserInstrument.builder().userId(userId).instrument(instrument).build());
        }
    }

    public void deleteInstrument(int userId) {
        List<UserInstrument> instruments = userInstrumentRepository.getUserInstrumentsByUserId(userId)
                .orElseThrow(()->new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND, ErrorCode.ENTITY_NOT_FOUND.getMessage()));

        userInstrumentRepository.deleteAll(instruments);
    }

    public List<UserInstrumentRes> getMyFavorite(int userId) {
        List<UserInstrument> userInstruments = userInstrumentRepository.getUserInstrumentsByUserId(userId)
                .orElseThrow(()->new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND, ErrorCode.ENTITY_NOT_FOUND.getMessage()));

        return userInstruments.stream()
                .map(userInstrument ->
                    UserInstrumentRes.builder()
                            .instrument_id(userInstrument.getInstrument().getId())
                            .instrument_name(userInstrument.getInstrument().getName())
                            .build()
                )
                .collect(Collectors.toList());
    }
}

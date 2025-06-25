package Blendeo.backend.instrument.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.Instrument;
import Blendeo.backend.instrument.entity.UserInstrument;
import Blendeo.backend.instrument.repository.EtcInstrumentRepository;
import Blendeo.backend.instrument.repository.InstrumentRepository;
import Blendeo.backend.instrument.repository.UserInstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void updateInstrument(int userId, List<Integer> instrumentIds) {
        deleteInstrument(userId);
        instrumentRepository.flush();

        saveInstrument(userId, instrumentIds);
    }

    public void saveInstrument(int userId, List<Integer> instrumentIds) {
        if ( instrumentIds==null || instrumentIds.isEmpty()) {
            return;
        }
        for (int instrumentId : instrumentIds) {
            Instrument instrument = instrumentRepository.findById(instrumentId)
                    .orElseThrow(()->new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND, ErrorCode.ENTITY_NOT_FOUND.getMessage()));
            userInstrumentRepository.save(UserInstrument.builder().userId(userId).instrument(instrument).build());
        }
    }

    public void deleteInstrument(int userId) {
        List<UserInstrument> instruments = userInstrumentRepository.getUserInstrumentsByUserId(userId)
                .orElseGet(null);

        if (instruments == null) {
            return;
        }
        userInstrumentRepository.deleteAll(instruments);
    }

    public List<InstrumentGetRes> getMyFavoriteInstruments(int userId) {
        List<UserInstrument> userInstruments = userInstrumentRepository.getUserInstrumentsByUserId(userId)
                .orElseThrow(()->new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND, ErrorCode.ENTITY_NOT_FOUND.getMessage()));

        return userInstruments.stream()
                .map(userInstrument ->
                    InstrumentGetRes.builder()
                            .instrument_id(userInstrument.getInstrument().getId())
                            .instrument_name(userInstrument.getInstrument().getName())
                            .build()
                )
                .collect(Collectors.toList());
    }
}

package Blendeo.backend.exception;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;

public class EntityNotFoundException extends BaseException {

    public EntityNotFoundException(String message) {
        super(ErrorCode.ENTITY_NOT_FOUND, message);
    }

    public EntityNotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public EntityNotFoundException() {
        super(ErrorCode.ENTITY_NOT_FOUND, ErrorCode.ENTITY_NOT_FOUND.getMessage());
    }
}

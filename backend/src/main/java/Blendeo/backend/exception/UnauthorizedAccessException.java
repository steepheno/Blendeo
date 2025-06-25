package Blendeo.backend.exception;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;

public class UnauthorizedAccessException extends BaseException {
    public UnauthorizedAccessException(String message) {
        super(ErrorCode.UNAUTHORIZED_ACCESS, message);
    }

    public UnauthorizedAccessException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}

package Blendeo.backend.exception;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends BaseException {
    public EmailAlreadyExistsException() {super(ErrorCode.EMAIL_EXISTS, ErrorCode.EMAIL_EXISTS.getMessage());}
}

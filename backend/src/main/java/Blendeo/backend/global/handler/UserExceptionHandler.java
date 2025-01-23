package Blendeo.backend.global.handler;

import Blendeo.backend.exception.EmailAlreadyExistsException;
import Blendeo.backend.exception.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "Blendeo.backend.user")
public class UserExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<?> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        return ResponseEntity.status(e.getErrorCode()).body(e.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException e) {
        return ResponseEntity.status(e.getErrorCode()).body("해당 유저가 존재하지 않습니다.");
    }
}

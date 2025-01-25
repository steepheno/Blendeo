package Blendeo.backend.global.handler;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.exception.UnauthorizedAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "Blendeo.backend.comment")
public class CommentExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException e) {

        return ResponseEntity.status(e.getErrorCode())
                .body(e.getMessage());
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<String> handleUnauthorizedAccessException(UnauthorizedAccessException e) {

        return ResponseEntity.status(e.getErrorCode())
                .body(e.getMessage());
    }

}

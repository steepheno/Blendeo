package Blendeo.backend.global.handler;

import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.global.error.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "Blendeo.backend.project")
public class ProjectExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        ErrorResponse errorResponse = new ErrorResponse(ErrorCode.ENTITY_NOT_FOUND);

        return new ResponseEntity<>(errorResponse, ErrorCode.ENTITY_NOT_FOUND.getStatus());
    }
}

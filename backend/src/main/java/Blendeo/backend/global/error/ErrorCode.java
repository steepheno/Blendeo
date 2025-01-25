package Blendeo.backend.global.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "Entity not found"),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "Invalid input value"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당하는 유저를 찾을 수 없습니다."),
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당하는 프로젝트를 찾을 수 없습니다."),
    EMAIL_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 이메일입니다.");
    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}

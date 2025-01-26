package Blendeo.backend.global.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "Entity not found"),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "Invalid input value"),
    EMAIL_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 이메일입니다."),
    FOLLOWER_NOT_FOUND(HttpStatus.NOT_FOUND, "팔로워가 존재하지 않습니다."),
    DUPLICATED_FOLLOW(HttpStatus.CONFLICT, "이미 팔로우한 사람입니다.");

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

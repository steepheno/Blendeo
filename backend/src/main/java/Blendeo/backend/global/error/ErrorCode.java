package Blendeo.backend.global.error;

import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties.Http;
import org.springframework.http.HttpStatus;

public enum ErrorCode {
    // Overall
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "접근 권한이 없습니다."),

    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "Entity not found"),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "Invalid input value"),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당하는 유저를 찾을 수 없습니다."),
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당하는 프로젝트를 찾을 수 없습니다."),
    CHATROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "해당하는 채팅방을 찾을 수 없습니다."),
    EMAIL_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 이메일입니다."),

    // Follow
    FOLLOWER_NOT_FOUND(HttpStatus.NOT_FOUND, "팔로워가 존재하지 않습니다."),
    DUPLICATED_FOLLOW(HttpStatus.CONFLICT, "이미 팔로우한 사람입니다."),

    // Comment
    INVALID_COMMENT_CONTENT(HttpStatus.BAD_REQUEST, "댓글 내용은 필수입니다."),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글이 존재하지 않습니다."),
    COMMENT_TOO_LONG(HttpStatus.BAD_REQUEST, "댓글이 최대 길이를 초과했습니다."),

    // Notification
    NOTIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "알림이 존재하지 않습니다."),

    // Scrap
    SCRAP_NOT_FOUND(HttpStatus.NOT_FOUND, "스크랩한 프로젝트가 아닙니다.");
    
    
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

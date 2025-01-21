package Blendeo.backend.global.error;

public enum ErrorCode {
    ENTITY_NOT_FOUND(404, "Entity not found"),
    INVALID_INPUT_VALUE(400, "Invalid input value");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}

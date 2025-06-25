package Blendeo.backend.exception;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;

public class InvalidCommentException extends BaseException {
    public InvalidCommentException(String message) {
        super(ErrorCode.INVALID_COMMENT_CONTENT, message);
    }

    public InvalidCommentException() {
        super(ErrorCode.INVALID_COMMENT_CONTENT, ErrorCode.INVALID_COMMENT_CONTENT.getMessage());
    }
}

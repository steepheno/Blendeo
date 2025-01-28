package Blendeo.backend.exception;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;

public class DuplicatedFollowException extends BaseException {
    public DuplicatedFollowException() {
        super(ErrorCode.DUPLICATED_FOLLOW, ErrorCode.DUPLICATED_FOLLOW.getMessage());
    }
}

package Blendeo.backend.exception;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;

public class FollowerNotFoundException extends BaseException {
    public FollowerNotFoundException() {
        super(ErrorCode.FOLLOWER_NOT_FOUND, ErrorCode.FOLLOWER_NOT_FOUND.getMessage());
    }
}

package Blendeo.backend.user.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
public class FollowingListRes {
    private List<Integer> followingIdList;
    private List<String> followingNicknameList;
    private int followingCount;

    @Builder
    public FollowingListRes(List<Integer> followingIdList, List<String> followingNicknameList, int followingCount) {
        this.followingIdList = followingIdList;
        this.followingNicknameList = followingNicknameList;
        this.followingCount = followingCount;
    }
}

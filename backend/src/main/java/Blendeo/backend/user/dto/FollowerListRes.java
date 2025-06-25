package Blendeo.backend.user.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
public class FollowerListRes {
    // 내가 팔로우한 사람 리스트

    private List<Integer> followerIdList;
    private List<String> followerNicknameList;
    private int followerCount;

    @Builder
    public FollowerListRes(List<Integer> followerIdList, List<String> followerNicknameList, int followerCount) {
        this.followerIdList = followerIdList;
        this.followerNicknameList = followerNicknameList;
        this.followerCount = followerCount;
    }
}

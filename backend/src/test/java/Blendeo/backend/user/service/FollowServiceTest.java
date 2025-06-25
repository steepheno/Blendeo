package Blendeo.backend.user.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import Blendeo.backend.exception.DuplicatedFollowException;
import Blendeo.backend.exception.FollowerNotFoundException;
import Blendeo.backend.user.entity.Follow;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.FollowRepository;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class FollowServiceTest {
    @Mock
    private FollowRepository followRepository;

    @InjectMocks
    private FollowService followService;

    private User follower;
    private User following;
    private Follow follow;

    @BeforeEach
    void setUp() {
        follower = User.builder()
                .id(1)
                .nickname("MS")
                .build();

        following = User.builder()
                .id(2)
                .nickname("YJ")
                .build();

        follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();
    }

    @Test
    @DisplayName("성공적인 follow")
    void success_follow() {
        // given
        when(followRepository.findByFollowPK_FollowerIdAndFollowPK_FollowingId(1, 2))
                .thenReturn(Optional.empty());

        // when
        followService.follow(follower, following);

        // then
        verify(followRepository).save(any(Follow.class));
    }

    @Test
    @DisplayName("중복된 follow를 진행할 시 에러여부")
    void duplicate_follow() {
        // given
        when(followRepository.findByFollowPK_FollowerIdAndFollowPK_FollowingId(1, 2))
                .thenReturn(Optional.of(follow));
        // when && then
        try {
            followService.follow(follower, following);
            Assertions.fail("DuplicatedFollowException");
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof DuplicatedFollowException);
        }
    }

    @Test
    @DisplayName("성공적인 팔로우 끊기")
    void success_unfollow() {
        // given
        when(followRepository.findByFollowPK_FollowerIdAndFollowPK_FollowingId(1, 2))
                .thenReturn(Optional.of(follow));

        // when
        followService.unfollow(follower, following);

        // then
        verify(followRepository).delete(follow);
    }

    @Test
    @DisplayName("팔로우 목록에 없는 팔로우 끊기")
    void unfollow_nonExistentFollower() {
        // given
        when(followRepository.findByFollowPK_FollowerIdAndFollowPK_FollowingId(1, 2))
                .thenReturn(Optional.empty());

        // when & then
        try {
            followService.unfollow(follower, following);
            Assertions.fail("FollowerNotFoundException");
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof FollowerNotFoundException);
        }
    }


}
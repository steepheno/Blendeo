package Blendeo.backend.user.service;

import Blendeo.backend.exception.DuplicatedFollowException;
import Blendeo.backend.exception.FollowerNotFoundException;
import Blendeo.backend.user.entity.Follow;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.FollowRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;


    public void follow(User follower, User following) {
        this.checkDuplicatedFollow(follower.getId(), following.getId());

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();
        followRepository.save(follow);
    }

    public void unfollow(User follower, User following) {
        Follow follow = this.findByFollowerIdAndFollowingId(follower.getId(), following.getId());
        followRepository.delete(follow);
    }

    private void checkDuplicatedFollow(int followerId, int followeeId) {
        Optional<Follow> optionalFollow = followRepository.findByFollowPK_FollowerIdAndFollowPK_FollowingId(followerId,
                followeeId);
        if (optionalFollow.isPresent()) {
            throw new DuplicatedFollowException();
        }
    }

    private Follow findByFollowerIdAndFollowingId(int followerId, int followingId) {
        return followRepository.findByFollowPK_FollowerIdAndFollowPK_FollowingId(followerId, followingId)
                .orElseThrow(FollowerNotFoundException::new);
    }
}

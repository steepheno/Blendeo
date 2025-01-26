package Blendeo.backend.user.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Follow {

    @EmbeddedId
    private FollowPK followPK;

    public User getFollower() {
        return followPK.getFollower();
    }

    public User getFollowing() {
        return followPK.getFollowing();
    }

    @Builder
    public Follow(User follower, User following) {
        this.followPK = new FollowPK(follower, following);

    }

}

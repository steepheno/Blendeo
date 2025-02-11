package Blendeo.backend.user.repository;

import Blendeo.backend.user.entity.Follow;
import Blendeo.backend.user.entity.FollowPK;
import Blendeo.backend.user.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowPK> {
    Optional<Follow> findByFollowPK_FollowerIdAndFollowPK_FollowingId(int followerId, int followingId);

    List<Follow> findAllByFollowPK_Follower(User follower);

    List<Follow> findAllByFollowPK_Following(User following);
}

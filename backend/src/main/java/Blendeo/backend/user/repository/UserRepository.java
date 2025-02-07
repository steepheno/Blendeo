package Blendeo.backend.user.repository;

import Blendeo.backend.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URL;
import java.util.Optional;

@RequestMapping
public interface UserRepository extends JpaRepository<User, Integer> { // 사용할 Entity, PK(ID) 데이터 타입
    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.nickname = :nickname, u.profileImage = :profileImage WHERE u.id = :id")
    void updateUser(@Param("id") int id, @Param("nickname") String nickname, @Param("profileImage") URL profileImage);

    boolean existsByEmail(String email);
}

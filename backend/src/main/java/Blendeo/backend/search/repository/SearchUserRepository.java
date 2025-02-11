package Blendeo.backend.search.repository;

import Blendeo.backend.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchUserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.nickname LIKE %:nickname%")
    Page<User> findByNicknameContaining(@Param("nickname") String nickname, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.email LIKE :email%")
    Page<User> findByEmailContaining(@Param("email") String email, Pageable pageable);
}

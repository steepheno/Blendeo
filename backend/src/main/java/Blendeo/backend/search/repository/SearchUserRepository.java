package Blendeo.backend.search.repository;

import Blendeo.backend.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchUserRepository extends JpaRepository<User, Integer> {
    Page<User> findByNicknameContaining(String nickname, Pageable pageable);
}

package Blendeo.backend.user.repository;

import Blendeo.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@RequestMapping
public interface UserRepository extends JpaRepository<User, Integer> { // 사용할 Entity, PK(ID) 데이터 타입
    User findByEmail(String email);
}

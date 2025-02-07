package Blendeo.backend.chat.repoository;

import Blendeo.backend.chat.entity.ChatMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessages, Long> {
    List<ChatMessages> findByChatRoomIdOrderByCreatedAtDesc(Long chatRoomId);
}
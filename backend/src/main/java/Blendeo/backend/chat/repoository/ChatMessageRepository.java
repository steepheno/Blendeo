package Blendeo.backend.chat.repoository;

import Blendeo.backend.chat.entity.ChatMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessages, Long> {

    @Query("""
        SELECT new ChatMessages(id, chatRoomId, userId, content, createdAt) FROM ChatMessages
        WHERE chatRoomId = :chatRoomId
        ORDER BY createdAt DESC
""")
    List<ChatMessages> findByChatRoomIdOrderByCreatedAtDesc(@Param("chatRoomId") Long chatRoomId);
}
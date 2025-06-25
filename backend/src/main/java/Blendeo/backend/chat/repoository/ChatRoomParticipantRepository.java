package Blendeo.backend.chat.repoository;

import Blendeo.backend.chat.dto.ChatRoomPariticipantRes;
import Blendeo.backend.chat.entity.ChatRoom;
import Blendeo.backend.chat.entity.ChatRoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomParticipantRepository extends JpaRepository<ChatRoomParticipant, Long> {
    List<ChatRoomParticipant> findByChatRoomId(Long chatRoomId);
    boolean existsByChatRoomIdAndUserId(Long chatRoomId, Integer userId);

    List<ChatRoomParticipant> findByUserId(int userId);

    Optional<List<ChatRoomParticipant>> findAllByChatRoomId(Long roomId);

    @Query("SELECT DISTINCT c.chatRoomId FROM ChatRoomParticipant c")
    List<Long> findDistinctChatRoomIds();

    @Query("SELECT c.user.id FROM ChatRoomParticipant c WHERE c.chatRoomId = :chatRoomId")
    List<Integer> findUserIdsByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
package Blendeo.backend.notification.repository;

import Blendeo.backend.notification.dto.NotificationRes;
import Blendeo.backend.notification.entity.Notification;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.receiver.id = :userId")
    List<Notification> findAllByUserId(@Param("userId") int userId);

    @Query("SELECT n FROM Notification n WHERE n.createdAt >= :startDate AND n.createdAt <= :endDate AND n.receiver.id = :userId")
    List<Notification> findAllByUserIdAWithWeek(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("userId") int userId
    );
}

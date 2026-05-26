package cm.keycebet.sports.repository;

import cm.keycebet.common.enums.EventStatus;
import cm.keycebet.sports.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    Page<Event> findByLeagueIdAndStatusAndStartTimeBetween(
            Long leagueId, EventStatus status,
            LocalDateTime from, LocalDateTime to,
            Pageable pageable);

    @Query("SELECT e FROM Event e WHERE " +
           "(:leagueId IS NULL OR e.league.id = :leagueId) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:from IS NULL OR e.startTime >= :from) AND " +
           "(:to IS NULL OR e.startTime <= :to)")
    Page<Event> findFiltered(
            @Param("leagueId") Long leagueId,
            @Param("status")   EventStatus status,
            @Param("from")     LocalDateTime from,
            @Param("to")       LocalDateTime to,
            Pageable pageable);
}

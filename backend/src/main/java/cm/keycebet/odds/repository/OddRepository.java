package cm.keycebet.odds.repository;

import cm.keycebet.odds.entity.Odd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OddRepository extends JpaRepository<Odd, Long> {

    List<Odd> findByEventIdAndIsActiveTrueOrderByMarketTypeAscSelectionAsc(Long eventId);

    List<Odd> findByEventId(Long eventId);
}

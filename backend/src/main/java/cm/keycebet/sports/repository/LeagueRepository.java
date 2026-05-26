package cm.keycebet.sports.repository;

import cm.keycebet.sports.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {
    List<League> findBySportIdAndIsActiveTrueOrderByNameAsc(Long sportId);
    List<League> findByIsActiveTrueOrderByNameAsc();
}

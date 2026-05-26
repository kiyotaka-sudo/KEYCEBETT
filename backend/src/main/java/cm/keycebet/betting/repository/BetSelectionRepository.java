package cm.keycebet.betting.repository;

import cm.keycebet.betting.entity.BetSelection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BetSelectionRepository extends JpaRepository<BetSelection, Long> {
}

package cm.keycebet.betting.repository;

import cm.keycebet.betting.entity.Bet;
import cm.keycebet.common.enums.BetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BetRepository extends JpaRepository<Bet, UUID> {

    Page<Bet> findByUserId(UUID userId, Pageable pageable);

    Page<Bet> findByStatus(BetStatus status, Pageable pageable);

    long countByStatus(BetStatus status);
}

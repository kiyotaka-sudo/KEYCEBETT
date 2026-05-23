package cm.keycebet.casino.repository;

import cm.keycebet.casino.entity.CasinoGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasinoGameRepository extends JpaRepository<CasinoGame, Long> {
    List<CasinoGame> findAllByOrderByDisplayOrderAsc();
}

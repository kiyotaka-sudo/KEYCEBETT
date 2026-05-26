package cm.keycebet.betting.service;

import cm.keycebet.common.exception.BetNotAllowedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
public class BetCalculatorService {

    @Value("${app.min-bet:100}")
    private BigDecimal minBet;

    @Value("${app.max-bet:500000}")
    private BigDecimal maxBet;

    @Value("${app.max-win:10000000}")
    private BigDecimal maxWin;

    @Value("${app.max-selections:15}")
    private int maxSelections;

    /**
     * Calcule la cote totale d'un pari combiné.
     * Pari simple  → cote = cote unique
     * Pari combiné → cote = cote1 × cote2 × ... × coteN
     */
    public BigDecimal calculateTotalOdds(List<BigDecimal> oddValues) {
        return oddValues.stream()
                .reduce(BigDecimal.ONE, BigDecimal::multiply)
                .setScale(3, RoundingMode.HALF_UP);
    }

    /**
     * Calcule le gain potentiel : mise × cote totale
     */
    public BigDecimal calculatePotentialWin(BigDecimal stake, BigDecimal totalOdds) {
        return stake.multiply(totalOdds).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Valide les règles métier avant d'accepter un pari.
     */
    public void validateBet(BigDecimal stake, BigDecimal potentialWin, int selectionCount) {
        if (stake.compareTo(minBet) < 0) {
            throw new BetNotAllowedException(
                    String.format("La mise minimum est de %s FCFA", minBet.toPlainString()));
        }
        if (stake.compareTo(maxBet) > 0) {
            throw new BetNotAllowedException(
                    String.format("La mise maximum est de %s FCFA", maxBet.toPlainString()));
        }
        if (potentialWin.compareTo(maxWin) > 0) {
            throw new BetNotAllowedException(
                    String.format("Le gain maximum autorisé est de %s FCFA", maxWin.toPlainString()));
        }
        if (selectionCount > maxSelections) {
            throw new BetNotAllowedException(
                    String.format("Maximum %d sélections pour un pari combiné", maxSelections));
        }
    }
}

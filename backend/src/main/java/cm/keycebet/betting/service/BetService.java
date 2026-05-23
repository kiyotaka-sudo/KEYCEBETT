package cm.keycebet.betting.service;

import cm.keycebet.betting.dto.BetDto;
import cm.keycebet.betting.dto.BetMapper;
import cm.keycebet.betting.dto.BetRequest;
import cm.keycebet.betting.entity.Bet;
import cm.keycebet.betting.entity.BetSelection;
import cm.keycebet.betting.repository.BetRepository;
import cm.keycebet.common.enums.BetStatus;
import cm.keycebet.common.enums.BetType;
import cm.keycebet.common.enums.EventStatus;
import cm.keycebet.common.exception.BetNotAllowedException;
import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.notification.service.NotificationService;
import cm.keycebet.odds.entity.Odd;
import cm.keycebet.odds.repository.OddRepository;
import cm.keycebet.user.entity.User;
import cm.keycebet.user.repository.UserRepository;
import cm.keycebet.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BetService {

    private final BetRepository       betRepository;
    private final OddRepository       oddRepository;
    private final UserRepository      userRepository;
    private final WalletService       walletService;
    private final BetCalculatorService calculator;
    private final BetMapper           betMapper;
    private final NotificationService notificationService;

    @Transactional
    public BetDto placeBet(BetRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));

        // Charger et valider les cotes
        List<Odd> odds = loadAndValidateOdds(request.getOddIds());

        // Calculer les cotes et gains
        List<BigDecimal> oddValues = odds.stream().map(Odd::getValue).toList();
        BigDecimal totalOdds    = calculator.calculateTotalOdds(oddValues);
        BigDecimal potentialWin = calculator.calculatePotentialWin(request.getStake(), totalOdds);

        // Valider les règles métier
        calculator.validateBet(request.getStake(), potentialWin, odds.size());

        // Déterminer type de pari
        BetType type = (odds.size() == 1) ? BetType.SIMPLE : BetType.COMBINED;

        // Déduire la mise du solde (crée une Transaction BET_STAKE)
        walletService.deductForBet(user, request.getStake());

        // Créer le pari
        Bet bet = Bet.builder()
                .user(user)
                .type(type)
                .totalStake(request.getStake())
                .totalOdds(totalOdds)
                .potentialWin(potentialWin)
                .build();

        // Créer les sélections
        List<BetSelection> selections = odds.stream().map(odd ->
                BetSelection.builder()
                        .bet(bet)
                        .odd(odd)
                        .oddValueAtBetTime(odd.getValue())
                        .build()
        ).collect(Collectors.toList());

        bet.setSelections(selections);
        Bet saved = betRepository.save(bet);

        log.info("Pari placé — user={} type={} stake={} odds={} win={}",
                email, type, request.getStake(), totalOdds, potentialWin);

        BetDto dto = betMapper.toDto(saved);
        notificationService.notifyBetPlaced(dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<BetDto> getMyBets(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));
        return betRepository.findByUserId(user.getId(), pageable).map(betMapper::toDto);
    }

    @Transactional(readOnly = true)
    public BetDto getBetById(UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pari", id));
        // Sécurité : un user ne peut voir que ses propres paris (sauf admin)
        if (!bet.getUser().getEmail().equals(email)) {
            throw new BetNotAllowedException("Accès refusé à ce pari");
        }
        return betMapper.toDto(bet);
    }

    @Transactional
    public BetDto cashOut(UUID id) {
        // STUB — logique de cashout à implémenter
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pari", id));
        if (bet.getStatus() != BetStatus.PENDING) {
            throw new BetNotAllowedException("Le cashout n'est possible que sur les paris en cours");
        }
        log.info("[STUB] Cashout demandé pour le pari {}", id);
        throw new BetNotAllowedException("Le cashout sera disponible prochainement");
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<BetDto> getAllBets(Pageable pageable) {
        return betRepository.findAll(pageable).map(betMapper::toDto);
    }

    @Transactional
    public BetDto settleBet(UUID id, BetStatus newStatus) {
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pari", id));

        if (bet.getStatus() != BetStatus.PENDING) {
            throw new BetNotAllowedException("Ce pari a déjà été réglé");
        }

        bet.setStatus(newStatus);
        bet.setSettledAt(LocalDateTime.now());

        if (newStatus == BetStatus.WON) {
            walletService.creditWin(bet.getUser(), bet.getPotentialWin());
        }

        Bet saved = betRepository.save(bet);
        BetDto dto = betMapper.toDto(saved);
        notificationService.notifyBetSettled(dto);
        return dto;
    }

    // ─── Utilitaires privés ───────────────────────────────────────────────────

    private List<Odd> loadAndValidateOdds(List<Long> oddIds) {
        List<Odd> odds = oddRepository.findAllById(oddIds);

        if (odds.size() != oddIds.size()) {
            throw new BetNotAllowedException("Une ou plusieurs cotes sont introuvables");
        }

        // Vérifier unicité des oddIds (pas de doublon)
        Set<Long> uniqueIds = new HashSet<>(oddIds);
        if (uniqueIds.size() != oddIds.size()) {
            throw new BetNotAllowedException("Vous ne pouvez pas sélectionner la même cote plusieurs fois");
        }

        // Vérifier que les cotes sont actives
        odds.forEach(odd -> {
            if (!odd.isActive()) {
                throw new BetNotAllowedException(
                        "La cote " + odd.getId() + " n'est plus disponible");
            }
            // Vérifier que l'événement est UPCOMING ou LIVE
            EventStatus eventStatus = odd.getEvent().getStatus();
            if (eventStatus != EventStatus.UPCOMING && eventStatus != EventStatus.LIVE) {
                throw new BetNotAllowedException(
                        "L'événement '" + odd.getEvent().getHomeTeam() +
                        " vs " + odd.getEvent().getAwayTeam() + "' n'accepte plus de paris");
            }
        });

        // Vérifier qu'on n'a pas 2 sélections du même événement (pari combiné)
        if (odds.size() > 1) {
            Set<Long> eventIds = odds.stream()
                    .map(o -> o.getEvent().getId())
                    .collect(Collectors.toSet());
            if (eventIds.size() != odds.size()) {
                throw new BetNotAllowedException(
                        "Vous ne pouvez pas sélectionner deux cotes du même événement dans un combiné");
            }
        }

        return odds;
    }
}

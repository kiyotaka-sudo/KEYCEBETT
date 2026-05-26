package cm.keycebet.wallet.repository;

import cm.keycebet.wallet.entity.Transaction;
import cm.keycebet.common.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Page<Transaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Transaction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /** Retrouve une transaction par notre référence interne (ex: DEP-A1B2C3D4) */
    Optional<Transaction> findByReference(String reference);

    /** Retrouve une transaction par le paymentId MonetBil */
    Optional<Transaction> findByPaymentId(String paymentId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.type = :type AND t.status = 'COMPLETED' " +
           "AND t.createdAt BETWEEN :from AND :to")
    BigDecimal sumByTypeAndPeriod(@Param("type")  TransactionType type,
                                  @Param("from")  LocalDateTime from,
                                  @Param("to")    LocalDateTime to);
}

package cm.keycebet.wallet.controller;

import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.wallet.dto.*;
import cm.keycebet.wallet.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
@Tag(name = "Portefeuille", description = "Gestion du solde et des transactions (MTN / Orange Money via MonetBil)")
@SecurityRequirement(name = "bearerAuth")
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance")
    @Operation(summary = "Obtenir le solde du portefeuille")
    public ResponseEntity<ApiResponse<WalletDto>> getBalance() {
        return ResponseEntity.ok(ApiResponse.success(walletService.getBalance()));
    }

    @GetMapping("/transactions")
    @Operation(summary = "Historique des transactions")
    public ResponseEntity<ApiResponse<Page<TransactionDto>>> getTransactions(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(walletService.getMyTransactions(pageable)));
    }

    @PostMapping("/deposit")
    @Operation(
        summary = "Initier un dépôt via MonetBil",
        description = "Envoie une demande de paiement à l'utilisateur via MTN Mobile Money ou Orange Money. " +
                      "La transaction est créée en PENDING et finalisée par le webhook MonetBil."
    )
    public ResponseEntity<ApiResponse<TransactionDto>> deposit(
            @Valid @RequestBody DepositRequest request) {
        TransactionDto tx = walletService.deposit(request);
        String message = tx.getStatus().name().equals("FAILED")
                ? "Échec de l'initiation du dépôt. Vérifiez votre numéro et réessayez."
                : "Dépôt initié ! Confirmez sur votre téléphone (" + request.getProvider() + ").";
        return ResponseEntity.ok(ApiResponse.success(message, tx));
    }

    @PostMapping("/withdraw")
    @Operation(
        summary = "Initier un retrait via MonetBil",
        description = "Transfère des fonds vers le numéro Mobile Money de l'utilisateur. " +
                      "Le solde est réservé immédiatement et libéré en cas d'échec."
    )
    public ResponseEntity<ApiResponse<TransactionDto>> withdraw(
            @Valid @RequestBody WithdrawRequest request) {
        TransactionDto tx = walletService.withdraw(request);
        String message = tx.getStatus().name().equals("FAILED")
                ? "Échec de l'initiation du retrait. Votre solde a été restitué."
                : "Retrait en cours vers votre " + request.getProvider() + ". Vous recevrez les fonds sous peu.";
        return ResponseEntity.ok(ApiResponse.success(message, tx));
    }

    @GetMapping("/check-payment/{reference}")
    @Operation(
        summary = "Vérifier le statut d'un paiement",
        description = "Interroge MonetBil pour connaître le statut actuel d'une transaction. " +
                      "Utile en mode polling quand les webhooks ne sont pas disponibles (développement local)."
    )
    public ResponseEntity<ApiResponse<TransactionDto>> checkPayment(
            @PathVariable String reference) {
        TransactionDto tx = walletService.checkPaymentStatus(reference);
        return ResponseEntity.ok(ApiResponse.success(tx));
    }
}

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
@Tag(name = "Portefeuille", description = "Gestion du solde et des transactions")
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
    @Operation(summary = "Initier un dépôt (STUB — Ami 1)")
    public ResponseEntity<ApiResponse<TransactionDto>> deposit(
            @Valid @RequestBody DepositRequest request) {
        TransactionDto tx = walletService.deposit(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Dépôt initié. En attente de confirmation du provider.", tx));
    }

    @PostMapping("/withdraw")
    @Operation(summary = "Initier un retrait (STUB — Ami 1)")
    public ResponseEntity<ApiResponse<TransactionDto>> withdraw(
            @Valid @RequestBody WithdrawRequest request) {
        TransactionDto tx = walletService.withdraw(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Retrait initié. En attente de traitement.", tx));
    }
}

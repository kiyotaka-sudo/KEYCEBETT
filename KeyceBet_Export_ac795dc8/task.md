# Tâches — Intégration Paiement MonetBil

## Backend
- [x] `pom.xml` — WebFlux/WebClient ajouté
- [x] `application.yml` — config MonetBil (service-key, notify-url...)
- [x] `.env.example` — variables MONETBIL_SERVICE_KEY, APP_BASE_URL
- [x] `MonetBilProperties.java` — @ConfigurationProperties créé
- [x] `MonetBilPaymentResponse.java` — DTO réponse MonetBil
- [x] `MonetBilWebhookPayload.java` — DTO webhook créé
- [x] `MonetBilClient.java` — client HTTP (placePayment + checkPayment)
- [x] `MonetBilException.java` — exception dédiée
- [x] `PaymentWebhookController.java` — endpoint webhook public
- [x] `WalletService.java` — stubs remplacés par vraie logique MonetBil
- [x] `WalletController.java` — endpoint check-payment ajouté
- [x] `TransactionRepository.java` — findByReference + findByPaymentId
- [x] `Transaction.java` — champ paymentId ajouté
- [x] `TransactionDto.java` — champ paymentId ajouté
- [x] `SecurityConfig.java` — webhook + check-payment autorisés
- [x] `GlobalExceptionHandler.java` — handler MonetBilException (HTTP 502)
- [x] `BetpawaApplication.java` — @EnableConfigurationProperties
- [x] `V7__add_payment_id_to_transactions.sql` — migration Flyway

## Frontend
- [x] `wallet.types.ts` — PaymentProvider strict, paymentId dans Transaction
- [x] `wallet.service.ts` — checkPayment + deposit/withdraw retournent ApiResponse
- [x] `useWallet.ts` — useInvalidateWallet, hooks adaptés
- [x] `DepositForm.tsx` — UI riche MTN/Orange + polling auto
- [x] `WithdrawForm.tsx` — UI riche MTN/Orange + polling auto + solde après retrait

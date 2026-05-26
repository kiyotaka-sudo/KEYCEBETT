# Intégration Paiements — Orange Money, MTN Money & MonetBil

## Contexte

Le projet **KeyceBet** dispose déjà d'un squelette wallet complet (entité `Transaction`, service, controller, DTOs) avec des méthodes `deposit()` et `withdraw()` marquées `STUB`. L'objectif est de remplacer ces stubs par une intégration réelle via l'**API MonetBil v1**, qui agit comme agrégateur pour **MTN Mobile Money** (`CM_MTNMOBILEMONEY`) et **Orange Money** (`CM_ORANGEMONEY`) au Cameroun.

## Architecture du flux de paiement

```
Frontend              Backend                     MonetBil API
  │                     │                               │
  │─ POST /deposit ─────►│                               │
  │                     │── POST /placePayment ─────────►│
  │                     │◄─ { paymentId, status } ───────│
  │◄── { ref, PENDING } ─│                               │
  │                     │                               │
  │                     │◄─ POST /webhook/monetbil ─────│
  │                     │   (notify_url callback)       │
  │                     │── Met à jour statut + solde    │
  │                     │── Notifie frontend via WS      │
```

> [!IMPORTANT]
> MonetBil gère MTN et Orange Money via **un seul endpoint**. On envoie `operator: CM_MTNMOBILEMONEY` ou `CM_ORANGEMONEY` selon le choix de l'utilisateur.

## Open Questions

> [!WARNING]
> **Clés API MonetBil** : Il vous faudra créer un compte sur [monetbil.com](https://monetbil.com) et obtenir votre `service_key`. En dev, une sandbox est disponible.

> [!NOTE]
> **URL du webhook** : En développement local, MonetBil ne peut pas contacter `localhost`. Il faudra utiliser **ngrok** ou déployer sur Render pour tester les webhooks réels. Pour l'instant, on expose également un endpoint `/wallet/check-payment/{paymentId}` permettant de vérifier le statut manuellement (polling).

## Modifications proposées

---

### 🔧 Backend — `pom.xml`

#### [MODIFY] [pom.xml](file:///e:/Repository/KEYCEBETT/backend/pom.xml)
- Ajouter la dépendance `spring-boot-starter-webflux` (ou `RestClient` de Spring 6) pour appeler l'API MonetBil de façon non-bloquante.

---

### 🔧 Backend — Configuration

#### [MODIFY] [application.yml](file:///e:/Repository/KEYCEBETT/backend/src/main/resources/application.yml)
Ajouter les propriétés :
```yaml
monetbil:
  service-key: ${MONETBIL_SERVICE_KEY:your_test_key}
  api-url: https://api.monetbil.com/payment/v1
  notify-url: ${APP_BASE_URL:http://localhost:8080}/api/wallet/webhook/monetbil
```

#### [MODIFY] [.env.example](file:///e:/Repository/KEYCEBETT/backend/.env.example)
```
MONETBIL_SERVICE_KEY=your_monetbil_service_key_here
APP_BASE_URL=https://your-app.onrender.com
```

---

### 🔧 Backend — Package `wallet/payment`

#### [NEW] `MonetBilProperties.java`
Bean `@ConfigurationProperties` pour lire les propriétés `monetbil.*`.

#### [NEW] `MonetBilClient.java`
Service dédié à l'appel HTTP vers MonetBil :
- `initiatePayment(amount, phone, operator, paymentRef, notifyUrl)` → appelle `POST /placePayment`, retourne `paymentId`
- `checkPayment(paymentId)` → appelle `POST /checkPayment`, retourne le statut courant

#### [NEW] `PaymentWebhookController.java`
Endpoint public (exclu de Spring Security) :
- `POST /wallet/webhook/monetbil` — reçoit la notification MonetBil
- Valide la requête, met à jour le statut de la transaction, crédite/débite le solde
- Notifie le frontend via WebSocket si besoin

---

### 🔧 Backend — Modifications WalletService

#### [MODIFY] [WalletService.java](file:///e:/Repository/KEYCEBETT/backend/src/main/java/cm/keycebet/wallet/service/WalletService.java)
- `deposit()` : appelle `MonetBilClient.initiatePayment()` avec `CM_MTNMOBILEMONEY` ou `CM_ORANGEMONEY`, sauvegarde le `paymentId` dans `metadata`
- `withdraw()` : même logique, opérateur inverse (paiement sortant vers le téléphone)
- `[NEW] processWebhookNotification(Map<String,String> params)` : met à jour la transaction et le solde selon le statut MonetBil
- `[NEW] checkAndSyncPayment(String paymentRef)` : endpoint de polling manuel

---

### 🔧 Backend — TransactionDto + Webhook DTO

#### [MODIFY] [TransactionDto.java](file:///e:/Repository/KEYCEBETT/backend/src/main/java/cm/keycebet/wallet/dto/TransactionDto.java)
- Ajouter `paymentUrl` (optionnel) pour redirection si MonetBil en retourne une

#### [NEW] `MonetBilWebhookDto.java`
DTO capturant les paramètres du webhook : `status`, `payment_ref`, `transaction_id`, `amount`, `phone`, `operator`

---

### 🔧 Backend — SecurityConfig

#### [MODIFY] [SecurityConfig.java](file:///e:/Repository/KEYCEBETT/backend/src/main/java/cm/keycebet/config/SecurityConfig.java)
- Permettre l'accès public à `POST /api/wallet/webhook/monetbil`
- Permettre l'accès public à `GET /api/wallet/check-payment/**` (polling)

---

### 🔧 Backend — Migration Flyway

#### [NEW] `V7__add_payment_id_to_transactions.sql`
```sql
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON transactions(payment_id);
```

---

### 🎨 Frontend — Composants Wallet

#### [MODIFY] [DepositForm.tsx](file:///e:/Repository/KEYCEBETT/frontend/src/components/wallet/DepositForm.tsx)
- Sélecteur de provider visuellement distinctif avec icônes MTN (jaune) et Orange Money (orange)
- Formatage automatique du numéro au format `+237XXXXXXXXX`
- Affichage du statut de paiement après soumission (PENDING → polling → COMPLETED)
- Feedback temps réel avec animation de chargement

#### [MODIFY] [WithdrawForm.tsx](file:///e:/Repository/KEYCEBETT/frontend/src/components/wallet/WithdrawForm.tsx)
- Même sélecteur provider
- Validation montant min 1 000 XAF
- Affichage du statut post-soumission

#### [MODIFY] [wallet.types.ts](file:///e:/Repository/KEYCEBETT/frontend/src/types/wallet.types.ts)
- Ajouter `paymentUrl?`, `paymentId?` à `Transaction`
- Typage strict pour `provider`: `'MTN_MOMO' | 'ORANGE_MONEY'`

#### [MODIFY] [wallet.service.ts](file:///e:/Repository/KEYCEBETT/frontend/src/services/wallet.service.ts)
- Ajouter `checkPayment(paymentRef: string)` pour polling

---

## Plan de vérification

### Tests automatiques
- Build Maven : `mvn clean package -DskipTests` (vérifie la compilation)
- Les webhooks MonetBil seront testés via ngrok en dev

### Vérification manuelle
1. Lancer le backend et le frontend en dev
2. Se connecter, aller sur Wallet → Dépôt
3. Choisir MTN ou Orange, entrer un montant et un numéro de test MonetBil sandbox
4. Vérifier que la transaction est créée en `PENDING`
5. Simuler le webhook MonetBil (curl POST) pour confirmer la mise à jour vers `COMPLETED` et le crédit du solde
6. Vérifier le retrait de la même façon

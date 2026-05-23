# 🎯 Keyce Bet — Plateforme de Paris Sportifs

> Application de paris sportifs production-ready pour le Cameroun, avec casino placeholder.

---

## 🛠️ Stack Technique

| Technologie | Version |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Security | 6 + JWT (jjwt 0.12) |
| Spring Data JPA + Hibernate | Inclus Spring Boot |
| Spring WebSocket + STOMP | Inclus Spring Boot |
| PostgreSQL | 15 |
| Redis | 7 |
| Flyway | Migrations SQL |
| Lombok + MapStruct | Génération de code |
| OpenAPI/Swagger UI | Documentation API |

---

## 🚀 Démarrage rapide

### Prérequis
- Docker Desktop
- Java 17 (optionnel si tout dans Docker)
- Maven 3.9 (optionnel si tout dans Docker)

### Option 1 — Tout dans Docker (recommandé)

```bash
# Cloner et se placer à la racine
cd KEYCEBET

# Copier les variables d'environnement
cp backend/.env.example backend/.env

# Éditer backend/.env et renseigner JWT_SECRET (obligatoire)
# Générer un secret : openssl rand -base64 64

# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend
```

### Option 2 — Backend local + Docker pour les services

```bash
# Démarrer uniquement PostgreSQL et Redis
docker-compose up -d postgres redis

# Lancer le backend en mode dev
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## 🔗 URLs utiles

| Service | URL |
|---|---|
| API Backend | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/api/swagger-ui.html |
| Health Check | http://localhost:8080/api/actuator/health |

---

## 🔐 Compte Admin par défaut

| Champ | Valeur |
|---|---|
| Email | `mbargaernest80@gmail.com` |
| Password | `Nash_2006` |

> Le compte admin est créé **automatiquement** au premier démarrage par `DataInitializer.java`.
> Les credentials peuvent être surchargés via les variables `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env`.

---

## 📂 Structure du projet

```
backend/
├── pom.xml
├── Dockerfile
├── .env.example
└── src/main/
    ├── java/cm/keycebet/
    │   ├── KeycebetApplication.java
    │   ├── config/          (Security, JWT, Redis, WebSocket, Swagger, CORS, DataInitializer)
    │   ├── auth/            (register, login, refresh-token, logout)
    │   ├── user/            (profil, mot de passe)
    │   ├── sports/          (sports, leagues, events)
    │   ├── odds/            (cotes avec cache Redis)
    │   ├── betting/         (paris simple/combiné, calculator)
    │   ├── wallet/          (solde, dépôt/retrait STUB)
    │   ├── casino/          (jeux comingSoon)
    │   ├── dashboard/       (admin: stats, revenue)
    │   ├── notification/    (WebSocket async)
    │   └── common/          (exceptions, ApiResponse, enums)
    └── resources/
        ├── application.yml
        ├── application-dev.yml
        ├── application-prod.yml
        └── db/migration/    (V1 → V6 Flyway)
```

---

## 📡 Endpoints API

### 🔓 Public
| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh-token` | Rafraîchir le token |
| POST | `/api/auth/logout` | Déconnexion |
| GET | `/api/sports` | Liste des sports |
| GET | `/api/leagues?sportId=` | Ligues par sport |
| GET | `/api/events?leagueId=&status=&date=` | Événements filtrés |
| GET | `/api/events/{id}` | Détail événement |
| GET | `/api/events/{id}/odds` | Cotes d'un événement |
| GET | `/api/events/live` | Live (stub — Ami 2) |
| GET | `/api/events/results` | Résultats (stub — Ami 2) |
| GET | `/api/casino/games` | Jeux casino |

### 🔐 Authentifié (Bearer token)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | Mon profil |
| PUT | `/api/users/me` | Modifier le profil |
| PUT | `/api/users/me/password` | Changer le mot de passe |
| POST | `/api/bets` | Placer un pari |
| GET | `/api/bets/my` | Mes paris |
| GET | `/api/bets/{id}` | Détail d'un pari |
| POST | `/api/bets/{id}/cashout` | Cashout (stub) |
| GET | `/api/wallet/balance` | Solde |
| GET | `/api/wallet/transactions` | Historique |
| POST | `/api/wallet/deposit` | Dépôt (stub — Ami 1) |
| POST | `/api/wallet/withdraw` | Retrait (stub — Ami 1) |

### 👑 Admin uniquement
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Stats globales |
| GET | `/api/dashboard/revenue?period=` | Revenus (day/week/month/year) |
| GET | `/api/admin/users` | Tous les utilisateurs |
| PUT | `/api/admin/users/{id}/status` | Activer/Désactiver user |
| GET | `/api/admin/bets` | Tous les paris |
| PUT | `/api/admin/bets/{id}/settle` | Régler un pari |
| GET | `/api/admin/transactions` | Toutes les transactions |
| POST | `/api/admin/events` | Créer un événement |
| PUT | `/api/admin/events/{id}` | Mettre à jour un événement |
| POST | `/api/admin/odds` | Créer/Mettre à jour une cote |

---

## 📡 WebSocket (STOMP)

```javascript
// Connexion
const client = new Client({ brokerURL: 'ws://localhost:8080/api/ws' });

// S'abonner aux résultats globaux
client.subscribe('/topic/bet-results', (msg) => console.log(msg.body));

// S'abonner aux cotes d'un événement
client.subscribe('/topic/odds/42', (msg) => console.log(msg.body));

// S'abonner à ses propres paris (auth requis)
client.subscribe('/user/queue/bets', (msg) => console.log(msg.body));
```

---

## 💰 Règles Métier

| Règle | Valeur |
|---|---|
| Mise minimum | 100 FCFA |
| Mise maximum | 500 000 FCFA |
| Gain maximum | 10 000 000 FCFA |
| Sélections max (combiné) | 15 |
| Deux sélections même match | ❌ Interdit |
| Pari sur match FINISHED/CANCELLED | ❌ Interdit |

---

## 🔌 Intégrations à implémenter

### AMI 1 — Paiement Mobile Money

Fichier : `WalletService.java` (méthodes `deposit()` et `withdraw()`)

```bash
PAYMENT_API_KEY=votre_clé_api
PAYMENT_API_URL=https://api.provider.cm
```
Providers cibles : **MTN Mobile Money**, **Orange Money Cameroun**

### AMI 2 — API Résultats Sportifs

Fichier : `EventService.java` (méthodes `getLiveEvents()` et `getResults()`)

```bash
SPORTS_API_KEY=votre_clé_api
SPORTS_API_URL=https://api.sportsprovider.com
```
Providers suggérés : **API-Football**, **SportRadar**, **TheSportsDB**

---

## 🔑 Génération du JWT_SECRET

```bash
# Linux/Mac
openssl rand -base64 64

# Windows PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 🧪 Test rapide avec curl

```bash
# 1. Connexion admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mbargaernest80@gmail.com","password":"Nash_2006"}'

# 2. Inscription utilisateur
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testeur","email":"test@test.cm","password":"Test@123","phone":"+237699123456"}'

# 3. Lister les sports (public)
curl http://localhost:8080/api/sports
```

-- V4__create_bets_tables.sql
-- Création des tables bets et bet_selections

CREATE TYPE bet_type   AS ENUM ('SIMPLE', 'COMBINED');
CREATE TYPE bet_status AS ENUM ('PENDING', 'WON', 'LOST', 'CANCELLED', 'CASHED_OUT');
CREATE TYPE selection_status AS ENUM ('PENDING', 'WON', 'LOST', 'CANCELLED');

-- ─── Bets ─────────────────────────────────────────────────────────────────────
CREATE TABLE bets (
    id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type           bet_type      NOT NULL,
    total_stake    NUMERIC(15,2) NOT NULL,
    total_odds     NUMERIC(12,3) NOT NULL,
    potential_win  NUMERIC(15,2) NOT NULL,
    status         bet_status    NOT NULL DEFAULT 'PENDING',
    placed_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    settled_at     TIMESTAMP,

    CONSTRAINT chk_bet_stake_positive CHECK (total_stake > 0),
    CONSTRAINT chk_bet_odds_positive  CHECK (total_odds >= 1.0)
);

CREATE INDEX idx_bets_user_id    ON bets(user_id);
CREATE INDEX idx_bets_status     ON bets(status);
CREATE INDEX idx_bets_placed_at  ON bets(placed_at);
CREATE INDEX idx_bets_type       ON bets(type);

-- ─── Bet Selections ───────────────────────────────────────────────────────────
CREATE TABLE bet_selections (
    id                   BIGSERIAL         PRIMARY KEY,
    bet_id               UUID              NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
    odd_id               BIGINT            NOT NULL REFERENCES odds(id),
    odd_value_at_bet_time NUMERIC(8,3)     NOT NULL,
    status               selection_status  NOT NULL DEFAULT 'PENDING'
);

CREATE INDEX idx_bet_selections_bet_id ON bet_selections(bet_id);
CREATE INDEX idx_bet_selections_odd_id ON bet_selections(odd_id);
CREATE INDEX idx_bet_selections_status ON bet_selections(status);

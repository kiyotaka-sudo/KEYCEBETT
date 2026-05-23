-- V3__create_odds_table.sql
-- Création de la table odds (cotes)

CREATE TABLE odds (
    id           BIGSERIAL      PRIMARY KEY,
    event_id     BIGINT         NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    market_type  VARCHAR(50)    NOT NULL,   -- 1X2, OVER_UNDER, BTTS, HANDICAP...
    selection    VARCHAR(50)    NOT NULL,   -- HOME, DRAW, AWAY, OVER, UNDER, YES, NO...
    value        NUMERIC(8, 3)  NOT NULL,
    is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_odd_value_positive CHECK (value > 1.0),
    CONSTRAINT uq_odd_event_market_selection UNIQUE (event_id, market_type, selection)
);

CREATE INDEX idx_odds_event_id  ON odds(event_id);
CREATE INDEX idx_odds_is_active ON odds(is_active);
CREATE INDEX idx_odds_market    ON odds(market_type);

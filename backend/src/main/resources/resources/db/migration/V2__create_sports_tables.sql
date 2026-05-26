-- V2__create_sports_tables.sql
-- Création des tables sports, leagues, events

CREATE TYPE event_status AS ENUM ('UPCOMING', 'LIVE', 'FINISHED', 'CANCELLED');

-- ─── Sports ──────────────────────────────────────────────────────────────────
CREATE TABLE sports (
    id            BIGSERIAL    PRIMARY KEY,
    name          VARCHAR(100) NOT NULL UNIQUE,
    icon          VARCHAR(255),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    display_order INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_sports_active ON sports(is_active);
CREATE INDEX idx_sports_order  ON sports(display_order);

-- ─── Leagues ─────────────────────────────────────────────────────────────────
CREATE TABLE leagues (
    id        BIGSERIAL    PRIMARY KEY,
    sport_id  BIGINT       NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    name      VARCHAR(150) NOT NULL,
    country   VARCHAR(100),
    logo      VARCHAR(500),
    is_active BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_league_sport_name UNIQUE (sport_id, name)
);

CREATE INDEX idx_leagues_sport_id ON leagues(sport_id);
CREATE INDEX idx_leagues_active   ON leagues(is_active);

-- ─── Events ──────────────────────────────────────────────────────────────────
CREATE TABLE events (
    id           BIGSERIAL    PRIMARY KEY,
    league_id    BIGINT       NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    home_team    VARCHAR(150) NOT NULL,
    away_team    VARCHAR(150) NOT NULL,
    start_time   TIMESTAMP    NOT NULL,
    status       event_status NOT NULL DEFAULT 'UPCOMING',
    home_score   INT,
    away_score   INT,
    external_id  VARCHAR(100),
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_league_id  ON events(league_id);
CREATE INDEX idx_events_status     ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_external   ON events(external_id);

-- V6__create_casino_tables.sql
-- Création de la table casino_games + données initiales

CREATE TYPE game_type AS ENUM ('CRASH', 'SLOTS', 'TABLE', 'LIVE');

CREATE TABLE casino_games (
    id            BIGSERIAL   PRIMARY KEY,
    name          VARCHAR(150) NOT NULL UNIQUE,
    provider      VARCHAR(100),
    type          game_type    NOT NULL,
    thumbnail     VARCHAR(500),
    is_available  BOOLEAN      NOT NULL DEFAULT FALSE,
    coming_soon   BOOLEAN      NOT NULL DEFAULT TRUE,
    display_order INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_casino_games_type      ON casino_games(type);
CREATE INDEX idx_casino_games_available ON casino_games(is_available);
CREATE INDEX idx_casino_games_order     ON casino_games(display_order);

-- ─── Données initiales ────────────────────────────────────────────────────────

-- Admin par défaut
-- Email   : mbargaernest80@gmail.com
-- Password: Nash_2006 (BCrypt strength 12 — hashé via DataInitializer au 1er démarrage)
-- NOTE: le hash est inséré par DataInitializer.java au démarrage si l'admin n'existe pas.

-- Sports
INSERT INTO sports (name, icon, is_active, display_order) VALUES
    ('Football',    '⚽', TRUE, 1),
    ('Basketball',  '🏀', TRUE, 2),
    ('Tennis',      '🎾', TRUE, 3),
    ('Rugby',       '🏉', TRUE, 4),
    ('Volleyball',  '🏐', TRUE, 5);

-- Jeux Casino (tous en coming soon)
INSERT INTO casino_games (name, provider, type, thumbnail, is_available, coming_soon, display_order) VALUES
    ('Aviator',    'Spribe',    'CRASH', '/images/casino/aviator.png',    FALSE, TRUE, 1),
    ('Mines',      'Spribe',    'CRASH', '/images/casino/mines.png',      FALSE, TRUE, 2),
    ('Dice',       'Spribe',    'CRASH', '/images/casino/dice.png',       FALSE, TRUE, 3),
    ('Blackjack',  'Pragmatic', 'TABLE', '/images/casino/blackjack.png',  FALSE, TRUE, 4),
    ('Roulette',   'Pragmatic', 'TABLE', '/images/casino/roulette.png',   FALSE, TRUE, 5);

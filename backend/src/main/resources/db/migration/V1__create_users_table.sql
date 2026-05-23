-- V1__create_users_table.sql
-- Création de la table users

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(20)  NOT NULL UNIQUE,
    balance         NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    role            user_role    NOT NULL DEFAULT 'USER',
    kyc_verified    BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_balance_positive CHECK (balance >= 0),
    CONSTRAINT chk_phone_format     CHECK (phone ~ '^\+237[0-9]{9}$')
);

CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_username   ON users(username);
CREATE INDEX idx_users_phone      ON users(phone);
CREATE INDEX idx_users_role       ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

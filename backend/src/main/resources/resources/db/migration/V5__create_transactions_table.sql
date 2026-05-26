-- V5__create_transactions_table.sql
-- Création de la table transactions (portefeuille)

CREATE TYPE transaction_type   AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'BET_STAKE', 'BET_WIN', 'REFUND');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

CREATE TABLE transactions (
    id          UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        transaction_type   NOT NULL,
    amount      NUMERIC(15,2)      NOT NULL,
    status      transaction_status NOT NULL DEFAULT 'PENDING',
    reference   VARCHAR(255),
    provider    VARCHAR(50),       -- MTN_MOMO, ORANGE_MONEY, null
    metadata    JSONB,             -- données brutes du provider de paiement
    created_at  TIMESTAMP          NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP          NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_transaction_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_transactions_user_id    ON transactions(user_id);
CREATE INDEX idx_transactions_status     ON transactions(status);
CREATE INDEX idx_transactions_type       ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference  ON transactions(reference);

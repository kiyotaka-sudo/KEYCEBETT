-- V7__add_payment_id_to_transactions.sql
-- Ajout de la colonne payment_id pour stocker le paymentId MonetBil
-- Nécessaire pour la réconciliation via webhook et le polling checkPayment

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON transactions(payment_id);

-- Commentaire de documentation
COMMENT ON COLUMN transactions.payment_id IS 'ID de paiement retourné par MonetBil (placePayment → paymentId), utilisé pour le webhook et le polling checkPayment';

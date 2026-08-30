-- The processing fee actually charged.
--
-- The payment screen advertised 0.5% / 1% / 2.9% + $0.30 depending on method and then
-- charged the same total whichever you picked. Storing the fee alongside the total means
-- a booking records what was taken and why, rather than leaving it to be re-derived.

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_fee numeric(10,2) NOT NULL DEFAULT 0
  CHECK (payment_fee >= 0);

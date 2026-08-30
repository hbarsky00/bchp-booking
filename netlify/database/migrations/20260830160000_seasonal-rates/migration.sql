-- Seasonal rates.
--
-- A unit had one flat `price` and a stay cost price × nights. Real lettings do not work
-- that way: the same room is worth more over the festive weeks than in the wet season.
--
-- A season is an explicit dated range rather than a recurring month/day pair. Recurring
-- ranges need modular arithmetic for the ones that straddle New Year, and they cannot
-- express the fact that Easter and local festivals move. Explicit rows cost one insert a
-- year and have no edge cases.

CREATE TABLE IF NOT EXISTS rate_seasons (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL,
  starts_on  date NOT NULL,
  ends_on    date NOT NULL,
  -- Applied to the unit's base price. 1.00 is the base rate.
  multiplier numeric(4,2) NOT NULL CHECK (multiplier > 0 AND multiplier <= 10),
  -- Highest priority wins where ranges overlap, so a festive week can sit inside a
  -- broader high season without the two fighting.
  priority   integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on >= starts_on)
);

CREATE INDEX IF NOT EXISTS rate_seasons_range_idx ON rate_seasons (starts_on, ends_on);

-- Inclusive of both ends: a season covers every night from starts_on to ends_on.
INSERT INTO rate_seasons (name, starts_on, ends_on, multiplier, priority) VALUES
  ('Low season',     '2026-02-01', '2026-03-31', 0.85, 10),
  ('High season',    '2026-06-01', '2026-06-30', 1.15, 10),
  ('Peak season',    '2026-07-01', '2026-08-31', 1.35, 10),
  ('High season',    '2026-09-01', '2026-09-30', 1.15, 10),
  ('Festive season', '2026-12-20', '2027-01-05', 1.45, 20),
  ('Low season',     '2027-02-01', '2027-03-31', 0.85, 10),
  ('High season',    '2027-06-01', '2027-06-30', 1.15, 10),
  ('Peak season',    '2027-07-01', '2027-08-31', 1.35, 10),
  ('High season',    '2027-09-01', '2027-09-30', 1.15, 10),
  ('Festive season', '2027-12-20', '2028-01-05', 1.45, 20)
ON CONFLICT DO NOTHING;

-- The rate actually charged for each night is snapshotted onto the booking, so a later
-- change to a season never rewrites what someone already paid.
CREATE TABLE IF NOT EXISTS booking_nights (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  night      date NOT NULL,
  rate       numeric(10,2) NOT NULL CHECK (rate >= 0),
  season     text,
  UNIQUE (booking_id, night)
);

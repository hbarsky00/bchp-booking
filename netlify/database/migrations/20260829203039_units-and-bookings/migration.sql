-- Stays and their bookings.
--
-- Availability could not use a GiST exclusion constraint: the local dev database is
-- PGlite (Postgres compiled to WASM) and ships no contrib extensions, so btree_gist is
-- unavailable and the migration would only run in production. Overlap is instead
-- prevented by taking a row lock on the unit inside the booking transaction, which
-- serialises every booking for that unit — see netlify/functions/bookings.mts.

CREATE TABLE IF NOT EXISTS units (
  id          integer PRIMARY KEY,
  name        text NOT NULL,
  description text NOT NULL,
  image       text NOT NULL,
  floor       text NOT NULL,
  beds        integer NOT NULL DEFAULT 1 CHECK (beds > 0),
  max_guests  integer NOT NULL DEFAULT 2 CHECK (max_guests > 0),
  rating      numeric(2,1) NOT NULL DEFAULT 0,
  price       numeric(10,2) NOT NULL CHECK (price >= 0),
  amenities   text[] NOT NULL DEFAULT '{}',
  -- false = withdrawn from sale entirely, distinct from "booked on these dates"
  active      boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference    text NOT NULL UNIQUE,
  unit_id      integer NOT NULL REFERENCES units(id),
  -- Same browser-scoped identity as carts: no auth yet.
  guest_key    text NOT NULL,
  guest_name   text NOT NULL,
  guest_email  text NOT NULL,
  guest_phone  text NOT NULL,
  notes        text NOT NULL DEFAULT '',
  check_in     date NOT NULL,
  check_out    date NOT NULL,
  guests       integer NOT NULL DEFAULT 1 CHECK (guests > 0),
  status       text NOT NULL DEFAULT 'reserved'
                 CHECK (status IN ('reserved','paid','checked_out','cancelled')),
  payment_method text NOT NULL DEFAULT 'bsv',
  nightly_rate numeric(10,2) NOT NULL,
  total        numeric(10,2) NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT bookings_dates_ordered CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS bookings_guest_key_idx ON bookings (guest_key, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_unit_dates_idx ON bookings (unit_id, check_in, check_out);

INSERT INTO units (id, name, description, image, floor, beds, max_guests, rating, price, amenities, active) VALUES
  (1, 'Satoshi Room', 'Named after the Bitcoin creator. Modern room with premium amenities.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', '2nd Floor', 2, 4, 4.9, 45, ARRAY['Wifi', 'AC', 'Kitchen']::text[], true),
  (2, 'Nakamoto Room', 'Elegant space inspired by blockchain innovation.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', '2nd Floor', 1, 2, 4.8, 52, ARRAY['Wifi', 'Work', 'Lounge']::text[], true),
  (3, 'Tominaga Room', 'Spacious room with modern design and comfort.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', '3rd Floor', 2, 4, 5.0, 65, ARRAY['Wifi', 'Bar', 'Bath']::text[], true),
  (4, 'DRCSW Room', 'Comfortable accommodation with full amenities.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '2nd Floor', 2, 4, 4.7, 58, ARRAY['Wifi', '2 Beds', 'Kitchen']::text[], true),
  (5, 'TimeCoin Room', 'Cozy room perfect for solo travelers or couples.', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', '3rd Floor', 1, 2, 4.6, 42, ARRAY['Wifi', 'Desk', 'Coffee']::text[], true),
  (6, 'Peer to Peer Room', 'Premium room with exceptional comfort and style.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', '2nd Floor', 2, 4, 4.9, 68, ARRAY['Wifi', 'Office']::text[], false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, image = EXCLUDED.image,
  floor = EXCLUDED.floor, beds = EXCLUDED.beds, max_guests = EXCLUDED.max_guests,
  rating = EXCLUDED.rating, price = EXCLUDED.price, amenities = EXCLUDED.amenities,
  active = EXCLUDED.active;

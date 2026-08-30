-- Shop orders.
--
-- Placing an order was a dead end: the cart's Checkout sent people to the booking
-- payment screen, which bounced them out because there was no booking draft. An order
-- is its own thing, so it gets its own table.

CREATE TABLE IF NOT EXISTS orders (
  id                integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference         text NOT NULL UNIQUE,
  guest_key         text NOT NULL,
  -- Where to deliver. Null means the guest has no current stay, which is allowed.
  booking_reference text REFERENCES bookings(reference),
  status            text NOT NULL DEFAULT 'placed'
                      CHECK (status IN ('placed','delivered','cancelled')),
  subtotal          numeric(10,2) NOT NULL CHECK (subtotal >= 0),
  note              text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id   integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id),
  -- Name and price are snapshotted: a later price change must not rewrite history.
  name       text NOT NULL,
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity   integer NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS orders_guest_key_idx ON orders (guest_key, created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

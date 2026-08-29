-- Shop catalogue and persistent carts.
--
-- Carts belong to a browser rather than a user: there is no auth yet, so the client
-- mints an id into localStorage. That is enough to make a cart survive a reload and
-- the Shop -> Cart navigation, which previously lost everything.

CREATE TABLE IF NOT EXISTS products (
  id          integer PRIMARY KEY,
  name        text NOT NULL,
  description text NOT NULL,
  image       text NOT NULL,
  price       numeric(10,2) NOT NULL CHECK (price >= 0),
  stock       integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category    text NOT NULL
);

CREATE TABLE IF NOT EXISTS carts (
  id         text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cart_id    text    NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at   timestamptz NOT NULL DEFAULT now()
);

-- One row per product per cart; quantity carries the count, so "add" is an upsert.
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_cart_product_key
  ON cart_items (cart_id, product_id);

CREATE INDEX IF NOT EXISTS cart_items_cart_id_idx ON cart_items (cart_id);

-- Seed the catalogue that was previously hardcoded in the client.
INSERT INTO products (id, name, description, image, price, stock, category) VALUES
  (1, 'Bottled Water', '500ml spring water', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', 2.50, 32, 'Snacks & Drinks'),
  (2, 'Premium Coffee', 'Organic blend, 250g', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 12.99, 18, 'Snacks & Drinks'),
  (3, 'Shampoo & Conditioner', 'Luxury hair care set', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 18.50, 26, 'Toiletries'),
  (4, 'Phone Charger', 'Fast charging cable', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 15.00, 13, 'Electronics'),
  (5, 'Chocolate Bar', 'Dark chocolate 70%', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', 4.99, 47, 'Snacks & Drinks'),
  (6, 'Extra Towel Set', 'Premium cotton towels', 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=400', 22.00, 12, 'Amenities'),
  (7, 'Energy Drink', 'Sugar-free, 250ml', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', 3.75, 28, 'Snacks & Drinks'),
  (8, 'Toothbrush Kit', 'Brush + paste combo', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', 8.50, 3, 'Toiletries'),
  (9, 'City Keychain', 'Local souvenir', 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400', 6.99, 50, 'Souvenirs'),
  (10, 'Instant Noodles', 'Hot & spicy flavor', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 3.25, 56, 'Snacks & Drinks'),
  (11, 'Bluetooth Speaker', 'Portable audio device', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 45.00, 8, 'Electronics'),
  (12, 'Laundry Detergent', 'Eco-friendly, 500ml', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400', 7.50, 0, 'Amenities')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  category = EXCLUDED.category;

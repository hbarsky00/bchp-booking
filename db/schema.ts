import { integer, numeric, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

/** Catalogue for the in-stay shop. Ids match the ones the UI already used. */
export const products = pgTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  category: text('category').notNull(),
})

/**
 * A cart belongs to a browser, not a user — there is no auth yet. The client mints an
 * id and keeps it in localStorage, so the cart survives reloads and the Shop → Cart hop.
 */
export const carts = pgTable('carts', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const cartItems = pgTable(
  'cart_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(1),
    addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
  },
  // One row per product per cart; quantity carries the count.
  (t) => [uniqueIndex('cart_items_cart_product_key').on(t.cartId, t.productId)],
)

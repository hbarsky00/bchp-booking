import { useCallback, useEffect, useState } from 'react'

export interface CartLine {
  productId: number
  name: string
  description: string
  image: string
  price: number
  stock: number
  category: string
  quantity: number
}

export interface Cart {
  cartId: string
  items: CartLine[]
  itemCount: number
  subtotal: number
}

const KEY = 'bitstay.cartId'

/**
 * The cart belongs to this browser. There is no auth yet, so the id is minted here and
 * kept in localStorage — enough for a cart to survive a reload and the Shop → Cart hop,
 * which is exactly what used to be lost.
 */
function cartId(): string {
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const id = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(KEY, id)
    return id
  } catch {
    // Private mode or blocked storage: fall back to a per-session id.
    return (window as any).__bitstayCart ??= crypto.randomUUID().replace(/-/g, '')
  }
}

const EMPTY: Cart = { cartId: '', items: [], itemCount: 0, subtotal: 0 }

async function call(path: string, init?: RequestInit): Promise<Cart> {
  const res = await fetch(path, init)
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Request failed (${res.status})`)
  return res.json()
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      setCart(await call(`/api/cart?cartId=${cartId()}`))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const mutate = useCallback(async (body: Record<string, unknown>) => {
    setError(null)
    try {
      setCart(await call('/api/cart', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cartId: cartId(), ...body }),
      }))
    } catch (e) {
      setError((e as Error).message)
      void refresh()          // resync rather than leave an optimistic lie on screen
    }
  }, [refresh])

  const changeQty = useCallback((productId: number, delta: number) => mutate({ productId, delta }), [mutate])

  const remove = useCallback(async (productId: number) => {
    setError(null)
    try {
      setCart(await call(`/api/cart?cartId=${cartId()}&productId=${productId}`, { method: 'DELETE' }))
    } catch (e) {
      setError((e as Error).message)
    }
  }, [])

  const clear = useCallback(async () => {
    setError(null)
    try {
      setCart(await call(`/api/cart?cartId=${cartId()}`, { method: 'DELETE' }))
    } catch (e) {
      setError((e as Error).message)
    }
  }, [])

  const quantityOf = useCallback(
    (productId: number) => cart.items.find(i => i.productId === productId)?.quantity ?? 0,
    [cart.items],
  )

  return { cart, loading, error, refresh, changeQty, remove, clear, quantityOf }
}

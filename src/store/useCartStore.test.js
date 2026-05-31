import { describe, it, expect, beforeEach } from 'vitest';
import useCartStore from './useCartStore';

const sampleProduct = {
  id: 'wl-test-01',
  name_tr: 'Test Korse',
  name_en: 'Test Garment',
  price: 1000,
  images: ['x.jpg'],
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('aynı ürünün aynı varyantı eklendiğinde miktar artmalı', () => {
    const { addToCart, cart, getCartCount } = useCartStore.getState();
    addToCart(sampleProduct, 'M', 'Siyah', 1);
    addToCart(sampleProduct, 'M', 'Siyah', 2);

    const items = useCartStore.getState().cart;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(useCartStore.getState().getCartCount()).toBe(3);
  });

  it('farklı varyant ayrı satır olmalı', () => {
    const { addToCart } = useCartStore.getState();
    addToCart(sampleProduct, 'M', 'Siyah', 1);
    addToCart(sampleProduct, 'L', 'Siyah', 1);

    const items = useCartStore.getState().cart;
    expect(items).toHaveLength(2);
  });

  it('toplam fiyat doğru hesaplanmalı', () => {
    const { addToCart, getCartTotal } = useCartStore.getState();
    addToCart(sampleProduct, 'M', 'Siyah', 2);
    addToCart({ ...sampleProduct, id: 'p2', price: 500 }, 'M', 'Siyah', 1);

    expect(useCartStore.getState().getCartTotal()).toBe(2500);
  });

  it('cartItemId ile silme çalışmalı', () => {
    const { addToCart, removeFromCart } = useCartStore.getState();
    addToCart(sampleProduct, 'M', 'Siyah', 1);
    const id = useCartStore.getState().cart[0].cartItemId;

    removeFromCart(id);
    expect(useCartStore.getState().cart).toHaveLength(0);
  });

  it('quantity 1 altına düşürülemez', () => {
    const { addToCart, updateQuantity } = useCartStore.getState();
    addToCart(sampleProduct, 'M', 'Siyah', 1);
    const id = useCartStore.getState().cart[0].cartItemId;

    updateQuantity(id, 0);
    expect(useCartStore.getState().cart[0].quantity).toBe(1);
  });
});

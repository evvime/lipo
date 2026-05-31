import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductRepository } from '../lib/repositories/productRepository';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      openCart: () => set({ isCartOpen: true }),
      
      closeCart: () => set({ isCartOpen: false }),

      addToCart: async (product, size, color, quantity = 1) => {
        const stock = await ProductRepository.checkVariantStock(product.id, size, color);
        if (stock < quantity) {
          console.warn('Yetersiz stok, sepete eklenemedi.');
          return false;
        }
        
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            item => item.id === product.id && item.size === size && item.color === color
          );

          if (existingItemIndex >= 0) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += quantity;
            return { cart: newCart };
          }

          return {
            cart: [...state.cart, { 
              ...product, 
              size, 
              color, 
              quantity,
              cartItemId: `${product.id}-${size}-${color}` 
            }]
          };
        });
        return true;
      },

      removeFromCart: (cartItemId) => set((state) => ({
        cart: state.cart.filter((item) => item.cartItemId !== cartItemId)
      })),

      updateQuantity: (cartItemId, quantity) => set((state) => ({
        cart: state.cart.map((item) => 
          item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'wellnur-cart-storage',
      // Sadece cart bilgisini sakla, isCartOpen'ı saklamaya gerek yok
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export default useCartStore;

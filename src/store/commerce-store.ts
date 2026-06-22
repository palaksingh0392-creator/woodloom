"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "woodloom-commerce";

export type CartItem = {
  productSlug: string;
  title: string;
  price: string;
  image: string;
  finish: string;
  quantity: number;
};

export type CheckoutAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

export type PaymentMethod = "cod" | "razorpay";

export type OrderSnapshot = {
  orderNumber: string;
  items: CartItem[];
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  createdAt: string;
};

type CommerceState = {
  cartItems: CartItem[];
  wishlistSlugs: string[];
  lastOrder?: OrderSnapshot;
};

type AddToCartInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

const emptyState: CommerceState = {
  cartItems: [],
  wishlistSlugs: [],
};

const listeners = new Set<() => void>();

let state = loadInitialState();

function loadInitialState(): CommerceState {
  if (typeof window === "undefined") {
    return emptyState;
  }

  try {
    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return emptyState;
    }

    const parsedState = JSON.parse(storedState) as Partial<CommerceState>;

    return {
      cartItems: Array.isArray(parsedState.cartItems)
        ? parsedState.cartItems
        : [],
      wishlistSlugs: Array.isArray(parsedState.wishlistSlugs)
        ? parsedState.wishlistSlugs
        : [],
      lastOrder: parsedState.lastOrder,
    };
  } catch {
    return emptyState;
  }
}

function persist(nextState: CommerceState) {
  state = nextState;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useCommerceSelector<T>(selector: (state: CommerceState) => T) {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(emptyState),
  );
}

export const commerceActions = {
  addToCart(item: AddToCartInput) {
    const quantity = item.quantity ?? 1;
    const existingItem = state.cartItems.find(
      (cartItem) =>
        cartItem.productSlug === item.productSlug &&
        cartItem.finish === item.finish,
    );

    const cartItems = existingItem
      ? state.cartItems.map((cartItem) =>
          cartItem.productSlug === item.productSlug &&
          cartItem.finish === item.finish
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
              }
            : cartItem,
        )
      : [
          ...state.cartItems,
          {
            ...item,
            quantity,
          },
        ];

    persist({
      ...state,
      cartItems,
    });
  },

  toggleWishlist(productSlug: string) {
    const isWishlisted = state.wishlistSlugs.includes(productSlug);

    persist({
      ...state,
      wishlistSlugs: isWishlisted
        ? state.wishlistSlugs.filter((slug) => slug !== productSlug)
        : [...state.wishlistSlugs, productSlug],
    });
  },

  updateCartItemQuantity(productSlug: string, finish: string, quantity: number) {
    if (quantity < 1) {
      return;
    }

    persist({
      ...state,
      cartItems: state.cartItems.map((cartItem) =>
        cartItem.productSlug === productSlug && cartItem.finish === finish
          ? {
              ...cartItem,
              quantity,
            }
          : cartItem,
      ),
    });
  },

  removeCartItem(productSlug: string, finish: string) {
    persist({
      ...state,
      cartItems: state.cartItems.filter(
        (cartItem) =>
          cartItem.productSlug !== productSlug || cartItem.finish !== finish,
      ),
    });
  },

  placeOrder(
    order: Omit<OrderSnapshot, "orderNumber" | "createdAt"> & {
      orderNumber?: string;
    },
  ) {
    const lastOrder: OrderSnapshot = {
      ...order,
      orderNumber: order.orderNumber ?? `WL-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
    };

    persist({
      ...state,
      cartItems: [],
      lastOrder,
    });

    return lastOrder;
  },
};

export function calculateCartTotals(cartItems: CartItem[]) {
  const subtotal = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );
  const deliveryCharge = subtotal >= 50000 || subtotal === 0 ? 0 : 999;

  return {
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
  };
}

export function formatPrice(value: number) {
  return `Rs. ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

export function useCartCount() {
  return useCommerceSelector((currentState) =>
    currentState.cartItems.reduce((total, item) => total + item.quantity, 0),
  );
}

export function useWishlistCount() {
  return useCommerceSelector(
    (currentState) => currentState.wishlistSlugs.length,
  );
}

export function useIsWishlisted(productSlug: string) {
  return useCommerceSelector((currentState) =>
    currentState.wishlistSlugs.includes(productSlug),
  );
}

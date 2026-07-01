"use client";

import { useSyncExternalStore } from "react";

import { parsePriceAmount } from "@/lib/price";

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

type AccountCommerceState = {
  cartItems?: CartItem[];
  wishlistSlugs?: string[];
};

const emptyState: CommerceState = {
  cartItems: [],
  wishlistSlugs: [],
};

const listeners = new Set<() => void>();

let state = loadInitialState();
let accountSyncInitialized = false;
let accountSyncEnabled = false;
let accountSyncTimer: number | undefined;

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

function mergeCartItems(localItems: CartItem[], accountItems: CartItem[]) {
  const merged = new Map<string, CartItem>();

  [...accountItems, ...localItems].forEach((item) => {
    const key = `${item.productSlug}:${item.finish}`;
    const currentItem = merged.get(key);

    merged.set(key, {
      ...item,
      quantity: currentItem
        ? Math.max(currentItem.quantity, item.quantity)
        : item.quantity,
    });
  });

  return Array.from(merged.values());
}

function mergeCommerceState(accountState: AccountCommerceState) {
  const accountCartItems = Array.isArray(accountState.cartItems)
    ? accountState.cartItems
    : [];
  const accountWishlistSlugs = Array.isArray(accountState.wishlistSlugs)
    ? accountState.wishlistSlugs
    : [];

  return {
    ...state,
    cartItems: mergeCartItems(state.cartItems, accountCartItems),
    wishlistSlugs: Array.from(
      new Set([...accountWishlistSlugs, ...state.wishlistSlugs]),
    ),
  };
}

async function saveAccountCommerce() {
  if (!accountSyncEnabled || typeof window === "undefined") {
    return;
  }

  try {
    const response = await fetch("/api/account/commerce", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: state.cartItems,
        wishlistSlugs: state.wishlistSlugs,
      }),
    });

    if (response.status === 401 || response.status === 503) {
      accountSyncEnabled = false;
    }
  } catch {
    accountSyncEnabled = false;
  }
}

function queueAccountCommerceSave() {
  if (!accountSyncEnabled || typeof window === "undefined") {
    return;
  }

  if (accountSyncTimer) {
    window.clearTimeout(accountSyncTimer);
  }

  accountSyncTimer = window.setTimeout(() => {
    void saveAccountCommerce();
  }, 350);
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
  async syncWithAccount() {
    if (accountSyncInitialized || typeof window === "undefined") {
      return;
    }

    accountSyncInitialized = true;

    try {
      const response = await fetch("/api/account/commerce", {
        method: "GET",
      });

      if (!response.ok) {
        accountSyncEnabled = false;
        return;
      }

      const accountState = (await response.json()) as AccountCommerceState;
      accountSyncEnabled = true;

      persist(mergeCommerceState(accountState));
      await saveAccountCommerce();
    } catch {
      accountSyncEnabled = false;
    }
  },

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
    queueAccountCommerceSave();
  },

  toggleWishlist(productSlug: string) {
    const isWishlisted = state.wishlistSlugs.includes(productSlug);

    persist({
      ...state,
      wishlistSlugs: isWishlisted
        ? state.wishlistSlugs.filter((slug) => slug !== productSlug)
        : [...state.wishlistSlugs, productSlug],
    });
    queueAccountCommerceSave();
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
    queueAccountCommerceSave();
  },

  removeCartItem(productSlug: string, finish: string) {
    persist({
      ...state,
      cartItems: state.cartItems.filter(
        (cartItem) =>
          cartItem.productSlug !== productSlug || cartItem.finish !== finish,
      ),
    });
    queueAccountCommerceSave();
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
    queueAccountCommerceSave();

    return lastOrder;
  },
};

export function calculateCartTotals(cartItems: CartItem[]) {
  const subtotal = cartItems.reduce(
    (total, item) => total + parsePriceAmount(item.price) * item.quantity,
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

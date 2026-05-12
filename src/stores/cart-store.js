import { persistentMap } from '@nanostores/persistent';

export const cartStore = persistentMap('elegance-cart:', {});

export function addToCart(product) {
  const current = cartStore.get();
  const existingKey = Object.keys(current).find(key => current[key].id === product.id);

  if (existingKey) {
    const existing = current[existingKey];
    const newQuantity = existing.quantity + 1;
    cartStore.setKey(existingKey, {
      ...existing,
      quantity: newQuantity
    });
  } else {
    const newKey = `item-${Date.now()}`;
    cartStore.setKey(newKey, {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: 1
    });
  }
}

export function removeFromCart(key) {
  const current = cartStore.get();
  const newCart = { ...current };
  delete newCart[key];
  cartStore.set(newCart);
}

export function clearCart() {
  cartStore.set({});
}

export function getCartItems() {
  return Object.entries(cartStore.get()).map(([key, value]) => ({
    key,
    ...value
  }));
}

export function getCartTotal() {
  const items = getCartItems();
  return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

export function getCartCount() {
  const items = getCartItems();
  return items.reduce((count, item) => count + item.cantidad, 0);
}
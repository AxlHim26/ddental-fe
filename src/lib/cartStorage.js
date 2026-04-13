const CART_KEY_PREFIX = "hd_dental_cart";

function buildCartKey(email) {
  return `${CART_KEY_PREFIX}:${String(email || "").trim().toLowerCase()}`;
}

function sanitizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const productId = String(item?.productId || "").trim();
      const quantity = Number.parseInt(item?.quantity, 10);

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
        return null;
      }

      return {
        productId,
        quantity: Math.min(quantity, 99),
      };
    })
    .filter(Boolean);
}

export function readCart(email) {
  if (!email) return [];

  try {
    const raw = localStorage.getItem(buildCartKey(email));
    return raw ? sanitizeItems(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function writeCart(email, items) {
  if (!email) return;
  localStorage.setItem(buildCartKey(email), JSON.stringify(sanitizeItems(items)));
}

export function clearCart(email) {
  if (!email) return;
  localStorage.removeItem(buildCartKey(email));
}

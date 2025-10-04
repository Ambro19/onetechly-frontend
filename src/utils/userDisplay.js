// utils/userDisplay.js
// Canonical helpers for user name/email across the app.

const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

const decodeJwt = (token) => {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return {};
  }
};

export const getDisplayEmail = (user) => {
  // 1) prefer AuthContext user shape
  const fromUser =
    user?.email ||
    user?.user?.email ||
    user?.profile?.email ||
    user?.principal?.email;
  if (fromUser) return normalizeEmail(fromUser);

  // 2) try persisted "user" (if your AuthContext persists it)
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u?.email) return normalizeEmail(u.email);
    }
  } catch {}

  // 3) try JWT claim
  const token = localStorage.getItem('token');
  if (token) {
    const p = decodeJwt(token);
    if (p?.email) return normalizeEmail(p.email);
  }

  // 4) fallback
  return 'user@example.com';
};

export const getDisplayName = (user) => {
  const name =
    user?.username ||
    user?.name ||
    user?.user?.username ||
    user?.profile?.name;

  if (name && typeof name === 'string') return name;

  // if no name, use email prefix as a human-ish fallback
  const email = getDisplayEmail(user);
  return email && email !== 'user@example.com'
    ? email.split('@')[0]
    : 'User';
};

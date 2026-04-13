/**
 * Phiên đăng nhập cục bộ (localStorage) — chỉ dùng demo / nội bộ.
 * Khi có backend, thay bằng API + token an toàn.
 */
const USERS_KEY = "hd_dental_registered_users";
const SESSION_KEY = "hd_dental_session";

export function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s?.email) return null;
    return { email: s.email, name: s.name || s.email };
  } catch {
    return null;
  }
}

export function writeSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ email: user.email, name: user.name || user.email })
  );
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function registerUser({ name, email, password }) {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Email đã được đăng ký." };
  }
  const row = {
    id: String(Date.now()),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
  users.push(row);
  saveUsers(users);
  return { ok: true, user: { email: row.email, name: row.name } };
}

export function loginUser({ email, password }) {
  const e = email.trim().toLowerCase();
  const users = readUsers();
  const row = users.find((u) => u.email === e && u.password === password);
  if (!row) return { ok: false, error: "Email hoặc mật khẩu không đúng." };
  return { ok: true, user: { email: row.email, name: row.name } };
}

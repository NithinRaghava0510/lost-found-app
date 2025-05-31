// /frontend/src/utils/auth.js

export function setAuthData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getAuthUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function isAdmin() {
  const user = getAuthUser();
  return user && user.is_admin;
}

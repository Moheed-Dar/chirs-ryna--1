export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("admin_user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin_user", JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_user");
}
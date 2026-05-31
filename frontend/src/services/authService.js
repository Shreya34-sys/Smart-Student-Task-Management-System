import { api } from "../api/axios";

const TOKEN_KEY = "smart-task-token";
const USER_KEY = "smart-task-user";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    clearStoredSession();
    return null;
  }
}

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function registerUser(payload) {
  const { data } = await api.post("/auth/register", payload);
  saveSession(data);
  return data.user;
}

export async function loginUser(payload) {
  const { data } = await api.post("/auth/login", payload);
  saveSession(data);
  return data.user;
}

export async function loginWithGoogle(credentialOrPayload) {
  const payload = {
    name: credentialOrPayload.name,
    email: credentialOrPayload.email,
    avatar: credentialOrPayload.avatar,
    accessToken: credentialOrPayload.accessToken || undefined,
    firebaseUid: credentialOrPayload.firebaseUid || undefined
  };

  const { data } = await api.post("/auth/google", payload);
  saveSession(data);
  return data.user;
}

export async function fetchProfile() {
  const { data } = await api.get("/auth/me");
  const user = {
    id: data.user._id || data.user.id,
    name: data.user.name,
    email: data.user.email,
    avatar: data.user.avatar,
    phone: data.user.phone,
    phoneVerified: data.user.phoneVerified,
    provider: data.user.provider,
    course: data.user.course,
    avatarColor: data.user.avatarColor,
    role: data.user.role,
    teams: data.user.teams || []
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

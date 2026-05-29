import { api } from "./axios";

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

async function request(action, fallbackMessage) {
  try {
    const { data } = await action();
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export function fetchTasks(params) {
  return request(() => api.get("/tasks", { params }), "Could not load tasks");
}

export function createTask(data) {
  return request(() => api.post("/tasks", data), "Could not create task");
}

export function updateTask(id, data) {
  return request(() => api.put(`/tasks/${id}`, data), "Could not update task");
}

export function deleteTask(id) {
  return request(() => api.delete(`/tasks/${id}`), "Could not delete task");
}

export function loginUser(data) {
  return request(() => api.post("/auth/login", data), "Could not log in");
}

export function registerUser(data) {
  return request(() => api.post("/auth/register", data), "Could not register");
}

export function sendInvite(data) {
  return request(() => api.post("/invites/send", data), "Could not send invite");
}

export function fetchInvite(token) {
  return request(() => api.get(`/invites/${token}`), "Could not load invite");
}

export function acceptInvite(token) {
  return request(() => api.post("/invites/accept", { token }), "Could not accept invite");
}

export function fetchTeamInvites(teamId) {
  return request(() => api.get(`/invites/team/${teamId}`), "Could not load invites");
}


export function forgotPassword(data) {
  return request(() => api.post("/auth/forgot-password", data), "Could not send reset link");
}

export function resetPassword(data) {
  return request(() => api.post(`/auth/reset-password/${data.token}`, {
    password: data.password,
    confirmPassword: data.confirmPassword
  }), "Could not reset password");
}

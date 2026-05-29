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

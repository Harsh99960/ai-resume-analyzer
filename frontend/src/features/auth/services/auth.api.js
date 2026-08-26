import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.get("/auth/logout");

    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/get-me");

    return response.data;
  } catch (error) {
    console.error("Get user failed:", error);
    throw error;
  }
}
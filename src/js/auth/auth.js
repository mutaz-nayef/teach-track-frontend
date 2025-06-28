// src/auth.js

import { state } from "../state.js";
// import Navigo from "navigo";

// export const router = new Navigo("/", { hash: false });

export async function login(email, password) {
  try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorEl = document.getElementById("error-message");
      if (errorEl) {
        errorEl.textContent = data.message || "Login failed";
      }
      throw new Error(data.message || "Login failed");
    }

    state.setToken(data.data.token);
    state.setUser(data.data.user);
    return data;
  } catch (e) {
    throw e;
  }
}

export async function register(name, email, password, password_confirmation) {
  try {
    const res = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorEl = document.getElementById("error-message");
      if (errorEl) {
        errorEl.textContent = data.message || "Register failed";
      }
      throw new Error(data.message || "Register failed");
    }

    state.setToken(data.data.token);
    state.setUser(data.data.user);

    return data;
  } catch (e) {
    throw e;
  }
}

export async function logout() {
  try {
    const res = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Logout Failed");
    }
    state.clearAuth();
  } catch (e) {
    throw e;
  }
}

export function isAuthenticated() {
  return !!sessionStorage.getItem("auth_token");
}

/*

import { state } from './state.js';

export async function fetchProtectedData() {
  const res = await fetch('http://localhost:8000/api/protected', {
    headers: {
      'Authorization': `Bearer ${state.token}`
    }
  });

  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

*/

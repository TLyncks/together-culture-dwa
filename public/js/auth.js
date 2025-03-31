const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const admin_code = document.getElementById("admin_code").value.trim();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, admin_code }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registered successfully. Please log in.");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Registration failed.");
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      Auth.saveLogin(data.token, data.role); // ✅ store role + token

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      alert(data.error || "Login failed");
    }
  });
}


// --- Shared Auth Helper ---
const Auth = {
  getToken() {
    return localStorage.getItem("token");
  },

  getRole() {
    return localStorage.getItem("role"); // stored at login
  },

  saveLogin(token, role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  },

  isAdmin() {
    return this.getRole() === "admin";
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async getCurrentUser() {
    const res = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });

    if (!res.ok) return null;
    return await res.json(); // { id, name, email, role, ... }
  },

  requireAuth(redirectTo = "login.html") {
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo;
    }
  },

  requireAdmin(redirectTo = "dashboard.html") {
    if (!this.isAdmin()) {
      window.location.href = redirectTo;
    }
  }
};

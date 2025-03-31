const token = localStorage.getItem("token");

if (!token) {
  alert("You must be logged in.");
  window.location.href = "login.html";
}

// --- Tabs ---
document.querySelectorAll(".tab-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll(".tab-buttons button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

// --- Logout ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// --- Load Messages ---
const adminMessages = document.getElementById("adminMessages");

async function loadMessages() {
  const res = await fetch("/api/contact/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok) {
    if (data.length === 0) {
      adminMessages.innerHTML = "<p>No support messages.</p>";
      return;
    }

    adminMessages.innerHTML = data
      .map((msg) => `
        <div class="message-card">
          <p><strong>${msg.name}</strong> (${msg.email})</p>
          <p>${msg.message}</p>
          <p><em>${new Date(msg.created_at).toLocaleString()}</em></p>
          <button data-id="${msg.id}" class="delete-message">Delete</button>
          <hr>
        </div>
      `)
      .join("");

    document.querySelectorAll(".delete-message").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const res = await fetch(`/api/contact/messages/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          alert("Message deleted.");
          loadMessages();
        } else {
          alert("Failed to delete.");
        }
      });
    });
  } else {
    adminMessages.innerHTML = "<p>Failed to load messages.</p>";
  }
}

// --- Load Users ---
const adminUsers = document.getElementById("adminUsers");
const userSearch = document.getElementById("userSearch");
let allUsers = [];

async function loadUsers() {
  const res = await fetch("/api/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (res.ok) {
    allUsers = data;
    renderUsers(data);
  } else {
    adminUsers.innerHTML = "<p>Failed to load users.</p>";
  }
}

function renderUsers(users) {
  if (users.length === 0) {
    adminUsers.innerHTML = "<p>No users found.</p>";
    return;
  }

  adminUsers.innerHTML = users
    .map((user) => `
      <div class="user-card">
        <p><strong>${user.name}</strong> (${user.email})</p>
        <p>Role: ${user.role} | Membership: ${user.membership_name || "None"}</p>
        <button data-id="${user.id}" class="edit-user">Edit</button>
        <button data-id="${user.id}" class="delete-user">Delete</button>
        <hr>
      </div>
    `)
    .join("");

  document.querySelectorAll(".delete-user").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmed = confirm("Delete this user?");
      if (!confirmed) return;

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("User deleted.");
        loadUsers();
      } else {
        alert("Failed to delete user.");
      }
    });
  });

  document.querySelectorAll(".edit-user").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const user = allUsers.find((u) => u.id == id);

      const name = prompt("Edit name:", user.name);
      const email = prompt("Edit email:", user.email);
      const role = prompt("Edit role (admin/member):", user.role);
      const membership_id = prompt("Edit membership ID:", user.membership_id || "");

      fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, role, membership_id }),
      }).then((res) => {
        if (res.ok) {
          alert("User updated.");
          loadUsers();
        } else {
          alert("Update failed.");
        }
      });
    });
  });
}

userSearch.addEventListener("input", () => {
  const q = userSearch.value.toLowerCase();
  const filtered = allUsers.filter((u) =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
  renderUsers(filtered);
});

// Load on page
loadMessages();
loadUsers();

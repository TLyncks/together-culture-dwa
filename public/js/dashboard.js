let currentMembership = null;

// Redirect if not logged in
Auth.requireAuth();

// Tab switching
document.querySelectorAll(".tab-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll(".tab-buttons button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", Auth.logout);

// Global user object
let currentUser = null;

// Load user info
async function loadUser() {
  currentUser = await Auth.getCurrentUser();
  if (!currentUser) {
    alert("Could not load user.");
    Auth.logout();
    return;
  }

  document.getElementById("welcomeMessage").textContent = `Welcome, ${currentUser.name}`;
  document.getElementById("editName").value = currentUser.name;
  document.getElementById("editEmail").value = currentUser.email;

  loadMembership();
  loadMembershipOptions();
}

loadUser();

// Account Update
document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();

  const res = await fetch("/api/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Auth.getToken()}`
    },
    body: JSON.stringify({ name, email })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Account updated!");
    loadUser();
  } else {
    alert(data.error || "Update failed");
  }
});

// Delete Account
document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
  const confirmed = confirm("Are you sure you want to delete your account?");
  if (!confirmed) return;

  const res = await fetch("/api/me", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  if (res.ok) {
    alert("Account deleted.");
    Auth.logout();
  } else {
    alert("Failed to delete account.");
  }
});

async function loadMembership() {
  const res = await fetch("/api/membership/me", {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  const data = await res.json();
  const container = document.getElementById("membershipStatus");
  const cancelBtn = document.getElementById("cancelMembershipBtn");

  if (res.ok) {
    const container = document.getElementById("membershipStatus");
  
    if (data.membership_name) {
      currentMembership = data.membership_name;
      container.className = "membership-status";
      container.innerHTML = `
        <strong>${currentMembership}</strong><br>
        <span>${data.description}</span>
      `;
      cancelBtn.style.display = "inline-block";
    } else {
      currentMembership = null;
      container.className = "membership-status none";
      container.innerHTML = "<strong>No active membership</strong><br>You can join one below.";
      cancelBtn.style.display = "none";
    }
  }
}  



// Load membership options
async function loadMembershipOptions() {
  const res = await fetch("/api/memberships");
  const data = await res.json();
  const container = document.getElementById("membershipOptions");

  if (!res.ok || !Array.isArray(data)) {
    container.innerHTML = "<p>Could not load membership options.</p>";
    return;
  }

  const current = currentUser.membership_name || null;

  container.innerHTML = data
    .map((m, i) => {
      let label = "Join";
      let disabled = false;

      if (currentMembership) {
        if (m.name === currentMembership) {
          label = "Current Membership Level";
          disabled = true;
        } else {
          const currentIndex = data.findIndex((x) => x.name === currentMembership);
          label = i > currentIndex ? "Upgrade" : "Downgrade";
        }
      }

      return `
        <div class="membership-option">
          <strong>${m.name}</strong><br>
          <small>${m.description}</small><br>
          <button 
            data-id="${m.id}" 
            ${disabled ? "disabled" : ""}
            style="${disabled ? "opacity: 0.5; cursor: not-allowed;" : ""}">
            ${label}
          </button>
          <hr>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll("#membershipOptions button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const res = await fetch("/api/membership/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify({ membership_id: id })
      });

      if (res.ok) {
        alert("Membership updated!");
        loadUser(); // Refresh everything
      } else {
        alert("Failed to change membership.");
      }
    });
  });
}


// Cancel membership
document.getElementById("cancelMembershipBtn").addEventListener("click", async () => {
  const res = await fetch("/api/membership/cancel", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  if (res.ok) {
    alert("Membership cancelled.");
    loadMembership();
  } else {
    alert("Failed to cancel.");
  }
});

document.getElementById("passwordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch("/api/me/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Auth.getToken()}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Password updated!");
    e.target.reset();
  } else {
    alert(data.error || "Password update failed.");
  }
});

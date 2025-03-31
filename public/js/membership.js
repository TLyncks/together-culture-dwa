const token = localStorage.getItem("token");

if (!token) {
  alert("You must be logged in.");
  window.location.href = "login.html";
}

const currentMembershipContainer = document.getElementById("currentMembership");
const membershipList = document.getElementById("membershipList");

// Fetch current membership
async function loadCurrentMembership() {
  const res = await fetch("/api/membership/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok) {
    currentMembershipContainer.innerHTML = `
      <h2>Current Membership</h2>
      ${
        data.membership_name
          ? `<p><strong>${data.membership_name}</strong></p><p>${data.description}</p>`
          : `<p>You are not currently a member.</p>`
      }
    `;
  } else {
    currentMembershipContainer.innerHTML = `<p>Error loading membership.</p>`;
  }
}

// Fetch available memberships
async function loadMembershipOptions() {
  const res = await fetch("/api/memberships");
  const data = await res.json();

  if (res.ok) {
    data.forEach((tier) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${tier.name}</strong><br>
        <small>${tier.description}</small><br>
        <button data-id="${tier.id}">Join</button>
        <hr>
      `;
      membershipList.appendChild(li);
    });

    // Add button logic
    document.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");

        const res = await fetch("/api/membership/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ membership_id: id }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Membership updated!");
          loadCurrentMembership();
        } else {
          alert(data.error || "Failed to update membership");
        }
      });
    });
  } else {
    membershipList.innerHTML = "<li>Failed to load memberships.</li>";
  }
}

// Initial load
loadCurrentMembership();
loadMembershipOptions();

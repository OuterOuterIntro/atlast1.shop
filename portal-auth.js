// This must match the custom domain connected to the Cloudflare Worker.
const ATLAST_AUTH_API = "https://auth.atlast1.shop";

const login = document.getElementById("discordLogin");
const portalUser = document.getElementById("portalUser");
const portalName = document.getElementById("portalName");
const projectState = document.getElementById("projectState");
const preview = document.querySelector(".portal-preview");

login?.addEventListener("click", event => {
  event.preventDefault();
  alert("Ask ATLAST staff to run /linkbot for you in Discord. Use the private Link My ATLAST Account button it creates.");
});

function esc(value = "") {
  const node = document.createElement("div");
  node.textContent = String(value);
  return node.innerHTML;
}

async function logout(event) {
  event?.preventDefault();
  await fetch(`${ATLAST_AUTH_API}/api/logout`, {
    method: "POST",
    credentials: "include"
  });
  location.href = `${location.origin}${location.pathname}#portal`;
  location.reload();
}

async function loadLinkedAccount() {
  try {
    const response = await fetch(`${ATLAST_AUTH_API}/api/me`, {
      credentials: "include",
      headers: { Accept: "application/json" }
    });
    if (!response.ok) return;
    const account = await response.json();

    document.getElementById("intro")?.remove();
    document.body.classList.remove("intro-open");
    if (login) login.style.display = "none";
    if (portalUser) portalUser.style.display = "block";
    if (portalName) portalName.textContent = `Linked Discord account: ${account.discord_user_id}`;
    if (projectState) projectState.textContent = "ACCOUNT LINKED";

    preview.innerHTML = `
      <div class="eye">Private dashboard</div>
      <div class="project-top">
        <div><small style="color:#7e869f">MY ATLAST BOT</small><h3 style="margin:5px 0">${esc(account.bot_name)}</h3></div>
        <span class="status">● ACCOUNT LINKED</span>
      </div>
      <div class="project-row">
        <small style="color:#7e869f">DISCORD ACCOUNT</small>
        <p style="margin-bottom:0">Connected securely as <code>${esc(account.discord_user_id)}</code>.</p>
      </div>
      <div class="project-row">
        <small style="color:#7e869f">SERVER RECOVERY</small>
        <p style="margin-bottom:0">Authorized. You can revoke ATLAST at any time from Discord's Authorized Apps settings.</p>
      </div>
      <div class="project-row">
        <small style="color:#7e869f">PROJECT DETAILS</small>
        <p style="margin-bottom:0">Project progress and delivery details can be connected to this account next.</p>
      </div>
      <a href="#" id="atlastLogout" style="color:#a78bfa">Log out</a>
    `;
    document.getElementById("atlastLogout")?.addEventListener("click", logout);
    setTimeout(() => document.getElementById("portal")?.scrollIntoView({ behavior: "smooth" }), 50);
  } catch (error) {
    console.error("ATLAST account service is unavailable", error);
  }
}

loadLinkedAccount();

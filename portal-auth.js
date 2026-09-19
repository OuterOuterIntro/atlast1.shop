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

    const bots = Array.isArray(account.bots) ? account.bots : [];
    const botCards = bots.length ? bots.map(bot => `
      <div class="project-row">
        <div style="display:flex;gap:12px;align-items:center">
          ${bot.avatar_url ? `<img src="${esc(bot.avatar_url)}" alt="" width="52" height="52" style="border-radius:14px">` : ""}
          <div><small style="color:#7e869f">DISCORD APPLICATION</small><h3 style="margin:4px 0">${esc(bot.display_name)}</h3><code>${esc(bot.application_id)}</code></div>
        </div>
        <a class="btn" href="/bot.html?app=${encodeURIComponent(bot.application_id)}" style="display:inline-flex;margin-top:14px">Open My Bot →</a>
      </div>`).join("") : `<div class="project-row"><p>No Application-ID bot project is assigned yet. Ask ATLAST staff to create a new <code>/linkbot</code> link.</p></div>`;

    preview.innerHTML = `
      <div class="eye">Private dashboard</div>
      <div class="project-top">
        <div><small style="color:#7e869f">MY ATLAST BOTS</small><h3 style="margin:5px 0">${bots.length} assigned</h3></div>
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
      ${botCards}
      <a href="#" id="atlastLogout" style="color:#a78bfa">Log out</a>
    `;
    document.getElementById("atlastLogout")?.addEventListener("click", logout);
    setTimeout(() => document.getElementById("portal")?.scrollIntoView({ behavior: "smooth" }), 50);
  } catch (error) {
    console.error("ATLAST account service is unavailable", error);
  }
}

loadLinkedAccount();

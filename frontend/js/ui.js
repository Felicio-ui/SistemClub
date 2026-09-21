// ============================================================
// ClubManager - Interface (UI)
// ============================================================
// Este ficheiro gera o header, a sidebar e os alertas.
// ============================================================

import { CONFIG } from "./config.js";
import { obterUtilizador } from "./auth.js";

// ===== Header =====
export function renderHeader() {
  const user = obterUtilizador();

  return `
    <header class="app-header">
      <div class="app-header__logo">${CONFIG.APP_NAME}</div>
      <div class="app-header__user">
        <span class="app-header__user-name">${user?.nome || "Utilizador"}</span>
        <span class="app-header__user-role">${user?.perfil || ""}</span>
        <button onclick="sair()" class="btn-sair">Sair</button>
      </div>
    </header>
  `;
}

// ===== Sidebar =====
export function renderSidebar(linkAtivo, links) {
  const items = links
    .map(
      (l) => `
      <a href="${l.href}" class="app-sidebar__link ${l.href === linkAtivo ? "active" : ""}">
        <span>${l.icone}</span>
        <span>${l.label}</span>
      </a>
    `
    )
    .join("");

  return `
    <aside class="app-sidebar">
      <nav class="app-sidebar__menu">
        ${items}
      </nav>
    </aside>
  `;
}

// ===== Alerta =====
export function mostrarAlerta(mensagem, tipo = "success") {
  const container = document.querySelector(".app-main");
  if (!container) return;

  const div = document.createElement("div");
  div.className = `alert alert-${tipo}`;
  div.textContent = mensagem;
  container.prepend(div);

  setTimeout(() => div.remove(), 3000);
}
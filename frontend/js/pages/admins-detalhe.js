// ============================================================
// ClubManager - Detalhe do Administrador
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";
import { formatarData, escaparHTML, corDoEstado } from "../utils.js";

exigirAutenticacao();
window.sair = logout;

document.querySelector("#app-header").innerHTML = renderHeader();

document.querySelector("#app-sidebar").innerHTML = renderSidebar(
  "../admins/lista.html",
  [
    { href: "../../dashboards/admin.html", icone: "📊", label: "Dashboard" },
    { href: "../clubes/lista.html", icone: "🏟️", label: "Clubes" },
    { href: "../admins/lista.html", icone: "👤", label: "Administradores" },
    { href: "../logs/lista.html", icone: "📄", label: "Logs de Auditoria" },
  ]
);

// ===== Obter o ID do URL =====
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.querySelector("#detalhe-conteudo").innerHTML =
    `<p class="text-center">ID do administrador não especificado.</p>`;
} else {
  carregarDetalhe(id);
}

async function carregarDetalhe(id) {
  const container = document.querySelector("#detalhe-conteudo");

  try {
    const admin = await apiRequest(`/admins/${id}`);

    container.innerHTML = `
      <div class="detail-grid">

        <div class="detail-item">
          <span class="detail-label">Nome Completo</span>
          <span class="detail-value">${escaparHTML(admin.nome)} ${escaparHTML(admin.apelido || "")}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">${escaparHTML(admin.email)}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Estado</span>
          <span class="detail-value">
            <span class="badge ${corDoEstado(admin.estado)}">${escaparHTML(admin.estado)}</span>
          </span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Data de Registo</span>
          <span class="detail-value">${formatarData(admin.criadoEm)}</span>
        </div>

      </div>

      <div class="form-actions" style="margin-top: 32px;">
        <a href="editar.html?id=${admin.id}" class="btn btn-primary">Editar</a>
        <a href="lista.html" class="btn btn-outline">Voltar à lista</a>
      </div>
    `;

  } catch (erro) {
    console.error("Erro ao carregar detalhe:", erro);
    container.innerHTML = `<p class="text-center">Erro ao carregar o administrador.</p>`;
    mostrarAlerta("Erro: " + erro.message, "danger");
  }
}
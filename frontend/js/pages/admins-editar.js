// ============================================================
// ClubManager - Editar Administrador
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";

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
  alert("ID não especificado");
  window.location.href = "lista.html";
}

// ===== Carregar os dados atuais =====
async function carregarAdmin() {
  try {
    const admin = await apiRequest(`/admins/${id}`);

    document.querySelector("#nome").value = admin.nome || "";
    document.querySelector("#apelido").value = admin.apelido || "";
    document.querySelector("#email").value = admin.email || "";

  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao carregar o administrador.");
    window.location.href = "lista.html";
  }
}

// ===== Submeter o formulário =====
document.querySelector("#form-admin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.querySelector("#btn-submeter");
  const erroEl = document.querySelector("#form-erro");

  const dados = {
    nome: document.querySelector("#nome").value.trim(),
    apelido: document.querySelector("#apelido").value.trim() || null,
    email: document.querySelector("#email").value.trim(),
    senha: document.querySelector("#senha").value || null,
  };

  erroEl.style.display = "none";
  btn.disabled = true;
  btn.textContent = "A guardar...";

  try {
    await apiRequest(`/admins/${id}`, "PUT", dados);
    alert("Administrador atualizado com sucesso!");
    window.location.href = "lista.html";

  } catch (erro) {
    console.error("Erro:", erro);
    erroEl.textContent = erro.message || "Erro ao atualizar.";
    erroEl.style.display = "block";
    btn.disabled = false;
    btn.textContent = "Guardar Alterações";
  }
});

// ===== Executar =====
carregarAdmin();
// ============================================================
// ClubManager - Página de Clubes
// ============================================================
// Este ficheiro trata do formulário de registo de clubes.
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";

// ===== 1. Verificar autenticação =====
exigirAutenticacao();

// ===== 2. Tornar o logout acessível =====
window.sair = logout;

// ===== 3. Renderizar o layout =====
document.querySelector("#app-header").innerHTML = renderHeader();

document.querySelector("#app-sidebar").innerHTML = renderSidebar(
  "../clubes/lista.html",
  [
    { href: "../../dashboards/admin.html", icone: "📊", label: "Dashboard" },
    { href: "../clubes/lista.html", icone: "🏟️", label: "Clubes" },
    { href: "../admins/lista.html", icone: "👤", label: "Administradores" },
    { href: "../logs/lista.html", icone: "📄", label: "Logs de Auditoria" },
  ]
);

// ===== 4. Apanhar o formulário =====
const form = document.querySelector("#form-clube");

// ===== 5. Quando o formulário é submetido =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.querySelector("#btn-submeter");
  const erroEl = document.querySelector("#form-erro");

  // 5.1. Ler os valores
  const dados = {
    nome: document.querySelector("#nome").value.trim(),
    sigla: document.querySelector("#sigla").value.trim().toUpperCase(),
    dataFundacao: document.querySelector("#dataFundacao").value || null,
    telefone: document.querySelector("#telefone").value.trim() || null,
    email: document.querySelector("#email").value.trim() || null,
    endereco: document.querySelector("#endereco").value.trim() || null,
    logotipo: document.querySelector("#logotipo").value.trim() || null,
  };

  // 5.2. Validação básica no cliente
  if (dados.nome.length < 2) {
    mostrarErro(erroEl, "O nome do clube deve ter pelo menos 2 caracteres.");
    return;
  }

  if (dados.sigla.length < 2) {
    mostrarErro(erroEl, "A sigla deve ter pelo menos 2 caracteres.");
    return;
  }

  // 5.3. Reset do estado
  erroEl.style.display = "none";
  btn.disabled = true;
  btn.textContent = "A guardar...";

  try {
    // 5.4. Enviar ao backend
    const clube = await apiRequest("/clubes", "POST", dados);

    console.log("Clube criado:", clube);

    // 5.5. Sucesso → redirecionar
    alert(`Clube "${clube.nome}" registado com sucesso!`);
    window.location.href = "lista.html";

  } catch (erro) {
    console.error("Erro ao criar clube:", erro);
    mostrarErro(erroEl, erro.message || "Erro ao criar o clube.");
    btn.disabled = false;
    btn.textContent = "Guardar Clube";
  }
});

// ===== 6. Mostrar erro =====
function mostrarErro(el, mensagem) {
  el.textContent = mensagem;
  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}
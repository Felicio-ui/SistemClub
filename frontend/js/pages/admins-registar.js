// ============================================================
// ClubManager - Página de Registo de Administradores
// ============================================================
// Este ficheiro trata do formulário de registo de admins.
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";

// ===== 1. Verificar autenticação =====
exigirAutenticacao();

// ===== 2. Tornar o logout acessível =====
window.sair = logout;

// ===== 3. Renderizar layout =====
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

// ===== 4. Apanhar o formulário =====
const form = document.querySelector("#form-admin");

// ===== 5. Quando é submetido =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.querySelector("#btn-submeter");
  const erroEl = document.querySelector("#form-erro");

  // 5.1. Ler os valores
  const nome = document.querySelector("#nome").value.trim();
  const apelido = document.querySelector("#apelido").value.trim();
  const email = document.querySelector("#email").value.trim();
  const senha = document.querySelector("#senha").value;
  const confirmarSenha = document.querySelector("#confirmarSenha").value;

  // 5.2. Validações no cliente
  if (nome.length < 2) {
    mostrarErro(erroEl, "O nome deve ter pelo menos 2 caracteres.");
    return;
  }

  if (!email.includes("@")) {
    mostrarErro(erroEl, "O email é inválido.");
    return;
  }

  if (senha.length < 6) {
    mostrarErro(erroEl, "A palavra-passe deve ter pelo menos 6 caracteres.");
    return;
  }

  if (senha !== confirmarSenha) {
    mostrarErro(erroEl, "As palavras-passe não coincidem.");
    return;
  }

  // 5.3. Reset do estado
  erroEl.style.display = "none";
  btn.disabled = true;
  btn.textContent = "A guardar...";

  // 5.4. Preparar os dados
  const dados = {
    nome,
    apelido: apelido || null,
    email,
    senha,
  };

  try {
    // 5.5. Enviar ao backend
    const admin = await apiRequest("/admins", "POST", dados);
    console.log("Admin criado:", admin);

    // 5.6. Sucesso → redirecionar
    alert(`Administrador "${admin.nome}" criado com sucesso!`);
    window.location.href = "lista.html";

  } catch (erro) {
    console.error("Erro ao criar admin:", erro);
    mostrarErro(erroEl, erro.message || "Erro ao criar o administrador.");
    btn.disabled = false;
    btn.textContent = "Guardar Administrador";
  }
});

// ===== 6. Mostrar erro =====
function mostrarErro(el, mensagem) {
  el.textContent = mensagem;
  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}
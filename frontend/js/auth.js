// ============================================================
// ClubManager - Autenticação
// ============================================================
// Este ficheiro trata do login, logout e verificação de sessão.
// Todas as páginas usam estas funções.
// ============================================================

import { CONFIG } from "./config.js";
import { apiRequest } from "./api.js";

// ===== Fazer login =====
// Envia email + senha ao backend, guarda token e user no localStorage
export async function login(email, senha) {
  const dados = await apiRequest("/auth/login", "POST", { email, senha });

  // Guardar o token e o utilizador
  localStorage.setItem(CONFIG.TOKEN_KEY, dados.token);
  localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(dados));

  return dados;
}

// ===== Obter caminho relativo para o index.html =====
function obterCaminhoIndex() {
  const path = window.location.pathname;
  if (path.includes("/pages/")) {
    return "../../index.html";
  }
  if (path.includes("/dashboards/")) {
    return "../index.html";
  }
  return "index.html";
}

// ===== Fazer logout =====
// Apaga tudo do localStorage e volta ao login
export function logout() {
  localStorage.removeItem(CONFIG.TOKEN_KEY);
  localStorage.removeItem(CONFIG.USER_KEY);

  // Descobrir o caminho para o index.html
  const caminho = window.location.pathname.includes("/pages/")
    ? "../../index.html"
    : "../index.html";

  window.location.href = caminho;
  window.location.href = obterCaminhoIndex();
}

// ===== Verificar se está autenticado =====
// Devolve true se houver token, false se não
export function estaAutenticado() {
  return localStorage.getItem(CONFIG.TOKEN_KEY) !== null;
}

// ===== Obter o utilizador atual =====
// Devolve o objeto { token, tipo, email, perfil, nome } ou null
export function obterUtilizador() {
  const json = localStorage.getItem(CONFIG.USER_KEY);
  return json ? JSON.parse(json) : null;
}

// ===== Exigir autenticação =====
// Se NÃO estiver autenticado, redireciona para o login
// Usar no início de cada página protegida
export function exigirAutenticacao() {
  if (!estaAutenticado()) {
    const caminho = window.location.pathname.includes("/pages/")
      ? "../../index.html"
      : "../index.html";

    window.location.href = caminho;
    window.location.href = obterCaminhoIndex();
  }
}
// ============================================================
// ClubManager - Comunicação com o Backend
// ============================================================
// Este ficheiro faz TODOS os pedidos HTTP ao servidor.
// Nenhuma página faz fetch diretamente — todas usam apiRequest().
// ============================================================

import { CONFIG } from "./config.js";

// ===== Pedido genérico à API =====
// endpoint: "/clubes", "/auth/login", "/membros/5", ...
// method:   "GET", "POST", "PUT", "DELETE"
// dados:    objeto JavaScript (opcional) — será convertido em JSON
export async function apiRequest(endpoint, method = "GET", dados = null) {
  // 1. Apanhar o token do localStorage
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);

  // 2. Preparar as opções do fetch
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // 3. Se houver token, adicionar ao header Authorization
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  // 4. Se houver dados, converter para JSON
  if (dados) {
    options.body = JSON.stringify(dados);
  }

  // 5. Fazer o pedido
  const response = await fetch(`${CONFIG.API_URL}${endpoint}`, options);

  // 6. Se o token expirou (401), limpar e voltar ao login
  if (response.status === 401) {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);

    const path = window.location.pathname;
    const caminho = path.includes("/pages/")
      ? "../../index.html"
      : path.includes("/dashboards/")
      ? "../index.html"
      : "index.html";

    window.location.href = caminho;
    return;
  }

  // 7. Se a resposta não for OK (404, 500, ...), lançar erro
  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.message || `Erro ${response.status}`);
  }

  // 8. Se não houver corpo (ex: DELETE devolve 204), devolver null
  if (response.status === 204) {
    return null;
  }

  // 9. Devolver os dados em JSON
  return response.json();
}
// ============================================================
// ClubManager - Página de Logs de Auditoria
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";
import { escaparHTML } from "../utils.js";

// ===== 1. Autenticação =====
exigirAutenticacao();
window.sair = logout;

// ===== 2. Layout =====
document.querySelector("#app-header").innerHTML = renderHeader();

document.querySelector("#app-sidebar").innerHTML = renderSidebar(
  "../logs/lista.html",
  [
    { href: "../../dashboards/admin.html", icone: "📊", label: "Dashboard" },
    { href: "../clubes/lista.html", icone: "🏟️", label: "Clubes" },
    { href: "../admins/lista.html", icone: "👤", label: "Administradores" },
    { href: "../logs/lista.html", icone: "📄", label: "Logs de Auditoria" },
  ]
);

// ===== 3. Variáveis =====
let todosLogs = [];

// ===== 4. Cores das ações =====
function corAcao(acao) {
  const cores = {
    LOGIN: "badge-info",
    CRIAR: "badge-success",
    EDITAR: "badge-warning",
    APAGAR: "badge-danger",
  };
  return cores[acao] || "badge";
}

// ===== 5. Ícone da ação =====
function iconeAcao(acao) {
  const icones = {
    LOGIN: "🔐",
    CRIAR: "➕",
    EDITAR: "✏️",
    APAGAR: "🗑️",
  };
  return icones[acao] || "📄";
}

// ===== 6. Formatar data/hora =====
function formatarDataHora(data) {
  if (!data) return "—";
  const d = new Date(data);
  return d.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ===== 7. Carregar logs =====
window.carregarLogs = async function () {
  const tbody = document.querySelector("#tabela-logs tbody");
  const info = document.querySelector("#table-info");

  tbody.innerHTML = `<tr><td colspan="6" class="text-center">A carregar...</td></tr>`;
  info.textContent = "A carregar...";

  try {
    todosLogs = await apiRequest("/logs");
    renderizarTabela(todosLogs);
  } catch (erro) {
    console.error("Erro ao carregar logs:", erro);
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Erro ao carregar logs.</td></tr>`;
    info.textContent = "Erro ao carregar.";
    mostrarAlerta("Erro ao carregar os logs: " + erro.message, "danger");
  }
};

// ===== 8. Renderizar tabela =====
function renderizarTabela(logs) {
  const tbody = document.querySelector("#tabela-logs tbody");
  const info = document.querySelector("#table-info");

  // Contador
  if (logs.length === 0) {
    info.textContent = "Nenhum log encontrado.";
  } else if (logs.length === 1) {
    info.textContent = "1 log encontrado.";
  } else {
    info.textContent = `${logs.length} logs encontrados.`;
  }

  // Caso vazio
  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">Nenhum log registado ainda.</td>
      </tr>
    `;
    return;
  }

  // Linhas
  tbody.innerHTML = logs
    .map((log, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <span class="badge ${corAcao(log.acao)}">
            ${iconeAcao(log.acao)} ${escaparHTML(log.acao)}
          </span>
        </td>
        <td>
          <strong>${escaparHTML(log.entidade || "—")}</strong>
          ${log.entidadeId ? `<br><small style="opacity: 0.6;">ID: ${log.entidadeId}</small>` : ""}
        </td>
        <td>${escaparHTML(log.detalhes || "—")}</td>
        <td><code style="font-size: 11px; opacity: 0.8;">${escaparHTML(log.ipOrigem || "—")}</code></td>
        <td>${formatarDataHora(log.dataHora)}</td>
      </tr>
    `)
    .join("");
}

// ===== 9. Pesquisa e filtros =====
document.querySelector("#pesquisa").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-acao").addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const termo = document.querySelector("#pesquisa").value.toLowerCase().trim();
  const acao = document.querySelector("#filtro-acao").value;

  let filtrados = todosLogs;

  if (acao) {
    filtrados = filtrados.filter((l) => l.acao === acao);
  }

  if (termo) {
    filtrados = filtrados.filter((l) => {
      const texto = `${l.detalhes || ""} ${l.entidade || ""}`.toLowerCase();
      return texto.includes(termo);
    });
  }

  renderizarTabela(filtrados);
}

// ===== 10. Executar =====
carregarLogs();
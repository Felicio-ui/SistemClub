// ============================================================
// ClubManager - Página do Dashboard do Administrador
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";
import { formatarData, escaparHTML, corDoEstado } from "../utils.js";

// ===== 1. Verificar autenticação =====
exigirAutenticacao();

// ===== 2. Tornar o logout acessível =====
window.sair = logout;

// ===== 3. Data de hoje =====
const hoje = new Date();
document.querySelector("#data-hoje").textContent =
  hoje.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ===== 4. Renderizar o header =====
document.querySelector("#app-header").innerHTML = renderHeader();

// ===== 5. Renderizar a sidebar =====
document.querySelector("#app-sidebar").innerHTML = renderSidebar(
  "admin.html",
  [
    { href: "admin.html", icone: "📊", label: "Dashboard" },
    { href: "../pages/clubes/lista.html", icone: "🏟️", label: "Clubes" },
    { href: "../pages/admins/lista.html", icone: "👤", label: "Administradores" },
    { href: "../pages/logs/lista.html", icone: "📄", label: "Logs de Auditoria" },
  ]
);

// ===== 6. Carregar dados do dashboard =====
async function carregarDashboard() {
  try {
    const clubes = await apiRequest("/clubes");
    const clubesAtivos = clubes.filter((c) => c.estado === "Ativo");
    const clubesInativos = clubes.filter((c) => c.estado === "Inativo");

    document.querySelector("#total-clubes").textContent = clubes.length;
    document.querySelector("#clubes-ativos").textContent = clubesAtivos.length;
    document.querySelector("#clubes-inativos").textContent = clubesInativos.length;

    // Últimos 5 clubes
    const ultimosClubes = [...clubes]
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
      .slice(0, 5);

    renderizarTabelaClubes(ultimosClubes);

    // Admins
    try {
      const admins = await apiRequest("/admins");
      document.querySelector("#total-admins").textContent = admins.length;
    } catch {
      document.querySelector("#total-admins").textContent = "—";
    }

  } catch (erro) {
    console.error("Erro ao carregar dashboard:", erro);
    mostrarAlerta("Erro ao carregar os dados: " + erro.message, "danger");
  }
}

// ===== 7. Tabela de clubes =====
function renderizarTabelaClubes(clubes) {
  const tbody = document.querySelector("#tabela-clubes tbody");

  if (clubes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum clube registado.</td></tr>`;
    return;
  }

  tbody.innerHTML = clubes
    .map(
      (c) => `
      <tr>
        <td>${escaparHTML(c.nome)}</td>
        <td>${escaparHTML(c.sigla)}</td>
        <td><span class="badge ${corDoEstado(c.estado)}">${escaparHTML(c.estado)}</span></td>
        <td>${formatarData(c.criadoEm)}</td>
        <td class="text-right">
          <a href="../pages/clubes/detalhe.html?id=${c.id}" class="btn btn-sm btn-outline">Ver</a>
        </td>
      </tr>
    `
    )
    .join("");
}

// ===== 8. Executar =====
carregarDashboard();
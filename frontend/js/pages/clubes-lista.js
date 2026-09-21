// ============================================================
// ClubManager - Página da Lista de Clubes
// ============================================================
// Este ficheiro carrega, pesquisa, filtra e permite
// gerir todos os clubes da plataforma.
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout, obterUtilizador } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";
import { formatarData, escaparHTML, corDoEstado } from "../utils.js";

// ===== 1. Verificar autenticação =====
exigirAutenticacao();

// ===== 2. Tornar o logout acessível =====
window.sair = logout;

// ===== 3. Saber se o utilizador é admin =====
const user = obterUtilizador();
const isAdmin = user?.perfil === "ADMIN";

// ===== 4. Renderizar o layout =====
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

// ===== 5. Variáveis globais =====
let todosClubes = [];

// ===== 6. Carregar os clubes =====
async function carregarClubes() {
  const tbody = document.querySelector("#tabela-clubes tbody");
  const info = document.querySelector("#table-info");

  tbody.innerHTML = `<tr><td colspan="6" class="text-center">A carregar...</td></tr>`;
  info.textContent = "A carregar...";

  try {
    todosClubes = await apiRequest("/clubes");
    renderizarTabela(todosClubes);
  } catch (erro) {
    console.error("Erro ao carregar clubes:", erro);
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Erro ao carregar clubes.</td></tr>`;
    info.textContent = "Erro ao carregar.";
    mostrarAlerta("Erro ao carregar os clubes: " + erro.message, "danger");
  }
}

// ===== 7. Renderizar a tabela =====
function renderizarTabela(clubes) {
  const tbody = document.querySelector("#tabela-clubes tbody");
  const info = document.querySelector("#table-info");

  // Atualizar contador
  if (clubes.length === 0) {
    info.textContent = "Nenhum clube encontrado.";
  } else if (clubes.length === 1) {
    info.textContent = "1 clube encontrado.";
  } else {
    info.textContent = `${clubes.length} clubes encontrados.`;
  }

  // Caso vazio
  if (clubes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          Nenhum clube registado.
          <a href="registar.html" style="color: #60a5fa;">Registar o primeiro clube</a>
        </td>
      </tr>
    `;
    return;
  }

  // Renderizar linhas
  tbody.innerHTML = clubes
    .map((c, index) => {
      // Botões de ação
      const botaoEstado = c.estado === "Ativo"
        ? `<button class="btn btn-sm btn-warning" onclick="desativarClube(${c.id})">Desativar</button>`
        : `<button class="btn btn-sm btn-success" onclick="ativarClube(${c.id})">Ativar</button>`;

      const botaoApagar = isAdmin
        ? `<button class="btn btn-sm btn-danger" onclick="apagarClube(${c.id})">Apagar</button>`
        : "";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escaparHTML(c.nome)}</td>
          <td><strong>${escaparHTML(c.sigla)}</strong></td>
          <td><span class="badge ${corDoEstado(c.estado)}">${escaparHTML(c.estado)}</span></td>
          <td>${formatarData(c.criadoEm)}</td>
          <td class="text-right">
            <div class="table-actions">
              <a href="detalhe.html?id=${c.id}" class="btn btn-sm btn-outline">Ver</a>
              <a href="editar.html?id=${c.id}" class="btn btn-sm btn-primary">Editar</a>
              ${botaoEstado}
              ${botaoApagar}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

// ===== 8. Pesquisa em tempo real =====
document.querySelector("#pesquisa").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const termo = document.querySelector("#pesquisa").value.toLowerCase().trim();
  const estado = document.querySelector("#filtro-estado").value;

  let filtrados = todosClubes;

  // Filtrar por estado
  if (estado) {
    filtrados = filtrados.filter((c) => c.estado === estado);
  }

  // Filtrar por termo (nome ou sigla)
  if (termo) {
    filtrados = filtrados.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.sigla.toLowerCase().includes(termo)
    );
  }

  renderizarTabela(filtrados);
}

// ===== 9. Ativar clube =====
window.ativarClube = async function (id) {
  if (!confirm("Tens a certeza que queres ativar este clube?")) return;

  try {
    await apiRequest(`/clubes/${id}/estado?valor=Ativo`, "PATCH");
    mostrarAlerta("Clube ativado com sucesso!", "success");
    carregarClubes();
  } catch (erro) {
    console.error("Erro ao ativar clube:", erro);
    mostrarAlerta("Erro ao ativar: " + erro.message, "danger");
  }
};

// ===== 10. Desativar clube =====
window.desativarClube = async function (id) {
  if (!confirm("Tens a certeza que queres desativar este clube?")) return;

  try {
    await apiRequest(`/clubes/${id}/estado?valor=Inativo`, "PATCH");
    mostrarAlerta("Clube desativado com sucesso!", "success");
    carregarClubes();
  } catch (erro) {
    console.error("Erro ao desativar clube:", erro);
    mostrarAlerta("Erro ao desativar: " + erro.message, "danger");
  }
};

// ===== 11. Apagar clube =====
window.apagarClube = async function (id) {
  const clube = todosClubes.find((c) => c.id === id);
  const nome = clube?.nome || "este clube";

  if (!confirm(`Tens a certeza que queres apagar "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
    return;
  }

  try {
    await apiRequest(`/clubes/${id}`, "DELETE");
    mostrarAlerta("Clube apagado com sucesso!", "success");

    // Remover da lista local (sem recarregar toda a tabela)
    todosClubes = todosClubes.filter((c) => c.id !== id);
    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao apagar clube:", erro);
    mostrarAlerta("Erro ao apagar: " + erro.message, "danger");
  }
};

// ===== 12. Executar =====
carregarClubes();
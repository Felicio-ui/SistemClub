// ============================================================
// ClubManager - Página da Lista de Administradores
// ============================================================
// Este ficheiro carrega, pesquisa, filtra e permite gerir
// os administradores da plataforma.
// ============================================================

import { apiRequest } from "../api.js";
import { exigirAutenticacao, logout, obterUtilizador } from "../auth.js";
import { renderHeader, renderSidebar, mostrarAlerta } from "../ui.js";
import { formatarData, escaparHTML, corDoEstado } from "../utils.js";

// ===== 1. Verificar autenticação =====
exigirAutenticacao();

// ===== 2. Tornar o logout acessível =====
window.sair = logout;

// ===== 3. Saber quem está autenticado =====
const userAtual = obterUtilizador();
const isAdmin = userAtual?.perfil === "ADMIN";

// ===== 4. Renderizar o layout =====
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

// ===== 5. Variáveis globais =====
let todosAdmins = [];

// ===== 6. Carregar os admins =====
async function carregarAdmins() {
  const tbody = document.querySelector("#tabela-admins tbody");
  const info = document.querySelector("#table-info");

  tbody.innerHTML = `<tr><td colspan="6" class="text-center">A carregar...</td></tr>`;
  info.textContent = "A carregar...";

  try {
    todosAdmins = await apiRequest("/admins");
    renderizarTabela(todosAdmins);
  } catch (erro) {
    console.error("Erro ao carregar admins:", erro);
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Erro ao carregar administradores.</td></tr>`;
    info.textContent = "Erro ao carregar.";
    mostrarAlerta("Erro ao carregar os administradores: " + erro.message, "danger");
  }
}

// ===== 7. Renderizar a tabela =====
function renderizarTabela(admins) {
  const tbody = document.querySelector("#tabela-admins tbody");
  const info = document.querySelector("#table-info");

  // Contador
  if (admins.length === 0) {
    info.textContent = "Nenhum administrador encontrado.";
  } else if (admins.length === 1) {
    info.textContent = "1 administrador encontrado.";
  } else {
    info.textContent = `${admins.length} administradores encontrados.`;
  }

  // Caso vazio
  if (admins.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          Nenhum administrador registado.
          <a href="registar.html" style="color: #60a5fa;">Registar o primeiro</a>
        </td>
      </tr>
    `;
    return;
  }

  // Renderizar linhas
  tbody.innerHTML = admins
    .map((a, index) => {
      const nomeCompleto = `${a.nome} ${a.apelido || ""}`.trim();
      const ehProprio = a.email === userAtual?.email;

      // Botão de apagar (não se pode apagar a si mesmo)
      const botaoApagar = isAdmin && !ehProprio
        ? `<button class="btn btn-sm btn-danger" onclick="apagarAdmin(${a.id})">Apagar</button>`
        : "";

      // Botão de editar (não se pode editar a si mesmo)
      const botaoEditar = !ehProprio
        ? `<a href="editar.html?id=${a.id}" class="btn btn-sm btn-primary">Editar</a>`
        : `<span class="badge badge-info">Você</span>`;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${escaparHTML(nomeCompleto)}</strong>
            ${ehProprio ? ' <span class="badge badge-info">Você</span>' : ""}
          </td>
          <td>${escaparHTML(a.email)}</td>
          <td><span class="badge ${corDoEstado(a.estado)}">${escaparHTML(a.estado)}</span></td>
          <td>${formatarData(a.criadoEm)}</td>
          <td class="text-right">
            <div class="table-actions">
              <a href="detalhe.html?id=${a.id}" class="btn btn-sm btn-outline">Ver</a>
              ${botaoEditar}
              ${botaoApagar}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

// ===== 8. Pesquisa e filtros =====
document.querySelector("#pesquisa").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const termo = document.querySelector("#pesquisa").value.toLowerCase().trim();
  const estado = document.querySelector("#filtro-estado").value;

  let filtrados = todosAdmins;

  // Filtrar por estado
  if (estado) {
    filtrados = filtrados.filter((a) => a.estado === estado);
  }

  // Filtrar por termo (nome, apelido ou email)
  if (termo) {
    filtrados = filtrados.filter((a) => {
      const nomeCompleto = `${a.nome} ${a.apelido || ""}`.toLowerCase();
      return nomeCompleto.includes(termo) || a.email.toLowerCase().includes(termo);
    });
  }

  renderizarTabela(filtrados);
}

// ===== 9. Apagar admin =====
window.apagarAdmin = async function (id) {
  const admin = todosAdmins.find((a) => a.id === id);
  const nome = admin?.nome || "este administrador";

  if (!confirm(`Tens a certeza que queres apagar "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
    return;
  }

  try {
    await apiRequest(`/admins/${id}`, "DELETE");
    mostrarAlerta("Administrador apagado com sucesso!", "success");

    // Remover da lista local
    todosAdmins = todosAdmins.filter((a) => a.id !== id);
    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao apagar admin:", erro);
    mostrarAlerta("Erro ao apagar: " + erro.message, "danger");
  }
};

// ===== 10. Executar =====
carregarAdmins();
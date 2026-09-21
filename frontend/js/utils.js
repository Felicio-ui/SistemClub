// ============================================================
// ClubManager - Funções Auxiliares
// ============================================================
// Este ficheiro tem funções pequenas que são usadas em
// várias páginas (formatação, segurança, cores).
// ============================================================

// ===== Formatar data =====
// Ex: "2026-09-13" → "13/09/2026"
export function formatarData(data) {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-PT");
}

// ===== Formatar moeda =====
// Ex: 1500 → "1 500,00 MT"
export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  }).format(valor);
}

// ===== Escapar HTML =====
// Evita que dados do utilizador injetem código na página (XSS)
export function escaparHTML(texto) {
  if (!texto) return "";
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ===== Cor do badge conforme o estado =====
// Ex: "Ativo" → "badge-success"
export function corDoEstado(estado) {
  const cores = {
    Ativo: "badge-success",
    Suspenso: "badge-warning",
    Inativo: "badge-danger",
  };
  return cores[estado] || "badge";
}
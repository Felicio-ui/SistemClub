// ============================================================
// ClubManager - Página de Login
// ============================================================
// Este ficheiro trata do formulário de login.
// É carregado pelo index.html.
// ============================================================

import { login } from "../auth.js";

// ===== Apanhar o formulário =====
const form = document.querySelector("#login-form");

// ===== Quando o formulário é submetido =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Ler os valores dos campos
  const email = document.querySelector("#email").value.trim();
  const senha = document.querySelector("#password").value;

  // 2. Apanhar o botão e o espaço de erro
  const btn = document.querySelector(".btn-login");
  const erroEl = document.querySelector("#login-error") || criarErroEl();

  // 3. Resetar o estado
  erroEl.style.display = "none";
  btn.disabled = true;
  btn.textContent = "A entrar...";

  try {
    // 4. Tentar fazer login
    const user = await login(email, senha);

    // 5. Redirecionar conforme o perfil
    const dashboards = {
      ADMIN: "dashboards/admin.html",
      PRESIDENTE: "dashboards/presidente.html",
      TESOUREIRO: "dashboards/tesoureiro.html",
      SECRETARIO: "dashboards/secretario.html",
      TREINADOR: "dashboards/treinador.html",
      DISCIPLINA: "dashboards/disciplina.html",
      JOGADOR: "dashboards/jogador.html",
      APOIANTE: "dashboards/apoiante.html",
    };

    const destino = dashboards[user.perfil] || "dashboards/admin.html";
    window.location.href = destino;

  } catch (erro) {
    // 6. Se falhou, mostrar o erro
    console.error("Erro no login:", erro);
    erroEl.textContent = erro.message || "Email ou senha incorretos.";
    erroEl.style.display = "block";
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});

// ===== Criar o elemento de erro (se não existir) =====
function criarErroEl() {
  const div = document.createElement("div");
  div.id = "login-error";
  div.className = "alert alert-danger";
  div.style.display = "none";
  document.querySelector(".login-form").prepend(div);
  return div;
}
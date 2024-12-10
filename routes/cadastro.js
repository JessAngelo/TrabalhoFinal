const express = require("express");
const router = express.Router();

// Inicializa a lista global de usuários
if (!global.usuarios) {
  global.usuarios = [];
}

// Rota para o formulário de cadastro
router.get("/", (req, res) => {
  res.render("cadastro", { error: null });
});

// Rota para processar o formulário de cadastro
router.post("/", (req, res) => {
  const { nome, nascimento, email, nickname, senha } = req.body;

  // Validação: Verifica se o usuário ou e-mail já existe
  const usuarioExistente = global.usuarios.find(
    (user) => user.nickname === nickname || user.email === email
  );

  if (usuarioExistente) {
    return res.render("cadastro", {
      error: "Usuário ou e-mail já cadastrados!",
    });
  }

  // Adiciona o novo usuário
  global.usuarios.push({
    nome,
    nascimento,
    email,
    nickname,
    senha,
  });

  res.redirect("/cadastro/usuarios");
});

// Rota para exibir a lista de usuários cadastrados
router.get("/usuarios", (req, res) => {
  res.render("usuarios", { users: global.usuarios });
});

module.exports = router;

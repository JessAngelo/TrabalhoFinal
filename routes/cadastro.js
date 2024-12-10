const express = require("express");
const router = express.Router();

if (!global.usuarios) {
  global.usuarios = [];
}

router.get("/", (req, res) => {
  res.render("cadastro", { error: null });
});

router.post("/", (req, res) => {
  const { nome, nascimento, email, nickname, senha } = req.body;

  const usuarioExistente = global.usuarios.find(
    (user) => user.nickname === nickname || user.email === email
  );

  if (usuarioExistente) {
    return res.render("cadastro", {
      error: "Usuário ou e-mail já cadastrados!",
    });
  }

  global.usuarios.push({
    nome,
    nascimento,
    email,
    nickname,
    senha,
  });

  res.redirect("/cadastro/usuarios");
});

router.get("/usuarios", (req, res) => {
  res.render("usuarios", { users: global.usuarios });
});

module.exports = router;

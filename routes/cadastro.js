const express = require("express");
const router = express.Router();

if (!global.usuarios) {
  global.usuarios = [];
}

router.get("/", (req, res) => {
  res.render("cadastro", { users: global.usuarios, error: null });
});

router.post("/", (req, res) => {
  const { nome, nascimento, nickname, senha } = req.body;

  const usuarioExistente = global.usuarios.find((user) => user.nickname === nickname);

  if (usuarioExistente) {
    return res.render("cadastro", {
      users: global.usuarios,
      error: "Nome de usuário já existe!",
    });
  }

  global.usuarios.push({
    nome,
    nascimento,
    nickname,
    senha,
  });

  res.redirect("/cadastro");
});

module.exports = router;

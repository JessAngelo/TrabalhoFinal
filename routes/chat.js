const express = require("express");
const router = express.Router();

global.mensagens = [];

global.usuarios = []; 

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/"); 
  }

 
  res.render("chat", { 
    mensagens: global.mensagens, 
    error: null, 
    users: global.usuarios, 
    sessionUser: req.session.user 
  });
});


router.post("/postar", (req, res) => {
  const { mensagem, destinatario } = req.body;

  if (!mensagem) {
    return res.render("chat", {
      mensagens: global.mensagens,
      error: "A mensagem não pode estar vazia!",
      users: global.usuarios,
      sessionUser: req.session.user
    });
  }

  global.mensagens.push({
    usuario: req.session.user,
    mensagem,
    destinatario: destinatario || null,
    dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  });
  res.redirect("/chat"); 
});

module.exports = router;

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const app = express();

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "bate-papo-secreto",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);

app.use(express.static(path.join(__dirname, "public")));

const cadastroRoutes = require("./routes/cadastro");
const chatRoutes = require("./routes/chat");

app.use("/cadastro", cadastroRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Verifica se existe algum usuário
  if (!global.usuarios) {
    global.usuarios = [];
  }

  const usuario = global.usuarios.find(
    (user) => user.nickname === username && user.senha === password
  );

  if (usuario) {
    req.session.user = username;
    res.cookie(
      "lastAccess",
      new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    );
    res.redirect("/menu");
  } else {
    res.render("login", { error: "Usuário ou senha inválidos!" });
  }
});

app.get("/menu", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const lastAccess = req.cookies.lastAccess || "Primeiro acesso!";
  res.render("menu", { user: req.session.user, lastAccess });
});

app.get("/usuarios", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/"); // Redireciona para a tela de login se não estiver logado
  }

  // Renderiza a lista de usuários ou uma mensagem caso não haja usuários cadastrados
  const usuarios = global.usuarios || [];
  res.render("usuarios", {
    users: usuarios,
    error: usuarios.length === 0 ? "Nenhum usuário cadastrado!" : null,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

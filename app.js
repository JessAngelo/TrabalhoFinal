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
    cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutos
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Rotas
const cadastroRoutes = require("./routes/cadastro");
const chatRoutes = require("./routes/chat");

app.use("/cadastro", cadastroRoutes);
app.use("/chat", chatRoutes);

// Tela de login
app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;


  const usuario = global.usuarios.find(
    (user) => user.nickname === username && user.senha === password
  );

  if (usuario) {
    req.session.user = username; 
    res.cookie("lastAccess", new Date().toLocaleString());
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

app.get("/logout", (req, res) => {
  req.session.destroy(); 
  res.redirect("/");
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

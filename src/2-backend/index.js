const express = require("express");
// const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Server configuration
const app = express();

const HOSTNAME = "127.0.0.1";
const PORT = 5000;

// Routes import
const usuariosRoute = require("./routes/v1/usuarios");
const eixosRoute = require("./routes/v1/eixos");
const opcoesRoute = require("./routes/v1/opcoes");
const questoesRoute = require("./routes/v1/questoes");
const escolasRoute = require("./routes/v1/escolas");
const questionariosRoute = require("./routes/v1/questionarios");

// Application middlewares
app.use(express.json());

// Application Paths
app.use("/usuarios", usuariosRoute);
app.use("/eixos", eixosRoute);
app.use("/opcoes", opcoesRoute);
app.use("/questoes", questoesRoute);
app.use("/escolas", escolasRoute);
app.use("/questionarios", questionariosRoute);

// Server Application
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Server configuration
const app = express();

const HOSTNAME = "127.0.0.1";
const PORT = 5000;

/* Servidor aplicação */

app.use(express.static("../1-frontend/"));

// Routes import
const usuariosRoute = require("./routes/v1/usuarios");
const eixosRoute = require("./routes/v1/eixos");
const opcoesRoute = require("./routes/v1/opcoes");
const questoesRoute = require("./routes/v1/questoes");
const escolasRoute = require("./routes/v1/escolas");
const questionariosRoute = require("./routes/v1/questionarios");
const respostasRoute = require("./routes/v1/respostas");
const dominiosRoute = require("./routes/v1/dominios");
const agendasRoute = require("./routes/v1/agendas");

// Application middlewares
app.use(express.json());

// Application Paths
app.use("/usuarios", urlencodedParser, usuariosRoute);
app.use("/eixos", urlencodedParser, eixosRoute);
app.use("/opcoes", urlencodedParser, opcoesRoute);
app.use("/questoes", urlencodedParser, questoesRoute);
app.use("/escolas", urlencodedParser, escolasRoute);
app.use("/questionarios", urlencodedParser, questionariosRoute);
app.use("/respostas", urlencodedParser, respostasRoute)
app.use("/dominios", urlencodedParser, dominiosRoute);
app.use("/agendas", urlencodedParser, agendasRoute);

// Server Application
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});

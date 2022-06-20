const express = require("express");

// Router Controllers
const {
    createResposta,
  } = require("../../controllers/respostasController");
  const router = express.Router();

  // controler

//   // GET requests
// router.get("/list", listResposta);

// router.get("/resposta/:idResposta", listRespostaId);

// router.get(
//   "/resposta/:idResposta/respostas",
//   listRespostaResposta
// );

// router.get(
//   "/resposta/:idQuestionario/pergunta/eixo/:idEixo",
//   listRespostaRespostasByEixo
// );

// POST requests
router.post("/create", createResposta);

// router.post("/close", setRespostaAsComplete);

module.exports = router;
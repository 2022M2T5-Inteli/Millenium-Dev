const express = require("express");

// Router Controllers
const {
  listQuestionarios,
  listQuestionarioById,
  listQuestionarioRespostas,
  listQuestionarioRespostasByEixo,
  createQuestionario,
  setQuestionarioAsComplete,
} = require("../../controllers/questionariosController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listQuestionarios);

router.get("/questionario/:idQuestionario", listQuestionarioById);

router.get(
  "/questionario/:idQuestionario/respostas",
  listQuestionarioRespostas
);

router.get(
  "/questionario/:idQuestionario/respostas/eixo/:idEixo",
  listQuestionarioRespostasByEixo
);

// POST requests
router.post("/create", createQuestionario);

router.post("/close", setQuestionarioAsComplete);

module.exports = router;

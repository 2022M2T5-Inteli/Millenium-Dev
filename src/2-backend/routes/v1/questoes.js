const express = require("express");

// Router Controllers
const {
  listQuestoes,
  listQuestoesByEixo,
  createQuestao,
  updateQuestao,
  disableQuestao,
  getQuestaoById,
  getQuestaoOpcoes,
  listQuestoesByDominio,
} = require("../../controllers/questoesController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listQuestoes);

router.get("/eixo/:idEixo", listQuestoesByEixo);

router.get("/dominio/:idDominio", listQuestoesByDominio);

router.get("/questao/:idQuestao", getQuestaoById);

router.get("/questao/:idQuestao/opcoes", getQuestaoOpcoes);

// POST requests
router.post("/create", createQuestao);

router.post("/update", updateQuestao);

router.post("/disable", disableQuestao);

module.exports = router;

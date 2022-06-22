const express = require("express");

// Router Controllers
const {
  listOpcoes,
  createOpcao,
  updateOpcao,
  disableOpcao,
  listOpcoesByQuestao,

} = require("../../controllers/opcoesController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listOpcoes);
router.get("/listByQustao/:idQuestao", listOpcoesByQuestao);

// // POST requests
router.post("/create", createOpcao);

router.post("/update", updateOpcao);

router.post("/disable", disableOpcao);

module.exports = router;

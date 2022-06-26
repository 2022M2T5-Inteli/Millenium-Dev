const express = require("express");

// Router Controllers
const {
  listEscolaById,
  listEscolas,
  listEscolaQuestionarios,
  createEscola,
  updateEscola,
  deleteEscola,
} = require("../../controllers/escolasController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listEscolas);

router.get("/escola/:idEscola", listEscolaById);

router.get("/escola/:idEscola/questionarios", listEscolaQuestionarios);

// POST requests
router.post("/create", createEscola);

router.post("/update", updateEscola);

router.post("/delete", deleteEscola);

module.exports = router;

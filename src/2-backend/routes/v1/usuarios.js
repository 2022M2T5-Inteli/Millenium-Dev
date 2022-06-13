const express = require("express");
const router = express.Router();


// Router Controllers
const {
  getUsuarioEscola,
  getUsuarioRede,
  getUsuarioFalconi,
  createUsuarioEscola,
  createUsuarioRede,
  createUsuarioFalconi,
} = require("../../controllers/usuariosController");

// GET requests
router.get("/falconi/:usuarioId", getUsuarioFalconi);

router.get("/escola/:usuarioId", getUsuarioEscola);

router.get("/rede/:usuarioId", getUsuarioRede);

// POST requests
router.post("/falconi", createUsuarioFalconi);

router.post("/escola", createUsuarioEscola);

router.post("/rede", createUsuarioRede);

module.exports = router;

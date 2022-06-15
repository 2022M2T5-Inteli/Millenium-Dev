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
  loginRede,
} = require("../../controllers/usuariosController");

// GET requests
router.get("/falconi/:usuarioId", getUsuarioFalconi);

router.get("/escola/:usuarioId", getUsuarioEscola);

router.get("/rede/:usuarioId", getUsuarioRede);

// POST requests
router.post("/falconi/create", createUsuarioFalconi);

router.post("/escola/create", createUsuarioEscola);

router.post("/rede/create", createUsuarioRede);

router.post("/rede/login", loginRede);

module.exports = router;

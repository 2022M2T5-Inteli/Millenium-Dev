const express = require("express");

// Router Controllers
const {
  listAgendas,
  agendaCreate,
} = require("../../controllers/agendasController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listAgendas);

// POST requests
router.post("/create", agendaCreate);

module.exports = router;

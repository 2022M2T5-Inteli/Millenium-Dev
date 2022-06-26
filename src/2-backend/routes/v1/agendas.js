const express = require("express");

// Router Controllers
const {
  listAgendas,
} = require("../../controllers/agendasController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listAgendas);


// POST requests

module.exports = router;

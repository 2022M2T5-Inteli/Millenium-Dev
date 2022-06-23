const express = require("express");

// Router Controllers
const { createResposta } = require("../../controllers/respostasController");
const router = express.Router();

// POST requests
router.post("/create", createResposta);

module.exports = router;

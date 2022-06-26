const express = require("express");

// Router Controllers
const {
  listOpcoes,
  createOpcao,
  updateOpcao,
  disableOpcao,
} = require("../../controllers/opcoesController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listOpcoes);

// // POST requests
router.post("/create", createOpcao);

router.post("/update", updateOpcao);

router.post("/disable", disableOpcao);

module.exports = router;

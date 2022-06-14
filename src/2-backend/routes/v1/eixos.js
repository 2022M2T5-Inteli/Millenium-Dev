const express = require("express");

// Router Controllers
const {
  listEixos,
  eixoCreate,
  eixoUpdate,
  eixoDelete,
} = require("../../controllers/eixosController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listEixos);


// POST requests
router.post("/create", eixoCreate);

router.post("/update", eixoUpdate);

router.post("/delete", eixoDelete);

module.exports = router;

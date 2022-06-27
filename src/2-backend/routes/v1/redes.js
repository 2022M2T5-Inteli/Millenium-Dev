const express = require("express");

// Router Controllers
const { listRedes } = require("../../controllers/redesController");
const router = express.Router();

// controller

// GET requests
router.get("/list", listRedes);

module.exports = router;

const express = require("express");
const { postCreateDominio } = require("../../controllers/dominiosController");

const router = express.Router();

// GET Requests

// POST Requests
router.post("/create", postCreateDominio);

module.exports = router;

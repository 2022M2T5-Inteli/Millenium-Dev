const express = require("express");
const { postCreateDominio, postDeleteDominio } = require("../../controllers/dominiosController");

const router = express.Router();

// GET Requests

// POST Requests
router.post("/create", postCreateDominio);
router.post("/delete", postDeleteDominio);

module.exports = router;







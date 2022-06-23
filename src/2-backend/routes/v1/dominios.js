const express = require("express");
const {
  postCreateDominio,
  postDeleteDominio,
  listDominiosByEixo,
} = require("../../controllers/dominiosController");

const router = express.Router();

// GET Requests
router.get("/eixo/:idEixo/list", listDominiosByEixo);

// POST Requests
router.post("/create", postCreateDominio);
router.post("/delete", postDeleteDominio);

module.exports = router;

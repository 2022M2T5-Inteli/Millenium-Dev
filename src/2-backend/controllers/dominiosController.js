const DatabaseAsync = require("sqlite-async");
const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

const {
  createNewDominio,
  deleteNewDominio,
} = require("../models/dominiosModel");

exports.postCreateDominio = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200, respostas: {} };
  try {
    await createNewDominio(request.body.nome, request.body.idEixo);
  } catch (err) {
    responseMessage.code = 500;
    responseMessage.message = err.message;
    responseMessage.trace = err.stack;
  }
  response.statusCode = responseMessage.code;
  response.json(responseMessage);
};

exports.postDeleteDominio = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  // const responseMessage = { message: "success", code: 200, respostas: {} };

  let db = await DatabaseAsync.open(DBPATH);
  let sql = "UPDATE Dominio SET ativada = 0 WHERE id = ?;";
  let sqlRemoveQuestoes = "UPDATE Questao SET ativada = 0 WHERE idDominio = ?;";
  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.idDominio);

  const rows = await db.all(sql, params);
  const _ = await db.all(sqlRemoveQuestoes, params);
  response.statusCode = 200;
  response.json(rows);
  db.close();
};

exports.listDominiosByEixo = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = await DatabaseAsync.open(DBPATH);
  let sql = "SELECT * FROM Dominio d WHERE d.idEixo = ? AND Ativada = 1";
  let params = [];
  params.push(request.params.idEixo);
  const rows = await db.all(sql, params);
  response.statusCode = 200;
  response.json({dominios:rows});
  db.close();
};

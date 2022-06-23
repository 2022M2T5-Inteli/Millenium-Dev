const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.listEixosByAgenda = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Eixo WHERE idAgenda = ? AND ativada = 1";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idAgenda);
  console.log(params);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ eixos: rows });
  });
  db.close();
};

exports.listEixos = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Eixo WHERE ativada = 1";

  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json({ eixos: rows });
  });
  db.close();
};

exports.eixoCreate = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Eixo (nome, idAgenda, maxGrade) VALUES(?,?,?);";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.nome);
  params.push(request.body.idAgenda);
  params.push(request.body.maxGrade);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

exports.eixoUpdate = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "UPDATE Eixo SET nome = ?, idAgenda = ? WHERE id = ?;";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.nome);
  params.push(request.body.idAgenda);
  params.push(request.body.idEixo);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

exports.eixoDelete = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "UPDATE Eixo SET ativada = 0 WHERE id = ?;";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.idEixo);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

const sqlite3 = require("sqlite3").verbose();
const DatabaseAsync = require("sqlite-async");

const DBPATH = "./Database/mainDB.db";

exports.listAgendas = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Agenda WHERE ativada = 1";

  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json({ agendas: rows });
  });
  db.close();
};

exports.agendaCreate = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Agenda (nome, IsConsolidated) VALUES(?,?);";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.nome);
  params.push(request.body.isConsolidated);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

exports.agendaDelete = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = await DatabaseAsync.open(DBPATH);
  let sql = "UPDATE Agenda SET ativada = 0 WHERE id = ?;";
  let sqlRemoveQuestoes =
    "UPDATE Questao SET ativada = 0 WHERE idDominio IN (SELECT d.id FROM Questao q JOIN Dominio d ON q.idDominio=d.id JOIN Eixo e ON d.idEixo=e.id WHERE e.idAgenda = ?);";
  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.idAgenda);

  const rows = await db.all(sql, params);
  const _ = await db.all(sqlRemoveQuestoes, params);
  response.statusCode = 200;
  response.json(rows);
  db.close();
};

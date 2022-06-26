const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.listRedes = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT id, nome FROM Rede";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEscola);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ redes: rows });
  });
  db.close();
};

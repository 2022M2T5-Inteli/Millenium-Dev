const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.usuarioTestGet = (req, res) => {
  res.send({ message: "HEEEEEEEEELLLLOOOOOWWWW!!!!" });
};

exports.getUsuarioFalconi = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let params = [];
  params.push(request.params.usuarioId);
  let sql = "SELECT * FROM AdminFalconi WHERE id=?";

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ user: rows[0], err });
  });
  db.close();
};

exports.getUsuarioRede = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let params = [];
  params.push(request.params.usuarioId);
  let sql = "SELECT * FROM Rede WHERE id=?";
  db.all(sql, params, (err, rows) => {
    response.statusCode = err ? 500 : 200;
    response.json({ user: rows[0], err });
  });
  db.close();
};

exports.getUsuarioEscola = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let params = [];
  params.push(request.params.usuarioId);

  let sql = "SELECT * FROM Account WHERE id=?";
  db.all(sql, params, (err, rows) => {
    response.statusCode = err ? 500 : 200;
    response.json({ user: rows[0], err });
  });
  db.close();
};

exports.createUsuarioEscola = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Account (nome, email, cargo, idEscola) VALUES(?, ?, ?, ?)";

  // add query params
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);
  params.push(request.body.cargo);
  params.push(request.body.idEscola);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

exports.createUsuarioRede = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Rede (nome, email, chaveAcesso) VALUES(?, ?, ?)";

  // add query params
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);

  // pushes the chaveAcesso data
  params.push("u&2!X,2vWMCu6$8");
  // params.push(request.body.chaveAcesso);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

exports.createUsuarioFalconi = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO AdminFalconi (nome, email) VALUES(?, ?)";

  // add query params
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};

exports.loginRede = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT  nome, id FROM Rede WHERE  email= ?";
  // add query params
  let params = [];
  params.push(request.body.email);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ data: rows[0] });
  });
  db.close();
};

exports.loginFalconi = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT nome, id FROM AdminFalconi WHERE email= ?";
  // add query params
  let params = [];
  params.push(request.body.email);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ data: rows[0] });
  });
  db.close();
};

exports.loginEscola = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT nome, id, idEscola FROM Account WHERE email= ?";
  // add query params
  let params = [];
  params.push(request.body.email);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ data: rows[0] });
  });
  db.close();
};

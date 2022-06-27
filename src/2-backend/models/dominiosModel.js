const Database = require("sqlite-async");
const DBPATH = "./Database/mainDB.db";

const createNewDominio = async (nome, idEixo) => {
  const db = await Database.open(DBPATH);
  const sql = "INSERT INTO Dominio(nome, idEixo) VALUES(?,?)";

  const params = [];
  params.push(nome, idEixo);

  await db.get("PRAGMA foreign_keys = ON");
  await db.all(sql, params);
  return { success: true };
};

const deleteNewDominio = async (id) => {
  const db = await Database.open(DBPATH);
  const sql = "DELETE FROM Dominio WHERE id = ? "

  const params = [];
  params.push(id);
  await db.all(sql, params);
  return { success: true };
};

module.exports = { deleteNewDominio, createNewDominio };



const Database = require("sqlite-async");

const DBPATH = "./Database/mainDB.db";

const getActiveQuestionario = async (escolaId) => {
  let db = await Database.open(DBPATH);
  let query =
    "SELECT id FROM Questionario WHERE idEscola = ? AND isComplete = 0";
  let params = [escolaId];

  let questionarioId = await db.all(query, params);
  db.close();
  return questionarioId[0] ? questionarioId[0].id : null;
};

const createNewQuestionario = async (escolaId) => {
  let db = await Database.open(DBPATH);
  let sqlQuestoes = "SELECT * FROM Questao WHERE ativada=1";
  let sqlQuestionario =
    "INSERT INTO Questionario(idEscola,isComplete) VALUES(?,0)";
  let sqlRespostas =
    "INSERT INTO Resposta(idQuestao, idAlternativa, idQuestionario) VALUES(?,'',?)";

  // params list, replaces "?"
  let questionarioParams = [];

  // add elements to the params list
  questionarioParams.push(escolaId);

  const pendingQuestionario = await getActiveQuestionario(escolaId);

  if (!pendingQuestionario) {
    // creates the Questionario Element
    await db.all(sqlQuestionario, questionarioParams);

    // Returns the last created Questionario Element
    const questionarioId = await getActiveQuestionario(escolaId);

    const questoesObj = await db.all(sqlQuestoes, []);

    await db.transaction((db) => {
      return Promise.all(
        questoesObj.map(async (questao) => {
          await db.run(sqlRespostas, [questao.id, questionarioId]);
        })
      );
    });

    return { success: true };
  } else {
    throw new Error("Questionário em Aberto.");
  }
};

const closeQuestionario = async (questionarioId) => {
  let db = await Database.open(DBPATH);
  let sql = "UPDATE Questionario SET isComplete = 1 WHERE id = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.questionarioId);
  return await db.all(sql, params);
};

const getQuestionarioById = async (questionarioId) => {
  let db = await Database.open(DBPATH);
  let sql = "SELECT * FROM Questionario WHERE id = ?";
  let params = [];
  params.push(questionarioId);

  let rows = await db.all(sql, params);
  const questionario = rows[0];
  if (!questionario) {
    throw new Error("Questionário Não Encontrado.");
  }
  return questionario;
};

const listQuestionarioRespostas = async (questionarioId) => {
  let db = await Database.open(DBPATH);
  let sql =
    "SELECT r.id, r.idQuestao, q.texto as textoQuestao, r.idAlternativa, q.idEixo, r.observacao, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id WHERE r.idQuestionario = ?";
  let params = [];
  params.push(questionarioId);

  // verifies if the questionario exists
  await getQuestionarioById(questionarioId);
  const respostas = await db.all(sql, params);
  let answeredQuestions = 0;
  let unansweredQuestions = 0;
  respostas.map((resposta) => {
    resposta.idAlternativa ? answeredQuestions++ : unansweredQuestions++;
  });
  return { respostas, answeredQuestions, unansweredQuestions };
};

const listQuestionarioRespostasByEixo = async (questionarioId, eixoId) => {
  let db = await Database.open(DBPATH);
  let sql =
    "SELECT r.id, r.idQuestao, q.texto as textoQuestao, r.idAlternativa, q.idEixo, r.observacao, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id WHERE r.idQuestionario = ? AND q.idEixo = ?";
  let params = [];
  params.push(questionarioId);
  params.push(eixoId);

  // verifies if the questionario exists
  await getQuestionarioById(questionarioId);
  const respostas = await db.all(sql, params);
  let answeredQuestions = 0;
  let unansweredQuestions = 0;
  respostas.map((resposta) => {
    resposta.idAlternativa ? answeredQuestions++ : unansweredQuestions++;
  });
  return { respostas, answeredQuestions, unansweredQuestions };
};

module.exports = {
  getActiveQuestionario,
  createNewQuestionario,
  closeQuestionario,
  getQuestionarioById,
  listQuestionarioRespostas,
  listQuestionarioRespostasByEixo,
};

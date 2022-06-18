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

const processQuestionarioResultado = async (questionarioId) => {
  let db = await Database.open(DBPATH);
  let sql =
    "SELECT e.id as idEixo, e.nome as nomeEixo, q.idDominio, d.nome as nomeDominio, e.idAgenda,a.nome as nomeAgenda, q.peso, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id JOIN Dominio d ON q.idDominio=d.id JOIN Eixo e ON d.idEixo=e.id JOIN Agenda a ON e.idAgenda = a.id WHERE r.idQuestionario = ?";
  let params = [];
  params.push(questionarioId);

  // verifies if the questionario exists
  await getQuestionarioById(questionarioId);
  const gradedRespostas = await db.all(sql, params);
  const formatedResultado = {
    agenda: {},
    eixo: {},
    dominio: {},
  };
  gradedRespostas.forEach((resultado) => {
    const { idEixo, nomeEixo, idDominio, nomeDominio, idAgenda, nomeAgenda } =
      resultado;
    if (!formatedResultado.dominio[idDominio]) {
      formatedResultado.dominio[idDominio] = {
        nome: nomeDominio,
        nota: 0.0,
        notaFinal: 0.0,
        divisionFactor: 0,
        idAgenda,
      };
    }

    if (!formatedResultado.eixo[idEixo]) {
      formatedResultado.eixo[idEixo] = {
        nome: nomeEixo,
        nota: 0.0,
        notaFinal: 0.0,
        divisionFactor: 0,
      };
    }

    if (!formatedResultado.agenda[idAgenda]) {
      formatedResultado.agenda[idAgenda] = {
        nome: nomeAgenda,
        nota: 0.0,
        notaFinal: 0.0,
        divisionFactor: 0,
      };
    }

    // result formatting
    formatedResultado.dominio[idDominio].nota +=
      resultado.nota * resultado.peso;
    formatedResultado.dominio[idDominio].divisionFactor += resultado.peso;
    formatedResultado.eixo[idEixo].nota += resultado.nota * resultado.peso;
    formatedResultado.eixo[idEixo].divisionFactor += resultado.peso;
    // formatedResultado.agenda[idAgenda].nota += resultado.nota;
    // formatedResultado.agenda[idAgenda].divisionFactor += 1;
    // formatedResultado.dominio.push(resultado);

    formatedResultado.dominio[idDominio].notaFinal =
      formatedResultado.dominio[idDominio].nota /
      formatedResultado.dominio[idDominio].divisionFactor;
    formatedResultado.eixo[idEixo].notaFinal =
      formatedResultado.eixo[idEixo].nota /
      formatedResultado.eixo[idEixo].divisionFactor;
  });
  Object.keys(formatedResultado.dominio).forEach((dominio) => {
    const currentDominio = formatedResultado.dominio[dominio];
    console.log(currentDominio.notaFinal);
    formatedResultado.agenda[currentDominio.idAgenda].nota +=
      currentDominio.notaFinal;

    formatedResultado.agenda[currentDominio.idAgenda].divisionFactor += 1;
    const notaFinal =
      formatedResultado.agenda[currentDominio.idAgenda].nota /
      formatedResultado.agenda[currentDominio.idAgenda].divisionFactor;
    formatedResultado.agenda[currentDominio.idAgenda].notaFinal =
      notaFinal.toFixed(1);
    // formatedResultado.agenda[eixo.idAgenda].divisionFactor += 1;
  });
  return { resultado: formatedResultado };
};

module.exports = {
  getActiveQuestionario,
  createNewQuestionario,
  closeQuestionario,
  getQuestionarioById,
  listQuestionarioRespostas,
  listQuestionarioRespostasByEixo,
  processQuestionarioResultado,
};

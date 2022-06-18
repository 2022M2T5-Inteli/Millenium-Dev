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
    "SELECT e.id as idEixo, e.nome as nomeEixo, e.maxGrade, q.idDominio, d.nome as nomeDominio, e.idAgenda,a.nome as nomeAgenda,a.isConsolidated as hasConsolidatedGrade, q.peso, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id JOIN Dominio d ON q.idDominio=d.id JOIN Eixo e ON d.idEixo=e.id JOIN Agenda a ON e.idAgenda = a.id WHERE r.idQuestionario = ?";
  let params = [];
  params.push(questionarioId);

  // verifies if the questionario exists
  await getQuestionarioById(questionarioId);
  const gradedRespostas = await db.all(sql, params);
  const formatedResultado = {
    agenda: {},
  };

  gradedRespostas.forEach((resultado) => {
    const { idEixo, nomeEixo, idDominio, nomeDominio, idAgenda, nomeAgenda } =
      resultado;
    if (!formatedResultado.agenda[idAgenda]) {
      formatedResultado.agenda[idAgenda] = {
        nome: nomeAgenda,
        hasConsolidatedGrade: Boolean(resultado.hasConsolidatedGrade),
        eixo: {},
      };
      if (resultado.hasConsolidatedGrade) {
        formatedResultado.agenda[idAgenda].pontuacao = 0.0;
        formatedResultado.agenda[idAgenda].nota = 0.0;
        formatedResultado.agenda[idAgenda].divisionFactor = 0;
      }
    }

    if (!formatedResultado.agenda[idAgenda].eixo[idEixo]) {
      formatedResultado.agenda[idAgenda].eixo[idEixo] = {
        nome: nomeEixo,
        pontuacao: 0.0,
        nota: 0.0,
        maxGrade: resultado.maxGrade,
        oportunidade: 0.0,
        divisionFactor: 0,
        dominio: {},
      };
    }

    if (!formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[idDominio]) {
      formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[idDominio] = {
        nome: nomeDominio,
        pontuacao: 0.0,
        nota: 0.0,
        divisionFactor: 0,
        idAgenda,
      };
    }

    // result formatting
    formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[
      idDominio
    ].pontuacao += resultado.nota * resultado.peso;
    formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[
      idDominio
    ].divisionFactor += resultado.peso;
    formatedResultado.agenda[idAgenda].eixo[idEixo].pontuacao +=
      resultado.nota * resultado.peso;
    formatedResultado.agenda[idAgenda].eixo[idEixo].divisionFactor +=
      resultado.peso;

    formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[idDominio].nota =
      formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[idDominio]
        .pontuacao /
      formatedResultado.agenda[idAgenda].eixo[idEixo].dominio[idDominio]
        .divisionFactor;
    formatedResultado.agenda[idAgenda].eixo[idEixo].nota =
      formatedResultado.agenda[idAgenda].eixo[idEixo].pontuacao /
      formatedResultado.agenda[idAgenda].eixo[idEixo].divisionFactor;
    formatedResultado.agenda[idAgenda].eixo[idEixo].oportunidade =
      formatedResultado.agenda[idAgenda].eixo[idEixo].maxGrade -
      formatedResultado.agenda[idAgenda].eixo[idEixo].nota;
  });
  Object.keys(formatedResultado.agenda).forEach((agenda) => {
    Object.keys(formatedResultado.agenda[agenda].eixo).forEach((eixo) => {
      if (formatedResultado.agenda[agenda].hasConsolidatedGrade) {
        Object.keys(
          formatedResultado.agenda[agenda].eixo[eixo].dominio
        ).forEach((dominio) => {
          const dominioNota =
            formatedResultado.agenda[agenda].eixo[eixo].dominio[dominio].nota;
          const maxGrade = formatedResultado.agenda[agenda].eixo[eixo].maxGrade;
          formatedResultado.agenda[agenda].eixo[eixo].dominio[
            dominio
          ].oportunidade = maxGrade - dominioNota;
          formatedResultado.agenda[agenda].divisionFactor += 1;

          formatedResultado.agenda[agenda].pontuacao += dominioNota;
          formatedResultado.agenda[agenda].nota =
            formatedResultado.agenda[agenda].pontuacao /
            formatedResultado.agenda[agenda].divisionFactor;
          formatedResultado.agenda[agenda].nota =
            formatedResultado.agenda[agenda].nota.toFixed(1);
          // remove keys that are not used anymore
          formatedResultado.agenda[agenda].eixo[eixo].dominio[
            dominio
          ].pontuacao = undefined;
          formatedResultado.agenda[agenda].eixo[eixo].dominio[
            dominio
          ].divisionFactor = undefined;
        });
      } else {
      }
      formatedResultado.agenda[agenda].eixo[eixo].pontuacao = undefined;
      formatedResultado.agenda[agenda].eixo[eixo].divisionFactor = undefined;
    });
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

const Database = require("sqlite-async");
const {
  createNewQuestionario,
  closeQuestionario,
  getQuestionarioById,
  listQuestionarioRespostas,
  listQuestionarioRespostasByEixo,
  processQuestionarioResultado,
} = require("../models/questionariosModel");

const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.createQuestionario = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200 };
  try {
    responseMessage.message = await createNewQuestionario(
      request.body.idEscola
    );
  } catch (err) {
    responseMessage.code = 500;
    responseMessage.message = err.message;
  }
  response.statusCode = responseMessage.code;
  response.json({ message: responseMessage.message });
};

exports.setQuestionarioAsComplete = async (request, response) => {
  console.log("hjgaioguoeyguo");
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200 };
  try {
    await closeQuestionario(request.body.id);
    console.log("antes");
  } catch (err) {
    responseMessage.message = err.message;
    responseMessage.stack = err.stack;
    responseMessage.code = 500;
  }
  response.statusCode = responseMessage.code;
  response.json({ message: responseMessage.message });
};


exports.listQuestionarios = (request, response) => {
  response.json({ message: "Not Implemented!" });
};

exports.listQuestionarioById = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200, questionario: {} };
  try {
    const questionario = await getQuestionarioById(
      request.params.idQuestionario
    );
    responseMessage.questionario = questionario;
  } catch (err) {
    responseMessage.code = 500;
    responseMessage.message = err.message;
  }
  response.statusCode = responseMessage.code;
  response.send(responseMessage);
};

exports.listQuestionarioRespostas = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200, respostas: {} };
  try {
    const listRespostas = await listQuestionarioRespostas(
      request.params.idQuestionario
    );
    responseMessage.respostas = listRespostas.respostas;
    responseMessage.answeredQuestions = listRespostas.answeredQuestions;
    responseMessage.unansweredQuestions = listRespostas.unansweredQuestions;
  } catch (err) {
    responseMessage.code = 500;
    responseMessage.message = err.message;
    responseMessage.stack = err.stack;
  }
  response.statusCode = responseMessage.code;
  response.json(responseMessage);
};

exports.listQuestionarioRespostasByEixo = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200, respostas: {} };
  try {
    const listRespostas = await listQuestionarioRespostasByEixo(
      request.params.idQuestionario,
      request.params.idEixo
    );
    responseMessage.respostas = listRespostas.respostas;
    responseMessage.answeredQuestions = listRespostas.answeredQuestions;
    responseMessage.unansweredQuestions = listRespostas.unansweredQuestions;
  } catch (err) {
    responseMessage.code = 500;
    responseMessage.message = err.message;
  }
  response.statusCode = responseMessage.code;
  response.json(responseMessage);
};

exports.getQuestionarioResultado = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const responseMessage = { message: "success", code: 200, resultado: {} };
  try {
    const resultado = await processQuestionarioResultado(
      request.params.idQuestionario
    );
    responseMessage.resultado = resultado;
  } catch (err) {
    responseMessage.code = 500;
    responseMessage.message = err.message;
    responseMessage.stack = err.stack;
  }
  response.statusCode = responseMessage.code;
  response.json(responseMessage);
};

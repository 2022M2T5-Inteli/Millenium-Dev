var questionariosAbertos = [];
var idEscola = sessionStorage.getItem("idEscola");

var questionario = {
  async list() {
    const response = await $.ajax({
      url: API_BASE_URL + `/escolas/escola/${idEscola}/questionariosConcluidos`,
      type: "GET",
    });
    return response;
  },
  async create() {
    const response = await $.ajax({
      url: API_BASE_URL + `/questionarios/create`,
      type: "POST",
      data: { idEscola: idEscola },
    });
    return response;
  },
};

async function carregarQuestionario() {
  try {
    await questionario.create();
    location.href = "../../2-questionarios/1-FollowQuizScreen/";
  } catch (err) {
    if (err.responseJSON.message == "Questionário em Aberto.") {
      location.href = "../../2-questionarios/1-FollowQuizScreen/";
    } else {
      alert("Erro Grave! ", err.messageText);
    }
  }
}

async function showDashboardButton() {
  try {
    const resposta = await questionario.list();
    if (resposta.questionarios.length <= 0) {
      $("#buttonDashboard").remove();
    }
  } catch (err) {
    alert("Erro Grave! ", err.messageText);
  }
}

function loadDashboard() {
  document.location = "./../../4-dashboard/1-SchoolDashboardScreen";
}

$(document).ready(() => {
  showDashboardButton();
});

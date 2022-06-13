var eixos = [];

// Cria um elemento Card e retorna o HTML deste elemento
function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}" onclick="setEixoAndRedirect(${sectionId},'${sectionName}')">
  <h3 class="section-name">${sectionName}</h3><i class="fa-regular fa-pen-to-square"></i></div>`;
  return cardElement;
}

// Cria um sectionCard para cada eixo da lista Eixos
function createCardEixos() {
  eixos.forEach((eixo) => {
    let newSectionCard = createSectionCard(eixo.id, eixo.nome, eixo.idAgenda);
    $("#cardBox").append(newSectionCard);
  });
}

/* Salva o id de um eixo, na sessionStorage
  e redireciona o document para a página de
 editar questões */

function setEixoAndRedirect(idEixo, nomeEixo) {
  sessionStorage.setItem("currentEixoId", idEixo);
  sessionStorage.setItem("currentEixoNome", nomeEixo);
  window.location.href =
    "../2-EditQuizScreenQuestions/EditQuizScreenQuestions.html";
}

// Chama uma série de funções após a página estar
// "pronta"
$(document).ready(function () {
  usuarioFalconi.dados(1);
  listarEixos.list();
});

// Objeto responsável pelas requisições usuarioFalconi
var usuarioFalconi = {
  dados(idUsuarioFalconi) {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:80/usuarioFalconi/" + idUsuarioFalconi,
      success: function (resultado) {
        document.getElementById("nomeUsuario").textContent =
          resultado.user.nome;
      },
    });
  },
};

// Objeto responsável pelas requisições de Eixos
var listarEixos = {
  list() {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:80/eixos/",
      success: function (resultado) {
        eixos = resultado.eixos;
        createCardEixos();
      },
    });
  },
};

var currentAgendaNome = sessionStorage.getItem("currentAgendaNome");
var currentAgendaId = sessionStorage.getItem("currentAgendaId");
var eixos = [];

// Cria um elemento Card e retorna o HTML deste elemento
function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}" onclick="setEixoAndRedirect(${sectionId},'${sectionName}')">
  <h3 class="section-name">${sectionName}</h3> <div><i class="fa-regular fa-pen-to-square"></i> <i class="bi bi-trash"></i></div> </div>`;
  return cardElement;
}

// Cria um sectionCard para cada eixo da lista Eixos
function createCardEixos() {
  $("#cardBox").empty();
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
    "../3-Dominios";
}

// Chama uma série de funções após a página estar
// "pronta"
$(document).ready(function () {
  $("#agendaTitle").text(currentAgendaNome);
  usuarioFalconi.dados(sessionStorage.getItem("userId"));
  Eixos.list();
});

// Objeto responsável pelas requisições usuarioFalconi
var usuarioFalconi = {
  dados(idUsuarioFalconi) {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + "/usuarios/falconi/" + idUsuarioFalconi,
      success: function (resultado) {
        document.getElementById("nomeUsuario").textContent =
          resultado.user.nome;
      },
    });
  },
};

// Objeto responsável pelas requisições de Eixos
var Eixos = {
  list() {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + "/eixos/list/" + currentAgendaId,
      success: function (resultado) {
        eixos = resultado.eixos;
        createCardEixos();
      },
    });
  },
  async create(nome, idAgenda, maxGrade) {
    return await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/eixos/create",
      data: { nome: nome, idAgenda: idAgenda, maxGrade: maxGrade },
    });
  },
};

function criarEixoButton() {
  Swal.fire({
    title: "Insira o nome do eixo:",
    html:
      '<input id="nomeEixoInput" class="swal2-input text-center" placeholder="Novo Eixo">' +
      '<p for="maxGradeEixoInput">Nota máxima</p><input id="maxGradeEixoInput" class="swal2-input text-center" type="number" value="5">',
    showCancelButton: true,
    confirmButtonText: "Criar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      const newEixoName = document.getElementById("nomeEixoInput").value;
      const newEixoGrade = document.getElementById("maxGradeEixoInput").value;
      return await Eixos.create(newEixoName, currentAgendaId, newEixoGrade);
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result, "resultaddoooodfodoashdakjsdhkahsd");
    if (result.isConfirmed) {
      Eixos.list();
    }
  });
}

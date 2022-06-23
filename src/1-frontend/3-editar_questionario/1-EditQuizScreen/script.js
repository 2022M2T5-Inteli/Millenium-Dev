var eixos = [];

// Cria um elemento Card e retorna o HTML deste elemento
function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}">
  <h3 class="section-name">${sectionName}</h3> <div onclick="setEixoAndRedirect(${sectionId},'${sectionName}')"><div class="d-flex justify-content-center align-items-center"><div><i class="fa-regular fa-pen-to-square icon"></i></div> <div><i class="fa-solid fa-trash-can icon"></i></div></div></div>`;
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
      url: API_BASE_URL + "/usuarios/falconi/" + idUsuarioFalconi,
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
      url: API_BASE_URL + "/eixos/list",
      success: function (resultado) {
        eixos = resultado.eixos;
        createCardEixos();
      },
    });
  },
};

function criarEixoButton() {
  Swal.fire({
    title: "Insira o nome do eixo:",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Criar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: (nomeEixo) => {
      console.log(nomeEixo);
      return "yesssssss!";
      // return fetch(`//api.github.com/users/${login}`)
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error(response.statusText);
      //     }
      //     return response.json();
      //   })
      //   .catch((error) => {
      //     Swal.showValidationMessage(`Request failed: ${error}`);
      //   });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result, "resultaddoooodfodoashdakjsdhkahsd");
    if (result.isConfirmed) {
      console.log(result.value);
      //   Swal.fire({
      //     title: `${result.value.login}'s avatar`,
      //     imageUrl: result.value.avatar_url,
      //   });
    }
  });
}
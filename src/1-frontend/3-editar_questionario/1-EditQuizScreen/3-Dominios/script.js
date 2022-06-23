var currentEixoNome = sessionStorage.getItem("currentEixoNome");
var currentAgendaId = sessionStorage.getItem("currentEixoId");
var currentEixoId = sessionStorage.getItem("currentEixoId");
var dominios = [];

// Cria um elemento Card e retorna o HTML deste elemento
function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}">
  <h3 class="section-name">${sectionName}</h3> <div><i class="fa-regular fa-pen-to-square" onclick="setDominioAndRedirect(${sectionId},'${sectionName}')"></i> <i class="bi bi-trash" onclick="disableDominio(${sectionId}, '${sectionName}')"></i></div> </div>`;
  return cardElement;
}

// Cria um sectionCard para cada dominio da lista dominios
function createCardDominios() {
  $("#cardBox").empty();
  dominios.forEach((dominio) => {
    let newSectionCard = createSectionCard(dominio.id, dominio.nome);
    $("#cardBox").append(newSectionCard);
  });
}

/* Salva o id de um dominio, na sessionStorage
  e redireciona o document para a página de
 editar questões */

function setDominioAndRedirect(idDominio, nomeDominio) {
  sessionStorage.setItem("currentDominioId", idDominio);
  sessionStorage.setItem("currentDominioNome", nomeDominio);
  window.location.href =
    "../../2-EditQuizScreenQuestions/EditQuizScreenQuestions.html";
}

// Chama uma série de funções após a página estar
// "pronta"
$(document).ready(function () {
  $("#eixoTitle").text(currentEixoNome);
  usuarioFalconi.dados(sessionStorage.getItem("userId"));
  Dominios.list();
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

// Objeto responsável pelas requisições de Dominios
var Dominios = {
  list() {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + `/dominios/eixo/${currentEixoId}/list/`,
      success: function (resultado) {
        dominios = resultado.dominios;
        createCardDominios();
      },
    });
  },
  async create(nome, idEixo) {
    return await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/dominios/create",
      data: { nome: nome, idEixo: idEixo },
    });
  },
  async delete(idDominio) {
    return await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/dominios/delete",
      data: { idDominio: idDominio },
    });
  },
};

function criarDominioButton() {
  Swal.fire({
    title: "Insira o nome da Seção:",
    html: '<input id="nomeDominioInput" class="swal2-input text-center" placeholder="Nova Seção">',
    showCancelButton: true,
    confirmButtonText: "Criar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      const newDominioName = document.getElementById("nomeDominioInput").value;
      return await Dominios.create(newDominioName, currentEixoId);
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result, "resultaddoooodfodoashdakjsdhkahsd");
    if (result.isConfirmed) {
      Dominios.list();
    }
  });
}

function disableDominio(idDominio, nomeDominio) {
  Swal.fire({
    title: `Tem certeza de que você quer remover a seção "${nomeDominio}" ?`,
    icon: "warning",
    html: "<p>Todas as questões pertencentes à essa seção também serão removidas.</p>",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Remover",
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      try {
        await Dominios.delete(idDominio);
        showSuccess("Seção removida com sucesso!");
        Dominios.list();
      } catch (err) {
        showError("Erro!", err.message);
      }
    }
  });
}

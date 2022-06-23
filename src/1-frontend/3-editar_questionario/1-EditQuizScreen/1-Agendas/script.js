var agendas = [];

// Cria um elemento Card e retorna o HTML deste elemento
function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}">
  <h3 class="section-name">${sectionName}</h3> <div><i class="fa-regular fa-pen-to-square" onclick="setAgendaAndRedirect(${sectionId},'${sectionName}')"></i> <i class="bi bi-trash" onclick="disableAgenda(${sectionId}, '${sectionName}')"></i></div> </div>`;
  return cardElement;
}

// Cria um sectionCard para cada agenda da lista agendas
function createCardagendas() {
  $("#cardBox").empty();
  agendas.forEach((agenda) => {
    let newSectionCard = createSectionCard(
      agenda.id,
      agenda.nome,
      agenda.idAgenda
    );
    $("#cardBox").append(newSectionCard);
  });
}

/* Salva o id de um agenda, na sessionStorage
  e redireciona o document para a página de
 editar questões */

function setAgendaAndRedirect(idAgenda, nomeAgenda) {
  sessionStorage.setItem("currentAgendaId", idAgenda);
  sessionStorage.setItem("currentAgendaNome", nomeAgenda);
  window.location.href = "../2-Eixos/";
}

// Chama uma série de funções após a página estar
// "pronta"
$(document).ready(function () {
  usuarioFalconi.dados(sessionStorage.getItem("userId"));
  Agendas.list();
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

// Objeto responsável pelas requisições de agendas
var Agendas = {
  list() {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + "/agendas/list",
      success: function (resultado) {
        agendas = resultado.agendas;
        createCardagendas();
      },
    });
  },
  async create(nome, isConsolidated) {
    return await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/agendas/create",
      data: { nome: nome, isConsolidated: isConsolidated },
    });
  },
  async delete(idAgenda) {
    return await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/agendas/delete",
      data: { idAgenda: idAgenda },
    });
  },
};

function criarAgendaButton() {
  Swal.fire({
    title: "Insira o nome da agenda:",
    html:
      '<input id="nomeAgendaInput" class="swal2-input">' +
      `<div class="form-check form-switch">` +
      `<div class="d-flex justify-content-around align-items-center">` +
      `<label class="form-check-label" for="flexSwitchCheckDefault">A agenda é consolidada?</label>  <input class="form-check-input" type="checkbox" role="switch" id="isConsolidatedAgendaSwitch" checked></div>` +
      `</div>`,
    showCancelButton: true,
    confirmButtonText: "Criar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      const newAgendaName = document.getElementById("nomeAgendaInput").value;
      const isConsolidatedCheckStatus = document.getElementById(
        "isConsolidatedAgendaSwitch"
      ).checked;
      const isConsolidatedBool = Number(isConsolidatedCheckStatus);
      return await Agendas.create(newAgendaName, isConsolidatedBool);
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result, "resultaddoooodfodoashdakjsdhkahsd");
    if (result.isConfirmed) {
      Agendas.list();
    }
  });
}

function disableAgenda(idAgenda, nomeAgenda) {
  Swal.fire({
    title: `Tem certeza de que você quer remover a agenda "${nomeAgenda}" ?`,
    icon: "warning",
    html: "<p>Todas as questões pertencentes à essa agenda também serão removidas.</p>",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Remover",
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      try {
        await Agendas.delete(idAgenda);
        showSuccess("Agenda removida com sucesso!");
        Agendas.list();
      } catch (err) {
        showError("Erro!", err.message);
      }
    }
  });
}

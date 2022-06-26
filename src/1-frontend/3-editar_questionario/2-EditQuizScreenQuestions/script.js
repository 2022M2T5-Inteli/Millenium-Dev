// Carrega dados do sessionStorage em variáveis
let usuarioFalconiId = sessionStorage.getItem("userId") || 1;
let currentIdEixo = sessionStorage.getItem("currentEixoId") || 1;
let currentIdDominio = sessionStorage.getItem("currentDominioId") || 1;
let currentEixoNome =
  `Seção ` + sessionStorage.getItem("currentDominioNome") ||
  "Perguntas da seção";

let optionsBodyDefault = ``;

let currentEixoMaxGrade = sessionStorage.getItem("currentEixoMaxGrade") || 4;
currentEixoMaxGrade = Number(currentEixoMaxGrade);
// Variável responsável por guardar todas as
// questões da página
let questionCards = [];

// Após a abertura do modal editar Pergunta,
// guarda o objeto da pergunta nesta variável
let currentQuestion = {};

// Guarda novas opções, criadas dentro de
// uma pergunta
let createNewOptions = [];

// Guarda uma lista de opções a serem removidas
let questionsToBeRemoved = [];

// Inicializa o modal do bootstrap em uma variável
// para podermos alterar os estados dele posteriormente
let questionModal = new bootstrap.Modal(
  document.getElementById("questionModal")
);

// Retorna um elemento HTML contendo informações de uma questão
// em forma de linha
function createQuestionCard(questionId, questionNumber, question) {
  let newQuestionCard = `<div class="row col-12 text-center align-items-center m-2 questions" id="question${questionNumber}">
  <!--linha das questões-->
  <div class="col-lg-3 p-4">
    <h6>${questionNumber}</h6>
  </div>

  <div class="col-lg-6 p-4">
    <h6>${question.substring(0, 46) + "..."}</h6>
  </div>

  <div class="col-lg-3 p-4 d-flex justify-content-center">
    <button  id="editBtn" onclick="openQuestion(${questionId});">
      <!--botão editar questões-->
      <i class="fa-regular fa-pen-to-square" id="edit"></i>
    </button>
    <button id="trashBtn" onclick="removeQuestion(${questionNumber});">
      <!--botão apagar questões-->
      <i class="bi bi-trash"></i>
    </button>
  </div>

</div>`;
  return newQuestionCard;
}

// Carrega o modal de editar questão
function setQuestionModal(questionObj) {
  let radioButtons = [];

  // Define o conteúdo do modal de acordo
  // com o objeto da questão
  $("#questionNumberText").text(questionObj.numeroQuestao + ".");
  $("#questionModalTitle").text(questionObj.idDominio);
  $("#questionModalText").text(questionObj.texto);
  $("#questionWeightSelect").val(questionObj.peso);

  // Adiciona as opçõoes da questão
  const questionOptionsList = questionObj.opcoes || [];

  // Cria um elemento HTML para cada opcão
  questionOptionsList.forEach((questionOption) => {
    let radioButton = `<div class="p-2 d-flex" id="option${questionOption.id}Container">
    <div class="operation-button" id="removeOption0" onclick="removeOption(${questionOption.id},'${questionOption.texto}')"><i class="fa-solid fa-minus"></i></div>
    <div class="col-11">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioOption${questionOption.id}">
      <label class="form-check-label row">
        <textarea rows="2" id="questionOption${questionOption.id}Text" class="text-alternativa col-12">${questionOption.texto}</textarea>
      </label>

      <div class="row">
        <div class="col-3">
          <select class="form-select" aria-label=".form-select-sm example" id="flexRadioOption${questionOption.id}Select">
          ${optionsBodyDefault}
          </select>
        </div>
      </div>
    </div>
  </div>`;

    radioButtons.push(radioButton);
  });

  // Adiciona todas as opções ao corpo do modal
  $("#optionsBody").empty().append(radioButtons);

  /* Mapeia a lista de opções, alterando o
    peso de um elemento select, de acordo com o peso do
    objeto opcão */
  questionOptionsList.forEach((questionOption) => {
    $(`#flexRadioOption${questionOption.id}Select`)
      .val(questionOption.pontuacao)
      .change();
  });
}

// Remove um elemento Questão da lista de questões
function removeQuestionCard(questionId) {
  questionCards = questionCards.filter((questionCard) => {
    return questionCard.id != questionId;
  });
  $(`#question${questionId}`).remove();
}

// Altera o estado de exibição do modal editar
// questões
function toggleModal() {
  questionModal.toggle();
}

// Carrega os dados de uma questão, por id,
// e utiliza o modal editar questão para exibi-los
function openQuestion(questionId) {
  let questionObj = questionCards.filter((obj) => {
    return obj.id == questionId;
  })[0];
  currentQuestion = questionObj;
  $.ajax({
    type: "GET",
    url: API_BASE_URL + `/questoes/questao/${currentQuestion.id}/opcoes`,
    success: (opcoesResponse) => {
      currentQuestion.opcoes = opcoesResponse.opcoes;

      $("#questionSaveButton")
        .unbind()
        .click(() => {
          updateCurrentQuestionOptions();
          currentQuestion.texto =
            document.getElementById("questionModalText").textContent;
          currentQuestion.peso = document.getElementById(
            "questionWeightSelect"
          ).value;
          currentQuestion.idDominio = currentIdDominio;
          questoes.update(
            currentQuestion.texto,
            currentQuestion.numeroQuestao,
            currentQuestion.peso,
            currentIdDominio,
            usuarioFalconiId,
            currentIdEixo,
            currentQuestion.opcoes,
            currentQuestion.id
          );
        });
      setQuestionModal(currentQuestion);
      toggleModal();
    },
  });
}

// Ao carregar a página, lista os dados do usuário
// E carrega a lista de questões
$(document).ready(function () {
  $("#pageTitle").text(currentEixoNome);
  usuarioFalconi.list(usuarioFalconiId);
  loadOptionSelectPoints(currentEixoMaxGrade);
  questoes.list(currentIdDominio);
});

function loadOptionSelectPoints(maxPoint) {
  let optionsHTML = ``;
  const mainOption = document.createElement("option");
  mainOption.textContent = "Pontuação";
  mainOption.selected = true;
  mainOption.disabled = true;
  optionsHTML += mainOption.outerHTML;
  $("#questionOptionsPoints").append(mainOption);
  for (let i = 0; i <= maxPoint; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    optionsHTML += option.outerHTML;
  }
  optionsBodyDefault = optionsHTML;
}

// Objeto reponsável por requisições Questoes
var questoes = {
  list(dominioId) {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + "/questoes/dominio/" + dominioId,
      success: (response) => {
        questionCards = response.questoes;
        $("#questionsWrapper").empty();
        questionCards.forEach((question) => {
          let newQuestionCard = createQuestionCard(
            question.id,
            question.numeroQuestao,
            question.texto
          );
          $("#questionsWrapper").append(newQuestionCard);
        });
      },
    });
  },
  create(texto, peso, idDominio, idAutor, idEixo) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/questoes/create",
      data: { texto, peso, idDominio, idAutor, idEixo },
    }).done(() => {
      showSuccess("Questão criada com sucesso!");
      questoes.list(currentIdDominio);
      // toggleModal();
    });
  },
  update(
    texto,
    numeroQuestao,
    peso,
    idDominio,
    idAutor,
    idEixo,
    opcoes,
    idQuestao
  ) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/questoes/update",
      data: {
        texto,
        numeroQuestao,
        peso,
        idDominio,
        idAutor,
        idEixo,
        id: idQuestao,
      },
      success: async (response) => {
        for (i = 0; i < opcoes.length; i++) {
          const opcao = opcoes[i];
          await opcoesQuestion.update(
            opcao.texto,
            numeroQuestao,
            opcao.pontuacao,
            opcao.numeroAlt,
            idEixo,
            idAutor,
            opcao.id
          );
        }
        for (i = 0; i < createNewOptions.length; i++) {
          const opcao = createNewOptions[i];
          await opcoesQuestion.create(
            opcao.texto,
            numeroQuestao,
            opcao.pontuacao,
            idAutor
          );
        }

        showSuccess("Questão Salva com Sucesso!");
        questionCards = [];
        currentQuestion = {};
        createNewOptions = [];
        questionsToBeRemoved = [];
        questoes.list(currentIdDominio);
        toggleModal();
        // questoes.list(currentIdEixo);
      },
    });
  },
  disable(numeroQuestao) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/questoes/disable",
      data: { numeroQuestao },
    }).done(() => {
      $(`#question${numeroQuestao}`).remove();
      showSuccess("Questão Removida!");
      // toggleModal();
    });
  },
};

// Objeto responsável por requisições usuarioFalconi
var usuarioFalconi = {
  list(idUsuarioFalconi) {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + "/usuarios/falconi/" + idUsuarioFalconi,
      success: (response) => {
        document.getElementById("userNameDisplay").textContent =
          response.user.nome;
      },
    });
  },
};

var opcoesQuestion = {
  async update(
    texto,
    numeroQuestao,
    pontuacao,
    numeroAlt,
    idEixo,
    idAutor,
    idOpcao
  ) {
    await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/opcoes/update",
      data: {
        texto,
        numeroQuestao,
        pontuacao,
        numeroAlt,
        idEixo,
        idAutor,
        id: idOpcao,
      },
    });
  },
  async create(texto, numeroQuestao, pontuacao, idAutor) {
    await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/opcoes/create",
      data: { texto, numeroQuestao, pontuacao, idAutor },
    });
  },
  async disable(numeroAlt) {
    await $.ajax({
      type: "POST",
      url: API_BASE_URL + "/opcoes/disable",
      data: { numeroAlt },
    });
    alert("Option Disabled!");
    // toggleModal();
  },
};

// Limpa o objeto currentQuestion quando o modal editar Questão
// é fechado
function clearCurrentQuestion() {
  currentQuestion = {};
}

// Adiciona uma nova opção ao corpo do modal editar Questão
function addNewRawOption() {
  let newOption = {
    id: createNewOptions.length,
    texto: "Minha Nova Opção",
  };
  let radioButton = `<div class="p-2 d-flex" id="option${newOption.id}ContainerNew">
    <div class="operation-button" id="removeOption0" onclick="removeNewOption(${newOption.id}, '${newOption.texto}')"><i class="fa-solid fa-minus"></i></div>
    <div class="col-11">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioOption${newOption.id}New">
      <label class="form-check-label row">
      <textarea rows="2" id="questionOption${newOption.id}TextNew" class="text-alternativa col-12">Nova Opção ${newOption.id}</textarea>
      </label>

      <div class="row">
        <div class="col-3">
          <select class="form-select" aria-label=".form-select-sm example" id="flexRadioOption${createNewOptions.length}SelectNew">
           ${optionsBodyDefault}
          </select>
        </div>
      </div>
    </div>
  </div>`;
  createNewOptions.push(newOption);
  $("#optionsBody").append(radioButton);
}

// Função responsável por atualizar os dados das opções
// de uma pergunta
function updateCurrentQuestionOptions() {
  currentQuestion.opcoes.forEach((opcao) => {
    let texto = $(`#questionOption${opcao.id}Text`).val();
    console.log(texto)
    let pontuacao = $(`#flexRadioOption${opcao.id}Select`).val();
    opcao.texto = texto;
    opcao.pontuacao = pontuacao;
  });
  createNewOptions.forEach((opcao) => {
    let texto = $(`#questionOption${opcao.id}TextNew`).val();
    let pontuacao = $(`#flexRadioOption${opcao.id}SelectNew`).val();
    opcao.texto = texto;
    opcao.pontuacao = pontuacao;
  });
}

// Função responsável por remover uma opção do modal editar Questão
function removeOption(optionId, optionName) {
  Swal.fire({
    icon: "warning",
    title: `Você tem certeza de que deseja remover a opção "${optionName}"?`,
    showCancelButton: true,
    confirmButtonText: "Remover",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      currentQuestion.opcoes = currentQuestion.opcoes.filter((opcao) => {
        if (opcao.id == optionId) {
          questionsToBeRemoved.push(opcao);
          return false;
        }
        return opcao;
      });
      $(`#option${optionId}Container`).remove();
    }
  });
}

// Função responsável por remover uma opção recem criada,
// do modal editar Questão
function removeNewOption(optionId, optionName) {
  Swal.fire({
    icon: "warning",
    title: `Você tem certeza de que deseja remover a opção "${optionName}"?`,
    showCancelButton: true,
    confirmButtonText: "Remover",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      createNewOptions = createNewOptions.filter((opcao) => {
        return !opcao.id == optionId;
      });
      $(`#option${optionId}ContainerNew`).remove();
    }
  });
}

// Desativa uma Pergunta
function removeQuestion(numeroQuestao) {
  Swal.fire({
    icon: "warning",
    title: `Você tem certeza de que deseja remover a questão número ${numeroQuestao}?`,
    showCancelButton: true,
    confirmButtonText: "Remover",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      questoes.disable(numeroQuestao);
    }
  });
}

// Cria uma nova Pergunta
function createNewQuestion() {
  Swal.fire({
    title: "Criar nova pergunta?",
    showCancelButton: true,
    confirmButtonText: "Criar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      questoes.create(
        "Nova questão",
        1,
        currentIdDominio,
        usuarioFalconiId,
        currentIdEixo
      );
    }
  });
}

// Redireciona a página para um caminho definido
function redirect(page) {
  window.location.replace(page);
}

// confirm("Are you sure to execute this action?");

let usuarioFalconiId = sessionStorage.getItem("usuarioFalconiId") || 1;
let currentIdEixo = sessionStorage.getItem("currentEixoId") || 1;
let currentIdDominio = sessionStorage.getItem("currentDominioId") || 1;

let questionCards = [];
let currentQuestion = {};
let createNewOptions = [];
let questionsToBeRemoved = [];

let questionModal = new bootstrap.Modal(
  document.getElementById("questionModal")
);
function createQuestionCard(
  questionId,
  questionNumber,
  questionDomain,
  question
) {
  let newQuestionCard = `<div class="row col-12 text-center align-items-center m-2 questions" id="question${questionNumber}">
  <!--linha das questões-->
  <div class="col-lg-3 p-4">
    <h6>${questionNumber}</h6>
  </div>

  <div class="col-lg-3 p-4">
    <h6>${questionDomain}</h6>
  </div>

  <div class="col-lg-3 p-4">
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

function setQuestionModal(questionObj) {
  let radioButtons = [];

  // sets the modal content according
  // to the question object
  $("#questionNumberText").text(questionObj.numeroQuestao + ".");
  $("#questionModalTitle").text(questionObj.idDominio);
  $("#questionModalText").text(questionObj.texto);
  $("#questionWeightSelect").prop("selectedIndex", questionObj.peso);
  $("#questionDominioSelect").prop("selectedIndex", questionObj.idDominio);

  // add the question options
  const questionOptionsList = questionObj.opcoes || [];
  questionOptionsList.forEach((questionOption) => {
    console.log(questionOption);
    let radioButton = `<div class="p-2 d-flex" id="option${questionOption.id}Container">
    <div class="operation-button" id="removeOption0" onclick="removeOption(${questionOption.id},'${questionOption.texto}')"><i class="fa-solid fa-minus"></i></div>
    <div class="col-11">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioOption${questionOption.id}">
      <label class="form-check-label" contenteditable="true">
        <p id="questionOption${questionOption.id}Text">${questionOption.texto}</p>
      </label>

      <div class="row">
        <div class="col-3">
          <select class="form-select" aria-label=".form-select-sm example" id="flexRadioOption${questionOption.id}Select">
            <option value="0" selected>Pontos</option>
            <option value="1">1 ponto</option>
            <option value="2">2 pontos</option>
            <option value="3">3 pontos</option>
          </select>
        </div>
      </div>
    </div>
  </div>`;

    radioButtons.push(radioButton);
  });

  $("#optionsBody").empty().append(radioButtons);
  questionOptionsList.forEach((questionOption) => {
    $(`#flexRadioOption${questionOption.id}Select`)
      .val(questionOption.pontuacao)
      .change();
  });
}

function removeQuestionCard(questionId) {
  questionCards = questionCards.filter((questionCard) => {
    return questionCard.id != questionId;
  });
  $(`#question${questionId}`).remove();
}

function toggleModal() {
  questionModal.toggle();
}

function openQuestion(questionId) {
  let questionObj = questionCards.filter((obj) => {
    return obj.id == questionId;
  })[0];
  currentQuestion = questionObj;
  console.log(questionObj);
  $.ajax({
    type: "GET",
    url: `http://localhost:80/questao/${currentQuestion.id}/opcoes`,
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
          currentQuestion.idDominio = document.getElementById(
            "questionDominioSelect"
          ).value;
          questoes.update(
            currentQuestion.texto,
            currentQuestion.numeroQuestao,
            currentQuestion.peso,
            currentQuestion.idDominio,
            usuarioFalconiId,
            currentIdEixo,
            currentQuestion.opcoes
          );
        });
      setQuestionModal(currentQuestion);
      toggleModal();
    },
  });
}

$(document).ready(function () {
  usuarioFalconi.list(usuarioFalconiId);
  questoes.list(currentIdEixo);
});

var questoes = {
  list(eixoId) {
    $.ajax({
      type: "GET",
      url: "http://localhost:80/questoes/" + eixoId,
      success: (response) => {
        questionCards = response.questoes;
        $("#questionsWrapper").empty();
        questionCards.forEach((question) => {
          let newQuestionCard = createQuestionCard(
            question.id,
            question.numeroQuestao,
            question.idDominio,
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
      url: "http://localhost:80/questoes/create",
      data: { texto, peso, idDominio, idAutor, idEixo },
    }).done(() => {
      alert("Sucesso!");
      questoes.list(currentIdEixo);
      // toggleModal();
    });
  },
  update(texto, numeroQuestao, peso, idDominio, idAutor, idEixo, opcoes) {
    $.ajax({
      type: "POST",
      url: "http://localhost:80/questao/update",
      data: { texto, numeroQuestao, peso, idDominio, idAutor, idEixo },
      success: (response) => {
        console.log(texto);
        opcoes.forEach((opcao) => {
          opcoesQuestion.update(
            opcao.texto,
            numeroQuestao,
            opcao.pontuacao,
            opcao.numeroAlt,
            idEixo,
            idAutor
          );
        });
        createNewOptions.forEach((opcao) => {
          opcoesQuestion.create(
            opcao.texto,
            numeroQuestao,
            opcao.pontuacao,
            idAutor
          );
        });
        alert("Questão Salva com Sucesso!");
        questionCards = [];
        currentQuestion = {};
        createNewOptions = [];
        questionsToBeRemoved = [];
        questoes.list(currentIdEixo);
        toggleModal();
        // questoes.list(currentIdEixo);
      },
    });
  },
  disable(numeroQuestao) {
    $.ajax({
      type: "POST",
      url: "http://localhost:80/questoes/disable",
      data: { numeroQuestao },
    }).done(() => {
      console.log(`#question${numeroQuestao}`);
      $(`#question${numeroQuestao}`).remove();
      alert("Questão Removida!");
      // toggleModal();
    });
  },
};

var usuarioFalconi = {
  list(idUsuarioFalconi) {
    $.ajax({
      type: "GET",
      url: "http://localhost:80/usuarioFalconi/" + idUsuarioFalconi,
      success: (response) => {
        document.getElementById("userNameDisplay").textContent =
          response.user.nome;
      },
    });
  },
};

var opcoesQuestion = {
  update(texto, numeroQuestao, pontuacao, numeroAlt, idEixo, idAutor) {
    console.log(texto, numeroQuestao, pontuacao, numeroAlt, idEixo, idAutor);
    $.ajax({
      type: "POST",
      url: "http://localhost:80/opcoes/update",
      data: { texto, numeroQuestao, pontuacao, numeroAlt, idEixo, idAutor },
    }).done(() => {
      console.log(texto);
      // toggleModal();
    });
  },
  create(texto, numeroQuestao, pontuacao, idAutor) {
    $.ajax({
      type: "POST",
      url: "http://localhost:80/opcoes/create",
      data: { texto, numeroQuestao, pontuacao, idAutor },
    }).done(() => {
      console.log(texto);
      // toggleModal();
    });
  },
  disable(numeroAlt) {
    $.ajax({
      type: "POST",
      url: "http://localhost:80/opcoes/disable",
      data: { numeroAlt },
    }).done(() => {
      alert("Option Disabled!");
      // toggleModal();
    });
  },
};

// clears the currentQuestion variable when the modal is closed
function clearCurrentQuestion() {
  currentQuestion = {};
}

function addNewRawOption() {
  let newOption = {
    id: createNewOptions.length,
    texto: "Minha Nova Opção",
  };
  let radioButton = `<div class="p-2 d-flex" id="option${newOption.id}ContainerNew">
    <div class="operation-button" id="removeOption0" onclick="removeNewOption(${newOption.id}, '${newOption.texto}')"><i class="fa-solid fa-minus"></i></div>
    <div class="col-11">
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioOption${newOption.id}New">
      <label class="form-check-label" contenteditable="true">
        <p id="questionOption${newOption.id}TextNew">Nova Opção ${newOption.id}</p>
      </label>

      <div class="row">
        <div class="col-3">
          <select class="form-select" aria-label=".form-select-sm example" id="flexRadioOption${createNewOptions.length}SelectNew">
            <option value="0" selected>Pontos</option>
            <option value="1">1 ponto</option>
            <option value="2">2 pontos</option>
            <option value="3">3 pontos</option>
          </select>
        </div>
      </div>
    </div>
  </div>`;
  createNewOptions.push(newOption);
  $("#optionsBody").append(radioButton);
}

function updateCurrentQuestionOptions() {
  currentQuestion.opcoes.forEach((opcao) => {
    let texto = $(`#questionOption${opcao.id}Text`).text();
    let pontuacao = $(`#flexRadioOption${opcao.id}Select`).val();
    opcao.texto = texto;
    opcao.pontuacao = pontuacao;
  });
  createNewOptions.forEach((opcao) => {
    let texto = $(`#questionOption${opcao.id}TextNew`).text();
    let pontuacao = $(`#flexRadioOption${opcao.id}SelectNew`).val();
    opcao.texto = texto;
    opcao.pontuacao = pontuacao;
  });
}

function removeOption(optionId, optionName) {
  let shouldRemove = confirm(
    `Você tem certeza de que deseja remover a opção "${optionName}"?`
  );
  if (shouldRemove) {
    currentQuestion.opcoes = currentQuestion.opcoes.filter((opcao) => {
      if (opcao.id == optionId) {
        questionsToBeRemoved.push(opcao);
        return false;
      }
      return opcao;
    });
    $(`#option${optionId}Container`).remove();
  }
}

function removeNewOption(optionId, optionName) {
  let shouldRemove = confirm(
    `Você tem certeza de que deseja remover a opção "${optionName}"?`
  );
  if (shouldRemove) {
    createNewOptions = createNewOptions.filter((opcao) => {
      return !opcao.id == optionId;
    });
    $(`#option${optionId}ContainerNew`).remove();
  }
}

function removeQuestion(numeroQuestao) {
  let shouldRemove = confirm(
    `Você tem certeza de que deseja remover a questão "${numeroQuestao}"?`
  );
  if (shouldRemove) {
    questoes.disable(numeroQuestao);
  }
}

function createNewQuestion() {
  let shouldCreate = confirm(`Deseja criar uma nova pergunta?`);
  shouldCreate &&
    questoes.create(
      "Nova questão",
      0,
      currentIdDominio,
      usuarioFalconiId,
      currentIdEixo
    );
}

function redirect(page) {
  window.location.replace(page);
}

// confirm("Are you sure to execute this action?");

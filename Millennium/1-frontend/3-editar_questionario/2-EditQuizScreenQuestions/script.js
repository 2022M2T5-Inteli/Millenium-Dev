// mockupCards
let questionCards = [
  {
    id: 1,
    number: 1,
    domain: "Pessoas",
    question: "Qual é a relação temporários/professores efetivos?",
    weight: 1,
    options: [
      {
        id: 1,
        name: "opcao A",
        point: 2,
      },
      {
        id: 2,
        name: "opcao B",
        point: 3,
      },
      {
        id: 3,
        name: "opcao C",
        point: 4,
      },
      {
        id: 4,
        name: "opcao D",
        point: 2,
      },
    ],
  },
  {
    id: 2,
    number: 2,
    domain: "Sistema de Gestão",
    question:
      "Existe um processo de Planejamento Estratégico da Secretaria? De quanto em quanto tempo este é revisado? Quais os principais entregáveis? Quem são os envolvidos?",
    weight: 1,
    options: [
      {
        id: 1,
        name: "opcao A segunda",
        point: 2,
      },
      {
        id: 2,
        name: "opcao B segunda",
        point: 3,
      },
      {
        id: 3,
        name: "opcao C segunda",
        point: 4,
      },
      {
        id: 4,
        name: "opcao D segunda",
        point: 2,
      },
    ],
  },
  {
    id: 3,
    number: 3,
    domain: "Gestão de Pessoas",
    question:
      "Existe um processo estruturado de avaliação de Performance (Competências x Metas) para a liderança e demais níveis hierárquicos? Como funcionam as políticas de Promoção, mérito e investimento em desenvolvimento?",
    weight: 2,
    options: [
      {
        id: 1,
        name: "opcao A terceira",
        point: 2,
      },
      {
        id: 2,
        name: "opcao B terceira",
        point: 3,
      },
      {
        id: 3,
        name: "opcao C terceira",
        point: 4,
      },
      {
        id: 4,
        name: "opcao D terceira",
        point: 2,
      },
    ],
  },
];

function createQuestionCard(
  questionId,
  questionNumber,
  questionDomain,
  question
) {
  let newQuestionCard = `<div class="row col-12 text-center align-items-center m-2 questions" id="question${questionId}">
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
    <button id="trashBtn" onclick="removeQuestionCard(${questionId});">
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
  $("#questionNumberText").text(questionObj.number + ".");
  $("#questionModalTitle").text(questionObj.title);
  $("#questionModalText").text(questionObj.question);
  $("#questionWeightSelect").prop("selectedIndex", questionObj.weight);

  // add the question options
  const questionOptionsList = questionObj.options;
  questionOptionsList.forEach((questionOption) => {
    let radioButton = `<div class="form-check p-2">
    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadio${questionOption.id}">
    <label class="form-check-label" contenteditable="true">
      <p>${questionOption.name}</p>
    </label>
    <div class="row">
      <div class="col-3">
        <select class="form-select" aria-label=".form-select-sm example" id="questionOptionSelect">
          <option selected>Pontos</option>
          <option value="1">1 ponto</option>
          <option value="2">2 pontos</option>
          <option value="3">3 pontos</option>
        </select>
      </div>
    </div>
  </div>`;

    radioButtons.push(radioButton);
  });

  $("#optionsBody").empty().append(radioButtons);
}

function removeQuestionCard(questionId) {
  questionCards = questionCards.filter((questionCard) => {
    return questionCard.id != questionId;
  });
  $(`#question${questionId}`).remove();
}

function openQuestion(questionId) {
  let questionObj = questionCards.filter((obj) => {
    return obj.id == questionId;
  })[0];
  setQuestionModal(questionObj);
  let questionModal = new bootstrap.Modal(
    document.getElementById("questionModal")
  );
  questionModal.toggle();
}

$(document).ready(function () {
  questionCards.forEach((question) => {
    let newQuestionCard = createQuestionCard(
      question.id,
      question.number,
      question.domain,
      question.question
    );
    $("#questionsWrapper").append(newQuestionCard);
  });
});

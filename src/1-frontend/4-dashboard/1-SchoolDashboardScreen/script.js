var escolaId = 0;
var userId = 1;

var consolidatedAgendas = [];
var nonconsolidatedAgendas = [];
var agendasList = [];
var idQuestionarioCurrent = 4;

function evaluateConsolidatedGrade(grade) {
  if (grade < 2) {
    return "Não há evidências relevantes de aderência às melhores práticas";
  }

  if (grade >= 2 && grade < 3) {
    return "Existem mais desconexões relevantes do que boas práticas";
  }

  if (grade >= 3 && grade < 4) {
    return "Existem mais boas práticas relevantes do que desconexões";
  }

  if (grade >= 4) {
    return "Aderente às melhores práticas, mas com a gestão em fase de estabilização";
  }
}

function evaluateNonConsolidatedGrade(grade) {
  if (grade < 2) {
    return "A desenvolver";
  }

  if (grade >= 2 && grade < 3) {
    return "Pouco desenvolvido";
  }

  if (grade >= 3 && grade < 4) {
    return "Desenvolvimento intermediário";
  }

  if (grade >= 4) {
    return "Desenvolvido";
  }
}

function evaluateMaturity(grade) {
  if (grade < 2) {
    return { maturity: "Inicial", step: "25" };
  }

  if (grade >= 2 && grade < 3) {
    return { maturity: "Conhecido", step: "50" };
  }

  if (grade >= 3 && grade < 4) {
    return { maturity: "Padronizado", step: "75" };
  }

  if (grade >= 4) {
    return { maturity: "Gerenciado", step: "100" };
  }
}

function clearPageContent() {
  $("#content-section").empty();
}

function processQuestionariosResults(questionariosResultObj) {
  agendasList = [];
  Object.keys(questionariosResultObj.agenda).forEach((agendaId) => {
    const agendaObj = questionariosResultObj.agenda[agendaId];
    let eixo = [];
    Object.keys(agendaObj.eixo).forEach((eixoId) => {
      const eixoObj = agendaObj.eixo[eixoId];
      let dominio = [];
      Object.keys(eixoObj.dominio).forEach((dominioId) => {
        dominio.push(eixoObj.dominio[dominioId]);
      });

      eixoObj.dominio = dominio;
      eixo.push(eixoObj);
    });
    agendaObj.eixo = eixo;
    agendaObj.id = agendaId;
    agendasList.push(agendaObj);
    createAgendasSelector(agendasList);
    // agendaObj.hasConsolidatedGrade
    //   ? consolidatedAgendas.push(agendaObj)
    //   : nonconsolidatedAgendas.push(agendaObj);
  });
}

async function agendaSelectorHandler() {
  const selectedAgenda = document.getElementById("select-agenda").value;

  const selectedAgendaObj = agendasList.filter((agenda) => {
    return agenda.id == selectedAgenda;
  })[0];

  document.getElementById("content-section").innerHTML = "";
  if (selectedAgendaObj.hasConsolidatedGrade) {
    createConsolidatedAgendaScreen(selectedAgendaObj);
    createMaturityBlock(selectedAgendaObj.nome, selectedAgendaObj.nota);
    createGradeBlock(selectedAgendaObj.nota);
    await showUserAnswers(idQuestionarioCurrent, selectedAgendaObj.id);
  } else {
    createNonConsolidatedAgendaScreen(selectedAgendaObj);
    await showUserAnswers(idQuestionarioCurrent, selectedAgendaObj.id);
  }
}

function createQuestionarioCard(questionarioId) {
  const newQuestionarioCardHTML = `<div class="col-12">
            <div class="button-container p-3 card button-card d-flex flex-row justify-content-start align-items-center">
              <span><i class="fa-solid fa-book-open button-icons" id="buttonRede"></i></span>
              <h2 class="school-name-text">Questionário #${questionarioId}</h2>
            </div>
          </div>`;
  $("#questionarioCardsSection").append(newQuestionarioCardHTML);
}

// Comunicação com a API
var Escola = {
  async listQuestionarios(idEscola) {
    return await $.ajax({
      type: "GET",
      url: API_BASE_URL + `/escolas/escola/${idEscola}/questionarios`,
    });
  },
};

var Questionario = {
  async getResultado(idQuestionario) {
    const data = await $.ajax({
      type: "GET",
      url:
        API_BASE_URL +
        `/questionarios/questionario/${idQuestionario}/resultado`,
    });
    const resultado = data.resultado;
    processQuestionariosResults(resultado);
    return true;
  },
  async getRespostas(idQuestionario, idAgenda) {
    const data = await $.ajax({
      type: "GET",
      url:
        API_BASE_URL +
        `/questionarios/questionario/${idQuestionario}/respostas/agenda/${idAgenda}`,
    });
    return data.respostas;
  },
};

var UsuarioEscola = {
  dados(idUsuarioEscola) {
    $.ajax({
      type: "GET",
      url: API_BASE_URL + "/usuarios/escola/" + idUsuarioEscola,
      success: function (resultado) {
        document.getElementById("nomeUsuario").textContent =
          resultado.user.nome;
      },
    });
  },
};

async function loadSchoolQuestionariosCards() {
  const { questionarios } = await Escola.listQuestionarios(escolaId);
  $("#questionarioCardsContainer").empty();
  questionarios.forEach((questionario) => {
    if (questionario.isComplete) {
      const questionarioCard = createQuestionarioCard(
        `Questionário #${questionario.id}`,
        questionario.id
      );
      $("#questionarioCardsContainer").append(questionarioCard);
    }
  });
  // questionarioCardsContainer
}

function createQuestionarioCard(name, id) {
  const cardContainer = document.createElement("div");
  cardContainer.className = "col-12";

  const buttonContainerElement = document.createElement("div");
  buttonContainerElement.className =
    "button-container p-3 card button-card d-flex flex-row justify-content-start align-items-center";

  buttonContainerElement.innerHTML = `<i class="fa-solid fa-book-open button-icons" id="buttonRede"></i>
  <h2 class="card-name-text">${name}</h2>`;
  cardContainer.append(buttonContainerElement);
  cardContainer.onclick = () => {
    clearPageContent();
    Questionario.getResultado(id);
    document.getElementById(
      "pageResultadoHeader"
    ).textContent = `Resultados do questionário "${name}"`;
  };
  return cardContainer;
}

function showConsolidatedResults(consolidatedAgendaList) {
  consolidatedAgendaList.forEach((agendaElement) => {});
}
Chart.defaults.font.size = 16;
// Returns a new Radar Graph as a HTML element
function createRadarGraphBlock(
  title,
  labels,
  datasets,
  chartId,
  showDatasetLabel = true
) {
  // Block container element
  const blockContainer = document.createElement("div");
  blockContainer.className = "graph-blocks";
  blockContainer.id = "CLsection";

  // Block title "paragraph" element
  const blockContainerParagraph = document.createElement("p");
  blockContainerParagraph.textContent = title;

  // Chart HTML elements
  const chartContainer = document.createElement("div");
  const chartElement = document.createElement("canvas");
  chartElement.id = chartId;

  // Append elements to the before-created ones
  blockContainer.append(blockContainerParagraph);
  chartContainer.append(chartElement);
  blockContainer.append(chartContainer);
  const data = {
    labels,
    datasets,
  };

  const config = {
    type: "radar",
    data: data,
    options: {
      aspectRatio: 1,
      responsive: true,
      // scales: {
      //   r: {
      //     pointLabels: {
      //       font: {
      //         size: 20,
      //       },
      //     },
      //   },
      // },
      plugins: {
        legend: {
          display: showDatasetLabel,
        },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };
  new Chart(chartElement, config);
  return blockContainer;
  // new Chart(document.getElementById("myChart2"), config);
}

function createAccordionElement(title, content, id, accordionId) {
  const accordionItemDiv = document.createElement("div");
  accordionItemDiv.className = "accordion-item";
  const accordionHeader = document.createElement("h2");
  accordionHeader.className = "accordion-header";
  accordionHeader.id = `flush-heading${id}`;
  const accordionButton = document.createElement("button");
  accordionButton.className = "accordion-button collapsed";
  accordionButton.type = "button";
  accordionButton.setAttribute("data-bs-toggle", "collapse");
  accordionButton.setAttribute("data-bs-target", `#flush-collapse${id}`);
  accordionButton.textContent = title;
  accordionHeader.append(accordionButton);
  accordionItemDiv.append(accordionHeader);
  const accordionFlushElement = document.createElement("div");
  accordionFlushElement.className = "accordion-collapse collapse";
  accordionFlushElement.id = `flush-collapse${id}`;
  accordionFlushElement.setAttribute("data-bs-parent", accordionId);

  const accordionBodyElement = document.createElement("div");
  accordionBodyElement.className = "accordion-body";
  accordionBodyElement.textContent = content;

  accordionFlushElement.append(accordionBodyElement);
  accordionItemDiv.append(accordionFlushElement);
  return accordionItemDiv;
}

async function showUserAnswers(questionarioId, agendaId) {
  const answers = await Questionario.getRespostas(questionarioId, agendaId);
  const containerDiv = document.createElement("div");
  containerDiv.className = "graph-blocks";
  containerDiv.id = "domSection";

  const containerTitle = document.createElement("p");
  containerTitle.textContent = "Questões Respondidas";
  containerDiv.append(containerTitle);

  const accordionDiv = document.createElement("div");
  accordionDiv.className = "accordion accordion-flush";
  accordionDiv.id = "accordionQuestoes";
  answers.forEach((answer) => {
    const newAccordionItem = createAccordionElement(
      `Pergunta: ${answer.textoQuestao}`,
      `Resposta: ${answer.textoAlternativa}`,
      answer.id,
      "#accordionQuestoes"
    );
    accordionDiv.append(newAccordionItem);
  });
  containerDiv.append(accordionDiv);
  document.getElementById("content-section").append(containerDiv);
}

function createGradeTableRowElement(section, maxGrade, grade, result) {
  let trElement = document.createElement("tr");

  let sectionThElement = document.createElement("th");
  sectionThElement.textContent = section;

  let maxGradeTdElement = document.createElement("td");
  maxGradeTdElement.textContent = maxGrade;
  maxGradeTdElement.className = "text-center";

  let gradeTdElement = document.createElement("td");
  gradeTdElement.textContent = grade;
  gradeTdElement.className = "text-center";

  let resultTdElement = document.createElement("td");
  resultTdElement.textContent = result;

  trElement.append(
    sectionThElement,
    maxGradeTdElement,
    gradeTdElement,
    resultTdElement
  );

  return trElement;
}

// Retorna um elemento HTML com as notas de uma seção
// podendo ser eixos, domínios ou outros
function createGradeTable(
  tableName,
  sectionName,
  sectionList,
  maxGradeList,
  gradeList,
  resultList,
  highlightLastRow = true
) {
  let tableContainerDiv = document.createElement("div");
  tableContainerDiv.className =
    "graph-blocks grade-evaluate-table col-5 col-lg-12";
  let tableElement = document.createElement("table");
  tableElement.className = "table text-start";

  let containerDivTitleElement = document.createElement("p");
  containerDivTitleElement.textContent = tableName;

  let thead = document.createElement("thead");
  let theadTr = document.createElement("tr");

  let thSectionTitleElement = document.createElement("th");
  thSectionTitleElement.textContent = sectionName;

  let maxGradeTh = document.createElement("th");
  maxGradeTh.textContent = "Máximo";

  let gradeTh = document.createElement("th");
  gradeTh.textContent = "Nota";

  let resultTh = document.createElement("th");
  resultTh.textContent = "Resultado";

  theadTr.append(thSectionTitleElement, maxGradeTh, gradeTh, resultTh);
  thead.append(theadTr);

  tableElement.append(thead);

  let tbodyElement = document.createElement("tbody");

  sectionList.forEach((section, index) => {
    let isLastElement = sectionList.length - 1 == index;
    let sectionTrElement = createGradeTableRowElement(
      section,
      maxGradeList[index],
      gradeList[index],
      resultList[index],
      isLastElement
    );
    if (isLastElement && highlightLastRow) {
      sectionTrElement.className = "custom-last-row";
    }
    tbodyElement.append(sectionTrElement);
  });
  tableElement.append(tbodyElement);

  tableContainerDiv.append(containerDivTitleElement);
  tableContainerDiv.append(tableElement);
  return tableContainerDiv;
}

// Cria um gráfico do tipo radar para uma agenda consolidada
function createConsolidatedAgendaScreen(agendaObj) {
  // labels and values to be shown at the Radar Graph
  const eixoLabelList = [];
  const eixoGradeList = [];
  const dominioOportunidadeList = [];

  agendaObj.eixo.forEach((eixo, index) => {
    const maxGrade = eixo.maxGrade;
    const dominioLabelList = [];
    const dominioValueList = [];
    const maxGradeList = [];
    const minGradeList = [];
    const resultList = [];
    eixoLabelList.push(eixo.nome);
    eixoGradeList.push(eixo.nota);
    eixo.dominio.forEach((dominio) => {
      dominioLabelList.push(dominio.nome);
      dominioValueList.push(dominio.nota);
      dominioOportunidadeList.push(maxGrade - dominio.nota);
      maxGradeList.push(maxGrade);
      minGradeList.push(0);
      resultList.push(evaluateConsolidatedGrade(dominio.nota));
    });

    const datasets = [
      {
        label: "Nota",
        data: dominioValueList,
        fill: true,
        backgroundColor: "rgb(92, 120, 165,0.2)",
        borderColor: "rgb(92, 120, 165)",
        pointBackgroundColor: "#405474",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "Máximo",
        data: maxGradeList,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132, 0)",
        pointBackgroundColor: "rgb(255, 99, 132,0)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "Mínimo",
        data: minGradeList,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132, 0)",
        pointBackgroundColor: "rgb(255, 99, 132,0)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ];

    const newGraphId = `graph-eixo-${index}`;
    const dominiosGraph = createRadarGraphBlock(
      eixo.nome,
      dominioLabelList,
      datasets,
      newGraphId,
      false
    );

    // Adiciona o resultado total do eixo
    dominioLabelList.push("Total");
    dominioValueList.push(eixo.nota);
    maxGradeList.push(eixo.maxGrade);
    resultList.push(evaluateConsolidatedGrade(eixo.nota));
    const gradeTable = createGradeTable(
      eixo.nome,
      "Domínio",
      dominioLabelList,
      maxGradeList,
      dominioValueList,
      resultList
    );
    document.getElementById("content-section").prepend(gradeTable);
    document.getElementById("content-section").prepend(dominiosGraph);
  });
}

// Cria um gráfico do tipo radar para uma agenda não consolidada
function createNonConsolidatedAgendaScreen(agendaObj) {
  // labels and values to be shown at the Radar Graph
  const eixoLabelList = [];
  const eixoGradeList = [];
  const eixoOportunidadeList = [];
  const maxGradeList = [];
  const minGradeList = [];
  const resultList = [];

  agendaObj.eixo.forEach((eixo) => {
    const maxGrade = eixo.maxGrade;
    eixoLabelList.push(eixo.nome);
    eixoGradeList.push(eixo.nota);
    eixoOportunidadeList.push(maxGrade - eixo.nota);
    maxGradeList.push(maxGrade);
    minGradeList.push(0);
    resultList.push(evaluateNonConsolidatedGrade(eixo.nota));
  });

  const datasets = [
    {
      label: "Nota",
      data: eixoGradeList,
      fill: true,
      backgroundColor: "rgb(92, 120, 165,0.2)",
      borderColor: "rgb(92, 120, 165)",
      pointBackgroundColor: "#405474",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      label: "Máximo",
      data: maxGradeList,
      fill: false,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132, 0)",
      pointBackgroundColor: "rgb(255, 99, 132,0)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      label: "Mínimo",
      data: minGradeList,
      fill: false,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132, 0)",
      pointBackgroundColor: "rgb(255, 99, 132,0)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
  ];

  const newGraphId = `graph-eixos`;
  const eixosGraph = createRadarGraphBlock(
    agendaObj.nome,
    eixoLabelList,
    datasets,
    newGraphId,
    false
  );

  const gradeTable = createGradeTable(
    agendaObj.nome,
    "Dimensão",
    eixoLabelList,
    maxGradeList,
    eixoGradeList,
    resultList,
    false
  );
  document.getElementById("content-section").prepend(gradeTable);
  document.getElementById("content-section").prepend(eixosGraph);
}

function createMaturityBlock(name, grade) {
  const maturityObj = evaluateMaturity(grade);
  const percentageClass = `progress-${maturityObj.step}`;

  const maturityDiv = document.createElement("div");
  maturityDiv.className = "graph-blocks maturity-block";
  maturityDiv.id = "chartSec";

  const maturityDivTitle = document.createElement("p");
  maturityDivTitle.textContent = `Maturidade da Agenda - ${name}`;
  maturityDiv.append(maturityDivTitle);

  const maturityDivContent = document.createElement("div");
  maturityDivContent.className = "graph-block-content";

  const progressBarDiv = document.createElement("div");
  progressBarDiv.className = "progress-bar";

  const progressBarValueDiv = document.createElement("div");
  progressBarValueDiv.className = "progress-value " + percentageClass;

  progressBarValueDiv.innerHTML = ` <i class="fa-solid fa-rocket"
  data-bs-toggle="tooltip"
  data-bs-placement="top"
  title="O resultado da sua maturidade: ${maturityObj.maturity}"></i>`;

  progressBarDiv.append(progressBarValueDiv);
  const maturityText = document.createElement("h5");
  maturityText.textContent = `Diagnóstico: ${maturityObj.maturity}`;

  maturityDivContent.append(progressBarDiv, maturityText);
  maturityDiv.append(maturityDivContent);
  document.getElementById("content-section").prepend(maturityDiv);
}

function createGradeBlock(grade) {
  const blockContainerDiv = document.createElement("div");
  blockContainerDiv.className = "graph-blocks";
  blockContainerDiv.id = "chartSec2";

  blockContainerDiv.textContent = "Nota da Agenda";

  const blockDivContent = document.createElement("div");
  blockDivContent.className = "graph-block-content";
  blockDivContent.innerHTML = `<h1>${grade}</h1>`;

  blockContainerDiv.append(blockDivContent);
  document.getElementById("content-section").prepend(blockContainerDiv);
}

async function createAgendasSelector(agendasObj) {
  const select = document.createElement("select");
  select.className = "form-select text-center";
  select.id = "select-agenda";

  const baseOption = document.createElement("option");
  baseOption.value = null;
  baseOption.textContent = "Selecione uma agenda";
  baseOption.disabled = true;
  select.append(baseOption);

  agendasObj.forEach((agenda) => {
    const newOption = document.createElement("option");
    newOption.value = agenda.id;
    newOption.textContent = agenda.nome;
    select.append(newOption);
  });
  // agendaSelectorHandler();
  select.onchange = () => {
    agendaSelectorHandler();
  };
  select.selectedIndex = 0;
  $("#agendaSelectorContainer").empty().append(select);
}

$(document).ready(() => {
  UsuarioEscola.dados(userId);
  loadSchoolQuestionariosCards();
});

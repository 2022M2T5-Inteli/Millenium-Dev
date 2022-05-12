const sections = [
  {
    id: 1,
    name: "Ensino",
    questionsAmount: 12,
  },
  {
    id: 1,
    name: "Pessoas",
    questionsAmount: 8,
  },
  {
    id: 1,
    name: "Fluxo",
    questionsAmount: 7,
  },
  {
    id: 1,
    name: "Incentivos",
    questionsAmount: 9,
  },
  {
    id: 1,
    name: "Infraestrutura e TI",
    questionsAmount: 3,
  },
  {
    id: 1,
    name: "Gestão para resultados",
    questionsAmount: 5,
  },
  {
    id: 1,
    name: "Equidade",
    questionsAmount: 6,
  },
  {
    id: 1,
    name: "Gestão para resultados teste",
    questionsAmount: 20,
  },
];

function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}">
  <h3 class="section-name">${sectionName}</h3><i class="fa-regular fa-pen-to-square"></i></div>`;
  return cardElement;
}

$(document).ready(function () {
  sections.forEach((section) => {
    let newSectionCard = createSectionCard(
      section.id,
      section.name,
      section.questionsAmount
    );
    $("#cardBox").append(newSectionCard);
  });
});

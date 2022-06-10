var eixos = [];

function createSectionCard(sectionId, sectionName, questionsAmount) {
  let cardElement = `<div class="card col-12 col-lg-2 m-5 p-4 section-card" id="sectionCard${sectionId}">
  <h3 class="section-name">${sectionName}</h3><i class="fa-regular fa-pen-to-square"></i></div>`;
  return cardElement;
}

function createCardEixos() {
  eixos.forEach((eixo) => {
    let newSectionCard = createSectionCard(
      eixo.id,
      eixo.nome,
      eixo.idAgenda
    );
    $("#cardBox").append(newSectionCard);
  });


}


$(document).ready(function () {

  usuarioFalconi.dados(1);
  listarEixos.list();
  

});


// ajax listar dados usuário falconi
var usuarioFalconi = {
	dados(idUsuarioFalconi) {
		$.ajax({
			type: "GET",
			url: "http://127.0.0.1:3071/usuarioFalconi/" + idUsuarioFalconi,
			success: function (resultado) {
				document.getElementById("nomeUsuario").textContent = resultado.user.nome;
			},
		});
	},
};


// ajax listar eixos
var listarEixos = {
  list() {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:3071/eixos/",
			success: function (resultado) {
        eixos = resultado.eixos;
        createCardEixos();
      },
      
    });
 
  },

};


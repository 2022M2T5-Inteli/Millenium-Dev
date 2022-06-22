var port = 5000
var API = `http://127.0.0.1:${port}`;
var nQuest = 0;
var textoQuestao = {}

$(document).ready(() => {
  schoolQuestion.list(1);
});


//Puxa as questões do banco de dados e muda no HTML
var schoolQuestion = {
  list(idEixo) {
    console.log("funciona")
    $.ajax({
      type: "GET",
      url: API + "/questoes/eixo/" + idEixo,
      success: function (resultados) {

        resultados.questoes.forEach((questao) => {
          nQuest += 1;
          console.log(questao.id + "bgidlfbhilz")
          textoQuestao[questao.id] = questao.texto;
          //var element = `<p class="col-11" id="pergunta" id="gray">${questao.texto}</p>`;
          document.getElementById("paginas").innerHTML += `<li class="icon.box"><a class="page-link" onclick="abrirQuestao(${questao.id})" href="#">${nQuest}</a></li>`;
        })
        document.getElementById("paginas").innerHTML += `<li class="icon.box">
                  <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>`
        console.log(textoQuestao);
      },
    });
  },
};

function abrirQuestao(idQuestao) {
  document.getElementById("pergunta").innerHTML = textoQuestao[idQuestao];
  respostas.list(idQuestao)

};

//Puxa as alternativas do banco de dados e muda no HTML
var respostas = {
  list(idQuestao) {
    $.ajax({
      type: "GET",
      url: `${API}/opcoes/listByQustao/${idQuestao}`,
      success: data => {
        console.log("success", data);
        document.getElementById("respostas").innerHTML = ``;
        nAlternativa = 0
        data.opcoes.forEach((element) => {
          nAlternativa += 1
          document.getElementById("respostas").innerHTML += `<div  class="form-check">
          <input class="form-check-input" type="radio" name="resposta" id="flexRadioDefault${nAlternativa}" value="${element.id}" questao="${idQuestao}">
          <label class="form-check-label" for="flexRadioDefault${nAlternativa}">
            ${element.texto}
          </label>
        </div>`;
        });
      },
    });
  }

}

function entregaAlternativa() {
  //console.log(document.querySelector('input[name="resposta"]:checked').value);
  console.log(document.getElementById('w3review').value)
  $.ajax({
    type: "POST",
    url: `${API}/respostas/create`,
    data: {
      observacao: document.getElementById('w3review').value,
      idAlternativa: document.querySelector('input[name="resposta"]:checked').value,
      idQuestao: document.querySelector('input[name="resposta"]:checked').getAttribute("questao"),
      
    }
  })
}







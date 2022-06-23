var port = 5000
var API = `http://127.0.0.1:${port}`;
var nQuest = 0;
var textoQuestao = {}
var idQuestionario = 4
var proximaQuestao = 0

$(document).ready(() => {
  schoolQuestion.list(1);
});


//Puxa as questões do banco de dados e muda no HTML
var schoolQuestion = {
  list(idEixo) {
    console.log("funciona");
    $.ajax({
      type: "GET",
      url: API + `/questionarios/questionario/${idQuestionario}/respostas/eixo/` + idEixo,
      success: function (resultados) {
        document.getElementById("paginas").innerHTML = "";
        nQuest = 0;
        textoQuestao = {};
        resultados.respostas.forEach((questao, index) => {
          nQuest += 1;
          console.log(questao.idQuestao + "bgidlfbhilz")
          textoQuestao[questao.idQuestao] = { texto: questao.textoQuestao, observacao: questao.observacao };
          //var element = `<p class="col-11" id="pergunta" id="gray">${questao.texto}</p>`;
          let proximaQuestaoId = null;
          if (index < resultados.respostas.length - 1) {
            const proximaQuestaoObj = resultados.respostas[index + 1];
            console.log(proximaQuestaoObj.idQuestao)
            proximaQuestaoId = proximaQuestaoObj.idQuestao;
          }
          let BGcolor = "";
          if (questao.idAlternativa == "" || questao.idAlternativa == undefined) {
            BGcolor = "#fff"
          }
          else {
            BGcolor = "#bcff4f"
          }
          document.getElementById("paginas").innerHTML += `<li class="icon.box" id="buttonQuestao${questao.idQuestao}" proxima-questao="${proximaQuestaoId}"><a class="page-link" onclick="abrirQuestao(${questao.idQuestao},${proximaQuestaoId})" href="#" style="background-color: ${BGcolor}">${nQuest}</a></li>`;
        })
        console.log(textoQuestao);
      },
    });
  },
};

function abrirQuestao(idQuestao, idProximaQuestao) {
  document.getElementById("pergunta").innerHTML = textoQuestao[idQuestao].texto;
  document.getElementById('w3review').value = textoQuestao[idQuestao].observacao;
  proximaQuestao = idProximaQuestao
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

async function entregaAlternativa() {
  //console.log(document.querySelector('input[name="resposta"]:checked').value);
  console.log(document.getElementById('w3review').value)
  if (document.querySelector('input[name="resposta"]:checked')) {
    await $.ajax({
      type: "POST",
      url: `${API}/respostas/create`,
      data: {
        idQuestionario: idQuestionario,
        observacao: document.getElementById('w3review').value,
        idAlternativa: document.querySelector('input[name="resposta"]:checked').value,
        idQuestao: document.querySelector('input[name="resposta"]:checked').getAttribute("questao"),
      }
    })
    schoolQuestion.list(1);
    const proxima2Questao = document.getElementById(`buttonQuestao${proximaQuestao}`).getAttribute("proxima-questao") 
    abrirQuestao(proximaQuestao,proxima2Questao)
  }
  else {
    const proxima2Questao = document.getElementById(`buttonQuestao${proximaQuestao}`).getAttribute("proxima-questao") 
    abrirQuestao(proximaQuestao,proxima2Questao)
  }
}







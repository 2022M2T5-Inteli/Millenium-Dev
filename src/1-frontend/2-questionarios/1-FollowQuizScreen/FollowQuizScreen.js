var card = [];
var nQuest = [];
var pTotal = Number(0);
let idQuestionario = Number(0);

let eixoDone = 0;
let eixoNDone = 0;

//AJAX 
$(document).ready(async () => {
  sessionStorage.removeItem("idProximaQuestao");
  idQuestionario = await questionario.list(sessionStorage.getItem("idEscola"));

  await agendas.list3(idQuestionario);
  //questionario.list2();
  await eixos.list(idQuestionario);
  pTotal = eixoDone / eixoNDone;
  finish();
  sessionStorage.setItem("idQuestionario", idQuestionario);
  document.getElementById("nomeUsuario").textContent =
    sessionStorage.getItem("userName");
  document.getElementById("nomeEscola").textContent =
    sessionStorage.getItem("nomeEscola");
  //questionario.list(1)
});

var questionario = {
  async list(idEscola) {
    console.log("nem ajax" + idEscola);
    const data = await $.ajax({
      url: API_BASE_URL + `/escolas/escola/${idEscola}/questionariosAbertos`,
      type: "GET",
      success: (data) => {
        data.questionarios.forEach((element) => {
          let idQuestionario = element.id;
          console.log("success" + idQuestionario);
          return idQuestionario;
        });
      },
      error: (data) => {
        console.log("erro" + idQuestionario);
      },
    });
    var idQuestionario = 0;
    data.questionarios.forEach((element) => {
      idQuestionario = element.id;
      console.log("success" + idQuestionario);
    });
    return idQuestionario;
  },
};

var agendas = {
  async list3(idQuestionarioCurrent) {
    $.ajax({
      url:
        API_BASE_URL +
        `/questionarios/questionario/${idQuestionarioCurrent}/respostas/agendas`,
      type: "GET",
      success: (data) => {
        data.agendas.forEach(async (element) => {
          let idAgenda = element.id;
          let nomeAgenda = element.nome;
          document.getElementById(
            "select-agenda"
          ).innerHTML += `<option value="${idAgenda}">${nomeAgenda}</option>`;
        });
      },
      error: (data) => {
        console.log(data);
      },
    });
  },
};
var progress = {
  async list2(eixo) {
    let progressEixo = 0;
    const data = await $.ajax({
      url:
        API_BASE_URL +
        `/questionarios/questionario/${await questionario.list(
          sessionStorage.getItem("idEscola")
        )}/respostas/eixo/${eixo}`,
      type: "GET",
    });

    var done = Number();
    var allQ = Number();

    data.respostas.forEach((element) => {
      console.log(element);
      if (element.idAlternativa == "" || element.idAlternativa == null) {
        allQ += 1;
        console.log(element);
      } else {
        console.log("hello");
        done += 1;
        allQ += 1;
      }

      console.log("progresso" + progressEixo);
    });
    progressEixo = (100 * done) / allQ;

    if (progressEixo == 100) {
      eixoDone += 1;
      eixoNDone += 1;
    } else {
      eixoNDone += 1;
    }

    return progressEixo;
  },
};

var qEixo = {};

var eixos = {
  async list() {
    let agenda = document.getElementById("select-agenda").value;
    document.getElementById("boxes-geral").innerHTML = "";
    if (agenda == 0) {
      const data = await $.ajax({
        url:
          API_BASE_URL +
          `/questionarios/questionario/${idQuestionario}/respostas/eixos`,
        type: "GET",
      });
      for (i = 0; i < data.eixos.length; i++) {
        const element = data.eixos[i];
        let eixo = element.id;
        // progress.list2(eixo);
        let progressEixo = await progress.list2(eixo);

        console.log("r" + progressEixo);
        let card = `card${element.id}`;
        document.getElementById(
          "boxes-geral"
        ).innerHTML += `<div class="card col-12 col-lg-3">
                <div class="row" id="card-quiz" type="button" onclick="saveEixo(${
                  element.id
                }, '${element.nome}')">
                <a href="../3-SchoolQuizScreen/">
                        <div class="col-12">
                            <p><strong>${element.nome}</strong></p>
                        </div>
                        <div class="col-12">
                            <div id="circular-progress">
                                <div id="card${
                                  element.id
                                }" role="progressbar" aria-valuenow="${Math.round(
          progressEixo
        )}" aria-valuemin="0"
                                    aria-valuemax="100" style="--value:">
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
        value = document.getElementById(card).getAttribute("aria-valuenow");
        if (value > 70 && value < 100) {
          document.getElementById(card).setAttribute("role", "progressbar1");
        }
        if (value <= 70 && value > 30) {
          document.getElementById(card).setAttribute("role", "progressbar");
        }
        if (value <= 30 && value > 0) {
          document.getElementById(card).setAttribute("role", "progressbar3");
        }
        if (value == 100) {
          document.getElementById(card).setAttribute("role", "progressbar100");
          document.getElementById(card).innerHTML =
            "<i class='fa-solid fa-check' style='font-size: 2rem;'></i>";
        }
        if (value == 0) {
          document.getElementById(card).setAttribute("role", "progressbar0");
        }
        var style = `--value:${value}`;
        document.getElementById(card).setAttribute("style", style);
      }
    } else {
      await $.ajax({
        url:
          API_BASE_URL +
          `/questionarios/questionario/${idQuestionario}/respostas/agendas/${agenda}/eixos`,
        type: "GET",
        success: async (data) => {
          await data.eixos.forEach(async (element) => {
            let eixo = element.id;
            // progress.list2(eixo);
            let progressEixo = await progress.list2(eixo);
            console.log("r" + progressEixo);
            let card = `card${element.id}`;
            document.getElementById(
              "boxes-geral"
            ).innerHTML += `<div class="card col-12 col-lg-3">
                        <div class="row" id="card-quiz" type="button" onclick="saveEixo(${
                          element.id
                        }, '${element.nome}')">
                            <a href="../3-SchoolQuizScreen/">
                                <div class="col-12">
                                    <p><strong>${element.nome}</strong></p>
                                </div>
                                <div class="col-12">
                                    <div id="circular-progress">
                                        <div id="card${
                                          element.id
                                        }" role="progressbar" aria-valuenow="${Math.round(
              progressEixo
            )}" aria-valuemin="0"
                                            aria-valuemax="100" style="--value:0">
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>`;
            value = document.getElementById(card).getAttribute("aria-valuenow");
            if (value > 70 && value < 100) {
              document
                .getElementById(card)
                .setAttribute("role", "progressbar1");
            }
            if (value <= 70 && value > 30) {
              document.getElementById(card).setAttribute("role", "progressbar");
            }
            if (value <= 30 && value > 0) {
              document
                .getElementById(card)
                .setAttribute("role", "progressbar3");
            }
            if (value == 100) {
              document
                .getElementById(card)
                .setAttribute("role", "progressbar100");
              document.getElementById(card).innerHTML =
                "<i class='fa-solid fa-check' style='font-size: 2rem;'></i>";
            }
            if (value == 0) {
              document
                .getElementById(card)
                .setAttribute("role", "progressbar0");
            }
            var style = `--value:${value}`;
            document.getElementById(card).setAttribute("style", style);
          });
        },
        error: (data) => {
          console.log(data);
        },
      });
    }
  },
};

var value = "";

function saveEixo(id, nomeEixo) {
  var eixoEscolhido = id;
  sessionStorage.setItem("idEixo", eixoEscolhido);
  sessionStorage.setItem("nomeEixo", nomeEixo);
}

function finish() {
  if (pTotal == 1) {
    document.getElementById("finished").innerHTML =
      "<button id='done' onclick='questionarioDone()'>Entregar Questionario</button>";
  }
}

async function questionarioDone() {
  try {
    await $.ajax({
      url: API_BASE_URL + "/questionarios/close",
      type: "POST",
      data: { id: idQuestionario },
    });
    Swal.fire({
      icon: "success",
      title: "Parabéns!",
      text: "Questionário finalizado com sucesso!",
    }).then((result) => {
      location.href = "../../4-dashboard/1-SchoolDashboardScreen";
    });
  } catch (err) {
    console.log(err);
    Swal.fire("Erro ao entregar questionario");
  }
}

//pega o valor atual da porcentagem da barra de progresso de cada card no html
//e verifica em qual intervalo ela esta. Muda a "role" do card conforme o
//intervalo identificado para que seja atribuido um estilo especifico para o card no CSS

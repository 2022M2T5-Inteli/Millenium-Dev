var port = 5000
var API = `http://127.0.0.1:${port}`;
var idQuestionario = 0
var card = [];
var nQuest = [];


$(document).ready(() => {
    //questionario.list2();
    eixos.list();

});


var progress = {
    async list2(eixo) {
        let progressEixo = 0
        const data = await $.ajax({
            url: API + `/questionarios/questionario/${idQuestionario}/respostas/eixo/${eixo}`,
            type: 'GET',

        });
        data.respostas.forEach(element => {
            var done = Number();
            var allQ = Number();
            if (element.idAlternativa = "") {
                allQ += 1
            }
            else {
                allQ += 1;
                done += 1
            };
            progressEixo = 100 * done / allQ;
            console.log(progressEixo);
        })
        return progressEixo
        console.log(data)
        return 0
    }
}



var qEixo = {}

var eixos = {

    async list() {

        $.ajax({
            url: API + '/eixos/list',
            type: 'GET',
            success: data => {
                data.eixos.forEach(async (element) => {
                    let eixo = (element.id);
                    progress.list2(eixo);
                    let progressEixo = ((await progress.list2(eixo)));
                    console.log("r" + progressEixo);
                    let card = (`card${element.id}`);
                    document.getElementById("boxes-geral").innerHTML += `<div class="card col-12 col-lg-3">
                    <div class="row" id="card-quiz" type="button">
                        <a href="https://www.google.com.br">
                            <div class="col-12">
                                <p><strong>${element.nome}</strong></p>
                            </div>
                            <div class="col-12">
                                <div id="circular-progress">
                                    <div id="card${element.id}" role="progressbar" aria-valuenow="${progressEixo}" aria-valuemin="0"
                                        aria-valuemax="100" style="--value:0">
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`;
                    value = document.getElementById(card).getAttribute("aria-valuenow")
                    if (value > 70 && value < 100) {
                        document.getElementById(card).setAttribute("role", "progressbar1")
                    }
                    if (value <= 70 && value > 30) {
                        document.getElementById(card).setAttribute("role", "progressbar")
                    }
                    if (value <= 30 && value > 0) {
                        document.getElementById(card).setAttribute("role", "progressbar3")
                    }
                    if (value == 100) {
                        document.getElementById(card).setAttribute("role", "progressbar100")
                        document.getElementById(card).innerHTML = "<i class='fa-solid fa-check' style='font-size: 2rem;'></i>"
                    }
                    if (value == 0) {
                        document.getElementById(card).setAttribute("role", "progressbar0")
                    }
                    var style = `--value:${value}`
                    document.getElementById(card).setAttribute("style", (style))

                });

            },
            error: data => {
                console.log(data)
            }
        });

    }

};



var value = "";


//pega o valor atual da porcentagem da barra de progresso de cada card no html
//e verifica em qual intervalo ela esta. Muda a "role" do card conforme o
//intervalo identificado para que seja atribuido um estilo especifico para o card no CSS



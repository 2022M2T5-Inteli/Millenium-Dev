var port = 80
var API = `http://127.0.0.1:${port}`;
var idQuestionario = 1
var card = [];
var nQuest = [];


$(document).ready(() => {
    //questionario.list2();
    eixos.list();
    progress.list2()

});


var progress = {
    list2() {
    $.ajax({
        url: API + `/questionarios/${idQuestionario}/questoes/eixo/${eixo}`,
        type: 'GET',

        success: data => {

            console.log("funciona"+eixo);


            data.questoes.forEach(element => {
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
                console.log(progressoEixo)
                error: data => {
                    console.log(data);
                };
            });
        },
        error: data => {
            console.log()
        }
    });
}}
        


var qEixo = {}

var eixos = {

    list() {

        $.ajax({
            url: API + '/eixos',
            type: 'GET',
            success: data => {
                var progressEixo = Number();
                var tx = '';
                data.eixos.forEach(element => {
                    let eixo = (element.id);
                    console.log("Eixo:" + eixo);
                    card.push(`card${element.id}`)
                    document.getElementById("boxes-geral").innerHTML += `<div class="card col-12 col-lg-3">
                    <div class="row" id="card-quiz" type="button">
                        <a href="https://www.google.com.br">
                            <div class="col-12">
                                <p><strong>${element.nome}</strong></p>
                            </div>
                            <div class="col-12">
                                <div id="circular-progress">
                                    <div id="card${element.id}" role="progressbar" aria-valuenow="${progressEixo}" aria-valuemin="0"
                                        aria-valuemax="100" style="--value:75">
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`
                });
                for (let i = 0; i < card.length; i++) {
                    value = document.getElementById(card[i]).getAttribute("aria-valuenow")
                    if (value > 70 && value < 100) {
                        document.getElementById(card[i]).setAttribute("role", "progressbar1")
                    }
                    if (value <= 70 && value > 30) {
                        document.getElementById(card[i]).setAttribute("role", "progressbar")
                    }
                    if (value <= 30 && value > 0) {
                        document.getElementById(card[i]).setAttribute("role", "progressbar3")
                    }
                    if (value == 100) {
                        document.getElementById(card[i]).setAttribute("role", "progressbar100")
                        document.getElementById(card[i]).innerHTML = "<i class='fa-solid fa-check' style='font-size: 2rem;'></i>"
                    }
                    if (value == 0) {
                        document.getElementById(card[i]).setAttribute("role", "progressbar0")
                    }
                    var style = `--value:${value}`
                    document.getElementById(card[i]).setAttribute("style", (style))
                }

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



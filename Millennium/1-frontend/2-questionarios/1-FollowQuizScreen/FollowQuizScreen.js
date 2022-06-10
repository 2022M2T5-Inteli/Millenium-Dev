var port = 80
var API = `http://127.0.0.1:${port}`;
var card = [];
var nQuest = [];
var nResp = [];
let LER = {};
let LE = {};

$(document).ready(() => {
    questao.list2();
    eixos.list();

});



var questao = {
    list2() {
        console.log("qqrco")
        $.ajax({
            url: API + '/questoes',
            type: 'GET',

            success: data => {

                data.questoes.forEach(element => {

                    nQuest.push(element.idEixo);
                });
                for (let i = 0; i < nQuest.length; i++) {
                    LE[nQuest[i]] ? LE[nQuest[i]] += 1 : LE[nQuest[i]] = 1
                };

                $.ajax({

                    url: API + `/questionarios/1/questoes`,
                    type: 'GET',

                    success: dt => {
                        dt.respostas.forEach(element => {

                            nResp.push(element.idEixo);
                        });
                        for (let i = 0; i < nResp.length; i++) {
                            LER[nResp[i]] ? LER[nResp[i]] += 1 : LER[nResp[i]] = 1
                        };
                    }
                })

            },
            error: data => {
                console.log(data);
            }
        })

    }

};

var qEixo = {}

var eixos = {

    list() {

        $.ajax({
            url: API + '/eixos',
            type: 'GET',
            success: data => {
                
                var tx = '';
                data.eixos.forEach(element => {
                    let eixo = (element.id);
                    console.log("Eixo:"+eixo);
                    console.log(LER);
                    console.log(LER.eixo)
                    
                    let pr = Number(LER[eixo]);
                    let p = Number(LE[eixo])
                    card.push(`card${element.id}`)
                    document.getElementById("boxes-geral").innerHTML += `<div class="card col-12 col-lg-3">
                    <div class="row" id="card-quiz" type="button">
                        <a href="https://www.google.com.br">
                            <div class="col-12">
                                <p><strong>${element.nome}</strong></p>
                            </div>
                            <div class="col-12">
                                <div id="circular-progress">
                                    <div id="card${element.id}" role="progressbar" aria-valuenow="${0}" aria-valuemin="0"
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



var value = "edsfs";
var card = ["card1", "card2", "card3", "card4", "card5", "card6", "card7", "card8"]

//pega o valor atual da porcentagem da barra de progresso de cada card no html
//e verifica em qual intervalo ela esta. Muda a "role" do card conforme o 
//intervalo identificado para que seja atribuido um estilo especifico para o card no CSS

for (let i = 0; i < 8; i++) {
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
    console.log(value);
    console.log(card[i]);
    console.log(style)
    document.getElementById(card[i]).setAttribute("style", (style))
}

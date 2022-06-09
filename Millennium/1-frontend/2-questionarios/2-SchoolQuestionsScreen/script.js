$(document).ready(function(){
    schoolQuestion.list("2")
})
var  schoolQuestion = {
    list(eixoId){
            $.ajax({
                type:'GET',
                url:  'http://localhost:80/questoes/' + eixoId,
                success: function(resultados){
           //         document.getElementById("questionsHeader").textContent = resultados.user.nome
           resultados.questoes.forEach(questao => {
var element = `<button id="quest" class="row col-12 text-center align-items-center"><h6 class="col-lg-3 p-4">1</h6><h6 class="col-lg-3 p-4">${questao.idDominio}</h6><h6 class="col-lg-5 p-4">${questao.texto}</h6> </button>`
document.getElementById("list").innerHTML += element
        });
                }
            })
    }
}
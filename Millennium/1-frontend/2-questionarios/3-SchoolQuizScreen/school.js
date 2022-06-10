$(document).ready(function(){
    schoolQuestion.list("2")
})
var  schoolQuestion = {
    list(createQuestion){
            $.ajax({
                type:'GET',
                url:  'http://localhost:80/questoes/create' + createQuestion,
                success: function(resultados){
           //         document.getElementById("questionsHeader").textContent = resultados.user.nome
           resultados.questoes.forEach(questao => {
var element = `p class="col-11" id="pergunta" id="gray">1${questoes.:[]}. Existe um processo de treinamento e desenvolvimento dos colaboradores? Como este funciona? Matriz decapacitação? Como é feito o levantamento de competências e conhecimentos faltantes para treinamentos?</p>`
document.getElementById("list").innerHTML += element

        });
                }
            })
    }
}
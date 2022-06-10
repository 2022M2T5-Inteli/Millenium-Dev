// Guarda as informações de cadastro no banco de dados
$(document).ready(() => {
    contaFalconi.create();
})

var contaFalconi = {
    create(nome, email) {
        $.ajax({
            type: "POST",
            url: "http://localhost:80/contaFalconi/create",
            data: {nome: nome, email: email},
            success: function (resultado) {
                console.log(123)
            },
        });
    },
};

function falconiClick() {
    var nome = document.getElementById("floatingInputName").value;
    var email = document.getElementById("floatingInputEmail").value;
    contaFalconi.create(nome, email);
}
// Guarda as informações de cadastro no banco de dados
$(document).ready(() => {
  // contaFalconi.create();
});

var contaFalconi = {
  create(nome, email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/falconi/create",
      data: { nome: nome, email: email },
      success: function (resultado) {
        alert("Conta criada com sucesso!");
      },
      error: function (err) {
        alert("Erro ao criar a conta!");
        console.log(err);
      },
    });
  },
};

function falconiClick() {
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;
  contaFalconi.create(nome, email);
}

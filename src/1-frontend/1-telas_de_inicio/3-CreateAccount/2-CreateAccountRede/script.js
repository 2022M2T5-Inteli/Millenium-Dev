//AJAX criar conta Rede
var contaRede = {
  create(nome, email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/rede/create",
      data: { nome: nome, email: email },
      success: function (resultado) {
        alert("Conta criada com Sucesso!");
      },
      error: function (err) {
        alert("Erro ao criar a conta!");
      },
    });
  },
};

//criar uma função para o botão cadastrar
function cadastroClick() {
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;
  contaRede.create(nome, email);
}

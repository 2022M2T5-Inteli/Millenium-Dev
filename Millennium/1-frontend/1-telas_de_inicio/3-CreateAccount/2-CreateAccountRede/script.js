//AJAX criar conta Rede 
$(document).ready(() => {
    contaRede.create();
  });
  
  var contaRede = {
    create(nome, email) {
      $.ajax({
        type: "POST",
        url: "http://localhost:80/contaRede/create",
        data: {nome: nome, email: email},
        success: function (resultado) {
          console.log(123)
        },
      });
    },
  };

//criar uma função para o botão cadastrar
  function cadastroClick() {
      var nome = document.getElementById("floatingInputName").value;
      var email = document.getElementById("floatingInputEmail").value;
      contaRede.create(nome, email)
  }
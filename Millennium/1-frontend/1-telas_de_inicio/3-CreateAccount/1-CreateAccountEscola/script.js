$(document).ready(() => {
    // contaEscola.create("lu", "lu", "lu", 1);
  });
  
  var contaEscola = {
    create(nome, email, cargo, idEscola) {
      $.ajax({
        type: "POST",
        url: "http://localhost:80/contaEscola/create",
        data: {nome: nome, email: email, cargo: cargo, idEscola: idEscola},
        success: function (resultado) {
          console.log(123)
        },
      });
    },
  };

  var Escola = {
    create(nome, email, cargo, idEscola) {
      $.ajax({
        type: "POST",
        url: "http://localhost:80/contaEscola/create",
        data: {nome: nome, email: email, cargo: cargo, idEscola: idEscola},
        success: function (resultado) {
          console.log(123)
        },
      });
    },
  };

//criar uma função para o botão cadastrar
function proximoClick() {
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;
  var cargo = document.getElementById("floatingInputCargo").value;
  insertItemInSessionStorage("nome", nome);
  insertItemInSessionStorage("email", email);
  insertItemInSessionStorage("cargo", cargo);
}
//criar uma função para o botão cadastrar
function cadastroClick() {
  var nome = getItemFromSessionStorage("nome");
  var email = getItemFromSessionStorage("email");
  var cargo = getItemFromSessionStorage("cargo");
  var nomeEscola = document.getElementsById("floatingInputName").value;
  var nomeRede = document.getElementById("floatingInputRede").value;
  var ufEscola = document.getElementById("floatingInputUF").value;
  var cidadeEscola = document.getElementsById("floatingInputCidade").value;
  var enderecoEscola = document.getElementsById("floatingInputEndereco").value;
}

//funções auxiliares
function getItemFromSessionStorage(key) {
  var item = sessionStorage.getItem(key);
  return item;
}
function insertItemInSessionStorage(key, dados) {
  sessionStorage.setItem(key, dados);
}


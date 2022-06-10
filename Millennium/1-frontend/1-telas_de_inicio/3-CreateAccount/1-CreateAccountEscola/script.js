$(document).ready(() => {
  // contaEscola.create("lu", "lu", "lu", 1);
  $("#cadastroButton").click((e) => {
    e.preventDefault();
    cadastroClick();
  });
});

var contaEscola = {
  create(nome, email, cargo, idEscola) {
    console.log(nome, email, cargo, idEscola);
    $.ajax({
      type: "POST",
      url: "http://localhost:80/contaEscola/create",
      data: { nome, email, cargo, idEscola },
      success: function (resultado) {
        alert("Conta criada com sucesso!");
      },
      error: function (err) {
        console.log(err);
        alert("Erro ao criar conta!");
      },
    });
  },
};

var Escola = {
  create(
    codeEscola,
    nome,
    idRede,
    endereco,
    cidade,
    numeroAlunos,
    numeroFuncionarios,
    dadosUsuario
  ) {
    $.ajax({
      type: "POST",
      url: "http://localhost:80/escolas/create",
      data: {
        codeEscola: codeEscola,
        nome: nome,
        idRede: idRede,
        endereco: endereco,
        cidade: cidade,
        numeroAlunos: numeroAlunos,
        numeroFuncionarios: numeroFuncionarios,
      },
      success: function (resultado) {
        contaEscola.create(
          dadosUsuario.nome,
          dadosUsuario.email,
          dadosUsuario.cargo,
          resultado.codeEscola
        );
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
  window.location.replace("./cadastroEscola.html");
  
}
//criar uma função para o botão cadastrar
function cadastroClick() {
  var nome = getItemFromSessionStorage("nome");
  var email = getItemFromSessionStorage("email");
  var cargo = getItemFromSessionStorage("cargo");
  var nomeEscola = document.getElementById("floatingInputName").value;
  var codigoEscola = document.getElementById("floatingCodigoInep").value;
  var nomeRede = document.getElementById("floatingInputRede").value;
  var ufEscola = document.getElementById("floatingInputUF").value;
  var cidadeEscola = document.getElementById("floatingInputCidade").value;
  var enderecoEscola = document.getElementById("floatingInputEndereco").value;

  var dadosUsuario = {
    nome: nome,
    email: email,
    cargo: cargo,
  };
  Escola.create(
    codigoEscola,
    nomeEscola,
    nomeRede,
    enderecoEscola,
    cidadeEscola + " - " + ufEscola,
    0,
    0,
    dadosUsuario
  );
}

//funções auxiliares
function getItemFromSessionStorage(key) {
  var item = sessionStorage.getItem(key);
  return item;
}
function insertItemInSessionStorage(key, dados) {
  sessionStorage.setItem(key, dados);
}

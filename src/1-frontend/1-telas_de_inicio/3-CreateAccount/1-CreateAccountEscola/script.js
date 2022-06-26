$(document).ready(() => {
  // Adiciona a função cadastroClick ao botão de cadastro
  $("#cadastroButton").click((e) => {
    e.preventDefault();
    cadastroClick();
  });
});

// Objeto responsável pelas requisições da conta usuário Escola
var contaEscola = {
  create(nome, email, cargo, idEscola) {
    console.log(nome, email, cargo, idEscola);
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/escola/create",
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

// Objeto responsável pelas requisições de uma entidade Escola
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
      url: API_BASE_URL + "/escolas/create",
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

// Criar uma função para o botão proximo
// Pega os valores do input e salva na sessionStorage do navegador
function proximoClick() {
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;
  var cargo = document.getElementById("floatingInputCargo").value;
  insertItemInSessionStorage("nome", nome);
  insertItemInSessionStorage("email", email);
  insertItemInSessionStorage("cargo", cargo);
  window.location.replace("./cadastroEscola.html");
}
// Criar uma função para o botão cadastrar
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

// Funções auxiliares

// Retorna um item da sesionStorage
function getItemFromSessionStorage(key) {
  var item = sessionStorage.getItem(key);
  return item;
}

// Salva um item na sessionStorage
function insertItemInSessionStorage(key, dados) {
  sessionStorage.setItem(key, dados);
}

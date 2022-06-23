$(document).ready(() => {
  // Adiciona a função cadastroClick ao botão de cadastro
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

var emailChecked = false;
var inputChecked = false;

//Cria uma função para comparar o email inserido com o padrão
function verifyEmail(input) {
  let pattern = new RegExp("[a-z0-9]+@[a-z]+.[a-z]");
  return pattern.test(input);
}

//Cria uma função para determinar qual ação tomar depois de verificar o email
function showEmail(param) {
  if (param) {
    emailChecked = true;
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de email inválido.",
    });
    emailChecked = false;
  }
}

// Criar uma função para o botão proximo
function proximoClick() {
  // Pega os valores do input e salva na sessionStorage do navegador
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;
  var cargo = document.getElementById("floatingInputCargo").value;
  insertItemInSessionStorage("nome", nome);
  insertItemInSessionStorage("email", email);
  insertItemInSessionStorage("cargo", cargo);

  //Verifica se é necessário mostrar alerta de formato errado de email
  let result = verifyEmail(document.getElementById("floatingInputEmail").value);
  showEmail(result);

  //Verifica se há input vazio e o mostra alerta
  var inputNome = document.getElementById("floatingInputName").value;
  var inputEmail = document.getElementById("floatingInputEmail").value;
  var inputCargo = document.getElementById("floatingInputCargo").value;

  if (inputNome == "" || inputEmail == "" || inputCargo == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Campo de resposta vazio.",
    });
    inputChecked = false;
  } else {
    inputChecked = true;
  }

  //Verifica se o email e os inputs foram checados para passar a página
  if (emailChecked == true && inputChecked == true) {
    window.location.replace("./cadastroEscola.html");
  }
  //Verifica se o email e o input estão incorretos para exibir o alerta
  if (emailChecked == false && inputChecked == false) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de email inválido e campo de resposta vazio.",
    });
  }
}

var codigoChecked2 = false;
var inputChecked2 = false;
var ufChecked2 = false;

//Cria uma função para comparar o código inserido com o padrão
function verifyCodigo(codigo, uf) {
  let patternCodigo = new RegExp("[0-9]{8}");
  return patternCodigo.test(codigo);
}

function verifyUF(uf) {
  let patternUF = new RegExp("[A-Z]{2}");
  return patternUF.test(uf);
}

function showCodigo(param) {
  if (param == false) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de código Inep inválido",
    });
    codigoChecked2 = false;
  } else {
    codigoChecked2 = true;
  }
}

function showUF(param) {
  if (param == false) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de UF inválido",
    });
    ufChecked2 = false;
  } else {
    ufChecked2 = true;
  }
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

  //Verifica se é necessário mostrar alerta de formato errado de email
  let resultCodigo = verifyCodigo(
    document.getElementById("floatingCodigoInep").value
  );
  showCodigo(resultCodigo);
  let resultUF = verifyUF(document.getElementById("floatingInputUF").value);
  showUF(resultUF);

  //   var dadosUsuario = {
  //     nome: nome,
  //     email: email,
  //     cargo: cargo,
  //   };
  //   Escola.create(
  //     codigoEscola,
  //     nomeEscola,
  //     nomeRede,
  //     enderecoEscola,
  //     cidadeEscola + " - " + ufEscola,
  //     0,
  //     0,
  //     dadosUsuario
  //   );
  //Verifica se há input vazio e o mostra alerta

  if (
    nomeEscola == "" ||
    codigoEscola == "" ||
    nomeRede == "" ||
    ufEscola == "" ||
    cidadeEscola == "" ||
    enderecoEscola == ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Campo de resposta vazio.",
    });
    inputChecked2 = false;
  } else {
    inputChecked2 = true;
  }

  //Verifica se o email e os inputs foram checados para passar a página
  if (codigoChecked2 == true && inputChecked2 == true && ufChecked2 == true) {
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

  //Verifica se o email e o input estão incorretos para exibir o alerta
  if (codigoChecked2 == false && inputChecked2 == false) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de código Inep inválido e campo de resposta vazio.",
    });
  }

  //Verifica se o email, input e UF estão incorretos para exibir o alerta
  if (
    codigoChecked2 == false &&
    inputChecked2 == false &&
    ufChecked2 == false
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de código Inep inválido, UF inválido e campo de resposta vazio.",
    });
  }
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

//Cria uma função para comparar o email inserido com o padrão
function verify(input) {
  let pattern = /\S+@\S+\.\S+/;
  return pattern.test(input);
}

//Cria uma função para determinar qual ação tomar depois de verificar o email
function show(param) {
  if (param) {
    var email = document.getElementById("floatingInput").value;
    var loginType = document.querySelector(
      'input[name="schoolType"]:checked'
    ).value;

    console.log(loginType);
    if (loginType == "escola") {
      return LoginScreen.loginEscola(email);
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de email inválido",
    });
  }
}

// Criar uma função para o botão proximo
// Pega os valores do input e salva na sessionStorage do navegador
function buttonEntrar() {
  let result = verify(document.getElementById("floatingInput").value);
  show(result);
}

var LoginScreen = {
  loginEscola(email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/escola/login",
      data: { email: email },
      success: function (resultados) {
        console.log(resultados);
      },
      error: function (eerrr) {
        console.log(eerrr);
      },
    });
  },
  loginRede(email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/rede/login",
      data: { email: email },
      success: function (resultados) {
        console.log(resultados);
      },
    });
  },
  loginFalconi(email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/falconi/login",
      data: { email: email },
      success: function (resultados) {
        console.log(resultados);
      },
    });
  },
};

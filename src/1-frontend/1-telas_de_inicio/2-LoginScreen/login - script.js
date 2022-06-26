//Cria uma função para comparar o email inserido com o padrão
sessionStorage.clear();

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
    if (loginType == "rede") {
      return LoginScreen.loginRede(email);
    }

    if (loginType == "falconi") {
      return LoginScreen.loginFalconi(email);
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Formato de email inválido",
    });
  }
}

// Cria uma função para o botão proximo
// Pega os valores do input e salva na sessionStorage do navegador
function buttonEntrar() {
  let result = verify(document.getElementById("floatingInput").value);
  show(result);
}
// Login Escola
var LoginScreen = {
  loginEscola(email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/escola/login",
      data: { email: email },
      success: function (resultados) {
        if (resultados.data) {
          if (resultados.data.idEscola) {
            Swal.fire({
              icon: "success",
              title: "Usuário Logado com Sucesso!",
              text: "Redirecionando...",
            }).then((result) => {
              sessionStorage.setItem("userId", resultados.data.id);
              sessionStorage.setItem("idEscola", resultados.data.idEscola);
              sessionStorage.setItem("userName", resultados.data.nome);
              sessionStorage.setItem("nomeEscola", resultados.data.nomeEscola);
              document.location.href = "../5-SchoolChooseActionScreen/";
            });
          }
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  },
// Login Rede
  loginRede(email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/rede/login",
      data: { email: email },
      success: function (resultados) {
        if (resultados.data.id) {
          Swal.fire({
            icon: "success",
            title: "Rede Logada com Sucesso!",
            text: "Redirecionando...",
          }).then((result) => {});
        }
      },
    });
  },
// Login Falconi
  loginFalconi(email) {
    $.ajax({
      type: "POST",
      url: API_BASE_URL + "/usuarios/falconi/login",
      data: { email: email },
      success: function (resultados) {
        if (resultados.data.id) {
          Swal.fire({
            icon: "success",
            title: "Usuário Logado com Sucesso!",
            text: "Redirecionando...",
          }).then((result) => {
            sessionStorage.setItem("userId", resultados.data.id);
            sessionStorage.setItem("userName", resultados.data.nome);
            document.location.href =
              "../../3-editar_questionario/1-EditQuizScreen/1-Agendas/";
          });
        }
      },
    });
  },
};

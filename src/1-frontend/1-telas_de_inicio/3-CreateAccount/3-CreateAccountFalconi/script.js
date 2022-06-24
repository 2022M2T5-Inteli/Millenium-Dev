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
        Swal.fire({
          icon: "success",
          title: "Usuário Criado com Sucesso!",
          text: "Redirecionando para tela de Login...",
        }).then((result) => {
          document.location.href = "../../2-LoginScreen/";
        });
      },
      error: function (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Erro ao criar a conta!",
          text:
            "O seguinte erro foi gerado ao tentar criar a conta. Verifique seu usuário" +
            err.messageText,
        }).then((result) => {
          sessionStorage.setItem("userId", resultados.data.id);
          sessionStorage.setItem("idEscola", resultados.data.idEscola);
          sessionStorage.setItem("userName", resultados.data.nome);
          sessionStorage.setItem("nomeEscola", resultados.data.nomeEscola);
          document.location.href = "../5-SchoolChooseActionScreen/";
        });
      },
    });
  },
};

//Retorna falso se o preenchimento estiver incorreto e verdadeiro se estiver correto
var emailChecked = false;
var inputChecked = false;

//Cria uma função para comparar o email inserido com o padrão
function verifyEmail(input) {
  let pattern = new RegExp("[a-z0-9]+@falconi+.[a-z]");
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

function falconiClick() {
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;
  //contaFalconi.create(nome, email);

  //Verifica se é necessário mostrar alerta de formato errado de email
  let result = verifyEmail(document.getElementById("floatingInputEmail").value);
  showEmail(result);

  if (nome == "" || email == "") {
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
    console.log("deu certo");
    contaFalconi.create(nome, email);
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

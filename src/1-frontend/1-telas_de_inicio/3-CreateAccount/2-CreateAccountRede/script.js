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

//Retorna falso se o preenchimento estiver incorreto e verdadeiro se estiver correto
var emailChecked = false;
var inputChecked = false;

//Cria uma função para comparar o email inserido com o padrão
function verifyEmail(input) {
  let pattern = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]');
  return pattern.test(input);
}

//Cria uma função para determinar qual ação tomar depois de verificar o email
function showEmail(param) {
  if (param) {
    emailChecked = true;
  }
  else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Formato de email inválido.',
    })
    emailChecked = false;
  }
}

//criar uma função para o botão cadastrar
function cadastroClick() {
  var nome = document.getElementById("floatingInputName").value;
  var email = document.getElementById("floatingInputEmail").value;

  //Verifica se é necessário mostrar alerta de formato errado de email
  let result = verifyEmail(document.getElementById("floatingInputEmail").value);
  showEmail(result);

  if (nome == "" || email == "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Campo de resposta vazio.',
    })
    inputChecked = false;
  }

  else {
    inputChecked = true;
  }

  //Verifica se o email e os inputs foram checados para passar a página
  if (emailChecked == true && inputChecked == true) {
    contaRede.create(nome, email);
  }
  //Verifica se o email e o input estão incorretos para exibir o alerta
  if (emailChecked == false && inputChecked == false) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Formato de email inválido e campo de resposta vazio.',
    })
  }
}

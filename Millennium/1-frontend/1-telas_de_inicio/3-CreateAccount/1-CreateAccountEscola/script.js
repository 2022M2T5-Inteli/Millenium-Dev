$(document).ready(() => {
    usuarioEscola.list();
  });
  
  var usuarioEscola = {
    list() {
      $.ajax({
        type: "GET",
        url: "http://localhost:80//usuarioEscola/:AccountId/",
        success: function (resultado) {
          resultado.usuarioEscola.forEach((AccountId) => {
            document.getElementById("meuTitulo").textContent += "\n" + usuarioEscola.nome;
          });
        },
      });
    },
  };
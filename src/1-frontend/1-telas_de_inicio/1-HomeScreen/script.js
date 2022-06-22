//Chama o botão "topButton":
button = document.getElementById("topButton");

//Quando o usuário rolar para baixo 20px da parte superior do documento, mostre o botão
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
}

// Quando o usuário clicar no botão, sobe até o topo do documento
function goToTop() {
  document.body.scrollTop = 0; // Para Safari
  document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE and Opera
}
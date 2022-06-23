var PORT = 5000;
var API_BASE_URL = `http://localhost:${PORT}`;

function showError(title, message) {
  Swal.fire({
    title: title,
    icon: "error",
    html: `Mensagem: ${message}</small>`,
    confirmButtonText: "Ok",
  });
}

function showSuccess(message) {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

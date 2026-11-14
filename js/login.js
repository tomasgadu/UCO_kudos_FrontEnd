if (haySesion()) {
  window.location.href = "inicio.html";
}

document.getElementById("formLogin").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limpiarMensaje("mensaje");

  const credenciales = {
    correoInstitucional: valorDe("correo"),
    clave: document.getElementById("clave").value
  };

  try {
    const respuesta = await api.post("/sesiones", credenciales);
    const sesion = respuesta.datos[0];
    guardarSesion(sesion.token, sesion.usuario);
    window.location.href = "inicio.html";
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
});

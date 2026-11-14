function pintarInicio() {
  const usuario = obtenerUsuario();
  if (!usuario) {
    return;
  }

  document.getElementById("saludo").textContent = "Hola, " + usuario.nombres + " " + usuario.apellidos;
  document.getElementById("datosUsuario").textContent =
    "Rol: " + usuario.rol.nombre + " · Correo: " + usuario.correoInstitucional;

  const contenedor = document.getElementById("opciones");
  opcionesPermitidas()
    .filter((opcion) => opcion.pagina !== "inicio.html")
    .forEach((opcion) => {
      const enlace = document.createElement("a");
      enlace.href = opcion.pagina;
      enlace.textContent = opcion.texto;
      contenedor.appendChild(enlace);
    });
}

document.addEventListener("DOMContentLoaded", pintarInicio);

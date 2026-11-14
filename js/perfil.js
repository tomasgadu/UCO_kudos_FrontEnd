async function cargarPerfil() {
  try {
    const respuesta = await api.get("/usuarios/yo");
    pintarPerfil(respuesta.datos[0]);
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function pintarPerfil(usuario) {
  document.getElementById("nombres").value = usuario.nombres;
  document.getElementById("apellidos").value = usuario.apellidos;
  document.getElementById("correo").value = usuario.correoInstitucional;
  document.getElementById("celular").value = usuario.numeroCelular;
  document.getElementById("datosCuenta").textContent =
    "Rol: " + usuario.rol.nombre + " · Estado de la cuenta: " + usuario.estadoCuenta +
    " · Registrado: " + formatearFecha(usuario.fechaRegistro);
}

async function guardarPerfil(evento) {
  evento.preventDefault();
  const datos = {
    nombres: valorDe("nombres"),
    apellidos: valorDe("apellidos"),
    correoInstitucional: valorDe("correo"),
    numeroCelular: valorDe("celular")
  };
  try {
    const respuesta = await api.put("/usuarios/yo", datos);
    const actualizado = respuesta.datos[0];
    guardarSesion(obtenerToken(), actualizado);
    pintarPerfil(actualizado);

    let texto = respuesta.mensajes.join(" ");
    if (actualizado.estadoCuenta !== "ACTIVA") {
      texto += " Debes verificar el dato que cambiaste en la página de registro (sección 2).";
    }
    mostrarMensaje("mensaje", texto, false);
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

document.getElementById("formPerfil").addEventListener("submit", guardarPerfil);
document.addEventListener("DOMContentLoaded", cargarPerfil);

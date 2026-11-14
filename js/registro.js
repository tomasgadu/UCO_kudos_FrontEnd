const ROLES_SIN_AUTORREGISTRO = ["ADMINISTRADOR", "RECTOR"];
const ROLES_CON_PROGRAMA = ["COORDINADOR_PROGRAMA", "DOCENTE", "ESTUDIANTE"];
const ROL_CON_FACULTAD = "COORDINADOR_FACULTAD";

let roles = [];

async function cargarListas() {
  try {
    const [respuestaRoles, respuestaFacultades, respuestaProgramas] = await Promise.all([
      api.get("/roles"),
      api.get("/facultades?estado=ACTIVA"),
      api.get("/programas?estado=ACTIVA")
    ]);

    roles = respuestaRoles.datos.filter((rol) => !ROLES_SIN_AUTORREGISTRO.includes(rol.codigo));
    llenarSelect("rol", roles, (rol) => rol.id, (rol) => rol.nombre, "Seleccione un rol");
    llenarSelect("facultad", respuestaFacultades.datos, (f) => f.id, (f) => f.nombre, "Seleccione una facultad");
    llenarSelect("programa", respuestaProgramas.datos, (p) => p.id, (p) => p.nombre, "Seleccione un programa");
  } catch (error) {
    mostrarMensaje("mensajeRegistro", error.message, true);
  }
}

function codigoRolSeleccionado() {
  const rol = roles.find((r) => r.id === valorDe("rol"));
  return rol ? rol.codigo : "";
}

function actualizarAmbito() {
  const codigo = codigoRolSeleccionado();
  document.getElementById("grupoFacultad").classList.toggle("oculto", codigo !== ROL_CON_FACULTAD);
  document.getElementById("grupoPrograma").classList.toggle("oculto", !ROLES_CON_PROGRAMA.includes(codigo));
}

async function registrar(evento) {
  evento.preventDefault();
  limpiarMensaje("mensajeRegistro");

  const codigo = codigoRolSeleccionado();
  const datos = {
    nombres: valorDe("nombres"),
    apellidos: valorDe("apellidos"),
    correoInstitucional: valorDe("correo"),
    numeroCelular: valorDe("celular"),
    clave: document.getElementById("clave").value,
    idRol: valorDe("rol") || null,
    idFacultad: codigo === ROL_CON_FACULTAD ? valorDe("facultad") || null : null,
    idProgramaAcademico: ROLES_CON_PROGRAMA.includes(codigo) ? valorDe("programa") || null : null
  };

  try {
    const respuesta = await api.post("/usuarios", datos);
    mostrarMensaje("mensajeRegistro", respuesta.mensajes.join(" "), false);
    document.getElementById("correoVerificacion").value = datos.correoInstitucional;
  } catch (error) {
    mostrarMensaje("mensajeRegistro", error.message, true);
  }
}

function datosVerificacion() {
  return {
    correoInstitucional: valorDe("correoVerificacion"),
    tipo: valorDe("tipo"),
    codigo: valorDe("codigo")
  };
}

async function verificar(evento) {
  evento.preventDefault();
  limpiarMensaje("mensajeVerificacion");
  try {
    const respuesta = await api.post("/usuarios/verificaciones", datosVerificacion());
    mostrarMensaje("mensajeVerificacion", respuesta.mensajes.join(" "), false);
  } catch (error) {
    mostrarMensaje("mensajeVerificacion", error.message, true);
  }
}

async function reenviar() {
  limpiarMensaje("mensajeVerificacion");
  try {
    const respuesta = await api.post("/usuarios/verificaciones/reenvio", datosVerificacion());
    mostrarMensaje("mensajeVerificacion", respuesta.mensajes.join(" "), false);
  } catch (error) {
    mostrarMensaje("mensajeVerificacion", error.message, true);
  }
}

document.getElementById("rol").addEventListener("change", actualizarAmbito);
document.getElementById("formRegistro").addEventListener("submit", registrar);
document.getElementById("formVerificacion").addEventListener("submit", verificar);
document.getElementById("botonReenviar").addEventListener("click", reenviar);
void cargarListas();

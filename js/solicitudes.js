async function cargarSolicitudes() {
  const lista = document.getElementById("lista");
  try {
    const respuesta = await api.get("/solicitudes/pendientes");
    lista.innerHTML = "";
    if (respuesta.datos.length === 0) {
      pintarVacio(lista, "No hay solicitudes pendientes.");
      return;
    }
    respuesta.datos.forEach((solicitud) => lista.appendChild(crearTarjetaSolicitud(solicitud)));
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function crearTarjetaSolicitud(solicitud) {
  const tarjeta = crearElemento("section", null, "tarjeta");
  const usuario = solicitud.solicitante;

  tarjeta.appendChild(crearElemento("h3", nombreDe(usuario)));
  tarjeta.appendChild(crearElemento("p", "Correo: " + usuario.correoInstitucional + " · Celular: +57 " + usuario.numeroCelular));
  tarjeta.appendChild(crearElemento("p", "Rol solicitado: " + solicitud.rolSolicitado.nombre + ambitoDe(solicitud)));
  tarjeta.appendChild(crearElemento("p", "Fecha: " + formatearFecha(solicitud.fechaSolicitud), "ayuda"));

  const observacion = crearElemento("textarea");
  observacion.placeholder = "Observación (obligatoria para rechazar, mínimo 10 caracteres)";
  tarjeta.appendChild(observacion);

  tarjeta.appendChild(crearBoton("Aprobar", () => decidir(solicitud.id, "aprobar", observacion.value), "pequeno"));
  tarjeta.appendChild(crearBoton("Rechazar", () => decidir(solicitud.id, "rechazar", observacion.value), "pequeno peligro"));
  return tarjeta;
}

function ambitoDe(solicitud) {
  if (solicitud.programaAcademico && solicitud.programaAcademico.nombre) {
    return " · Programa: " + solicitud.programaAcademico.nombre;
  }
  if (solicitud.facultad && solicitud.facultad.nombre) {
    return " · Facultad: " + solicitud.facultad.nombre;
  }
  return "";
}

async function decidir(idSolicitud, decision, observacion) {
  try {
    const respuesta = await api.post("/solicitudes/" + idSolicitud + "/" + decision, { observacion: observacion.trim() || null });
    mostrarMensaje("mensaje", respuesta.mensajes.join(" "), false);
    cargarSolicitudes();
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

document.addEventListener("DOMContentLoaded", cargarSolicitudes);

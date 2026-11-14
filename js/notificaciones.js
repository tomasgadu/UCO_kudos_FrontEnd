async function cargarNotificaciones() {
  const lista = document.getElementById("lista");
  try {
    const respuesta = await api.get("/notificaciones");
    lista.innerHTML = "";
    if (respuesta.datos.length === 0) {
      pintarVacio(lista, "No tienes notificaciones.");
      return;
    }
    respuesta.datos.forEach((notificacion) => lista.appendChild(crearTarjetaNotificacion(notificacion)));
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function crearTarjetaNotificacion(notificacion) {
  const tarjeta = crearElemento("section", null, "tarjeta");
  const mensaje = crearElemento("p", notificacion.mensaje, notificacion.leida ? "" : "no-leida");
  tarjeta.appendChild(mensaje);
  tarjeta.appendChild(crearElemento("p", formatearFecha(notificacion.fechaCreacion) + " · " + notificacion.tipo, "ayuda"));
  if (!notificacion.leida) {
    tarjeta.appendChild(crearBoton("Marcar como leída", () => marcarLeida(notificacion.id), "pequeno"));
  }
  return tarjeta;
}

async function marcarLeida(idNotificacion) {
  try {
    await api.patch("/notificaciones/" + idNotificacion + "/leida");
    void cargarNotificaciones();
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

document.addEventListener("DOMContentLoaded", cargarNotificaciones);

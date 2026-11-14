async function cargarReportes() {
  const lista = document.getElementById("lista");
  const estado = valorDe("filtroEstado");
  const ruta = estado ? "/reportes?estado=" + estado : "/reportes";
  try {
    const respuesta = await api.get(ruta);
    lista.innerHTML = "";
    if (respuesta.datos.length === 0) {
      pintarVacio(lista, "No hay reportes en este estado.");
      return;
    }
    respuesta.datos.forEach((reporte) => lista.appendChild(crearTarjetaReporte(reporte)));
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function crearTarjetaReporte(reporte) {
  const tarjeta = crearElemento("section", null, "tarjeta");
  const titulo = crearElemento("h3", "Motivo: " + reporte.motivo);
  titulo.appendChild(crearElemento("span", reporte.estado, "etiqueta"));
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(crearElemento("p", "Reportado por " + nombreDe(reporte.reportante) + " · " + formatearFecha(reporte.fechaReporte), "ayuda"));
  if (reporte.descripcion) {
    tarjeta.appendChild(crearElemento("p", reporte.descripcion));
  }

  const enlace = crearElemento("a", "Ver la publicación reportada");
  enlace.href = "conversacion.html?id=" + reporte.idPublicacion;
  tarjeta.appendChild(enlace);

  if (reporte.revisor && reporte.revisor.nombres) {
    tarjeta.appendChild(crearElemento("p", "Revisor: " + nombreDe(reporte.revisor), "ayuda"));
  }
  if (reporte.observacionDecision) {
    tarjeta.appendChild(crearElemento("p", "Decisión: " + reporte.observacionDecision, "ayuda"));
  }

  if (reporte.estado === "PENDIENTE") {
    tarjeta.appendChild(crearBoton("Tomar en revisión", () => ejecutar(() => api.post("/reportes/" + reporte.id + "/revision")), "pequeno"));
  }

  if (reporte.estado === "EN_REVISION") {
    const observacion = crearElemento("textarea");
    observacion.placeholder = "Observación de la decisión (mínimo 10 caracteres)";
    tarjeta.appendChild(observacion);
    tarjeta.appendChild(crearBoton("Aceptar y vetar", () => decidir(reporte.id, "aceptar", observacion.value), "pequeno peligro"));
    tarjeta.appendChild(crearBoton("Rechazar", () => decidir(reporte.id, "rechazar", observacion.value), "pequeno secundario"));
  }
  return tarjeta;
}

function decidir(idReporte, decision, observacion) {
  void ejecutar(() => api.post("/reportes/" + idReporte + "/" + decision, { observacion: observacion.trim() }));
}

async function ejecutar(accion) {
  try {
    const respuesta = await accion();
    mostrarMensaje("mensaje", respuesta.mensajes.join(" "), false);
    void cargarReportes();
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

document.getElementById("filtroEstado").addEventListener("change", cargarReportes);
document.addEventListener("DOMContentLoaded", cargarReportes);

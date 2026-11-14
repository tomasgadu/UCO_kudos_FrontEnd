async function cargarAuditoria(evento) {
  if (evento) {
    evento.preventDefault();
  }
  limpiarMensaje("mensaje");

  const parametros = new URLSearchParams();
  if (valorDe("accion")) {
    parametros.append("accion", valorDe("accion").toUpperCase());
  }
  if (valorDe("entidad")) {
    parametros.append("entidad", valorDe("entidad"));
  }
  const consulta = parametros.toString();

  const tabla = document.getElementById("tablaAuditoria");
  try {
    const respuesta = await api.get("/auditoria" + (consulta ? "?" + consulta : ""));
    tabla.innerHTML = "";
    if (respuesta.datos.length === 0) {
      mostrarMensaje("mensaje", "No hay registros con esos filtros.", false);
      return;
    }
    respuesta.datos.forEach((registro) => {
      const fila = crearElemento("tr");
      fila.appendChild(crearElemento("td", formatearFecha(registro.fecha)));
      fila.appendChild(crearElemento("td", nombreDe(registro.actor)));
      fila.appendChild(crearElemento("td", registro.accion));
      fila.appendChild(crearElemento("td", registro.entidadAfectada));
      fila.appendChild(crearElemento("td", registro.valorAnterior || ""));
      fila.appendChild(crearElemento("td", registro.valorNuevo || ""));
      tabla.appendChild(fila);
    });
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

document.getElementById("formFiltro").addEventListener("submit", cargarAuditoria);
document.addEventListener("DOMContentLoaded", () => cargarAuditoria());

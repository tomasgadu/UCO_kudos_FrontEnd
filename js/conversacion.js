const MOTIVOS_REPORTE = {
  LENGUAJE_OFENSIVO: "Lenguaje ofensivo",
  ACOSO: "Acoso",
  DISCRIMINACION: "Discriminación",
  SPAM: "Spam",
  INFORMACION_FALSA: "Información falsa",
  OTRO: "Otro"
};

const idKudo = parametroUrl("id");

async function cargarConversacion() {
  const contenedor = document.getElementById("conversacion");
  if (!idKudo) {
    pintarVacio(contenedor, "No se indicó qué Kudo mostrar.");
    return;
  }
  try {
    const [respuestaKudo, respuestaReplicas] = await Promise.all([
      api.get("/kudos/" + idKudo),
      api.get("/kudos/" + idKudo + "/replicas")
    ]);
    const kudo = respuestaKudo.datos[0];
    const replicas = respuestaReplicas.datos;

    contenedor.innerHTML = "";
    const tarjetaKudo = await crearPublicacion(kudo, true);
    contenedor.appendChild(tarjetaKudo);
    await pintarRespuestas(kudo.id, replicas, tarjetaKudo);
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

async function pintarRespuestas(idPadre, replicas, tarjetaPadre) {
  const hijas = replicas.filter((replica) => replica.idPadre === idPadre);
  if (hijas.length === 0) {
    return;
  }
  const contenedor = crearElemento("div", null, "respuestas");
  tarjetaPadre.appendChild(contenedor);
  for (const replica of hijas) {
    const tarjeta = await crearPublicacion(replica, false);
    contenedor.appendChild(tarjeta);
    await pintarRespuestas(replica.id, replicas, tarjeta);
  }
}

async function crearPublicacion(publicacion, esKudo) {
  const tarjeta = crearElemento("article", null, "publicacion");
  const texto = esKudo
    ? nombreDe(publicacion.autor) + " reconoce a " + nombreDe(publicacion.destinatario)
    : nombreDe(publicacion.autor) + " respondió";
  const encabezado = crearElemento("div", texto + " · " + formatearFecha(publicacion.fechaCreacion), "encabezado");
  if (esKudo) {
    encabezado.appendChild(crearElemento("span", publicacion.categoria.nombre, "etiqueta"));
  }
  if (publicacion.estado !== "VISIBLE") {
    encabezado.appendChild(crearElemento("span", publicacion.estado, "etiqueta alerta"));
  }
  tarjeta.appendChild(encabezado);
  tarjeta.appendChild(crearElemento("p", publicacion.contenido, "contenido"));
  tarjeta.appendChild(await crearResumenCalificacion(publicacion.id));

  if (publicacion.estado !== "VETADO") {
    tarjeta.appendChild(crearAcciones(publicacion));
  }
  return tarjeta;
}

async function crearResumenCalificacion(idPublicacion) {
  const resumen = crearElemento("div", "", "ayuda");
  try {
    const respuesta = await api.get("/publicaciones/" + idPublicacion + "/calificaciones");
    const datos = respuesta.datos[0];
    let texto = "★ " + datos.promedio.toFixed(1) + " (" + datos.cantidad + " calificaciones)";
    if (datos.miCalificacion > 0) {
      texto += " · Tu calificación: " + datos.miCalificacion;
    }
    resumen.textContent = texto;
  } catch (error) {
    resumen.textContent = "";
  }
  return resumen;
}

function crearAcciones(publicacion) {
  const acciones = crearElemento("div");

  const lineaResponder = crearElemento("div", null, "formulario-linea");
  const respuesta = crearElemento("input");
  respuesta.placeholder = "Escribe una respuesta";
  respuesta.style.flex = "1";
  lineaResponder.appendChild(respuesta);
  lineaResponder.appendChild(crearBoton("Responder", () => responder(publicacion.id, respuesta.value), "pequeno"));
  acciones.appendChild(lineaResponder);

  const lineaCalificar = crearElemento("div", null, "formulario-linea");
  const estrellas = crearElemento("select");
  [1, 2, 3, 4, 5].forEach((valor) => {
    const opcion = crearElemento("option", valor + " ★");
    opcion.value = valor;
    estrellas.appendChild(opcion);
  });
  lineaCalificar.appendChild(estrellas);
  lineaCalificar.appendChild(crearBoton("Calificar", () => calificar(publicacion.id, estrellas.value), "pequeno"));

  const motivo = crearElemento("select");
  const sinMotivo = crearElemento("option", "Seleccione el motivo");
  sinMotivo.value = "";
  motivo.appendChild(sinMotivo);
  Object.entries(MOTIVOS_REPORTE).forEach(([valor, texto]) => {
    const opcion = crearElemento("option", texto);
    opcion.value = valor;
    motivo.appendChild(opcion);
  });
  const descripcion = crearElemento("input");
  descripcion.placeholder = "Descripción (obligatoria si es Otro)";
  lineaCalificar.appendChild(motivo);
  lineaCalificar.appendChild(descripcion);
  lineaCalificar.appendChild(crearBoton("Reportar", () => reportar(publicacion.id, motivo.value, descripcion.value), "pequeno secundario"));

  if (tienePermiso("VETAR")) {
    lineaCalificar.appendChild(crearBoton("Vetar", () => vetar(publicacion.id), "pequeno peligro"));
  }
  acciones.appendChild(lineaCalificar);
  return acciones;
}

async function ejecutarAccion(accion) {
  try {
    const respuesta = await accion();
    mostrarMensaje("mensaje", respuesta.mensajes.join(" "), false);
    cargarConversacion();
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
  window.scrollTo(0, 0);
}

function responder(idPadre, contenido) {
  ejecutarAccion(() => api.post("/replicas", { idPadre: idPadre, contenido: contenido.trim() }));
}

function calificar(idPublicacion, estrellas) {
  ejecutarAccion(() => api.put("/publicaciones/" + idPublicacion + "/calificacion", { estrellas: Number(estrellas) }));
}

function reportar(idPublicacion, motivo, descripcion) {
  ejecutarAccion(() => api.post("/publicaciones/" + idPublicacion + "/reportes", { motivo: motivo || null, descripcion: descripcion.trim() || null }));
}

function vetar(idPublicacion) {
  const justificacion = prompt("Justificación del veto (mínimo 10 caracteres):");
  if (justificacion === null) {
    return;
  }
  ejecutarAccion(() => api.post("/publicaciones/" + idPublicacion + "/veto", { justificacion: justificacion.trim() }));
}

document.addEventListener("DOMContentLoaded", cargarConversacion);

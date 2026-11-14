async function cargarListas() {
  try {
    const [respuestaUsuarios, respuestaCategorias] = await Promise.all([
      api.get("/usuarios"),
      api.get("/categorias?estado=ACTIVA")
    ]);
    const yo = obtenerUsuario();
    const otros = respuestaUsuarios.datos.filter((usuario) => usuario.id !== yo.id);

    llenarSelect("destinatario", otros, (u) => u.id, (u) => nombreDe(u) + " (" + u.rol.nombre + ")", "Seleccione a quién reconoce");
    llenarSelect("categoria", respuestaCategorias.datos, (c) => c.id, (c) => c.nombre, "Seleccione una categoría");
    llenarSelect("filtroDestinatario", respuestaUsuarios.datos, (u) => u.id, (u) => nombreDe(u), "Todos");
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

async function cargarMuro() {
  const muro = document.getElementById("muro");
  const idDestinatario = valorDe("filtroDestinatario");
  const ruta = idDestinatario ? "/kudos?idDestinatario=" + idDestinatario : "/kudos";
  try {
    const respuesta = await api.get(ruta);
    muro.innerHTML = "";
    if (respuesta.datos.length === 0) {
      pintarVacio(muro, "Todavía no hay Kudos para mostrar.");
      return;
    }
    respuesta.datos.forEach((kudo) => muro.appendChild(crearTarjetaKudo(kudo)));
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function crearTarjetaKudo(kudo) {
  const tarjeta = crearElemento("article", null, "publicacion");
  const encabezado = crearElemento("div", nombreDe(kudo.autor) + " reconoce a " + nombreDe(kudo.destinatario) + " · " + formatearFecha(kudo.fechaCreacion), "encabezado");
  encabezado.appendChild(crearElemento("span", kudo.categoria.nombre, "etiqueta"));
  if (kudo.estado !== "VISIBLE") {
    encabezado.appendChild(crearElemento("span", kudo.estado, "etiqueta alerta"));
  }
  tarjeta.appendChild(encabezado);
  tarjeta.appendChild(crearElemento("p", kudo.contenido, "contenido"));

  const enlace = crearElemento("a", "Ver conversación");
  enlace.href = "conversacion.html?id=" + kudo.id;
  tarjeta.appendChild(enlace);
  return tarjeta;
}

async function darKudo(evento) {
  evento.preventDefault();
  limpiarMensaje("mensaje");
  const datos = {
    idDestinatario: valorDe("destinatario") || null,
    idCategoria: valorDe("categoria") || null,
    contenido: valorDe("contenido")
  };
  try {
    const respuesta = await api.post("/kudos", datos);
    mostrarMensaje("mensaje", respuesta.mensajes.join(" "), false);
    document.getElementById("formKudo").reset();
    cargarMuro();
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

document.getElementById("formKudo").addEventListener("submit", darKudo);
document.getElementById("filtroDestinatario").addEventListener("change", cargarMuro);
document.addEventListener("DOMContentLoaded", async () => {
  await cargarListas();
  cargarMuro();
});

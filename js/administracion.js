async function cargarCategorias() {
  const tabla = document.getElementById("tablaCategorias");
  try {
    const respuesta = await api.get("/categorias");
    tabla.innerHTML = "";
    respuesta.datos.forEach((categoria) => {
      const fila = crearElemento("tr");
      fila.appendChild(crearElemento("td", categoria.nombre));
      fila.appendChild(crearElemento("td", categoria.descripcion));
      fila.appendChild(crearElemento("td", categoria.estado));

      const acciones = crearElemento("td");
      acciones.appendChild(crearBoton("Editar", () => editarCategoria(categoria), "pequeno"));
      if (categoria.estado === "ACTIVA") {
        acciones.appendChild(crearBoton("Desactivar", () => cambiarEstadoCategoria(categoria.id, "desactivar"), "pequeno peligro"));
      } else {
        acciones.appendChild(crearBoton("Activar", () => cambiarEstadoCategoria(categoria.id, "activar"), "pequeno secundario"));
      }
      fila.appendChild(acciones);
      tabla.appendChild(fila);
    });
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function editarCategoria(categoria) {
  document.getElementById("idCategoria").value = categoria.id;
  document.getElementById("nombreCategoria").value = categoria.nombre;
  document.getElementById("descripcionCategoria").value = categoria.descripcion;
  document.getElementById("botonCategoria").textContent = "Guardar cambios";
  document.getElementById("botonCancelar").classList.remove("oculto");
}

function limpiarFormularioCategoria() {
  document.getElementById("formCategoria").reset();
  document.getElementById("idCategoria").value = "";
  document.getElementById("botonCategoria").textContent = "Crear categoría";
  document.getElementById("botonCancelar").classList.add("oculto");
}

async function guardarCategoria(evento) {
  evento.preventDefault();
  const id = valorDe("idCategoria");
  const datos = { nombre: valorDe("nombreCategoria"), descripcion: valorDe("descripcionCategoria") };
  if (await ejecutar(() => (id ? api.put("/categorias/" + id, datos) : api.post("/categorias", datos)))) {
    limpiarFormularioCategoria();
    void cargarCategorias();
  }
}

async function cambiarEstadoCategoria(id, accion) {
  await ejecutar(() => api.patch("/categorias/" + id + "/" + accion));
  void cargarCategorias();
}

async function cargarFacultades() {
  const tabla = document.getElementById("tablaFacultades");
  try {
    const respuesta = await api.get("/facultades");
    tabla.innerHTML = "";
    respuesta.datos.forEach((facultad) => {
      const fila = crearElemento("tr");
      fila.appendChild(crearElemento("td", facultad.nombre));
      fila.appendChild(crearElemento("td", facultad.estado));
      fila.appendChild(crearElemento("td", formatearFecha(facultad.fechaCreacion)));
      tabla.appendChild(fila);
    });
    const activas = respuesta.datos.filter((facultad) => facultad.estado === "ACTIVA");
    llenarSelect("facultadPrograma", activas, (f) => f.id, (f) => f.nombre, "Seleccione la facultad");
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

async function registrarFacultad(evento) {
  evento.preventDefault();
  if (await ejecutar(() => api.post("/facultades", { nombre: valorDe("nombreFacultad") }))) {
    document.getElementById("formFacultad").reset();
    void cargarFacultades();
  }
}

async function cargarProgramas() {
  const tabla = document.getElementById("tablaProgramas");
  try {
    const respuesta = await api.get("/programas");
    tabla.innerHTML = "";
    respuesta.datos.forEach((programa) => {
      const fila = crearElemento("tr");
      fila.appendChild(crearElemento("td", programa.nombre));
      fila.appendChild(crearElemento("td", programa.facultad.nombre));
      fila.appendChild(crearElemento("td", programa.estado));
      tabla.appendChild(fila);
    });
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

async function registrarPrograma(evento) {
  evento.preventDefault();
  const datos = { nombre: valorDe("nombrePrograma"), facultad: { id: valorDe("facultadPrograma") || null } };
  if (await ejecutar(() => api.post("/programas", datos))) {
    document.getElementById("formPrograma").reset();
    void cargarProgramas();
  }
}

async function ejecutar(accion) {
  let exito = false;
  try {
    const respuesta = await accion();
    mostrarMensaje("mensaje", respuesta.mensajes.join(" "), false);
    exito = true;
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
  window.scrollTo(0, 0);
  return exito;
}

function iniciarAdministracion() {
  if (tienePermiso("GESTIONAR_CATEGORIAS")) {
    document.getElementById("seccionCategorias").classList.remove("oculto");
    document.getElementById("formCategoria").addEventListener("submit", guardarCategoria);
    document.getElementById("botonCancelar").addEventListener("click", limpiarFormularioCategoria);
    void cargarCategorias();
  }
  if (tienePermiso("GESTIONAR_ESTRUCTURA")) {
    document.getElementById("seccionFacultades").classList.remove("oculto");
    document.getElementById("seccionProgramas").classList.remove("oculto");
    document.getElementById("formFacultad").addEventListener("submit", registrarFacultad);
    document.getElementById("formPrograma").addEventListener("submit", registrarPrograma);
    void cargarFacultades();
    void cargarProgramas();
  }
}

document.addEventListener("DOMContentLoaded", iniciarAdministracion);

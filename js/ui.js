function mostrarMensaje(idElemento, texto, esError) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = texto;
  elemento.className = "mensaje " + (esError ? "error" : "exito");
}

function limpiarMensaje(idElemento) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = "";
  elemento.className = "mensaje oculto";
}

function llenarSelect(idSelect, elementos, obtenerValor, obtenerTexto, textoInicial) {
  const select = document.getElementById(idSelect);
  select.innerHTML = "";
  const opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.textContent = textoInicial;
  select.appendChild(opcionInicial);
  elementos.forEach((elemento) => {
    const opcion = document.createElement("option");
    opcion.value = obtenerValor(elemento);
    opcion.textContent = obtenerTexto(elemento);
    select.appendChild(opcion);
  });
}

function valorDe(idCampo) {
  return document.getElementById(idCampo).value.trim();
}

function crearElemento(etiqueta, texto, clase) {
  const elemento = document.createElement(etiqueta);
  if (texto !== undefined && texto !== null) {
    elemento.textContent = texto;
  }
  if (clase) {
    elemento.className = clase;
  }
  return elemento;
}

function crearBoton(texto, accion, clase) {
  const boton = crearElemento("button", texto, clase);
  boton.type = "button";
  boton.addEventListener("click", accion);
  return boton;
}

function nombreDe(usuario) {
  return usuario ? usuario.nombres + " " + usuario.apellidos : "";
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "";
  }
  return new Date(fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

function parametroUrl(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

function pintarVacio(contenedor, texto) {
  contenedor.innerHTML = "";
  contenedor.appendChild(crearElemento("p", texto, "ayuda"));
}

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

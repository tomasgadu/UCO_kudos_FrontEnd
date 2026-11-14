const API_URL = "http://localhost:8080/api/v1";

async function llamarApi(metodo, ruta, cuerpo) {
  const encabezados = { "Content-Type": "application/json" };
  const token = obtenerToken();
  if (token) {
    encabezados["Authorization"] = "Bearer " + token;
  }

  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: metodo,
      headers: encabezados,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor. Verifique que el Back-End esté en ejecución.");
  }

  const contenido = await respuesta.json().catch(() => ({ mensajes: [], datos: [] }));

  if (!respuesta.ok) {
    const mensaje = contenido.mensajes && contenido.mensajes.length > 0
      ? contenido.mensajes.join(" ")
      : "Se presentó un error (" + respuesta.status + ").";
    throw new Error(mensaje);
  }

  return contenido;
}

const api = {
  get: (ruta) => llamarApi("GET", ruta),
  post: (ruta, cuerpo) => llamarApi("POST", ruta, cuerpo),
  put: (ruta, cuerpo) => llamarApi("PUT", ruta, cuerpo),
  patch: (ruta, cuerpo) => llamarApi("PATCH", ruta, cuerpo),
  delete: (ruta) => llamarApi("DELETE", ruta)
};

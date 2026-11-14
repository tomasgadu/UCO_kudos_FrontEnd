const GOOGLE_CLIENT_ID = "948990417160-gvev0oq9khcvriqbn7eqf10jg52ntl3i.apps.googleusercontent.com";

if (haySesion()) {
  window.location.href = "inicio.html";
}

document.getElementById("formLogin").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limpiarMensaje("mensaje");

  const credenciales = {
    correoInstitucional: valorDe("correo"),
    clave: document.getElementById("clave").value
  };

  try {
    const respuesta = await api.post("/sesiones", credenciales);
    const sesion = respuesta.datos[0];
    guardarSesion(sesion.token, sesion.usuario);
    window.location.href = "inicio.html";
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
});

async function iniciarSesionConGoogle(respuestaGoogle) {
  limpiarMensaje("mensaje");
  try {
    const respuesta = await api.post("/sesiones/google", { credencial: respuestaGoogle.credential });
    const sesion = respuesta.datos[0];
    guardarSesion(sesion.token, sesion.usuario);
    window.location.href = "inicio.html";
  } catch (error) {
    mostrarMensaje("mensaje", error.message, true);
  }
}

function prepararBotonGoogle() {
  if (!window.google || !google.accounts) {
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (respuestaGoogle) => void iniciarSesionConGoogle(respuestaGoogle)
  });
  google.accounts.id.renderButton(document.getElementById("botonGoogle"), {
    theme: "outline",
    size: "large",
    text: "signin_with",
    locale: "es"
  });
}

window.addEventListener("load", prepararBotonGoogle);

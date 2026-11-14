const OPCIONES_MENU = [
  { texto: "Inicio", pagina: "inicio.html" },
  { texto: "Kudos", pagina: "kudos.html" },
  { texto: "Notificaciones", pagina: "notificaciones.html" },
  { texto: "Solicitudes", pagina: "solicitudes.html", permiso: "APROBAR_SOLICITUDES" },
  { texto: "Moderación", pagina: "moderacion.html", permiso: "REVISAR_REPORTES" },
  { texto: "Administración", pagina: "administracion.html", permiso: "GESTIONAR_CATEGORIAS" },
  { texto: "Auditoría", pagina: "auditoria.html", permiso: "CONSULTAR_AUDITORIA" },
  { texto: "Mi perfil", pagina: "perfil.html" }
];

function opcionesPermitidas() {
  return OPCIONES_MENU.filter((opcion) => !opcion.permiso || tienePermiso(opcion.permiso));
}

function pintarMenu() {
  const menu = document.getElementById("menu");
  const paginaActual = window.location.pathname.split("/").pop();

  opcionesPermitidas().forEach((opcion) => {
    const enlace = document.createElement("a");
    enlace.href = opcion.pagina;
    enlace.textContent = opcion.texto;
    if (opcion.pagina === paginaActual) {
      enlace.className = "activa";
    }
    menu.appendChild(enlace);
  });

  const botonSalir = document.createElement("button");
  botonSalir.textContent = "Cerrar sesión";
  botonSalir.addEventListener("click", cerrarSesion);
  menu.appendChild(botonSalir);
}

async function cerrarSesion() {
  try {
    await api.delete("/sesiones");
  } finally {
    cerrarSesionLocal();
    window.location.href = "index.html";
  }
}

exigirSesion();
document.addEventListener("DOMContentLoaded", pintarMenu);

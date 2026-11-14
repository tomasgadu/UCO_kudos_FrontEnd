const CLAVE_TOKEN = "kudos_token";
const CLAVE_USUARIO = "kudos_usuario";

const PERMISOS_POR_ROL = {
  ADMINISTRADOR: ["GESTIONAR_ESTRUCTURA", "GESTIONAR_CATEGORIAS", "GESTIONAR_PARAMETROS", "CONSULTAR_AUDITORIA", "APROBAR_SOLICITUDES"],
  RECTOR: ["GESTIONAR_CATEGORIAS", "VETAR", "REVISAR_REPORTES", "CONSULTAR_AUDITORIA", "APROBAR_SOLICITUDES"],
  COORDINADOR_ACADEMICO: ["GESTIONAR_CATEGORIAS", "VETAR", "REVISAR_REPORTES", "CONSULTAR_AUDITORIA", "APROBAR_SOLICITUDES"],
  COORDINADOR_FACULTAD: ["APROBAR_SOLICITUDES"],
  COORDINADOR_PROGRAMA: ["APROBAR_SOLICITUDES"],
  DOCENTE: [],
  ESTUDIANTE: []
};

function guardarSesion(token, usuario) {
  sessionStorage.setItem(CLAVE_TOKEN, token);
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

function obtenerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN);
}

function obtenerUsuario() {
  const usuario = sessionStorage.getItem(CLAVE_USUARIO);
  return usuario ? JSON.parse(usuario) : null;
}

function haySesion() {
  return obtenerToken() !== null;
}

function cerrarSesionLocal() {
  sessionStorage.removeItem(CLAVE_TOKEN);
  sessionStorage.removeItem(CLAVE_USUARIO);
}

function exigirSesion() {
  if (!haySesion()) {
    window.location.href = "index.html";
  }
}

function tienePermiso(permiso) {
  const usuario = obtenerUsuario();
  if (!usuario || !usuario.rol) {
    return false;
  }
  const permisos = PERMISOS_POR_ROL[usuario.rol.codigo] || [];
  return permisos.includes(permiso);
}

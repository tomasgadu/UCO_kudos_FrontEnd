# UCO Kudos — Front-End

Interfaz web de la Plataforma Institucional de Reconocimientos de la Universidad Católica de Oriente.
Proyecto Integrador Final — Diseño Orientado a Objetos (2026).

Back-End: [UCO_kudos_BackEnd](https://github.com/tomasgadu/UCO_kudos_BackEnd)

## Tecnologías

- HTML, CSS y JavaScript sin framework
- `fetch` para consumir la API REST del Back-End
- Visual Studio Code con la extensión **Live Server**

## Requisitos

1. El Back-End en ejecución en `http://localhost:8080` (ver su README).
2. Visual Studio Code con la extensión **Live Server** (Ritwick Dey).

## Ejecución

1. Abrir esta carpeta en Visual Studio Code.
2. Clic derecho en `index.html` → **Open with Live Server**.
3. Se abre `http://localhost:5173/index.html`.

El puerto **5173** y el host **localhost** se configuran en `.vscode/settings.json`. Deben coincidir con el origen que el Back-End permite por CORS (`kudos.cors.origen-permitido`). Con `127.0.0.1` el navegador bloquea las peticiones.

### Usuarios de prueba

Todos usan la clave `Kudos2026*`.

| Usuario | Correo | Rol |
|---|---|---|
| Laura Gómez | `laura.gomez@uco.edu.co` | Administrador |
| Carlos Restrepo | `carlos.restrepo@uco.edu.co` | Rector |

## Páginas

| Página | Qué permite | Quién la ve |
|---|---|---|
| `index.html` | Iniciar sesión | Todos |
| `registro.html` | Registrarse y verificar correo y celular | Todos |
| `inicio.html` | Accesos según el rol | Usuario autenticado |
| `kudos.html` | Dar un Kudo y ver el muro (filtrar por destinatario) | Usuario autenticado |
| `conversacion.html` | Ver un Kudo con sus réplicas; responder, calificar, reportar y vetar | Usuario autenticado (vetar: Rector y Coord. Académico) |
| `notificaciones.html` | Ver y marcar notificaciones | Usuario autenticado |
| `perfil.html` | Consultar y actualizar mi información | Usuario autenticado |
| `solicitudes.html` | Aprobar o rechazar solicitudes de registro | Roles aprobadores |
| `moderacion.html` | Revisar reportes y decidir (aceptar = veto) | Rector y Coord. Académico |
| `administracion.html` | Categorías; facultades y programas | Categorías: Administrador, Rector, Coord. Académico. Estructura: Administrador |
| `auditoria.html` | Consultar el registro de operaciones | Administrador, Rector, Coord. Académico |

## Estructura

```
├── *.html             páginas
├── css/estilos.css    estilos
└── js/
    ├── api.js         único punto de comunicación con el Back-End (fetch, token, errores)
    ├── sesion.js      token y usuario en sessionStorage, protección de páginas, permisos por rol
    ├── ui.js          funciones de pantalla reutilizables
    ├── menu.js        menú según el rol y cierre de sesión
    └── <página>.js    lógica de cada página
```

El menú solo oculta opciones según el rol; la seguridad real la aplica el Back-End en cada petición.

# Arena.GG — Plataforma de Torneos eSports

Arena.GG es una plataforma web donde los jugadores pueden apuntarse a torneos de videojuegos, ganar tokens y canjearlos por recompensas. Este proyecto está construido con Angular en el frontend y Spring Boot en el backend, usando Supabase como base de datos.

---

## ¿Qué tecnologías usa?

| Parte | Tecnología |
|-------|-----------|
| Frontend | Angular 21 |
| Backend | Spring Boot 4 (Java) |
| Base de datos | PostgreSQL en Supabase |
| Autenticación | Supabase Auth |

---

## Cómo arrancar el proyecto

Necesitas tener instalado: **Node.js**, **Java 21** y **Angular CLI**.

### 1. Arrancar el backend

Abre una terminal y ve a la carpeta del backend:

```
cd arena-gg/src/backend
```

Ejecuta:

```
.\mvnw.cmd spring-boot:run
```

Espera hasta que veas este mensaje:
```
Tomcat started on port 8080
```

El backend ya está funcionando en `http://localhost:8080`.

### 2. Arrancar el frontend

Abre **otra terminal** (el backend tiene que seguir corriendo) y ve a la carpeta del proyecto:

```
cd arena-gg
```

Ejecuta:

```
ng serve
```

Espera hasta que veas:
```
Local: http://localhost:4200/
```

Abre el navegador y ve a `http://localhost:4200`.

---

## Cómo funciona la página

### Página de inicio (`/`)
Al entrar verás la página principal con:
- Un torneo **destacado** en grande con cuenta atrás para cuando empieza
- Los **juegos disponibles** en la plataforma (LoL, CS2, Valorant, etc.)
- Los **torneos destacados** con sus premios y cupos disponibles
- Una sección de **tienda** con un preview de los productos

Todos los torneos que aparecen aquí vienen de la base de datos real.

### Torneos (`/tournaments`)
Aquí aparece la lista completa de torneos. Puedes:
- **Filtrar** por juego, nivel y tipo de entrada (gratis o de pago)
- **Buscar** un torneo por nombre usando la barra de búsqueda
- **Ordenar** por fecha de inicio o por premio

Los datos vienen directamente del backend (`http://localhost:8080/api/tournaments`).

### Detalle de torneo (`/tournaments/:id`)
Al hacer click en un torneo verás:
- El **banner** del juego con el nombre, formato y nivel
- Las **estadísticas**: premio, cuándo empieza, cupos disponibles y precio de entrada
- El **bracket** del torneo (visual de eliminatorias)
- La **lista de inscritos**
- El **reparto de premios** (50% para el 1º, 25% para el 2º, etc.)
- Un botón para **inscribirse** — si estás logueado se guarda en la base de datos y el contador de cupos se actualiza

### Tienda (`/store`)
Catálogo de productos que puedes canjear con tokens:
- Skins de juegos
- Merch (ropa, accesorios)
- Gift cards
- Pases de batalla

### Ranking (`/ranking`)
Tabla de los mejores jugadores de la plataforma.

### Perfil (`/profile`)
Solo accesible si has iniciado sesión. Muestra tu información de usuario.

### Login y Registro (`/login`)
Puedes crear una cuenta o iniciar sesión. Usa Supabase Auth para gestionar los usuarios. Al registrarte se crean automáticamente 500 tokens de bienvenida.

---

## Sistema de roles

Hay dos tipos de usuario:

**Usuario normal** — puede ver torneos, inscribirse y usar la tienda.

**Administrador** — tiene acceso al panel de administración donde puede crear, editar y eliminar torneos. Para hacerse admin hay que actualizar manualmente el campo `is_admin = true` en la tabla `profiles` de Supabase.

---

## Panel de administración (`/admin`)

Solo visible si tu usuario tiene el rol de administrador. Desde aquí puedes:

1. **Ver todos los torneos** en una tabla con nombre, juego, premio, cupos y estado
2. **Crear un torneo nuevo** — pulsa el botón "+ Nuevo torneo", rellena el formulario y dale a "Crear torneo"
3. **Editar un torneo** — pulsa "Editar" en la fila del torneo que quieres cambiar
4. **Eliminar un torneo** — pulsa "Eliminar" (te pide confirmación antes de borrar)

Todos los cambios se guardan directamente en la base de datos de Supabase.

---

## Estructura del proyecto

```
arena-gg/
├── src/                        # Frontend Angular
│   ├── app/
│   │   ├── core/               # Servicios (auth, torneos, registro)
│   │   ├── features/           # Páginas (home, torneos, tienda, admin...)
│   │   ├── layout/             # Header
│   │   └── shared/             # Componentes reutilizables (emblema, badge, coin, confirm-modal, countdown, toast, pipes)
│   ├── environments/           # Configuración de Supabase
│   └── styles.css              # Estilos globales y temas
│
└── src/backend/                # Backend Spring Boot
    └── src/main/java/com/arena/gg/backend/
        ├── controller/         # Endpoints de la API REST
        ├── model/              # Entidades de la base de datos
        ├── repository/         # Acceso a la base de datos
        ├── dto/                # Objetos de transferencia de datos
        └── config/             # Configuración de seguridad
```

---

## API del backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tournaments` | Obtener todos los torneos |
| GET | `/api/tournaments/:id` | Obtener un torneo por ID |
| POST | `/api/tournaments` | Crear un torneo nuevo |
| PUT | `/api/tournaments/:id` | Editar un torneo |
| DELETE | `/api/tournaments/:id` | Eliminar un torneo |
| POST | `/api/tournaments/:id/register` | Inscribirse en un torneo |

---

## Base de datos

El proyecto usa Supabase (PostgreSQL). Las tablas principales son:

- **profiles** — datos de los usuarios (nick, tokens, nivel, is_admin)
- **games** — catálogo de juegos
- **tournaments** — torneos con todos sus detalles
- **registrations** — inscripciones de usuarios a torneos
- **store_items** — productos de la tienda
- **token_transactions** — historial de movimientos de tokens

La base de datos ya está configurada y funcionando. 


Firmado
Daniel Rodriguez Mullender
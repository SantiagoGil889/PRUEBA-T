# Gestor de tareas - CUC

Mini sistema full-stack de To-Do List con autenticación, CRUD de tareas, filtros por estado/prioridad y Dockerización completa.

---

## Tecnologías y justificación

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Backend** | Node.js + Express | Ligero, maduro y ampliamente conocido para APIs REST |
| **Auth** | JWT + bcryptjs | Stateless  bcrypt con salt=12 para hash seguro |
| **Validación** | express-validator | Declarativo, integrado con Express, mensajes personalizables |
| **Base de datos** | PostgreSQL 15 | Soporta CHECK constraints, índices y transacciones |
| **Frontend** | React 18 + Vite | React es estándar de industria para SPAs |
| **Estilos** | Tailwind CSS 3 | Diseño |
| **Ruteo** | React Router v6 | Rutas protegidas y navegación declarativa |
| **HTTP client** | Axios | Interceptores para inyección de token y manejo global de 401 |
| **Infraestructura** | Docker + nginx | Containerización reproducible |

---

## Cómo correr el proyecto

### Opción 1 – Docker 

**Requisitos:** Docker Desktop instalado y corriendo.

```bash
git clone <https://github.com/SantiagoGil889/PRUEBA-T>
cd PRUEBA T

docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| PostgreSQL | localhost:5432 |

> Usuario de prueba ya creado: **prueba@gmail.com** / **demo1234**

Para detener:
```bash
docker-compose down
# Para borrar también los datos de la BD:
docker-compose down -v
```

---

### Opción 2 – Local (sin Docker)

#### Requisitos previos
- Node.js 18+
- PostgreSQL 13+

#### 1. Base de datos

```bash
# Crear la base de datos
createdb tododb

# Ejecutar el schema
psql -d tododb -f database/schema.sql
```

#### 2. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npm install
npm run dev        # Corre en http://localhost:4000
```

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # Corre en http://localhost:3000
```

El proxy de Vite (`vite.config.js`) redirige automáticamente `/api/*` al backend en puerto 4000, sin necesidad de configurar CORS manualmente en desarrollo.

---

## Estructura del proyecto

```
taskflow/
├── database/
│   └── schema.sql          # DDL: tablas users y tasks + índices + usuario de prueba
├── backend/
│   ├── src/
│   │   ├── config/db.js    # Conexión PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js     # Middleware JWT para rutas protegidas
│   │   ├── controllers/
│   │   │   ├── authController.js   # Registro / login
│   │   │   └── taskController.js   # CRUD de tareas
│   │   ├── routes/
│   │   │   ├── auth.js     # POST /api/auth/register, /api/auth/login
│   │   │   └── tasks.js    # GET/POST/PUT/DELETE /api/tasks
│   │   └── app.js         
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          
│   │   ├── context/AuthContext.jsx  # Autenticación
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login + Registro con validación
│   │   │   └── Dashboard.jsx     # Vista principal de tareas
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── TaskCard.jsx      # Tarjeta individual de tarea
│   │       ├── TaskFilters.jsx   # Filtros por estado y prioridad
│   │       └── TaskForm.jsx      # Modal crear/editar tarea
│   ├── nginx.conf            # Proxy inverso + SPA routing
│   ├── vite.config.js        # Proxy de desarrollo
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Endpoints de la API

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |

### Tareas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/tasks` | Listar tareas del usuario (filtros: `?status=&priority=`) | JWT |
| POST | `/api/tasks` | Crear tarea | JWT |
| PUT | `/api/tasks/:id` | Actualizar tarea | JWT |
| DELETE | `/api/tasks/:id` | Eliminar tarea | JWT |

---

## Decisiones técnicas

- **JWT en localStorage**
- **COALESCE en UPDATE**: Permite actualizaciones parciales sin necesidad de enviar todos los campos.
- **Filtros en backend (SQL)**: Se aplican directamente en la consulta para no transferir datos innecesarios.
- **Retry de conexión DB**: El backend intenta conectar hasta 10 veces cada 3 segundos, sobre todo utilizado en docker donde puede haber problemas al momento de la conexión de la DB.
- **Proxy Vite en dev / nginx en prod**: El frontend no necesita conocer el host del backend.
- **CHECK constraints en PostgreSQL**: Validación de `status` y `priority`.

---

## Bonus implementados

- **Filtros por estado y prioridad** Aplicado en el frontend (también aplicados en SQL del backend).
- **Validaciones en frontend Y backend** (express-validator + validaciones manuales en React).
- **Dockerización completa** con `docker-compose up --build` — levanta BD, backend y frontend.

---

## Pendientes

- Fecha de vencimiento en las tareas.
- Ordenamiento configurable por el usuario.
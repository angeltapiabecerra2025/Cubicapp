# Sistema de Automatización de Cubicaciones

Este proyecto contiene el esqueleto y la lógica base para la aplicación de cubicaciones.

## Estructura del Proyecto

- `backend/`: API construida con Node.js y Express.
- `frontend/`: Aplicación cliente construida con React y Vite.

## Requisitos Previos

1. **Node.js:** Es necesario instalar Node.js para poder ejecutar los comandos de instalación y desarrollo.
2. **PostgreSQL:** Se requiere una base de datos PostgreSQL activa.

## Instrucciones de Instalación

Una vez instalado Node.js, ejecute los siguientes comandos en cada carpeta:

### Backend
1. `cd backend`
2. `npm install`
3. Configure el archivo `.env` con sus credenciales de base de datos.
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Roles y Permisos
La lógica de seguridad dinámica se encuentra en `backend/src/middlewares/verificarPermiso.js`.

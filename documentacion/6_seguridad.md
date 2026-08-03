# Roles y Permisos de Seguridad - CUBICAPP

Este documento especifica el diseño de la seguridad de **CUBICAPP**, incluyendo el modelo de roles de usuario, la matriz de control de acceso a nivel de módulos y acciones, y la lógica de validación técnica implementada tanto en el Backend como en el almacenamiento empresarial.

---

## 1. Perfiles y Roles de Usuario

El sistema cuenta con 8 roles estructurados para responder a las necesidades de control y auditoría en obras de construcción de envergadura:

1. **Administrador**: Acceso total a la configuración global del sistema, roles, permisos de usuario y utilidades de base de datos (respaldos).
2. **Gerencia**: Acceso de consulta global a todos los proyectos y tableros. Capacidad de aprobación comercial de Estados de Pago. No ingresa cubicaciones ni avances.
3. **Jefe de Proyecto (PM)**: Responsable técnico del proyecto. Modifica presupuestos, correlaciona planificación y aprueba técnicamente los Estados de Pago y adicionales.
4. **Oficina Técnica (Of. Técnica / Cubicador)**: Core técnico operativo. Carga itemizados, define actividades, genera las cubicaciones paramétricas de los elementos y compila los Estados de Pago (EDP).
5. **Control de Costos**: Auditor financiero de la constructora. Analiza desviaciones de presupuesto, revisa las cubicaciones de Oficina Técnica y firma el EDP antes del envío al mandante.
6. **Administrador de Contrato**: Administrador legal del contrato. Revisa y aprueba las obras adicionales y los montos presentados en el EDP.
7. **Supervisor**: Personal en terreno. Visualiza las cubicaciones e ingresa el avance físico real acumulado de las subactividades de cada elemento.
8. **Consulta (Auditor Externo / ITO / Cliente)**: Acceso de lectura restringido a las partidas, cubicaciones y estados de pago aprobados para control de transparencia.

---

## 2. Matriz de Permisos de Acceso por Módulo

La siguiente matriz detalla los privilegios específicos de lectura (**L**), escritura/creación (**W**), edición (**E**), eliminación (**D**) y aprobación (**A**) por módulo y rol:

| Módulo / Proceso | Adm. | Ger. | J. Proy. | Of. Téc. | C. Costos | Adm. Cont. | Superv. | Cons. |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Administración General** | L/W/E/D | - | - | - | - | - | - | - |
| **Gestión de Obras** | L/W/E/D | L | L/E | L/E | L | L | - | - |
| **Gestión de Contratos** | L/W/E/D | L | L/E | L/W/E | L | L/E | - | - |
| **Gestión de Partidas (Itemizados)** | L/W/E/D | L | L/E | L/W/E/D | L/E | L | - | L |
| **Catálogo de Actividades** | L/W/E/D | L | L | L/W/E/D | L | - | - | L |
| **Cubicaciones (Ingreso)** | L/W/E/D | L | L | L/W/E/D | L | L | L | L |
| **Avances Físicos (Terreno)** | L/W/E/D | L | L | L/E | L | - | L/W/E | L |
| **Estados de Pago (Cálculo/Generar)**| L/W/E/D | L | L | L/W/E/D | L | L | - | L |
| **Aprobación de EDP** | - | **A** | **A** | - | **A** | **A** | - | - |
| **Control de Cambios (Adicionales)** | L/W/E/D | L/E | L/W/E | L/W/E | L/E | L/W/E | - | L |
| **Documentos Adjuntos** | L/W/E/D | L | L/W/E | L/W/E/D | L | L | L/W/E | L |
| **BIM (Visualización y Mapeo)** | L/W/E/D | L | L/E | L/W/E/D | L | - | L | L |
| **Dashboard Gerencial** | L | L | L | L | L | L | L | L |

---

## 3. Implementación de Seguridad Técnica (Backend)

La seguridad dinámica de la aplicación está regulada en el backend mediante un middleware de autorización que verifica en tiempo real los privilegios del usuario almacenados en la base de datos PostgreSQL/SQL Server.

### Lógica del Middleware de Autorización (`verificarPermiso`)
El middleware intercepta las peticiones HTTP y realiza los siguientes pasos:

1. **Identificación de Usuario**: Extrae el `rol_id` del token de autenticación del usuario (`req.usuario.rol_id`).
2. **Consulta de Privilegios**: Consulta la tabla `rol_permisos` cruzándola con el módulo correspondiente al endpoint solicitado.
3. **Mapeo de Verbo HTTP a Columna**: Traduce el método HTTP de la petición a la columna de privilegios correspondiente en la tabla relacional:
   * `GET` $\rightarrow$ `puede_leer`
   * `POST` $\rightarrow$ `puede_escribir`
   * `PUT` / `PATCH` $\rightarrow$ `puede_editar`
   * `DELETE` $\rightarrow$ `puede_eliminar`
4. **Denegación o Acceso**: Si el valor de la columna es `TRUE`, invoca a `next()` para procesar la petición. De lo contrario, retorna un código de estado `403 Forbidden` con el mensaje: *"Acceso denegado: permisos insuficientes para esta acción."*

```javascript
// Ejemplo de consulta SQL interna ejecutada por el middleware
const query = `
  SELECT rp.* 
  FROM rol_permisos rp
  JOIN modulos m ON rp.modulo_id = m.id
  WHERE rp.rol_id = $1 AND m.nombre = $2
`;
```

---

## 4. Seguridad a Nivel de Base de Datos y Almacenamiento (Dataverse/SQL)

Para la implementación final en entornos corporativos (SQL Server / Dataverse):

### Seguridad en SQL Server:
* **Row-Level Security (RLS)**: Restringe el acceso a las filas de la tabla `cubicaciones` y `avances_fisicos` según el proyecto. Los cubicadores y supervisores solo pueden ver y modificar registros asociados a las obras a las que están explícitamente asignados en la tabla de asignación.
* **Encryption (Encriptación)**: Cifrado de datos en reposo (Transparent Data Encryption - TDE) y cifrado de conexiones SSL/TLS en tránsito.

### Seguridad en Dataverse:
* **Security Roles (Roles de Seguridad)**: Configuración de unidades de negocio (Business Units) para separar el acceso a los datos por sucursales o frentes de obra geográficos.
* **Field-Level Security (Seguridad a Nivel de Campo)**: Bloqueo de campos críticos (ej. Monto Aprobado Final, Precios Unitarios Contractuales) para que solo sean editables por el rol "Control de Costos" o "Administrador de Contrato", impidiendo modificaciones accidentales por parte de los cubicadores.

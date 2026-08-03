# Diccionario de Datos y Modelo de Base de Datos - CUBICAPP

Este documento contiene el modelo de datos físico-lógico y el diccionario de datos detallado para reconstruir la base de datos relacional de **CUBICAPP** en un motor relacional de grado empresarial como **SQL Server** o **PostgreSQL**.

---

## 1. Mapeo de Entidades a Tablas Relacionales

Para asegurar integridad referencial y cumplir con la tercera forma normal (3NF), los datos del prototipo (almacenados en archivos planos JSON e inyectados dinámicamente) se estructuran en el siguiente esquema relacional de base de datos:

```
+---------------------------------------------------------------------------------+
|                                 TABLAS MAESTRAS                                 |
+---------------------------------------------------------------------------------+
| usuarios              | roles              | rol_permisos       | modulos       |
| proyectos             | especialidades     | actividades        | subactividades|
| unidades_medida       | insumos            | proveedores        |               |
+---------------------------------------------------------------------------------+
|                               TABLAS TRANSACCIONALES                            |
+---------------------------------------------------------------------------------+
| partidas (Itemizados) | cubicaciones       | avances_fisicos    | avances_edp   |
| historico_edp         | historico_edp_det  | obras_adicionales  | revisiones_ad |
| suministros_sol       | suministros_det    |                    |               |
+---------------------------------------------------------------------------------+
|                                 CONFIG Y AUDITORÍA                              |
+---------------------------------------------------------------------------------+
| config_ponderaciones  | bim_modelos        | bim_mappings       | bim_clashes   |
| logs_auditoria        |                    |                    |               |
+---------------------------------------------------------------------------------+
```

---

## 2. Diccionario de Datos Detallado

### 2.1. Tabla: `proyectos` (Obras)
Almacena la información de los diferentes frentes de obra o proyectos gestionados por la constructora.

* **Nombre Físico**: `proyectos`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | Longitud | PK | FK | Oblig. | Índice | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `id` | Identificador único del proyecto | INT (Identity) | - | Sí | - | Sí | Único | Correlativo incremental |
| `nombre` | Nombre formal de la obra | VARCHAR | 150 | - | - | Sí | Sí | No vacío, único |
| `descripcion` | Detalle o memoria del proyecto | TEXT | - | - | - | No | - | - |
| `fecha_inicio` | Fecha de inicio de obras | DATE | - | - | - | Sí | - | $\ge$ '2000-01-01' |
| `fecha_fin` | Fecha de término estimada | DATE | - | - | - | No | - | $\ge$ `fecha_inicio` |
| `creado_el` | Fecha de creación del registro | TIMESTAMP | - | - | - | Sí | - | Default `CURRENT_TIMESTAMP` |

---

### 2.2. Tabla: `usuarios`
Catálogo de colaboradores y personal autorizado a acceder al sistema.

* **Nombre Físico**: `usuarios`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | Longitud | PK | FK | Oblig. | Índice | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `id` | Identificador único del usuario | INT (Identity) | - | Sí | - | Sí | Único | - |
| `nombre` | Nombre completo del usuario | VARCHAR | 150 | - | - | Sí | - | - |
| `email` | Correo electrónico corporativo | VARCHAR | 100 | - | - | Sí | Único | Formato de email válido, único |
| `rol_id` | Enlace al rol del sistema | INT | - | - | `roles(id)` | Sí | Sí | - |
| `telefono` | Teléfono de contacto | VARCHAR | 20 | - | - | No | - | - |
| `activo` | Indicador si el usuario está activo | BOOLEAN | - | - | - | Sí | - | Default `TRUE` |

---

### 2.3. Tabla: `roles` y `rol_permisos`
Define el modelo de control de acceso basado en roles (RBAC).

* **Nombre Físico**: `roles`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | Longitud | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `id` | Código único de rol | INT | - | Sí | - | Sí | Correlativo |
| `nombre` | Nombre del rol (ej. Oficina Técnica)| VARCHAR | 50 | - | - | Sí | Único |
| `descripcion` | Breve glosa descriptiva | VARCHAR | 250 | - | - | No | - |

* **Nombre Físico**: `rol_permisos`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `rol_id` | Identificador de rol | INT | Sí | `roles(id)` | Sí | Cascade on Delete |
| `modulo_id` | Identificador del módulo | INT | Sí | `modulos(id)`| Sí | Cascade on Delete |
| `puede_leer` | Permiso de consulta (GET) | BOOLEAN | - | - | Sí | Default `FALSE` |
| `puede_escribir` | Permiso de creación (POST) | BOOLEAN | - | - | Sí | Default `FALSE` |
| `puede_editar` | Permiso de edición (PUT/PATCH)| BOOLEAN | - | - | Sí | Default `FALSE` |
| `puede_eliminar` | Permiso de remoción (DELETE) | BOOLEAN | - | - | Sí | Default `FALSE` |
| `puede_aprobar` | Permiso de firmas/autorizaciones| BOOLEAN | - | - | Sí | Default `FALSE` |

---

### 2.4. Tabla: `unidades_medida`
Almacena las unidades de medida físicas y sus ecuaciones para cálculo automatizado de volumen.

* **Nombre Físico**: `unidades_medida`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | Longitud | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `id` | Identificador único de unidad | INT (Identity) | - | Sí | - | Sí | - |
| `nombre` | Nombre completo (ej. Metro Cúbico) | VARCHAR | 50 | - | - | Sí | Único |
| `abreviatura` | Símbolo técnico (ej. m3, m2, kg) | VARCHAR | 10 | - | - | Sí | Único |
| `formula` | Ecuación matemática en JS | VARCHAR | 250 | - | - | No | Sintaxis matemática válida |
| `parametros` | Parámetros separados por coma | VARCHAR | 150 | - | - | No | Ej: `largo,ancho,alto` |

---

### 2.5. Tabla: `actividades` y `subactividades`
Representan la descomposición física operativa de las partidas de construcción.

* **Nombre Físico**: `actividades`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador de actividad | INT (Identity) | Sí | - | Sí | - |
| `nombre` | Nombre (ej. Hormigonado) | VARCHAR(100) | - | - | Sí | No vacío |
| `descripcion` | Detalle operativo | TEXT | - | - | No | - |
| `unidad_id` | Unidad de medida asociada | INT | - | `unidades_medida(id)` | Sí | - |
| `especialidad_id` | Especialidad técnica vinculada | INT | - | `especialidades(id)` | Sí | - |

* **Nombre Físico**: `subactividades`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador de subactividad | INT (Identity) | Sí | - | Sí | - |
| `actividad_id` | Actividad padre | INT | - | `actividades(id)` | Sí | Cascade on Delete |
| `nombre` | Nombre (ej. Enfierradura, Protocolo) | VARCHAR(100) | - | - | Sí | - |
| `porcentaje_fisico` | Ponderación física base (%) | NUMERIC(5,2) | - | - | Sí | Rango $[0, 100]$ |
| `porcentaje_edp` | Ponderación comercial base (%) | NUMERIC(5,2) | - | - | Sí | Rango $[0, 100]$ |
| `grupo_edp` | Nombre del grupo de agrupación EDP | VARCHAR(50) | - | - | No | - |

---

### 2.6. Tabla: `partidas` (Itemizado de Obra)
Estructura presupuestaria contractual cargada para cada proyecto. Representa el Presupuesto Base.

* **Nombre Físico**: `partidas`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | Longitud | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `id` | Identificador de partida | INT (Identity) | - | Sí | - | Sí | - |
| `proyecto_id` | Proyecto asociado | INT | - | - | `proyectos(id)` | Sí | Cascade on Delete |
| `item` | Código jerárquico (ej. 1.2.1) | VARCHAR | 30 | - | - | Sí | Formato jerárquico, índice único por proyecto |
| `descripcion` | Descripción de la partida | VARCHAR | 250 | - | - | Sí | - |
| `unidad_id` | Unidad de medida del itemizado | INT | - | - | `unidades_medida(id)` | Sí | - |
| `cantidad` | Cantidad contractual presupuestada | NUMERIC | 14,4 | - | - | Sí | $> 0$ |
| `precio_unitario` | Precio unitario contractual | NUMERIC | 14,2 | - | - | Sí | $\ge 0$ |
| `monto_total` | Cantidad $\times$ Precio unitario | NUMERIC | 14,2 | - | - | Sí | Calculado automáticamente |

---

### 2.7. Tabla: `cubicaciones`
Memoria de cálculo y cubicaciones de los elementos constructivos individuales ingresados por la Oficina Técnica.

* **Nombre Físico**: `cubicaciones`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador único de cubicación | BIGINT | Sí | - | Sí | - |
| `proyecto_id` | Obra correspondiente | INT | - | `proyectos(id)` | Sí | - |
| `actividad_id` | Actividad física | INT | - | `actividades(id)` | Sí | - |
| `partida_id` | Partida del itemizado vinculada | INT | - | `partidas(id)` | Sí | - |
| `elemento` | Nombre o tag del elemento (ej. C1) | VARCHAR(100) | - | - | Sí | No vacío |
| `ubicacion` | Ejes o tramos (ej. Eje A/1-2) | VARCHAR(150) | - | - | Sí | No vacío |
| `unidad_id` | Unidad ejecutora | INT | - | `unidades_medida(id)` | Sí | - |
| `cantidad_elementos`| Multiplicador de repetición | INT | - | - | Sí | $\ge 1$, default 1 (`cantidad`) |
| `valor_manual` | Anulación manual de cálculo | NUMERIC(12,4) | - | - | No | $\ge 0$ |
| `parametros_json` | Valores de las variables ($L, A, H$) | JSON / TEXT | - | - | No | Formato JSON `{"largo":12,"alto":0.3}` |
| `takeoff_calculado`| Cantidad neta cubicada final | NUMERIC(12,2) | - | - | Sí | Calculado mediante RN01 |
| `creado_por` | Usuario creador | INT | - | `usuarios(id)` | Sí | - |

---

### 2.8. Tabla: `avances_fisicos`
Almacena el avance acumulado de obra real por subactividad para cada registro de cubicación.

* **Nombre Físico**: `avances_fisicos`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador de avance | BIGINT (Identity)| Sí | - | Sí | - |
| `cubicacion_id` | Cubicación de origen | BIGINT | - | `cubicaciones(id)` | Sí | Cascade on Delete |
| `subactividad_id` | Subactividad evaluada | INT | - | `subactividades(id)`| Sí | - |
| `cantidad_ejecutada`| Cantidad física acumulada real | NUMERIC(12,2) | - | - | Sí | Rango $[0, \text{cubicacion.takeoff\_calculado}]$ |
| `modificado_por` | Usuario firmante del avance | INT | - | `usuarios(id)` | Sí | - |
| `fecha_avance` | Fecha de captura de avance | TIMESTAMP | - | - | Sí | Default `CURRENT_TIMESTAMP` |

---

### 2.9. Tabla: `historico_edp` y `historico_edp_detalles`
Snapshots consolidados e inmutables de los Estados de Pago generados para facturación mensual.

* **Nombre Físico**: `historico_edp`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador único del Snapshot | BIGINT | Sí | - | Sí | - |
| `proyecto_id` | Obra correspondiente | INT | - | `proyectos(id)` | Sí | - |
| `actividad_id` | Actividad consolidada | INT | - | `actividades(id)` | Sí | - |
| `periodo` | Periodo comercial (ej. "2026-02") | VARCHAR(10) | - | - | Sí | Formato YYYY-MM |
| `estado` | Estado del flujo aprobación | VARCHAR(30) | - | - | Sí | Pendiente, Aprobado, Rechazado |
| `comentario_auditoria`| Justificación o motivos de rechazo | TEXT | - | - | No | Obligatorio si estado = 'Rechazado' |
| `fecha_creacion` | Fecha de generación de la foto | TIMESTAMP | - | - | Sí | - |
| `fecha_decision` | Fecha de resolución (aprob/rechazo) | TIMESTAMP | - | - | No | - |
| `usuario_validador`| Usuario que aprueba/rechaza | INT | - | `usuarios(id)` | No | - |

* **Nombre Físico**: `historico_edp_detalles`
  *Guarda la copia exacta de cada línea de cubicación asociada a este EDP al momento del cierre.*
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Registro correlativo | BIGINT (Identity)| Sí | - | Sí | - |
| `historico_edp_id` | Cabecera del Snapshot | BIGINT | - | `historico_edp(id)` | Sí | Cascade on Delete |
| `elemento` | Elemento cubicado | VARCHAR(100) | - | - | Sí | - |
| `ubicacion` | Ubicación del elemento | VARCHAR(150) | - | - | Sí | - |
| `takeoff` | Cantidad total cubicada | NUMERIC(12,2) | - | - | Sí | - |
| `avance_fisico_pct` | Porcentaje de avance físico real | NUMERIC(5,2) | - | - | Sí | - |
| `avance_edp_qty` | Cantidad ejecutada valorizada EDP | NUMERIC(12,2) | - | - | Sí | Lógica de RN02 / RN03 aplicada |
| `avance_edp_pct` | Porcentaje valorizado EDP | NUMERIC(5,2) | - | - | Sí | - |

---

### 2.10. Tabla: `obras_adicionales` y `revisiones_adicionales`
Control de cambios contractuales y presupuestos extraordinarios solicitados.

* **Nombre Físico**: `obras_adicionales`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador de obra adicional | INT (Identity) | Sí | - | Sí | - |
| `proyecto_id` | Proyecto asociado | INT | - | `proyectos(id)` | Sí | - |
| `codigo_adicional` | Código correlativo (ej. AD-01) | VARCHAR(20) | - | - | Sí | Único por proyecto |
| `nombre` | Título del adicional | VARCHAR(150) | - | - | Sí | - |
| `descripcion` | Justificación técnica del cambio | TEXT | - | - | Sí | - |
| `estado` | Estado de aprobación final | VARCHAR(35) | - | - | Sí | Pendiente, Aprobada, Rechazada, Anulada |
| `aprob_monto` | Monto neta aprobado final | NUMERIC(14,2) | - | - | No | $\ge 0$ |
| `aprob_fecha` | Fecha de firma de acta | DATE | - | - | No | - |
| `aprob_carta` | Número de carta de aprobación | VARCHAR(50) | - | - | No | - |

* **Nombre Físico**: `revisiones_adicionales`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | Identificador de revisión | INT (Identity) | Sí | - | Sí | - |
| `adicional_id` | Enlace al adicional | INT | - | `obras_adicionales(id)`| Sí | Cascade on Delete |
| `numero_revision` | Correlativo de revisión (0, 1, 2) | INT | - | - | Sí | $\ge 0$ |
| `fecha` | Fecha de presentación | DATE | - | - | Sí | - |
| `costo_neto` | Costo directo presentado | NUMERIC(14,2) | - | - | Sí | - |
| `costo_total` | Costo con Gastos Grales/Utilidad| NUMERIC(14,2) | - | - | Sí | $\ge `costo_neto`$ |
| `observacion` | Comentario técnico | TEXT | - | - | No | - |
| `presentado_por` | Usuario presentador | INT | - | `usuarios(id)` | Sí | - |

---

### 2.11. Tabla: `config_ponderaciones`
Almacena las ponderaciones personalizadas de las subactividades a nivel de proyecto específico (sobreescribiendo el maestro global).

* **Nombre Físico**: `config_ponderaciones`
* **Campos**:

| Nombre Campo | Descripción | Tipo de Dato | PK | FK | Oblig. | Restricciones / Validaciones |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `proyecto_id` | Proyecto asociado | INT | Sí | `proyectos(id)` | Sí | - |
| `actividad_id` | Actividad asociada | INT | Sí | `actividades(id)` | Sí | - |
| `subactividad_id` | Subactividad configurada | INT | Sí | `subactividades(id)`| Sí | - |
| `porcentaje_cubicador`| Ponderación de Cubicaciones | NUMERIC(5,2) | - | - | Sí | $[0, 100]$ |
| `porcentaje_planificador`| Ponderación de Planificación | NUMERIC(5,2) | - | - | Sí | $[0, 100]$ |
| `porcentaje_edp` | Ponderación de Estados de Pago | NUMERIC(5,2) | - | - | Sí | $[0, 100]$ |

---

## 3. Índices Recomendados para Optimización (Performance)

Para asegurar la velocidad de consulta en entornos corporativos con altos volúmenes de registros (ej. más de 500,000 líneas de cubicación), se deben crear los siguientes índices:

1. **`idx_cubicaciones_proyecto_actividad`**:
   `CREATE INDEX idx_cubicaciones_proj_act ON cubicaciones(proyecto_id, actividad_id);`
   *Explicación*: Optimiza el filtrado constante del motor de cubicaciones y cierres mensuales.
2. **`idx_partidas_proyecto_item`**:
   `CREATE UNIQUE INDEX idx_partidas_proj_item ON partidas(proyecto_id, item);`
   *Explicación*: Acelera la búsqueda de jerarquías y asegura la unicidad del código de itemizado por obra.
3. **`idx_avances_fisicos_cubicacion`**:
   `CREATE INDEX idx_avances_fis_cub ON avances_fisicos(cubicacion_id);`
   *Explicación*: Optimiza la sumatoria de avances en terreno para calcular el porcentaje por fila.
4. **`idx_historico_edp_proyecto_periodo`**:
   `CREATE INDEX idx_hist_edp_proj_per ON historico_edp(proyecto_id, periodo);`
   *Explicación*: Acelera las búsquedas de reportes e históricos de auditoría de pago.

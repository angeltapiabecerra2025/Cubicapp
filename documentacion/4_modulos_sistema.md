# Diseño de Módulos del Sistema - CUBICAPP

Este documento describe detalladamente la arquitectura funcional, formularios, validaciones y flujos operacionales de los 12 módulos principales que integran **CUBICAPP**.

---

## 1. Módulo: Gestión de Obras (Proyectos)
* **Objetivo**: Administrar el catálogo de proyectos y obras de construcción activos en la corporación, asignando personal y configurando sus parámetros base.
* **Funcionalidades**:
  * Alta, baja y modificación de proyectos.
  * Asignación de personal del proyecto con roles específicos en la obra (PM, Cubicador, ITO).
  * Asociación de actividades operativas activas para el proyecto.
* **Formularios**:
  * *Formulario Obra*: Nombre de obra, descripción, fecha de inicio, fecha de fin.
  * *Formulario Personal de Obra*: Selección de usuario, rol de obra, correo electrónico.
* **Validaciones**:
  * La fecha de fin debe ser posterior a la fecha de inicio.
  * El código del proyecto es autonumérico y único.
* **Flujo Operacional**:
  1. El Administrador crea el proyecto.
  2. Asocia las actividades maestras autorizadas (ej. Hormigón y Estructuras).
  3. Registra al personal técnico responsable (Jefes de Proyecto, Cubicadores).

---

## 2. Módulo: Gestión de Contratos
* **Objetivo**: Gestionar la información comercial y administrativa de los contratos de construcción (sean contratos principales con mandantes o subcontratos con terceros).
* **Funcionalidades**:
  * Asociación del contrato a una obra específica.
  * Registro de códigos contractuales, órdenes de compra SAP y montos neta iniciales.
  * Mantenimiento de las firmas autorizadas del contrato (ITO, Subgerente, Administrador).
* **Formularios**:
  * *Ficha de Contrato*: Nombre del contrato, número de denominación contractual, N° Pedido SAP, ubicación geográfica, firmas responsables.
* **Validaciones**:
  * El N° Pedido SAP debe ser único y coincidir con el formato corporativo.
  * El monto contractual base no puede ser negativo.
* **Flujo Operacional**:
  1. Al iniciar la obra, Oficina Técnica registra el contrato principal.
  2. Se asocian las firmas responsables que aparecerán en la cabecera de la declaración de EDP.

---

## 3. Módulo: Gestión de Partidas (Itemizados)
* **Objetivo**: Cargar y administrar la Estructura de Desglose de Trabajo (WBS/Itemizado) y el presupuesto base del proyecto.
* **Funcionalidades**:
  * Importación masiva de itemizados desde Excel.
  * Edición manual de cantidades y precios unitarios.
  * Cálculo dinámico de totales de presupuesto por niveles jerárquicos (ordenación natural).
* **Formularios**:
  * *Carga Masiva*: Subida de archivo XLSX con columnas: Item, Descripción, Unidad, Cantidad, Precio Unitario.
  * *Edición de Partida*: Item, descripción, unidad, cantidad presupuestada, precio unitario.
* **Validaciones**:
  * Validación estricta de ordenación natural (ej: 1.1 es padre de 1.1.1).
  * No se admiten ítems duplicados dentro de la misma obra.
* **Flujo Operacional**:
  1. Oficina Técnica sube la plantilla Excel con el itemizado del presupuesto aprobado.
  2. El sistema valida las unidades y calcula el presupuesto total.
  3. Control de Costos bloquea el itemizado contractual para iniciar operaciones.

---

## 4. Módulo: Catálogo de Actividades
* **Objetivo**: Definir las actividades físicas y subactividades globales y específicas por obra, estableciendo sus ponderaciones para control de avance.
* **Funcionalidades**:
  * Creación de actividades (ej. Hormigón) y subactividades asociadas (ej. Enfierradura, Moldaje).
  * Configuración de ponderaciones físicas y de pago (EDP) independientes por subactividad.
  * Agrupación de subactividades bajo agrupadores de Estado de Pago (ej. Grupo "Protocolo").
* **Formularios**:
  * *Formulario Actividad*: Nombre, descripción, unidad de medida, especialidad.
  * *Detalle Subactividades*: Nombre de subactividad, ponderación física, ponderación EDP, grupo EDP.
* **Validaciones**:
  * La suma de ponderaciones físicas de las subactividades de una actividad debe dar exactamente $100\%$.
  * La suma de ponderaciones EDP también debe sumar $100\%$ si aplica control valorizado.
* **Flujo Operacional**:
  1. El Administrador define la actividad a nivel global.
  2. Oficina Técnica puede sobreescribir las ponderaciones para adaptarlas a las particularidades de una obra mediante el maestro local de obra.

---

## 5. Módulo: Cubicaciones (Core Engine)
* **Objetivo**: Registrar las memorias de cálculo detalladas por elemento y ubicación para respaldar las cantidades de obra ejecutadas.
* **Funcionalidades**:
  * Ingreso de elementos constructivos (eje, tramo, ID elemento).
  * Ingreso dinámico de variables paramétricas según la fórmula de la unidad.
  * Motor de cálculo en tiempo real que evalúa fórmulas paramétricas.
  * Filtros de búsqueda jerárquica por obra, especialidad y actividad.
* **Formularios**:
  * *Matriz de Cubicaciones*: Grilla interactiva tipo hoja de cálculo con columnas de información (Itemizado, Elemento, Ubicación, etc.) y campos numéricos para variables ($L, A, H$, etc.).
* **Validaciones**:
  * Los campos Item, Descripción, Elemento y Ubicación son **obligatorios** para guardar.
  * Si se ingresa una variable paramétrica, esta debe ser $\ge 0$.
* **Flujo Operacional**:
  1. El cubicador selecciona la obra y actividad.
  2. Completa los datos físicos de cada elemento y el sistema calcula la cubicación neta (`takeoff`).
  3. Guarda los registros en la base de datos local.

---

## 6. Módulo: Avances Físicos
* **Objetivo**: Registrar en terreno los avances acumulados reales ejecutados en cada elemento de la memoria de cubicaciones.
* **Funcionalidades**:
  * Visualización de la grilla de cubicaciones con columnas dinámicas por subactividad física.
  * Ingreso de avances en cantidades acumuladas físicas reales.
  * Cálculo del porcentaje de avance del elemento.
* **Formularios**:
  * *Ingreso de Avance*: Celdas editables por subactividad dentro de la grilla de cubicaciones.
* **Validaciones**:
  * El avance ingresado no puede superar la cantidad teórica cubicada (`takeoff`) del elemento.
  * No se permiten avances negativos.
* **Flujo Operacional**:
  1. El Supervisor ingresa en terreno las cantidades físicas acumuladas ejecutadas.
  2. El sistema actualiza en tiempo real el porcentaje físico del elemento y de la partida.

---

## 7. Módulo: Estados de Pago (EDP)
* **Objetivo**: Generar los cierres mensuales o quincenales valorizados de avance físico para facturar al mandante.
* **Funcionalidades**:
  * Generación y guardado de "Fotos" históricas de EDP congelando datos.
  * Aplicación estricta de las reglas RN02 (grupos EDP completos) y RN03 (desbloqueo de protocolos).
  * Generación de la planilla e informe de Estado de Pago con desglose de acumulados.
  * Exportación a PDF oficial con firmas y a Excel de soporte.
* **Formularios**:
  * *Control de Cierre EDP*: Selección de periodo y comando de congelamiento.
  * *Carátula de Estado de Pago*: Datos de contrato, firmas, retenciones y multas.
* **Validaciones**:
  * El periodo de EDP debe tener formato `AAAA-MM` (mensual).
  * No se puede guardar un EDP para un periodo que ya esté "Aprobado".
* **Flujo Operacional**:
  1. Oficina Técnica genera la foto del EDP del periodo tras revisar los avances físicos.
  2. El sistema aplica las reglas de cálculo y congela las cantidades EDP.
  3. Se inicia el flujo de firmas internas.

---

## 8. Módulo: Control de Cambios (Obras Adicionales)
* **Objetivo**: Registrar y controlar las desviaciones del presupuesto contractual generadas por aumentos de obra u obras extraordinarias.
* **Funcionalidades**:
  * Registro de la solicitud de obra adicional (Adicional - AD).
  * Historial de revisiones (costo neto, presentado y aprobado).
  * Vinculación del adicional con el itemizado una vez aprobado por el cliente.
* **Formularios**:
  * *Registro Adicional*: Código AD, nombre, descripción, estado.
  * *Ficha de Revisión*: Número de revisión, fecha, costo neto, costo total, observación de presentación.
* **Validaciones**:
  * El código del adicional debe ser único por proyecto.
  * El estado "Aprobado" requiere fecha de acta y número de carta mandante.
* **Flujo Operacional**:
  1. Oficina Técnica crea el adicional con estado "Pendiente".
  2. Se registran las revisiones de presupuestos presentados al cliente.
  3. Al aprobarse, se ingresa el acta de aprobación y el monto final, actualizando el presupuesto contractual.

---

## 9. Módulo: Aprobaciones
* **Objetivo**: Centralizar las solicitudes de validación de Estados de Pago y adicionales, proveyendo flujos de auditoría transparentes.
* **Funcionalidades**:
  * Bandeja de entrada de tareas de aprobación pendientes.
  * Captura de firmas, fechas y comentarios del aprobador.
  * Historial de auditoría de las decisiones tomadas.
* **Formularios**:
  * *Modal de Firma*: Selección de decisión (Aprobar / Rechazar) y cuadro de texto obligatorio para comentarios de auditoría.
* **Validaciones**:
  * El comentario es estrictamente obligatorio para rechazar un registro.
  * Solo los roles con permisos de aprobación en la matriz de seguridad pueden firmar.
* **Flujo Operacional**:
  1. El sistema notifica al Jefe de Proyecto sobre un EDP generado.
  2. El Jefe de Proyecto revisa y aprueba ingresando su comentario.
  3. Pasa a Control de Costos y finalmente a Gerencia para firma comercial.

---

## 10. Módulo: Documentos Adjuntos
* **Objetivo**: Vincular archivos de soporte (planos, fotografías de terreno, certificados de laboratorio, protocolos firmados) a las filas de cubicación individuales.
* **Funcionalidades**:
  * Carga de archivos PDF, imágenes (JPEG, PNG).
  * Compresión automática de imágenes antes de la subida para ahorro de almacenamiento.
  * Descarga directa del archivo adjunto desde la grilla.
* **Formularios**:
  * *Modal Adjuntar*: Selección de tipo de documento (Plano, Foto de Terreno, Protocolo, Certificado) y selector de archivo local.
* **Validaciones**:
  * Tamaño máximo de archivo de 1.5 MB para evitar saturación de la memoria.
* **Flujo Operacional**:
  1. El Supervisor o Cubicador selecciona una celda en la grilla y abre el modal de adjuntos.
  2. Sube el documento de respaldo.
  3. El sistema lo encripta en Base64, lo comprime si es imagen, y lo vincula a la fila.

---

## 11. Módulo: Dashboard Gerencial
* **Objetivo**: Proveer una visualización ejecutiva del avance, costos y estado de aprobación de todos los proyectos de la corporación.
* **Funcionalidades**:
  * KPIs corporativos globales (Proyectos activos, cubicaciones pendientes).
  * Tabla resumen de actividad reciente.
  * Filtro interactivo por obra y periodo.
* **Formularios**:
  * *Filtros de Dashboard*: Selección de proyecto, rango de fechas y especialidad.
* **Validaciones**:
  * Los datos se consumen en modo de solo lectura.
* **Flujo Operacional**:
  1. La Gerencia o Jefes de Proyecto acceden al dashboard.
  2. Visualizan los semáforos de cumplimiento físico y valorizado en tiempo real.

---

## 12. Módulo: Administración
* **Objetivo**: Controlar la configuración global del sistema, roles, permisos de usuario y realizar respaldos de la base de datos.
* **Funcionalidades**:
  * Gestión de usuarios y asignación de roles.
  * Mantenimiento de la matriz de permisos de seguridad por módulo.
  * Funciones de Backup: Exportación de la base de datos completa a JSON e importación de restauración de emergencia.
* **Formularios**:
  * *Formulario de Usuarios*: Nombre, email, rol asignado, estado activo/inactivo.
  * *Respaldo*: Botón de exportación e importación de archivo JSON.
* **Validaciones**:
  * El archivo de importación JSON debe ser validado estructuralmente antes de sobrescribir la base de datos local.
* **Flujo Operacional**:
  1. El Administrador del Sistema da de alta a un nuevo ingeniero en el módulo de usuarios.
  2. Al final de cada mes, realiza una exportación JSON de respaldo de la base de datos de cubicaciones.

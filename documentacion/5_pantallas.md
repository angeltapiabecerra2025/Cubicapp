# Especificación de Pantallas y Diseño UI - CUBICAPP

Este documento detalla las especificaciones de interfaz de usuario (UI), componentes, interacciones y reglas visuales de todas las pantallas identificadas en el prototipo de **CUBICAPP**.

---

## 1. Pantalla: Dashboard Principal
* **Objetivo**: Proveer una vista ejecutiva rápida de la productividad y estados de los proyectos.
* **Filtros**: Selector de Obra / Proyecto.
* **Componentes Visuales**:
  * **Tarjetas KPI**: 3 tarjetas superiores con sombreado suave:
    * *Proyectos Activos* (Valor entero).
    * *Cubicaciones Pendientes* (Valor entero).
    * *Planificaciones del Mes* (Valor entero).
  * **Gráfico / Tabla de Resumen**: Tabla con las últimas 10 actividades registradas indicando: Proyecto, Actividad, Cubicador, Estado (con badge de color) y Fecha.
* **Botones e Interacciones**:
  * Al hacer clic en un proyecto de la lista, redirige a la pantalla de cubicaciones de dicho proyecto.
* **Reglas Visuales**:
  * Badges de estado: "Aprobado" (Verde HSL), "En Revisión" (Amarillo HSL), "En Proceso" (Azul HSL).

---

## 2. Pantalla: Motor de Cubicaciones (Grilla Principal)
* **Objetivo**: Interfaz core para ingresar dimensiones, parámetros, documentos y avances físicos o de EDP de los elementos constructivos.
* **Filtros**: Selector de Proyecto (Obligatorio), Especialidad, Actividad (Obligatorio), y Búsqueda de Itemizado.
* **Componentes Visuales**:
  * **Barra de Acciones**: Botón "Añadir Fila", "Guardar Cambios", "Exportar PDF", "Exportar Excel", "Gestión de Columnas" (reordenamiento).
  * **Tabla Dinámica Interactiva**: Grilla de datos con scroll sincronizado:
    * *Columnas de Información*: Item (Código Partida), Descripción, Elemento (ID Físico), Ubicación (Ejes/Tramos).
    * *Columnas Paramétricas*: Largo, Ancho, Alto, Cantidad (Multiplicador), Valor Manual (Numérico).
    * *Columnas de Avance*: Columnas dinámicas según subactividades activas de la actividad seleccionada.
    * *Columna de Resultados*: Takeoff Total Calculado (Lectura), % Avance, Cantidad Ejecutada.
    * *Columna de Documentos*: Icono de clip para adjuntos.
* **Botones y Acciones**:
  * *Guardar*: Valida y persiste datos en BD. Ejecuta la sincronización unidireccional con el Programa de Planificación.
  * *Clip Adjunto*: Abre modal para cargar planos o fotos.
  * *Drag & Drop de Columnas*: Permite reordenar el orden visual de los campos.
* **Reglas Visuales**:
  * Las celdas con errores de validación (ej. falta ingresar Elemento o Ubicación en una fila que tiene datos paramétricos) se marcan con borde rojo grueso y fondo rojo claro (`cell-error`).

---

## 3. Pantalla: Programa de Obra y Carta Gantt (Planificación)
* **Objetivo**: Importar el cronograma y controlar la Gantt física de ejecución de la obra.
* **Filtros**: Selector de Proyecto (Obligatorio).
* **Componentes Visuales**:
  * **Visualizador Gantt Integrado**: Carta Gantt gráfica con barras de duración, predecesores y porcentaje de avance.
  * **Grilla de Tareas Gantt**: ID de tarea, nombre, fecha de inicio, fecha de término, duración, predecesores y porcentaje de avance.
  * **Botón de Importación Excel**: Para subir archivos de planificación MS Project exportados a XLSX.
* **Acciones**:
  * *Doble clic en tarea*: Abre modal para editar fechas o vincular con la Matriz MC.

---

## 4. Pantalla: Matriz MC (Correlación)
* **Objetivo**: Vincular lógicamente las actividades del Gantt de planificación con las partidas presupuestarias del itemizado.
* **Filtros**: Selector de Proyecto (Obligatorio).
* **Componentes Visuales**:
  * **Barra de Progreso**: Indicador porcentual de correlación completada (ej. "45 / 90 actividades vinculadas").
  * **Tabla de Correlación**:
    * *Lado Izquierdo (Gantt)*: Código de Tarea, Nombre de Actividad del Programa, Rango de Fechas.
    * *Lado Derecho (Presupuesto)*: Selector Dropdown que lista todas las partidas del Itemizado del Proyecto para su selección directa.
* **Acciones**:
  * Cambiar el selector dropdown actualiza inmediatamente la base de datos de mapeo del proyecto.

---

## 5. Pantalla: Cálculo y Liquidación de Estado de Pago (EDP)
* **Objetivo**: Generar la carátula y desglose financiero del Estado de Pago del periodo para envío al cliente.
* **Filtros**: Selector de Proyecto, Contrato y Periodo Comercial (Mes/Año).
* **Componentes Visuales**:
  * **Cabecera Oficial**: Campos editables para nombre del contrato, denominación, N° Pedido SAP, e información del mandante.
  * **Tabla de Desglose Comercial**:
    * Columnas: Item, Glosa (Descripción de partida), Monto Contrato Base, Acumulado a la Fecha ($ y %), Acumulado Anterior, Presente periodo (Monto Neto a cobrar).
  * **Bloque de Totales**: Costo Directo, Costo Indirecto, e Importe Bruto a Cobrar.
  * **Cuadro de Firmas**: Nombre y cargo para Jefe de Contratos, Subgerente de Contratos, Administrador de Obra y Representante Mandante.
  * **Sección Reclamaciones**: Campo de texto amplio para comentarios técnicos o controversias.
* **Acciones**:
  * *Exportar PDF*: Genera el informe formal diagramado listo para firma con saltos de página lógicos.
  * *Guardar Snapshot*: Congela la foto actual del mes y la envía a la bandeja del validador.

---

## 6. Pantalla: Histórico de Estados de Pago
* **Objetivo**: Auditar, revisar y autorizar (aprobar/rechazar) los snapshots históricos de EDP guardados.
* **Filtros**: Selector de Proyecto, Estado (Todos, Pendiente, Aprobado, Rechazado), y Búsqueda por Periodo.
* **Componentes Visuales**:
  * **Tabla Histórica**: Lista de snapshots indicando ID, Proyecto, Actividad, Periodo, Fecha de Registro, Estado (badge de color) y Comentarios de Auditoría.
  * **Visor Detallado (Slide-in)**: Al hacer clic en un registro, se despliega una vista de solo lectura que muestra la grilla de cubicaciones completa tal como estaba congelada en esa fecha, incluyendo las subactividades y avances unitarios.
* **Botones e Interacciones**:
  * *Botón Aprobar / Rechazar*: Abre un modal para ingresar la firma electrónica y la observación de auditoría.
  * *Botón Eliminar*: Remueve el snapshot (deshabilitado si el EDP ya fue aprobado).

---

## 7. Pantalla: Log de Obras Adicionales
* **Objetivo**: Controlar y presupuestar las modificaciones, aumentos o partidas extraordinarias de la obra.
* **Filtros**: Selector de Proyecto (Obligatorio) y Búsqueda de Códigos AD.
* **Componentes Visuales**:
  * **Tabla Maestro de Adicionales**: Muestra Código AD, Nombre, Descripción, Estado de Aprobación, y Monto Aprobado Final.
  * **Formulario Lateral de Ingreso / Detalle**:
    * Campos de Identificación: Código, Título, Justificación Técnica.
    * Grilla de Revisiones: Registra las iteraciones presentadas con campos: N° Revisión, Fecha de Presentación, Costo Neto, Costo Total y Comentario Técnico.
    * Campos de Aprobación Mandante: Fecha de Acta de Aprobación, N° de Carta de Aprobación, Monto Aprobado y Check de Conformidad.
* **Acciones**:
  * *Aprobar inline*: Oficina técnica puede marcar el check de aprobado una vez recibida la resolución del cliente, lo que bloquea la edición del adicional.

---

## 8. Pantalla: BIM (Modelado 3D)
* **Objetivo**: Visualizar y mapear el modelo 3D IFC con las partidas y detectar colisiones de diseño.
* **Componentes Visuales**:
  * **Visor 3D (HTML Canvas)**: Renderiza una malla alámbrica interactiva en 3D de elementos estructurales (vigas, zapatas, pedestales, columnas). Permite rotación mediante arrastre con el mouse y selección por clic de elementos.
  * **Panel de Propiedades**: Al seleccionar un elemento en el canvas, muestra: ID Elemento (IFC GUID), Nombre, Categoría (ej. IfcFooting), Material, Volumen y Partida Vinculada.
  * **Pestaña Mappings**: Tabla de correlación entre los GUIDs del modelo BIM y los códigos del Itemizado presupuestario.
  * **Pestaña Clashes (Detección de Colisiones)**: Listado de colisiones detectadas (ej. Ducto vs Viga) con niveles de severidad (Baja, Media, Alta), estado de resolución y autor.
* **Acciones**:
  * *Rotar*: Drag con botón izquierdo en el canvas.
  * *Seleccionar*: Clic sobre una arista estructural.
  * *Simular Carga de Modelo*: Botón para cargar archivos IFC locales.
  * *Analizar Clashes*: Algoritmo mockup que detecta y despliega colisiones en la pestaña.

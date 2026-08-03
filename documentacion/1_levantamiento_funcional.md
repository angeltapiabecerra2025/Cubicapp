# Levantamiento Funcional - CUBICAPP

Este documento contiene el levantamiento funcional detallado de la plataforma **CUBICAPP**, un sistema corporativo para el control de cubicaciones, avances de obra y generación de estados de pago (EDP) en proyectos de construcción.

---

## 1. Mapa de Macroprocesos y Subprocesos

CUBICAPP organiza sus operaciones en 8 macroprocesos principales. Cada uno abarca diversos subprocesos que aseguran la trazabilidad de la información desde la ingeniería hasta la facturación:

```
[Presupuestación] -> [Planificación/Matriz] -> [Cubicaciones] -> [Control de Avance] -> [Aprobación EDP] -> [Facturación]
       ^                                                                ^
       |                                                                |
[Control de Cambios (Adicionales)]                           [Gestión de Suministros]
```

### M1. Presupuestación e Itemizado de Obra
* **Carga de Estructura de Presupuesto (WBS/Itemizado)**: Importación y mantenimiento de la estructura jerárquica de partidas de obra (ej. 1. Obras Civiles, 1.1. Excavaciones).
* **Mantenimiento de Precios Unitarios**: Definición de los costos unitarios base contractuales por partida.
* **Control de Versiones de Itemizado**: Registro histórico de cambios y modificaciones en la estructura de costos.

### M2. Configuración Técnica y Catálogos (Administración)
* **Gestión de Unidades de Medida**: Definición de unidades de medida (m3, m2, kg) con sus respectivas variables paramétricas y fórmulas matemáticas dinámicas.
* **Catálogo Maestro de Actividades y Subactividades**: Estructuración de los trabajos físicos que componen una partida (ej. Actividad: Hormigón, Subactividades: Excavación, Enfierradura, Hormigonado).
* **Asociación Obra-Actividad**: Configuración de cuáles actividades y unidades aplican a cada proyecto específico.

### M3. Planificación y Correlación (Matriz MC)
* **Carga de Programa de Obra (Gantt)**: Carga e importación del cronograma de tareas del proyecto (ej. desde Excel/Project).
* **Matriz de Correlación (Matriz MC)**: Vinculación directa $1:1$ o $1:N$ entre las actividades del programa Gantt y las partidas presupuestarias (Itemizado de Obra) para habilitar el control de plazos y costos unificado.

### M4. Motor de Cubicaciones (Cubicaciones Core)
* **Ingreso Paramétrico de Cubicaciones**: Registro detallado por elemento y ubicación (eje, tramo) usando parámetros (ej. largo, ancho, alto) vinculados a la fórmula de la unidad de medida.
* **Cubicación Manual**: Opción de anular el cálculo paramétrico para ingresar un valor cúbico directo y justificado.
* **Trazabilidad de Elementos**: Cada fila de cubicación representa un elemento constructivo identificable y localizable.

### M5. Control de Avance Físico
* **Registro de Avances Unitarios**: Ingreso en terreno del avance físico real (en cantidad absoluta) por subactividad para cada elemento cubicado.
* **Cálculo de Progreso Físico**: Determinación automática del porcentaje de avance del elemento basándose en las ponderaciones físicas configuradas para sus subactividades.

### M6. Gestión de Estados de Pago (EDP)
* **Cierre y Generación de Foto EDP**: Congelamiento de los avances del período (mensual/quincenal) por proyecto y actividad para iniciar el proceso de cobro.
* **Cálculo de Avance Valorizado EDP**: Aplicación de la lógica comercial estricta para determinar las cantidades autorizadas para cobro.
* **Conciliación de Acumulados**: Contabilización automática de montos base contratados, acumulado anterior, avance presente y saldo por cobrar.

### M7. Control de Cambios (Obras Adicionales)
* **Registro de Obras Adicionales**: Control de aumentos/disminuciones de obras o partidas extraordinarias no contempladas en el contrato original.
* **Revisiones Lógicas**: Historial de montos presentados vs. montos autorizados por revisión técnica.
* **Incorporación al Presupuesto Activo**: Sincronización del adicional una vez aprobado por el mandante con el itemizado del proyecto.

### M8. Gestión de Suministros y Materiales
* **Solicitudes de Materiales en Obra**: Petición de insumos necesarios para la ejecución física según cubicación teórica.
* **Comparativas de Proveedores**: Tabulación de cotizaciones para seleccionar la oferta más económica basándose en cantidades solicitadas.
* **Trazabilidad de Consumo**: Comparativa entre materiales solicitados/comprados vs. cubicados teóricamente.

---

## 2. Usuarios, Roles y Matriz de Responsabilidades (RACI)

El sistema soporta una estructura de 8 roles definidos. A continuación se presenta la matriz de responsabilidades RACI para los procesos clave:

| Proceso / Subproceso | Administrador | Gerencia | Jefe de Proyecto | Oficina Técnica | Control de Costos | Adm. Contrato | Supervisor | Consulta |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Configurar Unidades y Fórmulas** | **A** | - | - | **R** | - | - | - | - |
| **Cargar/Modificar Presupuestos** | - | **A** | **C** | **R** | **C** | - | - | - |
| **Ingreso de Cubicaciones** | - | - | - | **R** / **A** | - | - | - | - |
| **Ingreso de Avance en Terreno** | - | - | - | **C** | - | - | **R** / **A** | - |
| **Generación de Estado de Pago (EDP)** | - | - | - | **R** / **A** | **C** | - | - | - |
| **Aprobación Interna de EDP** | - | **A** | **R** | **C** | **R** | **C** | - | - |
| **Aprobación de Obras Adicionales**| - | **A** | **R** | **C** | **R** | **R** | - | - |
| **Visualización de Dashboards** | - | **I** | **I** | **I** | **I** | **I** | - | **I** |

* **R (Responsible)**: Quién ejecuta la tarea.
* **A (Accountable)**: Quién toma la decisión final y responde por la tarea.
* **C (Consulted)**: A quién se le consulta información técnica o financiera.
* **I (Informed)**: Quién es notificado sobre el resultado de la tarea.

---

## 3. Reglas de Negocio Críticas

### RN01: Evaluación Dinámica de Cubicaciones
El volumen o cantidad de un elemento constructivo ($Q$) se calcula obligatoriamente mediante la fórmula asociada a su Unidad de Medida ($U$).
$$\text{Base} = \begin{cases} 
\text{Evaluar}(U.\text{formula}, \text{params}) & \text{si existe fórmula y parámetros válidos} \\
\prod \text{params} & \text{si existen parámetros pero no fórmula} \\
1 & \text{en cualquier otro caso}
\end{cases}$$
$$Q = (\text{Valor Manual} > 0 \ ? \ \text{Valor Manual} : \text{Base}) \times \text{Cantidad}$$

### RN02: Regla Estricta para Avance de Grupos EDP
Las subactividades de una actividad se agrupan en base a su campo `grupoEDP` (o su nombre si está vacío). Para los grupos **que no contengan la palabra "protocolo"** en su nombre, el avance EDP solo se desbloqueará si **todas** las subactividades de ese grupo tienen un avance físico registrado mayor a $0$ en la cubicación.
* Si $\forall s \in G, P_s^{phys} > 0$:
  $$\text{Cantidad Ejecutada EDP} = \text{Promedio}(P_s^{phys}) \times \frac{w_G^{EDP}}{100}$$
* Si $\exists s \in G$ tal que $P_s^{phys} = 0$:
  $$\text{Cantidad Ejecutada EDP} = 0$$

### RN03: Desbloqueo de Protocolos de Calidad
Los grupos de subactividades que contengan la palabra **"protocolo"** (ej. "Protocolo de Recepción Hormigón") representan hitos de calidad o firmas de conformidad. El avance EDP de este grupo está estrictamente bloqueado en $0$ hasta que el avance físico base (excluyendo los protocolos) del elemento constructivo sea igual o superior al **99.9%**.
* Si $\text{Avance Físico Base} \ge 99.9\%$:
  $$\text{Cantidad Ejecutada EDP} = \text{Cantidad de Protocolo Ingresada} \times \frac{w_G^{EDP}}{100}$$
* Si $\text{Avance Físico Base} < 99.9\%$:
  $$\text{Cantidad Ejecutada EDP} = 0$$

### RN04: Sincronización Unidireccional de Cubicaciones
El maestro de cubicaciones (`cubicaciones_data`) alimenta en tiempo real a la vista de planificación (`cubprograma_data`). La vista de planificación es de **solo lectura** respecto a dimensiones y ubicaciones de elementos, pero permite mapear e inyectar fechas estimadas de ejecución e hitos de carta Gantt.

### RN05: Limitador Físico de Avance
Ninguna subactividad puede registrar un avance físico acumulado superior a la cantidad cubicada final del elemento correspondiente. El sistema debe recortar dinámicamente cualquier ingreso superior al valor límite superior (`takeoff`).

---

## 4. Indicadores Clave de Rendimiento (KPIs) y Reportes

### Indicadores (KPIs):
1. **Avance Físico Acumulado (%)**: Porcentaje ponderado de avance real ejecutado de la obra civil.
2. **Avance Valorizado EDP (%)**: Porcentaje financiero acumulado aprobado para facturación.
3. **Desviación de Costo (Variance)**: Comparativa entre el monto programado contractual vs. el monto realmente cubicado y ejecutado.
4. **Monto EDP del Periodo ($)**: Suma de la valorización neta de los avances generados en el mes en curso.
5. **Estado de Aprobación de EDP**: Semáforo del flujo de firmas del Estado de Pago (Generado, En Revisión, Aprobado Control de Costos, Aprobado Mandante).

### Reportes del Sistema:
* **Estado de Pago Oficial**: Documento formal descargable en PDF que desglosa el costo directo contratado, costos indirectos (gastos generales, utilidades), reajustes contractuales, retenciones de garantía, devoluciones de anticipo y el neto a pagar.
* **Planilla Detalle de Cubicaciones**: Exportación en formato Excel (XLSX) con la memoria de cálculo de todas las partidas, ejes, tramos y parámetros físicos para auditoría del inspector técnico.
* **Curva S de Avances**: Gráfico comparativo que muestra la curva acumulada planificada de avances vs. la curva real física ejecutada en el tiempo.
* **Bitácora de Adicionales**: Reporte consolidado de todas las solicitudes de obras extraordinarias indicando estado, monto solicitado, monto aprobado y fecha de resolución.

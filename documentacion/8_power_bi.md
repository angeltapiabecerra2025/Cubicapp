# Diseño de Tablero en Power BI - CUBICAPP

Este documento especifica el diseño lógico y técnico del **Dashboard Ejecutivo de CUBICAPP** en Power BI para el control y análisis financiero de los proyectos de construcción a nivel corporativo.

---

## 1. Indicadores Clave de Rendimiento (KPIs) y Fórmulas DAX

El tablero consume datos directamente de las tablas relacionales de la base de datos empresarial. A continuación, se detallan las métricas clave y sus fórmulas escritas en **DAX (Data Analysis Expressions)**:

### 1.1. Avance Físico Real (%)
Representa el porcentaje físico de ejecución acumulado de la obra civil.
```dax
AvanceFisicoReal = 
DIVIDE(
    SUMX(avances_fisicos, avances_fisicos[cantidad_ejecutada] * RELATED(subactividades[porcentaje_fisico]) / 100),
    SUM(cubicaciones[takeoff_calculado]),
    0
)
```

### 1.2. Avance Valorizado EDP (%)
Porcentaje del presupuesto contractual autorizado y aprobado comercialmente para facturación acumulado a la fecha.
```dax
AvanceValorizadoEDP = 
DIVIDE(
    SUM(historico_edp_detalles[avance_edp_qty]),
    SUM(partidas[cantidad]),
    0
)
```

### 1.3. Cubicación Acumulada Real (Cantidad)
La cantidad absoluta de obra civil ejecutada y respaldada en terreno en el periodo o acumulada.
```dax
CantidadEjecutadaAcumulada = 
SUMX(
    avances_fisicos, 
    avances_fisicos[cantidad_ejecutada] * RELATED(subactividades[porcentaje_fisico]) / 100
)
```

### 1.4. Monto Facturado / Valorizado EDP ($)
Valor monetario neto a cobrar en los Estados de Pago acumulados.
```dax
MontoValorizadoEDP = 
SUMX(
    historico_edp_detalles, 
    historico_edp_detalles[avance_edp_qty] * RELATED(partidas[precio_unitario])
)
```

### 1.5. Desviación de Presupuesto (Cubicación vs. Contrato)
Mapea la diferencia porcentual entre el presupuesto teórico cubicado y el contractual inicial para detectar errores de cuantificación.
```dax
DesviacionPresupuesto = 
DIVIDE(
    SUMX(cubicaciones, cubicaciones[takeoff_calculado] * RELATED(partidas[precio_unitario])) - SUM(partidas[monto_total]),
    SUM(partidas[monto_total]),
    0
)
```

### 1.6. Productividad (Rendimiento Físico)
Rendimiento promedio de avance físico del proyecto por mes de trabajo.
```dax
RendimientoFisicoMensual = 
AVERAGEX(
    VALUES(Calendar[MonthYear]),
    [AvanceFisicoReal]
)
```

---

## 2. Estructura y Distribución del Tablero (Wireframe Lógico)

El dashboard corporativo se estructura en una página principal de alta densidad visual con scroll vertical, organizada en 4 cuadrantes lógicos:

```
+---------------------------------------------------------------------------------+
|  FILTROS DE OBRA: [Proyecto v]  [Periodo v]  [Especialidad v]                  |
+---------------------------------------------------------------------------------+
| [ Tarjeta KPI ]     [ Tarjeta KPI ]     [ Tarjeta KPI ]     [ Tarjeta KPI ]     |
| Avance Físico %     Avance Valorizado   Monto EDP Periodo   Desviación Costo    |
|     (42.3%)             (38.1%)             ($153.5M)           (+2.4%)         |
+---------------------------------------------------------------------------------+
| [ Gráfico 1: Curva S de Avance ]         | [ Gráfico 2: Ranking de Obras ]      |
| Curva planificada acumulada (Gantt)      | Comparativo de avance físico real    |
| vs. Curva real ejecutada (Cubicaciones)  | de todas las obras activas           |
| en el tiempo.                            |                                      |
+---------------------------------------------------------------------------------+
| [ Gráfico 3: Matriz de Desviaciones ]    | [ Tabla 4: Semáforo de EDPs ]        |
| Partidas con mayor sobrecubicación       | Listado de periodos con estados de   |
| (Monto cubicado vs. Contratado).         | aprobación y días en bandeja.        |
+---------------------------------------------------------------------------------+
```

---

## 3. Especificación de Visualizaciones y Semáforos

### 3.1. Tarjetas KPI Superiores
* **Visualización**: Tarjetas de múltiples filas (Multi-row KPI Cards).
* **Métricas**: `[AvanceFisicoReal]`, `[AvanceValorizadoEDP]`, `[MontoValorizadoEDP]`, `[DesviacionPresupuesto]`.
* **Semáforo Visual**:
  * Si `[DesviacionPresupuesto] > 5%` $\rightarrow$ Color Rojo (Alerta de sobrecubicación crítica).
  * Si `[DesviacionPresupuesto] < -5%` $\rightarrow$ Color Amarillo (Subcubicación de partida).
  * Si está entre $-5\%$ y $+5\%$ $\rightarrow$ Verde (Rango tolerable de control).

### 3.2. Curvas S Comparativas
* **Visualización**: Gráfico de líneas y columnas agrupadas (Line and Stacked Column Chart).
* **Eje X**: Fecha (Calendar[Date]).
* **Valores de Columnas**: Cantidad neta ejecutada por mes (`[CantidadEjecutadaAcumulada]`).
* **Valores de Líneas**: `[AvanceFisicoReal]` acumulado vs. Avance Planificado acumulado (proveniente de la carta Gantt).

### 3.3. Ranking de Obras
* **Visualización**: Gráfico de barras horizontales (Clustered Bar Chart).
* **Métrica**: Avance físico real agrupado por `proyectos[nombre]`.
* **Uso**: Permite a la Gerencia comparar la productividad relativa de todos los frentes de obra de la empresa en una sola pantalla.

### 3.4. Matriz de Desviaciones por Partida
* **Visualización**: Gráfico de cascada (Waterfall Chart) o Matriz Jerárquica.
* **Uso**: Mapear cuáles partidas presupuestarias del itemizado están absorbiendo la mayor cantidad de recursos adicionales o sobrecubicaciones por sobre el contrato original.

### 3.5. Tabla Semáforo de Estados de Aprobación
* **Visualización**: Grilla (Table) con formato condicional.
* **Campos**: Proyecto, Periodo, Estado de Pago Neto, Estado de Aprobación, Fecha de Captura, Días en Bandeja.
* **Formato Condicional**:
  * Estado = "Aprobado": Fondo Verde Suave.
  * Estado = "Pendiente": Fondo Naranja Suave.
  * Estado = "Rechazado": Fondo Rojo Suave.

# Casos de Uso y Roadmap de Implementación - CUBICAPP

Este documento recopila los Casos de Uso de negocio estructurados y el Roadmap técnico sugerido para la reconstrucción e implementación a gran escala de **CUBICAPP**.

---

## 1. Casos de Uso del Negocio (Casos de Uso Estructurados)

### 1.1. Caso de Uso 1: Ingreso de Cubicaciones y Memoria de Cálculo (UC-01)
* **Actor Principal**: Oficina Técnica (Cubicador).
* **Precondiciones**: El proyecto debe estar activo, el itemizado cargado, y la actividad/unidad asociada configurada en el proyecto.
* **Flujo Principal**:
  1. El Cubicador selecciona el Proyecto y la Actividad desde los paneles superiores.
  2. El sistema despliega la grilla vacía de cubicaciones y las variables paramétricas de la unidad.
  3. El Cubicador ingresa el código del Ítem, el Elemento, la Ubicación y los valores de las variables ($L, A, H$, etc.).
  4. El sistema ejecuta el cálculo dinámico en tiempo real aplicando la RN01 e inyecta la cantidad en `takeoff_calculado`.
  5. El Cubicador hace clic en "Guardar Cambios".
  6. El sistema valida los campos obligatorios, persiste las filas en `cubicaciones` y sincroniza unidireccionalmente la información con la vista de planificación.
* **Flujo Alternativo (Ingreso Manual)**:
  * En el paso 3, si el Cubicador ingresa un valor en "Valor Manual", el sistema anula el cálculo por parámetros de la fórmula y utiliza el valor manual como base de cálculo del volumen del elemento.
* **Postcondición**: Las memorias de cálculo quedan guardadas y preparadas para el control de avance físico.

### 1.2. Caso de Uso 2: Registro de Avances Físicos en Terreno (UC-02)
* **Actor Principal**: Supervisor de Obra.
* **Precondiciones**: Memoria de cubicación de los elementos cargada y guardada.
* **Flujo Principal**:
  1. El Supervisor de Obra ingresa al módulo de avances desde su tableta o teléfono móvil en terreno.
  2. Selecciona Proyecto, Especialidad y la Actividad a auditar.
  3. El sistema muestra la grilla interactiva con las columnas correspondientes a las subactividades de la actividad seleccionada.
  4. El Supervisor digita la cantidad física acumulada ejecutada a la fecha para cada subactividad en las celdas de las filas correspondientes.
  5. El sistema actualiza en tiempo real el porcentaje físico del elemento y recalcula la cantidad equivalente ejecutada.
  6. El Supervisor presiona "Guardar".
* **Excepciones**:
  * Si el Supervisor ingresa una cantidad superior al `takeoff_calculado` del elemento, el sistema restringe el guardado, emite una alerta visual y ajusta la cifra al valor límite superior permitido.
* **Postcondición**: Avance físico actualizado en terreno, visible de inmediato para planificación y control de costos.

### 1.3. Caso de Uso 3: Liquidación, Cierre y Aprobación de Estado de Pago (UC-03)
* **Actores**: Oficina Técnica (Generador), Control de Costos (Validador), Jefe de Proyecto (Aprobador), Gerencia (Firmante).
* **Precondiciones**: Avances físicos consolidados al término del mes comercial.
* **Flujo Principal**:
  1. Oficina Técnica selecciona el periodo comercial, ejecuta el comando "Guardar EDP" y el sistema congela la foto del mes en `historico_edp` y `historico_edp_detalles` aplicando las reglas de cobro de subactividades (RN02 y RN03).
  2. Se gatilla el flujo de Power Automate Approval enviando alerta a Control de Costos.
  3. Control de Costos audita la grilla detallada desde el Visor de Snapshots. Aprueba ingresando sus observaciones técnicas.
  4. Jefe de Proyecto recibe la tarea, valida los costos generales y aprueba la solicitud.
  5. Gerencia aprueba finalmente la transacción comercial.
  6. El sistema cambia el estado del EDP a "Aprobado", genera y archiva el reporte PDF en SharePoint y gatilla el payload contable hacia el ERP SAP.
* **Flujo de Rechazo**:
  * En cualquier paso (3, 4 o 5), si un validador rechaza, ingresa obligatoriamente el motivo. El flujo se detiene, el estado cambia a "Rechazado" y el cubicador es notificado para realizar correcciones.
* **Postcondición**: Estado de Pago visado comercialmente, listo para su facturación contable y cobro al mandante.

---

## 2. Roadmap de Implementación Sugerido (Fases y Estimaciones)

El plan de trabajo propuesto para la reconstrucción de la aplicación a nivel corporativo se desglosa en 4 fases secuenciales:

```
[ Fase 1: Base de Datos y Backend ]  --> 4 Semanas
                 |
                 v
[ Fase 2: Front y Core de Grilla ]    --> 5 Semanas
                 |
                 v
[ Fase 3: Power Platform & BI ]       --> 4 Semanas
                 |
                 v
[ Fase 4: Integraciones & Pruebas ]   --> 3 Semanas
```

### Fase 1: Cimientos de Datos y Backend (Semanas 1 a 4)
* **Hito 1.1**: Despliegue de la base de datos relacional (PostgreSQL/SQL Server) e inyección de datos semilla (unidades, roles, especialidades).
* **Hito 1.2**: Implementación de la API Node.js con Express, ORM de comunicación (Sequelize) y middleware de control de acceso `verificarPermiso`.
* **Esfuerzo Estimado**: 4 Semanas.

### Fase 2: Front-End y Grilla Interactiva (Semanas 5 a 9)
* **Hito 2.1**: Estructura de navegación SPA (React + Vite) con layouts responsivos, barra lateral de accesos y diseño corporativo premium.
* **Hito 2.2**: Desarrollo de la Grilla Core de Cubicaciones con soporte de scroll bidireccional sincronizado y motor dinámico de resolución de fórmulas.
* **Hito 2.3**: Módulo de importación Excel (SheetJS) y adjuntos Base64 con compresión de imágenes móvil.
* **Esfuerzo Estimado**: 5 Semanas.

### Fase 3: Flujos de Automatización y BI (Semanas 10 a 13)
* **Hito 3.1**: Configuración de los flujos de Power Automate Approvals para el control de firmas secuenciales y cierres de mes automáticos.
* **Hito 3.2**: Modelado de datos en Power BI Desktop, escritura de medidas DAX para curvas S, y publicación de tableros ejecutivos.
* **Esfuerzo Estimado**: 4 Semanas.

### Fase 4: Integración SAP, Pruebas y Despliegue (Semanas 14 a 16)
* **Hito 4.1**: Conexión de Gateways seguros de API hacia SAP contable y SharePoint Online para archivo inmutable.
* **Hito 4.2**: Pruebas de aceptación de usuario (UAT) y auditorías de seguridad en terreno.
* **Hito 4.3**: Lanzamiento a producción (Go-Live).
* **Esfuerzo Estimado**: 3 Semanas.

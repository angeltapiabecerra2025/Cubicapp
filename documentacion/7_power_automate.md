# Especificación de Flujos de Power Automate - CUBICAPP

Este documento especifica los flujos de trabajo de automatización diseñados en **Power Automate** para agilizar los procesos de comunicación, recordatorios, aprobaciones e integración de datos en **CUBICAPP**.

---

## 1. Flujo: Creación de Cubicaciones y Notificación de Inicio
* **Objetivo**: Notificar a los supervisores de terreno y al equipo de planificación cuando Oficina Técnica da de alta una nueva memoria de cubicaciones de una actividad para comenzar el control de avances.
* **Trigger (Disparador)**: *Dataverse / SQL Server* - Cuando se inserta un nuevo registro en la tabla `cubicaciones`.
* **Pasos y Acciones**:
  1. Obtener los detalles de la obra, partida y actividad asociada.
  2. Obtener el listado de personal asignado al proyecto con el rol "Supervisor".
  3. Enviar una notificación por correo electrónico de Microsoft Outlook y un mensaje de tarjeta adaptable (Adaptive Card) en Microsoft Teams a los supervisores.
* **Condiciones**:
  * Solo se ejecuta si la cantidad cubicada (`takeoff_calculado`) es superior a $0$.
* **Resultado**: Supervisores notificados en tiempo real con enlace directo a la grilla de cubicaciones para registrar avances.

---

## 2. Flujo: Solicitud de Aprobación de Estado de Pago (EDP)
* **Objetivo**: Gestionar el flujo secuencial de firmas y validaciones internas de un Estado de Pago mensual generado.
* **Trigger**: *Dataverse* - Cuando se crea un registro en `historico_edp` con el estado "Pendiente".
* **Pasos y Acciones**:
  1. **Paso 1: Validación Técnica (Control de Costos)**: Enviar solicitud de aprobación de Power Automate Approval al rol Control de Costos asignado a la obra.
  2. **Paso 2: Aprobación de Proyecto (Jefe de Proyecto)**: Si aprueba Control de Costos, enviar aprobación al Jefe de Proyecto (PM).
  3. **Paso 3: Validación Legal (Adm. de Contrato)**: Si aprueba PM, enviar aprobación al Administrador de Contrato.
  4. **Paso 4: Firma Comercial (Gerencia)**: Si aprueba Adm. de Contrato, enviar solicitud final a la Gerencia.
* **Condiciones**:
  * Si en cualquiera de los pasos el aprobador rechaza, se interrumpe el flujo y se ejecuta el subflujo de Rechazo.
* **Resultado**: Estado del registro en `historico_edp` se actualiza al final del flujo a "Aprobado", registrando firmas y comentarios de auditoría.

---

## 3. Flujo: Procesamiento de Rechazo de EDP
* **Objetivo**: Gestionar las acciones del sistema cuando un Estado de Pago es rechazado en cualquier etapa del flujo.
* **Trigger**: Acción "Rechazar" en el flujo de Solicitud de Aprobación.
* **Pasos y Acciones**:
  1. Obtener la observación o justificación obligatoria ingresada en el modal de rechazo de Power Automate Approvals.
  2. Actualizar el estado del registro `historico_edp` a "Rechazado" en la base de datos, guardando la fecha y la observación en `comentario_auditoria`.
  3. Enviar correo electrónico de alerta a Oficina Técnica adjuntando el motivo del rechazo.
  4. Reactivar la edición del periodo de cubicaciones para que el cubicador corrija las desviaciones indicadas.
* **Condiciones**: Ninguna (ejecución mandatoria al rechazar).
* **Resultado**: Registro histórico actualizado, cubicador notificado y edición de grilla desbloqueada.

---

## 4. Flujo: Procesamiento de Aprobación Final e Integración ERP
* **Objetivo**: Registrar la aprobación final y sincronizar el Estado de Pago con el sistema ERP corporativo (ej. SAP).
* **Trigger**: Aprobación exitosa por parte del rol Gerencia en el flujo de Solicitud de Aprobación.
* **Pasos y Acciones**:
  1. Actualizar el estado de `historico_edp` a "Aprobado" y guardar la firma comercial.
  2. Invocar la API del Gateway ERP corporativo pasando el JSON del EDP (montos, partidas, SAP PO) para crear el borrador de pre-factura.
  3. Enviar un correo de confirmación al mandante adjuntando el documento PDF oficial firmado digitalmente.
* **Condiciones**: Ninguna.
* **Resultado**: Integración automática de facturación y mandante notificado.

---

## 5. Flujo: Generación Automática de Documentación de Respaldo EDP
* **Objetivo**: Generar, consolidar y archivar los respaldos en PDF del Estado de Pago y su memoria de cubicaciones detallada en SharePoint.
* **Trigger**: *Dataverse* - Cuando el estado de `historico_edp` cambia a "Aprobado".
* **Pasos y Acciones**:
  1. Invocar un servicio de conversión (ej. Muhimbi o conversión nativa Word-to-PDF de OneDrive) usando una plantilla HTML del Estado de Pago.
  2. Generar una planilla Excel conteniendo la memoria de cálculo de cubicaciones del periodo.
  3. Guardar ambos archivos en la carpeta de SharePoint del proyecto (`Proyectos/Nombre_Obra/EDP/Periodo/`).
  4. Adjuntar ambos archivos al correo electrónico enviado al cliente/mandante.
* **Condiciones**: Ninguna.
* **Resultado**: Archivo digital histórico inmutable del proyecto actualizado en SharePoint.

---

## 6. Flujo: Alerta de Desviación de Costo / Cubicaciones Excedidas
* **Objetivo**: Detectar desviaciones críticas cuando la cubicación total real de una partida supera el presupuesto contractual base.
* **Trigger**: *Dataverse* - Al actualizarse la columna `takeoff_calculado` en la tabla `cubicaciones`.
* **Pasos y Acciones**:
  1. Calcular la sumatoria de `takeoff_calculado` de todas las cubicaciones asociadas a la partida (`partidas.id`).
  2. Comparar este acumulado con la cantidad contractual presupuestada (`partidas.cantidad`).
  3. Si la sumatoria supera a la cantidad presupuestada contractual, activar alerta.
  4. Enviar correo de advertencia con prioridad alta a Control de Costos y al Jefe de Proyecto indicando la desviación.
* **Condiciones**:
  * Condición lógica:
    $$\sum \text{takeoff\_calculado} > \text{partidas.cantidad}$$
* **Resultado**: Detección temprana de sobrecostos o errores de diseño de ingeniería antes de la ejecución física.

---

## 7. Flujo: Recordatorio Diario de Firmas Pendientes
* **Objetivo**: Recordar a los aprobadores que poseen tareas pendientes de firma en su bandeja para evitar retrasos en el ciclo de cobros.
* **Trigger**: *Programación de Cron* - Todos los días hábiles a las 09:00 AM (0 9 * * 1-5).
* **Pasos y Acciones**:
  1. Consultar en la tabla `historico_edp` todos los registros con estado "Pendiente" creados hace más de 48 horas.
  2. Identificar el aprobador responsable en la cola de aprobación activa de Power Automate Approvals.
  3. Enviar recordatorio por Outlook y Teams con un enlace directo a la pantalla de Aprobaciones.
* **Condiciones**:
  * Solo se ejecuta si existen registros pendientes en la consulta.
* **Resultado**: Aprobaciones pendientes agilizadas automáticamente.

---

## 8. Flujo: Tarea Automatizada de Cierre Mensual
* **Objetivo**: Ejecutar el corte contable de obra al final de cada mes de manera automática.
* **Trigger**: *Programación de Cron* - El último día de cada mes a las 23:59 PM (59 23 L * *).
* **Pasos y Acciones**:
  1. Obtener la lista de proyectos activos de la constructora.
  2. Para cada proyecto, compilar el avance físico registrado a la fecha.
  3. Crear automáticamente un borrador de Estado de Pago con estado "Pendiente" para el periodo correspondiente (`AAAA-MM`).
  4. Bloquear el registro de nuevos avances para ese mes transcurrido.
* **Condiciones**: Ninguna.
* **Resultado**: Cierre operativo y contable consistente en toda la corporación.

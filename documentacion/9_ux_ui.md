# Guía de Diseño UX/UI - CUBICAPP

Este documento especifica la guía de diseño de Experiencia de Usuario (UX) e Interfaz de Usuario (UI) para **CUBICAPP**, asegurando una aplicación corporativa moderna, premium, intuitiva y optimizada para su uso tanto en oficinas centrales como en frentes de obra en terreno.

---

## 1. Identidad Visual y Paleta de Colores

CUBICAPP utiliza una paleta de colores corporativa basada en tonos industriales, con acentos de alto contraste para llamar la atención en terrenos de alta luminosidad o pantallas de dispositivos móviles bajo el sol.

### 1.1. Colores Corporativos (Esquema HSL/HEX)
* **Color Primario (Rojo Corporativo)**: `#DC2626` (Rojo de alto impacto para botones primarios, marcas y elementos destacados).
* **Color Primario Hover (Rojo Oscuro)**: `#B91C1C`
* **Color Secundario (Azul Acero)**: `#1E293B` (Tono oscuro para la barra lateral y menús de navegación superior).
* **Colores de Superficie y Fondo**:
  * Fondo de Aplicación: `#F8FAFC` (Gris azulado extremadamente suave para reducir el cansancio visual).
  * Fondo de Tarjetas y Grillas: `#FFFFFF` (Blanco inmaculado con bordes suaves para estructurar el contenido).
* **Colores de Estado (Feedback)**:
  * Éxito (Aprobados): `#10B981` (Esmeralda) / Fondo `#ECFDF5`
  * Advertencia (Pendientes / Revisiones): `#F59E0B` (Ámbar) / Fondo `#FEF3C7`
  * Peligro / Alertas (Rechazados / Errores): `#EF4444` (Rojo Alerta) / Fondo `#FEF2F2`

---

## 2. Tipografía y Estilo Visual

### 2.1. Fuentes Corporativas
* **Fuente Principal**: **Inter** (Google Fonts). Diseñada específicamente para interfaces de usuario y pantallas de computadoras, asegurando legibilidad en tablas densas de números.
* **Fuente Secundaria (Encabezados)**: **Outfit** o **Inter Bold**.
* **Fuente de Códigos / Monedas / Fórmulas**: **Fira Code** o Courier New (fuentes monoespaciadas para alinear verticalmente cifras decimales y fórmulas matemáticas complejas).

### 2.2. Elementos de Interfaz (Tokens Visuales)
* **Bordes Redondeados (Border Radius)**:
  * Tarjetas y Contenedores: `16px` (`rounded-2xl`).
  * Botones y Controles de Formulario: `8px` a `10px` (`rounded-lg`).
* **Sombras (Box Shadows)**:
  * Tarjetas y Paneles: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)` (Sombra ligera y moderna para crear un efecto tridimensional "flat").

---

## 3. Layout Responsivo y Usabilidad en Terreno

La interfaz está diseñada bajo un paradigma híbrido de layouts:

### 3.1. Uso en Oficina (Desktop / Pantallas Grandes)
* **Densidad de Información**: Alta. El personal de Oficina Técnica requiere grillas masivas tipo hoja de cálculo (Excel) en pantallas de resolución Full HD o superior.
* **Navegación**: Menú de barra lateral izquierda colapsable para maximizar el área de la grilla de cubicaciones.
* **Interacciones**: Soporte completo para atajos de teclado y clics rápidos para entrada de datos paramétricos.

### 3.2. Uso en Terreno (Móvil / Tabletas)
* **Diseño adaptativo**: La grilla colapsa en tarjetas compactas individuales por elemento en pantallas de menos de `768px`.
* **Área de Clic**: Elementos interactivos con un tamaño mínimo de `44px x 44px` (según las guías de accesibilidad móvil) para permitir la entrada de datos con dedos sucios o usando guantes de seguridad.
* **Contraste de Pantalla**: Uso de tipografías pesadas (Bold/Black) y bordes definidos de `1px` en `#CBD5E1` en celdas de avance para evitar confusiones visuales bajo la luz del sol en la obra.
* **Adjunto Rápido**: Acceso directo con un solo toque a la cámara del dispositivo móvil para capturar y comprimir instantáneamente fotografías de terreno vinculadas al elemento cubicado.

---

## 4. Estándar de Micro-interacciones y Efectos Modernos

* **Glassmorphism en Modales**: Fondo desenfocado (`backdrop-blur-md`) con un modal de color blanco semitransparente (`bg-white/80`) para crear jerarquía y enfoque visual en flujos de confirmación y subida de archivos.
* **Transiciones de Estado**: Todos los botones y celdas interactivas poseen transiciones de color de `200ms` con curva de aceleración `ease-in-out` (`transition-all duration-200`).
* **Estados Hover**: Elevación visual sutil (`hover:-translate-y-0.5 hover:shadow-lg`) en las tarjetas del dashboard corporativo para invitar a la interacción.

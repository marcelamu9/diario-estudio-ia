# Tareas — mapa de calor

Ordenadas por dependencia. Cada tarea está acotada a unos 20–30 minutos. En las tareas de lógica, escribir las pruebas antes del código y no avanzar si `node --test` falla.

- [x] **T1. Período local de 12 semanas.** Crear las pruebas y la función pura `getHeatMapPeriod(today)` para 84 fechas agrupadas de lunes a domingo, con días futuros marcados. **RF-1 (CA-1.1, CA-1.2, CA-1.3).**
  - **Hecho cuando:** `node --test` pasa con casos de lunes, domingo, cambio de mes/año, año bisiesto y cambio de horario; el resultado tiene 12 grupos de 7 fechas y no lee el reloj.

- [x] **T2. Sesiones válidas y suma diaria.** Probar e implementar `sumMinutesByDay(sessions, today)` sobre el período de T1: varias sesiones por fecha, exclusión de fechas fuera de rango o futuras, entradas inválidas y colección ilegible. **RF-2 (CA-2.1, CA-2.2), RF-5 (CA-5.1, CA-5.2, CA-5.3).**
  - **Hecho cuando:** `node --test` distingue colección vacía de ilegible, ignora registros no utilizables, suma los válidos y demuestra que los datos recibidos permanecen intactos.

- [x] **T3. Totales decimales y niveles fijos.** Probar e implementar la normalización del total y `classifyHeatMapDay(date, minutes, today)`. **RF-3 (CA-3.1, CA-3.2, CA-3.4).**
  - **Hecho cuando:** `node --test` cubre 0, 29,999, 30, 60, 120, 0,1 + 0,2 y un día futuro; el total comunicable concuerda con el nivel sin decimales espurios.

- [x] **T4. Resultado puro completo.** Probar e implementar `buildHeatMap(sessions, today)` a partir de T1–T3, con semanas, fecha, total, nivel y estado futuro o indisponible. **RF-1, RF-2, RF-3, RF-5.**
  - **Hecho cuando:** `node --test` pasa para un mapa vacío, uno mixto y datos ilegibles; las 84 casillas quedan en orden, sin mutar la entrada ni acceder a DOM o almacenamiento.

- [x] **T5. Lectura segura de sesiones.** Adaptar la lectura de datos de la interfaz para diferenciar ausencia/colección vacía de datos ilegibles; impedir que guardar una sesión sobrescriba datos ilegibles. **RF-5 (CA-5.1, CA-5.3).**
  - **Hecho cuando:** en Chrome con `file://`, los datos válidos existentes siguen disponibles y un valor ilegible no se sustituye al intentar guardar; `node --test` permanece verde.

- [x] **T6. Estructura y pintado básico.** Añadir la sección del mapa y su leyenda; cargar la lógica sin servidor y pintar 12 columnas a partir del resultado puro, o un aviso si está indisponible. **RF-1 (CA-1.1–CA-1.3), RF-3 (CA-3.2, CA-3.3), RF-5 (CA-5.2, CA-5.3).**
  - **Hecho cuando:** al abrir `index.html` con doble clic se ven 84 días en orden o el aviso de indisponibilidad, nunca ceros que oculten un fallo de lectura; la escala explica todos los niveles.

- [x] **T7. Aspecto responsive y accesible.** Estilizar niveles, futuro, cero, leyenda y foco con la paleta existente; ajustar el mapa a móvil. **RF-1 (CA-1.4), RF-3 (CA-3.2, CA-3.3), RF-4 (CA-4.3).**
  - **Hecho cuando:** en Chrome a 375 px se ven las 12 semanas sin desbordamiento horizontal de página; a menor anchura solo se desplaza el mapa y cada estado/foco se distingue también sin depender del color.

- [x] **T8. Consulta con puntero y teclado.** Mostrar fecha y minutos, o estado futuro, en un detalle reutilizable; abrir con hover/foco y cerrar al salir o con Escape. **RF-4 (CA-4.1, CA-4.2, CA-4.3, CA-4.5).**
  - **Hecho cuando:** cada día se consulta con ratón y teclado, incluido 0 min y un futuro sin minutos; Escape y la pérdida de foco cierran el detalle sin errores de consola.

- [x] **T9. Consulta táctil.** Mantener visible el detalle al tocar una casilla, sustituirlo al tocar otra y cerrarlo al tocar fuera, sin romper las interacciones de T8. **RF-4 (CA-4.3, CA-4.4).**
  - **Hecho cuando:** en emulación táctil de Chrome se pueden abrir, cambiar y cerrar detalles; teclado y puntero siguen funcionando.

- [x] **T10. Actualización al registrar.** Recalcular y repintar el mapa tras guardar una sesión, obteniendo de nuevo la fecha local para cubrir el cambio de día/semana con la página abierta. **RF-1 (CA-1.3), RF-2 (CA-2.3, CA-2.4), RF-3.**
  - **Hecho cuando:** registrar una sesión actualiza su día sin recarga y, tras un cambio de día local simulado, el período y los futuros se ajustan al guardar; `node --test` sigue verde.

- [x] **T11. Verificación de datos y persistencia.** Ejecutar la suite y comprobar el mapa en Chrome con datos de prueba controlados, sin modificar registros reales de la persona. **RF-1, RF-2, RF-3, RF-5.**
  - **Hecho cuando:** `node --test` termina sin fallos y en `file://` se comprueban totales, umbrales, futuros, recarga, datos ilegibles intactos y consola limpia.

- [x] **T12. Verificación de interacción y móvil.** Revisar puntero, teclado, toque, diseño responsive y funcionamiento sin conexión. **RF-1 (CA-1.4), RF-3 (CA-3.3), RF-4.**
  - **Hecho cuando:** en Chrome se abren y cierran detalles por los tres medios, la escala se entiende sin color, no hay desbordamiento de página a 375 px ni en pantalla más estrecha y el diario abre sin conexión ni errores de consola.

# Tareas — objetivo semanal

Orden de dependencia; las tareas marcadas están implementadas. Antes de crear archivos nuevos de código o cambiar el formato guardado, obtener la confirmación exigida por `AGENTS.md`. En lógica: prueba primero, `node --test` verde antes de avanzar. Al terminar cada tarea, el implementador actualiza `MEMORY.md` y verifica el cambio en Chrome `file://` según `AGENTS.md`.

- [x] **T1. Período de 12 semanas.** Probar y crear `getGoalWeeks(today)` en lógica pura. **RF-1 (CA-1.1–CA-1.3).**
  - **Hecho cuando:** `node --test` pasa para lunes, domingo, cambio de mes/año y horario; hay exactamente 12 intervalos de lunes a domingo sin futuro visible ni lectura del reloj.

- [x] **T2. Entrada de meta y clasificación segura.** Probar e implementar decimal con coma/punto y clasificación de metas por lunes: ausente, explícita, dudosa identificable, duplicada, no identificable y colección ilegible. **RF-2 (CA-2.1, CA-2.4–CA-2.6), RF-5 (CA-5.4–CA-5.7).**
  - **Hecho cuando:** `node --test` confirma que 30 explícito no es default, lo inválido bloquea solo su semana si se identifica, lo no identificable no bloquea y ninguna entrada original se muta.

- [x] **T3. Edición inmutable y ventana móvil.** Probar y crear actualización de una semana seleccionada, incluida selección que sale de la ventana tras cambio de semana. **RF-1 (CA-1.2–CA-1.4), RF-2 (CA-2.2, CA-2.5), RF-5 (CA-5.1, CA-5.6–CA-5.7).**
  - **Hecho cuando:** `node --test` conserva entradas antiguas/dudosas y otras metas, rechaza sin cambios semana expulsada o bloqueada y edita la semana seleccionada si sigue visible.

- [x] **T4. Progreso semanal utilizable.** Probar e implementar sumas por intervalo hasta `today`, sin redondeo por sesión. **RF-3 (CA-3.1–CA-3.3, CA-3.6), RF-5 (CA-5.2–CA-5.3).**
  - **Hecho cuando:** `node --test` cubre varias sesiones de un día, tema vacío/ausente/espacios, fechas inválidas/futuras, minutos inválidos y colección ilegible distinta de cero; sesiones originales intactas.

- [x] **T5. Redondeo, logro y vista pura.** Probar y componer progreso/meta/estado de cada semana. **RF-1 (CA-1.1), RF-2 (CA-2.1), RF-3 (CA-3.4–CA-3.5), RF-4 (CA-4.1–CA-4.3), RF-5 (CA-5.3–CA-5.6).**
  - **Hecho cuando:** `node --test` verifica suma antes de redondear, `.5` hacia arriba en cada lado, 29,99/30 cumplida, 29,5/30,5 pendiente y ausencia de logro ficticio con datos indisponibles; suite completa verde.

- [x] **T6. Lectura y escritura aisladas de metas.** Integrar en `app.js` clave separada y guardado conservador con errores explícitos, sin tocar sesiones. **RF-2 (CA-2.2–CA-2.6), RF-5 (CA-5.1, CA-5.4–CA-5.7).**
  - **Hecho cuando:** en Chrome `file://`, recarga recupera metas exactas; ausencia usa default sin escribirlo; datos ilegibles o dudosos no se sobrescriben y un fallo de escritura no se anuncia como éxito; la clave de sesiones permanece idéntica.

- [x] **T7. Consulta de objetivos.** Añadir sección y pintado en `index.html`/`app.js` a partir de la vista pura, con avisos independientes para metas y sesiones indisponibles. **RF-1 (CA-1.1–CA-1.3), RF-2 (CA-2.1, CA-2.3), RF-3 (CA-3.1–CA-3.2, CA-3.5), RF-4 (CA-4.1–CA-4.2), RF-5 (CA-5.3–CA-5.7).**
  - **Hecho cuando:** en `file://` se ven 12 intervalos y estados textuales correctos (o avisos), incluidos 0/30 y histórico; abrir sin red y consola sin errores.

- [x] **T8. Edición y actualización en acción.** Vincular formulario a lunes explícito; refrescar ventana en selección, confirmación y guardado de sesión. **RF-1 (CA-1.2, CA-1.4), RF-2 (CA-2.2–CA-2.4), RF-3 (CA-3.3–CA-3.4), RF-4 (CA-4.3), RF-5 (CA-5.1, CA-5.6).**
  - **Hecho cuando:** en Chrome una meta inválida explica el error sin guardar; edición visible y nueva sesión actualizan progreso/logro de inmediato; cambio de semana simulado conserva selección aún visible y rechaza la que salió sin escribir.

- [x] **T9. Diseño e interacción accesibles.** Ajustar `styles.css`, etiquetas y estados para ratón, teclado, toque y móvil. **RF-1 (CA-1.1), RF-2 (CA-2.2, CA-2.4), RF-3 (CA-3.1), RF-4 (CA-4.1–CA-4.2), RF-5 (CA-5.3–CA-5.6).**
  - **Hecho cuando:** en Chrome a 375 px y menor anchura no desborda la página; edición por los tres medios, foco visible y logro/errores comprensibles sin color, contraste legible.

- [x] **T10. Regresión y cierre.** Ejecutar `node --test` y verificar integralmente en Chrome aislado `file://`, móvil y sin red; dejar constancia del bug preexistente del mapa sin modificarlo. **RF-1–RF-5.**
  - **Hecho cuando:** suite completa verde; recarga, metas históricas, datos dudosos, sesiones previas intactas, cambio semanal y consola comprobados; `MEMORY.md` actualizado por implementador y ningún cambio en `heat-map.js` ni en su semántica.

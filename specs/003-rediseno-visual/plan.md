# Plan — mesa de estudio digital oscura

**Estado: aprobado, incluida su paleta de seis valores.** Confirmación explícita del usuario al retomar OSC-01 (2026-10-10); autoriza también sustituir únicamente la regla visual de `AGENTS.md`. Spec 003 aprobada mediante «sí», según la confirmación recibida para la fase SDD 3 (2026-10-08). Este plan sustituye íntegramente el de cuaderno de campo. Solo presentación: no cambiar funcionalidades, cálculos, mensajes funcionales, datos ni JavaScript.

**Nota de vigencia:** las menciones siguientes a propuesta, aprobación pendiente y tareas inicialmente pendientes describen la planificación previa. La aprobación queda resuelta sin cambios de RF, criterios ni paleta. OSC-01 registra la base y resuelve la regla de AGENTS; OSC-02–OSC-09 siguen pendientes. Evidencia reproducible en `tasks.md`.

## Base inspeccionada y trazabilidad

- Leídos `MEMORY.md`, `AGENTS.md`, constitución, spec/plan/tasks 003 anteriores, specs funcionales 001/002, `index.html`, `styles.css` y contratos DOM/eventos de `app.js`. Referencias de funciones de `heat-map.js` y `weekly-goals.js` inventariadas, sin refactorizarlas.
- **T1 anterior completa:** actualizó la regla visual a cuaderno de campo. **T2 anterior completa:** estableció tokens claros y tipografía editorial. Son hechos históricos de la dirección descartada, no cumplimiento de este plan.
- **T3 anterior interrumpida, con parciales:** no estaba marcada completa; la interrupción la comunica el coordinador. HTML ya sin mascotas y CSS con rachas cobalto/pino grandes. No se acredita la finalización de T3. T4–T7 anteriores estaban pendientes. Toda la serie T1–T7 queda **supersedida**, no se continúa ni se reutilizan sus marcas.
- Base actual: registro después de objetivos y mapa, compartiendo `.trabajo` con historial; títulos/cifras Georgia, superficies claras, rachas con alturas mínimas grandes y componentes rosa-violeta pendientes. Hay que inspeccionar y sustituir estas reglas, no superponer otro tema al final de la hoja.
- La última prueba anotada es 48/48, no una ejecución de esta fase. No se han ejecutado tests ni QA visual durante esta planificación. Las nuevas tareas **OSC-01–OSC-09** comienzan todas pendientes, incluida inspección de base verificable.
- `frontend-design` y `local-dates` cargadas. Skill `sdd` no disponible en el catálogo ni en las rutas consultadas; se conserva el formato documental del proyecto y las instrucciones SDD recibidas, sin afirmar haberla cargado.

## Puertas antes de código

1. Aprobar este plan, incluida la propuesta cromática; la aprobación de la spec no elige colores concretos.
2. Un implementador autorizado debe cambiar **solo la regla visual de `AGENTS.md`**: reemplazar cuaderno/papel/tinta/cobalto/pino por mesa digital oscura, contrastada, compacta, sans serif, registro prioritario y sin mascotas, conforme a la spec y paleta aprobadas. Conservar contraste y demás reglas. **No editar UI hasta resolver esta contradicción.** RF-1, RF-5, RF-7.
3. Registrar línea base reproducible y contratos antes de editar HTML/CSS; comprobar `node --test`. No avanzar con rojo. Si un criterio exige cambiar JS, datos, mensajes o interacciones, detenerse y consultar, no ampliar alcance.

Este planner no modifica `AGENTS.md` ni `MEMORY.md`; sus actualizaciones futuras corresponden al implementador autorizado. No se requieren nuevos archivos de aplicación ni dependencias.

## Dirección visual propuesta para aprobación

### Paleta base: seis valores

| Nombre | Hex | Uso previsto |
| --- | --- | --- |
| Fondo nocturno | `#101C2A` | Fondo general, tinta sobre acentos claros. |
| Superficie de trabajo | `#1B2D40` | Registro, campos y áreas que necesitan agrupación, no tarjetas para todo. |
| Texto claro | `#F1F5FA` | Texto principal, títulos, unidades; anillo exterior de foco sobre oscuro. |
| Pizarra clara | `#A9B9CA` | Texto de apoyo y límites necesarios de controles. |
| Azul de acción | `#8CBFFF` | Guardar sesión, racha actual y actividad del mapa. |
| Ámbar de referencia | `#F2C078` | Mejor racha, avisos y foco interior; significado siempre textual. |

Botón principal azul con texto nocturno; no texto claro sobre azul claro. Mejor racha y avisos pueden compartir ámbar porque sus etiquetas y tratamiento los distinguen; no crear estados nuevos ni inferir éxito/error buscando palabras con JS. Logro conserva `objetivo-achieved`, texto existente y borde distintivo. Detalle y ayudas usan texto legible sobre superficie oscura. La escala del mapa deriva cuatro escalones sólidos mezclando el azul con la superficie (25/50/75/100 % de azul), calculados como valores CSS locales; contorno pizarra para reconocer casillas. Sin estudio usa superficie y contorno continuo; futuro, fondo y contorno discontinuo. Las muestras repiten exactamente los niveles y sus rangos textuales. Medir contrastes reales; los rellenos de actividad no sustituyen texto/contornos necesarios.

Esta paleta es una propuesta del plan, no una elección atribuida al usuario. No usar verde ácido, degradados decorativos ni colores rosa-violeta heredados. Derivar tonos de escala no autoriza una segunda paleta arbitraria. Si los contrastes medidos obligan a cambiar los seis valores base, someter el ajuste a aprobación.

### Tipografía y ritmo

- Familia única local: **`"Segoe UI", "Helvetica Neue", Arial, sans-serif`**, para títulos, cifras, controles y cuerpo. Sin descargas, `@import` ni fuentes web; comprobar el fallback offline. Cifras tabulares para comparar cantidades, nunca monospace ornamental.
- Cuerpo y campos 1rem, interlineado 1,5; apoyos no menores de 0,875rem. Título aproximadamente 1,75–2,25rem, apartados 1,25rem, cifras 1,75–2,25rem; pesos 400/600/700. El registro destaca por ubicación y acción, no por inflar números.
- Espaciado base 4/8/12/16/24/32 px; radios contenidos en controles, divisores discretos en listas. No mayúsculas ornamentales, nuevos rótulos, mascotas, serif ni movimiento.

### Composición y RF-7

Propuesta: una mesa con registro primero, una banda de progreso y listas de consulta; alineación izquierda, cifras con sus unidades y títulos existentes. Ancho máximo aproximado 1080 px, margen lateral 16 px a 375; cabecera breve y separación inicial contenida. Orden DOM y visual coherentes: **cabecera → registro → conjunto rachas/resúmenes → objetivos → mapa → sesiones**. Mover las secciones existentes completas en HTML, no simular el orden solo con `order`, posiciones absolutas o `tabindex` positivo.

```text
375 px                            1280 px
Diario de Estudio                  Diario de Estudio
Registrar sesión                  Registrar sesión
Fecha / Tema / Minutos             Fecha       Tema       Minutos
Guardar sesión                    Guardar sesión
Racha actual | Mejor racha         Racha actual | Mejor racha | Semana | Mes
Semana       | Mes                 Objetivos semanales (12 filas + edición)
Objetivos (12 filas + edición)     Días de estudio (mapa + detalle + escala)
Días de estudio                   Sesiones (filas)
Sesiones
```

- El formulario queda antes de las 12 semanas. Objetivo verificable CA-7.1: título «Registrar sesión» y **primer campo completo** visibles sin scroll a **375 × 812** y **1280 × 800**, texto predeterminado y sin avisos abiertos, con y sin sesiones.
- Agrupar rachas y los dos resúmenes en un contenedor presentacional común para medir su caja completa, incluidos espacios interiores. Cuatro columnas en escritorio; dos por dos en móvil si caben sin recorte, con etiquetas completas. Objetivo CA-7.2: altura total **≤320 px** a 375 y 1280, rachas 0, 1, 99 y 9999. No imponer `max-height`, ocultación ni reducción forzada de texto para aprobarlo.
- Con zoom 200 %, cifras mayores o avisos, se permite crecimiento y una columna cuando haga falta (CA-7.4). No sticky, paneles superpuestos, pestañas, filtros, acordeones ni selector de tema. Las 12 filas permanecen disponibles en lectura natural; tampoco scroll anidado de objetivos/historial.
- Objetivos: filas con separación y estado textual, no tarjetas idénticas; conservar su texto compuesto actual, sin dividirlo mediante JS. Edición debajo, como ahora. Historial al final con temas envolventes y minutos legibles; no reutilizar las dos columnas antiguas registro/historial.
- Mapa: mantener 12 columnas visibles a 375 px **sin necesitar scroll interno** (contrato 001 CA-1.4), con ancho útil suficiente para rejilla actual de 316 px más su padding de foco. A 320 puede desplazarse solo el mapa. Detalle y leyenda permanecen fuera del contenedor desplazable. No agrandar globalmente las casillas a 44 px y romper las 12 semanas; CA-4.1 fija 44 × 44 px para controles de los formularios. Mantener consulta táctil existente del mapa, sin blancos superpuestos.

Revisión frente al brief: se descarta la portada de dos rachas gigantes y la repetición de tarjetas. La singularidad reside en la mesa de captura inmediata y su banda de progreso azul/ámbar; no se usa el patrón negro/verde ácido, una serif editorial ni adornos nuevos. RF-1–RF-5 y RF-7.

## Archivos y responsabilidades / cobertura

| Archivo | Trabajo previsto | RF |
| --- | --- | --- |
| `AGENTS.md` | Regla visual, puerta previa por agente autorizado. | 1, 5, 7 |
| `index.html` | Reubicar secciones completas, separar registro e historial de la agrupación anterior y agrupar rachas/resúmenes; conservar todos los contratos. | 1, 2, 4, 5, 6, 7 |
| `styles.css` | Sustituir tokens, tipografía y reglas heredadas; composición, controles, estados, listas, escala, foco y responsive. | 1–7 |
| `app.js` | **No modificar**; inventariar y verificar renderizado/eventos. | 3, 4, 6 |
| `heat-map.js`, `weekly-goals.js` | **No modificar** funciones, fechas, niveles, redondeos ni datos. | 3, 6 |
| `tests/heat-map.test.js`, `tests/weekly-goals.test.js` | Ejecutar sin editar ni relajar expectativas para esconder regresiones. | 3, 4, 6 |
| `specs/003-rediseno-visual/tasks.md`, `MEMORY.md` | Implementador registra evidencia y avance de OSC, separando historia supersedida; memoria breve al cerrar cada tarea. | Seguimiento 1–7 |

No se necesitan funciones nuevas. Se preservan las funciones puras con **hoy como parámetro explícito**: `getHeatMapPeriod(today)`, `sumMinutesByDay(sessions, today)`, `classifyHeatMapDay(date, minutes, today)`, `buildHeatMap(sessions, today)`, `getGoalWeeks(today)`, `resolveGoals(entries, today)`, `updateGoalEntry(entries, weekStart, minutes, today)`, `sumWeeklyMinutes(sessions, today, weeks)` y `buildWeeklyGoalView(sessions, entries, today)`. No presentar las funciones heredadas de rachas de `app.js` como puras: dependen del estado y reloj existentes; extraerlas sería un refactor fuera de alcance. No cambiar fechas locales ni introducir UTC o aritmética de 86400000 ms.

### Contratos que deben quedar intactos

- Todos los IDs actuales, únicos: encabezados y asociaciones, `dias-racha`, `dias-mejor-racha`, `racha-unidad`, `mejor-racha-unidad`, `minutos-semana`, `dias-mes`, `unidad-dias-mes`; `lista-objetivos`, `objetivos-error-metas`, `objetivos-error-sesiones`, `formulario-objetivo`, `objetivo-semana`, `objetivo-minutos`, `objetivo-ayuda`, `objetivo-aviso`; `mapa-error`, `mapa-contenido`, `mapa-semanas`, `mapa-detalle`; `formulario-sesion`, `fecha`, `tema`, `minutos`, `lista-sesiones`.
- Nombres de apartados, controles, `name`, tipos, `required`, `min`, `step`, `inputmode`, `for`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `role`, orden y carga `defer` de scripts. No duplicar formularios para escritorio/móvil, ni introducir nuevos mensajes o validaciones.
- Clases dinámicas: `objetivo-semana`, `objetivo-pending`, `objetivo-achieved`, `objetivo-unavailable`; `mapa-semana`, `mapa-dia`, `none`, `level-1`–`level-4`, `future`; `sesion-tema`, `sesion-fecha`, `sesion-minutos`, `sin-sesiones`. Conservar `data-week-start`, `data-date` y generación de etiquetas accesibles.
- `hidden` continúa gobernado por JS: ninguna regla de presentación debe mostrar avisos/contenido/detalle ocultos. Proteger su precedencia ante `display:grid/flex`. Foco diferente de hover, sin recorte y visible incluso sobre el nivel más claro del mapa (anillo doble claro/oscuro si procede).
- Eventos sin cambios: `input` de tema/minutos, `change` del selector, ambos `submit`, delegación del mapa `pointerover/out/down`, `focusin/out`, `keydown` Escape y `pointerdown` del documento. Preservar cierres por salida/toque fuera y foco en tema tras guardar. No reparentar casillas fuera de `#mapa-semanas` ni detalle dentro del scroll.
- Claves `diario-de-estudio-sesiones` y `diario-de-estudio-metas-semanales`, valores y formato intactos; ninguna migración, persistencia de defaults, cálculo nuevo o cambio de mensajes funcionales. RF-2–RF-6.

## Decisiones y alternativas descartadas

| Decisión | Motivo | Alternativa descartada |
| --- | --- | --- |
| Aprobar paleta y resolver AGENTS antes de UI | Aprobación verificable sin conflicto de reglas. | Atribuir colores a la aprobación de la spec o cambiar primero CSS. |
| Azul/ámbar sobre dos superficies nocturnas | Acción, referencia y lectura contrastada sin verde ácido genérico. | Rosa-violeta heredado, papel/pino anterior o gran degradado ornamental. |
| Sans local única con pesos y cifras tabulares | Identidad nítida offline y menos ruido tipográfico. | Georgia, fuentes remotas o biblioteca de iconos. |
| Registro primero en DOM y banda compacta | RF-7 verificable y teclado coherente. | Solo reordenamiento visual, cabecera gigante o esconder objetivos. |
| Editar reglas existentes y mover bloques intactos | Simplicidad didáctica y contratos preservados. | Cascada de overrides, nuevo renderizador o modificación de JS. |
| Casillas compactas con leyenda/detalle externos al scroll | Respeta 001 a 375 y conserva interacción actual. | Reducir semanas, agrandar todas las casillas o poner scroll a la página. |

## Estrategia de pruebas y evidencias

**Puerta por tarea:** ejecutar `node --test` antes de iniciar la implementación y **después de cada OSC**, también las documentales; anotar resultado real, no copiar el 48/48 histórico. No avanzar en rojo ni modificar pruebas para aceptar una regresión. Suite protege lógica, no acredita apariencia. Después de cada cambio, Chrome DevTools `file://` aislado: flujo afectado, consola y móvil; en tareas de composición/estados, repetir sus medidas y contrastes. Registrar evidencia en tareas y memoria por agente autorizado.

### Matriz final obligatoria

| Verificación | Procedimiento / evidencia de aceptación | RF |
| --- | --- | --- |
| Aislamiento y base | Contexto Chrome nombrado y aislado, URL local de `index.html`; guardar valores de prueba de ambas claves antes/después. Nunca borrar almacenamiento del perfil real. Misma fecha local y fixtures en comparación base/final. | 6 |
| Responsive | 320 × 812, 375 × 812, 1280 × 800, zoom normal. Medir ancho de documento ≤viewport; temas largos, fechas extensas, cifras 0/1/99/9999. Capturas y dimensiones, no solo impresión visual. | 1, 2, 5, 7 |
| Primera pantalla | En 375 × 812 y 1280 × 800 sin avisos, vacía y poblada, medir borde superior/inferior de título y primer campo de registro dentro del viewport sin scroll. | 7 CA-7.1 |
| Progreso compacto | Medir caja envolvente del conjunto de ambas rachas y dos resúmenes, incluidos gaps; ≤320 px en 375/1280 para 0–4 dígitos. Variantes de texto se pueden simular solo en DOM de prueba, sin escribir datos falsos al usuario. | 1, 7 CA-7.2 |
| Ampliación | Zoom real 200 %, especialmente 375 y 1280; cifras >4 dígitos, avisos simultáneos: permitir crecer, etiquetas/unidades/controles íntegros, orden visual=lectura=Tab. No exigir 320 px en este caso. | 5, 7 CA-7.3–7.4 |
| Contraste y foco | Registrar pares y ratios de texto, apoyos, campos, botones normal/hover/foco, selector abierto, escala, detalle, errores y logros. ≥4,5:1 normal, ≥3:1 grande e indicadores/límites necesarios frente a adyacentes. Revisar foco sobre todos los niveles sin recorte; no asumir conformidad por tokens. | 3, 4, 5 |
| Controles | Medir áreas accionables ≥44 × 44 px de campos, selector y botones de formularios, etiquetas y ayudas junto a campos; no aplicar mínimos genéricos que rompan mapa. Comprobar selector nativo y fecha sin truncar información necesaria. | 4, 5 |
| Mapa | 12 columnas/84 días, a 375 todas las semanas visibles sin scroll interno; a 320 solo scroll del mapa si precisa. Escala íntegra, niveles 0/>0/30/60/120, futuro diferenciado, detalle y foco accesibles. Puntero muestra/cierra; Tab muestra, salida/Escape cierra; toque mantiene/cambia/cierra al tocar fuera. | 3, 5, 6; 001 CA-1.4 |
| Flujo y persistencia | Registrar sesión, comprobar listado/rachas/resúmenes/mapa/objetivos sin recarga y foco en tema; editar meta actual e histórica, coma/punto y meta explícita 30; recargar y reabrir. Lectura no escribe, editar meta no toca sesiones ni metas antiguas, guardar sesión no toca metas. Comparar claves exactas salvo cambios intencionales. | 4, 6 |
| Estados | Ausencia, sesiones válidas/invalidas, ambas colecciones ilegibles por separado y juntas, semana bloqueada/duplicada, cumplida/pendiente/indisponible, edición inválida y fallo de escritura de meta simulado. Avisos independientes, `hidden` efectivo, sin cero/éxito falso ni sobreescritura; no añadir manejo de errores que no exista. | 2, 4, 6 |
| Calendario | Suite de fecha local/DST y cambio de semana; comparar base/final con futuro, fecha local de sesión a 00:30 y semana seleccionada que sale de ventana. No cambiar cálculos para obtener otro resultado. | 6 |
| Offline y consola | Recargar `file://` sin red y preferencia de sistema clara: apariencia sigue oscura, fuentes locales, guardar/consultar utilizable; sin recursos remotos ni nuevos errores de consola. Restaurar o eliminar solo fixtures del contexto aislado al terminar. | 1, 5, 6 |

**Defecto conocido fuera de alcance:** 001 RF-3, 29,99999999999999 min se presenta como 30/nivel 2. Documentarlo como fallo previo no resuelto, nunca como valor correcto ni como cumplimiento completo de 001. No reparar `heat-map.js` ni cambiar umbrales/pruebas dentro de 003. Otros fallos preexistentes se separan de regresiones y se elevan, no se corrigen por estética.

## Bloqueos y cierre

- Puerta de aprobación del plan/paleta resuelta por el usuario; regla visual de `AGENTS.md` actualizada en OSC-01, sin cambios de UI. La evidencia de base se registra en `tasks.md`.
- Ausencia de skill `sdd` declarada; no se ha inventado una plantilla adicional. Si se exige verificarla literalmente, facilitar su ubicación antes de aprobar el plan.
- Cierre de 003 solo con OSC-01–OSC-09 verificadas, sin JS/datos alterados, RF-7 medido y matriz real documentada. Las marcas antiguas no cuentan. El defecto del mapa permanece explícitamente pendiente fuera de este rediseño.

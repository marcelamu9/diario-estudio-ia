# Plan de implementación — objetivo semanal

Basado en la spec aprobada. Este plan no implementa nada ni modifica los RF. No corregir `heat-map.js` ni su bug conocido de RF-3 (29,99999999999999 min); mantener la suite previa como regresión y registrar ese fallo aparte.

## Archivos y responsabilidades

| Archivo | Acción prevista | Responsabilidad | RF |
| --- | --- | --- | --- |
| `weekly-goals.js` | Crear, previa autorización de archivo nuevo conforme a `AGENTS.md` | Cálculos puros: período local, validación de sesiones y metas, progreso, redondeo y logro; exportación CommonJS condicional para Node y script clásico para `file://`. Sin DOM, reloj ni almacenamiento. | RF-1–RF-5 |
| `tests/weekly-goals.test.js` | Crear, previa autorización de archivo nuevo | Pruebas con `node:test` y `node:assert/strict`, escritas antes de cada tramo de lógica. | RF-1–RF-5 |
| `index.html` | Modificar | Sección de objetivos con 12 semanas identificadas, estado de progreso/meta/logro, formulario de edición y avisos independientes; cargar `weekly-goals.js` antes de `app.js`, sin módulos. | RF-1–RF-5 |
| `styles.css` | Modificar | Disposición responsive, controles accesibles y estados textuales con contraste en la paleta existente. | RF-1–RF-4 |
| `app.js` | Modificar de forma acotada | Leer/guardar metas en clave propia, obtener fecha local en cada acción relevante, mantener selección de semana explícita, pintar estados, procesar edición y refrescar al registrar sesión. No alterar la lectura/escritura ni el resumen de sesiones existente. | RF-1–RF-5 |
| `MEMORY.md` | Actualización por el implementador al terminar cada tarea, conforme a `AGENTS.md`; fuera del permiso de escritura de este planner | Estado, decisiones y errores a evitar, breve y sin datos personales. | Seguimiento |

La creación de archivos de código y pruebas se consulta antes de ejecutarla, como exige `AGENTS.md`; la aprobación de la spec no modifica ese límite. Nombres nuevos de código en inglés; textos y documentación en español.

## Contrato de datos y límites de persistencia

- Mantener intacta la clave `diario-de-estudio-sesiones` y sus objetos `{ fecha, tema, minutos }`. Las metas se guardan separadas, por ejemplo en `diario-de-estudio-metas-semanales`, como colección de entradas `{ semana: "AAAA-MM-DD", minutos: número }`, donde `semana` es el lunes local. La elección exacta de esta clave/forma se valida antes de implementar por la regla de consulta sobre formato de datos de `AGENTS.md`. No migrar ni reescribir sesiones. **RF-2, RF-5.**
- La lectura de metas distingue clave ausente (`[]`, sin escribir defaults), colección válida (incluidas entradas dudosas) y lectura/estructura de colección ilegible (indisponibilidad global). Capturar errores de lectura y de escritura; no convertir fallos de lectura en `[]` ni afirmar un guardado fallido. La indisponibilidad de metas no inutiliza las sesiones, ni la de sesiones permite fingir progreso cero/logro. **RF-2, RF-5.**
- Resolver por semana: agrupar entradas con semana identificable como fecha local válida (el lunes canónico o cualquier fecha válida de esa semana); si hay duplicados o entrada identificable no válida, bloquear solo esa semana y no sobrescribirla. Entradas sin semana identificable se conservan sin aplicarse ni bloquear otras. Una entrada válida con `minutos: 30` sigue siendo explícita. Para guardar una semana editable, crear una colección nueva sustituyendo únicamente su entrada identificada o añadiendo la nueva; copiar literalmente las demás entradas, incluso dudosas y fuera de ventana. Escribir solo la clave de metas tras comprobar lectura y validación; conservar el valor previo ante entrada inválida, semana fuera de ventana o fallo de escritura. **RF-1, RF-2, RF-5.**

## Funciones puras y composición

Todas las funciones que dependan del día reciben `today` (`AAAA-MM-DD` local) explícito. La interfaz es la única que consulta `new Date()` y convierte a fecha local por componentes. No usar `toISOString()`, `new Date("AAAA-MM-DD")` ni sumar 24 horas en milisegundos; avanzar calendario local a mediodía. No reutilizar `sumMinutesByDay` de `heat-map.js`: limita el período y usa `toPrecision(15)`, y la spec nueva exige acumulación y redondeo semanales propios sin tocar el mapa.

- `getGoalWeeks(today)`: 12 intervalos lunes–domingo, de más antiguo a actual, con identificador lunes; funciona entre meses/años y cambios de horario. **RF-1.**
- `parseGoalMinutes(input)`: acepta texto decimal con coma o punto y solo número finito positivo; devuelve valor exacto numérico sin redondear, o error de validación. **RF-2.**
- `resolveGoals(entries, today)`: clasifica colección disponible/no disponible y cada una de las 12 semanas como explícita, predeterminada (30) o bloqueada por dato dudoso; no elimina entradas invisibles o no identificables. Puede separar en ayudas puras la identificación del lunes y la validación de entradas. **RF-1, RF-2, RF-5.**
- `sumWeeklyMinutes(sessions, today, weeks)`: suma todas las sesiones utilizables por semana hasta `today`; tema debe ser cadena no vacía tras `trim()`, fecha real y minutos numéricos finitos positivos. Entrada inválida se omite sin tocarla; colección de sesiones indisponible devuelve estado indisponible, no cero. **RF-3, RF-5.**
- `roundGoalMinuteTotal(value)` y `buildWeeklyGoalView(sessions, entries, today)`: redondean una sola vez la suma de cada semana y, por separado, su meta; `.5` hacia arriba, misma pareja de enteros para texto y comparación. Sin redondear sesiones individualmente ni valores guardados. Devolver logro textual distinguible de pendiente y estados indisponibles sin logro ficticio. **RF-1, RF-3, RF-4, RF-5.**
- `updateGoalEntry(entries, weekStart, minutes, today)`: resultado inmutable de la edición solo si el lunes seleccionado permanece visible, su estado es editable y la meta es válida; si ya salió de la ventana, rechazo sin cambios para mostrar aviso. No escoger automáticamente la semana actual. La persistencia ocurre exclusivamente en `app.js` tras el resultado válido. **RF-1, RF-2, RF-5.**

## Flujo en pseudocódigo

1. Al cargar, leer sesiones según la distinción ya existente y metas con estado independiente; obtener `today` local. Calcular 12 lunes y domingos, asociar metas sin persistir los 30 por defecto y sumar sesiones válidas de cada intervalo hasta `today`. **RF-1, RF-2, RF-3, RF-5.**
2. Para cada semana, si las metas son globalmente ilegibles mostrar meta indisponible; si hay entrada dudosa identificable/duplicada bloquear solo esa semana; en otro caso usar su meta explícita o 30. Si las sesiones son ilegibles, progreso indisponible sin comparar; si no, redondear por separado progreso y meta y determinar cumplida o pendiente con esos enteros. **RF-2–RF-5.**
3. Pintar intervalos, valores y estados como texto. El control de edición se asocia al identificador del lunes seleccionado, no a la posición de la fila. Con cada acción relevante (seleccionar, intentar guardar meta, guardar sesión) volver a obtener `today`; si cambió la semana, repintar las 12. **RF-1–RF-4.**
4. Al confirmar una meta, revalidar selección contra la ventana recalculada. Si salió, avisar, no escribir y conservar dato previo; si sigue, validar texto decimal y estado de metas, construir colección nueva conservadora, intentar guardar solo su clave y repintar inmediatamente únicamente tras éxito. Al guardar una sesión por la ruta existente, recalcular progreso y logro sin duplicar datos; al reabrir, volver a leer metas. **RF-1–RF-5.**

## Decisiones y alternativas descartadas

| Decisión | Motivo | Alternativa descartada |
| --- | --- | --- |
| Lógica nueva aislada y testeable con `today` explícito | Evita acoplar DOM/reloj y modificar el mapa defectuoso. | Extender `heat-map.js` o aplicar sus totales diarios redondeados. |
| Identificar metas por lunes local y conservar colección original al editar | Permite metas por semana, históricas y entradas dudosas intactas. | Guardar un único objetivo global o reconstruir solo las 12 semanas visibles. |
| Clave de metas independiente y estado de lectura separado del de sesiones | Conserva compatibilidad y no confunde errores con ausencia de actividad. | Añadir `meta` a cada sesión o reescribir datos ilegibles como `[]`. |
| Redondear sumas y metas por separado antes de comparar | Hace coherentes cifras presentadas y logro sin alterar datos exactos. | Comparar números sin redondear o redondear cada sesión antes de sumar. |
| Actualización en la siguiente acción, sin temporizador | Cumple el cambio de semana y mantiene simplicidad. | Sondeo a medianoche o editar implícitamente la nueva semana actual. |

## Tests primero y verificación

1. Antes de cada tramo de lógica, escribir casos en `tests/weekly-goals.test.js`, ejecutar `node --test tests/weekly-goals.test.js` (rojo esperado al empezar), implementar hasta verde y ejecutar `node --test` antes de pasar a la tarea siguiente. No avanzar con fallos; no «arreglar» el mapa como parte de este alcance. **RF-1–RF-5.**
2. Cubrir lunes/domingo y 12 intervalos al cruzar año y horario; cambio de semana en fecha de acción, selección que permanece visible y selección expulsada sin escritura. **RF-1, RF-2.**
3. Cubrir default y explícito 30, edición histórica aislada, coma/punto, vacío/no numérico/no finito/no positivo y valores exactos no mutados; sesiones múltiples, tema blanco/ausente, fecha imposible/futura y colección ilegible. **RF-2, RF-3, RF-5.**
4. Cubrir suma antes del redondeo, 29,99/30 cumplida, 29,5/30,5 pendiente, fronteras exactas y cambio de logro por sesión/meta; entradas de meta inválidas identificables, duplicadas, sin identificador, colección ilegible y metas anteriores a 12 semanas preservadas. **RF-1, RF-3–RF-5.**
5. En Chrome DevTools abrir `index.html` con `file://` en contexto aislado: crear metas y sesiones de prueba, recargar, verificar clave de sesiones sin cambios al editar, fallos de lectura de cada colección independientes, guardado tras cambio de semana, consola sin errores y carga sin red. Probar ratón, teclado y toque; revisar 375 px y anchura menor sin desbordamiento ni pérdida de contraste. Restaurar datos de prueba. **RF-1–RF-5.**

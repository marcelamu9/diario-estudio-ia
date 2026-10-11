# Plan de implementación — mapa de calor

Basado en `spec.md` y en la constitución. Este documento describe la implementación; no cambia la especificación ni autoriza funcionalidades fuera de ella.

## Archivos y responsabilidades

| Archivo | Acción | Responsabilidad | Cobertura |
| --- | --- | --- | --- |
| `index.html` | Modificar | Añadir una sección con título, región del mapa, escala de niveles, detalle del día y estado de datos indisponibles. Cargar la lógica nueva antes de la interfaz sin depender de un servidor. | RF-1, RF-3, RF-4, RF-5 |
| `styles.css` | Modificar | Rejilla de 12 semanas, estados sin estudio/futuro/niveles 1–4, leyenda, foco y detalle legibles. A 375 px, mostrar las 12 columnas sin desbordar la página; por debajo, permitir desplazamiento solo dentro del mapa. | RF-1, RF-3, RF-4, RF-5 |
| `heat-map.js` | Crear | Funciones puras de fechas locales, validación, suma diaria y nivel. Sin lectura del reloj, DOM ni almacenamiento. Disponible directamente en el navegador y exportable para pruebas de Node, sin módulos ES ni paso de compilación. | RF-1, RF-2, RF-3, RF-5 |
| `app.js` | Modificar | Leer los datos sin alterarlos, distinguir colección vacía de ilegible, obtener el «hoy» local y entregar sesiones y hoy al cálculo. Pintar el resultado y actualizarlo al guardar; gestionar puntero, foco, toque, cierre del detalle y mensaje de indisponibilidad. Mantener el resto del diario. | RF-1 a RF-5 |
| `tests/heat-map.test.js` | Crear | Pruebas automatizadas de las funciones puras con fechas explícitas, sin navegador, red ni almacenamiento real. | RF-1, RF-2, RF-3, RF-5 |
| `MEMORY.md` | Modificar al terminar la implementación | Registrar el estado final, las decisiones relevantes y los errores a evitar; sin guardar sesiones personales. | Seguimiento del proyecto |

No se cambia la forma ni la clave de las sesiones guardadas. Los nombres de funciones y variables del código nuevo serán en inglés; los textos visibles y la documentación, en español.

## Lógica pura

- `getHeatMapPeriod(today)`: devuelve los 84 días locales, agrupados de lunes a domingo, y marca los posteriores a `today` como futuros. **RF-1.**
- `sumMinutesByDay(sessions, today)`: valida y suma las sesiones de días visibles hasta `today`, sin mutar los datos; devuelve totales por fecha, distinguiendo sesiones inválidas de una colección ilegible. **RF-2, RF-5.**
- `classifyHeatMapDay(date, minutes, today)`: distingue futuro, sin estudio y los cuatro niveles fijos según la fecha y el total. **RF-3.**
- `buildHeatMap(sessions, today)`: compone las anteriores y devuelve 12 semanas con fecha, total comunicable, nivel y estado futuro o indisponible. `today` es la fecha local explícita del día de referencia, no el reloj consultado dentro del cálculo. **RF-1, RF-2, RF-3, RF-5.**
- Ayudas internas puras: comprobar que una fecha `AAAA-MM-DD` existe realmente en calendario local, avanzar días de calendario y normalizar sumas decimales para que 0,1 + 0,2 se comunique como 0,3 sin mover 29,999 al nivel siguiente. Ninguna consulta el reloj ni modifica la entrada; las que dependen de la fecha actual reciben `today`. **RF-1, RF-2, RF-3, RF-5.**

## Algoritmo del mapa (pseudocódigo descriptivo)

1. Recibir `sessions` y `today`; validar `today` como día local. Hallar el lunes de la semana que lo contiene y retroceder 11 semanas por días de calendario, nunca por bloques de 24 horas. **RF-1.**
2. Examinar cada sesión sin modificarla. Omitir valores nulos, entradas incompletas, fechas inexistentes o mal formadas, minutos no finitos o no positivos y fechas fuera del período o posteriores a `today`. Aceptar los minutos numéricos ya guardados; conservar intacta la colección original. **RF-2, RF-5.**
3. Acumular los minutos de sesiones válidas por fecha local. Tratar con cuidado la suma decimal para no exponer artefactos de representación; usar el mismo total coherente para el texto y la comparación de umbrales. **RF-2, RF-3.**
4. Recorrer 84 días desde ese lunes, agrupados en 12 columnas de siete filas (lunes a domingo). Para cada fecha posterior a `today`, asignar estado futuro y ningún minuto de actividad; para cada día restante, tomar su total o cero y asignar el nivel fijo: 0, (0,30), [30,60), [60,120), [120,∞). **RF-1, RF-2, RF-3.**
5. Entregar semanas y días a la interfaz. Al abrir la página o guardar una sesión, obtener de nuevo `today` local y repetir el cálculo; así guardar tras medianoche también reubica el período. Sin acción de la persona, no se programa una actualización automática a medianoche. **RF-1, RF-2.**

## Pintado e interacción

- Colocar el mapa junto a los resúmenes existentes, con encabezado claro, 12 columnas de semanas y una escala textual que distinga sin estudio, cuatro intervalos y futuro. Cada casilla representa una sola fecha; el color rosa-violeta acompaña al texto accesible, no lo sustituye. **RF-1, RF-3.**
- Cada casilla consultable comunica fecha local y total en español; las futuras indican «día futuro» sin minutos de actividad. Con puntero se muestra el detalle mientras se esté sobre la casilla; con teclado, al enfocarla y hasta salir o pulsar Escape; con toque, permanece hasta tocar otra casilla o fuera del detalle. Un único detalle reutilizable evita 84 paneles persistentes. **RF-4.**
- En móvil, mantener las 12 semanas visibles a 375 px sin desbordamiento de toda la página; si la pantalla es aún más estrecha, desplazar únicamente el área del mapa. Asegurar foco perceptible y detalle dentro de la vista. **RF-1, RF-4.**
- Si la colección es válida pero está vacía o solo contiene sesiones no utilizables, pintar ceros en días transcurridos. Si la colección es ilegible o no tiene forma de colección válida, mostrar un aviso de indisponibilidad en lugar de un mapa con ceros. Ninguna de estas vistas reescribe los datos. La lectura de datos no debe convertir silenciosamente un error en una colección vacía para este mapa; si se intenta guardar mientras los datos originales son ilegibles, evitar sobrescribirlos. **RF-5.**

## Decisiones técnicas y alternativas descartadas

| Decisión | Motivo | Alternativa descartada |
| --- | --- | --- |
| Separar la lógica nueva en un archivo clásico reutilizable por navegador y Node. | Permite pruebas puras con `node --test` y apertura directa con doble clic. | Calcular dentro de `app.js` acoplado al DOM, que exigiría simular la página para probar fechas. |
| Pasar `today` desde la capa de interfaz al cálculo. | Hace deterministas las pruebas y evita consultar el reloj durante el cálculo. | Leer la fecha actual dentro de cada función. |
| Recorrer días locales de calendario a mediodía y verificar fechas por sus componentes. | Evita desplazamientos UTC, fechas inexistentes normalizadas y saltos por horario de verano. | Interpretar cadenas como UTC o avanzar sumando milisegundos. |
| Niveles fijos calculados a partir del total de cada día. | Días de distintas semanas siguen siendo comparables. | Escala relativa al máximo de las 12 semanas. |
| Un estado de lectura explícito, separado de una colección vacía. | Un fallo de lectura no significa que la persona no estudió y no debe provocar pérdida de datos al guardar. | Tratar errores de lectura como `[]` y mostrar ceros o sobrescribir el valor previo. |
| Pintar el mapa a partir de las sesiones ya existentes, sin persistir totales. | Evita desincronización y conserva el formato anterior. | Guardar un segundo calendario precalculado. |

## Estrategia de pruebas y verificación

1. Escribir primero `tests/heat-map.test.js` y ejecutar `node --test tests/heat-map.test.js`; no integrar interfaz mientras estas pruebas estén en rojo. Después ejecutar `node --test` para la suite completa. **RF-1, RF-2, RF-3, RF-5; constitución 4.**
2. Probar 84 casillas y alineación de lunes a domingo para lunes, domingo, cambio de mes/año y año bisiesto. Repetir con día de cambio de horario en la zona local; comprobar que no se pierde ni duplica un día. **RF-1.**
3. Probar suma de varias sesiones en una fecha, exclusión de datos anteriores y futuros, cero, los límites 30/60/120, 29,999 y la suma 0,1 + 0,2. Afirmar que el nivel y el total comunicado concuerdan y que la entrada no se muta. **RF-2, RF-3.**
4. Probar fechas imposibles, valores nulos, campos ausentes, minutos inválidos, colección válida vacía y mezcla de sesiones válidas e inválidas. Comprobar que ninguna prueba modifica los registros recibidos. **RF-5.**
5. En Chrome DevTools con `file://`, verificar carga sin red, actualización tras guardar (incluido un cambio de día simulado), detalle con puntero/teclado/toque, Escape y toque fuera, estados futuros, consola sin errores, datos originales intactos y recarga. Revisar 375 px y una anchura menor sin desbordamiento de página. **RF-1 a RF-5.**

Antes de dar por terminada la implementación, todos los tests deben estar en verde y los criterios de finalización de la spec deben comprobarse. No se implementan navegación entre períodos, edición desde el mapa ni actualización automática del reloj sin interacción.

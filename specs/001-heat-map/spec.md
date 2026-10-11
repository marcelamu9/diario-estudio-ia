# Mapa de calor de estudio

## Contexto y objetivo
El Diario de Estudio ya muestra rachas y resúmenes, pero no permite reconocer de un vistazo cómo se distribuye el estudio a lo largo de varias semanas. El mapa de calor mostrará los días estudiados y la intensidad de cada día según el total de minutos registrados, para ayudar a detectar hábitos sin convertirlo en una herramienta de análisis compleja.

## Usuarios
- Persona que registra sus propias sesiones y quiere revisar su constancia reciente.

## Historias de usuario
- Como estudiante, quiero ver mis días de estudio de las últimas semanas para reconocer períodos de constancia y pausas.
- Como estudiante, quiero distinguir los días con más minutos para entender la intensidad de mi estudio sin comparar sesiones una por una.
- Como estudiante, quiero conocer la fecha y los minutos de un día concreto para interpretar correctamente cada casilla.

## Requisitos funcionales

### RF-1. Período y disposición
El mapa representa 12 semanas de lunes a domingo: la semana local actual y las 11 anteriores. Incluye desde el lunes de la semana más antigua hasta el domingo de la semana actual; los días posteriores a hoy se muestran como futuros, sin actividad.

- **CA-1.1 (EARS):** Cuando se muestre el mapa, el sistema deberá presentar 12 columnas semanales ordenadas de la más antigua a la actual, con los días de lunes a domingo en orden.
- **CA-1.2 (EARS):** Cuando hoy sea cualquier día de la semana, el sistema deberá identificar como futuros los días restantes de esa semana y no asignarles minutos de estudio.
- **CA-1.3 (EARS):** Cuando se consulte el mapa en otro día local tras volver a abrir el diario, el sistema deberá ajustar el período visible a la nueva semana actual.
- **CA-1.4 (EARS):** Cuando el mapa se vea a 375 px de ancho, el sistema deberá mostrar las 12 semanas sin desbordar la página; en pantallas más estrechas podrá desplazarse el mapa por separado, sin desplazar horizontalmente toda la página.

### RF-2. Minutos por día
La intensidad se basa en la suma de los minutos de todas las sesiones válidas de cada fecha local dentro del período visible. Un día sin sesiones válidas tiene cero minutos.

- **CA-2.1 (EARS):** Cuando existan varias sesiones válidas para una misma fecha, el sistema deberá sumar sus minutos y representar una sola casilla para ese día.
- **CA-2.2 (EARS):** Cuando una sesión corresponda a una fecha anterior al período o posterior a hoy, el sistema no deberá incluir sus minutos en ninguna casilla visible.
- **CA-2.3 (EARS):** Cuando se registre una sesión válida para un día visible, el sistema deberá reflejar el nuevo total de ese día sin requerir una recarga.
- **CA-2.4 (EARS):** Si cambia el día local mientras el diario permanece abierto y después se registra una sesión, el sistema deberá actualizar el período y los estados de los días según el nuevo hoy antes de mostrar el resultado.

### RF-3. Niveles de intensidad
Los colores usan la escala rosa-violeta del diario y cuatro niveles fijos, además del estado sin estudio. Los límites son: sin estudio = 0 min; nivel 1 = más de 0 y menos de 30 min; nivel 2 = de 30 a menos de 60 min; nivel 3 = de 60 a menos de 120 min; nivel 4 = 120 min o más. Los días futuros tienen un estado visual distinto de «sin estudio». La escala visible explica estos intervalos.

- **CA-3.1 (EARS):** Cuando el total de un día cruce uno de los límites 30, 60 o 120 minutos, el sistema deberá mostrar el nivel fijo correspondiente, independientemente de los totales de otros días.
- **CA-3.2 (EARS):** Cuando un día pasado o presente no tenga minutos válidos, el sistema deberá mostrar el estado «sin estudio»; cuando sea futuro, deberá mostrar el estado «futuro».
- **CA-3.3 (EARS):** Cuando se muestre el mapa, el sistema deberá explicar qué significa cada nivel sin exigir que la persona deduzca los intervalos por el color.
- **CA-3.4 (EARS):** Cuando un total contenga decimales, el sistema deberá comunicarlo sin redondearlo a un entero ni mostrar decimales espurios, y el valor mostrado deberá ser coherente con el nivel asignado; por ejemplo, 0,1 + 0,2 min se mostrará como 0,3 min y 29,999 min seguirá en el nivel 1.

### RF-4. Consulta de un día
Cada día consultable comunica su fecha local y total de minutos. La información debe poder consultarse con puntero, teclado y toque en pantalla. Los días futuros indican que aún no han llegado y no muestran actividad.

- **CA-4.1 (EARS):** Cuando la persona consulte una casilla de un día pasado o presente, el sistema deberá mostrar su fecha y el total de minutos de ese día, incluido «0 min» si no estudió.
- **CA-4.2 (EARS):** Cuando la persona consulte un día futuro, el sistema deberá indicar que es futuro y no presentar minutos como actividad realizada.
- **CA-4.3 (EARS):** Cuando la persona use teclado o una pantalla táctil, el sistema deberá permitirle obtener la misma información que al usar el puntero.
- **CA-4.4 (EARS):** Cuando la persona toque una casilla, el sistema deberá mantener visible su detalle hasta que toque otra casilla o fuera del detalle; al tocar otra casilla, deberá sustituir el detalle anterior.
- **CA-4.5 (EARS):** Cuando la persona enfoque una casilla con el teclado, el sistema deberá mostrar su detalle; al salir de ella o pulsar Escape, deberá cerrarlo. Con puntero, el detalle se mostrará mientras permanezca sobre la casilla.

### RF-5. Datos no utilizables
Una sesión nula, incompleta, con fecha inexistente o mal formada, o con minutos no numéricos o no positivos, se omite solo del mapa. Los datos originales no se modifican. Una colección de sesiones ilegible o que no sea una colección válida se considera indisponible, no vacía.

- **CA-5.1 (EARS):** Si una o varias sesiones no son utilizables, el sistema deberá calcular el mapa con las sesiones válidas disponibles sin alterar las sesiones registradas.
- **CA-5.2 (EARS):** Si no hay sesiones utilizables en el período, el sistema deberá mostrar el mapa con cero minutos en todos los días transcurridos y mantener diferenciados los días futuros.
- **CA-5.3 (EARS):** Si los datos de las sesiones son ilegibles o no constituyen una colección válida, el sistema deberá indicar que no puede mostrar el mapa con fiabilidad, sin presentar ceros como si se hubiera confirmado que no hubo estudio y sin borrar ni sustituir los datos existentes.

## Requisitos no funcionales
- Interfaz y explicaciones en español, coherentes con la identidad rosa-violeta del diario.
- Legible y usable en móvil y escritorio, sin desplazamiento horizontal de toda la página.
- Los niveles deben distinguirse también mediante texto accesible; el color no puede ser la única forma de entender un día.
- La información de cada casilla y su foco deben ser perceptibles para personas que usan teclado o tecnologías de apoyo.
- La experiencia debe funcionar sin conexión y conservar intactos los registros existentes.
- Todas las fechas se interpretan según el calendario local de la persona, incluidos cambios de mes, año y horario.

## Casos límite
- Una sesión por día y varias sesiones el mismo día; los minutos se suman antes de elegir nivel.
- Totales decimales positivos, sumas como 0,1 + 0,2 min, valores próximos a los umbrales y valores exactamente iguales a 30, 60 y 120 minutos.
- Inicio del período a mitad de mes o de año; semana actual que cruza un cambio de mes o año.
- Día de hoy sin sesiones, días pasados sin sesiones y días futuros con sesiones ya registradas.
- Entradas nulas o incompletas, fechas inválidas, minutos no utilizables, colección ilegible y ausencia real de sesiones, sin pérdida de información ni confundir indisponibilidad con cero.
- Consulta cerca de medianoche y durante un cambio de horario: cada casilla representa un día local, no un intervalo fijo de horas; guardar después de medianoche actualiza la referencia temporal.

## Fuera de alcance
- Navegar a otras semanas o personalizar el período visible.
- Editar, crear o eliminar sesiones desde el mapa.
- Mostrar temas, listado de sesiones o comparaciones detalladas al consultar una casilla.
- Ajustar automáticamente los niveles de intensidad según el máximo del período.
- Actualizar el período automáticamente, sin una nueva acción de la persona, mientras la página permanece abierta al cruzar la medianoche; sí se ajusta al guardar una sesión o al volver a abrir el diario.

## Criterios de finalización
- El mapa muestra las 12 semanas definidas, con los días futuros diferenciados y sin actividad atribuida.
- Los totales, niveles y límites fijos coinciden con sesiones de prueba que cubran duplicados, umbrales y cambios de mes/año.
- Los cálculos de fechas, totales y niveles superan pruebas automatizadas antes de dar por finalizada la funcionalidad.
- El detalle de fecha y minutos se puede consultar y cerrar con puntero, teclado y toque; la escala es comprensible sin depender solo del color.
- El mapa responde a una nueva sesión sin recarga y mantiene el resultado tras volver a abrir el diario.
- Los datos existentes permanecen intactos; los datos ilegibles no se presentan como días sin estudio. El mapa funciona en móvil y sin conexión.

## Dudas abiertas
- Ninguna. Las decisiones de alcance, período, niveles e interacción quedan fijadas para esta versión.

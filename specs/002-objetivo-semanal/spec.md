# Objetivo semanal de estudio

**Estado: aprobada**

## Contexto y objetivo
El Diario de Estudio muestra los minutos estudiados esta semana, pero no permite compararlos con una intención personal. La persona podrá fijar una meta de minutos distinta para cada semana y consultar cuánto avanzó en la semana actual y en las anteriores, para motivarse y reconocer sus logros sin alterar sus sesiones.

## Usuarios
- Persona que registra sus propias sesiones y quiere seguir sus objetivos semanales.

## Historias de usuario
- Como estudiante, quiero fijar y ajustar mi meta de esta semana para ver cuánto me falta o si ya la cumplí.
- Como estudiante, quiero consultar las semanas anteriores y editar sus metas para comparar mi estudio con mis objetivos de cada semana.
- Como estudiante, quiero reconocer claramente cuándo he alcanzado una meta.

## Requisitos funcionales

### RF-1. Semanas consultables
Una semana va del lunes al domingo según el calendario local de la persona. Se muestra la semana actual y las 11 anteriores, ordenadas e identificables por sus fechas; no se muestran semanas futuras. La consulta histórica no elimina objetivos de semanas más antiguas.

- **CA-1.1 (EARS):** Cuando se consulte el objetivo semanal, el sistema deberá mostrar la semana local actual y las 11 anteriores, identificadas por sus respectivos intervalos de lunes a domingo, incluso al cruzar mes o año.
- **CA-1.2 (EARS):** Cuando cambie la semana local y la persona vuelva a abrir el diario o realice la siguiente acción en la página ya abierta, el sistema deberá actualizar las 12 semanas visibles según la nueva fecha local sin borrar las metas que queden fuera de ellas.
- **CA-1.3 (EARS):** Cuando una meta pertenezca a una semana anterior a las 12 visibles, el sistema deberá conservarla sin mostrar esa semana en esta vista.
- **CA-1.4 (EARS):** Si la persona intenta guardar una edición iniciada antes del cambio de semana y la semana seleccionada ya no está entre las 12 visibles, el sistema deberá actualizar el período visible, avisar que esa edición no se ha guardado y conservar la meta anterior.

### RF-2. Meta semanal y edición
Cada semana tiene su propia meta de minutos. Si nunca se ha fijado una meta para una semana, se aplica automáticamente una meta de 30 minutos, sin convertirla en una meta explícitamente guardada. La persona puede fijar o cambiar la meta de cualquiera de las 12 semanas visibles; una edición no modifica las metas de otras semanas ni las sesiones.

- **CA-2.1 (EARS):** Si no hay una meta fijada para una semana visible, el sistema deberá mostrar y usar 30 minutos como meta de esa semana.
- **CA-2.2 (EARS):** Cuando la persona guarde una meta de minutos mayor que cero para una semana seleccionada que siga visible, el sistema deberá aplicar esa meta solo a la semana seleccionada explícitamente, aunque haya cambiado la semana local desde que se abrió la página, y mostrar inmediatamente su progreso actualizado.
- **CA-2.3 (EARS):** Cuando la persona vuelva a abrir el diario después de editar una meta, el sistema deberá mostrar la meta guardada para esa semana, separada de las sesiones ya registradas y sin alterar estas últimas.
- **CA-2.4 (EARS):** Si la persona intenta guardar una meta vacía, no numérica, no finita o menor o igual que cero, el sistema deberá explicar que la meta debe ser un número positivo de minutos y conservar la meta anterior.
- **CA-2.5 (EARS):** Cuando una semana tenga una meta fijada explícitamente en 30 minutos, el sistema deberá mantenerla como meta de esa semana sin confundirla con la ausencia de meta.
- **CA-2.6 (EARS):** Cuando la persona introduzca una meta decimal positiva usando coma o punto, el sistema deberá aceptar ambas formas como el mismo valor (por ejemplo, 30,5 y 30.5) y conservar ese valor exacto al guardarlo, sin redondearlo.

### RF-3. Progreso por semana
El progreso es la suma de los minutos de todas las sesiones utilizables de esa semana, desde el lunes hasta el domingo, sin contar fechas posteriores al día local de hoy. Una sesión utilizable también debe tener un tema con contenido, no solo espacios. Se presenta redondeado al minuto entero más cercano junto con la meta de esa misma semana, también redondeada, incluso si el progreso es cero o supera la meta. Varias sesiones de un mismo día suman todas sus duraciones; los valores guardados no se redondean ni se modifican.

- **CA-3.1 (EARS):** Cuando se consulte una semana visible, el sistema deberá mostrar los minutos estudiados y su meta de esa semana, sumando todas las sesiones utilizables de sus días transcurridos hasta hoy.
- **CA-3.2 (EARS):** Si hay sesiones con fecha posterior a hoy, el sistema no deberá atribuir sus minutos al progreso, aunque su fecha caiga dentro de la semana actual.
- **CA-3.3 (EARS):** Cuando se registre una sesión para una semana visible, el sistema deberá actualizar el progreso de esa semana y su estado de logro sin exigir recargar la página.
- **CA-3.4 (EARS):** Cuando se edite una meta, el sistema deberá recalcular inmediatamente la comparación con los minutos ya estudiados, sin modificar ni duplicar el progreso.
- **CA-3.5 (EARS):** Cuando los minutos acumulados o la meta tengan decimales, el sistema deberá redondear cada total por separado al minuto entero más cercano antes de presentarlos y compararlos para el logro; una fracción de 0,5 minuto se redondea hacia arriba (29,5 → 30; meta 30,5 → 31), sin alterar los valores guardados ni las sesiones.
- **CA-3.6 (EARS):** Si una sesión tiene fecha y minutos válidos pero el tema está ausente, vacío o contiene solo espacios, el sistema no deberá sumar sus minutos al progreso ni considerarlos para el logro, y deberá conservar esa sesión guardada.

### RF-4. Logro
Una semana alcanza su meta cuando su progreso, redondeado al minuto entero más cercano, es igual o superior a la meta vigente redondeada del mismo modo. El logro se indica de forma especial y textual, no solo con un cambio de color; la presentación y la comparación usan los mismos minutos enteros, aunque los valores exactos guardados sean distintos.

- **CA-4.1 (EARS):** Cuando el progreso redondeado de una semana sea igual o superior a su meta redondeada, el sistema deberá indicar expresamente que la meta está cumplida, tanto en la semana actual como en las semanas históricas visibles (por ejemplo, 29,99 frente a 30 muestra 30 de 30 min y se considera cumplida).
- **CA-4.2 (EARS):** Cuando el progreso redondeado sea inferior a la meta redondeada, el sistema deberá mostrarlo como pendiente y no indicar que se ha cumplido (por ejemplo, progreso 30 frente a meta 30,5 muestra 30 de 31 min).
- **CA-4.3 (EARS):** Cuando una edición de meta o una nueva sesión cambie el resultado de la comparación, el sistema deberá actualizar de inmediato la indicación de logro correspondiente.

### RF-5. Conservación y datos no utilizables
Las metas se conservan independientemente de las sesiones; el historial ya registrado conserva su formato y contenido. Las entradas de sesiones no utilizables no contribuyen al progreso, pero tampoco se alteran. Los datos ilegibles no deben confundirse con ausencia de actividad o de metas.

- **CA-5.1 (EARS):** Cuando se consulten o editen metas, el sistema deberá preservar todas las sesiones guardadas y las metas de semanas no visibles.
- **CA-5.2 (EARS):** Si una sesión es nula, incompleta, tiene fecha inválida, tema ausente, vacío o compuesto solo de espacios, o minutos no numéricos, no finitos o no positivos, el sistema deberá omitirla del progreso sin modificar los datos guardados.
- **CA-5.3 (EARS):** Si las sesiones guardadas no se pueden leer como colección válida, el sistema deberá indicar que el progreso no está disponible, sin mostrar cero o un logro como si fueran resultados fiables y sin sustituir esas sesiones.
- **CA-5.4 (EARS):** Si los datos de metas guardados no se pueden leer o no tienen forma de colección válida, el sistema deberá avisar que las metas no están disponibles, no sustituirlos por metas predeterminadas ni sobrescribirlos al intentar editar; una entrada individual inválida dentro de una colección válida no deberá hacer indisponible toda la colección.
- **CA-5.5 (EARS):** Si no existen metas guardadas y las sesiones están disponibles, el sistema deberá usar 30 minutos para cada semana visible y permitir fijar metas sin perder sesiones previas.
- **CA-5.6 (EARS):** Si una colección válida de metas contiene una entrada individual inválida cuya semana se puede identificar, o varias metas para la misma semana, el sistema deberá mostrar «Objetivo no disponible» y bloquear la edición solo de esa semana cuando sea visible, conservando sin borrar ni sobrescribir las entradas dudosas; las demás semanas válidas o sin meta deberán seguir funcionando con sus metas respectivas o con el valor predeterminado.
- **CA-5.7 (EARS):** Si una colección válida de metas contiene una entrada inválida cuya semana no se puede identificar, el sistema deberá conservarla sin aplicarla ni bloquear la consulta o edición de ninguna semana; las semanas sin meta identificable deberán seguir usando la meta predeterminada.

## Requisitos no funcionales
- Interfaz, avisos e indicaciones en español, con buena legibilidad y contraste en móvil y escritorio.
- Metas y progreso comprensibles sin depender exclusivamente de colores; controles de consulta y edición utilizables con teclado, puntero y toque.
- La funcionalidad debe poder usarse sin conexión y respetar las fechas locales, incluso al cambiar de mes, año o horario.
- Los datos ya registrados deben seguir siendo legibles y no perderse por introducir las metas.

## Casos límite
- Inicio o fin de semana en distintos meses o años; cambio de semana tras volver a abrir el diario o en la siguiente acción con la página abierta, sin temporizador.
- Semana sin sesiones ni meta explícita: 0 de 30 min, pendiente; semana con meta explícita de 30 min.
- Varias sesiones en el mismo día y sesiones de distintos días de una semana pasada.
- Sesión con fecha y minutos válidos pero tema ausente, cadena vacía o solo espacios: no suma al progreso ni cambia el logro; permanece guardada. Comprobarla junto a una sesión utilizable de la misma semana para verificar que solo esta última suma.
- Sesión futura dentro de la semana actual: no aporta minutos ni anticipa un logro; sesiones fuera de las 12 semanas tampoco se atribuyen a otra semana.
- Progreso exactamente igual a la meta redondeada, inmediatamente inferior o superior tras redondear cada lado; cambios de meta que activan o desactivan el logro.
- Progreso 29,99 frente a meta 30: 30 de 30 min, cumplida; progreso 29,5 frente a meta 30,5: 30 de 31 min, pendiente. Redondeo de la suma semanal, no de cada sesión; valores exactos conservados.
- Entrada decimal de meta con coma o punto: 30,5 y 30.5 producen el mismo valor guardado y se muestran como 31 min en la comparación.
- Meta ingresada inválida; entrada de meta inválida con semana identificable o duplicada: solo su semana queda indisponible y bloqueada. Entrada inválida sin semana identificable en colección válida: se conserva sin aplicarse ni bloquear ninguna semana; las semanas sin meta usan 30 min. Colección de metas ilegible o sin forma de colección válida: todas las metas quedan indisponibles. Sesión inválida o colección de sesiones ilegible: distinguir progreso indisponible de cero y conservar lo almacenado.
- Meta de una semana que sale de la ventana visible: se conserva aunque no pueda consultarse en esta vista. Si la edición pendiente apuntaba a esa semana, no se guarda al intentar confirmarla tras el cambio; si sigue visible, se edita la semana seleccionada, no la nueva semana actual.

## Fuera de alcance
- Navegar a semanas anteriores a las 12 visibles o a semanas futuras, aunque sus metas anteriores se conserven.
- Crear, editar o eliminar sesiones desde la vista de objetivos.
- Eliminar metas explícitas, definir una meta global o copiar automáticamente una meta de una semana a otra.
- Notificaciones, recordatorios, premios, recomendaciones de metas o predicciones del resultado al terminar la semana.
- Corregir o modificar el mapa de calor existente.
- Actualizar la ventana por temporizador mientras no haya acciones de la persona; el cambio se refleja en su siguiente acción o al reabrir el diario.

## Criterios de finalización
- La persona ve 12 semanas locales, sus metas y progresos; puede editar metas actuales y pasadas visibles, y recuperarlas al volver a abrir el diario.
- Una semana sin meta fijada usa 30 min; una meta guardada afecta solo a su semana, y las metas fuera de la ventana visible permanecen conservadas.
- Los progresos y logros concuerdan con las sesiones utilizables hasta hoy y con el redondeo de ambos totales antes de comparar, incluidos varios registros por día, semanas que cruzan año, decimales, fechas futuras y sesiones con tema ausente o vacío que se conservan pero no suman; cambian inmediatamente al editar meta o registrar sesión.
- Entradas individuales de meta inválidas o duplicadas bloquean solo la semana identificable sin sobrescribir datos dudosos; las entradas sin semana identificable se conservan sin aplicarse ni bloquear otras, y solo una colección ilegible o sin forma válida deja indisponibles todas las metas. Se verifican estos casos y los cálculos con pruebas automatizadas antes de completar la funcionalidad.
- Tras cambiar la semana con la página abierta, la siguiente acción actualiza la ventana; una edición de una semana que salió de ella no se guarda y una semana que sigue visible conserva su selección explícita.
- La consulta y edición son utilizables con teclado, puntero y toque, funcionan sin conexión y se ven correctamente en móvil.

## Dudas abiertas
- Ninguna para este alcance.

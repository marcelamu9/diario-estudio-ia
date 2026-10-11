# Rediseño visual — mesa de estudio digital oscura

**Estado: aprobada** — cambio de requisitos aprobado por la persona mediante «sí», según confirmación recibida para la fase SDD 3. Sustituye la dirección visual anterior; la implementación requiere aprobar el nuevo plan y resolver la regla visual contradictoria vigente.

**Nota de aprobación (2026-10-08):** Se aprueba íntegramente esta especificación de mesa de estudio digital oscura, contrastada, compacta y sans serif, sin modificar RF ni criterios de aceptación. Las referencias internas a «borrador», «propuesta» o aprobación pendiente describen la etapa de redacción y quedan resueltas por esta nota. La aprobación de la spec no equivale a elegir una paleta concreta: esta se propone en el nuevo plan para aprobación independiente.

## Contexto y objetivo
La petición reciente es «volvamos a crear el rediseño visual, para que se vea una interfaz moderna y creativa, ya que el diseño actual es horrible». La persona ratifica que no debe cambiar ninguna funcionalidad ni dato y elige explícitamente «oscura y mas contratada», entendido como oscura y más contrastada.

Se propone para aprobación una «mesa de estudio digital»: superficies oscuras, texto claro, tipografía sans serif nítida y composición compacta que priorice registrar, consultar el progreso y recorrer el historial. La creatividad procede de la composición y la jerarquía, no de adornos ni bloques gigantes. Esta propuesta reemplaza el papel azul pálido, la tinta azul, la serif editorial y el protagonismo de grandes bloques de rachas de la dirección anterior. No hay una paleta de acento elegida por la persona; cualquier propuesta cromática concreta requerirá aprobación y deberá cumplir los contrastes indicados.

## Usuarios
- Persona que registra sesiones de estudio y consulta rachas, resúmenes, objetivos, mapa e historial tanto en móvil como en escritorio.

## Historias de usuario
- Como estudiante, quiero encontrar primero cómo registrar una sesión y reconocer después mi progreso, distinguiendo mi racha de mi récord sin mascotas ni adornos.
- Como estudiante, quiero leer resúmenes, objetivos, mapa y sesiones en una interfaz oscura, contrastada y compacta, sin que grandes bloques desplacen mi tarea principal.
- Como estudiante que usa el móvil, quiero registrar sesiones y editar metas con comodidad, sin perder información ni desplazar horizontalmente toda la página.

## Requisitos funcionales

### RF-1. Identidad oscura y jerarquía de uso
La apariencia propuesta es una mesa de estudio digital oscura, sin mascotas. Registrar es la tarea principal; las rachas y resúmenes comunican progreso sin convertirse en una portada que aleje los controles. Títulos, cifras y lectura usan sans serif y una jerarquía reconocible, sin sacrificar etiquetas ni unidades.

- **CA-1.1 (EARS):** Cuando se abra el diario con o sin sesiones, el sistema deberá presentar fondo y superficies principales oscuros, texto claro y títulos, cifras y controles sans serif, sin papel azul pálido, serif editorial ni mascotas; los acentos no deberán sustituir etiquetas ni estados textuales.
- **CA-1.2 (EARS):** Cuando se recorra la página en móvil o escritorio, el sistema deberá dar prioridad visual al registro de sesión, después al progreso (rachas, resúmenes, objetivos y mapa) y finalmente al historial, distinguiendo racha actual y mejor racha por sus etiquetas y manteniendo significado, cifra y unidad incluso con cero o varios dígitos.
- **CA-1.3 (EARS):** Cuando se recorra el resto de la página, el sistema deberá diferenciar títulos, cifras, texto de apoyo y acciones mediante tamaño, peso, espacio y alineación coherentes, sin usar solo color para establecer la jerarquía.

### RF-2. Áreas de trabajo conectadas
Resúmenes, objetivos semanales, mapa de días estudiados, registro e historial conservan sus nombres y significado, presentados como áreas de trabajo compactas y relacionadas mediante alineación, agrupación y espacio. No se añaden etiquetas ornamentales, indicadores o mensajes que sugieran funciones nuevas.

- **CA-2.1 (EARS):** Cuando la persona recorra la página, el sistema deberá mantener distinguibles los apartados de resúmenes, objetivos, mapa, formulario de sesión y sesiones, con separaciones discretas y un orden de lectura claro, sin convertirlos en una serie de tarjetas visualmente idénticas.
- **CA-2.2 (EARS):** Cuando existan 12 semanas de objetivos o varias sesiones, el sistema deberá permitir reconocer dónde empieza y termina cada semana o sesión y relacionar sus cifras con su etiqueta o fecha, sin que las líneas divisorias compitan con los datos.
- **CA-2.3 (EARS):** Si no existen sesiones o algún dato está indisponible, el sistema deberá conservar visibles y legibles los estados vacíos o avisos correspondientes, diferenciándolos de un resultado confirmado de cero.

### RF-3. Mapa y escala legibles
El mapa conserva sus 12 semanas, estados, consulta por día y umbrales actuales. Su presentación debe encajar con la nueva identidad; la escala explica los rangos en texto y permite distinguir ausencia de estudio, niveles de actividad y día futuro.

- **CA-3.1 (EARS):** Cuando se muestre el mapa, el sistema deberá presentar casillas y una escala legible que asocie cada muestra con su intervalo textual, incluidos «Sin estudio» y «Día futuro», sin exigir interpretar únicamente el color.
- **CA-3.2 (EARS):** Cuando se consulte una casilla con puntero, teclado o toque, el sistema deberá mantener perceptibles la casilla consultada y su detalle de fecha y minutos o su condición de futuro, sin ocultarlos bajo otros elementos.
- **CA-3.3 (EARS):** Cuando el mapa necesite más ancho que el espacio disponible, el sistema deberá permitir recorrerlo por separado sin desplazar horizontalmente toda la página y sin perder acceso a su leyenda o detalle.

### RF-4. Formularios, acciones y retroalimentación
Registrar una sesión y consultar o editar una meta siguen siendo tareas distintas, con controles, ayudas y avisos comprensibles. El rediseño mejora la comodidad visual y táctil, pero no modifica validaciones, valores permitidos, efectos de guardar ni mensajes que comunican estados funcionales.

- **CA-4.1 (EARS):** Cuando la persona use el formulario de sesión o el de objetivos en móvil, el sistema deberá mostrar etiquetas y ayudas junto a sus controles, campos y acciones íntegros y fáciles de pulsar, sin superposiciones ni recortes; los controles de uso táctil deberán disponer de al menos 44 × 44 px de área accionable.
- **CA-4.2 (EARS):** Cuando un dato sea inválido, no pueda leerse o no pueda guardarse, el sistema deberá mostrar el aviso existente de forma perceptible y asociada a la tarea afectada, con texto comprensible y una distinción visual que no dependa solo del color.
- **CA-4.3 (EARS):** Cuando se guarde una meta o una sesión, el sistema deberá mantener reconocibles los estados de confirmación y los datos que ya se actualizan actualmente, sin introducir pasos adicionales en el flujo.
- **CA-4.4 (EARS):** Cuando una semana indique meta cumplida, pendiente o indisponible, el sistema deberá mantener su indicación textual diferenciada y legible junto a la semana correspondiente.

### RF-5. Accesibilidad y adaptación
La identidad debe seguir siendo legible y operable a distintos tamaños y mediante teclado, puntero o toque. El foco, los avisos y los estados tienen que permanecer claros en todas las superficies del nuevo diseño.

- **CA-5.1 (EARS):** Cuando se vea la página a 320 px, 375 px o ancho de escritorio, el sistema deberá preservar el orden de lectura, evitar desbordamiento horizontal de la página y mostrar títulos, cifras, formularios, leyenda y sesiones sin texto cortado; solo el mapa podrá desplazarse horizontalmente dentro de su propio espacio.
- **CA-5.2 (EARS):** Cuando se navegue con teclado por controles, botones y casillas consultables, el sistema deberá mostrar un foco visible y no recortado que se distinga de sus estados normales y de selección.
- **CA-5.3 (EARS):** Cuando se lea texto normal o texto grande sobre cualquier superficie del nuevo diseño, el sistema deberá mantener una relación de contraste de al menos 4,5:1 o 3:1, respectivamente; los límites o indicadores visuales necesarios para identificar controles y estados deberán alcanzar al menos 3:1 frente a sus colores adyacentes.
- **CA-5.4 (EARS):** Cuando se use puntero, teclado o toque para las interacciones existentes del mapa y de los formularios, el sistema deberá conservar la misma información y acciones disponibles para cada modalidad, sin depender de efectos exclusivos de pasar el puntero.

### RF-6. Continuidad de comportamiento y datos
Este cambio es exclusivamente visual. Permanecen las funciones de registro, listado, rachas, resúmenes, consulta del mapa y objetivos semanales, sus estados de error y sus reglas actuales de cálculo y persistencia. No se reinterpreta una fecha, duración, meta o sesión guardada.

- **CA-6.1 (EARS):** Cuando la persona abra el diario con datos ya guardados, el sistema deberá mostrar sus sesiones y metas como antes, sin borrar, migrar ni alterar los valores persistidos por el rediseño.
- **CA-6.2 (EARS):** Cuando la persona registre una sesión o edite una meta, el sistema deberá conservar las validaciones, la actualización visible, la consulta histórica y la persistencia previas, incluso tras volver a abrir el diario.
- **CA-6.3 (EARS):** Si hay datos ausentes, inválidos o ilegibles, el sistema deberá conservar el comportamiento funcional previo de cada vista y sus avisos, sin convertir datos indisponibles en ceros ni sobrescribirlos.
- **CA-6.4 (EARS):** Cuando se consulten rachas, resúmenes, objetivos o el mapa tras el rediseño, el sistema deberá aplicar las reglas existentes sin cambiar sus cálculos, intervalos ni criterios de inclusión de sesiones o fechas futuras.

Los contratos funcionales de las specs 001 y 002 siguen vigentes: períodos, umbrales, decimales, fechas locales, consulta y cierre del detalle, edición histórica, actualización por acciones y protección de datos. Solo se sustituye la identidad visual anterior, incluida la referencia rosa-violeta de 001, no sus reglas. La excepción conocida del mapa se documenta como defecto pendiente, no como comportamiento correcto ni como permiso para alterar otros resultados.

### RF-7. Composición compacta sin nuevas interacciones
El rediseño debe acercar el registro y reducir el espacio dedicado a bloques de cifras, sin conseguirlo ocultando contenido ni reduciendo legibilidad. Estos criterios concretan la propuesta de composición, pendiente de aprobación junto con este borrador.

- **CA-7.1 (EARS):** Cuando se abra el diario a 375 × 812 px o 1280 × 800 px, con tamaño de texto predeterminado y sin avisos abiertos, el sistema deberá mostrar el título «Registrar sesión» y su primer campo en la primera pantalla, sin recorrer antes las 12 semanas de objetivos.
- **CA-7.2 (EARS):** Cuando se vea la página a 375 px o 1280 px de ancho con rachas de cero a cuatro dígitos y texto predeterminado, el sistema deberá presentar ambas rachas y los dos resúmenes en un conjunto de altura no superior a 320 px, con sus etiquetas y unidades completas.
- **CA-7.3 (EARS):** Cuando la persona recorra registro, progreso e historial, el sistema deberá conservar accesible todo el contenido existente sin añadir pestañas, desplegables de sección, filtros, navegación, controles de tema ni pasos adicionales para consultarlo.
- **CA-7.4 (EARS):** Si el texto ampliado, cifras mayores o avisos requieren más espacio, el sistema deberá permitir crecer a las áreas de contenido y mantener la lectura y el orden de navegación coherentes con su disposición visual, sin recortes ni superposiciones para cumplir la compacidad.

## Requisitos no funcionales
- Interfaz y avisos en español, visualmente coherentes y legibles tanto en móvil como en escritorio.
- Experiencia disponible sin conexión, sin requerir red para que la apariencia o las funciones existentes sean utilizables.
- No se incorporan dependencias ni recursos que requieran red.
- La presentación no debe introducir contenido meramente decorativo, animaciones ni efectos de movimiento; la diferenciación visual procede de composición, tipografía y contraste al servicio del registro y la consulta.
- Las indicaciones textuales, etiquetas y asociaciones de ayuda o error deben seguir disponibles para tecnologías de apoyo.

## Casos límite
- Diario sin sesiones: rachas y resúmenes a cero, lista vacía, mapa sin actividad transcurrida y objetivos por defecto; todos distinguibles de datos indisponibles.
- Cifras de varios dígitos, temas largos y fechas o intervalos extensos: ninguna etiqueta, unidad, cifra ni acción se corta o pisa.
- 12 semanas de objetivos con distintas metas y estados, avisos simultáneos de sesiones y metas ilegibles, semana bloqueada y edición inválida: cada aviso queda junto a su contexto y se distingue del éxito.
- Mapa con días futuros, sin estudio, los cuatro niveles y detalle abierto; a ancho estrecho el desplazamiento queda dentro del mapa y el detalle y la escala continúan consultables.
- Teclado sin puntero y pantalla táctil: acceso al detalle del mapa, a ambos formularios y al foco visible, también cuando hay errores.
- Cambio de día o semana local y sesiones con fecha futura: la apariencia no cambia las reglas existentes de actualización o de cómputo.
- Borde conocido de RF-3 del mapa anterior (29,99999999999999 min presentado como 30/nivel 2): no se considera corregido ni se incluye su reparación en esta spec.
- Texto ampliado al 200 %, rachas de más de cuatro dígitos y avisos simultáneos: las áreas pueden crecer más allá de la altura compacta de referencia, sin ocultar información ni controles.
- Superficies oscuras con texto secundario, campos, selector abierto, foco, detalle del mapa y estados de error o logro: se comprueba el contraste en cada estado, no solo en el texto principal; no se confunden ausencia de estudio y futuro.
- Preferencia clara del dispositivo o apertura sin conexión: la propuesta sigue siendo oscura y usable, sin añadir selector de apariencia ni descargar fuentes u otros recursos.

## Fuera de alcance
- Añadir, retirar o cambiar funcionalidades, reglas de cálculo, validaciones, períodos visibles o interacciones actuales.
- Corregir el defecto conocido de RF-3 del mapa u otros defectos numéricos o de fechas.
- Modificar el formato o contenido de los datos ya guardados, o agregar nuevas formas de persistencia.
- Añadir nuevas vistas, textos promocionales, animaciones o funciones de personalización de la apariencia.

## Criterios de finalización
- Tras aprobar este borrador, la identidad acordada deberá reconocerse en toda la página: superficies oscuras, texto claro contrastado, sans serif y composición compacta sin mascotas, adornos ni grandes bloques de rachas dominantes.
- Registro, progreso e historial forman un recorrido claro y coherente que cumple RF-7; la escala y los estados de error, vacío y logro se entienden sin depender solo del color.
- A 320 px, 375 px y escritorio no hay desbordamiento horizontal de la página; controles táctiles, foco visible y contraste cumplen los criterios anteriores.
- Se comprueban los flujos existentes de registro, edición y consulta con datos vacíos, guardados e ilegibles, antes y después de reabrir el diario; el rediseño no altera sus resultados ni los datos persistidos.

## Aprobación y acción documental posterior
- Confirmado y aprobado por la persona: dirección oscura y más contrastada, composición compacta y tipografía sans serif, sin cambios funcionales ni de datos. Ninguna paleta concreta se atribuye a la persona; requiere aprobación del plan.
- En esta fase SDD 3, solicitada expresamente, se sustituyen el plan y las tareas anteriores. T1 y T2 estaban completas para la dirección anterior; T3 quedó interrumpida con parciales según el coordinador y nunca se marcó completa. El nuevo plan conserva ese historial como supersedido, sin trasladar cumplimiento a las nuevas tareas identificadas con prefijo OSC.
- Antes de implementar, un agente autorizado deberá actualizar la regla visual vigente de `AGENTS.md`: exige cuaderno de campo, papel azul pálido, tinta azul, cobalto y verde pino y contradice la spec aprobada. Este planner solo modifica documentos de `specs/003-rediseno-visual/`; no modifica ahora `AGENTS.md`, `MEMORY.md`, interfaz ni JavaScript.

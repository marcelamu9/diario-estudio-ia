# Diario de Estudio · Desarrollo con IA

Aplicación web para registrar sesiones de estudio, seguir rachas y consultar objetivos semanales.

Este proyecto se realizó como ejercicio de aprendizaje durante el **Curso de desarrollo con IA de Big School by Brais Moure**, utilizando **OpenCode**. Su propósito principal es practicar los fundamentos del desarrollo asistido por IA: dar contexto a un agente, definir requisitos, implementar por tareas y comprobar los resultados.

El repositorio recoge tanto la aplicación como la documentación del proceso. Es un proyecto personal de aprendizaje, no un producto oficial del curso.

## Funcionalidades

- **Registro de sesiones:** fecha local editable, tema y minutos de estudio.
- **Rachas:** racha actual y mejor racha histórica. Varias sesiones en un mismo día cuentan una sola vez; si hoy aún no hay sesión pero ayer sí, la racha sigue activa.
- **Resúmenes:** minutos estudiados esta semana y días distintos estudiados este mes.
- **Mapa de calor:** 12 semanas de actividad, con intensidad según los minutos de cada día y consulta de fecha y duración.
- **Objetivos semanales:** metas independientes para la semana actual y las 11 anteriores, con 30 minutos por defecto e indicación de logro. El progreso y la meta se redondean por separado al minuto entero antes de compararlos, conservando los valores guardados.
- **Persistencia local:** sesiones y metas se conservan al recargar el navegador.

La interfaz está en español y se adapta a pantallas móviles y de escritorio.

## Cómo probarlo

1. Descarga el repositorio desde **Code → Download ZIP** en GitHub y descomprímelo, o clónalo.
2. Abre `index.html` con doble clic en un navegador.
3. Registra una sesión y consulta los indicadores de progreso.
4. Fija un objetivo semanal y recarga la página para comprobar que se conserva.

**No necesitas instalar dependencias, compilar ni levantar un servidor.** La aplicación utiliza archivos locales y funciona sin conexión.

### Dónde se guardan los datos

Los datos se guardan en el `localStorage` del navegador, separados en dos claves:

- `diario-de-estudio-sesiones`
- `diario-de-estudio-metas-semanales`

No hay cuenta de usuario, backend ni sincronización entre dispositivos. Borrar los datos del navegador puede eliminar las sesiones y las metas. Al abrir archivos mediante `file://`, la disponibilidad del almacenamiento depende del navegador y de la ubicación del archivo; mover el proyecto o abrirlo en otro navegador puede hacer que los datos anteriores no aparezcan.

## Tecnologías y estructura

HTML, CSS y JavaScript puros, sin frameworks ni paso de compilación. Node.js se utiliza para ejecutar las pruebas, no para abrir la aplicación.

| Archivo o carpeta | Contenido |
| --- | --- |
| `index.html` | Estructura de la interfaz. |
| `styles.css` | Presentación y adaptación a distintos tamaños. |
| `app.js` | Interacción, actualización de la interfaz y almacenamiento local. |
| `heat-map.js` | Lógica del mapa de calor. |
| `weekly-goals.js` | Lógica de objetivos y progreso semanal. |
| `tests/` | Pruebas automatizadas. |
| `specs/` | Especificaciones, planes y tareas de las funcionalidades. |
| `docs/constitution.md` | Principios del proyecto. |
| `AGENTS.md` | Instrucciones para trabajar con agentes en el repositorio. |
| `MEMORY.md` | Estado y decisiones para dar continuidad entre sesiones. |

## Pruebas

Con Node.js instalado, ejecuta desde la carpeta del proyecto:

```sh
node --test
```

Para ejecutar un grupo concreto:

```sh
node --test tests/heat-map.test.js
node --test tests/weekly-goals.test.js
```

Las pruebas cubren lógica de fechas locales, períodos, sumas, metas, redondeos y estados de datos. La revisión de apariencia e interacción se complementa con **Chrome DevTools**, incluyendo vista móvil, consola, persistencia y funcionamiento sin conexión.

## Qué he practicado con OpenCode

- Dar contexto mediante instrucciones del proyecto y memoria entre sesiones.
- Trabajar con **SDD (desarrollo guiado por especificaciones)**: aclarar la idea, redactar la spec, revisarla, planificar, implementar y validar.
- Separar responsabilidades de planificación, implementación y revisión entre agentes.
- Escribir pruebas antes de la lógica nueva y verificar regresiones.
- Tratar fechas locales y proteger los datos ya guardados.
- Iterar sobre el diseño a partir de referencias y comprobaciones en el navegador.
- Contrastar los resultados con los requisitos: una suite en verde no garantiza que todos los casos estén cubiertos.

## Estado y limitaciones conocidas

El registro de sesiones, los objetivos y los indicadores están implementados. La interfaz tiene una dirección oscura y un panel unificado de progreso; **el rediseño visual global todavía tiene tareas pendientes** en [la spec 003](specs/003-rediseno-visual/tasks.md).

Existe un defecto conocido de precisión en el mapa de calor: un valor de `29,99999999999999` minutos puede mostrarse como 30 y asignarse al nivel siguiente. La revisión lo detectó aunque las pruebas existentes pasaban. Su corrección sigue pendiente y es independiente del redondeo intencional de los objetivos semanales.

## Créditos

Proyecto de aprendizaje realizado siguiendo el **Curso de desarrollo con IA de Big School by Brais Moure**. **OpenCode** se utilizó como herramienta de asistencia al desarrollo, planificación y revisión.

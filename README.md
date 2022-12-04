# El Mundo de Floresta

Un juego que trata sobre un mono que busca salvar a sus tierras de la corrupción provocada por un ente maligno.

<p align="center">
    <img src="https://user-images.githubusercontent.com/47804156/205518756-0c263163-0b48-473b-8dd8-3249121ac355.png" title="Logotipo de 'El Mundo de Floresta'" alt="El Mundo de Floresta">
</p>

<p align="center">
    <a href="https://github.com/ComplexRalex/gamedev-final-project/releases/latest"><img src="https://img.shields.io/github/v/release/ComplexRalex/gamedev-final-project" alt="GitHub release (latest by date)"/></a>
    <a href="https://github.com/ComplexRalex/gamedev-final-project/releases/latest"><img src="https://img.shields.io/github/release-date/ComplexRalex/gamedev-final-project" alt="GitHub Release Date"/></a>
    <a href="https://github.com/ComplexRalex/gamedev-final-project/commit/main"><img src="https://img.shields.io/github/last-commit/ComplexRalex/gamedev-final-project" alt="GitHub last commit"/></a>
    <a href="https://github.com/ComplexRalex/gamedev-final-project/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ComplexRalex/gamedev-final-project" alt="GitHub License"/></a>
</p>

## Descripción

Este es un juego desarrollado por mí y mi equipo (*Kaiser Rocket Team*) para el curso de Desarrollo de Videojuegos en la universidad. Se desarrolló con el framework de JavaScript Phaser 2D.

## Sinopsis

El mundo de **Floresta** está decayendo rápidamente debido a que la esmeralda de la vida fue fragmentada. Los héroes que alguna vez pudieron protegerla… han caído.

Sin embargo, una voz discordante se niega a sucumbir.

*Nor*, el mono, es el único guerrero que sigue en pie, y hará lo imposible para impedir el fatal destino, teniendo que enfrentarse con *Barry*, quien fue el responsable del desastre.

El guerrero tiene que enfrentarse cara a cara con diversos enemigos durante su camino rumbo a la salvación de los habitantes y de él mismo. Cada uno de los fragmentos se encuentran ocultos o custodiados por una o más entidades corruptas en diferentes zonas del planeta.

* La Selva “Zipela”.
* El Bosque “Haru”.
* El Cerro “Efron”.
* La cueva del santuario.

## Gameplay

Eres un monito que debe aventurarse a través de las tierras de **Floresta** en busca de los fragmentos de la esmeralda de la vida. Te enfrentarás con enemigos como serpientes y lobos, y tendrás que combatir a los jefes de cada nivel.

Podrás defenderte con las diferentes armas que encontrarás por el camino, como una espada, un arco con flechas, y bombas.

Algunos caminos se encontrarán bloqueados, por lo que tendrás que hacer uso de algunas armas o llaves para poder abrirte paso.

## Controles

### Menú de inicio

* ``<ENTER>`` - Empezar a jugar
* ``<  P  >`` - Ver los créditos
* ``<  C  >`` - Ver los controles
* ``< ESC >`` - Regresar a la pantalla de inicio (cuando estás en la pantalla de los controles o los créditos)

### Menú de inicio

* ``<ARROW>`` - Movimiento (arriba, abajo, izquierda, derecha)
* ``<  Z  >`` - Atacar (con el arma primaria)
* ``<  X  >`` - Atacar (con el arma secundaria)
* ``<  A  >`` - Alternar arma secundaria (izquierda)
* ``<  S  >`` - Alternar arma secundaria (derecha)
* ``<SPACE>`` - Interactuar (carteles, cerraduras, etc.)
* ``<SHIFT>`` - Correr
* ``< ESC >`` - Regresar a la pantalla de inicio (**advertencia**: no hay menú de pausa)

## Cómo jugar

¿Instalar? *pffff*. Basta con que abras el juego en el enlace de **GitHub Pages** que se encuentra en la información del repositorio, o dando [click aquí](https://complexralex.github.io/gamedev-final-project/).

### Jugar desde código fuente

En caso de que quieras usar el código fuente, existen dos formas de hacerlo:

1. Crear un proyecto con NPM ``npm init``, instalar Phaser ``npm install phaser@3.55.2``, y dentro de él descargar (o clonar) el repositorio.
1. Clonar el repositorio en cualquier directorio, copiar el *script* de la página https://cdnjs.com/libraries/phaser/3.55.2 y *comentar*/*descomentar* las siguientes líneas en el archivo ``index.html``:

```html
<body>
    <div id="phaser_container"></div>
    <!-- Si tienes node_modules, usa este (comenta esta línea) -->
    <!-- <script src="../node_modules/phaser/dist/phaser.min.js"></script> -->
    <!-- Si no usas node_modules, usa este (descomenta esta línea) -->
    <!-- ¡Reemplaza esta línea de código por la que copiaste de la página! -->
    <script src="./src/main.js" type="module"></script>
</body>
```

Nota: Para poder ejecutarlo desde código fuente (con cualquiera de las dos formas), se necesitará de un servidor web. Se puede hacer uso de ``http-server`` instalandolo con NPM ``npm install http-server`` y ejecutando con ``http-server`` dentro del directorio del proyecto.

## Screenshots

![MainMenu1](https://user-images.githubusercontent.com/47804156/205521655-8ba44201-bce3-40de-bad7-b166c7009792.png)
![Gameplay1](https://user-images.githubusercontent.com/47804156/205521658-cf18f8cc-1879-4f2c-ab59-1a5c3ede9d3a.png)
![Gameplay2](https://user-images.githubusercontent.com/47804156/205521659-f5a377ed-0804-4c06-8ca4-b992d4b44dcc.png)
![Gameplay3](https://user-images.githubusercontent.com/47804156/205521660-d959fe75-29c3-4ed7-b58c-24f890459550.png)

## ¡BUGS!

¡¿Alguien dijo BUGS?! Puedes reportarlos o sugerir mejoras (o cambios) dando [click aquí](https://github.com/ComplexRalex/gamedev-final-project/issues/new/choose).

## Notas

* El juego está pensado para jugarse en PC (a menos que conectes un teclado al dispositivo móvil).
* Algunos assets fueron retomados de diferentes páginas de internet.
* El juego **no cuenta con un jefe final**.

## Planes futuros

* Agregar posibilidad de jugar en dispositivos móviles.
* Agregar menú de pausa.
* Agregar un jefe final.

## Créditos

* Este juego fue diseñado y programado por el **Kaiser Rocket Team**.
* La música de la cinemática y los escenarios le pertenece a **ShinkoNet & Hypixel Inc**, del álbum *Hypixel Skyblock OST*.
* La música de los créditos finales es del juego *Phoenix Wright: Ace Attorney – Trials and Tribulations*, publicado por **Capcom**.

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

Este es un juego desarrollado por nuestro equipo *Kaiser Rocket Team* para el curso de Desarrollo de Videojuegos en la universidad. Se desarrolló con el framework de JavaScript Phaser 2D.

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

### Juego

* ``<ARROW>`` - Movimiento (arriba, abajo, izquierda, derecha)
* ``<  Z  >`` - Atacar (con el arma primaria)
* ``<  X  >`` - Atacar (con el arma secundaria)
* ``<  A  >`` - Alternar arma secundaria (izquierda)
* ``<  S  >`` - Alternar arma secundaria (derecha)
* ``<SPACE>`` - Interactuar (carteles, cerraduras, etc.)
* ``<SHIFT>`` - Correr
* ``<ENTER>`` - Saltar cinemática
* ``<  P  >`` - Abrir menú de pausa

### Menú de pausa

* ``<  P  >`` - Reanudar el juego
* ``< ESC >`` ``[dejar presionado]`` - Regresar al menú principal (reinicia el juego)

## Cómo jugar

¿Instalar? *pffff*. Basta con que des [click aquí](https://complexralex.github.io/gamedev-final-project/). Este URL también se encuentra en la información del repositorio.

### Jugar desde código fuente

Toma en cuenta que para jugarlo de manera local, es necesario que tengas instalado `Node.js` en tu computadora.

1. Primero se necesita clonar el repositorio:

```sh
git clone https://github.com/ComplexRalex/gamedev-final-project.git
```

2. Luego, se tienen que instalar las dependencias del proyecto:

```sh
npm install
```

3. Después, se debe cargar el framework de Phaser 2D. Para esto, se puede usar directamente el CDN que **ya se encuentra configurado** en la línea `[2]`, u *opcionalmente* se puede cambiar por el que fue instalado en el paso anterior en la línea `[1]`, de la siguiente forma en el archivo `index.html`:

```html
<body>
    <div id="phaser_container"></div>
    <!-- [1] Con esta línea estarías usando la dependencia del paso 2 -->
    <script src="./node_modules/phaser/dist/phaser.min.js"></script>
    <!-- [2] En la siguiente línea, estarías usando el CDN, que ya se encuentra configurado -->
    <!-- (se extrajo el script de https://cdnjs.com/libraries/phaser/3.55.2) -->
    <script src="./src/main.js" type="module"></script>
</body>
```

4. Por último, se tiene que iniciar el servidor local para ejecutar el juego:

```sh
npm run start
```

5. ¡En la dirección http://localhost:3000 se podrá jugar en cualquier navegador!

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

* ~~Agregar posibilidad de jugar en dispositivos móviles.~~
* Agregar un jefe final.

## Créditos

* Este juego fue diseñado y programado por el **Kaiser Rocket Team**, conformado por:
  - José Víctor Cuaya (EkSha)
  - Alejandro Batres (ComplexRalex) (yo)
  - Jose Eduardo Guevara (Loleiste172)
  - Maria Azucena Flores (Zuzu) (z^2)
* La música de la cinemática y los escenarios le pertenece a **ShinkoNet & Hypixel Inc**, del álbum *Hypixel Skyblock OST*.
* La música de los créditos finales es del juego *Phoenix Wright: Ace Attorney – Trials and Tribulations*, publicado por **Capcom**.

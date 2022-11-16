import Arrow from '../classes/Arrow.js';
import Player from '../classes/Player.js';

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {

        console.log("Escena 'Game' iniciada");

        // *
        // * Lista de propiedades utilizadas para el juego (temporalmente)
        // *

        // ! Definición de constantes
        this.sceneWidth = 320;
        this.sceneHeight = 240;
        this.sceneCoords = {
            x: 0,
            y: 0,
        };
        this.cameraCoords = {
            x: this.sceneWidth / 2,
            y: this.sceneHeight / 2,
        };

        // ! Constantes para las físicas
        this.maxVelocity = 100;
        this.acceleration = 700;
        this.drag = 700;
        this.speedUp = 1.3;

        // ! Otras constantes
        this.debugMode = false;
        this.zoomOutActive = false;
        this.zoomOriginal = 2;
        this.zoomFurthest = 0.5;
        this.isQuiting = false;

        // ! Variables de control

        // ! Stats
        this.data.set({
            'keys': 0,
            'arrows': 0,
            'bombs': 0,
        });
        // ! La vida está definida por múltiplos de 5.
        // ! Cada 5 unidades equivale a medio corazón.
        this.data.set({
            'dead': false,
            'health': 15,
            'healthDelta': 5,
            'healthMax': 30,
            'immuneEffect': false,
            'immuneEffectTime': 2500,
        });

        this.input.keyboard.removeAllListeners();
        this.input.keyboard.removeAllKeys();
    }

    getObjectSceneCoords(gameObject) {
        return {
            x: Math.floor(gameObject.x / this.sceneWidth),
            y: Math.floor(gameObject.y / this.sceneHeight)
        };
    }

    getNorSceneCoords() {
        return {
            x: Math.floor(this.nor.x / this.sceneWidth),
            y: Math.floor(this.nor.y / this.sceneHeight)
        };
    }

    updateSceneCoords({ x, y }, now = false) {
        this.sceneCoords = { x, y };
        this.updateCameraCoords(now);
    }

    updateCameraCoords(now = false) {
        const { x, y } = this.sceneCoords;
        const [centerX, centerY] = [
            x * this.sceneWidth + this.sceneWidth / 2,
            y * this.sceneHeight + this.sceneHeight / 2,
        ]
        if (now) {
            this.cameras.main.centerOn(centerX, centerY);
            return;
        }
        this.cameras.main.pan(centerX, centerY, 350, 'Expo.easeOut');
    }

    checkIfOutOfBounds(coords) {
        const { x, y } = coords ?? this.sceneCoords;
        if (
            x * this.sceneWidth > this.nor.x ||
            (x + 1) * this.sceneWidth <= this.nor.x ||
            y * this.sceneHeight > this.nor.y ||
            (y + 1) * this.sceneHeight <= this.nor.y
        ) {
            return true;
        }
        return false;
    }

    create() {
        // ! Música!
        this.bgMusic = this.sound.add('game', {
            volume: 1,
            loop: true,
        });
        this.bgMusic.play();

        // ! Configuración de tiles y el mapa
        this.map = this.make.tilemap({
            key: 'tile-map',
            tileWidth: 16,
            tileHeight: 16,
            width: 80,
            height: 30,
        });
        this.tileset = this.map.addTilesetImage("textures");
        this.layer = this.map.createLayer('Background', this.tileset);

        // ! Se agrega colisión con los tiles!
        this.layer.setCollisionByExclusion([-1]);

        // ! Obtención de capas de objetos
        this.mapHouses = this.map.objects[0].objects;
        this.mappedHouses = [];
        this.mapObjects = this.map.objects[1].objects;
        this.mappedObjects = [];

        // ! Posición inicial de Nor
        const initPos = this.mapObjects.find(obj => obj.name === 'norInitialPosition');
        const bossInitPos = this.mapObjects.find(obj => obj.name === 'bossInitialPosition');

        // ! Configuración de cámara
        this.cameras.main.setViewport(0, 0, 640, 480);
        this.cameras.main.setBounds(0, 0, 1280, 600);
        this.cameras.main.setZoom(2);
        this.updateSceneCoords({
            x: Math.floor(initPos.x / this.sceneWidth),
            y: Math.floor(initPos.y / this.sceneHeight)
        }, true);

        // ! Configuración del jugador
        this.nor = new Player({
            scene: this,
            x: initPos.x,
            y: initPos.y,
        });

        // ! Agregado del jefe final de zona
        this.boss = this.physics.add.sprite(bossInitPos.x, bossInitPos.y, 'textures_atlas', 'boss')
            .setDepth(1)
            .setMaxVelocity(this.maxVelocity)
            .setDrag(this.drag);
        this.boss.body.setCircle(this.boss.body.halfWidth);

        // ! Agregado de objetos
        this.mapObjects
            .filter(obj => !obj.name.includes('InitialPosition'))
            .forEach(obj => {
                // ! Empieza el mapeo...
                const type = obj.name.split('_')[0];
                const gameObject = this.physics.add.sprite(
                    obj.x,
                    obj.y,
                    'textures_atlas',
                    type,
                ).setOrigin(0, 1);
                const props = {};

                // ! Configuración personalizada de cada uno
                switch (type) {
                    case 'toggle':
                        gameObject.body.immovable = true;
                        break;
                    case 'button': case 'lock':
                        const togglesProp = obj.properties
                            .find(p => p.name === 'toggles');
                        props.toggles = togglesProp.value.split(',');
                        gameObject.body.immovable = true;
                        break;
                    case 'sign':
                        gameObject.body.immovable = true;
                        break;
                    case 'rock':
                        gameObject.body.immovable = true;
                        break;
                    case 'enemy':
                        gameObject.body.setCircle(gameObject.body.halfWidth);
                        gameObject.setDrag(this.drag);
                        break;
                    default:
                        gameObject.setDrag(this.drag);
                        break;
                }

                // ! Se almacena el objeto mapeado en un arreglo para después
                const mapped = {
                    obj: obj,
                    props: props,
                    gameObject: gameObject,
                    name: obj.name,
                    type: type,
                }
                gameObject.setData('parent', mapped);
                this.mappedObjects.push(mapped);
            });

        // ! Se obtiene la referencia de algunos triggers para mayor facilidad
        this.buttonTrigger = this.mappedObjects
            .find(obj => obj.type === 'button');
        this.lockTrigger = this.mappedObjects
            .find(obj => obj.type === 'lock');

        // ! Se obtienen las referencias de los objetos "agarrables"
        this.itemsGameObjects = this.mappedObjects
            .filter(obj =>
                obj.type === 'fragmentedEmerald' ||
                obj.type === 'arrows' ||
                obj.type === 'bombs' ||
                obj.type === 'banana' ||
                obj.type === 'heart' ||
                obj.type === 'key'
            ).map(obj => obj.gameObject);

        // ! Se obtienen las referencias de los enemigos
        this.enemyGameObjects = this.mappedObjects
            .filter(obj => obj.type === 'enemy')
            .map(obj => obj.gameObject);

        // ! Se agrega texto de ayuda rápido
        this.add.text(
            this.sceneWidth * 2 + 90,
            20,
            '[ FLECHAS ]: Movimiento\n' +
            '[  SHIFT  ]: Acelerar (presionado)\n' +
            '[  SPACE  ]: Interactuar\n' +
            '[    D    ]: Cambiar modo debug\n' +
            '[    M    ]: Cambiar camara\n' +
            '',
            { fontFamily: 'monospace', fontSize: 10 },
        );

        // ! Logo por los loles
        this.logo = this.add.image(this.sceneWidth * 2, this.sceneHeight * 3, 'krt')
            .setScale(0.5);

        this.createListeners();
    }

    // *
    // * Emisión de evento cuando sube o baja la vida
    // *
    updateHearts() {
        if (this.nor.health <= this.nor.healthMax) {
            this.registry.events.emit('changeHP', {
                health: this.nor.health,
                healthDelta: this.nor.healthDelta,
            });
        }
    }

    onDead() {
        this.onQuit();
    }

    onQuit() {
        if (!this.isQuiting) {
            this.isQuiting = true;
            this.scene.launch('SimpleFadeEffect', { fadeIn: true, yoyo: true });
            this.add.tween({
                targets: [this.logo],
                duration: 1000,
                props: {
                    alpha: 1,
                },
                onUpdate: () => {
                    if (this.bgMusic.volume > 0)
                        this.bgMusic.setVolume(this.bgMusic.volume - 0.01);
                },
                onComplete: () => {
                    this.bgMusic.stop();
                    this.scene.stop();
                    this.scene.stop("GUI");
                    this.scene.start("Start");
                }
            });
        }
    }

    createListeners() {
        // Constantes
        this.keyCodes = Phaser.Input.Keyboard.KeyCodes;

        // ! Se agregan las teclas de movimiento
        this.keys = this.input.keyboard.createCursorKeys();

        // ! Se agregan teclas para manejar el evento de que se teclea
        this.keys.d = this.input.keyboard.addKey('d');
        this.keys.m = this.input.keyboard.addKey('m');
        this.keys.esc = this.input.keyboard.addKey(this.keyCodes.ESC);

        // ! Salir a la pantalla inicial
        this.keys.esc.on('down', () => {
            this.onQuit();
        });

        // ! Para activar o desactivar el modo debug
        this.physics.world.drawDebug = this.debugMode;
        this.physics.world.debugGraphic.clear();
        this.keys.d.on('down', () => {
            this.debugMode = !this.debugMode;
            this.physics.world.drawDebug = this.debugMode;
            this.physics.world.debugGraphic.clear();
        });

        // ! Para cambiar la cámara
        this.keys.m.on('down', () => {
            this.zoomOutActive = !this.zoomOutActive;
            this.cameras.main.setZoom(
                this.zoomOutActive
                    ? this.zoomFurthest
                    : this.zoomOriginal
            );
            if (!this.zoomOutActive) {
                this.updateCameraCoords(true);
            }
        });

        // ! Emisión de eventos iniciales
        this.nor.changeHP({});
    }

    update() {
        // ! Se actualizan las físicas de Nor!
        this.nor.update();

        // ! Si Nor se sale de la escena actual, se mueve la cámara
        if (this.checkIfOutOfBounds()) {
            console.log(this.getNorSceneCoords());
            this.updateSceneCoords(this.getNorSceneCoords());
        }

        // !
        // !
        // ! NOTA
        // !
        // ! Muchos overlap y colliders tendrán que ser movidos al update, debido
        // ! a que se requiere verificar el arreglo constantemente por nuevos
        // ! objetos en él, con el fin de que se detecten de forma dinámica.
        // !
        // !

        // ! Se agrega el manejador de colisiones con las tiles y todos los objetos
        this.physics.collide(
            [
                ...this.mappedObjects.map(obj => obj.gameObject),
                this.nor,
                this.boss,
            ],
            this.layer
        );

        // ? Por algún motivo no jala esta madre XD
        // // ! Se agrega overlap en caso de que la flecha toque muro
        // this.physics.collide(
        //     [... this.nor.attackObjects.arrows],
        //     this.layer,
        //     (entity, _) => {
        //         if (entity instanceof Arrow) {
        //             // entity.stomp();
        //         }
        //     }
        // );

        this.nor.attackObjects.arrows.forEach((arrow) => {
            if (this.checkIfOutOfBounds(this.getObjectSceneCoords(arrow))) {
                arrow.stomp();
            }
        })

        // ! Se agrega el manejador de colisiones con los carteles xD
        this.physics.collide(
            this.nor,
            [
                ...this.mappedObjects
                    .filter(obj => obj.type === 'sign')
                    .map(obj => obj.gameObject)
            ]
        );

        // ! Agregada la colisión con las cajas toggle
        const toggleBlocks = this.mappedObjects
            .filter(obj => obj.type === 'toggle');
        this.physics.add.collider(
            this.nor,
            toggleBlocks.map(obj => obj.gameObject),
        );

        // ! Agregada la colisión con las rocas
        const rockBlocks = this.mappedObjects
            .filter(obj => obj.type === 'rock');
        this.physics.add.collider(
            this.nor,
            rockBlocks.map(obj => obj.gameObject),
        );


        // ! Si Nor toca un item, se quita del escenario, dado que supuestamente 
        // ! lo agarró
        this.physics.collide(this.nor, this.itemsGameObjects, (_, item) => {
            const object = item.getData('parent');
            let times = 1;
            switch (object.type) {
                // ! Para el corazon, se tiene que agregar un contenedor... pero por el
                // ! momento solo aumentará un corazón completo
                case "heart":
                    times++;
                case "banana":
                    this.cameras.main.flash(120, 180, 180, 180);
                    this.nor.changeHP({ addedHealthPoints: times });
                    break;
                case "key":
                    this.nor.items.keys += 1;
                    this.registry.events.emit('changeStats', { keyNumber: this.nor.items.keys });
                    break;
                case "arrows":
                    this.nor.items.arrows += 20;
                    this.registry.events.emit('changeStats', { arrowNumber: this.nor.items.arrows });
                    break;
                case "bombs":
                    this.nor.items.bombs += 1;
                    this.registry.events.emit('changeStats', { bombNumber: this.nor.items.bombs });
                    break;
            }
            item.destroy();
        })

        // ! Si Nor colisiona con un enemigo, tiene que actualizar su vida
        this.physics.collide(this.nor, [...this.enemyGameObjects, this.boss], () => {
            if (!this.nor.isDamaged) {
                this.nor.getHurt({ damagePoints: 1 });
                this.cameras.main.flash(100, 150, 0, 0);
                if (this.nor.health > 0) {
                    this.cameras.main.shake(150, 0.0015);
                } else {
                    this.cameras.main.shake(400, 0.005);
                    this.onDead();
                }
            }
        });

        // ! Si Nor interactúa sobre un botón o un candado, entonces se quitan los
        // ! bloques "toggle"
        this.physics.overlap(
            [
                this.nor,
                ...this.nor.attackObjects.arrows,
            ],
            [this.buttonTrigger.gameObject, this.lockTrigger.gameObject],
            (who, trigger) => {
                const object = trigger.getData('parent');
                const valid =
                    object.type === "lock" && this.nor.items.keys > 0 && this.nor.isInteracting ||
                    object.type === "button" && this.nor.items.arrows > 0 && (who instanceof Arrow);

                // *
                // * Emisión de eventos para actualizar estadísticas según el objeto
                // * utilizado
                // *
                if (valid) {
                    switch (object.type) {
                        case "lock":
                            this.nor.items.keys -= 1;
                            this.registry.events.emit('changeStats', { keyNumber: this.nor.items.keys });
                            break;
                        case "button":
                            this.nor.items.arrows -= 1;
                            this.registry.events.emit('changeStats', { arrowNumber: this.nor.items.arrows });
                            who.stomp();
                            break;
                    }
                    const toggles = object.props.toggles;
                    toggles.forEach(name => {
                        const obj = this.mappedObjects
                            .find(obj => obj.name === name);
                        obj.gameObject.destroy();
                    });
                    trigger.destroy();
                }
            }
        );

        // ! Si algún arma de Nor toca a algún enemigo, entonces estos
        // ! tienen que recibir daño.
        this.physics.overlap(
            [
                ...this.nor.attackObjects.sword,
                ...this.nor.attackObjects.arrows,
                ...this.nor.attackObjects.bombs,
            ],
            [
                ...this.enemyGameObjects,
                this.boss
            ],
            (object, enemy) => {
                if (object instanceof Arrow) object.stomp();
                this.enemyGameObjects = this.enemyGameObjects.filter(enemyObj => enemyObj !== enemy);
                if (this.boss === enemy) this.boss = null;
                enemy.destroy();
                console.log("BOOM B*TCH!");
            }
        );
    }
}
export default Game;
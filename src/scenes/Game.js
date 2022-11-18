import Arrow from '../classes/Arrow.js';
import Item from '../classes/Item.js';
import Player from '../classes/Player.js';
import Trigger from '../classes/Trigger.js';
import TriggerTarget from '../classes/TriggerTarget.js';

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
        this.mapObjects = this.map.objects.find(layer => layer.name === "Objects").objects;
        this.mappedObjects = [];
        this.mapItems = this.map.objects.find(layer => layer.name === "Items").objects;
        this.mappedItems = [];
        this.mapTriggers = this.map.objects.find(layer => layer.name === "Triggers").objects;
        this.mappedTriggers = [];
        this.mapTriggerTargets = this.map.objects.find(layer => layer.name === "TriggerTargets").objects;
        this.mappedTriggerTargets = [];

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

        // ! Se hace uso de una capa exclusiva para poder obtener los items
        // ! y mapearlos!
        this.mappedItems = this.mapItems.map(item => {
            let amount, animation, scale;
            switch (item.name) {
                case "banana":
                    animation = "banana_glow"
                    break;
                case "heart":
                    animation = "heart_blink"
                    scale = 1.5;
                    break;
                case "bombs":
                    amount = 3;
                    break;
                case "arrows":
                    amount = 5;
                    break;
            }
            return new Item({
                scene: this,
                x: item.x,
                y: item.y,
                type: item.name,
                sprite: item.name,
                amount,
                animation,
                scale,
            });
        });

        // ! Se hace uso de una capa exclusiva para los triggers
        this.mappedTriggerTargets = this.mapTriggerTargets.map(target => {
            const angle = target.properties
                .find(prop => prop.name === "angle")?.value;
            return new TriggerTarget({
                id: target.id,
                scene: this,
                x: target.x,
                y: target.y,
                type: target.name,
                angle,
            });
        });

        // ! Se hace uso de una capa exclusiva para los triggers
        this.mappedTriggers = this.mapTriggers.map(trigger => {
            const angle = trigger.properties
                .find(prop => prop.name === "angle")?.value ?? 0;
            const targetsProp = trigger.properties
                .find(prop => prop.name === 'targets').value
                .split(',')
                .map(str => parseInt(str));
            const targets = this.mappedTriggerTargets.filter(target => {
                return targetsProp.includes(parseInt(target.id));
            });
            return new Trigger({
                scene: this,
                x: trigger.x,
                y: trigger.y,
                type: trigger.name,
                angle,
                targets,
            });
        });

        // ! Se obtiene la referencia de algunos triggers para mayor facilidad
        this.buttonTrigger = this.mappedObjects
            .find(obj => obj.type === 'button');
        this.lockTrigger = this.mappedObjects
            .find(obj => obj.type === 'lock');
        this.rocks = this.mappedObjects
            .filter(obj => obj.type === 'rock')
            .map(obj => obj.gameObject);

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
        this.nor.obtainWeapon({ type: 'sword' });
        this.nor.obtainWeapon({ type: 'bow' });
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

        // ! Si la flecha se sale de la escena, se tiene que borrar
        this.nor.attackObjects.arrows.forEach((arrow) => {
            if (this.checkIfOutOfBounds(this.getObjectSceneCoords(arrow))) {
                arrow.stomp();
            }
        });

        // ! Si la bomba se sale de la escena, se tiene que borrar
        this.nor.attackObjects.bombs.forEach((bomb) => {
            if (this.checkIfOutOfBounds(this.getObjectSceneCoords(bomb))) {
                bomb.vanish();
            }
        });

        // ! Se agrega el manejador de colisiones con los carteles xD
        this.physics.collide(
            this.nor,
            [
                ...this.mappedObjects
                    .filter(obj => obj.type === 'sign')
                    .map(obj => obj.gameObject)
            ]
        );

        // ! Agregada la colisión con las rocas
        const rockBlocks = this.mappedObjects
            .filter(obj => obj.type === 'rock');
        this.physics.collide(
            this.nor,
            rockBlocks.map(obj => obj.gameObject),
        );


        // ! Si Nor toca un item, se quita del escenario, dado que supuestamente 
        // ! lo agarró
        this.physics.overlap(this.nor, this.mappedItems, (_, item) => {
            switch (item.type) {
                case "banana":
                    this.nor.getHealed({ healPoints: 1 });
                    break;
                case "key": case "arrows": case "bombs":
                    this.nor.changeStats({ stat: item.type, addedPoints: item.amount });
                    break;
                case "heart":
                    this.nor.changeMaxHealth({ numberOfContainersToAdd: 1 });
                    break;
                case "sword": case "bow":
                    // ! Se tiene que activar el tipo de arma que se ha conseguido
                    // ! hasta el momento, según el tipo.
                    break;
                case "emeraldFragment":
                    // ! Este solo es simbólico, pero también podría hacerse algo
                    break;
            }
            this.mappedItems = this.mappedItems.filter(i => i !== item);
            item.destroy();
        })

        // ! Si Nor colisiona con un enemigo, tiene que actualizar su vida
        this.physics.collide(this.nor, [...this.enemyGameObjects, this.boss], () => {
            const isDead = this.nor.getHurt({ damagePoints: 1 });
            if (isDead) this.onDead();
        });

        // ! Si Nor toca la explosión, entonces también recibe daño.
        this.physics.overlap(this.nor, this.nor.attackObjects.bombs, () => {
            const isDead = this.nor.getHurt({ damagePoints: 2 });
            if (isDead) this.onDead();
        });

        // ! Si Nor toca una pared, no podrá pasarla.
        this.physics.collide(this.nor, this.mappedTriggerTargets);

        // ! Si Nor interactúa sobre un botón o un candado, entonces se quitan los
        // ! bloques "toggle"
        this.physics.overlap(
            [
                this.nor,
                ...this.nor.attackObjects.arrows,
            ],
            this.mappedTriggers,
            (who, trigger) => {
                const valid =
                    trigger.type === "lock" && this.nor.items.keys > 0 && this.nor.isInteracting ||
                    trigger.type === "button" && this.nor.items.arrows > 0 && (who instanceof Arrow);

                if (valid) {
                    switch (trigger.type) {
                        case "lock":
                            this.nor.changeStats({ stat: 'key', addedPoints: -1 });
                            break;
                        case "button":
                            who.stomp();
                            break;
                    }
                    const targets = trigger.targets;
                    targets.forEach(target => {
                        this.mappedTriggerTargets = this.mappedTriggerTargets.filter(t => t !== target);
                        target.destroy();
                    });
                    this.mappedTriggers = this.mappedTriggers.filter(t => t !== trigger);
                    trigger.destroy();
                }
            }
        );

        // ! Si la explosión toca las rocas, entonces se tienen que romper
        this.physics.overlap(this.nor.attackObjects.bombs, this.rocks, (_, rock) => {
            // ! OJO, no se está borrando la referencia. Es probable que en otros
            // ! lados se tenga que hacer también.
            rock.destroy();
        })

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
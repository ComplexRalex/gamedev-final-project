import Arrow from '../classes/Arrow.js';
import Enemy from '../classes/Enemy.js';
import GameScene from '../classes/GameScene.js';
import Guard from '../classes/Guard.js';
import Item from '../classes/Item.js';
import Player from '../classes/Player.js';
import Rock from '../classes/Rock.js';
import Sign from '../classes/Sign.js';
import Snake from '../classes/Snake.js';
import Teleporter from '../classes/Teleporter.js';
import Trigger from '../classes/Trigger.js';
import TriggerTarget from '../classes/TriggerTarget.js';
import Wolf from '../classes/Wolf.js';

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

        // ? Medidas en pixeles
        this.tileWidth = 16;
        this.tileHeight = 16;
        this.sceneWidth = 320;
        this.sceneHeight = 240;

        // ? Medidas en tiles
        this.mapWidth = 80;
        this.mapHeight = 30;
        this.sceneWidthTiles = 20;
        this.sceneHeightTiles = 15;

        // ! Este servirá para poder hacer manejo del spawneo "dinámico"
        // ! de ciertas entidades en las escenas chiquitas.
        this.gameScene = new GameScene({
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            sceneWidth: this.sceneWidthTiles,
            sceneHeight: this.sceneHeightTiles,
            mapWidth: this.mapWidth,
            mapHeight: this.mapHeight,
        });

        // * Coordenadas de la escena
        this.sceneCoords = {
            x: 0,
            y: 0,
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
        this.cameraPanTime = 350;

        this.isTeleporting = false;
        this.teleportingTime = 100;

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
        this.updateMapEnemies();
        this.updateCameraCoords(now);
    }

    // ? Este método se encarga de limpiar y spawnear los
    // ? enemigos cuando el jugador se encuentre en una
    // ? escena específica.
    updateMapEnemies() {
        const { x, y } = this.sceneCoords;
        this.mapEnemies.forEach(gameObject => gameObject.destroy());
        this.mapEnemies = this.gameScene.get({ x, y })
            .filter(entity => entity.alive)
            .map(entity => {
                const props = {
                    scene: this,
                    x: entity.x,
                    y: entity.y,
                    parent: entity,
                    hp: entity.hp,
                    drops: entity.drops,
                    dropEverything: entity.dropEverything,
                    dropDirection: entity.dropDirection,
                };
                switch (entity.type) {
                    case "snake": return new Snake(props);
                    case "wolf": return new Wolf(props);
                    case "guard": return new Guard(props);
                }
            });
        console.log(this.mapEnemies);
    }

    updateCameraCoords(now = false) {
        const { x, y } = this.sceneCoords;
        const [centerX, centerY] = [
            x * this.sceneWidth + this.sceneWidth / 2,
            y * this.sceneHeight + this.sceneHeight / 2,
        ]
        if (now || this.isTeleporting) {
            this.cameras.main.centerOn(centerX, centerY);
            return;
        }
        this.cameras.main.pan(centerX, centerY, this.cameraPanTime, 'Expo.easeOut', true);
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

    addItem({ type, x, y }) {
        this.mappedItems.push(Item.ofType({
            scene: this,
            type: type,
            x: x,
            y: y,
        }));
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
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            width: this.mapWidth,
            height: this.mapHeight,
        });
        this.tileset = this.map.addTilesetImage("generics");
        this.layer = this.map.createLayer('Background', this.tileset);

        // ! Esto es una prueba para ver si puede jalar más
        // ! de una capa de esta forma.
        this.mapHouses = this.map.createLayer('Houses', this.tileset);
        this.mapHouses.setDepth(5);

        // ! Se agrega colisión con los tiles!
        this.layer.setCollisionByExclusion([-1]);


        // ! >>>> Configuración de las capas de objetos

        // ! roca
        this.mapRocks = this.map.objects.find(layer => layer.name === "Rocks").objects;
        this.mappedRocks = this.mapRocks.map(rock => {
            return new Rock({
                scene: this,
                x: rock.x,
                y: rock.y,
            });
        });

        // ! Se hace uso de una capa exclusiva para los triggers
        this.mapTriggerTargets = this.map.objects.find(layer => layer.name === "TriggerTargets").objects;
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
        this.mapTriggers = this.map.objects.find(layer => layer.name === "Triggers").objects;
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

        // ! Se hace uso de una capa adicional para poder establecer
        // ! el lugar en donde será telentransportado el jugador.
        this.mapTeleports = this.map.objects.find(layer => layer.name === "Teleports").objects;
        const positions = this.mapTeleports.filter(object => object.point);
        this.mappedTeleports = this.mapTeleports
            .filter(object => object.rectangle)
            .map(object => {
                const id = object.properties.find(p => p.name === "destiny")?.value;
                const destiny = positions.find(object => object.id === id);
                return new Teleporter({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    width: object.width,
                    height: object.height,
                    destiny,
                });
            });


        // ! Se hace uso de una capa exclusiva para los triggers
        this.mapSigns = this.map.objects.find(layer => layer.name === "Signs").objects;
        this.mappedSigns = this.mapSigns.map(sign => {
            const content = sign.properties
                .find(prop => prop.name === "content").value;
            return new Sign({
                scene: this,
                x: sign.x,
                y: sign.y,
                content,
            });
        });

        // ! Se hace uso de una capa exclusiva para poder obtener los items
        // ! y mapearlos!
        this.mapItems = this.map.objects.find(layer => layer.name === "Items").objects;
        this.mappedItems = this.mapItems.map(item => {
            return Item.ofType({
                scene: this,
                x: item.x,
                y: item.y,
                type: item.name,
            });
        });

        // ! Se hace uso de una capa para poder obtener únicamente los
        // ! enemigos!
        this.mapEnemiesData = this.map.objects.find(layer => layer.name === "Enemies").objects;
        this.mappedEnemiesData = this.mapEnemiesData.forEach(enemy => {

            // ? La idea de esto es que se carguen los datos de los
            // ? enemigos en las escenas correspondientes según sus
            // ? coordenadas, esto con el fin de que se puedan
            // ? cargar y agregar a una lista cuando Nor se encuentre
            // ? en dicha escena. Cuando salga de la escena, los
            // ? objetos son destruidos.
            // ? La intención es ahorrar recursos y no lagear tanto
            // ? el juego xD.
            const hp = enemy.properties?.
                find(prop => prop.name === "hp")?.value;
            const drops = enemy.properties?.
                find(prop => prop.name === "drops")?.value
                .split(',').map(i => {
                    if (Item.possibleValues.includes(i)) {
                        return i;
                    } return null;
                });
            const dropEverything = enemy.properties?.
                find(prop => prop.name === "drop-everything")?.value;
            const dropDirection = enemy.properties?.
                find(prop => prop.name === "drop-direction")?.value;

            this.gameScene.insert(Enemy.onlyData({
                ...enemy,
                type: enemy.name,
                x: enemy.x,
                y: enemy.y,
                hp: hp,
                drops: drops,
                dropEverything: dropEverything,
                dropDirection: dropDirection,
                alive: true,
            }));
        });
        // ? Este arreglo variará según los enemigos que haya en la escena actual!!!!
        this.mapEnemies = [];

        // ! 
        // ! 
        // ! TEMPORAL
        // ! 
        // ! 
        // ! Se hace uso de una capa exclusiva para las posiciones de las
        // ! entidades
        this.mapPositions = this.map.objects.find(layer => layer.name === "Positions").objects;
        const initPos = this.mapPositions.find(obj => obj.name === 'nor');
        const bossInitPos = this.mapPositions.find(obj => obj.name === 'boss');

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
        this.boss = this.physics.add.sprite(bossInitPos.x, bossInitPos.y, 'generics_atlas', 'boss')
            .setDepth(1)
            .setMaxVelocity(this.maxVelocity)
            .setDrag(this.drag);
        this.boss.body.setCircle(this.boss.body.halfWidth);

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

    update(time, delta) {
        // ! Se actualizan las físicas de Nor!
        this.nor.update();

        // ! Se actualizan las físicas de los enemigos!
        this.mapEnemies.forEach(enemy => {
            enemy.update({ player: this.nor, time: time, delta: delta });
        });

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
                this.nor,
                ...this.mapEnemies,
            ],
            this.layer
        );

        // ! Si la flecha pega con la capa de "muros", entonces
        // ! se tiene que romper.
        this.physics.collide(
            [
                ...this.nor.attackObjects.arrows,
                ...Enemy.attackObjects.arrows,
            ],
            this.layer,
            (arrow) => arrow.stomp(),
        );

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

        // ! Se agrega el manejo de overlap con los carteles para mostrar cosas.
        this.physics.overlap(
            this.nor,
            this.mappedSigns,
            (_, sign) => {
                if (this.nor.isInteracting) {
                    sign.show();
                }
            }
        );

        // ! Agregada la colisión con las rocas
        this.physics.collide(this.nor, this.mappedRocks);

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
                case "fragmented_emerald":
                    this.nor.obtainFragment();
                    break;
            }
            this.mappedItems = this.mappedItems.filter(i => i !== item);
            item.destroy();
        })

        // ! Si Nor colisiona con un enemigo, tiene que actualizar su vida
        this.physics.overlap(this.nor, this.mapEnemies, (_, enemy) => {
            const isDead = this.nor.getHurt({ damagePoints: enemy.damagePoints });
            if (isDead) this.onDead();
        });

        // ! Si Nor toca la explosión, entonces también recibe daño.
        this.physics.overlap(this.nor, this.nor.attackObjects.bombs, (_, bomb) => {
            const isDead = this.nor.getHurt({ damagePoints: bomb.damagePoints });
            if (isDead) this.onDead();
        });

        // ! Si Nor toca una pared, no podrá pasarla.
        this.physics.collide(this.nor, this.mappedTriggerTargets);

        // ! Si Nor toca una caja de teletransportación, entonces será
        // ! teletransportado (lol).
        this.physics.overlap(this.nor, this.mappedTeleports, (_, teleporter) => {
            const destiny = teleporter.destiny;
            if (destiny) {
                // * Esta bandera servirá para no hacer la animación del movimiento
                // * de la cámara cuando se mueva Nor.
                this.isTeleporting = true;
                this.nor.setPosition(destiny.x, destiny.y);
                setTimeout(() => {
                    this.isTeleporting = false;
                }, this.teleportingTime);
            }
        });

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
        this.physics.overlap(this.nor.attackObjects.bombs, this.mappedRocks, (_, rock) => {
            this.mappedRocks = this.mappedRocks.filter(r => r !== rock);
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
                ...this.mapEnemies
            ],
            (object, enemy) => {
                if (object instanceof Arrow) object.stomp();

                // ! Cuando el enemigo ha sido destruido, no volverá a
                // ! spawnear cuando se pase por la misma escena.
                if (enemy instanceof Enemy) {
                    enemy.getHurt({ damagePoints: object.damagePoints });
                    if (enemy.health === 0) {
                        this.mapEnemies = this.mapEnemies.filter(e => e !== enemy);
                    }
                }
            }
        );

        // ! Si algún arma de algún enemigo toca a Nor, entonces tiene que
        // ! recibir daño.
        this.physics.overlap(
            [
                ...Enemy.attackObjects.arrows,
                ...Enemy.attackObjects.bombs,
            ],
            this.nor,
            (object, _) => {
                if (object instanceof Arrow) object.stomp();

                const isDead = this.nor.getHurt({ damagePoints: object.damagePoints });
                if (isDead) this.onDead();
            }
        );

        // ! Si Nor alganza a golpear la flecha con una bomba o de un espadazo,
        // ! esta se destruye.
        this.physics.overlap(
            [
                ...this.nor.attackObjects.sword,
                ...this.nor.attackObjects.bombs,
            ],
            [
                ...Enemy.attackObjects.arrows,
            ],
            (_, arrow) => {
                arrow.stomp();
            }
        );
    }
}
export default Game;
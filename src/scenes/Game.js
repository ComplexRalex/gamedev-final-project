import Arrow from '../classes/Arrow.js';
import Barry from '../classes/Barry.js';
import Enemy from '../classes/Enemy.js';
import GameScene from '../classes/GameScene.js';
import Guard from '../classes/Guard.js';
import IanDed from '../classes/IanDed.js';
import Item from '../classes/Item.js';
import Maya from '../classes/Maya.js';
import Pedestal from '../classes/Pedestal.js';
import Player from '../classes/Player.js';
import Rock from '../classes/Rock.js';
import Sign from '../classes/Sign.js';
import Snake from '../classes/Snake.js';
import Teleporter from '../classes/Teleporter.js';
import Trigger from '../classes/Trigger.js';
import TriggerTarget from '../classes/TriggerTarget.js';
import Void from '../classes/Void.js';
import Wolf from '../classes/Wolf.js';

class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {

        console.log("Escena 'Game' iniciada");

        // *
        // * Lista de propiedades utilizadas para el juego
        // *

        // ! Lectura del mapa en Tiled (necesario ahora para las dimensiones)
        this.map = this.make.tilemap({
            key: 'floresta-tile-map',
        });

        // ! Definición de constantes

        // ? Medidas en pixeles

        // * Mapa
        this.tileWidth = this.map.tileWidth;
        this.tileHeight = this.map.tileHeight;

        // * Escena
        this.sceneWidth = 640;
        this.sceneHeight = 480;

        // ? Medidas en tiles

        // * Mapa
        this.mapWidth = this.map.width;
        this.mapHeight = this.map.height;

        // * Escena
        this.sceneWidthTiles = Math.floor(this.sceneWidth / this.tileWidth);
        this.sceneHeightTiles = Math.floor(this.sceneHeight / this.tileHeight);

        // ! Este servirá para poder hacer manejo del spawneo "dinámico"
        // ! o de obtención de información sobre objetos relacionados con
        // ! la escena en cuestión (escena "chiquita").
        this.gameScenes = new GameScene({
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            sceneWidth: this.sceneWidthTiles,
            sceneHeight: this.sceneHeightTiles,
            mapWidth: this.mapWidth,
            mapHeight: this.mapHeight,
        });

        // * Categoría para la información de los items
        this.gameScenes.addCategory("items");

        // * Categoría para almacenar información de los enemigos
        this.gameScenes.addCategory("enemies");

        // * Categoría para la información de la música de fondo por escena
        this.gameScenes.addCategory("music");

        // * Coordenadas de la escena (iniciales)
        this.sceneCoords = {
            x: 0,
            y: 0,
        };

        // ! Constantes debug
        this.debugMode = false;
        this.zoomOutActive = false;
        this.zoomOriginal = 1;
        this.zoomFurthest = 0.25;

        // ! Variables de control
        this.cameraPanTime = 350;

        this.isTeleporting = false;
        this.teleportingTime = 100;

        this.isBusy = false;
        this.isQuiting = false;
        this.isGG = false;

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
        console.log("Coordenadas de la cámara", { x, y });
        this.sceneCoords = { x, y };
        this.updateMapEnemies();
        this.updateMapItems();
        this.updateMusic();
        this.updateCameraCoords(now);
    }

    // ? Este método se encarga de limpiar y spawnear los
    // ? enemigos cuando el jugador se encuentre en una
    // ? escena específica.
    updateMapEnemies() {
        const { x, y } = this.sceneCoords;
        this.mapEnemies.forEach(gameObject => {
            gameObject.destroy();
            gameObject.destroyComplements();
        });
        this.mapEnemies = this.gameScenes.get("enemies", { xPos: x, yPos: y })
            .filter(entity => entity.alive)
            .map(entity => {
                const props = {
                    scene: this,
                    x: entity.x,
                    y: entity.y,
                    parent: entity,
                    variant: entity.variant,
                    hp: entity.hp,
                    scale: entity.scale,
                    tint: entity.tint,
                    drops: entity.drops,
                    dropEverything: entity.dropEverything,
                    dropDirection: entity.dropDirection,
                    onDeath: entity.onDeath,
                };
                switch (entity.type) {
                    case "snake": return new Snake(props);
                    case "wolf": return new Wolf(props);
                    case "guard": return new Guard(props);
                }
            });
        console.warn("Enemigos en la escena", this.mapEnemies);
    }

    updateMapItems() {
        const { x, y } = this.sceneCoords;
        const areEnemiesAlive = this.gameScenes.get("enemies", { xPos: x, yPos: y })
            .filter(enemy => enemy.alive).length > 0;

        this.mapItems.forEach(gameObject => {
            gameObject.destroy();
        });
        this.mapItems = this.gameScenes.get("items", { xPos: x, yPos: y })
            .filter(object => (
                (!object.requiresDefeatBoss || !areEnemiesAlive) &&
                (
                    !object.consumed ||
                    object.respawnable && (
                        Item.timeToRespawn <= new Date().getTime() - object.consumedOn
                    )
                )
            ))
            .map(object => {
                if (object.respawnable) object.consumed = false;

                const props = {
                    scene: this,
                    x: object.x,
                    y: object.y,
                    parent: object,
                    type: object.type,
                };

                return Item.ofType(props);
            });
        console.warn("Items (activos) en la escena", this.mapItems);
    }

    updateMusic() {
        const { x, y } = this.sceneCoords;
        const object = this.gameScenes.get("music", { xPos: x, yPos: y })[0];

        // ? En caso de que no haya enemigos vivos cuando
        // ? la música es de boss (es decir, cuando no hay
        // ? jefe vivo), entonces se coloca el reemplazo.
        const areEnemiesAlive = this.gameScenes.get("enemies", { xPos: x, yPos: y })
            .filter(enemy => enemy.alive).length > 0;
        const music = object.music != "bossfight"
            ? object.music
            : areEnemiesAlive
                ? object.music
                : object.after ?? object.music;

        let sceneMusic;
        switch (music) {
            case "jungle": sceneMusic = this.jungleMusic; break;
            case "forest": sceneMusic = this.forestMusic; break;
            case "hill": sceneMusic = this.hillMusic; break;
            case "cave": sceneMusic = this.caveMusic; break;
            case "bossfight": sceneMusic = this.bossfightMusic; break;
        }
        if (this.activeMusic !== sceneMusic) {
            if (this.activeMusic?.stop) this.activeMusic?.stop();
            this.activeMusic = sceneMusic;
            this.activeMusic.play({ loop: true });
        }
        console.warn(`Rola de la escena`, { music: music });
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

    // ? Se utiliza por el enemigo para dropear objetos.
    addItemToScene({ type, x, y }) {

        // * Crea el objeto padre para almacenarlo en la escena
        const parent = Item.onlyData({
            type: type,
            x: x,
            y: y,
            consumed: false,
            consumedOn: new Date(0).getTime(),
            respawnable: false,
            requiresDefeatBoss: false,
        });
        this.gameScenes.insert("items", { x, y }, parent);

        // * Se agrega literalmente a la escena
        this.mapItems.push(Item.ofType({
            scene: this,
            x: x,
            y: y,
            parent: parent,
            type: type,
        }));
    }

    create() {
        // ! Música

        // * Esta variable almacenará la música actual
        this.activeMusic = this.sound.add('wind'); // ! Asignación temporal
        this.jungleMusic = this.sound.add('jungle', {
            loop: true,
        });
        this.forestMusic = this.sound.add('forest', {
            loop: true,
        });
        this.hillMusic = this.sound.add('hill', {
            loop: true,
        });
        this.caveMusic = this.sound.add('cave', {
            loop: true,
        });
        this.bossfightMusic = this.sound.add('bossfight', {
            loop: true,
        });

        // ! Sonidos
        this.interactSound = this.sound.add('interacting');

        // ! Configuración de tiles y el mapa
        // this.map = this.make.tilemap({
        //     key: 'floresta-tile-map',
        // });
        this.tsJungleZipela = this.map.addTilesetImage("level1");
        this.tsForestHaru = this.map.addTilesetImage("level2");
        this.tsHillEfron = this.map.addTilesetImage("level3");
        this.tsCave = this.map.addTilesetImage("level4");
        this.tsIndoors = this.map.addTilesetImage("indoors");
        this.tsHouses = this.map.addTilesetImage("houses");

        // ! >>>> Configuración de las capas de tiles

        // ! Esta capa será el fondo
        this.mapBackground = this.map.createLayer('Background', [
            this.tsJungleZipela,
            this.tsForestHaru,
            this.tsHillEfron,
            this.tsCave,
            this.tsIndoors,
        ]);

        // ! Esta capa serán las paredes
        this.mapWalls = this.map.createLayer('Walls', [
            this.tsJungleZipela,
            this.tsForestHaru,
            this.tsHillEfron,
            this.tsCave,
            this.tsIndoors,
        ]);
        this.mapWalls.setCollisionByExclusion([-1]);

        // ! Esta capa serán las paredes medias (las flechas la atraviesan)
        this.mapHalfWalls = this.map.createLayer('HalfWalls', [
            this.tsForestHaru,
            this.tsIndoors,
        ]);
        this.mapHalfWalls.setCollisionByExclusion([-1]);

        // ! Esto es una prueba para ver si puede jalar más
        // ! de una capa de esta forma.
        this.mapHouses = this.map.createLayer('Houses', this.tsHouses);
        this.mapHouses.setDepth(5);


        // ! >>>> Configuración de las capas de objetos

        // ! Se hace uso de hitbox para el vacío
        this.mapVoids = this.map.objects.find(layer => layer.name === "Voids").objects;
        const respawnPositions = this.mapVoids.filter(object => object.point);
        this.mappedVoids = this.mapVoids
            .filter(object => object.rectangle)
            .map(hitbox => {
                const id = hitbox.properties?.find(p => p.name === "respawn")?.value;
                const point = respawnPositions.find(object => object.id === id);
                return new Void({
                    scene: this,
                    x: hitbox.x,
                    y: hitbox.y,
                    width: hitbox.width,
                    height: hitbox.height,
                    respawnPoint: point,
                });
            });

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
            const name = target.properties
                .find(prop => prop.name === "name")?.value;
            return new TriggerTarget({
                id: target.id,
                scene: this,
                x: target.x,
                y: target.y,
                type: target.name,
                name,
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
        const toPositions = this.mapTeleports.filter(object => object.point);
        this.mappedTeleports = this.mapTeleports
            .filter(object => object.rectangle)
            .map(object => {
                const id = object.properties.find(p => p.name === "destiny")?.value;
                const destiny = toPositions.find(object => object.id === id);
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
            const content = sign.properties?.
                find(prop => prop.name === "content")?.value ?? '';
            return new Sign({
                scene: this,
                x: sign.x,
                y: sign.y,
                content,
            });
        });

        // ! Se hace uso de una capa exclusiva para poder obtener los items
        // ! y mapearlos!
        this.mapItemsData = this.map.objects.find(layer => layer.name === "Items").objects;
        this.mapItemsData.forEach(item => {

            // ? Véase la cagra de enemigos para entender esto, lol
            const respawnable = item.properties?.
                find(prop => prop.name === "respawnable")?.value;
            const requiresDefeatBoss = item.properties?.
                find(prop => prop.name === "requiresDefeatBoss")?.value;

            this.gameScenes.insert("items", { x: item.x, y: item.y },
                Item.onlyData({
                    ...item,
                    type: item.name,
                    x: item.x,
                    y: item.y,
                    consumed: false,
                    consumedOn: new Date(0).getTime(),
                    respawnable: respawnable,
                    requiresDefeatBoss: requiresDefeatBoss,
                }),
            );
        });
        // ? Este arreglo variará según los items que haya en la escena actual
        this.mapItems = [];

        // ! Se hace uso de una capa para poder obtener únicamente los
        // ! enemigos!
        this.mapEnemiesData = this.map.objects.find(layer => layer.name === "Enemies").objects;
        this.mapEnemiesData.forEach(enemy => {

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
            const scale = enemy.properties?.
                find(prop => prop.name === "scale")?.value;
            const variant = enemy.properties?.
                find(prop => prop.name === "variant")?.value;
            const tint = parseInt(enemy.properties?.
                find(prop => prop.name === "tint")?.value ?? '0xFFFFFF', 16);
            const drops = enemy.properties?.
                find(prop => prop.name === "drops")?.value
                .split(',').map(i => {
                    if (Item.possibleDrops.includes(i)) {
                        return i;
                    } return null;
                });
            const dropEverything = enemy.properties?.
                find(prop => prop.name === "dropEverything")?.value;
            const dropDirection = enemy.properties?.
                find(prop => prop.name === "dropDirection")?.value;

            // ? Asumiendo que los jefes siempre tienen variante 1,
            // ? entonces se puede hacer que luego de su muerte se
            // ? actualice la música.
            const onEnemyDeath = !variant || variant != 1 ? null : () => {
                this.updateMapItems();
                this.updateMusic();
            }

            this.gameScenes.insert("enemies", { x: enemy.x, y: enemy.y },
                Enemy.onlyData({
                    ...enemy,
                    type: enemy.name,
                    x: enemy.x,
                    y: enemy.y,
                    variant: variant,
                    hp: hp,
                    scale: scale,
                    tint: tint,
                    drops: drops,
                    dropEverything: dropEverything,
                    dropDirection: dropDirection,
                    alive: true,
                    onDeath: onEnemyDeath,
                }),
            );
        });
        // ? Este arreglo variará según los enemigos que haya en la escena actual!!!!
        this.mapEnemies = [];

        // ! Se hace uso de una capa para poder obtener las rolas!
        this.mapMusic = this.map.objects.find(layer => layer.name === "Music").objects;
        this.mapMusic.forEach(music => {
            // ? Se supone que esta capa contiene un objeto "musical"
            // ? por cada una de las escenas, esto con el fin de que
            // ? se pueda establecer qué canción de fondo tiene cada
            // ? escenario.

            // ? Esta es la rola que se colocará como reemplazo de la
            // ? del jefe de escena después de que haya sido vencido.
            const after = music.properties?.
                find(prop => prop.name === "after")?.value;

            this.gameScenes.insert("music", { x: music.x, y: music.y },
                {
                    ...music,
                    name: music.name,
                    music: music.name,
                    after: after,
                });
        });

        // ! Se hace uso de una capa exclusiva para las posiciones de las
        // ! entidades
        this.mapPositions = this.map.objects.find(layer => layer.name === "Positions").objects;

        // * Posición inicial de Nor
        const initPos = this.mapPositions.find(obj => obj.name === 'nor');

        // * Posición de Ian Ded
        const ianDedPos = this.mapPositions.find(obj => obj.name === 'ian_ded');

        // * Posición del marco de Ten
        const tenFramePos = this.mapPositions.find(obj => obj.name === 'ten');

        // * Posición de Maya
        const mayaPos = this.mapPositions.find(obj => obj.name === 'maya');

        // * Posición de Barry
        const barryPos = this.mapPositions.find(obj => obj.name === 'barry');

        // * Posición de hitbox de activación de barry
        const barryAppearsHitbox = this.mapPositions.find(obj => obj.name === 'barryAppearsHitbox');

        // * Posiciones de objetos que se agregarán después
        const lastFragmentPos = this.mapPositions.find(obj => obj.name === 'fragmented_emerald');
        const lastKeyPos = this.mapPositions.find(obj => obj.name === 'key');

        // * Posición del pedestal
        const pedestalPos = this.mapPositions.find(obj => obj.name === 'pedestal');

        // ! Configuración de cámara
        this.cameras.main.setViewport(0, 0,
            this.sceneWidth,
            this.sceneHeight,
        );
        this.cameras.main.setBounds(0, 0,
            this.sceneWidth * this.tileWidth,
            this.sceneHeight * this.tileHeight,
        );
        this.cameras.main.setZoom(this.zoomOriginal);
        this.updateSceneCoords({
            x: Math.floor(initPos.x / this.sceneWidth),
            y: Math.floor(initPos.y / this.sceneHeight)
        }, true);

        // ! Arreglo de NPCs
        this.mapNPCs = [];

        // ! Configuración de Ian Ded
        this.ianDed = new IanDed({
            scene: this,
            x: ianDedPos.x,
            y: ianDedPos.y,
        });
        this.mapNPCs.push(this.ianDed);

        // ! Agregado de Ten (su marco XD)
        this.tenFrame = this.add.image(
            tenFramePos.x,
            tenFramePos.y,
            'ten',
            'ten_frame'
        ).setDepth(6);

        // ! Configuración de Maya
        this.maya = new Maya({
            scene: this,
            x: mayaPos.x,
            y: mayaPos.y,
        });
        this.mapNPCs.push(this.maya);

        // ! Configuración de Barry
        this.barry = new Barry({
            scene: this,
            x: barryPos.x,
            y: barryPos.y,
            items: [lastFragmentPos, lastKeyPos],
            activationHitbox: barryAppearsHitbox,
        });
        this.mapNPCs.push(this.barry);

        // ! Configuración del jugador
        this.nor = new Player({
            scene: this,
            x: initPos.x,
            y: initPos.y,
        });

        // ! Configuración del pedestal
        this.pedestal = new Pedestal({
            scene: this,
            x: pedestalPos.x,
            y: pedestalPos.y,
        });

        this.createListeners();
    }

    onQuit() {
        if (!this.isBusy && !this.isQuiting && !this.isGG) {
            this.isQuiting = true;
            this.nor.stand(false);
            this.scene.launch('SimpleFadeEffect', { fadeIn: true, yoyo: true });
            this.add.tween({
                targets: [this.nor],
                duration: 1000,
                props: {
                    alpha: 1,
                },
                onUpdate: () => {
                    if (this.activeMusic.volume > 0)
                        this.activeMusic.setVolume(this.activeMusic.volume - 0.02);
                },
                onComplete: () => {
                    this.activeMusic.stop();
                    this.scene.stop();
                    this.scene.stop("GUI");
                    this.scene.start("Start");
                }
            });
        }
    }

    onDeath() {
        this.onQuit();
    }

    onFinish() {
        if (!this.isQuiting) {
            this.scene.launch('FinalCredits', {
                onFinish: () => {
                    this.scene.stop();
                    this.scene.stop("GUI");
                    this.scene.start('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                    this.scene.launch("Start");
                },
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
        // this.nor.obtainWeapon({ type: 'sword' });
        // this.nor.obtainWeapon({ type: 'bow' });
    }

    update(time, delta) {
        // ! Se actualizan las físicas de Nor!
        this.nor.update();

        // ! Se actualizan las físicas de los enemigos!
        this.mapEnemies.forEach(enemy => {
            enemy.update({ player: this.nor, time: time, delta: delta });
        });

        // ! Se actualizan las físicas de Barry (en caso de que siga)
        if (this.barry.update) this.barry.update({ player: this.nor });

        // ! Si Nor se sale de la escena actual, se mueve la cámara
        if (this.checkIfOutOfBounds()) {
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
            [
                this.mapWalls,
                this.mapHalfWalls,
            ]
        );

        // ! Si la flecha pega con la capa de "muros", entonces
        // ! se tiene que romper.
        this.physics.collide(
            [
                ...this.nor.attackObjects.arrows,
                ...Enemy.attackObjects.arrows,
            ],
            [
                this.mapWalls,
                ...this.mappedRocks,
            ],
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
                    this.interactSound.play();
                    sign.show();
                }
            }
        );

        // ! Cuando Nor interactúa con un NPC, empieza a chatear.
        this.physics.overlap(
            this.nor,
            this.mapNPCs,
            (_, npc) => {
                if (this.nor.isInteracting) {
                    this.interactSound.play();
                    if (npc instanceof IanDed) {
                        this.ianDed.handleChat({
                            hasObtained: {
                                ...this.nor.hasObtained,
                                key: this.nor.items.keys > 0,
                            },
                            gateOpened: !this.mappedTriggerTargets.some(target => {
                                return target.name === "initialGate";
                            }),
                        });
                    } else if (npc instanceof Maya) {
                        this.maya.handleChat({
                            noEnemies: this.mapEnemies.length === 0,
                        })
                    }
                }
            }
        );

        // ! Se agrega el manejo de overlap con los "vacíos" para que se caigan
        // ! Nor o los enemigos.
        this.physics.overlap(
            [
                this.nor,
                ...this.mapEnemies,
            ],
            this.mappedVoids,
            (anyone, hitbox) => {
                if (
                    (hitbox.body.right - anyone.body.left >= Void.xOverlap) && (anyone.body.right - hitbox.body.left >= Void.xOverlap) &&
                    (
                        (anyone.body.bottom - hitbox.body.top >= Void.bottomOverlap && anyone.body.bottom <= hitbox.body.bottom) ||
                        (hitbox.body.bottom - anyone.body.top >= Void.topOverlap && anyone.body.top >= hitbox.body.top)
                    )
                ) {
                    const respawn = hitbox.respawnPoint;
                    if (respawn) {
                        if (anyone instanceof Player) {
                            anyone.fall({
                                respawnPoint: respawn,
                                onDeath: () => {
                                    this.onDeath();
                                }
                            });
                        } else {
                            anyone.fall();
                            this.mapEnemies = this.mapEnemies.filter(e => e !== anyone);
                        }
                    }
                }
            }
        );

        // ! Agregada la colisión con las rocas
        this.physics.collide([
            this.nor,
            ...this.mapEnemies,
        ], this.mappedRocks);

        // ! Si Nor toca un item, se quita del escenario, dado que supuestamente 
        // ! lo agarró
        this.physics.overlap(this.nor, this.mapItems, (_, item) => {
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
                    this.nor.obtainWeapon({ type: item.type });
                    break;
                case "fragmented_emerald":
                    this.nor.obtainFragment();
                    break;
            }

            // ! Se tiene que consumir el objeto para que no vuelva a aparecer
            item.parent.consumed = true;
            item.parent.consumedOn = new Date().getTime();

            // * Se quita el elemento de la lista de items actuales
            this.mapItems = this.mapItems.filter(i => i !== item);
            item.destroy();
        })

        // ! Si Nor colisiona con un enemigo, tiene que actualizar su vida
        this.physics.overlap(this.nor, this.mapEnemies, (_, enemy) => {
            if (!enemy.isFalling) {
                const isDead = this.nor.getHurt({ damagePoints: enemy.damagePoints });
                if (isDead) this.onDeath();
            }
        });

        // ! Si Nor toca la explosión, entonces también recibe daño.
        this.physics.overlap(this.nor, this.nor.attackObjects.bombs, (_, bomb) => {
            const isDead = this.nor.getHurt({ damagePoints: bomb.damagePoints });
            if (isDead) this.onDeath();
        });

        // ! Si Nor toca una pared, no podrá pasarla.
        this.physics.collide([
            this.nor,
            ...this.mapEnemies,
        ], this.mappedTriggerTargets);

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
            (what, trigger) => {
                const valid =
                    trigger.type === "lock" && this.nor.items.keys > 0 && this.nor.isInteracting ||
                    trigger.type === "button" && (what instanceof Arrow) && this.nor.attackObjects.arrows.includes(what);

                if (valid) {
                    this.interactSound.play();
                    switch (trigger.type) {
                        case "lock":
                            this.nor.changeStats({ stat: 'key', addedPoints: -1 });
                            break;
                        case "button":
                            what.stomp();
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

        // ! Si Nor toca el pedestal, entonces GG.
        this.physics.overlap(this.nor, this.pedestal, () => {
            if (this.nor.isInteracting && this.nor.items.fragments >= 4 && !this.isGG) {
                this.interactSound.play();
                this.isGG = true;

                this.nor.placeEmerald();
                this.pedestal.placeEmerald();

                this.add.tween({
                    targets: [this.nor],
                    duration: 2000,
                    props: {
                        alpha: 1,
                    },
                    onUpdate: () => {
                        if (this.activeMusic.volume > 0)
                            this.activeMusic.setVolume(this.activeMusic.volume - 0.01);
                    },
                    onComplete: () => {
                        this.activeMusic.stop();
                    }
                });

                setTimeout(() => {
                    this.onFinish();
                }, 2000);
            }
        });

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
                if (isDead) this.onDeath();
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
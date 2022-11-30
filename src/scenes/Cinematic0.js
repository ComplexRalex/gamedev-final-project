class Cinematic0 extends Phaser.Scene {
    constructor() {
        super('Cinematic0');
    }

    init() {

        console.log("Escena 'Cinematic0' iniciada");

        // *
        // * Lista de propiedades utilizadas para el juego (temporalmente)
        // *

        // ! Definición de constantes

        // ? Medidas en pixeles
        this.tileWidth = 32;
        this.tileHeight = 32;
        this.sceneWidth = 640;
        this.sceneHeight = 480;

        // ? Medidas en tiles
        this.mapWidth = 40;
        this.mapHeight = 15;
        this.sceneWidthTiles = 20;
        this.sceneHeightTiles = 15;

        // * Coordenadas de la escena
        this.sceneCoords = {
            x: 0,
            y: 0,
        };

        // ! Variables de control

        // * No tiene sentido, pero el chiste es que el usuario no se spoilee xD
        this.barryAckIntro = localStorage.getItem('B4RRY_ACK_INTRO_VALUE') === '=)';
        this.barryAckEnd = localStorage.getItem('B4RRY_ACK_END_VALUE') === '=)';

        // * Claro, cuando ya pasó, pues ya lo vivió xD
        localStorage.setItem('B4RRY_ACK_INTRO_VALUE', '=)');
    }

    updateSceneCoords({ x, y }) {
        console.log("Coordenadas de la cámara", { x, y });
        this.sceneCoords = { x, y };
        this.updateCameraCoords();
    }

    updateCameraCoords() {
        const { x, y } = this.sceneCoords;
        const [centerX, centerY] = [
            x * this.sceneWidth + this.sceneWidth / 2,
            y * this.sceneHeight + this.sceneHeight / 2,
        ];
        this.cameras.main.centerOn(centerX, centerY);
    }

    create() {

        // ! Configuración de tiles y el mapa
        this.map = this.make.tilemap({
            key: 'cinematic0-tile-map',
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            width: this.mapWidth,
            height: this.mapHeight,
        });
        this.tsHillEfron = this.map.addTilesetImage("level3");
        this.tsCave = this.map.addTilesetImage("level4");
        this.tsHouses = this.map.addTilesetImage("houses");

        // ! >>>> Configuración de las capas de tiles

        // ! Esta capa será el fondo
        this.mapBackground = this.map.createLayer('Background', [
            this.tsHillEfron,
            this.tsCave,
        ]);

        // ! Esto es una prueba para ver si puede jalar más
        // ! de una capa de esta forma.
        this.mapHouses = this.map.createLayer('Houses', this.tsHouses);
        this.mapHouses.setDepth(5);


        // ! >>>> Configuración de las capas de objetos

        // ! Se hace uso de una capa exclusiva para las posiciones de las
        // ! entidades
        this.mapPositions = this.map.objects.find(layer => layer.name === "Positions").objects;

        // ! Ten (cuadro)
        const tenPos = this.mapPositions.find(obj => obj.name === 'ten');
        this.ten = this.add.image(tenPos.x, tenPos.y, 'ten', 'ten_frame')
            .setDepth(6);

        // ! Maya
        const mayaPos = this.mapPositions.find(obj => obj.name === 'maya');
        this.maya = this.add.sprite(mayaPos.x, mayaPos.y, 'maya');
        this.maya.anims.play('maya_attack');

        // ! Barry
        const barryPos = this.mapPositions.find(obj => obj.name === 'barry');
        this.barry = this.add.sprite(barryPos.x, barryPos.y, 'barry')
            .setFlipX(true)
            .setDepth(2);
        this.barry.anims.play('barry_idle_side');

        // ! Definición temporal de la esmeralda
        this.emerald = this.add.image(0, 0, 'emerald')
            .setAlpha(0)
            .setDepth(4);

        // ! Definición temporal de un agujero negro
        this.blackHole = this.add.sprite(0, 0, 'black_hole')
            .setAlpha(0)
            .setDepth(3);
        this.blackHole.anims.play('black_hole');

        // ! Definición temporal de una "explosion"
        this.explosion = this.add.circle(0, 0, 40, 0xFFFFFF)
            .setAlpha(0)
            .setDepth(7);

        // ! Configuración de cámara
        this.cameras.main.setBounds(0, 0,
            this.sceneWidth * this.tileWidth,
            this.sceneHeight * this.tileHeight,
        );
        this.updateSceneCoords({ x: 1, y: 0 }, true);

        this.guiGroup = this.add.group([
            this.add.image(0, 480, 'gui-bg')
                .setOrigin(0, 0)
                .setScale(4),
            this.add.image(this.sceneWidth, 480, 'gui-bg')
                .setOrigin(0, 0)
                .setScale(4),
        ]);

        const font = {
            fontFamily: 'monospace',
            fontSize: 24,
            fontStyle: 'italic'
        };
        this.textGroup = this.add.group([
            this.add.text(320, 540, '<cinemática>', font).setOrigin(0.5),
            this.add.text(960, 540, '<cinemática>', font).setOrigin(0.5),
        ]);

        this.add.tween({
            targets: this.textGroup.getChildren(),
            yoyo: true,
            repeat: -1,
            props: {
                alpha: 0,
            }
        });

        this.blackScreen = this.add.rectangle(0, 0,
            this.tileWidth * this.mapWidth,
            600,
            0x000000, 1,
        ).setOrigin(0).setDepth(10).setAlpha(0);

        this.soWhatsNextText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Nor empieza la aventura',
            {
                fontFamily: 'monospace',
                fontSize: 36,
            }
        ).setOrigin(0.5).setDepth(11).setAlpha(0);

        this.createCinematic();
    }

    createCinematic() {
        this.timeline = this.tweens.timeline({
            tweens: [
                {
                    targets: [this.barry],
                    delay: 1500,
                    duration: 1200,
                    ease: 'Sine.easeOut',
                    props: {
                        alpha: { from: 0, to: 1 },
                        x: this.barry.x - 100,
                    }
                },
                {
                    targets: [this.emerald],
                    delay: 200,
                    hold: 1200,
                    yoyo: true,
                    ease: 'Expo.easeOut',
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                    onStart: () => {
                        this.emerald.setPosition(this.barry.x - 20, this.barry.y);
                    },
                    onComplete: () => {
                        const ourChat = !this.barryAckIntro && !this.barryAckEnd
                            ? [
                                { who: 'barry', what: '¡No dejaré que vuelva a ocurrir!', forward: false },
                            ]
                            : this.barryAckIntro && !this.barryAckEnd
                                ? [
                                    { who: 'barry', what: 'Mmm...', forward: false },
                                ]
                                : this.barryAckIntro && this.barryAckEnd
                                    ? [
                                        { who: 'barry', what: '¡Aquí voy de nuevo!', forward: false },
                                    ]
                                    : [
                                        { who: 'barry', what: 'Mmm...', forward: false },
                                        { who: 'barry', what: 'Qué raro...', forward: false },
                                        { who: 'barry', what: '...', forward: false },
                                        { who: 'barry', what: 'Ya sé qué ocurre...', forward: false },
                                        { who: 'barry', what: 'Hola :)', forward: false },
                                        { who: 'barry', what: 'Sí, tú... al que está dentrás de esta pantalla.', forward: false },
                                    ];
                        this.chat(ourChat);
                    }
                },
                {
                    targets: [this.blackScreen],
                    delay: 100,
                    duration: 1000,
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                    onComplete: () => {
                        this.barry.setPosition(this.maya.x + 150, this.maya.y);
                        this.emerald.setPosition(this.barry.x - 20, this.barry.y);
                        this.emerald.setAlpha(1);
                        this.updateSceneCoords({ x: 0, y: 0 });
                    }
                },
                {
                    targets: [this.blackScreen],
                    hold: 800,
                    duration: 1000,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        const ourChat = !this.barryAckIntro && !this.barryAckEnd
                            ? [
                                { who: 'maya', what: 'No sé cómo sabes mi nombre, ni tampoco entendí nada de lo que dijiste, pero...', forward: true },
                                { who: 'maya', what: '¡LUCHARÉ POR FLORESTA!', forward: true },
                                { who: 'barry', what: '¿Estás segura de eso?', forward: false },
                            ]
                            : this.barryAckIntro && !this.barryAckEnd
                                ? [
                                    { who: 'maya', what: 'No sé cómo sabes mi nombre, ni tampoco entendí nada de lo que dijiste, pero...', forward: true },
                                    { who: 'maya', what: '¡LUCHARÉ POR FLORESTA!', forward: true },
                                    { who: 'barry', what: 'Acabemos con esto de una vez.', forward: false },
                                ]
                                : this.barryAckIntro && this.barryAckEnd
                                    ? [
                                        { who: 'maya', what: 'No sé cómo sabes mi nombre, ni tampoco entendí nada de-', forward: true },
                                        { who: 'barry', what: 'Ajam...', forward: false },
                                    ]
                                    : [
                                        { who: 'maya', what: 'No sé cómo sabes mi nombre, ni tampoco entendí nada de-', forward: true },
                                        { who: 'barry', what: 'Veo que estás jugando con mis valores de acknowledge, ¿verdad?', forward: false },
                                        { who: 'maya', what: '¿Qué?', forward: true },
                                        { who: 'barry', what: 'Ahhh, perdón... no estaba hablando contigo.', forward: false },
                                        { who: 'maya', what: '¿De qué estás ha-?', forward: true },
                                    ];
                        this.chat(ourChat);
                    }
                },
                {
                    targets: [this.blackHole],
                    delay: 100,
                    hold: 1800,
                    duration: 200,
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                    onStart: () => {
                        this.blackHole.setPosition(this.emerald.x, this.emerald.y);
                        this.cameras.main.shake(2000, 0.008, true);
                    },
                    onComplete: () => {
                        const ourChat = !this.barryAckIntro && !this.barryAckEnd
                            ? [
                                { who: 'maya', what: '¡¿PERO QUÉ RAYOS?!', forward: true },
                                { who: 'barry', what: 'Adiós =)', forward: false },
                            ]
                            : this.barryAckIntro && !this.barryAckEnd
                                ? [
                                    { who: 'maya', what: '¡¿PERO QUÉ RAYOS?!', forward: true },
                                    { who: 'barry', what: 'Adiós =D', forward: false },
                                ]
                                : this.barryAckIntro && this.barryAckEnd
                                    ? [
                                        { who: 'maya', what: '¡¿PERO QUÉ RAYOS?!', forward: true },
                                        { who: 'barry', what: 'Adiós, de nuevo =)', forward: false },
                                        { who: 'maya', what: '¡¿DE NUEVO?! ¡¿DE QUÉ HA-?!', forward: true },
                                    ]
                                    : [
                                        { who: 'maya', what: '¡¿PERO QUÉ RAYOS?!', forward: true },
                                        { who: 'barry', what: 'Bueno, ahora sabes mi secreto.', forward: false },
                                        { who: 'barry', what: '¡Creo que esto podrías verlo como un "easter egg"! está muy genial encontrarse esto en los jue-', forward: false },
                                        { who: 'maya', what: '¡¿QUÉ RAYOS ESTÁS DICIENDO?!', forward: true },
                                        { who: 'barry', what: 'Ahhh, cierto. Tengo que terminar contigo... nos vemos luego ;)', forward: false },
                                        { who: 'maya', what: '¡¿LUEGO?! ¡ESTÁS LOCO!', forward: true },
                                    ];
                        this.chat(ourChat);
                    }
                },
                {
                    targets: [this.explosion],
                    delay: 100,
                    hold: 800,
                    duration: 400,
                    props: {
                        alpha: { from: 0, to: 1 },
                        scale: { from: 1, to: 30 },
                    },
                    onStart: () => {
                        this.maya.anims.play('maya_surprise');
                        this.explosion.setPosition(this.emerald.x, this.emerald.y);
                        this.cameras.main.shake(400, 0.015, true);
                    }
                },
                {
                    targets: [this.blackScreen],
                    hold: 500,
                    duration: 1000,
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                },
                {
                    targets: [this.soWhatsNextText],
                    hold: 2000,
                    duration: 400,
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                },
                {
                    targets: [this.soWhatsNextText],
                    hold: 500,
                    duration: 400,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        this.scene.stop();
                        this.scene.start('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                        this.scene.launch('GUI');
                        this.scene.launch('Game');
                    }
                },
            ],
        });
    }

    chat(dialogs) {
        this.scene.pause();
        this.timeline.pause();
        this.scene.launch('Dialog', {
            type: 'chat',
            chat: dialogs,
            onFinish: () => {
                this.scene.resume();
                this.timeline.resume();
            }
        });
    }

    update(time, delta) { }
}
export default Cinematic0;
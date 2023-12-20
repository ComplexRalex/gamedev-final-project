class Cinematic0 extends Phaser.Scene {
    constructor() {
        super('Cinematic0');
    }

    init() {

        console.log("Escena 'Cinematic0' iniciada");

        // *
        // * Lista de propiedades utilizadas para el juego (temporalmente)
        // *

        // ! Lectura del mapa en Tiled (necesario ahora para las dimensiones)
        this.map = this.make.tilemap({
            key: 'cinematic0-tile-map',
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

    create() {

        // ! Música!
        this.barryMusic = this.sound.add('barry', {
            volume: 0.6,
            delay: 800,
            loop: true,
        });
        this.barryMusic.play();

        // ! Sonidos!
        this.blackHoleSound = this.sound.add('spinning_black_hole');
        this.explosionSound = this.sound.add('exploding_massively');

        // ! Configuración de tiles y el mapa
        // this.map = this.make.tilemap({
        //     key: 'cinematic0-tile-map',
        // });
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

        // ! Configuración de la GUI inferior
        this.gui = this.add.image(0, 480, 'gui-bg')
            .setOrigin(0, 0)
            .setScale(4);

        // ! Definición del texto que sugiere saltar la escena
        const font = {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'italic'
        };
        this.skipContainer = this.add.container(0, 480);
        const guiHalfHeight = (this.scale.height - this.sceneHeight) / 2;
        this.skipText = this.add.text(0, guiHalfHeight, 'Saltar cinemática con', font)
            .setOrigin(0, 0.5);
        this.skipContainer.add(this.skipText);
        this.skipButton = this.add.image(this.skipText.width + 10, guiHalfHeight, 'buttons/enter')
            .setOrigin(0, 0.5)
            .setScale(3);
        this.skipContainer.add(this.skipButton);
        this.skipContainer.setSize(this.skipText.width + this.skipButton.width + 10, 0)

        this.add.tween({
            targets: [this.skipContainer],
            yoyo: true,
            repeat: -1,
            props: {
                alpha: 0.25,
            }
        });

        // ! Definición del recuadro oscuro
        this.blackScreen = this.add.rectangle(0, 0,
            this.tileWidth * this.mapWidth,
            600,
            0x000000, 1,
        ).setOrigin(0).setDepth(10).setAlpha(0);

        // ! Definición del texto del comienzo
        this.soWhatsNextText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Nor empieza la aventura',
            {
                fontFamily: 'monospace',
                fontSize: 36,
            }
        ).setOrigin(0.5).setDepth(11).setAlpha(0);

        // ! Actualización de coordenadas de objetos
        this.updateSceneCoords({ x: 1, y: 0 });

        // ! Inicialización de las cinemáticas
        this.createCinematic();

        // ! Configuración de tecla para saltar cutscene
        this.skippedCutscene = false;
        this.input.keyboard.addKey('enter').on('down', () => {
            if (this.introCutscene?.isPlaying() && !this.textCutscene.isPlaying() && !this.skippedCutscene) {
                this.introCutscene.pause();
                this.textCutscene.play();
                this.skippedCutscene = true;
            }
        });
    }

    updateSceneCoords({ x, y }) {
        console.log("Coordenadas de la cámara", { x, y });
        this.sceneCoords = { x, y };
        this.updateCameraCoords();
        this.updateElementsCoords();
    }

    updateCameraCoords() {
        const { x, y } = this.sceneCoords;
        const [centerX, centerY] = [
            x * this.sceneWidth + this.sceneWidth / 2,
            y * this.sceneHeight + this.sceneHeight / 2,
        ];
        this.cameras.main.centerOn(centerX, centerY);
    }

    updateElementsCoords() {
        const { x } = this.sceneCoords;
        const xZero = x * this.sceneWidth;
        const xCenter = xZero + this.sceneWidth / 2;

        this.gui.setPosition(xZero, this.gui.y);
        this.skipContainer.setPosition(
            xZero + (this.sceneWidth - this.skipContainer.width) / 2,
            this.skipContainer.y,
        );
        this.soWhatsNextText.setPosition(xCenter, this.soWhatsNextText.y);
    }

    createCinematic() {
        this.introCutscene = this.tweens.timeline({
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
                    hold: 1200,
                    duration: 200,
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                    onStart: () => {
                        this.blackHoleSound.play();
                        this.blackHole.setPosition(this.emerald.x, this.emerald.y);
                        this.cameras.main.shake(1400, 0.008, true);
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
                        scale: { from: 1, to: 20 },
                    },
                    onStart: () => {
                        this.explosionSound.play();
                        this.maya.anims.play('maya_surprise');
                        this.explosion.setPosition(this.emerald.x, this.emerald.y);
                        this.cameras.main.shake(400, 0.015, true);
                    },
                    onUpdate: () => {
                        if (this.barryMusic.volume > 0)
                            this.barryMusic.setVolume(this.barryMusic.volume - 0.05);
                    },
                    onComplete: () => {
                        this.barryMusic.stop();

                        // * Se corre la siguiente cutscene cuando acaba la intro
                        this.textCutscene.play();
                    }
                },
            ],
        });

        this.textCutscene = this.tweens.timeline({
            paused: true,
            tweens: [
                {
                    targets: [this.blackScreen],
                    hold: 500,
                    duration: 1000,
                    props: {
                        alpha: { from: 0, to: 1 },
                    },
                    onUpdate: () => {
                        if (this.barryMusic.isPlaying && this.barryMusic.volume > 0) {
                            this.barryMusic.setVolume(this.barryMusic.volume - 0.01);
                        }
                    },
                    onComplete: () => {
                        if (this.introCutscene.isPlaying) this.introCutscene.stop();
                        if (this.barryMusic.isPlaying) this.barryMusic.stop();
                    }
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
        if (!this.skippedCutscene) {
            this.scene.pause();
            this.introCutscene.pause();
            this.scene.launch('Dialog', {
                type: 'chat',
                chat: dialogs,
                onFinish: () => {
                    this.scene.resume();
                    this.introCutscene.resume();
                }
            });
        }
    }

    update(time, delta) { }
}
export default Cinematic0;
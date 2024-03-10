class Start extends Phaser.Scene {
    constructor() {
        super({
            key: 'Start'
        });
    }

    init() {
        console.log('Start Scene');

        this.playClicked = false;
        this.topLayerScenePlaying = false;

        this.input.keyboard.removeAllListeners();
        this.input.keyboard.removeAllKeys();

        this.width = this.sys.game.scale.gameSize.width;
        this.height = this.sys.game.scale.gameSize.height;
    }

    create() {
        const eventos = Phaser.Input.Events;
        const keyCodes = Phaser.Input.Keyboard.KeyCodes;

        this.clickSound = this.sound.add('clicking');

        this.gameVersion = this.sys.game.config.gameVersion;

        this.simpleFont = {
            fontFamily: 'monospace',
        };

        this.contenedorFondo = this.add.container(0, 0);

        this.fondo = this.add.image(0, 0, 'fondo_p').setOrigin(0);
        this.contenedorFondo.add(this.fondo);
        this.h1 = this.add.image(100, -50, 'hoja1').setScale(0.2)
        this.contenedorFondo.add(this.h1);
        this.h2 = this.add.image(250, -150, 'hoja2').setScale(0.1)
        this.contenedorFondo.add(this.h2);
        this.h3 = this.add.image(350, -90, 'hoja1').setScale(0.2)
        this.contenedorFondo.add(this.h3);
        this.h4 = this.add.image(620, -120, 'hoja2').setScale(0.1)
        this.contenedorFondo.add(this.h4);
        this.titulo = this.add.image(320, 170, 'titulo_v2').setScale(0.5);
        this.play = this.add.image(320, 360, 'play').setScale(0.3).setInteractive();//////////
        this.contenedorFondo.add(this.play);
        this.krt = this.add.image(570, 520, 'logo_krt').setScale(0.15).setInteractive();
        this.contenedorFondo.add(this.krt);
        this.controles = this.add.image(70, 520, 'control').setScale(1.4).setInteractive();
        this.contenedorFondo.add(this.controles);
        this.botones = this.add.container(0, 0);
        this.botonEnter = this.add.image(320, 460, 'buttons/enter').setScale(2);
        this.botones.add(this.botonEnter);
        this.botonP = this.add.image(570, 570, 'buttons/p').setScale(2);
        this.botones.add(this.botonP);
        this.botonC = this.add.image(70, 570, 'buttons/c').setScale(2);
        this.botones.add(this.botonC);
        this.contenedorFondo.add(this.botones);
        this.version = this.add.text(
            this.width - 5,
            this.height - 5,
            "v" + this.gameVersion,
            this.simpleFont,
        ).setOrigin(1);
        this.contenedorFondo.add(this.version);
        this.menu_s = this.sound.add('menu');
        var musconf = {
            mute: false,
            volume: 1.5,
            //rate: 1,
            //detune: 2,
            seek: 3,
            loop: true,
            delay: 0
        }
        // this.t_h1_ = this.add.tween({
        //     targets: [this.h1],
        //     y: 600,
        //     yoyo: true,
        //     ease: 'Sine',

        //     onComplete: () => {
        //         this.h1.x = 100;
        //         this.h1.y = -50;
        //     }
        // });

        this.t_h1 = this.tweens.timeline({
            targets: [this.h1],
            paused: true,
            totalDuration: 5000,
            ease: 'Quint',
            tweens: [
                {
                    x: 300,
                },
            ]
        });
        this.t_h2 = this.tweens.timeline({
            targets: [this.h2],
            paused: true,
            totalDuration: 5000,
            ease: 'Quint',
            tweens: [
                {
                    x: 130,
                },
            ]
        });
        this.t_h3 = this.tweens.timeline({
            targets: [this.h3],
            paused: true,
            totalDuration: 5000,
            ease: 'Quint',
            tweens: [
                {
                    x: 630,
                },
            ]
        });
        this.t_h4 = this.tweens.timeline({
            targets: [this.h4],
            paused: true,
            totalDuration: 5000,
            ease: 'Quint',
            tweens: [
                {
                    x: 330,
                },
            ]
        });

        this.input.keyboard.addKey('enter').on('down', () => {
            this.onEnterGame();
        });

        this.input.keyboard.addKey('p').on('down', () => {
            this.onEnterCredits();
        });

        this.input.keyboard.addKey('c').on('down', () => {
            this.onEnterControls();
        });

        this.input.on(eventos.GAMEOBJECT_DOWN, (pointer, gameObject) => {
            switch (gameObject) {
                case this.play:
                    //lo que pasa al darle play o jugar
                    this.onEnterGame();
                    break;
                case this.controles:
                    //lo que pasa al darle play o jugar
                    this.onEnterControls();
                    break;
                case this.krt:
                    //lo que pasa al darle play o jugar
                    this.onEnterCredits();
                    break;
            }
        });
        this.input.on(eventos.GAMEOBJECT_OVER, (pointer, gameObject) => {
            switch (gameObject) {
                case this.play:
                    gameObject.setScale(0.4)
                    break;
                case this.controles:
                    gameObject.setScale(1.8)
                    break;
                case this.krt:
                    gameObject.setScale(0.20)
                    break;
            }
        });
        this.input.on(eventos.GAMEOBJECT_OUT, (pointer, gameObject) => {
            switch (gameObject) {
                case this.play:
                    gameObject.setScale(0.3)
                    break;
                case this.controles:
                    gameObject.setScale(1.4)
                    break;
                case this.krt:
                    gameObject.setScale(0.15)
                    break;
            }
        });
        //this.arbol = this.add.image(120, 300, 'pantallainicial/arbol').setScale(1.5);


        //this.play = this.add.sprite(830, 550, 'play').setScale(.5);
        //this.play.anims.play('play');
        this.menu_s.play(musconf);
        this.t_h1.play();
        this.t_h2.play();
        this.t_h3.play();
        this.t_h4.play();

        this.teclaesc = this.input.keyboard.addKey(keyCodes.ESC);
        this.teclaesc.on('down', () => {
            if (this.topLayerScenePlaying && !this.playClicked) {
                this.clickSound.play();
                this.tweens.getTweensOf(this.titulo).forEach(tween => tween.stop());
                this.topLayerScenePlaying = false;
                this.scene.stop('Credits');
                this.add.tween({
                    targets: [this.titulo, this.krt, this.play, this.controles, this.botones, this.version],
                    duration: 200,
                    props: {
                        alpha: {
                            from: 0,
                            to: 1,
                        },
                    }
                });
            }
        });
    }

    onEnterGame() {
        if (!this.playClicked && !this.topLayerScenePlaying) {
            this.clickSound.play();
            this.playClicked = true;
            const timeWhenClicked = new Date().getTime();
            this.add.tween({
                targets: [this.titulo],
                duration: 2500,
                ease: 'Sine.easeInOut',
                props: {
                    y: 300,
                    scaleX: 0.6,
                    scaleY: 0.6,
                },
            });
            this.add.tween({
                targets: [this.krt, this.controles, this.botones, this.version],
                props: {
                    alpha: 0,
                },
            });
            this.add.tween({
                targets: [this.play, this.botonEnter],
                duration: 3000,
                ease: 'Sine.easeInOut',
                props: {
                    y: 800,
                    angle: -45
                },
            });
            this.tweens.timeline({
                targets: [this.play, this.botonEnter],
                loop: 2,
                tweens: [
                    {
                        ease: 'Sine.easeOut',
                        duration: 300,
                        x: 320 + 30,
                    },
                    {
                        ease: 'Sine.easeInOut',
                        duration: 600,
                        x: 320 - 30,
                    },
                    {
                        ease: 'Sine.easeIn',
                        duration: 300,
                        x: 320,
                    },
                ]
            });
            this.add.tween({
                targets: [this.contenedorFondo],
                duration: 2000,
                ease: 'Expo.easeIn',
                hold: 1000,
                props: {
                    x: 660,
                },
                onComplete: () => {
                    this.add.tween({
                        targets: [this.titulo],
                        duration: 2000,
                        ease: 'Expo.easeIn',
                        props: {
                            x: -660,
                        },
                        onComplete: () => {
                            this.menu_s.stop();
                            this.scene.stop();
                            this.scene.start('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                            this.scene.launch('Menu', { initialTime: new Date().getTime() - timeWhenClicked });
                            this.scene.launch('Cinematic0');
                            // this.scene.start('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                            // this.scene.launch('GUI');
                            // this.scene.launch('Game');
                        },
                    })
                },
            });
            this.add.tween({
                targets: [this.contenedorFondo],
                duration: 5000,
                ease: 'Expo.easeIn',
                props: {
                    alpha: 1,
                },
                onUpdate: () => {
                    if (this.menu_s.volume > 0)
                        this.menu_s.setVolume(this.menu_s.volume - 0.005);
                },
            });
        }
    }

    onEnterCredits() {
        if (!this.topLayerScenePlaying && !this.playClicked) {
            this.clickSound.play();
            this.scene.launch('Credits');
            this.topLayerScenePlaying = true;
            this.add.tween({
                targets: [this.play, this.krt, this.titulo, this.controles, this.botones, this.version],
                props: {
                    alpha: {
                        from: 1,
                        to: 0,
                    },
                },
            });
        }
    }

    onEnterControls() {
        if (!this.topLayerScenePlaying && !this.playClicked) {
            this.clickSound.play();
            this.scene.launch('Controls');
            this.topLayerScenePlaying = true;
            this.add.tween({
                targets: [this.play, this.krt, this.titulo, this.controles, this.botones, this.version],
                props: {
                    alpha: {
                        from: 1,
                        to: 0,
                    },
                },
            });
        }
    }

    update(time, delta) {
        this.h1.y = this.h1.y + 5;
        this.h2.y = this.h2.y + 5;
        this.h3.y = this.h3.y + 5;
        this.h4.y = this.h4.y + 5;
        if (this.h1.y >= 620) {
            this.t_h1.play();
            this.tweens.makeActive(this.t_h1)
            this.h1.y = -50
            this.h1.x = 100
        }
        if (this.h2.y >= 620) {
            this.t_h2.play();
            this.tweens.makeActive(this.t_h2)
            this.h2.y = -100
            this.h2.x = 250
        }
        if (this.h3.y >= 620) {
            this.t_h3.play();
            this.tweens.makeActive(this.t_h3)
            this.h3.y = -70
            this.h3.x = 350
        }
        if (this.h4.y >= 620) {
            this.t_h4.play();
            this.tweens.makeActive(this.t_h4)
            this.h4.y = -150
            this.h4.x = 620
        }
    }
}

export default Start;
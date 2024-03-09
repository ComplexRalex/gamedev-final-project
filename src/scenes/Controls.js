class Controls extends Phaser.Scene {
    constructor() {
        super('Controls');
    }

    // ? Tipos: 'sign' | 'bubble'
    init() {
        console.log("Escena 'Controles' iniciada");

        // * Bandera para saber si está saliendo o no...
        this.isExiting = false;

        this.input.keyboard.removeAllListeners();
        this.input.keyboard.removeAllKeys();
    }

    create() {
        this.globalContainer = this.add.container(0, 0);

        this.titleFont = {
            fontFamily: 'monospace',
            fontSize: 36,
            fontStyle: 'bold',
            align: 'center',
        };

        this.subtitleFont = {
            fontFamily: 'monospace',
            fontSize: 24,
            fontStyle: 'bold',
            align: 'left',
        };

        this.textFont = {
            fontFamily: 'monospace',
            fontSize: 16,
            align: 'left',
        };

        let alturaActual = 50;
        const delta = 40;

        this.globalContainer.add(
            this.add.image(0, 0, 'big-gui-bg')
                .setOrigin(0)
                .setScale(4)
        );

        this.globalContainer.add(
            this.add.text(this.scale.width / 2, alturaActual, 'Controles', this.titleFont)
                .setOrigin(0.5)
        )
        alturaActual += delta;

        this.globalContainer.add(
            this.add.text(20, alturaActual, 'Menú principal', this.subtitleFont)
                .setOrigin(0, 0.5)
        )
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/enter',
                'Jugar'
            )
        );

        this.globalContainer.add(
            this.createButtonLabel(165, alturaActual,
                'buttons/p',
                'Créditos'
            )
        );

        this.globalContainer.add(
            this.createButtonLabel(165, alturaActual + 30,
                'buttons/c',
                'Controles (esta pantalla)'
            )
        );

        this.globalContainer.add(
            this.createButtonLabel(445, alturaActual,
                'buttons/esc',
                'Regresar'
            )
        );
        alturaActual += delta * 3;

        this.globalContainer.add(
            this.add.text(20, alturaActual, 'Juego', this.subtitleFont)
                .setOrigin(0, 0.5)
        )
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/z',
                'Atacar (arma primaria)'
            )
        );

        this.globalContainer.add(
            this.add.image(545, alturaActual, 'buttons/arrows')
                .setOrigin(0.5, 0)
                .setScale(3)
        );

        this.globalContainer.add(
            this.add.text(545, alturaActual + 110, 'Moverse', this.textFont)
                .setOrigin(0.5)
        );

        this.nor = this.add.sprite(545, alturaActual + 190, 'nor')
            .setScale(2);
        this.nor.anims.play('nor_walk_side');
        this.globalContainer.add(this.nor)
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/x',
                'Atacar (arma secundaria)'
            )
        );
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/a',
                'Alternar arma secundaria (izquierda)'
            )
        );
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/s',
                'Alternar arma secundaria (derecha)'
            )
        );
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/space',
                'Interactuar (carteles, cerraduras, etc)'
            )
        );
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/shift',
                'Correr'
            )
        );

        this.globalContainer.add(
            this.createButtonLabel(240, alturaActual,
                'buttons/enter',
                'Saltar cinemática'
            )
        );
        alturaActual += delta;

        this.globalContainer.add(
            this.createButtonLabel(20, alturaActual,
                'buttons/p',
                'Menú de pausa'
            )
        );
        alturaActual += delta;

        this.startingTween = this.add.tween({
            targets: [this.globalContainer],
            duration: 800,
            ease: 'Bounce.easeOut',
            props: {
                x: {
                    from: -this.scale.width,
                    to: 0,
                }
            }
        });

        this.input.keyboard.addKey('esc').on('down', () => {
            if (!this.isExiting) {
                this.isExiting = true;

                this.startingTween.stop();
                this.add.tween({
                    targets: [this.globalContainer],
                    duration: 300,
                    ease: 'Expo.easeOut',
                    props: {
                        x: -this.scale.width,
                    },
                    onComplete: () => {
                        this.scene.stop();
                    }
                });
            }
        });
    }

    createButtonLabel(x, y, sprite, content) {
        const cont = this.add.container(x, y);
        const button = this.add.image(0, 0, sprite)
            .setOrigin(0)
            .setScale(3);
        cont.add(button);
        const text = this.add.text(button.displayWidth + 10, button.displayHeight / 2, content, this.textFont)
            .setOrigin(0, 0.5);
        cont.add(text);
        return cont;
    }
}

export default Controls;
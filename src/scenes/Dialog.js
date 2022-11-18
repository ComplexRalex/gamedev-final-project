class Dialog extends Phaser.Scene {
    constructor() {
        super('Dialog');
    }

    // ? Tipos: 'sign' | 'bubble'
    init({ type = "sign", who, content, onFinish }) {
        this.type = type;
        this.who = who;
        this.content = content;
        this.onFinish = onFinish;
    }

    create() {
        this.showed = false;
        this.pressed = false;

        this.container = this.add.container(0, 0);

        this.rect = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5)
            .setOrigin(0);
        this.container.add(this.rect);

        this.add.tween({
            targets: [this.container],
            duration: 200,
            props: {
                alpha: {
                    from: 0,
                    to: 1,
                }
            },
            onComplete: () => {
                this.showed = true;
            },
        });

        if (this.type === "sign") {
            this.createSign();
        }
    }

    createSign() {
        this.dialogContainer = this.add.container(0, 480);
        this.container.add(this.dialogContainer);

        this.dialogContainer.add(
            this.add.image(0, 0, 'gui-sign').setScale(4).setOrigin(0)
        );

        this.text = this.add.text(
            this.scale.width / 2,
            60 - 10,
            this.content,
            {
                fontFamily: "'Courier New', monospace",
                fontSize: "16px",
                align: "center",
                color: "#000000",
                wordWrap: { width: this.scale.width - 40 }
            }
        ).setOrigin(0.5, 0.5);
        this.dialogContainer.add(this.text);

        this.guiSpace = this.add.image(this.scale.width - 10, 110, 'buttons/space')
            .setScale(3).setOrigin(1, 1).setAlpha(0.5);
        this.dialogContainer.add(this.guiSpace);

        this.input.keyboard.addKey('space').on('down', () => {
            if (this.showed && !this.pressed) {
                this.pressed = true;
                this.guiSpace.setAlpha(1);
                this.add.tween({
                    targets: [this.container],
                    duration: 200,
                    props: {
                        alpha: {
                            from: 1,
                            to: 0,
                        },
                    },
                    onComplete: () => {
                        this.scene.stop();
                        this.onFinish();
                    },
                });
            }
        });
    }
}

export default Dialog;
class Dialog extends Phaser.Scene {
    constructor() {
        super('Dialog');
    }

    // ? Tipos: 'sign' | 'chat'
    init({ type = "sign", content = '', chat = [], onFinish = () => { } }) {
        this.type = type;
        this.content = content;
        this.chat = chat;
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

        switch (this.type) {
            case "sign":
                this.createSign();
                break;
            case "chat":
                if (this.chat.length > 0) {
                    this.createChat();
                } else {
                    this.scene.stop();
                }
                break;
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
            this.getFont({
                wordWrap: this.scale.width - 100,
            }),
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
                        this.scene?.stop();
                        this.onFinish();
                    },
                });
            }
        });
    }

    createChat() {
        this.dialogContainer = this.add.container(0, 480);
        this.container.add(this.dialogContainer);

        this.index = 0;
        this.showNextDialog();

        this.input.keyboard.addKey('space').on('down', () => {
            if (this.showed && !this.pressed) {
                this.showed = false;
                if (this.chat.length > this.index) {
                    this.showNextDialog();
                } else {
                    this.pressed = true;
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
                            this.scene?.stop();
                            this.onFinish();
                        },
                    });
                }
            }
        });
    }

    showNextDialog() {
        this.dialogContainer.getAll().forEach(o => o.destroy());
        const dialog = this.createDialog(this.chat[this.index++]);
        this.dialogContainer.add(dialog);
        this.add.tween({
            targets: [dialog.getByName('text')],
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
    }

    createDialog({ who, what, forward }) {
        const bubble = this.add.container(0, 0);
        const props = {};
        if (!forward) {
            props.xDialog = 0;
            props.flipDialog = false;
            props.xFace = 130 * 4;
            props.flipFace = true;
        } else {
            props.xDialog = 32 * 4;
            props.flipDialog = true;
            props.xFace = 2 * 4;
            props.flipFace = false;
        }
        const dialogBubble = this.add.image(props.xDialog, 0, 'gui-dialog')
            .setScale(4).setOrigin(0, 0).setFlipX(props.flipDialog);
        bubble.add(dialogBubble);
        const space = this.add.image(
            props.xDialog + dialogBubble.displayWidth / 2, 25 * 4, 'buttons/space')
            .setScale(2);
        bubble.add(space);
        const face = this.add.image(props.xFace, 1 * 4, `faces/${who}`)
            .setScale(4).setOrigin(0, 0).setFlipX(props.flipFace);
        bubble.add(face);
        const text = this.add.text(
            props.xDialog + dialogBubble.displayWidth / 2,
            dialogBubble.displayHeight / 2 - 8,
            what,
            this.getFont({
                wordWrap: dialogBubble.displayWidth - 100,
            }),
        ).setOrigin(0.5, 0.5).setName('text');
        bubble.add(text);
        return bubble;
    }

    getFont({ wordWrap }) {
        return {
            fontFamily: "'Courier New', monospace",
            fontSize: "16px",
            align: "center",
            color: "#000000",
            wordWrap: { width: wordWrap },
        };
    }
}

export default Dialog;
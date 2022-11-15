class SimpleFadeEffect extends Phaser.Scene {
    constructor() {
        super('SimpleFadeEffect');
    }

    init({ fadeIn = false, yoyo = false }) {
        this.fadeIn = fadeIn;
        this.yoyo = yoyo;
        console.warn("SimpleFadeEffect lanzado con los siguientes parámetros: ", { fadeIn, yoyo });
    }

    create() {
        this.rect = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x000000)
            .setOrigin(0);

        if (!this.fadeIn) {
            this.add.tween({
                targets: [this.rect],
                duration: 1000,
                yoyo: this.yoyo,
                props: {
                    alpha: {
                        from: 1,
                        to: 0,
                    }
                },
                onComplete: () => {
                    this.scene.stop();
                }
            });
        } else {
            this.add.tween({
                targets: [this.rect],
                duration: 1000,
                hold: 100,
                yoyo: this.yoyo,
                props: {
                    alpha: {
                        from: 0,
                        to: 1,
                    }
                },
                onComplete: () => {
                    this.scene.stop();
                }
            });
        }
    }
}

export default SimpleFadeEffect;
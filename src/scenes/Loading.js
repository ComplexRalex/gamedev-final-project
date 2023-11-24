class Loading extends Phaser.Scene {
    constructor() {
        super('Loading');
    }

    preload() {
        this.load.path = './assets/';

        this.load.atlas({
            key: 'loading',
            textureURL: 'init/loading.png',
            atlasURL: 'init/loading_atlas.json',
        });

        this.load.animation({
            key: 'loading_anim',
            url: 'init/loading_anim.json',
        });
    }

    create() {
        this.loadingSprite = this.add.sprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 - 30,
            'loading'
        );
        this.loadingSprite.anims.play('loading');

        this.loadingText = this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 + 50,
            '...cargando...'
        ).setOrigin(0.5);

        this.loadingWhat = this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 + 80,
            '...'
        ).setOrigin(0.5);

        this.loadingGroup = this.add.group([
            this.loadingSprite,
            this.loadingText,
            this.loadingWhat,
        ]).setAlpha(0);

        this.registry.events.on('nowLoading', ({ what, finished }) => {
            if (!finished) {
                this.loadingWhat.setText(what ?? '...');
                return;
            }
            this.loadingText.setText('¡Carga completada!');
            this.loadingWhat.setText('');
        });

        this.registry.events.on('finishedLoading', (callback) => {
            this.add.tween({
                targets: this.loadingGroup.getChildren(),
                duration: 500,
                props: {
                    alpha: {
                        from: 1,
                        to: 0,
                    }
                },
                onComplete: () => {
                    if (callback) callback();
                },
            });
        })

        this.add.tween({
            targets: this.loadingGroup.getChildren(),
            duration: 200,
            props: {
                alpha: {
                    from: 0,
                    to: 1,
                }
            },
        });

        this.scene.launch('Bootloader');
    }
}

export default Loading;
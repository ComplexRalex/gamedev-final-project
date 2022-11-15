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
        const loadingSprite = this.add.sprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 - 30,
            'loading'
        );
        loadingSprite.anims.play('loading');

        this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 + 50,
            '...cargando...'
        ).setOrigin(0.5);

        this.scene.launch('Bootloader');
    }
}

export default Loading;
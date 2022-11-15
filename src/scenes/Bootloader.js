class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader');
    }

    preload() {
        console.log('Bootloader');
        console.warn("Loading assets...");
        this.load.path = './assets/';

        this.load.image([
            { key: 'textures', url: 'textures/textures.png' },
            { key: 'krt', url: 'logo_krt.png' },
        ]);

        this.load.atlas([
            // Characters
            { key: 'nor', textureURL: 'characters/nor/nor.png', atlasURL: 'characters/nor/nor_atlas.json' },

            // Objects
            { key: 'heart', textureURL: 'heart/heart.png', atlasURL: 'heart/heart_atlas.json' },
            { key: 'textures_atlas', textureURL: 'textures/textures.png', atlasURL: 'textures/textures_atlas.json' },
        ]);

        this.load.animation([
            { key: 'nor_anim', url: 'characters/nor/nor_anim.json' },
        ]);

        // ! Esta es la forma de cargar un mapa de "tiles"
        this.load.tilemapTiledJSON("tile-map", "textures/map.json", null);

        this.load.image([
            // Main menu

            // Background
            'fondo_p',

            // Logo
            'titulo',
            'titulo_v2',
            'logo_krt',
            'logokrt',

            // GUI (Menu)
            'play',

            // Objects (Menu)
            'hoja1',
            'hoja2',

            // Scene
            'scene',

            // GUI
            'nor-face',
            'weapon-bg',
            'gui-bg',
            'buttons/z',
            'buttons/x',
            'buttons/a',
            'buttons/s',
        ]);

        this.load.audio([
            { key: 'menu', url: 'music/main_loop.mp3' },
            { key: 'game', url: 'music/game_loop.mp3' }
        ]);

        this.load.on('complete', () => {
            console.warn("Loading complete!");

            this.launch
            // this.scene.start('Start');
            // this.scene.launch('SimpleFadeEffect', { fadeIn: false, yoyo: false });
            this.scene.start('GUI');
            this.scene.launch('Game');
        });
    }
}
export default Bootloader;
class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader');
    }

    preload() {
        console.log('Bootloader');
        console.warn("Loading assets...");
        this.load.path = './assets/';

        this.load.image([
            // * Main menu

            // Background
            { key: 'fondo_p', url: 'menu/fondo_p.png' },

            // Logo
            { key: 'titulo_v2', url: 'menu/titulo_v2.png' },
            { key: 'logo_krt', url: 'menu/logo_krt.png' },

            // GUI (Menu)
            { key: 'play', url: 'menu/play.png' },

            // Objects (Menu)
            { key: 'hoja1', url: 'menu/hoja1.png' },
            { key: 'hoja2', url: 'menu/hoja2.png' },

            // * Credits

            // Logo
            { key: 'logokrt', url: 'credits/logokrt.png' },

            // * Game

            // Extra
            { key: 'textures', url: 'game/textures/textures.png' },
            { key: 'krt', url: 'menu/logo_krt.png' },

            // GUI
            { key: 'nor-face', url: 'game/gui/nor-face.png' },
            { key: 'gui-bg', url: 'game/gui/gui-bg.png' },
            { key: 'weapon-bg', url: 'game/gui/weapon-bg.png' },
            { key: 'buttons/z', url: 'game/gui/buttons/z.png' },
            { key: 'buttons/x', url: 'game/gui/buttons/x.png' },
            { key: 'buttons/a', url: 'game/gui/buttons/a.png' },
            { key: 'buttons/s', url: 'game/gui/buttons/s.png' },
            { key: 'buttons/space', url: 'game/gui/buttons/space.png' },
            { key: 'buttons/shift', url: 'game/gui/buttons/shift.png' },
            { key: 'gui-dialog', url: 'game/gui/dialog.png' },
            { key: 'gui-sign', url: 'game/gui/sign.png' },

            // Characters (only those who don't have atlas)
            
            // Weapons (same note as above)
            { key: 'sword', url: 'game/objects/sword.png' },
            { key: 'bow', url: 'game/objects/bow.png' },
            { key: 'arrow', url: 'game/objects/arrow.png' },
            
            // Items (same note as above)
            { key: 'key', url: 'game/objects/key.png' },
            { key: 'arrows', url: 'game/objects/arrows.png' },
            { key: 'bombs', url: 'game/objects/bombs.png' },
            
            // Triggery stuff
            { key: 'lock', url: 'game/objects/lock.png' },
            { key: 'button', url: 'game/objects/button.png' },
            { key: 'rock', url: 'game/objects/rock.png' },
            { key: 'gate', url: 'game/objects/gate.png' },
            { key: 'pillars', url: 'game/objects/pillars.png' },
            { key: 'sign', url: 'game/objects/sign.png' },

            // Structures
            { key: 'house', url: 'game/objects/house.png' },
            { key: 'temple', url: 'game/objects/temple.png' },
            { key: 'sanctuary', url: 'game/objects/sanctuary.png' },
            { key: 'pedestal', url: 'game/objects/pedestal.png' },
        ]);

        this.load.atlas([
            // * Game

            // Characters
            { key: 'nor', textureURL: 'game/characters/nor/nor.png', atlasURL: 'game/characters/nor/nor_atlas.json' },

            // Weapons
            { key: 'bomb', textureURL: 'game/objects/bomb/bomb.png', atlasURL: 'game/objects/bomb/bomb_atlas.json' },
            { key: 'sword_attack', textureURL: 'game/objects/sword_attack/sword_attack.png', atlasURL: 'game/objects/sword_attack/sword_attack_atlas.json' },

            // Items
            { key: 'heart', textureURL: 'game/objects/heart/heart.png', atlasURL: 'game/objects/heart/heart_atlas.json' },
            { key: 'banana', textureURL: 'game/objects/banana/banana.png', atlasURL: 'game/objects/banana/banana_atlas.json' },

            // Textures (scene)
            { key: 'textures_atlas', textureURL: 'game/textures/textures.png', atlasURL: 'game/textures/textures_atlas.json' },
        ]);

        this.load.animation([
            // * Game

            // Characters
            { key: 'nor_anim', url: 'game/characters/nor/nor_anim.json' },
            
            // Weapons
            { key: 'sword_attack_anim', url: 'game/objects/sword_attack/sword_attack_anim.json' },
            { key: 'bomb_anim', url: 'game/objects/bomb/bomb_anim.json' },

            // Items
            { key: 'heart_anim', url: 'game/objects/heart/heart_anim.json' },
            { key: 'banana_anim', url: 'game/objects/banana/banana_anim.json' },
        ]);

        // ! Esta es la forma de cargar un mapa de "tiles"
        this.load.tilemapTiledJSON("tile-map", "game/textures/map.json", null);

        this.load.audio([
            { key: 'menu', url: 'music/main_loop.mp3' },
            { key: 'game', url: 'music/game_loop.mp3' }
        ]);

        this.load.on('complete', () => {
            console.warn("Loading complete!");

            this.scene.stop('Loading');
            // this.scene.start('Start');
            // this.scene.launch('SimpleFadeEffect', { fadeIn: false, yoyo: false });
            this.scene.start('GUI');
            this.scene.launch('Game');
        });
    }
}
export default Bootloader;
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
            { key: 'control', url: 'menu/control.png' },

            // Objects (Menu)
            { key: 'hoja1', url: 'menu/hoja1.png' },
            { key: 'hoja2', url: 'menu/hoja2.png' },

            // * Credits

            // Logo
            { key: 'logokrt', url: 'credits/logokrt.png' },

            // Credit Images
            { key: 'ed1', url: 'credits/ed1.png' },
            { key: 'ed2', url: 'credits/ed2.png' },
            { key: 'ed3', url: 'credits/ed3.png' },
            { key: 'ed4', url: 'credits/ed4.png' },
            { key: 'ed5', url: 'credits/ed5.png' },
            { key: 'ed6', url: 'credits/ed6.png' },
            { key: 'ed7', url: 'credits/ed7.png' },
            { key: 'ed8', url: 'credits/ed8.png' },
            { key: 'ed9', url: 'credits/ed9.png' },
            { key: 'ed10', url: 'credits/ed10.png' },
            { key: 'ed11', url: 'credits/ed11.png' },
            { key: 'ed12', url: 'credits/ed12.png' },
            { key: 'ed13', url: 'credits/ed13.png' },
            { key: 'ed14', url: 'credits/ed14.png' },
            { key: 'ed15', url: 'credits/ed15.png' },
            { key: 'ed16', url: 'credits/ed16.png' },
            { key: 'ed17', url: 'credits/ed17.png' },
            { key: 'ed18', url: 'credits/ed18.png' },
            { key: 'ed19', url: 'credits/ed19.png' },
            { key: 'ed20', url: 'credits/ed20.png' },
            { key: 'flash', url: 'credits/flash.png' },
            { key: 'fondo', url: 'credits/fondo.png' },
            { key: 'fin', url: 'credits/fin.png' },

            // * Game

            // Extra
            { key: 'generics', url: 'game/textures/generics/generics.png' },
            { key: 'krt', url: 'menu/logo_krt.png' },

            // GUI
            { key: 'nor-face', url: 'game/gui/nor-face.png' },
            { key: 'gui-bg', url: 'game/gui/gui-bg.png' },
            { key: 'big-gui-bg', url: 'game/gui/big-gui-bg.png' },
            { key: 'weapon-bg', url: 'game/gui/weapon-bg.png' },
            { key: 'buttons/z', url: 'game/gui/buttons/z.png' },
            { key: 'buttons/x', url: 'game/gui/buttons/x.png' },
            { key: 'buttons/a', url: 'game/gui/buttons/a.png' },
            { key: 'buttons/s', url: 'game/gui/buttons/s.png' },
            { key: 'buttons/p', url: 'game/gui/buttons/p.png' },
            { key: 'buttons/c', url: 'game/gui/buttons/c.png' },
            { key: 'buttons/space', url: 'game/gui/buttons/space.png' },
            { key: 'buttons/shift', url: 'game/gui/buttons/shift.png' },
            { key: 'buttons/enter', url: 'game/gui/buttons/enter.png' },
            { key: 'buttons/esc', url: 'game/gui/buttons/esc.png' },
            { key: 'buttons/arrows', url: 'game/gui/buttons/arrows.png' },
            { key: 'gui-dialog', url: 'game/gui/dialog.png' },
            { key: 'gui-sign', url: 'game/gui/sign.png' },

            // GUI faces
            { key: 'faces/nor', url: 'game/gui/faces/nor.png' },
            { key: 'faces/maya', url: 'game/gui/faces/maya.png' },
            { key: 'faces/ten', url: 'game/gui/faces/ten.png' },
            { key: 'faces/ian_ded', url: 'game/gui/faces/ian_ded.png' },
            { key: 'faces/barry', url: 'game/gui/faces/barry.png' },

            // Characters (only those who don't have atlas)

            // Weapons (same note as above)
            { key: 'sword', url: 'game/objects/sword.png' },
            { key: 'bow', url: 'game/objects/bow.png' },
            { key: 'arrow', url: 'game/objects/arrow.png' },

            // Items (same note as above)
            { key: 'key', url: 'game/objects/key.png' },
            { key: 'arrows', url: 'game/objects/arrows.png' },
            { key: 'bombs', url: 'game/objects/bombs.png' },
            { key: 'emerald', url: 'game/objects/emerald.png' },

            // Triggery stuff
            { key: 'lock', url: 'game/objects/lock.png' },
            { key: 'button', url: 'game/objects/button.png' },
            { key: 'rock', url: 'game/objects/rock.png' },
            { key: 'gate', url: 'game/objects/gate.png' },
            { key: 'pillars', url: 'game/objects/pillars.png' },
            { key: 'sign', url: 'game/objects/sign.png' },

            // Structures
            { key: 'pedestal', url: 'game/objects/pedestal.png' },

            // Textures
            { key: 'level1', url: 'game/textures/level1/jungle_zipela.png' },
            { key: 'level2', url: 'game/textures/level2/forest_haru.png' },
            { key: 'level3', url: 'game/textures/level3/hill_efron.png' },
            { key: 'level4', url: 'game/textures/level4/cave.png' },
            { key: 'indoors', url: 'game/textures/indoors/indoors.png' },
            { key: 'houses', url: 'game/textures/outdoors/houses.png' },
        ]);

        this.load.atlas([
            // * Game

            // Characters
            { key: 'nor', textureURL: 'game/characters/nor/nor.png', atlasURL: 'game/characters/nor/nor_atlas.json' },
            { key: 'maya', textureURL: 'game/characters/maya/maya.png', atlasURL: 'game/characters/maya/maya_atlas.json' },
            { key: 'ten', textureURL: 'game/characters/ten/ten.png', atlasURL: 'game/characters/ten/ten_atlas.json' },
            { key: 'ian_ded', textureURL: 'game/characters/ian_ded/ian_ded.png', atlasURL: 'game/characters/ian_ded/ian_ded_atlas.json' },
            { key: 'barry', textureURL: 'game/characters/barry/barry.png', atlasURL: 'game/characters/barry/barry_atlas.json' },

            // Enemies
            { key: 'snake', textureURL: 'game/characters/snake/snake.png', atlasURL: 'game/characters/snake/snake_atlas.json' },
            { key: 'wolf', textureURL: 'game/characters/wolf/wolf.png', atlasURL: 'game/characters/wolf/wolf_atlas.json' },
            { key: 'guard', textureURL: 'game/characters/guard/guard.png', atlasURL: 'game/characters/guard/guard_atlas.json' },

            // Weapons
            { key: 'bomb', textureURL: 'game/objects/bomb/bomb.png', atlasURL: 'game/objects/bomb/bomb_atlas.json' },
            { key: 'sword_attack', textureURL: 'game/objects/sword_attack/sword_attack.png', atlasURL: 'game/objects/sword_attack/sword_attack_atlas.json' },

            // Items
            { key: 'heart', textureURL: 'game/objects/heart/heart.png', atlasURL: 'game/objects/heart/heart_atlas.json' },
            { key: 'banana', textureURL: 'game/objects/banana/banana.png', atlasURL: 'game/objects/banana/banana_atlas.json' },
            { key: 'fragmented_emerald', textureURL: 'game/objects/fragmented_emerald/fragmented_emerald.png', atlasURL: 'game/objects/fragmented_emerald/fragmented_emerald_atlas.json' },

            // Objects
            { key: 'black_hole', textureURL: 'game/objects/black_hole/black_hole.png', atlasURL: 'game/objects/black_hole/black_hole_atlas.json' },

            // Textures
            { key: 'generics_atlas', textureURL: 'game/textures/generics/generics.png', atlasURL: 'game/textures/generics/generics_atlas.json' },
        ]);

        this.load.animation([
            // * Game

            // Characters
            { key: 'nor_anim', url: 'game/characters/nor/nor_anim.json' },
            { key: 'maya_anim', url: 'game/characters/maya/maya_anim.json' },
            { key: 'ten_anim', url: 'game/characters/ten/ten_anim.json' },
            { key: 'ian_ded_anim', url: 'game/characters/ian_ded/ian_ded_anim.json' },
            { key: 'barry_anim', url: 'game/characters/barry/barry_anim.json' },

            // Enemies
            { key: 'snake_anim', url: 'game/characters/snake/snake_anim.json' },
            { key: 'wolf_anim', url: 'game/characters/wolf/wolf_anim.json' },
            { key: 'guard_anim', url: 'game/characters/guard/guard_anim.json' },

            // Weapons
            { key: 'sword_attack_anim', url: 'game/objects/sword_attack/sword_attack_anim.json' },
            { key: 'bomb_anim', url: 'game/objects/bomb/bomb_anim.json' },

            // Items
            { key: 'heart_anim', url: 'game/objects/heart/heart_anim.json' },
            { key: 'banana_anim', url: 'game/objects/banana/banana_anim.json' },
            { key: 'fragmented_emerald_anim', url: 'game/objects/fragmented_emerald/fragmented_emerald_anim.json' },

            // Objects
            { key: 'black_hole_anim', url: 'game/objects/black_hole/black_hole_anim.json' },
        ]);

        // ! Esta es la forma de cargar un mapa de "tiles"
        // this.load.tilemapTiledJSON("tile-map", "game/textures/map.json", null);
        this.load.tilemapTiledJSON("floresta-tile-map", "game/textures/floresta.json", null);
        this.load.tilemapTiledJSON("cinematic0-tile-map", "game/textures/cinematic0.json", null);

        this.load.audio([

            // Music!

            // Menu
            { key: 'menu', url: 'music/floresta.mp3' },

            // Cinematic0
            { key: 'barry', url: 'music/barry.mp3' },

            // Game
            { key: 'jungle', url: 'music/jungle.mp3' },
            { key: 'forest', url: 'music/forest.mp3' },
            { key: 'hill', url: 'music/hill.mp3' },
            { key: 'cave', url: 'music/cave.mp3' },
            { key: 'wind', url: 'music/wind.mp3' },
            { key: 'bossfight', url: 'music/bossfight.mp3' },

            // Final credits
            { key: 'credits', url: 'music/credits.mp3' },


            // Sounds!

            // Menu
            { key: 'clicking', url: 'sfx/clicking.mp3' },

            // Cinematic0
            { key: 'exploding_massively', url: 'sfx/exploding_massively.mp3' },
            { key: 'spinning_black_hole', url: 'sfx/spinning_black_hole.mp3' },

            // Game
            { key: 'interacting', url: 'sfx/interacting.mp3' },
            { key: 'slashing', url: 'sfx/slashing.mp3' },
            { key: 'shooting_arrow', url: 'sfx/shooting_arrow.mp3' },
            { key: 'placing_bomb', url: 'sfx/placing_bomb.mp3' },
            { key: 'exploding_bomb', url: 'sfx/exploding_bomb.mp3' },
            { key: 'healing', url: 'sfx/healing.mp3' },
            { key: 'maximizing_life', url: 'sfx/maximizing_life.mp3' },
            { key: 'getting_item', url: 'sfx/getting_item.mp3' },
            { key: 'getting_special_item', url: 'sfx/getting_special_item.mp3' },
            { key: 'taking_damage', url: 'sfx/taking_damage.mp3' },
            { key: 'taking_damage_enemy', url: 'sfx/taking_damage_enemy.mp3' },
            { key: 'falling', url: 'sfx/falling.mp3' },
            { key: 'dying', url: 'sfx/dying.mp3' },
        ]);

        this.load.on(Phaser.Loader.Events.FILE_COMPLETE, (file, type) => {
            this.changeLoadingState({
                what: `[${String(type).toUpperCase()}]: ${file}`,
                finished: false,
            });
        })
        this.load.on(Phaser.Loader.Events.COMPLETE, () => {
            console.warn("Loading complete!");
            this.changeLoadingState({
                finished: true,
            });
            
            this.registry.events.emit('finishedLoading', () => {
                this.scene.stop('Loading');
                this.scene.launch('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                this.scene.start('Start');
                // this.scene.launch('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                // this.scene.start('GUI');
                // this.scene.launch('Game');
                // this.scene.launch('SimpleFadeEffect', { fadeIn: false, yoyo: false });
                // this.scene.start('Cinematic0');
            });
        });
    }

    changeLoadingState(state) {
        this.registry.events.emit('nowLoading', state);
    }
}
export default Bootloader;
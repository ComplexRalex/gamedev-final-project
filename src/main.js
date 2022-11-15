import Bootloader from './scenes/Bootloader.js';
import Start from './scenes/Start.js';
import GUI from './scenes/GUI.js';
import Game from './scenes/Game.js';
import SimpleFadeEffect from './scenes/SimpleFadeEffect.js';
import Credits from './scenes/Credits.js';

const config = {
    title: "proyecto_final",
    version: "0.0.1",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 640,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#444444",
    pixelArt: true,
    physics: {
        default: "arcade",
        "arcade": {
            debug: true,
        }
    },
    scene: [
        Bootloader,
        Start,
        Game,
        GUI,
        SimpleFadeEffect,
        Credits,
    ]
};

new Phaser.Game(config);
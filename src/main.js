import Loading from './scenes/Loading.js';
import Bootloader from './scenes/Bootloader.js';
import Start from './scenes/Start.js';
import GUI from './scenes/GUI.js';
import Cinematic0 from './scenes/Cinematic0.js';
import Game from './scenes/Game.js';
import SimpleFadeEffect from './scenes/SimpleFadeEffect.js';
import Credits from './scenes/Credits.js';
import FinalCredits from './scenes/FinalCredits.js';
import Controls from './scenes/Controls.js';
import Dialog from './scenes/Dialog.js';

const config = {
    title: "proyecto_final",
    version: "1.0.8",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 640,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#000000",
    pixelArt: true,
    physics: {
        default: "arcade",
        "arcade": {
            debug: true,
        }
    },
    scene: [
        Loading,
        Bootloader,
        Start,
        Cinematic0,
        Game,
        GUI,
        Dialog,
        SimpleFadeEffect,
        Controls,
        Credits,
        FinalCredits,
    ]
};

new Phaser.Game(config);
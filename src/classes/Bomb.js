import { deg2Rad } from "../helpers/deg2Rad.js";
import { getAngle } from "../helpers/getAngle.js";

class Bomb extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, onFinish }) {
        super(scene, x, y + 10, 'bomb');

        // !
        // ! World settings
        // this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // !
        // ! Physics things
        this.setScale(2);
        this.body.setCircle(24);
        // ? Esta deshabilitado hasta que explote
        this.body.enable = false;

        // !
        // ! Props, timer and animation
        this.onFinish = onFinish;
        this.currentTimeline = this.scene.tweens.timeline({
            targets: [this],
            tweens: [
                {
                    alpha: 1,
                    duration: 1000,
                    onStart: () => {
                        this.anims.play('bomb_active');
                    },
                },
                {
                    alpha: 1,
                    duration: 1000,
                    onStart: () => {
                        this.anims.play('bomb_preparing');
                    },
                },
                {
                    alpha: 1,
                    duration: 100,
                    onStart: () => {
                        // ? Se tiene que activar la colisión justo
                        // ? en el momento de la explosión.
                        this.body.enable = true;
                        this.anims.play('bomb_explode');
                        this.scene.cameras.main.shake(300, 0.008);
                        this.on('animationcomplete', () => {
                            this.vanish();
                        });
                    },
                }
            ],
        });
    }

    vanish() {
        this.currentTimeline.stop();
        this.onFinish();
    }
}

export default Bomb
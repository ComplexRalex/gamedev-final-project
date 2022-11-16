import { deg2Rad } from "../helpers/deg2Rad.js";
import { getAngle } from "../helpers/getAngle.js";

const distance = {
    x: 350,
    y: 350,
};

class Arrow extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, direction, onFinish }) {
        super(scene, x, y, 'arrow');

        // !
        // ! World settings
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        // !
        // ! Physics things
        // * Este está difícil, ya que las físicas Arcade no permiten
        // * rotar el cuerpo de colisión :c
        // * No se me ocurre otra solución más simple que hardcodear xD
        this.body.setCircle(13.5);
        this.body.setOffset(-10.5, 0.5);

        // !
        // ! Props, timer and animation
        const angle = getAngle(direction);
        this.onFinish = onFinish;
        this.setAngle(angle + 90);
        this.currentTween = this.scene.add.tween({
            targets: [this],
            duration: 800,
            props: {
                x: this.x + distance.x * Math.cos(deg2Rad(angle)),
                y: this.y + distance.y * Math.sin(deg2Rad(angle)),
            },
            onComplete: () => {
                this.stomp();
            },
        });
    }

    stomp() {
        this.currentTween.stop();
        this.onFinish(this);
    }
}

export default Arrow
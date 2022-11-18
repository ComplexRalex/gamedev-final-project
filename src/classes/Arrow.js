import { deg2Rad } from "../helpers/deg2Rad.js";
import { getAngle } from "../helpers/getAngle.js";

const distance = {
    x: 500,
    y: 500,
};

class Arrow extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, direction, onFinish }) {
        super(scene, x, y, 'arrow');

        // !
        // ! World settings
        // this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        // !
        // ! Physics things
        // * Este está difícil, ya que las físicas Arcade no permiten
        // * rotar el cuerpo de colisión :c
        // * No se me ocurre otra solución más simple que hardcodear xD
        this.body.setCircle(4);
        this.body.setOffset(-1.5, 10);
        
        // ? Si es muy grande el body, no tendrá sentido que la flecha
        // ? desaparezca al tocar la pared cuando en realidad no lo
        // ? parece.
        // this.body.setCircle(13.5);
        // this.body.setOffset(-10.5, 0.5);

        // !
        // ! Props, and velocity
        const angle = getAngle(direction);
        this.onFinish = onFinish;
        this.setAngle(angle + 90);

        // ? Antes era un tween, pero dado que la capa de
        // ? muro no detectaba su colisión, era necesario
        // ? cambiar a que usara las físicas (que creo que
        // ? era lo más lógico, lol).
        this.body.setVelocity(
            distance.x * Math.cos(deg2Rad(angle)),
            distance.y * Math.sin(deg2Rad(angle)),
        );
    }

    stomp() {
        this.onFinish(this);
    }
}

export default Arrow
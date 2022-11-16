import { getAngle } from "../helpers/getAngle.js";

class Sword extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, direction, onFinish }) {
        super(scene, x, y, 'sword_attack');

        // !
        // ! World settings
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // !
        // ! Position and movement things
        // ? x: -1 (izquierda) | 0 (en medio) | 1 (derecha)
        // ? y: -1 (arriba)    | 0 (en medio) | 1 (abajo)
        // this.logicDirection = {
        //     x: 0, // ? Dirección en el eje x
        //     y: 1, // ? Dirección en el eje y
        // };

        const angle = getAngle(direction);
        this.setFlipX(angle > 90 && angle < 270);
        this.setAngle(
            angle > 90 && angle < 270
                ? -getAngle({ x: -direction.x, y: direction.y })
                : angle
        );

        // !
        // ! Physics things
        // * Este está difícil, ya que las físicas Arcade no permiten
        // * rotar el cuerpo de colisión :c
        // * No se me ocurre otra solución más simple que hardcodear xD
        this.body.setCircle(24);

        // ? Normalización del cuerpo de colisión
        const [xCenter, yCenter] = [-24, 0];

        let xBody = direction.x !== 0
            ? direction.x > 0 ? 24 : -24
            : 0;
        let yBody = direction.y !== 0
            ? direction.y > 0 ? 24 : -24
            : 0;
        
        xBody += xBody !== 0 && yBody !== 0
            ? -1 * Math.sign(xBody) * 7
            : 0;
        yBody += xBody !== 0 && yBody !== 0
            ? -1 * Math.sign(yBody) * 7
            : 0;

        this.body.setOffset(xCenter + xBody, yCenter + yBody);

        // !
        // ! Timer and animation
        this.anims.play(`sword_attack`);
        this.anims.hideOnComplete = true;
        this.on('animationcomplete', () => {
            onFinish();
        });
    }
}

export default Sword
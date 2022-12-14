import { getAngle } from "../helpers/getAngle.js";
import Arrow from "./Arrow.js";

class Bow extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, direction, hasArrows, velocity, onShoot, onFinish, onStomp }) {
        super(scene, x, y, 'bow');

        // !
        // ! World settings
        // this.scene = scene;
        this.scene.add.existing(this);

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
        // ! Props
        this.onShoot = onShoot;
        this.onStomp = onStomp;
        this.onFinish = onFinish;
        this.direction = direction;
        this.velocity = velocity;

        // !
        // ! Sound
        this.shootArrow = this.scene.sound.add('shooting_arrow');

        // !
        // ! Visual stuff
        this.setOrigin(
            direction.x >= 0 ? -0.5 : 1.5,
            0.5,
        );
        this.setAlpha(0);
        this.scene?.add.tween({
            targets: [this],
            duration: 80,
            yoyo: true,
            hold: 160,
            props: {
                alpha: {
                    from: 0,
                    to: 1,
                },
            },
            onComplete: () => {
                this.onFinish();
            },
        });

        if (hasArrows) {
            this.spawnArrow();
        }
    }

    spawnArrow() {
        this.shootArrow.play();
        const arrow = new Arrow({
            scene: this.scene,
            x: this.x,
            y: this.y,
            direction: this.direction,
            velocity: this.velocity,
            onFinish: this.onStomp,
        });
        this.onShoot(arrow);
    }
}

export default Bow
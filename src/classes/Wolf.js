import Enemy from "./Enemy.js";
import { getAngle } from '../helpers/getAngle.js';
import { deg2Rad } from "../helpers/deg2Rad.js";

class Wolf extends Enemy {
    static detectionRadius0 = 350;
    static detectionRadius1 = 500;

    constructor({
        scene,
        x,
        y,
        parent,
        variant = 0,
        hp = 4,
        scale,
        tint,
        drops,
        dropEverything,
        dropDirection,
    }) {
        super({
            scene,
            x,
            y,
            parent,
            variant,
            sprite: 'wolf',
            hp,
            scale,
            tint,
            type: 'wolf',
            drops,
            dropEverything,
            dropDirection,
        });

        // !
        // ! Props
        this.flipX = true;

        // !
        // ! Animation

        // * Esto sirve para poder definir la dirección a la que está
        // * viendo actualmente. Puede ser: 'left' | 'right'
        this.direction = this.prevDirection = 'right';
        // * Este es útil para saber en qué dirección dirigirse
        this.angleDirection = 0;
        // * Posibles estados: 'idle' | 'run' | 'howl'
        this.action = this.prevAction = 'idle';

        // ! Se reproduce la animación de 'idle' en un inicio
        // this.anims.play(`wolf_${this.action}`);
        this.anims.play(`wolf_howl`);

        // !
        // ! Physics stuff
        this.body.setSize(43, 32);
        this.body.setOffset(15, 8);

        let detectionRadius;
        switch (variant) {
            case 0:
                this.acceleration = 380;
                detectionRadius = Wolf.detectionRadius0;
                this.body.setMaxVelocity(250);
                break;
            case 1:
                this.acceleration = 450;
                detectionRadius = Wolf.detectionRadius1;
                this.body.setMaxVelocity(320);
                break;
        }
        this.body.setDrag(800);

        // ! Se crea un radio de colisión para detectar al personaje
        this.detectionArea = this.scene.add.circle(this.x, this.y, detectionRadius);
        this.scene.physics.world.enable(this.detectionArea);
        this.detectionArea.body.setCircle(detectionRadius);

        // !
        // ! Control props

        // ! Esta bandera permite saber si está "aullando"
        this.isHowling = false;
        this.howlingTime = 1000;

        // ! Este timer sirve para llevar el tiempo que lleva
        // ! sin aullar
        this.noHowlingCurrentTime = 0;
        this.noHowlingTime = 6000;
    }

    destroy() {
        this.detectionArea.destroy();
        super.destroy();
    }

    getHurt({ damagePoints = 1 }) {
        super.getHurt({ damagePoints });
        this.action = 'howl';
        this.anims.play("wolf_howl");
    }

    update({ player, delta }) {
        this.prevAction = this.action;
        this.body.setAcceleration(0);
        if (!this.isDead && !this.isStunned && !this.isFalling) {
            this.detectionArea.setPosition(this.x, this.y);
            const overlap = this.scene.physics.overlap(player, this.detectionArea, () => {
                if (!this.isHowling) {
                    this.noHowlingCurrentTime += delta;

                    // if (true) {
                    if (this.noHowlingCurrentTime < this.noHowlingTime) {
                        this.angleDirection = getAngle({
                            x: player.x - this.x,
                            y: player.y - this.y
                        });

                        this.body.setAcceleration(
                            this.acceleration * Math.cos(deg2Rad(this.angleDirection)),
                            this.acceleration * Math.sin(deg2Rad(this.angleDirection)),
                        );

                        this.flipX = this.angleDirection > 90 && this.angleDirection < 270 ? false : true;
                    } else {
                        this.noHowlingCurrentTime = 0;
                        this.isHowling = true;
                        setTimeout(() => {
                            this.isHowling = false;
                        }, this.howlingTime);
                    }
                }
            });
            this.action = this.isHowling
                ? 'howl'
                : overlap ? 'run' : 'idle';

            if (this.action !== this.prevAction) {
                this.anims.play(`wolf_${this.action}`);
            }
        }
    }
}

export default Wolf;
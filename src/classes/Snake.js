import Enemy from "./Enemy.js";

class Snake extends Enemy {
    static detectionRadius0 = 250;
    static detectionRadius1 = 400;

    constructor({
        scene,
        x,
        y,
        parent,
        variant = 0,
        hp = 2,
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
            sprite: 'snake',
            hp,
            scale,
            tint,
            type: 'snake',
            drops,
            dropEverything,
            dropDirection,
        });

        // !
        // ! Animation

        // * Esto sirve para poder definir la dirección a la que está
        // * viendo actualmente. Puede ser: 'left' | 'right'
        this.direction = this.prevDirection = 'right';
        // * Posibles estados: 'idle' | 'walk' | 'hurt' | 'dead'
        this.action = this.prevAction = 'idle';

        // ! Se reproduce la animación de 'idle' en un inicio
        this.anims.play(`snake_${this.action}`);

        // !
        // ! Physics stuff
        this.acceleration = 5000;
        this.body.setCircle(this.body.halfHeight);
        this.body.setOffset(5, 0);

        let detectionRadius;
        switch (variant) {
            case 0:
                detectionRadius = Snake.detectionRadius0;
                this.body.setMaxVelocity(5000);
                this.body.setDrag(420);
                break;
            case 1:
                detectionRadius = Snake.detectionRadius1;
                this.body.setMaxVelocity(6000);
                this.body.setDrag(390);
                break;
        }

        // ! Se crea un radio de colisión para detectar al personaje
        this.detectionArea = this.scene.add.circle(this.x, this.y, detectionRadius);
        this.scene.physics.world.enable(this.detectionArea);
        this.detectionArea.body.setCircle(detectionRadius);

        // !
        // ! Control props

        // ! Esta bandera permite saber si ya se ha movido "un poco"
        this.isMoving = false;
        this.movingTime = 190;
    }

    destroy() {
        this.detectionArea.destroy();
        super.destroy();
    }

    getHurt({ damagePoints = 1 }) {
        super.getHurt({ damagePoints });
        if (!this.isDead) {
            this.action = 'hurt';
            this.anims.play("snake_hurt");
        } else {
            this.action = 'dead';
            this.anims.play("snake_dead");
        }
    }

    update({ player }) {
        this.prevAction = this.action;
        this.body.setAcceleration(0);
        if (!this.isDead && !this.isStunned && !this.isFalling) {
            this.detectionArea.setPosition(this.x, this.y);
            const overlap = this.scene.physics.overlap(player, this.detectionArea, () => {
                if (!this.isMoving) {
                    this.isMoving = true;

                    const distanceX = player.x - this.x;
                    const distanceY = player.y - this.y;

                    if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                        this.flipX = distanceX < 0 ? true : false;
                        this.body.setAccelerationX(Math.sign(distanceX) * this.acceleration);
                    } else {
                        this.body.setAccelerationY(Math.sign(distanceY) * this.acceleration);
                    }

                    setTimeout(() => {
                        this.isMoving = false;
                    }, this.movingTime);
                }
            });
            this.action = overlap ? 'walk' : 'idle';

            if (this.action !== this.prevAction) {
                this.anims.play(`snake_${this.action}`);
            }
        }
    }
}

export default Snake;
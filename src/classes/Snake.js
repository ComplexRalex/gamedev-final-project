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
        onDeath,
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
            onDeath,
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
        this.acceleration = 200;
        this.body.setCircle(this.body.halfHeight);
        this.body.setOffset(5, 0);

        let detectionRadius;
        switch (variant) {
            case 0:
                detectionRadius = Snake.detectionRadius0;
                this.body.setMaxVelocity(75);
                break;
            case 1:
                detectionRadius = Snake.detectionRadius1;
                this.body.setMaxVelocity(120);
                break;
        }
        this.body.setDrag(500);

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

    destroyComplements() {
        this.detectionArea?.destroy();
    }

    getHurt({ damagePoints = 1 }) {
        const alreadyDamaged = this.isDamaged;
        super.getHurt({ damagePoints });
        if (!this.isDead && !alreadyDamaged) {
            this.action = 'hurt';
            this.anims.play("snake_hurt");
        } else if (this.isDead) {
            this.action = 'dead';
            this.anims.play("snake_dead");
        }
    }

    update({ player }) {
        if (!this.isDead && !this.isStunned && !this.isFalling) {
            this.prevAction = this.action;
            this.body.setAcceleration(0);
            this.detectionArea.setPosition(this.x, this.y);
            const overlap = this.scene.physics.overlap(player, this.detectionArea, () => {

                const distanceX = player.x - this.x;
                const distanceY = player.y - this.y;

                if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                    this.flipX = distanceX < 0 ? true : false;
                    this.body.setAccelerationX(Math.sign(distanceX) * this.acceleration);
                } else {
                    this.body.setAccelerationY(Math.sign(distanceY) * this.acceleration);
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
import Enemy from "./Enemy.js";
import Bow from "./Bow.js";

class Guard extends Enemy {
    static detectionRadius = 350;

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
            sprite: 'guard',
            hp,
            scale,
            tint,
            type: 'guard',
            drops,
            dropEverything,
            dropDirection,
        });

        // !
        // ! Animation

        this.on('animationcomplete', () => {
            this.anims.play('guard_idle');
        });

        // ! Se reproduce la animación de 'idle' en un inicio
        this.anims.play(`guard_${this.action}`);

        // !
        // ! Props

        // * Se requiere saber el ángulo para disparar
        this.angleDirection = 0;

        // ! Se crea un radio de colisión para detectar al personaje
        this.detectionArea = this.scene.add.circle(this.x, this.y, Guard.detectionRadius);
        this.scene.physics.world.enable(this.detectionArea);
        this.detectionArea.body.setCircle(Guard.detectionRadius);

        // ! Control props

        // ! Esta bandera permite saber si el enemigo está "cargando"
        this.isLoading = false;

        switch (variant) {
            case 0: this.loadingTime = 1600; break;
            case 1: this.loadingTime = 800; break;
        }
    }

    destroyComplements() {
        this.detectionArea?.destroy();
    }

    getHurt({ damagePoints = 1 }) {
        super.getHurt({ damagePoints });
        if (!this.isDead) {
            this.anims.play("guard_hurt");
        } else {
            this.off('animationcomplete');
            this.anims.play("guard_dead");
        }
    }

    update({ player }) {
        if (!this.isDead && !this.isStunned && !this.isFalling) {
            // * Este no se utiliza, ya que el enemigo no se mueve
            // this.detectionArea.setPosition(this.x, this.y);
            this.scene.physics.overlap(player, this.detectionArea, () => {
                if (!this.isLoading) {
                    this.isLoading = true;

                    this.anims.play('guard_attack');
                    const direction = {
                        x: player.x - this.x,
                        y: player.y - this.y
                    };
                    const bow = new Bow({
                        scene: this.scene,
                        x: this.x,
                        y: this.y,
                        direction: direction,
                        velocity: 440,
                        hasArrows: true,
                        onShoot: (arrow) => {
                            Enemy.attackObjects.arrows.push(arrow);
                        },
                        onStomp: (arrow) => {
                            Enemy.attackObjects.arrows = Enemy.attackObjects.arrows.filter(object => object !== arrow);
                            arrow.destroy();
                        },
                        onFinish: () => {
                            bow.destroy();
                        }
                    });

                    setTimeout(() => {
                        this.isLoading = false;
                    }, this.loadingTime);
                }
            });
        }
    }
}

export default Guard;
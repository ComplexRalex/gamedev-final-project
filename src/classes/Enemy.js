class Enemy extends Phaser.GameObjects.Sprite {
    // ? Sirve para separar los items dropeados
    static gap = 26;

    // ? La idea de estos arreglos es que sean utilizados por el juego para
    // ? comparar si alguno de los objetos que se encuentran dentro están
    // ? "overlapeando" o colisionando con el jugador, con el fin de que
    // ? este puedan interactuar con él.
    // * Estos arreglos deben contener game objects con cuerpos de colisión.
    // * Sustancialmente, contendrán los objetos como:
    // * > > Flecha(s)
    // * > > Bomba(s)
    // * Es necesario notar que estos objetos son de clases específicas.
    static attackObjects = {
        arrows: [],
        bombs: [],
    };

    constructor({
        scene,
        x,
        y,
        parent,
        sprite,
        hp = 2,
        type = "enemy",
        variant = 0,
        drops = [],
        dropEverything = false,
        dropDirection = 'horizontal',
    }) {
        super(
            scene,
            x,
            y,
            sprite ?? 'generics_atlas',
            sprite ? undefined : 'enemy'
        );

        // !
        // ! World settings
        // this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // !
        // ! Enemy general props
        // ? Sostiene una referencia a su objeto "inicializador"
        this.parent = parent;
        // ? Indica el tipo de enemigo
        this.type = type;
        // ? Indica la variante del enemigo
        this.variant = variant;
        // ? Es un arreglo de tipos de items (strings, no objetos)
        this.drops = drops;
        // ? Este determina si el enemigo va a dropear todo o solo una cosa
        this.dropEverything = dropEverything;
        // ? En caso de que se dropee todo, entonces se determina la dirección.
        // ? Puede ser: 'vertial' | 'horizontal'
        this.dropDirection = dropDirection;

        // !
        // ! Physics stuff
        this.body.setDrag(700);
        this.body.setMaxVelocity(100);
        this.acceleration = 700;

        // !
        // ! Movement and animation things
        // ? Esta dirección es utilizada para la animación
        this.angleDirection = 0;
        this.direction = this.prevDirection = 'down';

        // * Posibles estados: 'idle' | 'walk' | 'attack' | 'hurt' | any
        this.action = this.prevAction = 'idle';

        // !
        // ! Health stuff
        this.healthDelta = 5;
        this.health = hp * this.healthDelta;
        this.damagePoints = 1;

        this.isDead = false;

        // * Este sirve para establecer un tiempo de invencibilidad
        // * al enemigo
        this.isDamaged = false;
        this.damagedImmuneEffectTime = 1000;
        this.isStunned = false;
        this.stunnedTime = 1000;

        // * Este sirve para determinar si el jugador ha caído al vacío.
        this.isFalling = false;
        this.fallingTime = 1200;
    }

    // ! Está pensado que los enemigos también tengan una forma
    // ! de recibir daño y, por lo tanto, una cantidad de vida.
    getHurt({ damagePoints = 1 }) {
        if (!this.isDamaged && !this.isFalling) {
            this.isDamaged = true;
            this.health -= this.healthDelta * damagePoints;
            this.setTint(0xFFAAAA);

            this.body.setAcceleration(0);
            this.body.setVelocity(0);

            if (this.health > 0) {
                if (!this.isStunned) {
                    this.isStunned = true;
                    const stunnedTween = this.scene.add.tween({
                        targets: [this],
                        repeat: -1,
                        yoyo: true,
                        duration: 100,
                        props: {
                            alpha: {
                                from: 0.5,
                                to: 0.75,
                            },
                            x: {
                                from: this.x,
                                to: this.x + 10,
                            }
                        },
                    });
                    setTimeout(() => {
                        this.isStunned = false;
                        this.setAlpha(1);
                        stunnedTween.stop();
                    }, this.stunnedTime);
                }
                setTimeout(() => {
                    this.isDamaged = false;
                    this.clearTint();
                }, this.damagedImmuneEffectTime);
            } else {
                this.isDead = true;
                this.parent.alive = false;
                this.body.enable = false;

                this.scene.add.tween({
                    targets: [this],
                    duration: 800,
                    props: {
                        angle: -45,
                        alpha: 0.45,
                    },
                    onStart: () => {
                        this.setTint(0xFF5555);
                    },
                    onComplete: () => {
                        this.dropItem();
                        this.destroy();
                    },
                });
            }
        }
        return this.isDamaged;
    }

    fall({ onDead }) {
        if (!this.isFalling) {
            this.isFalling = true;

            this.body.setAcceleration(0);
            this.body.setDrag(200);

            this.isDead = true;
            this.parent.alive = false;

            this.scene.add.tween({
                targets: [this],
                duration: this.fallingTime,
                props: {
                    angle: 360 * 3,
                    scale: 0.2,
                    alpha: 0,
                },
                onComplete: () => {
                    this.body.enable = false;
                    this.destroy();
                    onDead();
                },
            });
        }
    }

    dropItem() {
        if (this.drops?.length > 0 && !this.isFalling) {
            const v = this.dropDirection === 'vertical' ? 1 : 0;
            const h = this.dropDirection === 'horizontal' ? 1 : 0;
            if (this.dropEverything) {
                this.drops.filter(d => d).forEach((drop, index) => {
                    const times = Math.floor((index + 1) / 2);
                    const sign = index % 2 !== 0 ? 1 : -1;
                    this.scene.addItem({
                        type: drop,
                        x: this.x + h * Enemy.gap * times * sign,
                        y: this.y + v * Enemy.gap * times * sign,
                    });
                })
            } else {
                const randomPick = Math.floor(Math.random() * this.drops.length);
                if (this.drops[randomPick]) {
                    this.scene.addItem({
                        type: this.drops[randomPick],
                        x: this.x,
                        y: this.y,
                    });
                }
            }
        }
    }

    // ! REST OPERATOR ES SOLO TEMPORAL
    static onlyData({
        type,
        x,
        y,
        hp,
        drops,
        dropEverything,
        dropDirection,
        alive,
        ...rest
    }) {
        return {
            ...rest,
            type,
            x,
            y,
            hp,
            drops,
            dropEverything,
            dropDirection,
            alive,
        };
    }
}

export default Enemy
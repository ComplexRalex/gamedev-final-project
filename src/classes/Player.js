import Bomb from "./Bomb.js";
import Bow from "./Bow.js";
import Sword from "./Sword.js";

class Player extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y }) {
        super(scene, x, y, 'nor');

        // !
        // ! Physics things
        // this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        this.body.setSize(20, 48);
        this.body.setOffset(14, 16);
        this.body.setDrag(700);
        this.body.setMaxVelocity(100);

        this.maxVelocity = 100;
        this.acceleration = 700;
        this.speedUp = 1.3;

        // !
        // ! Movement and animation things
        // ? x: -1 (izquierda) | 0 (en medio) | 1 (derecha)
        // ? y: -1 (arriba)    | 0 (en medio) | 1 (abajo)
        this.logicDirection = {
            x: 0, // ? Dirección en el eje x
            y: 1, // ? Dirección en el eje y
        };
        // ? Esta dirección es utilizada para la animación
        this.direction = this.prevDirection = 'down';
        // * Posibles estados: 'idle' | 'walk' | 'attack' | 'hurt'
        this.action = this.prevAction = 'idle';

        this.anims.play(`nor_${this.action}_${this.direction}`);

        // * * * Teclas de movimiento.
        // * [UP]: Moverse hacia arriba
        // * [DOWN]: Moverse hacia abajo
        // * [RIGTH]: Moverse hacia la derecha
        // * [LEFT]: Moverse hacia la izquierda
        // * [SPACE]: Interactuar (llaves)
        // * [SHIFT]: Correr
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        // * [Z]: Usar arma primaria (espada)
        // * [X]: Usar arma secundaria (arco, bomba)
        // * [A]: Cambiar arma secundaria (izquierda)
        // * [S]: Cambiar arma secundaria (derecha)
        this.cursor.z = this.scene.input.keyboard.addKey('z');
        this.cursor.x = this.scene.input.keyboard.addKey('x');
        this.cursor.a = this.scene.input.keyboard.addKey('a');
        this.cursor.s = this.scene.input.keyboard.addKey('s');

        // !
        // ! Health and stat things
        this.health = 15;
        this.healthDelta = 5;
        this.healthMax = 30;

        this.isDead = false;

        this.isDoingSomething = false;
        this.doingSomethingTime = 350;

        // * Este únicamente determina el tiempo en el que la animación
        // * de Nor festejando se mantiene.
        this.gettingEmeraldFragmentTime = 1500;

        // * Este es útil cuando se colisiona con un objeto con el
        // * que se quiere interactuar, por lo que esta bandera es
        // * consultada para averiguarlo.
        this.isInteracting = false;
        this.interactingTime = 300;

        // * Este sirve para preguntar si el jugador está haciendo
        // * un ataque, con el fin de que se consulte directamente
        // * a esta bandera.
        this.isAttacking = false;
        this.attackingTime = 300;

        // * Este sirve para determinar si el jugador ha recibido daño y
        // * además si se encuentra en estado de "inmunidad".
        this.isDamaged = false;
        this.damagedImmuneEffectTime = 1200;

        // * Este es únicamente utilizando para determinar la duración de
        // * la animación.
        this.ouchFace = false;
        this.ouchFaceDuration = 250;

        this.items = {
            keys: 0,
            arrows: 0,
            bombs: 0,
            fragments: 0,
        };

        // !
        // ! Weapon stuff!!!11
        // * Relación a la obtención de armas
        this.hasObtained = {
            sword: false,
            bow: false,
            bomb: false,
        }

        // !
        // ! Secondary weapon stuff
        // ? Este es el índice en el arreglo según el arma que tenga
        // ? actualmente. -1 indica que no tiene. Este tendría que ser
        // ? diferente de -1 cuando hasObtained tenga 'true' en alguna de
        // ? sus propiedades.
        this.secondaryIndex = 0;
        // ? Este arreglo se llena según el arma que vaya consiguiendo.
        // ? Es decir, cuando consiga el arco, se agregará la palabra 'bow'
        // ? en este arreglo. Cuando tenga bombas, tendrá 'bomb' también.
        // * Idealmente:
        // this.secondaryWeapons = ['bow', 'bombs'];
        this.secondaryWeapons = ['bow'];

        // !
        // ! Weapong damage container?
        // ? La idea de estos arreglos es que sean utilizados por el juego para
        // ? comparar si alguno de los objetos que se encuentran dentro están
        // ? "overlapeando" o colisionando con algún enemigo, con el fin de que
        // ? estos puedan recibir daño.
        // * Estos arreglos deben contener game objects con cuerpos de colisión.
        // * Sustancialmente, contendrán los objetos como:
        // * > > Ataque de espada
        // * > > Flecha(s)
        // * > > Bomba(s)
        // * Es necesario notar que estos objetos son de clases específicas.
        this.attackObjects = {
            sword: [],
            arrows: [],
            bombs: [],
        };

        this.setListeners();
    }

    setListeners() {
        // ! Este hace que se interactúe
        this.cursor.space.on('down', () => {
            this.doSomething({
                type: 'interaction',
            });
        })

        // ! Este hace el ataque primario
        this.cursor.z.on('down', () => {
            this.doSomething({
                type: 'attack',
                weapon: 'sword',
            });
        });

        // ! Este hace el ataque secundario
        this.cursor.x.on('down', () => {
            if (this.hasObtained.bow || this.hasObtained.bomb) {
                this.doSomething({
                    type: 'attack',
                    weapon: this.secondaryWeapons[this.secondaryIndex],
                });
            }
        });

        // ! Este cambia al arma de la izquierda (si es que la hay)
        this.cursor.a.on('down', () => {
            if (this.secondaryIndex !== -1) {
                this.secondaryIndex = (
                    ((this.secondaryIndex - 1) % this.secondaryWeapons.length
                        + this.secondaryWeapons.length)
                    % this.secondaryWeapons.length
                );
                this.scene.registry.events.emit('changeWeapon', {
                    weapon: this.secondaryWeapons[this.secondaryIndex],
                });
            }
        });

        // ! Este cambia al arma de la derecha (si es que la hay)
        this.cursor.s.on('down', () => {
            if (this.secondaryIndex !== -1) {
                this.secondaryIndex =
                    (this.secondaryIndex + 1) % this.secondaryWeapons.length;
                this.scene.registry.events.emit('changeWeapon', {
                    weapon: this.secondaryWeapons[this.secondaryIndex],
                });
            }
        });
    }

    updateAnimation() {
        const direction = ['left', 'right'].includes(this.direction)
            ? 'side'
            : this.direction;
        this.anims.play(`nor_${this.action}_${direction}`);
    }

    // ! Este permite hacer una acción (cual sea). Se utiliza un método
    // ! así, ya que la animación que usar para ataques e interacción es
    // ! la misma, pero lo demás varía.
    // ? type: 'interaction' | 'attack'
    // ? weapon: null | 'sword' | 'bow' | 'bomb'
    doSomething({ type, weapon }) {
        if (!this.isDoingSomething) {
            this.isDoingSomething = true;

            // ! Establece que el personaje no se mueva si va a hacer algo
            this.body.setAcceleration(0, 0);

            // ! Se actualiza la animación de "hacer"
            this.action = 'do';
            this.updateAnimation();

            if (type === 'interaction') {
                this.interact();
            } else if (type === 'attack') {
                this.attack({ weapon });
            }

            // ! Luego de que pase cierto tiempo, ya podrá hacer más cosas
            setTimeout(() => {
                this.isDoingSomething = false;
            }, this.doingSomethingTime);
        }
    }

    // ! Solamente sirve para separar la lógica y que sea más legible
    interact() {
        if (!this.isInteracting) {
            this.isInteracting = true;
            setTimeout(() => {
                this.isInteracting = false;
            }, this.interactingTime);
        }
    }

    // ! En este se manejan todos los tipos de ataque, según el que haya
    // ! sido utilizado
    attack({ weapon }) {
        console.warn("Aquí se hace el manejo del ataque según sea el caso");
        switch (weapon) {
            case 'sword':
                if (this.hasObtained.sword) {
                    const sword = new Sword({
                        scene: this.scene,
                        x: this.x,
                        y: this.y,
                        direction: this.logicDirection,
                        onFinish: () => {
                            this.attackObjects.sword = this.attackObjects.sword.filter(weapon => weapon !== sword);
                            sword.destroy();
                        },
                    });
                    this.attackObjects.sword.push(sword);
                }
                break;
            case 'bow':
                if (this.hasObtained.bow) {
                    const hasArrows = this.items.arrows > 0;
                    if (hasArrows) {
                        this.items.arrows--;
                        this.scene.registry.events.emit('changeStats', { arrowNumber: this.items.arrows });
                    }
                    const bow = new Bow({
                        scene: this.scene,
                        x: this.x,
                        y: this.y,
                        direction: this.logicDirection,
                        hasArrows: hasArrows,
                        onShoot: (arrow) => {
                            this.attackObjects.arrows.push(arrow);
                        },
                        onStomp: (arrow) => {
                            this.attackObjects.arrows = this.attackObjects.arrows.filter(object => object !== arrow);
                            arrow.destroy();
                        },
                        onFinish: () => {
                            bow.destroy();
                        }
                    });
                }
                break;
            case 'bombs':
                if (this.hasObtained.bomb) {
                    if (this.items.bombs > 0) {
                        this.items.bombs--;
                        this.scene.registry.events.emit('changeStats', { bombNumber: this.items.bombs });

                        // Se cambia al arco
                        if (this.items.bombs === 0) {
                            this.secondaryIndex = 0;
                            this.secondaryWeapons.pop();
                            // console.log(this.secondaryWeapons);
                            this.scene.registry.events.emit('changeWeapon', {
                                weapon: this.secondaryWeapons[this.secondaryIndex],
                            });
                        }

                        const bomb = new Bomb({
                            scene: this.scene,
                            x: this.x,
                            y: this.y,
                            onFinish: () => {
                                // console.log("A VER PUES QUE PEDO");
                                this.attackObjects.bombs = this.attackObjects.bombs.filter(weapon => weapon !== bomb);
                                bomb.destroy();
                            },
                        });
                        this.attackObjects.bombs.push(bomb);
                    }
                }
                break;
        }
    }

    // ! Este es utilizado cuando se han recibido puntos de vida.
    getHealed({ healPoints }) {
        this.scene.cameras.main.flash(120, 180, 180, 180);
        this.changeHP({ addedHealthPoints: healPoints });
    }

    // ! Este es utilizado cuando se ha recibido daño.
    // ? damagePoints: un número de daño (y ya). Este será multiplicado por 5
    getHurt({ damagePoints }) {
        if (!this.isDamaged) {
            this.scene.cameras.main.flash(100, 150, 0, 0);
            this.isDamaged = true;
            this.ouchFace = true;
            this.changeHP({ addedHealthPoints: -damagePoints });

            if (this.health > 0) {
                this.scene.cameras.main.shake(150, 0.0015);
                const immuneEffectTween = this.scene.add.tween({
                    targets: [this],
                    repeat: -1,
                    yoyo: true,
                    duration: 200,
                    props: {
                        alpha: {
                            from: 0.5,
                            to: 0.75,
                        },
                    },
                });
                setTimeout(() => {
                    this.isDamaged = false;
                    immuneEffectTween.stop();
                    this.setAlpha(1);
                }, this.damagedImmuneEffectTime);
                setTimeout(() => {
                    this.ouchFace = false;
                }, this.ouchFaceDuration);

            } else {
                this.scene.cameras.main.shake(400, 0.005);
                this.isDead = true;

                this.scene.input.keyboard.removeAllKeys();
                this.body.setAcceleration(0);
                this.body.setVelocity(0);

                this.action = 'hurt';
                this.updateAnimation();
                this.scene.add.tween({
                    targets: [this],
                    duration: 800,
                    props: {
                        angle: -45,
                        alpha: 0.45,
                    },
                    onStart: () => {
                        this.setTint(0xFFAAAA);
                    }
                });
            }
        }
        return this.isDead;
    }

    obtainFragment() {
        this.changeStats({ stat: "fragments", addedPoints: 1 });

        this.isDoingSomething = true;
        this.action = "happy";
        this.anims.play("nor_happy");

        this.body.setVelocity(0);
        this.body.setAcceleration(0);

        this.fragment = this.scene.add
            .sprite(this.x, this.y - 28, 'fragmented_emerald')
            .setDepth(this.depth + 1);

        this.scene.add.tween({
            targets: [this.fragment],
            duration: 800,
            props: {
                y: this.y - 34,
            }
        });

        setTimeout(() => {
            this.fragment.destroy();
            this.isDoingSomething = false;
        }, this.gettingEmeraldFragmentTime);
    }

    // ! Cuando obtiene una nueva arma, se tiene que actualizar
    // ! el GUI, y unas banderas!
    obtainWeapon({ type }) {
        this.hasObtained[type] = true;
        this.scene.registry.events.emit('obtainWeapon', { type });
    }

    // ! Cuando se obtiene un contenedor de corazón, aumenta
    // ! la vida máxima
    changeMaxHealth({ numberOfContainersToAdd }) {
        this.scene.cameras.main.flash(150, 220, 180, 180);
        this.healthMax += numberOfContainersToAdd * 2 * this.healthDelta;
        this.health = this.healthMax;
        this.scene.registry.events.emit('changeHPStock', {
            health: this.health,
            healthMax: this.healthMax,
            healthDelta: this.healthDelta
        });
    }

    // ! Se utiliza para actualizar la vida
    changeHP({ addedHealthPoints = 0 }) {
        this.health += this.healthDelta * addedHealthPoints;
        this.health = this.health > this.healthMax
            ? this.healthMax
            : this.health;
        this.health = this.health < 0
            ? 0
            : this.health;

        // * Aquí se lanza el evento
        this.scene.registry.events.emit('changeHP', {
            health: this.health,
            healthDelta: this.healthDelta,
        });
    }

    changeStats({ stat, addedPoints }) {
        switch (stat) {
            case "key":
                this.items.keys += addedPoints;
                this.items.keys = this.items.keys >= 0 ? this.items.keys : 0;
                this.scene.registry.events.emit('changeStats', { keyNumber: this.items.keys });
                break;
            case "arrows":
                this.items.arrows += addedPoints;
                this.items.arrows = this.items.arrows >= 0 ? this.items.arrows : 0;
                this.scene.registry.events.emit('changeStats', { arrowNumber: this.items.arrows });
                break;
            case "bombs":
                if (!this.hasObtained.bomb) this.obtainWeapon({ type: 'bomb' });
                this.items.bombs += addedPoints;
                this.items.bombs = this.items.bombs >= 0 ? this.items.bombs : 0;
                if (!this.secondaryWeapons.includes('bombs')) {
                    this.secondaryWeapons.push('bombs');
                }
                this.scene.registry.events.emit('changeStats', { bombNumber: this.items.bombs });
                break;
            case "fragments":
                this.items.fragments += addedPoints;
                this.items.fragments = this.items.fragments >= 0 ? this.items.fragments : 0;
                this.scene.registry.events.emit('changeStats', { fragmentNumber: this.items.fragments });
                break;
        }
    }

    update() {

        if (!this.isDead && !this.isDoingSomething) {
            // ! Se establecen variables temporales para el movimiento
            let xAcceleration = 0;
            let yAcceleration = 0;

            // ! Si se presiona shift, se aumenta el límite de velocidad
            if (this.cursor.shift.isDown) {
                this.body.setMaxVelocity(this.maxVelocity * this.speedUp)
            } else {
                this.body.setMaxVelocity(this.maxVelocity)
            }

            // ! Se hace de forma secuencial el cálculo del movimiento
            if (this.cursor.left.isDown) xAcceleration -= this.acceleration;
            if (this.cursor.right.isDown) xAcceleration += this.acceleration;
            if (this.cursor.up.isDown) yAcceleration -= this.acceleration;
            if (this.cursor.down.isDown) yAcceleration += this.acceleration;

            // ! Se establece la aceleración final. Por ejemplo, si Nor
            // ! se moviera al mismo tiempo por derecha e izquierda, entonces
            // ! no habría aceleración en el eje x.
            this.body.setAcceleration(xAcceleration, yAcceleration);

            // ! Se hace la comprobación de la dirección a la que apunta
            if (this.cursor.right.isDown) {
                this.logicDirection.x = 1;
                this.logicDirection.y = 0;
                if (this.cursor.down.isDown) this.logicDirection.y = 1;
                else if (this.cursor.up.isDown) this.logicDirection.y = -1;
            } else if (this.cursor.left.isDown) {
                this.logicDirection.x = -1;
                this.logicDirection.y = 0;
                if (this.cursor.down.isDown) this.logicDirection.y = 1;
                else if (this.cursor.up.isDown) this.logicDirection.y = -1;
            } else if (this.cursor.down.isDown) {
                this.logicDirection.y = 1;
                this.logicDirection.x = 0;
            } else if (this.cursor.up.isDown) {
                this.logicDirection.y = -1;
                this.logicDirection.x = 0;
            }
            // console.log(this.logicDirection);

            // ! Según la aceleración que hay en los ejes, se determina
            // ! si el jugador se está moviendo y, por lo tanto, cual
            // ! animación corresponde
            this.prevAction = this.action;
            this.action = (xAcceleration !== 0 || yAcceleration !== 0)
                ? 'walk'
                : 'idle';
            this.action = this.ouchFace ? 'hurt' : this.action;
            // console.log(this.action);

            // ! Se toma como referencia lo anterior y las coordenadas
            // ! para detectar la dirección de la animación
            this.prevDirection = this.direction;
            if (this.logicDirection.y > 0) {
                if (this.direction !== 'down') {
                    this.direction = 'down';
                    this.flipX = false;
                }
            } else if (this.logicDirection.y < 0) {
                if (this.direction !== 'up') {
                    this.direction = 'up';
                    this.flipX = false;
                }
            } else if (this.logicDirection.x > 0) {
                if (this.direction !== 'right') {
                    this.direction = 'right';
                    this.flipX = false;
                }
            } else if (this.logicDirection.x < 0) {
                if (this.direction !== 'left') {
                    this.direction = 'left';
                    this.flipX = true;
                }
            }

            // ! Se encarga de actualizar la animación si algo cambió
            if (
                this.direction !== this.prevDirection ||
                this.action !== this.prevAction
            ) {
                this.updateAnimation();
            }
        }
    }
}

export default Player;
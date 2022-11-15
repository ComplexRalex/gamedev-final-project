class Player extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y }) {
        super(scene, x, y, 'nor');

        // !
        // ! Physics things
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

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
        // * Posibles estados: 'idle' | 'walk' | 'attack' | 'hurt'
        this.direction = this.prevDirection = 'down';
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
            bobms: 0,
        };

        // !
        // ! Secondary weapon stuff
        // * Relación al arma secundaria
        this.hasObtained = {
            bow: true,
            bomb: true,
        }
        // ? Este es el índice en el arreglo según el arma que tenga
        // ? actualmente. -1 indica que no tiene. Este tendría que ser
        // ? diferente de -1 cuando hasObtained tenga 'true' en alguna de
        // ? sus propiedades.
        this.secondaryIndex = 0;
        // ? Este arreglo se llena según el arma que vaya consiguiendo.
        // ? Es decir, cuando consiga el arco, se agregará la palabra 'bow'
        // ? en este arreglo. Cuando tenga bombas, tendrá 'bomb' también.
        // * Idealmente:
        // this.secondaryWeapons = ['bow', 'bomb'];
        this.secondaryWeapons = ['bow', 'bomb'];

        // !
        // ! Weapong damage container?
        // ? La idea de este arreglo es que sea utilizado por el juego para
        // ? comparar si alguno de los objetos que se encuentran dentro están
        // ? "overlapeando" o colisionando con algún enemigo, con el fin de que
        // ? estos puedan recibir daño.
        // * Este arreglo debe contener game objects con cuerpos de colisión.
        // * Sustancialmente, contendrá los objetos como:
        // * > > Ataque de espada
        // * > > Flecha(s)
        // * > > Bomba(s)
        // * Es necesario notar que estos objetos son de clases específicas.
        this.attackObjects = [];

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
                // ! Según sea el tipo de ataque, va a hacer algo xD
                switch (weapon) {
                    case 'sword':
                        // * Aquí hace cosas cuando tiene arco
                        this.attack({ weapon: 'sword' });
                        break;
                    case 'bow':
                        // * Aquí hace cosas cuando tiene arco
                        this.attack({ weapon: 'bow' });
                        break;
                    case 'bomb':
                        // * Aquí hace cosas cuando tiene bombas
                        this.attack({ weapon: 'bomb' });
                        break;
                }
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
    }

    // ! Este es utilizado cuando se ha recibido daño.
    // ? damagePoints: un número de daño (y ya). Este será multiplicado por 5
    getHurt({ damagePoints }) {
        if (!this.isDamaged) {
            this.isDamaged = true;
            this.ouchFace = true;
            this.changeHP({ addedHealthPoints: -damagePoints });

            if (this.health > 0) {
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
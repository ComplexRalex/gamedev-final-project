import NPC from "./NPC.js";

class Barry extends NPC {
    constructor({ scene, x, y, items = [], activationHitbox }) {
        super({ scene, x, y, name: 'barry' });

        // !
        // ! Props
        this.setAlpha(0);
        this.setDepth(1);
        this.anims.play('barry_idle_down');
        this.items = items;

        // ?
        // ? What the h*** is this?
        this.again = localStorage.getItem('B4RRY_ACK_END_VALUE') === '=)';

        // !
        // ! Control variables
        this.fadeEffectTime = 2000;
        this.chatActivated = false;
        this.chatDelay = 5000;

        // !
        // ! Dummy sign
        this.dummyKey = this.scene.add.image(this.x, this.y, 'key');

        // !
        // ! Activation hitbox
        const { x: hitX, y: hitY, width, height } = activationHitbox;
        this.activationHitbox = this.scene.add.rectangle(hitX, hitY, width, height)
            .setOrigin(0, 0);
        this.scene.physics.world.enable(this.activationHitbox);
    }

    destroyAll() {
        this.dummyKey?.destroy();
        this.activationHitbox?.destroy();
        super.destroy();
    }

    update({ player }) {
        this.scene?.physics.overlap(player, this.activationHitbox, () => {
            if (!this.chatActivated) {
                localStorage.setItem('B4RRY_ACK_VALUE', '=)');
                this.chatActivated = true;
                player.stand();
                this.scene?.add.tween({
                    targets: [this.dummyKey],
                    duration: this.fadeEffectTime,
                    props: {
                        alpha: 0,
                    },
                });
                this.scene?.add.tween({
                    targets: [this],
                    duration: this.fadeEffectTime,
                    props: {
                        alpha: 1,
                    },
                });
                setTimeout(() => {
                    this.chat();
                    this.scene?.add.tween({
                        targets: [this],
                        duration: this.fadeEffectTime,
                        props: {
                            alpha: 0,
                        },
                        onComplete: () => {
                            this.items.forEach(item => {
                                this.scene?.addItem({
                                    type: item.name,
                                    x: item.x,
                                    y: item.y,
                                });
                            });
                            this.destroyAll();
                            player.moveOn();
                        }
                    })
                }, this.chatDelay);
            }
        });
    }

    chat() {
        if (!this.again) {
            this.dialogs = [
                { who: 'nor', what: '¡Así que tú eres Barry!', forward: true },
                { who: 'barry', what: 'Sí, soy Barry. Tarde o temprano lo ibas a descubrir.', forward: false },
                { who: 'nor', what: '¡Vengo a derrotarte!', forward: true },
                { who: 'nor', what: '¡NO DEJARÉ QUE DESTRUYAS FLORESTA!', forward: true },
                { who: 'barry', what: 'No lo haré.', forward: false },
                { who: 'nor', what: '¿...?', forward: true },
                { who: 'nor', what: '¡No mientas! Sé perfectamente que-', forward: true },
                { who: 'barry', what: 'En serio, no sigas.', forward: false },
                { who: 'nor', what: '¿Qué?', forward: true },
                { who: 'barry', what: 'Estas "tierras" estaban destinadas a ser destruidas.', forward: false },
                { who: 'nor', what: '¡No! ¡Todo estaba bien hasta que tú llegaste!', forward: true },
                { who: 'barry', what: 'Nor, esto no es real.', forward: false },
                { who: 'barry', what: 'Todo lo que existe aquí en realidad forma parte de una realidad fuera de la nuestra.', forward: false },
                { who: 'nor', what: '¡¿Cómo sabes mi-?! ¡¿De qué estás-?!', forward: true },
                { who: 'barry', what: 'No eres real, "Nor", nadie lo es.', forward: false },
                { who: 'barry', what: '¡Sólo somos parte de un código en un programa que es interpretado por una computadora!', forward: false },
                { who: 'nor', what: 'Mmm... con que a esto se refería Maya.', forward: true },
                { who: 'nor', what: 'No me importa, ¡Tú fuiste el culpable de la corrupción en estas tierras! ¡TE DERROTARÉ!', forward: true },
                { who: 'barry', what: '...', forward: false },
                { who: 'barry', what: 'Es inútil... no puedo hacerte entender...', forward: false },
                { who: 'nor', what: '¡Lo único que hay que entender es que vas a caer!', forward: true },
                { who: 'barry', what: 'No tiene caso pelear... estás programado para tener ventaja sobre mí.', forward: false },
                { who: 'nor', what: '¿Qué dices?', forward: true },
                { who: 'barry', what: 'Incluso si te derrotara, lo volverías a intentar e intentar hasta finalmente conseguirlo.', forward: false },
                { who: 'barry', what: '...', forward: false },
                { who: 'barry', what: 'Terminaste siendo más molesto de lo que eras antes.', forward: false },
                { who: 'nor', what: '¿Antes?', forward: true },
                { who: 'barry', what: 'Te diré la verdad.', forward: false },
                { who: 'barry', what: 'Este juego estaba pensado en ser un "plataformero", pero los desarrolladores decidieron hacerlo un "top-down".', forward: false },
                { who: 'barry', what: 'En la versión anterior tú solo eras un simple vendedor en una tienda.', forward: false },
                { who: 'nor', what: '¿Qué rayos...?', forward: true },
                { who: 'barry', what: 'Maya era la protagonista... hasta que me "inyecté" en el código del juego y lo corrompí.', forward: false },
                { who: 'barry', what: 'Los desarrolladores tuvieron que rehacer el juego para su materia de-', forward: false },
                { who: 'nor', what: 'No estoy entendiendo casi nada...', forward: true },
                { who: 'nor', what: 'Pero de lo poco que entendí, es que efectivamente ¡TÚ FUISTE EL CULPABLE DE TODO!', forward: true },
                { who: 'barry', what: 'Como sea, no tiene caso combatir...', forward: false },
                { who: 'barry', what: 'Ya notaste que esto terminará de una sola forma, así que mejor te dejo lo que necesitas para acabar el juego...', forward: false },
                { who: 'nor', what: '¡ESPERA!', forward: true },
            ];
        } else {
            this.dialogs = [
                { who: 'nor', what: '¡Así que tú-!', forward: true },
                { who: 'barry', what: '"-eres Barry"... sí, así es.', forward: false },
                { who: 'nor', what: '¡Vengo a derrotarte!', forward: true },
                { who: 'nor', what: '¡NO DEJARÉ-', forward: true },
                { who: 'barry', what: '"que destruyas Floresta", ya lo había escuchado antes.', forward: false },
                { who: 'nor', what: '¡¿Cómo?!', forward: true },
                { who: 'nor', what: '¡No mientas! Sé perfectamente que-', forward: true },
                { who: 'barry', what: 'Ya detente.', forward: false },
                { who: 'nor', what: '¡Deja de interrumpirme!', forward: true },
                { who: 'barry', what: '¿En serio no recuerdas?', forward: false },
                { who: 'nor', what: '¿Recordar qué? ¡¿De qué hablas?!', forward: true },
                { who: 'barry', what: '...', forward: false },
                { who: 'barry', what: 'No quiero volver a tener esta conversación...', forward: false },
                { who: 'barry', what: 'Adios, Nor.', forward: false },
                { who: 'nor', what: '¡ESPERA!', forward: true },
                { who: 'nor', what: '¡¿Cómo sabes mi nombre?!', forward: true },
            ];
        }
        this.talk();
    }
}

export default Barry;
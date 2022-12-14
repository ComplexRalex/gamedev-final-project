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

        // ! Music
        this.windSound = this.scene.sound.add('wind', {
            loop: true,
        });
    }

    destroyAll() {
        this.dummyKey?.destroy();
        this.activationHitbox?.destroy();
        super.destroy();
    }

    update({ player }) {
        this.scene?.physics.overlap(player, this.activationHitbox, () => {
            if (!this.chatActivated) {
                localStorage.setItem('B4RRY_ACK_END_VALUE', '=)');
                this.scene.isBusy = true;
                this.chatActivated = true;
                player.stand();
                this.scene?.add.tween({
                    targets: [this.dummyKey],
                    duration: this.fadeEffectTime,
                    props: {
                        alpha: 0,
                    },
                    onUpdate: () => {
                        if (this.scene.activeMusic.volume > 0)
                            this.scene.activeMusic.setVolume(this.scene.activeMusic.volume - 0.01);
                    },
                    onComplete: () => {
                        this.scene.activeMusic.stop();
                    }
                });
                this.scene?.add.tween({
                    targets: [this],
                    duration: this.fadeEffectTime,
                    props: {
                        alpha: 1,
                    },
                });
                setTimeout(() => {
                    if (this.scene) {
                        this.windSound.play({ loop: true });
                        this.chat();
                        this.scene?.add.tween({
                            targets: [this],
                            duration: this.fadeEffectTime,
                            props: {
                                alpha: 0,
                            },
                            onUpdate: () => {
                                if (this.windSound.volume > 0)
                                    this.windSound.setVolume(this.windSound.volume - 0.005);
                            },
                            onComplete: () => {
                                this.windSound.stop();
                                this.scene.activeMusic.play({ loop: true, volume: 1 });
                                this.items.forEach(item => {
                                    this.scene?.addItem({
                                        type: item.name,
                                        x: item.x,
                                        y: item.y,
                                    });
                                });
                                this.scene.isBusy = false;
                                this.destroyAll();
                                player.moveOn();
                            }
                        })
                    }
                }, this.chatDelay);
            }
        });
    }

    chat() {
        if (!this.again) {
            this.dialogs = [
                { who: 'nor', what: '??As?? que t?? eres Barry!', forward: true },
                { who: 'barry', what: 'S??, soy Barry. Tarde o temprano lo ibas a descubrir.', forward: false },
                { who: 'nor', what: '??Vengo a derrotarte!', forward: true },
                { who: 'nor', what: '??NO DEJAR?? QUE DESTRUYAS FLORESTA!', forward: true },
                { who: 'barry', what: 'No lo har??.', forward: false },
                { who: 'nor', what: '??...?', forward: true },
                { who: 'nor', what: '??No mientas! S?? perfectamente que-', forward: true },
                { who: 'barry', what: 'En serio, no sigas.', forward: false },
                { who: 'nor', what: '??Qu???', forward: true },
                { who: 'barry', what: 'Estas "tierras" estaban destinadas a ser destruidas.', forward: false },
                { who: 'nor', what: '??No! ??Todo estaba bien hasta que t?? llegaste!', forward: true },
                { who: 'barry', what: 'Nor, esto no es real.', forward: false },
                { who: 'barry', what: 'Todo lo que existe aqu?? en realidad forma parte de una realidad fuera de la nuestra.', forward: false },
                { who: 'nor', what: '????C??mo sabes mi-?! ????De qu?? est??s-?!', forward: true },
                { who: 'barry', what: 'No eres real, "Nor", nadie lo es.', forward: false },
                { who: 'barry', what: '??S??lo somos parte de un c??digo en un programa que es interpretado por una computadora!', forward: false },
                { who: 'nor', what: 'Mmm... con que a esto se refer??a Maya.', forward: true },
                { who: 'nor', what: 'No me importa, ??T?? fuiste el culpable de la corrupci??n en estas tierras! ??TE DERROTAR??!', forward: true },
                { who: 'barry', what: '...', forward: false },
                { who: 'barry', what: 'Es in??til... no puedo hacerte entender...', forward: false },
                { who: 'nor', what: '??Lo ??nico que hay que entender es que vas a caer!', forward: true },
                { who: 'barry', what: 'No tiene caso pelear... est??s programado para tener ventaja sobre m??.', forward: false },
                { who: 'nor', what: '??Qu?? dices?', forward: true },
                { who: 'barry', what: 'Incluso si te derrotara, lo volver??as a intentar e intentar hasta finalmente conseguirlo.', forward: false },
                { who: 'barry', what: '...', forward: false },
                { who: 'barry', what: 'Terminaste siendo m??s molesto de lo que eras antes.', forward: false },
                { who: 'nor', what: '??Antes?', forward: true },
                { who: 'barry', what: 'Te dir?? la verdad.', forward: false },
                { who: 'barry', what: 'Este juego estaba pensado en ser un "plataformero", pero los desarrolladores decidieron hacerlo un "top-down".', forward: false },
                { who: 'barry', what: 'En la versi??n anterior t?? solo eras un simple vendedor en una tienda.', forward: false },
                { who: 'nor', what: '??Qu?? rayos...?', forward: true },
                { who: 'barry', what: 'Maya era la protagonista... hasta que me "inyect??" en el c??digo del juego y lo corromp??.', forward: false },
                { who: 'barry', what: 'Los desarrolladores tuvieron que rehacer el juego para su materia de-', forward: false },
                { who: 'nor', what: 'No estoy entendiendo casi nada...', forward: true },
                { who: 'nor', what: 'Pero de lo poco que entend??, es que efectivamente ??T?? FUISTE EL CULPABLE DE TODO!', forward: true },
                { who: 'barry', what: 'Como sea, no tiene caso combatir...', forward: false },
                { who: 'barry', what: 'Ya notaste que esto terminar?? de una sola forma, as?? que mejor te dejo lo que necesitas para acabar el juego...', forward: false },
                { who: 'nor', what: '??ESPERA!', forward: true },
            ];
        } else {
            this.dialogs = [
                { who: 'nor', what: '??As?? que t??-!', forward: true },
                { who: 'barry', what: '"-eres Barry"... s??, as?? es.', forward: false },
                { who: 'nor', what: '??Vengo a derrotarte!', forward: true },
                { who: 'nor', what: '??NO DEJAR??-', forward: true },
                { who: 'barry', what: '"que destruyas Floresta", ya lo hab??a escuchado antes.', forward: false },
                { who: 'nor', what: '????C??mo?!', forward: true },
                { who: 'nor', what: '??No mientas! S?? perfectamente que-', forward: true },
                { who: 'barry', what: 'Ya detente.', forward: false },
                { who: 'nor', what: '??Deja de interrumpirme!', forward: true },
                { who: 'barry', what: '??En serio no recuerdas?', forward: false },
                { who: 'nor', what: '??Recordar qu??? ????De qu?? hablas?!', forward: true },
                { who: 'barry', what: '...', forward: false },
                { who: 'barry', what: 'No quiero volver a tener esta conversaci??n...', forward: false },
                { who: 'barry', what: 'Adios, Nor.', forward: false },
                { who: 'nor', what: '??ESPERA!', forward: true },
                { who: 'nor', what: '????C??mo sabes mi nombre?!', forward: true },
            ];
        }
        this.talk();
    }
}

export default Barry;
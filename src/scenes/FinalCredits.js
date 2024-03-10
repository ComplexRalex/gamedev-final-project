import { timeObjectFromSeconds } from "../helpers/timeObjectFromSeconds.js";

class FinalCredits extends Phaser.Scene {

    constructor() {
        super({
            key: 'FinalCredits'
        });
    }

    init({ onFinish }) {
        console.log('please clap, we worked hard on this xdddddddddd');
        this.onFinish = onFinish;
    }

    oc(diapositiva) {
        this.add.tween({
            duration: 3000,
            targets: [diapositiva],
            alpha: 0

        });
    }

    mostrar(diapositiva, duracion) {
        this.add.tween({
            duration: duracion,
            targets: [diapositiva],
            alpha: 1,
            onComplete: () => {
                setTimeout(() => {
                    this.oc(diapositiva);
                }, 3000);

            }

        });
    }

    mostrarTiempo(delay) {
        this.tweens.add({
            targets: [this.playedGameTimeText],
            delay: delay,
            duration: 1000,
            hold: 4000,
            yoyo: true,
            props: {
                alpha: {
                    from: 0,
                    to: 1,
                }
            }
        });
    }

    ocultar(diapositiva, duracion) {
        this.add.tween({
            duration: duracion,
            targets: [diapositiva],
            alpha: 0,
        });
    }

    create() {
        const lastGameTime = this.registry.get('lastGameTime');
        const timeObject = timeObjectFromSeconds(lastGameTime);
        const time = `${timeObject.stringified.minutes}:${timeObject.stringified.seconds}`;
        const timeUnit = timeObject.minutes > 0 ? 'minutos' : 'segundos';

        this.playedGameTimeText = this.add.text(
            320,
            520,
            `Tiempo de partida final: ${time} ${timeUnit}.`,
            {
                fontFamily: 'monospace',
                fontSize: 18,
                align: 'center',
            }
        ).setOrigin(0.5).setDepth(1).setAlpha(0);

        this.fondo = this.add.image(0, 0, 'fondo').setAlpha(0).setScale(2, 3);
        this.ed1 = this.add.image(320, 300, 'ed1').setAlpha(0);
        this.ed2 = this.add.image(320, 300, 'ed2').setAlpha(0);
        this.ed3 = this.add.image(320, 300, 'ed3').setAlpha(0);
        this.ed4 = this.add.image(320, 300, 'ed4').setAlpha(0);
        this.ed5 = this.add.image(320, 300, 'ed5').setAlpha(0);
        this.ed6 = this.add.image(320, 300, 'ed6').setAlpha(0);
        this.ed7 = this.add.image(320, 300, 'ed7').setAlpha(0);
        this.ed8 = this.add.image(320, 300, 'ed8').setAlpha(0);
        this.ed9 = this.add.image(320, 300, 'ed9').setAlpha(0);
        this.ed10 = this.add.image(320, 300, 'ed10').setAlpha(0);
        this.ed11 = this.add.image(320, 300, 'ed11').setAlpha(0);
        this.ed12 = this.add.image(320, 300, 'ed12').setAlpha(0);
        this.ed13 = this.add.image(320, 300, 'ed13').setAlpha(0);
        this.ed14 = this.add.image(320, 300, 'ed14').setAlpha(0);
        this.ed15 = this.add.image(320, 300, 'ed15').setAlpha(0);
        this.ed16 = this.add.image(320, 300, 'ed16').setAlpha(0);
        this.ed17 = this.add.image(320, 300, 'ed17').setAlpha(0);
        this.ed18 = this.add.image(320, 300, 'ed18').setAlpha(0);
        this.ed19 = this.add.image(320, 300, 'ed19').setAlpha(0);
        this.ed20 = this.add.image(320, 300, 'ed20').setAlpha(0);
        this.fin = this.add.image(320, 300, 'fin').setAlpha(0);
        this.flash = this.add.image(0, 0, 'flash').setAlpha(0).setScale(10);
        this.musica = this.sound.add('credits');
        this.musica.play();

        this.t_flsh = this.tweens.timeline({
            targets: [this.flash],
            paused: true,
            tweens: [
                {
                    alpha: 1,
                    duration: 5000,
                    onComplete: () => {
                        this.fondo.setAlpha(1);
                    }
                },
                {
                    alpha: 1,
                    duration: 3000,

                },
                {
                    alpha: 0,
                    duration: 3000
                }
            ]
        });
        this.t_flsh.play();
        setTimeout(() => {
            this.mostrar(this.ed1, 4000);
            this.mostrarTiempo(4000);
        }, 10000);
        setTimeout(() => {
            this.mostrar(this.ed2, 4000);
        }, 19000);
        setTimeout(() => {
            this.mostrar(this.ed3, 7000);
        }, 28000);
        setTimeout(() => {
            this.mostrar(this.ed4, 5000);
        }, 40000);
        setTimeout(() => {
            this.mostrar(this.ed5, 5000);
        }, 50000);
        setTimeout(() => {
            this.mostrar(this.ed6, 4000);
        }, 59000);
        setTimeout(() => {
            this.mostrar(this.ed7, 3000);
        }, 68000);
        setTimeout(() => {
            this.mostrar(this.ed8, 3000);
        }, 74000);
        setTimeout(() => {
            this.mostrar(this.ed9, 5000);
        }, 81000);
        setTimeout(() => {
            this.mostrar(this.ed10, 3000);
        }, 91000);
        setTimeout(() => {
            this.mostrar(this.ed11, 3000);
        }, 99000);
        setTimeout(() => {
            this.mostrar(this.ed12, 3000);
        }, 106000);
        setTimeout(() => {
            this.mostrar(this.ed13, 4000);
        }, 114000);
        setTimeout(() => {
            this.mostrar(this.ed14, 6000);
        }, 123000);
        setTimeout(() => {
            this.mostrar(this.ed15, 3000);
        }, 134000);
        setTimeout(() => {
            this.mostrar(this.ed16, 3000);
        }, 140000);
        setTimeout(() => {
            this.mostrar(this.ed17, 3000);
        }, 148000);
        setTimeout(() => {
            this.mostrar(this.ed18, 3000);
        }, 157000);
        setTimeout(() => {
            this.mostrar(this.ed19, 3000);
        }, 166000);
        setTimeout(() => {
            this.mostrar(this.ed20, 3000);
        }, 175000);
        setTimeout(() => {
            this.mostrar(this.fin, 3000);
        }, 181000);
        setTimeout(() => {
            this.ocultar(this.fin, 5000);
            this.add.tween({
                targets: [this.fondo],
                duration: 3000,
                alpha: 1,
                onUpdate: () => {
                    if (this.musica.volume > 0)
                        this.musica.setVolume(this.musica.volume - 0.005);
                },
                onComplete: () => {
                    this.musica.stop();
                }
            });
        }, 188000);
        setTimeout(() => {
            this.scene.stop();
            this.onFinish(this);
        }, 193000);
    }
}

export default FinalCredits;
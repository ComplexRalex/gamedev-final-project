import { timeObjectFromSeconds } from "../helpers/timeObjectFromSeconds.js";

class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    init({ initialTime } = {}) {
        console.log("Escena 'Menu' iniciada");

        // * Nota: La escena iniciará no pausada por obvias razones

        this.startingTime = initialTime ?? 0;

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        this.guiFontTitleType = {
            fontFamily: 'monospace',
            fontSize: 32,
            fontStyle: 'bold',
            align: 'center',
        };

        this.guiFontType = {
            fontFamily: 'monospace',
            fontSize: 20,
            align: 'center',
        };

        this.guiFontExitType = {
            fontFamily: 'monospace',
            fontSize: 14,
            align: 'center',
        };
        
        this.removeListeners();
    }

    buildAnythingElse() {
        
        // ! Sonido
        this.keySound = this.sound.add('clicking');

        // ! Datos generales
        this.currentTimePlayed = this.startingTime;

        // Mensajes chistosones
        this.cancelExitIndex = 0;
        this.cancelExitMessages = [
            'cancelando...',
            '\'ta bueno pues...',
            'nope',
            'adiooooos',
            'me esconderé wiii',
            'no me puedes ver >:D',
            'zzz...',
            '¡poof!',
            'c u l8r m8',
            '¡DESMATERIALIZANDOME!',
            'wut',
            'abismo, ahí te voy',
            '*se va*',
            'awantalas Nor',
            'boo',
            ':)'
        ]
        
    }

    buildGUI() {

        // Auxiliar para posición xD
        let altura = 48;

        // Container principal
        this.menuContainer = this.add.container(0, 0)
            .setAlpha(0);

        // Background
        this.blackBackground = this.add.rectangle(0, 0, this.scale.width, this.scale.height, '0x000000')
            .setOrigin(0)
            .setAlpha(0.75)
            .setDepth(0);
        this.menuContainer.add(this.blackBackground);

        // Texto de pausa
        this.title = this.add.text(this.centerX, altura, "Pausa", this.guiFontTitleType)
            .setOrigin(0.5, 0)
            .setDepth(1);
        this.menuContainer.add(this.title);
        altura += 64;
        
        // Opción de continuar
        this.continueOptionContainer = this.createButtonLabel(
            this.centerX,
            altura,
            'buttons/p',
            'Continuar'
        ).setDepth(5);
        this.menuContainer.add(this.continueOptionContainer);
        altura += 160;

        // Hint de salida

        // Contenedor de hint
        this.exitTimeContainer = this.add.container(
            this.centerX,
            altura + 96
        ).setAlpha(0).setDepth(1);
        this.menuContainer.add(this.exitTimeContainer);

        // Caja del hint
        this.exitTimeBox = this.add.image(0, 0, 'gui-little-sign')
            .setOrigin(0.5)
            .setScale(3)
            .setDepth(1);
        this.exitTimeContainer.add(this.exitTimeBox);

        // Texto de la caja del hint
        this.exitTimeText = this.add.text(0, 0, 'placeholder :D', this.guiFontExitType)
            .setOrigin(0.5)
            .setDepth(2);
        this.exitTimeContainer.add(this.exitTimeText);
            
        // Opción de salir
        this.exitOptionContainer = this.createButtonLabel(
            this.centerX,
            altura,
            'buttons/esc',
            'Salir'
        ).setDepth(5);
        this.menuContainer.add(this.exitOptionContainer);

        // Caja de abajo
        this.dataBox = this.add.image(0, 480, 'gui-bg')
            .setOrigin(0)
            .setScale(4)
            .setDepth(1);
        this.menuContainer.add(this.dataBox);

        // Texto de tiempo
        this.currentTimePlayedText = this.add.text(
            this.centerX,
            480 + this.dataBox.displayHeight / 2,
            'placeholder de tiempo :D',
            this.guiFontType,
        ).setOrigin(0.5, 0.5);
        this.menuContainer.add(this.currentTimePlayedText);

        // ! Animaciones

        this.tweens.add({
            targets: [this.title, this.currentTimePlayedText],
            repeat: -1,
            duration: 600,
            yoyo: true,
            props: {
                alpha: {
                    from: 1,
                    to: 0.5,
                }
            }
        })

    }
    
    createButtonLabel(x, y, sprite, content) {
        const cont = this.add.container(x, y);
        const option = this.add.image(0, 0, 'menu-option')
            .setOrigin(0.5, 0)
            .setScale(4)
            .setDepth(5);
        const text = this.add.text(0, option.displayHeight * 0.725, content, this.guiFontType)
            .setOrigin(0.5)
            .setDepth(6);
        const button = this.add.image(option.displayWidth * 0.5, option.displayHeight, sprite)
            .setOrigin(0.5)
            .setScale(3)
            .setDepth(7);
        cont.add(option);
        cont.add(text);
        cont.add(button);
        return cont;
    }

    setListeners() {

        // Constantes
        this.keyCodes = Phaser.Input.Keyboard.KeyCodes;
        this.keyEvents = Phaser.Input.Keyboard.Events;

        // Teclas del menú
        this.keys = {};
        this.keys.p = this.input.keyboard.addKey('p');
        this.keys.esc = this.input.keyboard.addKey('esc');

        // Variables de control
        this.isQuitting = false;
        this.registry.set('isPaused', false);
        this.registry.set('isPausable', true);
        this.registry.set('isPreQuitting', false);
        this.registry.set('isTimerStopped', false);
        this.registry.set('lastGameTime', 0);

        // ! Listeners para teclas

        this.keys.p.on('down', () => {
            if (this.registry.get('isPausable') && !this.registry.get('isPaused')) {
                this.handlePause();
                return;
            }

            if (this.registry.get('isPaused') && !this.isQuitting)
                this.handleContinue();
        });
        this.keys.esc
            .on('down', () => {
                if (!this.registry.get('isPaused') || this.isQuitting) return;

                this.events.emit('startPreQuitting');
            })
            .on('up', () => {
                if (!this.registry.get('isPaused') || this.isQuitting) return;

                this.events.emit('stopPreQuitting');
            });

        // Evento para detener conteo del timer (global)
        this.registry.events.on('stopGameTimer', () => {
            if (this.registry.get('isTimerStopped')) return;
            
            this.registry.set('isTimerStopped', true);
            this.registry.set('lastGameTime', this.currentTimePlayed);
            console.log("Tiempo de partida (milisegundos): " + this.currentTimePlayed);
        });

        // Animacion de tiempo para salir
        this.events.on('startPreQuitting', () => {
            this.registry.set('isPreQuitting', true);
            this.keySound.play();
            this.tweens.add({
                targets: [this.exitTimeContainer],
                duration: 500,
                ease: Phaser.Math.Easing.Expo.Out,
                props: {
                    x: this.centerX + 192,
                    alpha: 1,
                }
            });
        });
        this.events.on('stopPreQuitting', () => {
            this.registry.set('isPreQuitting', false);
            this.timeEscKeyPressed = 0;
            this.cancelExitIndex = Math.floor(
                Math.random() * this.cancelExitMessages.length
            );
            this.renderQuit(false);
            this.tweens.add({
                targets: [this.exitTimeContainer],
                duration: 500,
                ease: Phaser.Math.Easing.Expo.Out,
                props: {
                    x: this.centerX,
                    alpha: 0,
                },
            });
        })

        // millis
        this.timeEscKeyPressed = 0;
        this.timeEscKeyLimit = 3000;
    }

    removeListeners() {
        this.input.keyboard.removeAllListeners();
        this.input.keyboard.removeAllKeys();
        this.registry.events.off('stopGameTimer');
        this.events.off('startPreQuitting');
        this.events.off('stopPreQuitting');
    }

    handlePause() {
        this.registry.set('isPaused', true);
        this.rerenderTimePlayed();
        this.keySound.play();
        if (this.scene.isActive('Dialog')) {
            this.scene.pause('Dialog');
        } else if (this.scene.isActive('Cinematic0')) {
            this.scene.pause('Cinematic0');
        } else if (this.scene.isActive('Game')) {
            this.scene.pause('Game');
            this.scene.pause('GUI');
        }

        this.tweens.add({
            targets: [this.menuContainer],
            duration: 250,
            props: {
                alpha: {
                    from: 0,
                    to: 1,
                }
            }
        });
    }

    handleContinue() {
        if (this.isQuitting) return;
        
        if (this.registry.get('isPreQuitting'))
            this.events.emit('stopPreQuitting');

        this.registry.set('isPaused', false);
        this.keySound.play();
        if (this.scene.isPaused('Dialog')) {
            this.scene.resume('Dialog');
        } else if (this.scene.isPaused('Cinematic0')) {
            this.scene.resume('Cinematic0');
        } else if (this.scene.isPaused('Game')) {
            this.scene.resume('Game');
            this.scene.resume('GUI');
        }

        this.tweens.add({
            targets: [this.menuContainer],
            duration: 250,
            props: {
                alpha: {
                    from: 1,
                    to: 0,
                }
            }
        });
    }

    handleQuit() {
        if (!this.isQuitting) {
            this.isQuitting = true;
            this.removeListeners();
            this.scene.launch('SimpleFadeEffect', { fadeIn: true, yoyo: true });
            this.add.tween({
                targets: [this.menuContainer],
                duration: 1000,
                props: {
                    alpha: 1,
                },
                onUpdate: () => {
                    if (this.sound.volume > 0)
                        this.sound.setVolume(this.sound.volume - 0.02);
                },
                onComplete: () => {
                    this.sound.stopAll();
                    this.sound.setVolume(1);
                    this.scene.stop();
                    this.scene.stop("Cinematic0");
                    this.scene.stop("Game");
                    this.scene.stop("GUI");
                    this.scene.stop("Dialog");
                    this.scene.start('Start');
                }
            });
        }
    }

    updateQuit(delta) {
        if (
            !this.registry.get('isPaused') ||
            !this.registry.get('isPreQuitting') ||
            this.isQuitting
        )
            return;

        this.timeEscKeyPressed = this.timeEscKeyPressed + delta;
            this.timeEscKeyPressed = this.timeEscKeyPressed > this.timeEscKeyLimit
                ? this.timeEscKeyLimit
                : this.timeEscKeyPressed < 0
                    ? 0
                    : this.timeEscKeyPressed;

        const remainingTime = this.timeEscKeyLimit - this.timeEscKeyPressed;
        this.renderQuit(true, remainingTime);

        if (this.timeEscKeyPressed >= this.timeEscKeyLimit) {
            this.handleQuit();
        }
    }

    renderQuit(isPreQuitting, time) {
        let text;
        if (!isPreQuitting)
            text = this.cancelExitMessages[this.cancelExitIndex];
        else
            text = 'Saldrás al menú en ' + Math.ceil(time / 1000);
        
        this.exitTimeText.setText(text);
    }

    rerenderTimePlayed() {
        const timeObject = timeObjectFromSeconds(this.currentTimePlayed);
        const time = `${timeObject.stringified.minutes}:${timeObject.stringified.seconds}`;
        const timeUnit = timeObject.minutes > 0 ? 'minutos' : 'segundos';
        this.currentTimePlayedText.setText(`Tiempo de partida actual: ${time} ${timeUnit}.`);
    }

    updateTimePlayed(delta) {
        if (!this.registry.get('isPaused') && !this.registry.get('isTimerStopped')) {
            this.currentTimePlayed += delta;
        }
    }

    create() {
        this.buildAnythingElse();
        this.buildGUI();
        this.setListeners();
    }

    update(_, delta) {
        this.updateQuit(delta);
        this.updateTimePlayed(delta);
    }

}

export default Menu;
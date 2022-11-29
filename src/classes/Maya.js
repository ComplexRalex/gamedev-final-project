import NPC from "./NPC.js";

class Maya extends NPC {
    constructor({ scene, x, y }) {
        super({ scene, x, y, name: 'maya' });

        // !
        // ! Props
        this.anims.play('maya_sleep');
        this.setAngle(-90);

        // !
        // ! Physics
        this.body.setSize(this.body.height, this.body.width);

        // !
        // ! Control variables
        this.hasAlreadyTalked = false;
        this.noEnemies = undefined;
    }

    handleChat({ noEnemies }) {
        this.hasAlreadyTalked = this.noEnemies === noEnemies;
        this.noEnemies = noEnemies;
        if (!noEnemies) {
            if (!this.hasAlreadyTalked) {
                this.dialogs = [
                    { who: 'nor', what: '¡MAYA! ¿Estás bien?', forward: true },
                    { who: 'maya', what: 'Estoy herida... pero no es nada grave.', forward: false },
                    { who: 'nor', what: '¡¿Qué te pasó?!', forward: true },
                    { who: 'maya', what: 'Mejor encárgate de los enemigos que hay cerca...', forward: false },
                ]
            } else {
                this.dialogs = [
                    { who: 'nor', what: '¡MAY-!', forward: true },
                    { who: 'maya', what: 'Nor, ¡primero deshazte de los enemigos!', forward: false },
                ]
            }
        } else {
            if (!this.hasAlreadyTalked) {
                this.dialogs = [
                    { who: 'nor', what: '¡¡¡MAYA!!! ¿Qué te pasó?', forward: true },
                    { who: 'maya', what: '...', forward: false },
                    { who: 'maya', what: 'Tuve un enfrentamiento contra un chivo llamado Barry.', forward: false },
                    { who: 'nor', what: '¿Barry? ¿Un chivo?', forward: true },
                    { who: 'maya', what: 'Estaba tranquila buscando algo en la casa de Ten cuando de repente escuché un ruido afuera, así que decidí salir.', forward: false },
                    { who: 'maya', what: 'Ahí es cuando vi a ese chivo, que se hace llamar Barry.', forward: false },
                    { who: 'nor', what: '¿Y qué sucedió?', forward: true },
                    { who: 'maya', what: 'Me estaba hablando con palabras que nunca antes había escuchado... es como si fuera un ser de otro planeta.', forward: false },
                    { who: 'maya', what: 'Tenía la esmeralda de la vida en sus manos, ¡así que decidí atacarlo!', forward: false },
                    { who: 'maya', what: '...', forward: false },
                    { who: 'maya', what: 'Pero de repente se creó una fuerte explosión y... es todo lo que recuerdo.', forward: false },
                    { who: 'nor', what: '...', forward: true },
                    { who: 'nor', what: 'Bueno, me alegra que al menos te encuentres bien.', forward: true },
                    { who: 'maya', what: 'Gracias.', forward: false },
                    { who: 'maya', what: 'Mmm... ¿cómo llegaste hasta aquí?... espera...', forward: false },
                    { who: 'maya', what: '¡¿A CASO PIENSAS ENFRENTARLO?!', forward: false },
                    { who: 'nor', what: '¡Claro que sí!', forward: true },
                    { who: 'maya', what: '¡¿ESTÁS LOCO?! ¡Es demasiado fuerte! ¡Ni si quiera pude atacarlo!', forward: false },
                    { who: 'nor', what: '...', forward: true },
                    { who: 'nor', what: 'Pero... ¿entonces qué harémos?', forward: true },
                    { who: 'nor', what: '¿Dejar que destruya Floresta? ¡Debo detenerlo!', forward: true },
                    { who: 'maya', what: 'No es tan simple como parece, Nor... tienes que derrotarlo.', forward: false },
                    { who: 'nor', what: 'Puedo intentarlo.', forward: true },
                    { who: 'maya', what: '¡NI LO PIENS-!', forward: false },
                    { who: 'nor', what: 'Todo este tiempo me has estado entrenando para enfrentar un momento así.', forward: true },
                    { who: 'maya', what: 'Sí, pero-', forward: false },
                    { who: 'nor', what: '¡Al menos tengo que intentar!', forward: true },
                    { who: 'maya', what: '...', forward: false },
                    { who: 'nor', what: 'Estoy seguro de que puedo solucionarlo.', forward: true },
                    { who: 'maya', what: '¿Por qué estás tan seguro?', forward: false },
                    { who: 'nor', what: 'Tengo una corazonada.', forward: true },
                    { who: 'maya', what: '...', forward: false },
                    { who: 'maya', what: 'Bueno... impedirte avanzar no ayudaría en nada...', forward: false },
                    { who: 'maya', what: 'Lo único que te pido es que des lo mejor de tí.', forward: false },
                    { who: 'nor', what: '¡Cuenta con ello!', forward: true },
                ]
            } else {
                this.dialogs = [
                    { who: 'maya', what: 'No te preocupes por mí. Estaré bien.', forward: false },
                ]
            }
        }
        this.talk();
    }
}

export default Maya;
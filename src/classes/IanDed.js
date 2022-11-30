import NPC from "./NPC.js";

class IanDed extends NPC {
    constructor({ scene, x, y }) {
        super({ scene, x, y, name: 'ian_ded' });

        // !
        // ! Control variables
        this.hasObtained = { sword: undefined, key: undefined };
        this.hasAlreadyTalked = false;

        this.anims.play('ian_ded_awake');
    }

    handleChat({ hasObtained, gateOpened }) {
        this.hasAlreadyTalked = this.hasObtained.sword === hasObtained.sword
            && this.hasObtained.key === hasObtained.key;
        this.hasObtained = hasObtained;

        if (!hasObtained.sword && !hasObtained.key && !gateOpened) {
            if (!this.hasAlreadyTalked) {
                this.dialogs = [
                    { who: 'nor', what: 'Ian, ¿Estás bien?', forward: true },
                    { who: 'ian_ded', what: 'Hola Nor, sí... estoy bien, solo un poco lastimado.', forward: false },
                    { who: 'nor', what: '¿Por qué? ¿Qué pasó?', forward: true },
                    { who: 'ian_ded', what: '...', forward: false },
                    { who: 'ian_ded', what: 'Floresta se encuentra en peligro...', forward: false },
                    { who: 'nor', what: '!!!', forward: true },
                    { who: 'ian_ded', what: 'Una entidad muy poderosa corrompió a la mayoría de habitantes... incluso muchos de ellos desaparecieron.', forward: false },
                    { who: 'ian_ded', what: 'Todo esto se debe a que la esmeralda de la vida fue destruida.', forward: false },
                    { who: 'nor', what: '¡¿Qué dices?!', forward: true },
                    { who: 'ian_ded', what: '...', forward: false },
                    { who: 'nor', what: '...', forward: true },
                    { who: 'nor', what: 'Debo enfrentarlo.', forward: true },
                    { who: 'ian_ded', what: '¿Qué?', forward: false },
                    { who: 'nor', what: 'Soy el único que se encuentra en pie, además ya he entrenado mucho. Maya me ha enseñado muy bien.', forward: true },
                    { who: 'ian_ded', what: 'Hablando de ella... no he podido encontrarla desde el desastre... estoy seguro de que lo enfrentó.', forward: false },
                    { who: 'nor', what: 'Eso es el colmo, ¡voy a por él!', forward: true },
                    { who: 'ian_ded', what: '¡ESPERA!', forward: false },
                    { who: 'nor', what: '...', forward: true },
                    { who: 'nor', what: '¿Qué sucede?', forward: true },
                    { who: 'ian_ded', what: 'Estás desarmado...', forward: false },
                    { who: 'nor', what: 'Mmh...', forward: true },
                    { who: 'ian_ded', what: 'Ve a las casas del fondo y agarra la espada en mi habitación. Creo que uno de nuestros compañeros también tenía una llave.', forward: false },
                    { who: 'nor', what: 'Está bien.', forward: true },
                ]
            } else {
                this.dialogs = [
                    { who: 'nor', what: '¿Cómo te encuentras?', forward: true },
                    { who: 'ian_ded', what: 'Estoy bien... ve a buscar lo que te dije, allá en las casas del fondo.', forward: false },
                    { who: 'nor', what: 'Okay.', forward: true },
                ]
            }
        } else if (hasObtained.sword && !hasObtained.key && !gateOpened) {
            if (!this.hasAlreadyTalked) {
                this.dialogs = [
                    { who: 'ian_ded', what: 'Hola Nor, veo que ya te estás preparando para el combate.', forward: false },
                    { who: 'ian_ded', what: 'De todas formas, necesitas una llave para poder salir. Búscala en las casas, seguro la encuentras.', forward: false },
                    { who: 'nor', what: 'Cierto.', forward: true },
                ]
            } else {
                this.dialogs = [
                    { who: 'ian_ded', what: 'Recuerda que necesitas una llave para salir... encuéntrala.', forward: false },
                ]
            }
        } else if (!hasObtained.sword && hasObtained.key && !gateOpened) {
            if (!this.hasAlreadyTalked) {
                this.dialogs = [
                    { who: 'ian_ded', what: 'Hola Nor, sé que ya tienes la llave del candado para salir a explorar la selva...', forward: false },
                    { who: 'ian_ded', what: '...que es muy peligrosa...', forward: false },
                    { who: 'ian_ded', what: 'Antes de que salgas, agarra la espada que está en mi habitación, seguro te servirá.', forward: false },
                    { who: 'nor', what: 'Está bien.', forward: true },
                ]
            } else {
                this.dialogs = [
                    { who: 'ian_ded', what: '¡Que no se te olvide llevarte la espada!', forward: false },
                ]
            }
        } else {
            if (!this.hasAlreadyTalked && !gateOpened) {
                this.dialogs = [
                    { who: 'nor', what: 'Listo. Ya conseguí todo lo que necesito para irme.', forward: true },
                    { who: 'ian_ded', what: '¡Bien! Ahora tu misión es encontrar los fragmentos de la esmeralda de la vida y reconstruirla para poder salvar a Floresta.', forward: false },
                    { who: 'nor', what: '¡Entendido!', forward: true },
                    { who: 'ian_ded', what: 'Esta esmeralda la tienes que colocar en el santuario, allá en la cueva del cerro Efrón.', forward: false },
                    { who: 'nor', what: 'Okay, lo tendré en mente.', forward: true },
                    { who: 'ian_ded', what: 'Por favor ten mucho cuidado.', forward: false },
                    { who: 'nor', what: 'Lo tendré.', forward: true },
                ]
            } else {
                this.dialogs = [
                    { who: 'ian_ded', what: 'Recuerda recolectar todos los fragmentos de la esmeralda y reconstruirla para salvar a Floresta.', forward: false },
                    { who: 'ian_ded', what: '¡Te deseo éxito!', forward: false },
                ]
            }
        }
        this.talk();
    }
}

export default IanDed;
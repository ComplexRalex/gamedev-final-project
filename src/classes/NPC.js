class NPC extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, name }) {
        super(scene, x, y, name);

        // !
        // ! Physics things
        // this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.immovable = true;

        // !
        // ! Props

        // * Este arreglo contendrá objetos que servirán para poder
        // * establecer una "conversación"
        // ? El tipo es:
        // ? {
        // ?    who: Es el nombre del personaje
        // ?    what: Es el contenido del mensaje
        // ?    forward: Es si está viendo hacia adelante o hacia atrás
        // ? }
        this.dialogs = [];

        // ! No estoy seguro si aún tendrá uso
        this.isShowing = false;
    }

    talk() {
        this.isShowing = true;
        this.scene.scene.pause();
        this.scene.scene.launch('Dialog', {
            type: 'chat',
            chat: this.dialogs,
            onFinish: () => {
                this.isShowing = false;
                this.scene.scene.resume();
            }
        });
    }
}

export default NPC;
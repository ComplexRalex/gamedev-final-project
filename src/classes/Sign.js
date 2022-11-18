class Sign extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, content }) {
        super(scene, x, y, 'sign');

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body.immovable = true;

        this.content = content;

        // ! No estoy seguro si aún tendrá uso
        this.isShowing = false;
    }

    show() {
        console.log("Entrando");
        console.log(`"${this.content}"`);
        console.warn("Aquí debería hacer un launch de otra escena para mostrar el contenido...");
        this.isShowing = true;
        this.scene.scene.pause();
        setTimeout(() => {
            this.scene.scene.resume();
            this.isShowing = false;
            console.log("Saliendo");
        }, 500);
    }
}

export default Sign;
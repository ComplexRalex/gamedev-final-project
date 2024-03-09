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
        this.isShowing = true;
        this.scene?.scene?.pause();
        this.scene?.scene?.launch('Dialog', {
            content: this.content,
            onFinish: () => {
                this.isShowing = false;
                this.scene?.scene?.resume();
            }
        });
    }
}

export default Sign;
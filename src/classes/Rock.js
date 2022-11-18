class Rock extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y  }) {
        super(scene, x, y, 'rock');

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body.immovable = true;

        this.setOrigin(0, 1);
    }
}

export default Rock;
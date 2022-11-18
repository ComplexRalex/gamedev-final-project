class Teleporter extends Phaser.GameObjects.Rectangle {
    constructor({ scene, x, y, width, height, destiny }) {
        super(scene, x, y, width, height);

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body.immovable = true;

        // * Este parámetro debe ser un objeto que contenga
        // * las coordenadas 'x' y 'y'.
        this.destiny = destiny;

        this.setOrigin(0, 0);
    }
}

export default Teleporter;
class Trigger extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, type, targets = [], angle = 0 }) {
        super(scene, x, y, type);

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // * Este permite diferenciar entre un candado y un botón.
        this.type = type;

        // * Este es el que almacena el tipo de elementos que
        // * serán eliminados cuando se active el trigger.
        this.targets = targets;

        this.setAngle(angle);
    }
}

export default Trigger;

class TriggerTarget extends Phaser.GameObjects.Sprite {
    constructor({ id, scene, x, y, type, name, angle = 0 }) {
        super(scene, x, y, type);

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // * Este ID sirve para poder ser identificado y asignado
        // * a un trigger.
        this.id = id;

        // * Este campo sirve para poder identificar más cómodamente
        // * el target.
        this.name = name;

        // ! Es un bloque, por lo tanto no podrá moverse.
        this.body.immovable = true;

        this.setAngle(angle);

        // * Según el ángulo en el que se encuentre, el cuerpo de
        // * colisión tendrá que cambiar.
        if (angle === 90 || angle === 270) {
            this.body.setSize(this.height, this.width);
        }
    }
}

export default TriggerTarget;
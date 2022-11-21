class Enemy extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y }) {
        // ! LO DEL ENEMY ES TEMPORAL
        super(scene, x, y, 'generics_atlas', 'enemy');

        // ? Ideas
        // ? 
        // ? Tipo de enemigo
        // ? Propiedades varias
        // ? objetos que sueltan
        // ? vida que tienen
        // ? movimientos
        // ? variaciones

        // !
        // ! World settings
        // this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body.setDrag(500);

        this.body.setCircle(this.body.halfWidth);
    }

    // ! Está pensado que los enemigos también tengan una forma
    // ! de recibir daño y, por lo tanto, una cantidad de vida.
    getHurt() {
        // ? ...
    }
}

export default Enemy
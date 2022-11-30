class Pedestal extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y }) {
        super(scene, x, y, 'pedestal');

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body.immovable = true;

        this.isPlacingEmerald = false;
    }

    placeEmerald() {
        if (!this.isPlacingEmerald) {
            this.isPlacingEmerald = true;

            const emerald = this.scene.add.sprite(
                this.x,
                this.y - 35,
                'emerald',
            ).setAlpha(0);

            this.scene?.add.tween({
                targets: [emerald],
                duration: 500,
                props: {
                    alpha: {
                        from: 0,
                        to: 1,
                    }
                }
            });

            this.scene?.add.tween({
                targets: [emerald],
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                props: {
                    y: {
                        from: this.y - 35,
                        to: this.y - 40,
                    }
                },
            });
        }
    }
}

export default Pedestal;

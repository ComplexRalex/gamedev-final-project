class Item extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, type, sprite, amount = 1, props = {}, animation }) {
        super(scene, x, y, sprite);

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.type = type;
        this.props = {
            amount,
            ...props
        };

        if (animation) {
            this.anims.play(animation);
        }
    }
}

// class Weapon extends Item {
//     constructor({ scene, x, y, weapon }) {
//         super({
//             scene, x, y,
//             type: weapon,
//             sprite: weapon,
//         });
//     }
// }

// class Heart extends Item {
//     constructor({ scene, x, y }) {
//         super({
//             scene, x, y,
//             type: 'heart',
//             sprite: 'heart',
//         });
//     }
// }

// class Banana extends Item {
//     constructor({ scene, x, y }) {
//         super({
//             scene, x, y,
//             type: 'banana',
//             sprite: 'banana',
//         });
//     }
// }

// class Key extends Item {
//     constructor({ scene, x, y }) {
//         super({
//             scene, x, y,
//             type: 'key',
//             sprite: 'key',
//         });

//         this.setAngle(-45);
//     }
// }

// class Arrows extends Item {
//     constructor({ scene, x, y }) {
//         super({
//             scene, x, y,
//             type: 'arrows',
//             sprite: 'arrows',
//             amount: 5,
//         });

//         this.setAngle(-45);
//     }
// }

// class Bombs extends Item {
//     constructor({ scene, x, y }) {
//         super({
//             scene, x, y,
//             type: 'bombs',
//             sprite: 'bombs',
//             amount: 3,
//         });
//     }
// }

// class EmeraldFragment extends Item {
//     constructor({ scene, x, y }) {
//         super({
//             scene, x, y,
//             type: 'fragment',
//             sprite: 'emerald_fragment',
//         });
//     }
// }

// export {
//     Item,
//     Weapon,
//     Heart,
//     Banana,
//     Key,
//     Arrows,
//     Bombs,
//     EmeraldFragment,
// };

export default Item;
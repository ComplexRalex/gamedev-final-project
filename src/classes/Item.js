class Item extends Phaser.GameObjects.Sprite {
    static possibleDrops = [
        'sword', 'bow', 'banana', 'heart', 'bombs', 'arrows', 'key', 'fragmented_emerald',
    ];

    constructor({ scene, x, y, type, sprite, amount = 1, scale = 1, animation }) {
        super(scene, x, y, sprite);

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.type = type;
        this.amount = amount;

        this.setScale(scale);

        if (animation) {
            this.anims.play(animation);
        }
    }

    static ofType({ scene, x, y, type }) {
        let amount, animation, scale;
        switch (type) {
            case "banana":
                animation = "banana_glow"
                break;
            case "heart":
                animation = "heart_blink"
                scale = 1.5;
                break;
            case "bombs":
                amount = 3;
                break;
            case "arrows":
                amount = 5;
                break;
            case "fragmented_emerald":
                animation = "fragmented_emerald_shine"
                break;
        }
        return new Item({
            scene: scene,
            x: x,
            y: y,
            type: type,
            sprite: type,
            amount: amount,
            scale: scale,
            animation: animation,
        });
    }
}

export default Item;
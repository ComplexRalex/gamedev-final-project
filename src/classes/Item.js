class Item extends Phaser.GameObjects.Sprite {
    static possibleDrops = [
        'sword', 'bow', 'banana', 'heart', 'bombs', 'arrows', 'key', 'fragmented_emerald',
    ];
    static timeToRespawn = 20_000;

    constructor({
        scene,
        x,
        y,
        parent,
        type,
        sprite,
        amount = 1,
        scale = 1,
        animation,
    }) {
        super(scene, x, y, sprite);

        // !
        // ! Props
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // !
        // ! Item general props
        // ? Sostiene una referencia a su objeto "inicializador"
        this.parent = parent;
        // ? Tipo de item
        this.type = type;
        // ? Cantidad que representa
        this.amount = amount;

        this.setScale(scale);

        if (animation) {
            this.anims.play(animation);
        }
    }

    static ofType({ scene, x, y, parent, type }) {
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
            parent: parent,
            type: type,
            sprite: type,
            amount: amount,
            scale: scale,
            animation: animation,
        });
    }

    static onlyData({
        type,
        x,
        y,
        consumed,
        consumedOn,
        respawnable,
        requiresDefeatBoss,
        ...rest
    }) {
        return {
            ...rest,
            type,
            x,
            y,
            consumed,
            consumedOn,
            respawnable,
            requiresDefeatBoss,
        };
    }
}

export default Item;
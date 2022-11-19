class GameScene {
    constructor({
        tileWidth,
        tileHeight,
        sceneWidth,
        sceneHeight,
        mapWidth,
        mapHeight,
    }) {
        // ? Estas medidas son en pixeles
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        // ? Estas medidas son en tiles
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        // ? Estas medidas son el total de pixeles de la escena
        this.width = this.sceneWidth * this.tileWidth;
        this.height = this.sceneHeight * this.tileHeight;

        // ! ¿Cuántas filas y columnas de escenas hay en el mapa?
        this.cols = Math.floor(this.mapWidth / this.sceneWidth);
        this.rows = Math.floor(this.mapHeight / this.sceneHeight);

        // ! Cada una de las escenas del mapa contará con un conjunto
        // ! de elementos que serán spawneados (o no) cuando el jugador
        // ! se encuentre en dicha escena.
        this.cells = [];
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.cols; j++) {
                // row.push({
                //     entities: [],
                // });
                row.push([]);
            }
            this.cells.push(row);
        }
    }

    insert(entity, pos) {
        if (pos) {
            this.cells[pos.y][pos.x].push(entity);
            return;
        }

        const { xScene, yScene } = this.getSceneCoords({
            x: entity.x,
            y: entity.y,
        });

        this.cells[yScene][xScene].push(entity);
    }

    get(pos, coords) {
        if (pos) {
            return this.cells[pos.y][pos.x];
        }

        const { xScene, yScene } = this.getSceneCoords({
            x: coords.x,
            y: coords.y,
        });

        return this.cells[yScene][xScene];
    }

    getSceneCoords({ x, y }) {
        const [xScene, yScene] = [
            Math.floor(x / this.width),
            Math.floor(y / this.height),
        ];
        return { xScene, yScene };
    }
}

export default GameScene;
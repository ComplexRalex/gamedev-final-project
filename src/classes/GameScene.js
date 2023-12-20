import { emptyArrayMatrix } from "../helpers/emptyArrayMatrix.js";

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
        console.info(`Tamaño de tiles en pixeles: ${this.tileWidth}px ${this.tileHeight}px`);

        // ? Estas medidas son en tiles
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        console.info(`Tamaño del mapa en tiles: ${this.mapWidth}t ${this.mapHeight}t`);
        console.info(`Tamaño de la escena en tiles: ${this.sceneWidth}t ${this.sceneHeight}t`);

        // ? Estas medidas son el total de pixeles de la escena
        this.width = this.sceneWidth * this.tileWidth;
        this.height = this.sceneHeight * this.tileHeight;
        console.info(`Tamaño de la escena en pixeles: ${this.width}px ${this.height}px`);
        
        // ! ¿Cuántas filas y columnas de escenas hay en el mapa?
        this.cols = Math.floor(this.mapWidth / this.sceneWidth);
        this.rows = Math.floor(this.mapHeight / this.sceneHeight);
        console.info(`Tamaño del mapa en "escenas": ${this.cols}s ${this.rows}s`);

        // ! Cada una de las escenas del mapa contará con un conjunto
        // ! de elementos que serán visibles / obtenidos cuando el
        // ! jugador se encuentre en dicha escena.
        this.data = {};
    }

    addCategory(category) {
        this.data[category] ??= {
            name: category,
            cells: emptyArrayMatrix(this.rows, this.cols),
        }
    }

    getCategory(category) {
        return this.data[category];
    }

    deleteCategory(category) {
        delete this.data[category];
    }

    insert(category, coords, object) {
        const {
            xScene,
            yScene,
        } = this.getSceneCoords(coords);

        this.data[category].cells[yScene][xScene].push(object);
    }

    get(category, coords) {
        const {
            xScene,
            yScene,
        } = this.getSceneCoords(coords);

        return this.data[category].cells[yScene][xScene];
    }

    // ? Coordenadas reales (pixeles): x, y
    // ? Coordenadas de escena (fila y columna): xPos, yPos
    getSceneCoords({ x, y, xPos, yPos }) {
        let xFinal, yFinal;

        if (x != null && y != null) {
            const [xScene, yScene] = [
                Math.floor(x / this.width),
                Math.floor(y / this.height),
            ];
            xFinal = xScene;
            yFinal = yScene;
        }

        if (xPos != null && yPos != null) {
            xFinal = xPos;
            yFinal = yPos;
        }

        return {
            xScene: xFinal,
            yScene: yFinal,
        };
    }
}

export default GameScene;
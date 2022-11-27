import Teleporter from "./Teleporter.js";

class Void extends Teleporter {
    static xOverlap = 20;
    static topOverlap = 38;
    static bottomOverlap = 24;

    constructor({ scene, x, y, width, height, respawnPoint }) {
        super({
            scene,
            x,
            y,
            width,
            height,
            destiny: respawnPoint,
        });
        
        // !
        // ! Props

        // * Esta propiedad corresponde a la coordenada en el mapa
        // * a donde el jugador será teletransportado para revivir
        this.respawnPoint = respawnPoint;
    }
}

export default Void;
import Teleporter from "./Teleporter.js";

class Void extends Teleporter {
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
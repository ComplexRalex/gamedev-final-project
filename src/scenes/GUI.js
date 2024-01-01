class GUI extends Phaser.Scene {
    constructor() {
        super('GUI');
    }

    init() {
        console.log("Escena 'GUI' iniciada");

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        this.guiFontType = {
            fontFamily: 'monospace',
            fontSize: 20,
            align: 'left',
        };

        // ! Esto es importante, porque cada vez que se inicia la
        // ! escena, se está haciendo un "on" sobre los eventos.
        // ! Si no se hace esto, se estarán inicializando varias
        // ! veces los mismos handlers, acumulando varios iguales
        // ! y ejecutandolos al mismo tiempo.
        this.registry.events.removeAllListeners('changeHP');
        this.registry.events.removeAllListeners('changeStats');
        this.registry.events.removeAllListeners('changeWeapon');
        this.registry.events.removeAllListeners('changeHPStock');
        this.registry.events.removeAllListeners('obtainWeapon');
        this.input.keyboard.removeAllListeners();
        this.input.keyboard.removeAllKeys();
    }

    buildGUI() {
        // Interfaz de usuario
        this.guiContainer = this.add.container(0, 480)
            .setDepth(100);

        // Fondo del GUI
        this.guiContainer.add(
            this.add.image(0, 0, 'gui-bg')
                .setOrigin(0, 0)
                .setScale(4)
        );

        // Contenedor para corazones y demás
        this.guiTopStats = this.add.container(15, 45);
        this.guiContainer.add(this.guiTopStats);

        // Rostro de Nor
        this.guiNor = this.add.image(0, 0, 'nor-face')
            .setScale(4)
            .setOrigin(0, 0.5);
        this.guiTopStats.add(this.guiNor);

        // Gurpo de corazones
        this.guiHearts = this.add.group({
            key: 'heart',
            quantity: 2,
            setXY: {
                x: 120,
                y: 0,
                stepX: 40,
            },
            setScale: {
                x: 2.5,
            },
            setOrigin: {
                x: 0.5,
                y: 0.5,
            }
        });
        this.guiTopStats.add(this.guiHearts.getChildren());

        // Contenedor para contador de objetos
        this.guiBottomStats = this.add.container(35, 95);
        this.guiContainer.add(this.guiBottomStats);

        // Contenedor para fragmentos de esmeralda
        this.guiFragmentContainer = this.add.container(0, 0);
        this.guiBottomStats.add(this.guiFragmentContainer);

        this.guiFragment = this.add.image(0, 0, 'generics_atlas', 'fragmented_emerald')
            .setScale(2);
        this.guiFragmentContainer.add(this.guiFragment);

        this.guiFragmentNumber = this.add.text(30, 0, '0', this.guiFontType)
            .setOrigin(0, 0.5);
        this.guiFragmentContainer.add(this.guiFragmentNumber);

        // Contenedor para llaves
        this.guiKeyContainer = this.add.container(77, 0);
        this.guiBottomStats.add(this.guiKeyContainer);

        this.guiKey = this.add.image(0, 3, 'generics_atlas', 'key')
            .setScale(2);
        this.guiKeyContainer.add(this.guiKey);

        this.guiKeyNumber = this.add.text(30, 0, '0', this.guiFontType)
            .setOrigin(0, 0.5);
        this.guiKeyContainer.add(this.guiKeyNumber);

        // Contenedor para flechas
        this.guiArrowContainer = this.add.container(160, 0)
            .setVisible(false);
        this.guiBottomStats.add(this.guiArrowContainer);

        this.guiArrow = this.add.image(0, 0, 'generics_atlas', 'arrows')
            .setScale(2)
            .setAngle(45);
        this.guiArrowContainer.add(this.guiArrow);

        this.guiArrowNumber = this.add.text(35, 0, '0', this.guiFontType)
            .setOrigin(0, 0.5);
        this.guiArrowContainer.add(this.guiArrowNumber);

        // Contenedor para bombas
        this.guiBombContainer = this.add.container(245, 0)
            .setVisible(false);
        this.guiBottomStats.add(this.guiBombContainer);

        this.guiBomb = this.add.image(0, -3, 'generics_atlas', 'bombs')
            .setScale(2);
        this.guiBombContainer.add(this.guiBomb);

        this.guiBombNumber = this.add.text(20, 0, '0', this.guiFontType)
            .setOrigin(0, 0.5);
        this.guiBombContainer.add(this.guiBombNumber);

        // Contenedor para armas
        this.guiWeapons = this.add.container(460, 60);
        this.guiContainer.add(this.guiWeapons);

        // Contenedor de arma primaria
        this.guiPrimaryWeapon = this.add.container(-74, 0);
        this.guiWeapons.add(this.guiPrimaryWeapon);

        // Recuadro de arma primaria
        this.guiPrimaryWeapon.add(
            this.add.image(0, 0, 'weapon-bg').setScale(4)
        );

        // Espada
        this.actualPrimaryWeapon = this.add.image(0, 0, 'generics_atlas', 'sword')
            .setScale(4)
            .setVisible(false);
        this.guiPrimaryWeapon.add(this.actualPrimaryWeapon);

        // Botón primario
        this.guiZ = this.add.image(40, 36, 'buttons/z')
            .setScale(4)
            .setAlpha(0.5);
        this.guiPrimaryWeapon.add(this.guiZ);

        // Contenedor de arma secundaria
        this.guiSecondaryWeapon = this.add.container(74, 0);
        this.guiWeapons.add(this.guiSecondaryWeapon);

        // Recuadro de arma secundaria
        this.guiSecondaryWeapon.add(
            this.add.image(0, 0, 'weapon-bg').setScale(4)
        );

        // Arco
        this.actualSecondaryWeapon = this.add.image(5, -5, 'generics_atlas', 'bow')
            .setScale(4)
            .setVisible(false);
        this.guiSecondaryWeapon.add(this.actualSecondaryWeapon);

        // Botón secundario
        this.guiX = this.add.image(40, 36, 'buttons/x')
            .setScale(4)
            .setAlpha(0.5);
        this.guiSecondaryWeapon.add(this.guiX);

        // Botón izquierdo de cambio
        this.guiA = this.add.image(-70, -20, 'buttons/a')
            .setScale(4)
            .setAlpha(0.5);
        this.guiSecondaryWeapon.add(this.guiA);

        // Botón derecho de cambio
        this.guiS = this.add.image(70, -20, 'buttons/s')
            .setScale(4)
            .setAlpha(0.5);
        this.guiSecondaryWeapon.add(this.guiS);

        // Contenedor para botones interactivos
        this.guiInteractiveButtons = this.add.container(600, 80);
        this.guiContainer.add(this.guiInteractiveButtons);

        // Botón espacio
        this.guiSpace = this.add.image(0, 0, 'buttons/space')
            .setOrigin(0)
            .setScale(1)
            .setAlpha(0.5);
        this.guiInteractiveButtons.add(this.guiSpace);

        // Botón mayus
        this.guiShift = this.add.image(0, 14, 'buttons/shift')
            .setOrigin(0)
            .setScale(1)
            .setAlpha(0.5);
        this.guiInteractiveButtons.add(this.guiShift);
    }

    updateHearts(health, healthDelta) {
        this.guiHearts.children.iterate((heart, index) => {
            if (health >= 2 * (index + 1) * healthDelta)
                heart.setFrame('heart_full_0');
            else if (health >= 2 * (index + 1) * healthDelta - healthDelta)
                heart.setFrame('heart_half_0');
            else
                heart.setFrame('heart_empty_0');
        });
    }

    setListeners() {

        // ! Sonido
        this.changeWeaponSound = this.sound.add('clicking');

        // Constantes
        this.keyCodes = Phaser.Input.Keyboard.KeyCodes;
        this.keyEvents = Phaser.Input.Keyboard.Events;

        // ! Actualización de la vida inicial
        this.updateHearts();

        this.playerKeys = {};

        // Teclas especiales
        this.playerKeys.a = this.input.keyboard.addKey('a');
        this.playerKeys.s = this.input.keyboard.addKey('s');
        this.playerKeys.z = this.input.keyboard.addKey('z');
        this.playerKeys.x = this.input.keyboard.addKey('x');
        this.playerKeys.space = this.input.keyboard.addKey('Space');
        this.playerKeys.shiftKey = this.input.keyboard.addKey('Shift');

        this.input.keyboard.on('keydown', (event) => {
            switch (event.keyCode) {
                case this.keyCodes.A: this.guiA.setAlpha(1); break;
                case this.keyCodes.S: this.guiS.setAlpha(1); break;
                case this.keyCodes.Z: this.guiZ.setAlpha(1); break;
                case this.keyCodes.X: this.guiX.setAlpha(1); break;
                case this.keyCodes.SPACE: this.guiSpace.setAlpha(1); break;
                case this.keyCodes.SHIFT: this.guiShift.setAlpha(1); break;
            }
        });

        this.input.keyboard.on('keyup', (event) => {
            switch (event.keyCode) {
                case this.keyCodes.A: this.guiA.setAlpha(0.5); break;
                case this.keyCodes.S: this.guiS.setAlpha(0.5); break;
                case this.keyCodes.Z: this.guiZ.setAlpha(0.5); break;
                case this.keyCodes.X: this.guiX.setAlpha(0.5); break;
                case this.keyCodes.SPACE: this.guiSpace.setAlpha(0.5); break;
                case this.keyCodes.SHIFT: this.guiShift.setAlpha(0.5); break;
            }
        });

        // ! Inicialización de listeners para el juego y el GUI

        // * Cambia la vida del jugador en el GUI
        this.registry.events.on('changeHP', ({ health, healthDelta }) => {
            console.warn("Actualización de vida: " + health);
            this.updateHearts(health, healthDelta);
        });

        // * Cambia estadistica indicada en el GUI
        this.registry.events.on('changeStats', ({ fragmentNumber, keyNumber, arrowNumber, bombNumber }) => {
            if (!isNaN(fragmentNumber)) {
                console.warn("Actualización de estadística [fragments]: " + fragmentNumber);
                this.guiFragmentNumber.setText(fragmentNumber.toString());
            }
            if (!isNaN(keyNumber)) {
                console.warn("Actualización de estadística [keys]: " + keyNumber);
                this.guiKeyNumber.setText(keyNumber.toString());
            }
            if (!isNaN(arrowNumber)) {
                console.warn("Actualización de estadística [arrows]: " + arrowNumber);
                this.guiArrowNumber.setText(arrowNumber.toString());
            }
            if (!isNaN(bombNumber)) {
                console.warn("Actualización de estadística [bombs]: " + bombNumber);
                this.guiBombNumber.setText(bombNumber.toString());
            }
        });

        this.registry.events.on('changeWeapon', ({ weapon }) => {
            this.changeWeaponSound.play();
            this.actualSecondaryWeapon.setTexture('generics_atlas', weapon);
        });

        // * Cambia el número de contenedores a mostrar, según
        // * la cantidad de vida máxima de Nor, en el GUI
        this.registry.events.on('changeHPStock', ({ health, healthMax, healthDelta }) => {
            console.warn("Actualización de vida máxima: " + healthMax);
            this.guiTopStats.remove(this.guiHearts);
            this.guiHearts.destroy(true, true);
            const amount = Math.floor(healthMax / (healthDelta * 2));
            this.guiHearts = this.add.group({
                key: 'heart',
                quantity: amount,
                setXY: {
                    x: 120,
                    y: 0,
                    stepX: 40,
                },
                setScale: {
                    x: 2.5,
                },
                setOrigin: {
                    x: 0.5,
                    y: 0.5,
                }
            });
            this.guiTopStats.add(this.guiHearts.getChildren());
            this.updateHearts(health, healthDelta);
        });

        // * En caso de que ay haya obtenido algún arma en
        // * particular, muestra el objeto que muestra las
        // * estadísticas.
        this.registry.events.on('obtainWeapon', ({ type }) => {
            console.warn("Obtención de nueva arma: " + type);
            switch (type) {
                case "sword":
                    this.actualPrimaryWeapon.setVisible(true);
                    break;
                case "bow":
                    this.actualSecondaryWeapon.setVisible(true);
                    this.guiArrowContainer.setVisible(true);
                    break;
                case "bomb":
                    this.actualSecondaryWeapon.setVisible(true);
                    this.guiBombContainer.setVisible(true);
                    break;
            }
        });
    }

    create() {
        this.buildGUI();
        this.setListeners();
    }

}

export default GUI;
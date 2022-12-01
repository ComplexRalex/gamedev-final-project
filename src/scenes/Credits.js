class Credits extends Phaser.Scene{
    constructor(){
        super({
            key: 'Credits'
        });
    }
    init() {
        console.log('buenastardes, soy los creditos');
    }
    create() {
        this.fondo=this.add.rectangle(0, 0, 640, 600, 0x000000, 1).setOrigin(0);
        this.txt_1=this.add.text(320,30, 'Creado por', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.logo=this.add.image(320,160,'logokrt').setScale(0.4)
        this.txt_2=this.add.text(320,320, 'Integrantes\nJosé Víctor Cuaya Contreras "EkSha"\nAlejandro Batres Pedroza "ComplexRalex"\nJose Eduardo Guevara Molina "Loleiste172"\nMaria Azucena Flores Sanchez "z²"', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.txt_3=this.add.text(320,430, 'Based department\nJosé Víctor Cuaya Contreras "EkSha"\nAlejandro Batres Pedroza "ComplexRalex"\nJose Eduardo Guevara Molina "Loleiste172"\nMaria Azucena Flores Sanchez "Zuzu_el_regreso"', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.txt_4=this.add.text(320,530, 'Materia\nDesarrollo de videojuegos', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.txt_5=this.add.text(320,730, 'ALT+F4 para el final secreto (XD)', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.txt_6=this.add.text(320,595, 'Musica\nShinkoNet & Hypixel. inc', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.txt_6_5=this.add.text(320,655, 'Sonidos\nMother (Earthbound Beginnings) y varios', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.txt_7=this.add.text(320,830, '[Esc] para salir de esta pantalla', { fontFamily: 'monospace' }).setOrigin(0.5)
        this.container = this.add.container(0,50)
        this.container.add([
            this.txt_1,
            this.logo,
            this.txt_2,
            this.txt_3,
            this.txt_4,
            this.txt_5,
            this.txt_6,
            this.txt_6_5,
            this.txt_7
        ])
        
        this.container.y=590;

        this.add.tween({
            targets: [this.fondo],
            duration: 1000,
            props: {
                alpha: {
                    from: 0,
                    to: 0.6,
                },
            },
        })
    }

    update(time, delta) {
        this.container.y -= 1;
        if(this.container.y<=-850){
            this.container.y=590;
        }
    }
}

export default Credits;
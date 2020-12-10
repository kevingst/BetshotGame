//By Kévin Gosset for Betshot - kevingosset.fr
class gameEnd extends Phaser.Scene {
    constructor() {
        super({ key: 'endGame' });
    }
    init(data) {
        // Récupération de la variable du score final
        console.log('init', data);
        this.score = data.scoreF;
        // this.score = 150;
    }
    preload() {
        // Chargement des images
        this.load.image('ballon', 'img/ballon.png');
        this.load.image('pieds', 'img/betshot-pieds.png');
    }
    create() {
        // Création du ballon et des pieds
        this.ballon = this.add.image(game.config.width / 2, game.config.height / 2 + 200, 'ballon');
        this.pieds = this.add.image(game.config.width / 2, game.config.height / 2 + 350, 'pieds');

        // Création du text 
        this.text = this.add.text(game.config.width / 2, game.config.height / 2 - 500, "FELICITATION !").setStyle({
            fontFamily: 'Helvetica Neue LT Std',
            color: '#EBEBEB',
            align: 'center',
            fontStyle: 'bold'
        }).setFontSize(100).setOrigin(0.5);

        // Affichage du score
        this.text = this.add.text(game.config.width / 2, game.config.height / 2 - 300, this.score.toFixed(2) + "m").setStyle({
            fontFamily: 'Helvetica Neue LT Std',
            color: '#EBEBEB',
            align: 'center',
            fontStyle: 'bold'
        }).setFontSize(160).setOrigin(0.5);

        // Création d'un rectangle bleu
        this.rectangle = this.add.rectangle(0, 1920, 2500, 600, 0x8ACDC9);

        // Ajout du text sur le rectangle bleu
        this.text = this.add.text(game.config.width / 2, 1780, "J'ai gagné ?").setStyle({
            fontFamily: 'Helvetica Neue LT Std',
            color: '#EBEBEB',
            align: 'center',
            fontStyle: 'bold'
        }).setFontSize(90).setOrigin(0.5);

        // parametres de l'animation du ballon
        var tweendata = {
            targets: this.ballon,
            y: 1140,
            duration: 1200,
            ease: 'Linear',
            autoStart: true,
            delay: 0,
            repeat: 1000,
            yoyo: true,
        }

        // Lancer l'animation du ballon
        this.tw = this.add.tween(tweendata);
    }
    update() {}
}
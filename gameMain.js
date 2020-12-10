//By Kévin Gosset for Betshot - kevingosset.fr
class gameMain extends Phaser.Scene {

    constructor() {
        super('playGame');
    }
    preload() {
        // Chargement des images
        this.load.image('ballon', 'img/ballon.png');

        // Charger les sprites sheet
        this.load.atlas('nuage1sheet', 'assets/nuage1-sprite.png', 'assets/nuage1-sprite.json');
        this.load.atlas('nuage2sheet', 'assets/nuage2-sprite.png', 'assets/nuage2-sprite.json');
        this.load.atlas('nuage3sheet', 'assets/nuage3-sprite.png', 'assets/nuage3-sprite.json');
        this.load.atlas('ballonsheet', 'assets/ballon-sprite.png', 'assets/ballon-sprite.json');

        // Charger les shapes JSON
        this.load.json('nuage1shape', 'assets/nuage1-shape.json');
        this.load.json('nuage2shape', 'assets/nuage2-shape.json');
        this.load.json('nuage3shape', 'assets/nuage3-shape.json');
        this.load.json('ballonshape', 'assets/ballon-shape.json');
    }

    create() {
        // PARTIE MENU //
        // Variable de démarage de la partie
        this.startGame = false;

        // Création du text
        this.text = this.add.text(game.config.width / 2, game.config.height / 2 + 300, "Cliquer pour lancer la \n partie !", {
            fontFamily: 'Helvetica Neue LT Std',
            color: '#EBEBEB',
            align: 'center',
            fontStyle: 'italic',
        }).setOrigin(0.5).setFontSize(80);

        // Transformer le text en bouton 
        this.text.setInteractive();

        // Action du bouton text
        this.text.on('pointerdown', () => {
            this.text.visible = false;
            this.startGame = true;
            this.ballon.setIgnoreGravity(false);
            this.tw.stop();
        });

        // PARTIE JEU //
        // Création des shapes
        var nuage1shape = this.cache.json.get('nuage1shape');
        var nuage2shape = this.cache.json.get('nuage2shape');
        var nuage3shape = this.cache.json.get('nuage3shape');
        var ballonshape = this.cache.json.get('ballonshape');

        // Création du pointer (clique souris ou tactil)
        this.input.on('pointerdown', this.flap, this);

        // Création d'un nombre random entre 1 et 3 pour la selection d'un nuage
        this.randomNuageHaut = Phaser.Math.Between(1, 3);
        this.randomNuageBas = Phaser.Math.Between(1, 3);
        this.randomNuageMilieu = Phaser.Math.Between(1, 3);

        // Création Nuage Haut
        this.nuageHaut1 = this.matter.add.sprite(Phaser.Math.Between(1700, 1900), Phaser.Math.Between(0, gameOptions.maxHaut), 'nuage1sheet', 'nuageHaut1', { shape: nuage1shape.nuage1 });
        this.nuageHaut2 = this.matter.add.sprite(Phaser.Math.Between(1700, 1900), Phaser.Math.Between(0, gameOptions.maxHaut), 'nuage2sheet', 'nuageHaut2', { shape: nuage2shape.nuage2 });
        this.nuageHaut3 = this.matter.add.sprite(Phaser.Math.Between(1700, 1900), Phaser.Math.Between(0, gameOptions.maxHaut), 'nuage3sheet', 'nuageHaut3', { shape: nuage3shape.nuage3 });

        // Création Nuage Bas
        this.nuageBas1 = this.matter.add.sprite(Phaser.Math.Between(1700, 1900), Phaser.Math.Between(gameOptions.minBas, game.config.height), 'nuage1sheet', 'nuageBas1', { shape: nuage1shape.nuage1 });
        this.nuageBas2 = this.matter.add.sprite(Phaser.Math.Between(1700, 1900), Phaser.Math.Between(gameOptions.minBas, game.config.height), 'nuage2sheet', 'nuageBas2', { shape: nuage2shape.nuage2 });
        this.nuageBas3 = this.matter.add.sprite(Phaser.Math.Between(1700, 1900), Phaser.Math.Between(gameOptions.minBas, game.config.height), 'nuage3sheet', 'nuageHaut3', { shape: nuage3shape.nuage3 });

        // Création Nuage Milieu       
        this.nuageMilieu1 = this.matter.add.sprite(Phaser.Math.Between(3000, 3100), Phaser.Math.Between(gameOptions.minMilieu, gameOptions.maxMilieu), 'nuage1sheet', 'nuageMilieu1', { shape: nuage1shape.nuage1 }).setScale(0.6);
        this.nuageMilieu2 = this.matter.add.sprite(Phaser.Math.Between(3000, 3100), Phaser.Math.Between(gameOptions.minMilieu, gameOptions.maxMilieu), 'nuage2sheet', 'nuageMilieu2', { shape: nuage2shape.nuage2 }).setScale(0.6);
        this.nuageMilieu3 = this.matter.add.sprite(Phaser.Math.Between(3000, 3100), Phaser.Math.Between(gameOptions.minMilieu, gameOptions.maxMilieu), 'nuage3sheet', 'nuageMilieu3', { shape: nuage3shape.nuage3 }).setScale(0.6);

        // Création Ballon
        this.ballon = this.matter.add.sprite(game.config.width / 2, game.config.height / 2, 'ballonsheet', 'ballon', { shape: ballonshape.balloncadeau });
        this.ballon.setIgnoreGravity(true);

        // Parametres de l'animation du ballon
        var tweendata = {
            targets: this.ballon,
            y: 850,
            duration: 1200,
            ease: 'Linear',
            autoStart: true,
            delay: 0,
            repeat: 1000,
            yoyo: true,
        }

        // Lancer l'animation du ballon
        this.tw = this.add.tween(tweendata);

        // Affichage du score
        this.afficheScore = this.add.text(game.config.width - 270, 60, '').setStyle({ fontFamily: 'Helvetica Neue LT Std', color: '#EBEBEB', align: 'left', fontStyle: 'normal' }).setFontSize(85);
        this.score = 0;

        // Initialisation du temps
        this.temps = 0;

        // Initialisation de la vitesse
        this.speed = 5;

        // Collision
        this.matterCollision.addOnCollideStart({
            objectA: [this.nuageHaut1, this.nuageHaut2, this.nuageHaut3, this.nuageBas1, this.nuageBas2, this.nuageBas3, this.nuageMilieu1, this.nuageMilieu2, this.nuageMilieu3],
            objectB: this.ballon,
            callback: eventData => {
                this.die();
            }
        });
    }

    update() {

        if (this.startGame == true) {
            // Mise à jour de la vitesse
            if (this.score <= 50) {
                this.speed += 0.005;
            }

            // Mise à jour du score
            this.score += this.speed / 1000;
            this.afficheScore.setText(this.score.toFixed(2) + "m");

            // Mise à jour du temps
            this.temps += 0.045;

            // Switch pour choisir une des nuages haut a utilisé grace à la variable random
            switch (this.randomNuageHaut) {
                case 1:
                    this.moveNuageHaut(this.nuageHaut1, this.speed);
                    break;
                case 2:
                    this.moveNuageHaut(this.nuageHaut2, this.speed);
                    break;
                case 3:
                    this.moveNuageHaut(this.nuageHaut3, this.speed);
                    break;
                default:
                    break;
            }

            // Switch pour choisir une des nuages bas a utilisé grace à la variable random
            switch (this.randomNuageBas) {
                case 1:
                    this.moveNuageBas(this.nuageBas1, this.speed);
                    break;
                case 2:
                    this.moveNuageBas(this.nuageBas2, this.speed);
                    break;
                case 3:
                    this.moveNuageBas(this.nuageBas3, this.speed);
                    break;
                default:
                    break;
            }

            // Switch pour choisir une des nuages du milieu a utilisé grace à la variable random
            switch (this.randomNuageMilieu) {
                case 1:
                    this.moveNuageMilieu(this.nuageMilieu1, this.speed);
                    break;
                case 2:
                    this.moveNuageMilieu(this.nuageMilieu2, this.speed);
                    break;
                case 3:
                    this.moveNuageMilieu(this.nuageMilieu3, this.speed);
                    break;
                default:
                    break;
            }

            // Si le ballon sort du cadre -> fin de partie
            if (this.ballon.y > game.config.height || this.ballon.y < 0) {
                this.die();
            }
        }
    }

    moveNuageHaut(nuage, speed) {
        nuage.x -= speed;
        if (nuage.x <= -1300) {
            this.resetNuagePosHaut(nuage);
            this.randomNuageHaut = Phaser.Math.Between(1, 3);
        }
    }
    resetNuagePosHaut(nuage) {
        nuage.x = Phaser.Math.Between(1700, 1900);
        nuage.y = Phaser.Math.Between(0, gameOptions.maxHaut);
    }

    moveNuageBas(nuage, speed) {
        nuage.x -= speed;
        if (nuage.x <= -1300) {
            this.resetNuagePosBas(nuage);
            this.randomNuageBas = Phaser.Math.Between(1, 3);
        }
    }
    resetNuagePosBas(nuage) {
        nuage.x = Phaser.Math.Between(1700, 1900);
        nuage.y = Phaser.Math.Between(gameOptions.minBas, game.config.height);
    }

    moveNuageMilieu(nuage, speed) {
        nuage.x -= speed;
        if (nuage.x <= -100) {
            this.resetNuagePosMilieu(nuage);
            this.randomNuageMilieu = Phaser.Math.Between(1, 3);
        }
    }
    resetNuagePosMilieu(nuage) {
        nuage.x = Phaser.Math.Between(3000, 3100);
        nuage.y = Phaser.Math.Between(gameOptions.minMilieu, gameOptions.maxMilieu);
    }

    flap() {
        if (this.startGame == true) {
            this.ballon.setVelocity(0, -gameOptions.ballonFlapPower);
        }
    }

    die() {
        this.scene.start('endGame', { scoreF: this.score, temps: this.temps });
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
}
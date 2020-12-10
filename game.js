//By Kévin Gosset for Betshot - kevingosset.fr
var game;
var gameOptions = {

    // puissance du clic
    ballonFlapPower: 15,

    //Limite des zones d'apparitions des nuages
    maxHaut: 100,
    minBas: 1820,
    minMilieu: 950,
    maxMilieu: 1000,
}
var config = {
    type: Phaser.AUTO,
    backgroundColor: 0xfe595e,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 1080,
        height: 1920
    },
    pixelArt: true,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 4
            },
            // debug: true
        }
    },
    // Install the scene plugin
    plugins: {
        scene: [{
            plugin: PhaserMatterCollisionPlugin,
            key: "matterCollision",
            mapping: "matterCollision"
        }]
    },
    scene: [gameMain, gameEnd]
}
game = new Phaser.Game(config);
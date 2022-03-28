import io from 'socket.io-client';
export default class Menu extends Phaser.Scene {
    constructor(){
        super({
            key: 'Menu'
        });
    }

    preload(){
        this.load.image('menuBackground', 'src/assets/image.png')
        this.load.image('startButton', 'src/assets/startbtn.png')
    }

    create(){
         //socket.io
        
        this.add.image(0,0,'menuBackground').setOrigin(0);
        let startButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2,'startButton').setOrigin(0);
        
        startButton.setInteractive();
        this.input.on('pointerdown', ()=> {
            this.scene.start('Draw');
        });
    }

    update(){

    }
}
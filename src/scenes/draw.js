import io from 'socket.io-client';
import * as Realm from "realm-web"

export default class Draw extends Phaser.Scene {
    constructor(){
        super({
            key: 'Draw'
        });
        var paintData;
        var startColor = 0x000000;   
        var isDrawing = false;
        var lineColor;
        var brushColor;
        var hexColor;
    }
    
    preload(){
        //load Images
        this.load.image('background', 'src/assets/gradient.png');
        this.load.image('paint', 'src/assets/paint.png');

        this.socket = io("http://localhost:3000"), {autoConnect:false};
        
        this.load.html('form', 'form.html');
        this.chatMessage = [];
    }

    create(){
        //socket.io
        //this.socket = io("http://localhost:3000");
        /*
        this.socket.on('connect', function(){
            console.log('Connected');
        });
        */
        /*
        */
        //server


        // background
        this.add.image(0,0,'background').setOrigin(0);
        // make color wheel into canvas to allow use of .getPixel
        var src = this.textures.get('paint').getSourceImage();
        this.paintData = this.textures.createCanvas('gradient', src.width, src.height);
        this.paintData.draw(0,0,src);
        this.gradient = this.add.image(0,0,'paint').setOrigin(0);
        
        this.gradient.setInteractive();
        this.gradient.on('pointerdown', this.changeColor, this)

        //line graphics
        this.graphics = this.add.graphics();

        //1280x720  --- 1135,690
        //chatbox

        this.textInput = this.add.dom(938,575).createFromCache('form').setOrigin(0.5);
        this.chat = this.add.text(800, 0, '', {
            lineSpacing: 15,
            backgroundColor: '#21313CDD',
            color: '#000000',
            padding: 10,
            fontStyle: 'bold'
        });
        this.chat.setFixedSize(280,645);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterKey.on('down', event => {
            let chatbox = this.textInput.getChildByName('chat');
            if(chatbox.value != ''){
                this.socket.emit('message', chatbox.value);
                chatbox.value = '';
            }
        });
        this.socket.connect();
        this.socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
        this.isPlayerA = false;
        this.socket.on('isPlayerA', function(){
            self.isPlayerA = true;
        })

        this.socket.on('connect', function(){
            this.socket.emit('join', 'mongodb');
        });
        this.socket.on('joined', async (chatId) => {
            let result = await fetch(`http://localhost:3000/chat?room=${chatId}`)
                .ten(response => response.json());
            this.chatMessage = result.messages;
            this.chatMessage.push('Welcome to' + chatId);
        });
    }

    update(){
        // this.coloring
        this.graphics.lineStyle(4,this.coloring);
        // drawing cursor
        if(!this.input.activePointer.isDown && this.isDrawing){
            this.isDrawing = false;
        }
        else if(this.input.activePointer.isDown){
            if(!this.isDrawing){
                this.path = new Phaser.Curves.Path(
                    this.input.activePointer.position.x-2,
                    this.input.activePointer.position.y-2)
                this.isDrawing = true;
            }
            else{
                this.path.lineTo(
                    this.input.activePointer.position.x-2,
                    this.input.activePointer.position.y-2)
            }
            this.path.draw(this.graphics);
        }
    }
    
    changeColor(pointer,x,y,event){
        this.lineColor = this.paintData.getPixel(this.input.activePointer.position.x,
            this.input.activePointer.position.y);
        console.log(this.lineColor);
        
        //turn to hex string
        this.brushColor = Phaser.Display.Color.RGBToString(this.lineColor.r,
            this.lineColor.b, this.lineColor.g, this.lineColor.a);
            console.log(this.brushColor);
        //remove # and add 0x
        this.hexColor = Phaser.Utils.String.RemoveAt(this.brushColor, 0);
        this.coloring = '0x' + this.hexColor;
        console.log(this.hexColor);
    }
    
    async authentication(){
        /*
        const credentials = Realm.Credentials.anonymous();
        try{
            const user = await append.logIn(credentials);
        } catch(e){
            console.error(e);
        }
        return credentials;
        */
       return this.client.auth.loginWithCredentials(Realm.Credentials.anonymous());
    }
    
    async createRoom(){
        let auth = await this.authentication();
        console.log(auth);
        this.createGame('nav', auth.id);
    }

    createGame(id,authId){
        this.game = new Phaser.Game(this.phaserConfig)
    }
    
}

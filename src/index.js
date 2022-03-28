import Phaser from 'phaser';
import Draw from './scenes/draw';
import Menu from './scenes/menu';
//import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'
import * as Realm from "realm-web"

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1080,
    height: 720,
    backgroundColor: 0xecf0f1,
    dom: {createContainer: true},
    scene: [Menu, Draw],
};
const game = new Phaser.Game(config);
//game.Draw.createRoom();

//const REALM_APP_ID = 'drawing-bsmtt';
//const client = new Realm.App({id: REALM_APP_ID});

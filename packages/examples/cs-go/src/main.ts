import { CSGO } from './game'
import { Round } from './scenes'

const game = new CSGO();
game.SetScene(Round);
game.Start();
console.log(game);

(window as any).game = game;
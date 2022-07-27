import { CSGO } from './game'
import { Round } from './scenes'

const game = new CSGO();
game.SetScene(Round);
game.Start();

(window as any).game = game;
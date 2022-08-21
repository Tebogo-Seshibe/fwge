import { CSGO } from './game'
import { Round } from './scenes'

const game = new CSGO();
game.Start();

(window as any).game = game;
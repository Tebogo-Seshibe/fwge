import { GL } from '@fwge/common';
import { Tetris } from './game';

const game = new Tetris();
game.Start();

(window as any).game = game;
(window as any).gl = GL;

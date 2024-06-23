import { Project } from './Project';

const game = new Project();
game.Start();
document.body.appendChild(game.Canvas);
(window as any).game = game;

import { Project } from './Project';

const game = new Project();
game.Init();
game.SetScene(0);
game.CurrentScene?.Init();
game.Start();
(window as any).game = game;

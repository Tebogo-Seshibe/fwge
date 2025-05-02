import { Project } from './Project';

const game = new Project();
(window as any).game = game;
game.Canvas.height = 1080;
game.Canvas.width = 1920;
await game.Init();
game.SetScene(0);
game.CurrentScene?.Init();
// game.RegisterAsset(CubeMesh.name, new CubeMesh())
// game.RegisterAsset(CubeMesh.name, new CubeMesh())
game.Start();

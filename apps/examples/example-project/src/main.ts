import { AssetManager } from '@fwge/core';
import { Project } from './Project';
import { CubeMesh } from './assets/CubeMesh';
import { GridMesh } from './assets/GridMesh';
import { TextAsset } from './TextAsset';

const game = new Project();
(window as any).game = game;
game.Canvas.height = 1080;
game.Canvas.width = 1920;
await game.Init();
AssetManager.Register([CubeMesh, GridMesh])
AssetManager.Load([CubeMesh, GridMesh])
console.log({ AssetManager })
game.SetScene(0);
// game.RegisterAsset(CubeMesh.name, new CubeMesh())
// game.RegisterAsset(CubeMesh.name, new CubeMesh())
game.Start();
const server_properties = new TextAsset('./public/text.txt');
server_properties.Load();
console.log(server_properties);

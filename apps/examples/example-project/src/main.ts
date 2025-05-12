import { AssetManager } from '@fwge/core';
import { OBJLoader } from '@fwge/io'
import { Project } from './Project';
import { CubeMesh } from './assets/CubeMesh';
import { FinalPassShaderAsset } from './assets/FinalPassShader';
import { GridMesh } from './assets/GridMesh';
import { TextAsset } from './TextAsset';

const game = new Project();
(window as any).game = game;
game.Canvas.height = 1080;
game.Canvas.width = 1920;
await game.Init();
AssetManager.Register(FinalPassShaderAsset, CubeMesh, GridMesh)
AssetManager.Load([FinalPassShaderAsset, CubeMesh, GridMesh])


const objText = new TextAsset('./public/objects/Sphere.obj');
objText.Load();
setTimeout(() => {
    const obj = OBJLoader(objText.Content);
    const { mesh } = obj['Sphere'];
    mesh.Load();
    console.log(obj)
    AssetManager.Register({ title: 'Sphere', asset: mesh });
    game.SetScene(0);
    game.Start({ seconds: 5 });
}, 2000)
// return OBJMTLPrefabBuilder(
//     OBJLoader(de_dust2_OBJ),
//     MTLLoader(de_dust2_MTL, game.GetAsset(Shader, 'Basic Shader'))
// )
// .AddComponent(new Tag('De_Dust 2'))
// .AddComponent(new Transform());
import { AssetManager, MeshRenderer } from '@fwge/core';
import { OBJLoader } from '@fwge/io'
import { Project } from './Project';
import { CubeMesh } from './assets/CubeMesh';
import { FinalPassShaderAsset } from './assets/FinalPassShader';
import { GridMesh } from './assets/GridMesh';
import { TextAsset } from './TextAsset';
import { OBJMTLAsset } from './OBJMTLAsset';
import { Entity, Registry } from '@fwge/ecs';
import { CubeShader } from './assets/CubeShader';

const game = new Project();
(window as any).game = game;
game.Canvas.height = 1080;
game.Canvas.width = 1920;

game.Canvas.height * 0.75;
game.Canvas.width * 0.75;

await game.Init();
AssetManager.Register(FinalPassShaderAsset, CubeMesh, GridMesh)
AssetManager.Load([FinalPassShaderAsset, CubeMesh, GridMesh])

const obj1Text = new TextAsset('./public/objects/Sphere.obj');
const obj2Text = new TextAsset('./public/objects/SmoothSphere.obj');
const helipad = new OBJMTLAsset(
    './public/objects/helipad/helipad.obj',
    './public/objects/helipad/helipad.mtl',
);

AssetManager.Example('helipad', OBJMTLAsset)
obj1Text.Load();
obj2Text.Load();
helipad.Load();
setTimeout(() => {
    const obj1 = OBJLoader(obj1Text.Content);
    const obj2 = OBJLoader(obj2Text.Content);

    const { mesh: Sphere } = obj1['Sphere'];
    const { mesh: SmoothSphere } = obj2['Sphere'];
    
    Sphere.Load();
    SmoothSphere.Load();

    AssetManager.Register({ title: 'Sphere', asset: Sphere });
    AssetManager.Register({ title: 'SmoothSphere', asset: SmoothSphere });
    
    const mainScene = game.GetScene(0)!;
    setTimeout(() => {
        const objects = Object.keys(helipad.OBJ);
        for (const name of objects)
        {
            const { mesh, material: material_name } = helipad.OBJ[name];
            const material = helipad.MTL[material_name];

            AssetManager.Register({ title: name, asset: mesh });
            // AssetManager.Register({ title: material_name, asset: material as any});

            material.Shader = new CubeShader();

            const entity = new Entity()
                .AddComponents(
                    new MeshRenderer({ asset: mesh }),
                    material
                )
            mesh.Load();
            entity.Init();
            mainScene.Entities.push(entity.Id);
            console.log({
                entity,
                components: entity.GetAllComponents()
            })
        }
        
        console.log(mainScene)
        console.log({AssetManager})
    }, 1000);

    game.SetScene(0);
    game.Start();
}, 500)
// return OBJMTLPrefabBuilder(
//     OBJLoader(de_dust2_OBJ),
//     MTLLoader(de_dust2_MTL, game.GetAsset(Shader, 'Basic Shader'))
// )
// .AddComponent(new Tag('De_Dust 2'))
// .AddComponent(new Transform());
import type { Colour3Array } from "@fwge/common";
import { AssetManager, BasicLitMaterial, MeshRenderer, Script, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { CubeMesh } from "../assets/CubeMesh";
import { CubeShaderAsset } from "../assets/CubeShader";
import { OBJMTLAsset } from "../OBJMTLAsset";

export class Environment extends Entity
{
    Init(): void
    {
        const cubeShader = AssetManager.Get(CubeShaderAsset)!.Shader!;

        const cubeMesh = AssetManager.Get(CubeMesh)!;
        const sphereMesh = AssetManager.Get<OBJMTLAsset>('Sphere')!;
        const helipad = AssetManager.Get<OBJMTLAsset>('helipad')!;
        const cubeObjectMesh = AssetManager.Get<OBJMTLAsset>('CubeObject')!;

        const helipadMesh = helipad.OBJ['Helipad'].mesh;
        const helipadMaterial = helipad.MTL[helipad.OBJ['Helipad'].material]

        const cubeObjectMeshRender = new MeshRenderer({ asset: cubeMesh });
        const cubeMeshRender = new MeshRenderer({ asset: cubeObjectMesh.OBJ['Cube'].mesh });
        const sphereMeshRender = new MeshRenderer({ asset: sphereMesh.OBJ['Sphere'].mesh });
        const helipadMeshRender = new MeshRenderer({ asset: helipadMesh });

        console.log(helipadMesh)
        console.log(helipadMaterial)
        helipadMaterial.Shader = cubeShader;
        helipadMaterial.ProjectsShadows = false;
        helipadMaterial.ReceiveShadows = false;
        const floor = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [ 0, -1, 0 ],
                    rotation:   [ 0,  0, 0 ],
                    scale:      [ 5,  1, 5 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: false,
                    receiveShadows: true,
                    colour: [51/255, 12/255, 47/255]
                })
            );
        const cube1 = new Entity()
            .AddComponents(
                // ignore,
                new Transform(
                { 
                    position:   [ 0, 0.5, 0 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 1, 1, 1 ]
                }),
                helipadMeshRender,
                helipadMaterial,
                new Script({
                    update: (delta) => {
                        cube3.GetComponent(Transform)!.Rotation.Y += delta * 10;
                        // floor.GetComponent(Transform)!.Scale.Add(1,1,1);
                        // console.log(floor.GetComponent(Transform))
                    }
                })
            );
        const cube2 = new Entity()
            .AddComponents(
                // ignore,
                new Transform(
                { 
                    position:   [ -2, 1, 0 ],
                    rotation:   [ 0, 45, 0 ],
                    scale:      [ 1, 2, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [112/255, 103/255, 207/255]
                })
            );
        const cube3 = new Entity()
            .AddComponents(
                // ignore,
                new Transform(
                { 
                    position:   [ 2, 1, 0 ],
                    rotation:   [ 0, 30, 0 ],
                    scale:      [ 2, 2, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [183/255, 192/255, 238/255]
                })
            );
        const cube4 = new Entity()
            .AddComponents(
                // ignore,
                new Transform(
                { 
                    position:   [ 0, 0.5, -2 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 2, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [203/255, 243/255, 210/255]
                })
            );            
        const cube5 = new Entity()
            .AddComponents(
                // ignore,
                new Transform(
                { 
                    position:   [ 0, 2.5, -2 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 1, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [203/255, 243/255, 210/255].map(x => x * 0.5) as Colour3Array
                })
            );
        const cube6 = new Entity()
            .AddComponents(
                // ignore,
                new Transform(
                { 
                    position:   [ 0, 2, -5 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 5, 5, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [203/255, 243/255, 210/255].reverse() as Colour3Array//.map(x => x * 0.25) as Colour3Array
                })
            )


        floor.Name = 'Floor';
        cube1.Name = 'Cube 1';
        cube2.Name = 'Cube 2';
        cube3.Name = 'Cube 3';
        cube4.Name = 'Cube 4';
        cube5.Name = 'Cube 5';
        cube6.Name = 'Cube 6';

        this.AddChild(floor)
            .AddChild(cube1)
            .AddChild(cube2)
            .AddChild(cube3)
            .AddChild(cube6);
        cube3.AddChild(cube4)
            .AddChild(cube5);

        // cubeShader.Init();
        // cubeMesh.Load();
        // [floor, cube1, cube2, cube3, cube4, cube5, cube6].forEach(entity => entity.GetComponent(Material)!.ImageTextures.filter(Boolean).forEach(tex => tex!.Load()));
    }
}
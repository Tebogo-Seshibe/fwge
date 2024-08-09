import type { Colour3Array } from "@fwge/common";
import { BasicLitMaterial, Entity, MeshRenderer, Transform } from "@fwge/core";
import { CubeMesh } from "../assets/CubeMesh";
import { CubeShader } from "../assets/CubeShader";
import { EditorTag } from "../components/EditorTag";

export class Environment extends Entity
{
    Init(): void
    {
        const ignore = new EditorTag(this.Game);
        const cubeShader = new CubeShader();
        const cubeMeshRender = new MeshRenderer(this.Game,
        {
            asset: this.Game.GetAsset(CubeMesh)!
        });

        const floor = new Entity(this.Game)
            .AddComponents(
                new Transform(this.Game,
                { 
                    position:   [  0, 0,  0 ],
                    rotation:   [  0,  0,  0 ],
                    scale:      [ 2,  2, 2 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [51/255, 12/255, 47/255]
                })
            );
        const cube1 = new Entity(this.Game)
            .AddComponents(
                ignore,
                new Transform(this.Game,
                { 
                    position:   [ 0, 0.5, 0 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 1, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [123/255, 40/255, 125/255]
                })
            );
        const cube2 = new Entity(this.Game)
            .AddComponents(
                ignore,
                new Transform(this.Game,
                { 
                    position:   [ -2, 1, 0 ],
                    rotation:   [ 0, 45, 0 ],
                    scale:      [ 1, 2, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [112/255, 103/255, 207/255]
                })
            );
        const cube3 = new Entity(this.Game)
            .AddComponents(
                ignore,
                new Transform(this.Game,
                { 
                    position:   [ 2, 1, 0 ],
                    rotation:   [ 0, 30, 0 ],
                    scale:      [ 2, 2, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [183/255, 192/255, 238/255]
                })
            );
        const cube4 = new Entity(this.Game)
            .AddComponents(
                ignore,
                new Transform(this.Game,
                { 
                    position:   [ 0, 0.5, -2 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 2, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [203/255, 243/255, 210/255]
                })
            );            
        const cube5 = new Entity(this.Game)
            .AddComponents(
                ignore,
                new Transform(this.Game,
                { 
                    position:   [ 0, 2.5, -2 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 1, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [203/255, 243/255, 210/255].map(x => x * 0.5) as Colour3Array
                })
            );
        const cube6 = new Entity(this.Game)
            .AddComponents(
                ignore,
                new Transform(this.Game,
                { 
                    position:   [ 0, 2, -5 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 5, 5, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial(this.Game,
                {
                    shader: cubeShader,
                    alpha: 1.0,
                    projectShadows: true,
                    receiveShadows: true,
                    colour: [203/255, 243/255, 210/255].reverse() as Colour3Array//.map(x => x * 0.25) as Colour3Array
                })
            );


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

        cubeShader.Init(this.Game.GL);
        console.log(this);
    }
}
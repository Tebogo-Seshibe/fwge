import { BasicLitMaterial, MeshRenderer, Shader, StaticMesh, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { cubeMesh } from "../assets/CubeMesh";
import { cubeShaderFrag, cubeShaderVert } from "../assets/CubeShader";
import type { Colour3Array } from "@fwge/common";

export class Environment extends Entity
{
    constructor()
    {
        super();

        const cubeShader = new Shader(cubeShaderVert, cubeShaderFrag);
        const cubeMeshRender = new MeshRenderer(
        {
            asset: new StaticMesh(cubeMesh)
        });

        const floor = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [  0, -0.5,  0 ],
                    rotation:   [  0,  0,  0 ],
                    scale:      [ 10,  1, 10 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial({
                    shader: cubeShader,
                    colour: [51/255, 12/255, 47/255]
                })
            );
        const cube1 = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [ 0, 0.5, 0 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 1, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial({
                    shader: cubeShader,
                    colour: [123/255, 40/255, 125/255]
                })
            );
        const cube2 = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [ -2, 1, 0 ],
                    rotation:   [ 0, 45, 0 ],
                    scale:      [ 1, 2, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial({
                    shader: cubeShader,
                    colour: [112/255, 103/255, 207/255]
                })
            );
        const cube3 = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [ 2, 1, 0 ],
                    rotation:   [ 0, 30, 0 ],
                    scale:      [ 2, 2, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial({
                    shader: cubeShader,
                    colour: [183/255, 192/255, 238/255]
                })
            );
        const cube4 = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [ 0, 0.5, -2 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 2, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial({
                    shader: cubeShader,
                    colour: [203/255, 243/255, 210/255]
                })
            );
            
        const cube5 = new Entity()
            .AddComponents(
                new Transform(
                { 
                    position:   [ 0, 2.5, -2 ],
                    rotation:   [ 0, 0, 0 ],
                    scale:      [ 1, 1, 1 ]
                }),
                cubeMeshRender,
                new BasicLitMaterial({
                    shader: cubeShader,
                    colour: [203/255, 243/255, 210/255].map(x => x * 0.5) as Colour3Array
                })
            );


        floor.Name = 'Floor';
        cube1.Name = 'Cube 1';
        cube2.Name = 'Cube 2';
        cube3.Name = 'Cube 3';
        cube4.Name = 'Cube 4';
        cube5.Name = 'Cube 5';

        this.AddComponent(new Transform());
        this.AddChild(floor)
            .AddChild(cube1)
            .AddChild(cube2)
            .AddChild(cube3);
        cube3.AddChild(cube4)
            .AddChild(cube5);
    }
}
import { BasicLitMaterial, MeshRenderer, RenderMode, Script, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { GridMesh } from "../assets/GridMesh";
import { GridShader } from "../assets/GridShader";

export class Grid extends Entity
{
    constructor()
    {
        super();
        
        this.AddComponents(
            new Transform({}),
            new BasicLitMaterial({
                shader: new GridShader(), // assets should be names to index from asset manager
                colour: [1,1,1]
            }),
            new MeshRenderer({
                renderMode: RenderMode.EDGE,
                asset: new GridMesh() // assets should be names to index from asset manager
            }),
            new Script({})
        );
    }

    Init(): void
    {
        console.log(this)
    }
}
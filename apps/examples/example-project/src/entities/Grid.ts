import { BasicLitMaterial, MeshRenderer, RenderMode, Script, Transform } from "@fwge/core";
import { GridMesh } from "../assets/GridMesh";
import { GridShader } from "../assets/GridShader";
import { Entity } from "@fwge/ecs";

export class Grid extends Entity
{
    Init(): void
    {        
        const gridMesh = new GridMesh()!;

        this.AddComponents(
            new Transform(),
            new BasicLitMaterial(
            {
                shader: new GridShader(), // assets should be names to index from asset manager
                colour: [1,1,1]
            }),
            new MeshRenderer(
            {
                renderMode: RenderMode.EDGE,
                asset: gridMesh // assets should be names to index from asset manager
            }),
            new Script()
        );
        this.GetComponent(BasicLitMaterial)!.Shader.Init();
    }
}
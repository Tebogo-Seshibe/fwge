import { BasicLitMaterial, Entity, MeshRenderer, RenderMode, Script, Transform } from "@fwge/core";
import { GridMesh } from "../assets/GridMesh";
import { GridShader } from "../assets/GridShader";

export class Grid extends Entity
{
    Init(): void
    {        
        const gridMesh = this.Game.GetAsset(GridMesh)!;

        this.AddComponents(
            new Transform(this.Game),
            new BasicLitMaterial(this.Game,
            {
                shader: new GridShader(), // assets should be names to index from asset manager
                colour: [1,1,1]
            }),
            new MeshRenderer(this.Game,
            {
                renderMode: RenderMode.EDGE,
                asset: gridMesh // assets should be names to index from asset manager
            }),
            new Script(this.Game)
        );
        this.GetComponent(BasicLitMaterial)!.Shader.Init(this.Game.GL);
    }
}
import { BasicLitMaterial, MeshRenderer, RenderMode, Shader, StaticMesh, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { gridMesh } from "../assets/GridMesh";
import { gridShaderFrag, gridShaderVert } from "../assets/GridShader";
import { EditorTag } from "../components/EditorTag";

export class Grid extends Entity
{
    constructor()
    {
        super();
        
        this.AddComponents(
            new EditorTag(),
            new Transform(),
            new BasicLitMaterial(
            {
                shader: new Shader(gridShaderVert, gridShaderFrag),
                colour: [1,1,1]
            }),
            new MeshRenderer(
            {
                renderMode: RenderMode.EDGE,
                asset: new StaticMesh(gridMesh)
            })
        );
    }
}
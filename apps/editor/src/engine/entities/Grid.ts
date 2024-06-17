import { BasicLitMaterial, MeshRenderer, RenderMode, Shader, StaticMesh, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { gridMesh } from "../assets/GridMesh";
import { gridShaderFrag, gridShaderVert } from "../assets/GridShader";
import { EditorTag } from "../components/EditorTag";
import { EditorEntity } from "../decorators/Class.decorator";
import { EditorComponent } from "../decorators/Component.decorator";

@EditorEntity()
export class Grid extends Entity
{
    @EditorComponent(Transform, {})
    transform!: Transform;
    
    @EditorComponent(BasicLitMaterial, {
        shader: new Shader(gridShaderVert, gridShaderFrag), // assets should be names to index from asset manager
        colour: [1,1,1]
    })
    BasicLitMaterial!: BasicLitMaterial;
    @EditorComponent(MeshRenderer, {
        renderMode: RenderMode.EDGE,
        asset: new StaticMesh(gridMesh) // assets should be names to index from asset manager
    })
    MeshRenderer!: MeshRenderer;
    
    constructor()
    {
        super();
        
        this.AddComponents(
            // new EditorTag(),
        );
    }

    Init(): void
    {
        console.log(this)
    }
}
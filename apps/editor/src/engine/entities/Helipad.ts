import { AssetManager, MeshRenderer, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { CubeShaderAsset } from "../assets/CubeShader";
import { Helipad as HelipadAsset } from "../assets/Helipad";

export class Helipad extends Entity
{
    Init(): void
    {
        const cubeShader = AssetManager.Get(CubeShaderAsset)!.Shader!;
        const helipad = AssetManager.Get(HelipadAsset)!;
        
        this.AddChild(helipad.Instance);
        // const helipadMesh = helipad.OBJ['Helipad'].mesh;
        // const helipadMaterial = helipad.MTL[helipad.OBJ['Helipad'].material];
        // helipadMaterial.Shader = cubeShader;
        // helipadMaterial.ProjectsShadows = false;
        // helipadMaterial.ReceiveShadows = true;

        // this.AddComponents(
        //     new Transform({ position: [0, -2, 0]}),
        //     new MeshRenderer({ asset: helipadMesh }),
        //     helipadMaterial
        // );
    }
}
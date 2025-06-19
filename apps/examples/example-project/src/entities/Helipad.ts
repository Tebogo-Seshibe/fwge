import { AssetManager, MeshRenderer, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { CubeShaderAsset } from "../assets/CubeShader";
import { OBJMTLAsset } from "../OBJMTLAsset";

export class Helipad extends Entity
{
    Init(): void
    {
        const cubeShader = AssetManager.Get(CubeShaderAsset)!.Shader!;
        const helipad = AssetManager.Get<OBJMTLAsset>('helipad')!;
        
        const helipadMesh = helipad.OBJ['Helipad'].mesh;
        const helipadMaterial = helipad.MTL[helipad.OBJ['Helipad'].material];
        helipadMaterial.Shader = cubeShader;
        helipadMaterial.ProjectsShadows = false;
        helipadMaterial.ReceiveShadows = true;

        this.AddComponents(
            new Transform(),
            new MeshRenderer({ asset: helipadMesh }),
            helipadMaterial
        );
    }
}
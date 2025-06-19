import { AssetManager, MeshRenderer, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { CubeShaderAsset } from "../assets/CubeShader";
import { OBJMTLAsset } from "../OBJMTLAsset";

export class Cube extends Entity
{
    Init(): void
    {
        const cubeShader = AssetManager.Get(CubeShaderAsset)!.Shader!;
        const cube = AssetManager.Get<OBJMTLAsset>('Cube')!;

        const cubeMesh = cube.OBJ['Cube'].mesh;
        const cubeMaterial = cube.MTL[cube.OBJ['Cube'].material];
        cubeMaterial.Shader = cubeShader;
        cubeMaterial.ReceiveShadows = false;
        cubeMaterial.ProjectsShadows = false;

        this.AddComponents(
            new Transform({ position: [0, 0, 0], scale: [5, 1, 5] }),
            new MeshRenderer({ asset: cubeMesh }),
            cubeMaterial
        );
    }
}

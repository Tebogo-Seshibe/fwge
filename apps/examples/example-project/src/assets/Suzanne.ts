import { Entity } from "@fwge/ecs";
import { OBJMTLAsset } from "../OBJMTLAsset";
import { AssetManager, Material, Mesh, MeshRenderer, Shader, ShaderAsset, Transform } from "@fwge/core";

export class Suzanne extends OBJMTLAsset {    
    get HelicopterMesh(): Mesh {
        return this.OBJ['Material.001'].mesh;
    }
    
    get HelicopterMaterial(): Material {
        return this.MTL[this.OBJ['Material.001'].material];
    }

    get Instance(): Entity {
        return new Entity()
            .AddComponent(new Transform())
            .AddChild(new Entity()
                .AddComponents(
                    new Transform(),
                    new MeshRenderer({ asset: this.HelicopterMesh }),
                    this.HelicopterMaterial
                )
            );
    }

    constructor() {
        super(
            './public/objects/suzanne/suzanne.obj',
            './public/objects/suzanne/suzanne.mtl'
        )
    }

    public async Load(protocol?: (...args: any[]) => Promise<Blob | Response>): Promise<void> {
        await super.Load(protocol);
        const shaderAsset = AssetManager.Get<ShaderAsset>('Default Shader')!
        Object.keys(this.MTL).map(materialName => {
            this.MTL[materialName].Shader = shaderAsset.Shader!;
        })
    }
}

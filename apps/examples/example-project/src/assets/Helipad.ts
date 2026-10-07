import { Entity } from "@fwge/ecs";
import { OBJMTLAsset } from "../OBJMTLAsset";
import { AssetManager, Material, Mesh, MeshRenderer, ShaderAsset, Transform } from "@fwge/core";

export class Helipad extends OBJMTLAsset {    
    get HelicopterMesh(): Mesh {
        return this.OBJ['Helicopter_'].mesh;
    }
    
    get HelicopterMaterial(): Material {
        return this.MTL[this.OBJ['Helicopter_'].material];
    }

    get GlassMesh(): Mesh {
        return this.OBJ['Glass'].mesh;
    }
    
    get GlassMaterial(): Material {
        return this.MTL[this.OBJ['Glass'].material];
    }

    get InsideMesh(): Mesh {
        return this.OBJ['Inside'].mesh;
    }
    
    get InsideMaterial(): Material {
        return this.MTL[this.OBJ['Inside'].material];
    }

    get HelipadMesh(): Mesh {
        return this.OBJ['Helipad'].mesh;
    }

    get HelipadMaterial(): Material {
        return this.MTL[this.OBJ['Helipad'].material];
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
            )
            .AddChild(new Entity()
                .AddComponent(new Transform())
                .AddComponents(
                        new Transform(),
                        new MeshRenderer({ asset: this.HelipadMesh }),
                        this.HelipadMaterial
                )
            )
            .AddChild(new Entity()
                .AddComponent(new Transform())
                .AddComponents(
                        new Transform(),
                        new MeshRenderer({ asset: this.GlassMesh }),
                        this.GlassMaterial
                )
            )
            .AddChild(new Entity()
                .AddComponent(new Transform())
                .AddComponents(
                        new Transform(),
                        new MeshRenderer({ asset: this.InsideMesh }),
                        this.InsideMaterial
                )
            );
    }

    constructor() {
        super(
            './public/objects/helipad/helipad.obj',
            './public/objects/helipad/helipad.mtl'
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

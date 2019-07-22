import Item from './Item';
import Transform, { ITransform } from './Transform';
import Updateable from './Interfaces/Updateable';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';
export declare let ParticleSystems: ParticleSystem[];
declare class IParticleSystem {
    name: string;
    mesh: Mesh;
    material: RenderMaterial;
    length: number;
    transform: Transform | ITransform;
    details: any;
}
export default class ParticleSystem extends Item implements Updateable {
    Transform: Transform;
    readonly Mesh: Mesh;
    readonly Material: RenderMaterial;
    readonly Particles: Transform[];
    constructor({ name, mesh, length, material, transform, details }?: IParticleSystem);
    Update(): void;
}
export {};

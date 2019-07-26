import Item from './Item';
import Transform from './Transform';
export let ParticleSystems = [];
class IParticleSystem {
}
export default class ParticleSystem extends Item {
    constructor({ name = 'Particle System', mesh, length = 0, material, transform, details } = new IParticleSystem) {
        super(name);
        this.Mesh = mesh;
        this.Material = material;
        this.Particles = new Array();
        if (transform instanceof Transform) {
            transform = {
                position: transform.Position,
                rotation: transform.Rotation,
                scale: transform.Scale,
                shear: transform.Shear
            };
        }
        this.Transform = new Transform(transform);
        while (--length >= 0) {
            this.Particles.push(new Transform());
        }
        ParticleSystems.push(this);
    }
    Update() {
        for (let particle of this.Particles) {
        }
    }
}
//# sourceMappingURL=ParticleSystem.js.map
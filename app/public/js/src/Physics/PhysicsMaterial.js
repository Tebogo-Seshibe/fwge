import Item from '../Item';
export class IPhysicsMaterial {
}
export default class PhysicsMaterial extends Item {
    constructor({ name = 'Physics Material' } = new IPhysicsMaterial()) {
        super(name);
    }
}
//# sourceMappingURL=PhysicsMaterial.js.map
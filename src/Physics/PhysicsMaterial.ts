import Item from '../Item';

export class IPhysicsMaterial
{
    name: string = 'Physics Material'
}

export default class PhysicsMaterial extends Item
{
    constructor({name}: IPhysicsMaterial = new IPhysicsMaterial)
    {
        super(name)
    }
}
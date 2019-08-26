import Item from '../Item';

export class IPhysicsMaterial
{
    name?: string
}

export default class PhysicsMaterial extends Item
{
    constructor()
    constructor(physicsMaterial: IPhysicsMaterial)
    constructor({ name = 'Physics Material' }: IPhysicsMaterial = new IPhysicsMaterial)
    {
        super(name)
    }
}
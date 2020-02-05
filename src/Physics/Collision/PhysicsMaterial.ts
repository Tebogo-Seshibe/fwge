import Item from '../../Logic/Object/Item';

export class IPhysicsMaterial
{
    name?: string
}

export default class ColliderMaterial extends Item
{
    constructor()
    constructor(physicsMaterial: IPhysicsMaterial)
    constructor({ name = 'Physics Material' }: IPhysicsMaterial = new IPhysicsMaterial)
    {
        super(name)
    }
}
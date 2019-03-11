import Collider, { ICollider } from './Collider';

export class IBoxCollider extends ICollider
{
    name: string = 'BoxCollider'
    height: number = 1
    width: number = 1
    breadth: number = 1
}

export default class BoxCollider extends Collider
{
    constructor({name, physicsitem, position, height, width, breadth}: IBoxCollider = new IBoxCollider)
    {
        super({name, position, physicsitem})
    }
}

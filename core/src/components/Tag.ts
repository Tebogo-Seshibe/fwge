import { SharedComponent } from '../ecs/Component'

export class Tag extends SharedComponent
{
    public readonly Name: string

    constructor()
    constructor(name: string)
    constructor(name: string = 'Default')
    {
        super()

        this.Name = name
    }
}

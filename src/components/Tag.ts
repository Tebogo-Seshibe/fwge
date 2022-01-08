import { Component } from '../ecs/Component'

export class Tag extends Component
{
    public readonly Name: string

    constructor()
    constructor(name: string)
    constructor(name: string = 'Default')
    {
        super(Tag)

        this.Name = name
    }
}

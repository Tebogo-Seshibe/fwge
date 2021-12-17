import { Component } from '../ecs/Component'

export class Tag extends Component
{
    constructor(
        public readonly name: string
    ) { super(Tag) }
}

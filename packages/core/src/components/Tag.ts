import { Component } from "@fwge/ecs";

export class Tag extends Component
{
    constructor(public readonly Name: string = 'Default')
    {
        super(Tag);
    }

    Init(): void { }
    Destroy(): void { }
}

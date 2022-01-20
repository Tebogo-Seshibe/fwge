import { Colour4 } from "../../atoms/colour"
import { Component } from "../../ecs"

export class Light extends Component
{

    constructor(readonly Colour: Colour4 = new Colour4())
    {
        super()
    }
}

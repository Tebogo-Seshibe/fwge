import { Colour4 } from "@fwge/common"
import { UniqueComponent } from "@fwge/core"

export class Light extends UniqueComponent
{
    constructor(public readonly Colour: Colour4 = new Colour4())
    {
        super(Light)
    }
}

import { Colour4 } from "../../base"
import { UniqueComponent } from "@fwge/core"

export class Light extends UniqueComponent
{

    constructor(public Colour: Colour4 = new Colour4())
    {
        super()
    }
}

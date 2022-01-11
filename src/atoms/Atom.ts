export class Atom
{
    #dirty: boolean = false

    get Dirty(): boolean
    {
        return this.#dirty
    }
}

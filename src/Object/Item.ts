let ID_COUNTER: number = 0

export const ItemNameGenerator = (function* NameGenerator(name: string, startingIndex: number)
{
    while (true)
        yield `${name} ${startingIndex++}`
})('Item', 1)

const hash = (number: number): number =>
{
    const string = number + ''
    var hash = 0

    for (let i = 0, chr = 0; i < string.length; i++)
    {
        chr = string.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
    }

    return hash
}

export default class Item
{
    public readonly ID: number

    private _name: string
    private _tag: string

    public get Name(): string
    {
        return this._name
    }

    public set Name(name: string)
    {
        this._name = name
    }

    public get Tag(): string
    {
        return this._tag
    }

    public set Tag(tag: string)
    {
        this._tag = tag
    }

    constructor()
    constructor(name: string)
    constructor(name: string, tag: string)
    constructor(name = ItemNameGenerator.next().value || '', tag: string = 'Default')
    {
        this.ID = hash(ID_COUNTER++)
        this._name = name
        this._tag = tag
    }
}
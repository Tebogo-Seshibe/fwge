import { names, tags } from "../../FWGE"

let ID_COUNTER: number = 0

export const ItemNameGenerator = (function* NameGenerator(name: string, startingIndex: number)
{
    while (true)
        yield `${name} ${startingIndex++}`
})('Item', 1)

function hash(number: number): number
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

    private name: string
    private tag: string

    public get Name(): string
    {
        return this.name
    }

    public set Name(name: string)
    {
        // names.delete(this.name)

        this.name = name

        // names.set(this.name, this)
    }

    public get Tag(): string
    {
        return this.tag
    }

    public set Tag(tag: string)
    {
        // const arr = tags.get(tag)
        // arr?.splice(arr?.indexOf(this))

        this.tag = tag
        // tags.set(this.tag, [...tags.get(tag) || [], this])
    }

    constructor()
    constructor(name: string)
    constructor(name: string, tag: string)
    constructor(name = ItemNameGenerator.next().value || '', tag?: string)
    {
        this.ID = hash(ID_COUNTER++)
        this.Name = name
        this.Tag = tag
    }
}

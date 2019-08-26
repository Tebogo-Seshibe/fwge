export default class Item
{
    public readonly ID: number
    public Name: string

    constructor(name = 'Item')
    {
        this.ID = Hashcode(ID_COUNTER++)
        this.Name = name
    }
}

let ID_COUNTER: number = 0

function Hashcode(number: number): number
{
    var i = 0
    var hash = 0
    var chr = 0
    var string = number + ''

    for (i = 0; i < string.length; i++)
    {
        chr = string.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
    }

    return hash
}
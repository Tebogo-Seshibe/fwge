/*declare global
{
    interface Function
    {
        [key: string]: string
        clone: (this: any) => Function
    }
}

Function.prototype.clone = function()
{
    let currentThis = this

    let newFunction: Function = <any>function(this: Function)
    {
        return currentThis.apply(this, arguments)
    }

    for (var key in currentThis)
    {
        if (currentThis.hasOwnProperty(key))
        {
            newFunction[key] = currentThis[key];
        }
    }

    return newFunction
}

export { }
*/
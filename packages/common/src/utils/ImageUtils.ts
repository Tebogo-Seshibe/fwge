declare global
{
    interface HTMLImageElement
    {
        buffer(): Uint8ClampedArray
    }
}

HTMLImageElement.prototype.buffer = function (this: HTMLImageElement): Uint8ClampedArray
{
    const canvas = document.createElement('canvas')
    canvas.height = this.height
    canvas.width = this.width

    const context = canvas.getContext('2d')!
    context.drawImage(this, 0, 0)

    return context.getImageData(0, 0, this.width, this.height).data
}

export { }

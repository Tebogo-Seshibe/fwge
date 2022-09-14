declare global
{
    interface HTMLImageElement
    {
        buffer(): Uint8ClampedArray
        buffer(x: number, y: number, width: number, height: number): Uint8ClampedArray
        from(buffer: ArrayBuffer): void
    }
}

HTMLImageElement.prototype.buffer = function (this: HTMLImageElement, x: number = 0, y: number = 0, width: number = this.width, height: number = this.height): Uint8ClampedArray
{
    const canvas = document.createElement('canvas')
    canvas.height = this.height
    canvas.width = this.width

    const context = canvas.getContext('2d')!
    context.drawImage(this, 0, 0, this.width, this.height)
    return context.getImageData(x, y, width, height).data
}

export { }

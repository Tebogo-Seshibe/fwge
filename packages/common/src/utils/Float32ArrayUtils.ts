declare global
{
    interface Float32Array
    {
        resize(length: number): Float32Array;
    }
}

Float32Array.prototype.resize = function (length: number): Float32Array
{
    const newFloat32Array = new Float32Array(length);
    newFloat32Array.set(this);
    return newFloat32Array;
}

export { }

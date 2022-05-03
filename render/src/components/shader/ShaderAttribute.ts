export class ShaderAttribute
{
    constructor(
        public readonly Position: number = -1,
        public readonly Colour: number = -1,
        public readonly UV: number = -1,
        public readonly Normal: number = -1
    ) { }
}

Object.setPrototypeOf(ShaderAttribute.prototype, null)

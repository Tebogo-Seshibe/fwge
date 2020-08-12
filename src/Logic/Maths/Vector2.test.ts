import { expect } from "chai"
import { Vector2 } from "."

describe('Vector2', () => {
    it('Should be a 2 element array', () => expect(new Vector2()).length(2))
    it('Should default to <0, 0>', () => expect(new Vector2()).to.eql(new Float32Array([0,0])))
})
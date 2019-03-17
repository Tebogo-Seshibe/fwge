import Vector2 from '../../../src/Maths/Vector2'
import Maths from '../../../src/Maths/Maths'

import { expect } from 'chai'
import 'mocha'

export default () => {    
    describe('Vector2', () => {
        describe('Constructor', () => {
            let vector = new Vector2(5, -7)                
            
            it('Should not be null', () => expect(vector).is.not.null)
            it('Should be set to <5, -7>', () => {
                expect(vector.X).eq(5)
                expect(vector.Y).eq(-7)
            })
            it('toString() should be "<5, -7>"', () => expect(vector.toString()).is.eq('<5, -7>'))
        })

        describe('Properties', () => {
            let zero = Maths.CleanFloat(0)
            let one = Maths.CleanFloat(1)
            let rt1_2 = Maths.CleanFloat(Math.sqrt(1/2))
            let rt_2 = Maths.CleanFloat(Math.sqrt(2))

            it(`Vector.ZERO \t\t= <0, 0>`,                  () => expect(Vector2.ZERO).is.eql(new Float32Array([zero, zero])))
            it(`Vector.ONE \t\t= <1, 1>`,                   () => expect(Vector2.ONE ).is.eql(new Float32Array([one, one])))
            it(`Vector.UNIT \t\t= <${rt1_2}, ${rt1_2}>`,    () => expect(Vector2.UNIT).is.eql(new Float32Array([rt1_2, rt1_2])))

            it(`Vector.ZERO.Length \t= ${zero}`,    () => expect(Vector2.ZERO.Length).is.eq(zero))
            it(`Vector.ONE.Length \t= ${rt_2}`,     () => expect(Vector2.ONE.Length) .is.eq(rt_2))
            it(`Vector.UNIT.Length \t= ${one}`,     () => expect(Vector2.UNIT.Length).is.eq(one))
        })
        
        describe('Methods', () => {
            let rt1_2 = Maths.CleanFloat(Math.sqrt(1/2))

            it(`Set:    <3, 2>          = <3, 2>`,      () => expect(Vector2.ONE.Set(3, 2)) .is.eql(new Float32Array([3, 2])))
            it(`Scale:  7 * <1, 1>      = <7, 7>`,      () => expect(Vector2.ONE.Scale(7))  .is.eql(new Float32Array([7, 7])))
            it(`Sum:    <1, 1> + <3, 2> = <4, 3>`,      () => expect(Vector2.ONE.Sum(3, 2)) .is.eql(new Float32Array([4, 3])))
            it(`Diff:   <1, 1> - <3, 2> = <-2, -1>`,    () => expect(Vector2.ONE.Diff(3, 2)).is.eql(new Float32Array([-2, -1])))
            it(`Mult:   <1, 1> * <3, 2> = <3, 2>`,      () => expect(Vector2.ONE.Mult(3, 2)).is.eql(new Float32Array([3, 2])))
            it(`Dot:    <1, 1> * <3, 2> = 5`,           () => expect(Vector2.ONE.Dot(3, 2)) .is.eq(5))
            it(`Unit:\t\t\t= <${rt1_2}, ${rt1_2}>`,     () => expect(Vector2.ONE.Unit())    .is.eql(new Float32Array([rt1_2, rt1_2])))
        })
    })
}
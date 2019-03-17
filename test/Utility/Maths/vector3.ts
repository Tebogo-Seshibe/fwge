import Vector3 from '../../../src/Maths/Vector3'
import Maths from '../../../src/Maths/Maths'

import { expect } from 'chai'
import 'mocha'

export default () => {    
    describe('Vector3', () => {
        describe('Constructor', () => {
            let vector = new Vector3(5, -7, 3.5)                
            
            it('Should not be null', () => expect(vector).is.not.null)
            it('Should be set to <5, -7, 3.5>', () => {
                expect(vector.X).eq(5)
                expect(vector.Y).eq(-7)
                expect(vector.Z).eq(3.5)
            })
            it('toString() should be "<5, -7, 3.5>"', () => expect(vector.toString()).is.eq('<5, -7, 3.5>'))
        })

        describe('Properties', () => {
            let zero = Maths.CleanFloat(0)
            let one = Maths.CleanFloat(1)
            let rt1_3 = Maths.CleanFloat(Math.sqrt(1/3))
            let rt_3 = Maths.CleanFloat(Math.sqrt(3))

            it(`Vector.ZERO \t\t= <0, 0, 0>`,                  () => expect(Vector3.ZERO).is.eql(new Float32Array([zero, zero, zero])))
            it(`Vector.ONE \t\t= <1, 1, 1>`,                   () => expect(Vector3.ONE ).is.eql(new Float32Array([one, one, one])))
            it(`Vector.UNIT \t\t= <${rt1_3}, ${rt1_3}>`,    () => expect(Vector3.UNIT).is.eql(new Float32Array([rt1_3, rt1_3, rt1_3])))

            it(`Vector.ZERO.Length \t= ${zero}`,    () => expect(Vector3.ZERO.Length).is.eq(zero))
            it(`Vector.ONE.Length \t= ${rt_3}`,     () => expect(Vector3.ONE.Length) .is.eq(rt_3))
            it(`Vector.UNIT.Length \t= ${one}`,     () => expect(Vector3.UNIT.Length).is.eq(one))
        })
        
        describe('Methods', () => {
            let rt1_3 = Maths.CleanFloat(Math.sqrt(1/3))

            it(`Set:    <3, 2, 4>               = <3, 2, 4>`,       () => expect(Vector3.ONE.Set(3, 2, 4))  .is.eql(new Float32Array([3, 2, 4])))
            it(`Scale:  7 * <1, 1, 1>           = <7, 7, 1>`,       () => expect(Vector3.ONE.Scale(7))      .is.eql(new Float32Array([7, 7, 7])))
            it(`Sum:    <1, 1, 1> + <3, 2, 4>   = <4, 3, 5>`,       () => expect(Vector3.ONE.Sum(3, 2, 4))  .is.eql(new Float32Array([4, 3, 5])))
            it(`Diff:   <1, 1, 1> - <3, 2, 4>   = <-2, -1, -3>`,    () => expect(Vector3.ONE.Diff(3, 2, 4)) .is.eql(new Float32Array([-2, -1, -3])))
            it(`Mult:   <1, 1, 1> * <3, 2, 4>   = <3, 2, 4>`,       () => expect(Vector3.ONE.Mult(3, 2, 4)) .is.eql(new Float32Array([3, 2, 4])))
            it(`Cross:  <1, 1, 1> * <3, 2, 4>   = <2, -1, -1>`,     () => expect(Vector3.ONE.Cross(3, 2, 4)).is.eql(new Float32Array([2, -1, -1])))
            it(`Dot:    <1, 1, 1> * <3, 2, 4>   = 9`,               () => expect(Vector3.ONE.Dot(3, 2, 4))  .is.eq(9))
            it(`Unit:\t\t\t\t= <${rt1_3}, ${rt1_3} , ${rt1_3}>`,    () => expect(Vector3.ONE.Unit())        .is.eql(new Float32Array([rt1_3, rt1_3, rt1_3])))
        })
    })
}
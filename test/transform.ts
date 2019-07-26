import Transform from '../src/Transform'
import { expect } from 'chai'
import { describe , it } from 'mocha'

export default () =>
{
    describe('Transform', () =>
    {
        describe('New Transform', () =>
        {
            let transform = new Transform()
                
            it('"Position" should be <0,0,0>', () => expect(transform.Position).is.eql(new Float32Array([0,0,0])) )
            it('"Rotation" should be <0,0,0>', () => expect(transform.Rotation).is.eql(new Float32Array([0,0,0])) )
            it('"Scale" should be <1,1,1>', () => expect(transform.Scale).is.eql(new Float32Array([1,1,1])) )
            it('"Shear" should be <0,0,0>', () => expect(transform.Shear).is.eql(new Float32Array([0,0,0])) )
        })

        describe('New Transform with parameters', () =>
        {
            let transform = new Transform(
            {
                position: [1,2,3],
                rotation: [4,5,6],
                scale: [7,8,9],
                shear: [10,11,12]
            })
                
            it('"Position" should be <1,2,3>', () => expect(transform.Position).is.eql(new Float32Array([1,2,3])) )
            it('"Rotation" should be <4,5,6>', () => expect(transform.Rotation).is.eql(new Float32Array([4,5,6])) )
            it('"Scale" should be <7,8,9>', () => expect(transform.Scale).is.eql(new Float32Array([7,8,9])) )
            it('"Shear" should be <10,11,12>', () => expect(transform.Shear).is.eql(new Float32Array([10,11,12])) )
        })
        
        describe('Static Properties', () =>
        {
            it('"UP" should be <0,1,0>', () => expect(Transform.UP).is.eql(new Float32Array([0,1,0])) )
            it('"RIGHT" should be <1,0,0>', () => expect(Transform.RIGHT).is.eql(new Float32Array([1,0,0])) )
            it('"FORWARD" should be <0,0,1>', () => expect(Transform.FORWARD).is.eql(new Float32Array([0,0,1])) )
        })
    })
}
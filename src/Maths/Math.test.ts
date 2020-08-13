import { describe } from "mocha";
import { expect } from "chai";
import { radian, clamp, randBetween, clean, isPowerOf2, lerp } from "./Math";

describe('Maths', () => {
    describe('radian', () => {
        it('Should calculate the radian of an angle', () => {
            expect(radian(90)).to.equal(Math.PI / 2)
            expect(radian(180)).to.equal(Math.PI)
            expect(radian(360)).to.equal(Math.PI * 2)
        })
    })
    
    describe('cot', () => {
        it('Should find the cotangent of an angle', () => {

        })
    })

    describe('clamp', () => {
        it('Should clamp the a value between two others', () => {
            expect(clamp( 12, 1, 10)).to.equal(10)
            expect(clamp(-12, 1, 10)).to.equal(1)
            expect(clamp(  2, 1, 10)).to.equal(2)
        })
    })

    describe('randBetween', () => {
        it('Should generate a number between 2 values', () => {
            const random = randBetween(1, 10)
            expect(random).to.be.gte(1)
            expect(random).to.be.lte(10)
        })
    })

    describe('clean', () => {
        it('Should round a number by 6 decimal places', () => {
            expect(clean(1.0000000001)).to.equal(1)
            expect(clean(1.9999999999)).to.equal(2)
            expect(clean(1.9990000000)).to.equal(1.999)
        })
    })

    describe('isPowerOf2', () => {
        it('Should determine if a number is a power of 2', () => {
            expect(isPowerOf2(1)).to.be.true
            expect(isPowerOf2(2)).to.be.true
            expect(isPowerOf2(3)).to.be.false
            expect(isPowerOf2(4)).to.be.true
        })
    })

    describe('lerp', () => {
        it('Should lerp a value from one to another', () => {
            expect(lerp(0, 10, 0.3)).to.equal(3.0)
            expect(lerp(1, 10, 0.3)).to.equal(3.7)
            expect(lerp(5, 10, 0.3)).to.equal(6.5)
        })
    })
})
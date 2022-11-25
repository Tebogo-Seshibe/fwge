/**
 * @jest-environment jsdom
 */
import { Colour4, Colour4Array } from './Colour4'
import { Colour3 } from './Colour3';

describe('Colour4', () =>
{
    describe('Colour Creation', () =>
    {
        it('Should create a new instance of a {Colour4} class', () =>
        {
            const colour = new Colour4()
            expect(colour).toBeInstanceOf(Colour4)
            expect(colour).not.toBeNull()
            expect(colour).not.toBeUndefined()
        })

        it('Should default all components to 0 when no arguments are passed', () =>
        {
            const colour = new Colour4()
            expect(colour[0]).toBe(0)
            expect(colour[1]).toBe(0)
            expect(colour[2]).toBe(0)
            expect(colour[3]).toBe(0)
        })
        

        it('Should default all components to {x} when only {x} is passed', () =>
        {
            const colour = new Colour4(0.7)
            expect(colour[0]).toBeCloseTo(0.7)
            expect(colour[1]).toBeCloseTo(0.7)
            expect(colour[2]).toBeCloseTo(0.7)
            expect(colour[3]).toBeCloseTo(0.7)
        })

        it('Should assign component-wise when another colour is passed', () =>
        {
            const other = new Colour4(0.5, 0.6, 0.7, 0.8)
            const colour = new Colour4(other)
            expect(colour[0]).toBeCloseTo(0.5)
            expect(colour[1]).toBeCloseTo(0.6)
            expect(colour[2]).toBeCloseTo(0.7)
            expect(colour[3]).toBeCloseTo(0.8)
        })

        it('Should assign component-wise when a 3-component array is passed', () =>
        {
            const other: Colour4Array = [0.5, 0.6, 0.7, 0.8]
            const colour = new Colour4(other)
            expect(colour[0]).toBeCloseTo(0.5)
            expect(colour[1]).toBeCloseTo(0.6)
            expect(colour[2]).toBeCloseTo(0.7)
            expect(colour[3]).toBeCloseTo(0.8)
        })

        it('Should assign component-wise when an array buffer is passed', () =>
        {
            const data = new Float32Array([0.1,0.2,0.3,0.4,0.5,0.6])
            const colour = new Colour4(data.buffer)
            expect(colour[0]).toBeCloseTo(0.1)
            expect(colour[1]).toBeCloseTo(0.2)
            expect(colour[2]).toBeCloseTo(0.3)
            expect(colour[3]).toBeCloseTo(0.4)
        })

        it('Should assign component-wise when an array buffer is passed with an offset', () =>
        {
            const data = new Float32Array([0.1,0.2,0.3,0.4,0.5,0.6])
            const colour = new Colour4(data.buffer, Float32Array.BYTES_PER_ELEMENT)
            expect(colour[0]).toBeCloseTo(0.2)
            expect(colour[1]).toBeCloseTo(0.3)
            expect(colour[2]).toBeCloseTo(0.4)
            expect(colour[3]).toBeCloseTo(0.5)
        })
    })
    
    describe('Local Properties', () => 
    {
        describe('R', () =>
        {
            it('Should get entry R', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.8)
                expect(colour.R).toBeCloseTo(0.1)
            })

            it('Should set entry R', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.8)
                colour.R = 0.7
                expect(colour.R).toBeCloseTo(0.7)
            })
        })
        
        describe('G', () =>
        {
            it('Should get entry G', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                expect(colour.G).toBeCloseTo(0.2)
            })

            it('Should set entry G', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                colour.G = 0.7
                expect(colour.G).toBeCloseTo(0.7)
            })
        })
        
        describe('B', () =>
        {
            it('Should get entry B', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                expect(colour.B).toBeCloseTo(0.3)
            })

            it('Should set entry B', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                colour.B = 0.7
                expect(colour.B).toBeCloseTo(0.7)
            })
        })
        
        describe('A', () =>
        {
            it('Should get entry A', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                expect(colour.A).toBeCloseTo(0.4)
            })

            it('Should set entry A', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                colour.A = 0.7
                expect(colour.A).toBeCloseTo(0.7)
            })
        })
        
        describe('RGB', () =>
        {
            it('Should create a new Colour4 with the values from the current colour-', () =>
            {
                const other = new Colour4(0.1, 0.2, 0.3, 0.4)
                const colour = other.RGB
                expect(colour).toBeInstanceOf(Colour3)
                expect(colour[0]).toBeCloseTo(0.1)
                expect(colour[1]).toBeCloseTo(0.2)
                expect(colour[2]).toBeCloseTo(0.3)
            })
        })
    })
    

    describe('Local Methods', () =>
    {
        describe('Set', () => 
        {        
            it('Should set all components when all an argument is passed', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                colour.Set(0.7)
                expect(colour[0]).toBeCloseTo(0.7)
                expect(colour[1]).toBeCloseTo(0.7)
                expect(colour[2]).toBeCloseTo(0.7)
                expect(colour[3]).toBeCloseTo(0.7)
            })

            it('Should set all components when all arguments are passed', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                colour.Set(0.5, 0.6, 0.7, 0.8)
                expect(colour[0]).toBeCloseTo(0.5)
                expect(colour[1]).toBeCloseTo(0.6)
                expect(colour[2]).toBeCloseTo(0.7)
                expect(colour[3]).toBeCloseTo(0.8)
            })

            it('Should set all entries component-wise when another matrix is passed', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                const other = new Colour4(0.5, 0.6, 0.7, 0.8)
                colour.Set(other)
                expect(colour[0]).toBeCloseTo(0.5)
                expect(colour[1]).toBeCloseTo(0.6)
                expect(colour[2]).toBeCloseTo(0.7)
                expect(colour[3]).toBeCloseTo(0.8)
            })

            it('Should set all entries component-wise when a 4-component array is passed', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                const other: Colour4Array = [0.5, 0.6, 0.7, 0.8]
                colour.Set(other)
                expect(colour[0]).toBeCloseTo(0.5)
                expect(colour[1]).toBeCloseTo(0.6)
                expect(colour[2]).toBeCloseTo(0.7)
                expect(colour[3]).toBeCloseTo(0.8)
            })
        })

        describe('Clone', () => 
        {        
            it('Should create a new colour with the same values as the source', () =>
            {
                const colour = new Colour4(0.1, 0.2, 0.3, 0.4)
                const clone = colour.Clone()
                expect(clone[0]).toBe(colour[0])
                expect(clone[1]).toBe(colour[1])
                expect(clone[2]).toBe(colour[2])
                expect(clone[3]).toBe(colour[3])
            })
        })

        describe('Equals', () => 
        {        
            it('Should succeed when two matrices have the same values', () =>
            {
                const matrix = new Colour4(0.1, 0.2, 0.3, 0.4)
                const other = new Colour4(0.1, 0.2, 0.3, 0.4)
                const equals = matrix.Equals(other)
                expect(equals).toBeTruthy()
            })

            it('Should succeed not when two matrices have the different values', () =>
            {
                const matrix = new Colour4(0.1, 0.2, 0.3, 0.4)
                const other = new Colour4(0.1, 0.2, 0.3, 0.5)
                const equals = matrix.Equals(other)
                expect(equals).toBeFalsy()
            })
        })
    })
})

import { Colour3, type Colour3Array } from './Colour3';
import { Colour4 } from './Colour4';
import { describe, it, expect } from 'vitest';

describe('Colour3', () =>
{
    describe('Colour Creation', () =>
    {
        it('Should create a new instance of a {Colour3} class', () =>
        {
            const colour = new Colour3();
            expect(colour).toBeInstanceOf(Colour3);
            expect(colour).not.toBeNull();
            expect(colour).not.toBeUndefined();
        });

        it('Should default all components to 0 when no arguments are passed', () =>
        {
            const colour = new Colour3();
            expect(colour[0]).toBe(0);
            expect(colour[1]).toBe(0);
            expect(colour[2]).toBe(0);
        });

        it('Should assign component-wise when values are passed', () =>
        {
            const colour = new Colour3(0.5, 0.6, 0.7);
            expect(colour[0]).toBeCloseTo(0.5);
            expect(colour[1]).toBeCloseTo(0.6);
            expect(colour[2]).toBeCloseTo(0.7);
        });

        it('Should assign component-wise when another colour is passed', () =>
        {
            const other = new Colour3(0.5, 0.6, 0.7);
            const colour = new Colour3(other);
            expect(colour[0]).toBeCloseTo(0.5);
            expect(colour[1]).toBeCloseTo(0.6);
            expect(colour[2]).toBeCloseTo(0.7);
        });

        it('Should assign component-wise when a 3-component array is passed', () =>
        {
            const other: Colour3Array = [0.5, 0.6, 0.7];
            const colour = new Colour3(other);
            expect(colour[0]).toBeCloseTo(0.5);
            expect(colour[1]).toBeCloseTo(0.6);
            expect(colour[2]).toBeCloseTo(0.7);
        });

        it('Should assign component-wise when an array buffer is passed', () =>
        {
            const data = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
            const colour = new Colour3(data.buffer);
            expect(colour[0]).toBeCloseTo(0.1);
            expect(colour[1]).toBeCloseTo(0.2);
            expect(colour[2]).toBeCloseTo(0.3);
        });

        it('Should assign component-wise when an array buffer is passed with an offset', () =>
        {
            const data = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
            const colour = new Colour3(data.buffer, Float32Array.BYTES_PER_ELEMENT);
            expect(colour[0]).toBeCloseTo(0.2);
            expect(colour[1]).toBeCloseTo(0.3);
            expect(colour[2]).toBeCloseTo(0.4);
        });
    });

    describe('Local Properties', () => 
    {
        describe('R', () =>
        {
            it('Should get entry R', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                expect(colour.R).toBeCloseTo(0.1);
            });

            it('Should set entry R', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                colour.R = 0.7;
                expect(colour.R).toBeCloseTo(0.7);
            });
        });

        describe('G', () =>
        {
            it('Should get entry G', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                expect(colour.G).toBeCloseTo(0.2);
            });

            it('Should set entry G', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                colour.G = 0.7;
                expect(colour.G).toBeCloseTo(0.7);
            });
        });

        describe('B', () =>
        {
            it('Should get entry B', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                expect(colour.B).toBeCloseTo(0.3);
            });

            it('Should set entry B', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                colour.B = 0.7;
                expect(colour.B).toBeCloseTo(0.7);
            });
        });

        describe('RGBA', () =>
        {
            it('Should create a new Colour4 with the values from the current colour', () =>
            {
                const other = new Colour3(0.1, 0.2, 0.3);
                const colour = other.RGBA;
                expect(colour).toBeInstanceOf(Colour4);
                expect(colour[0]).toBeCloseTo(0.1);
                expect(colour[1]).toBeCloseTo(0.2);
                expect(colour[2]).toBeCloseTo(0.3);
                expect(colour[3]).toBe(1);
            });
        });
    });


    describe('Instance Methods', () =>
    {
        describe('Set', () => 
        {
            it('Should set all components when all arguments are passed', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                colour.Set(0.5, 0.6, 0.7);
                expect(colour[0]).toBeCloseTo(0.5);
                expect(colour[1]).toBeCloseTo(0.6);
                expect(colour[2]).toBeCloseTo(0.7);
            });

            it('Should set all entries component-wise when another matrix is passed', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                const other = new Colour3(0.5, 0.6, 0.7);
                colour.Set(other);
                expect(colour[0]).toBeCloseTo(0.5);
                expect(colour[1]).toBeCloseTo(0.6);
                expect(colour[2]).toBeCloseTo(0.7);
            });

            it('Should set all entries component-wise when a 4-component array is passed', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                const other: Colour3Array = [0.5, 0.6, 0.7];
                colour.Set(other);
                expect(colour[0]).toBeCloseTo(0.5);
                expect(colour[1]).toBeCloseTo(0.6);
                expect(colour[2]).toBeCloseTo(0.7);
            });
        });

        describe('Clone', () => 
        {
            it('Should create a new colour with the same values as the source', () =>
            {
                const colour = new Colour3(0.1, 0.2, 0.3);
                const clone = colour.Clone();
                expect(clone[0]).toBe(colour[0]);
                expect(clone[1]).toBe(colour[1]);
                expect(clone[2]).toBe(colour[2]);
                expect(clone[3]).toBe(colour[3]);
            });
        });

        describe('Equals', () => 
        {
            it('Should succeed when two colours have the same values', () =>
            {
                const matrix = new Colour3(0.1, 0.2, 0.3);
                const other = new Colour3(0.1, 0.2, 0.3);
                const equals = matrix.Equals(other);
                expect(equals).toBeTruthy();
            });

            it('Should fail when two colours have different values', () =>
            {
                const matrix = new Colour3(0.1, 0.2, 0.3);
                const other = new Colour3(0.1, 0.2, 0.4);
                const equals = matrix.Equals(other);
                expect(equals).toBeFalsy();
            });
        });
    });
});

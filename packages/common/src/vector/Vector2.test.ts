/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "vitest";
import { root_2 } from "../constants";
import { Vector2, Vector2Array } from "./Vector2";

describe('Vector2', () =>
{
    describe('Vector Creation', () =>
    {
        it('Should default all component to 0 when no arguments are passed', () =>
        {
            const vector = new Vector2();
            expect(vector[0]).toBe(0);
            expect(vector[1]).toBe(0);
        });
    
        it('Should assigne componens when number arguments are passed', () =>
        {
            const vector = new Vector2(1, 2);
            expect(vector[0]).toBe(1);
            expect(vector[1]).toBe(2);
        });
    
        it('Should assigne componens when number arguments are passed', () =>
        {
            const other = new Vector2(1, 2);
            const vector = new Vector2(other);
            expect(vector[0]).toBe(1);
            expect(vector[1]).toBe(2);
        });
    
        it('Should assigne componens when number arguments are passed', () =>
        {
            const other: Vector2Array = [1, 2];
            const vector = new Vector2(other);
            expect(vector[0]).toBe(1);
            expect(vector[1]).toBe(2);
        });
    
        it('Should assigne componens when number arguments are passed', () =>
        {
            const data = new Float32Array([1, 2, 3, 4]);
            const vector = new Vector2(data.buffer);
            expect(vector[0]).toBe(1);
            expect(vector[1]).toBe(2);
        });
    
        it('Should assigne componens when number arguments are passed', () =>
        {
            const data = new Float32Array([1, 2, 3, 4]);
            const vector = new Vector2(data.buffer, Float32Array.BYTES_PER_ELEMENT);
            expect(vector[0]).toBe(2);
            expect(vector[1]).toBe(3);
        });
    });

    describe('Local Properties', () =>
    {    
        describe('X', () =>
        {
            it('Should get entry X', () =>
            {
                const vector = new Vector2(1, 2);
                expect(vector.X).toBe(1);
                expect(vector[0]).toBe(1);
            });

            it('Should set entry X', () =>
            {
                const vector = new Vector2(1, 2);
                vector.X = 3;
                expect(vector.X).toBe(3);
                expect(vector[0]).toBe(3);
            });
        });

        describe('Y', () =>
        {
            it('Should get entry Y', () =>
            {
                const vector = new Vector2(1, 2);
                expect(vector.Y).toBe(2);
                expect(vector[1]).toBe(2);
            });

            it('Should set entry Y', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Y = 4;
                expect(vector.Y).toBe(4);
                expect(vector[1]).toBe(4);
            });
        });

        describe('Length', () =>
        {
            it('Should get the length of a Vector', () =>
            {
                const vector = new Vector2(3, 4);
                expect(vector.Length).toBe(5);
            });
        });

        describe('LengthSquared', () =>
        {
            it('Should get the length squared of a Vector', () =>
            {
                const vector = new Vector2(3, 4);
                expect(vector.LengthSquared).toBe(25);
            });
        });

        describe('YX', () =>
        {
            it('Should create a new Vector2 with the X and Y components swapped', () =>
            {
                const other = new Vector2(3, 4);
                const vector = other.YX;
                expect(vector[0]).toBe(4);
                expect(vector[1]).toBe(3);
            });
        });
    });

    describe('Local Methods', () =>
    {
        describe('Set', () =>
        {
            it('Should set all component when number arguments are provided', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Set(3, 4);
                expect(vector[0]).toBe(3)
                expect(vector[1]).toBe(4)
            });
            
            it('Should set all component when number arguments are provided', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(3, 4);
                vector.Set(other)
                expect(vector[0]).toBe(3)
                expect(vector[1]).toBe(4)
            });

            it('Should set all component when number arguments are provided', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [3, 4];
                vector.Set(other)
                expect(vector[0]).toBe(3)
                expect(vector[1]).toBe(4)
            });
        });
        
        describe('Negate', () =>
        {
            it('Should negate the component of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Negate();
                expect(vector[0]).toBe(-1)
                expect(vector[1]).toBe(-2)
                vector.Negate();
                expect(vector[0]).toBe(1)
                expect(vector[1]).toBe(2)
            });
        });
        
        describe('Add', () =>
        {
            it('Should add to the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Add(3, 4);
                expect(vector[0]).toBe(4);
                expect(vector[1]).toBe(6);
            });
            
            it('Should add to the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(3, 4);
                vector.Add(other);
                expect(vector[0]).toBe(4);
                expect(vector[1]).toBe(6);
            });
            
            it('Should add to the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [3, 4];
                vector.Add(other);
                expect(vector[0]).toBe(4);
                expect(vector[1]).toBe(6);
            });
        });
        
        describe('Subtract', () =>
        {
            it('Should subtract from the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Subtract(3, 4);
                expect(vector[0]).toBe(-2);
                expect(vector[1]).toBe(-2);
            });
            
            it('Should subtract from the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(3, 4);
                vector.Subtract(other);
                expect(vector[0]).toBe(-2);
                expect(vector[1]).toBe(-2);
            });
            
            it('Should subtract from the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [3, 4];
                vector.Subtract(other);
                expect(vector[0]).toBe(-2);
                expect(vector[1]).toBe(-2);
            });
        });
        
        describe('Multiply', () =>
        {
            it('Should multiply with the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Multiply(3, 4);
                expect(vector[0]).toBe(3);
                expect(vector[1]).toBe(8);
            });
            
            it('Should multiply with the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(3, 4);
                vector.Multiply(other);
                expect(vector[0]).toBe(3);
                expect(vector[1]).toBe(8);
            });
            
            it('Should multiply with the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [3, 4];
                vector.Multiply(other);
                expect(vector[0]).toBe(3);
                expect(vector[1]).toBe(8);
            });
        });
        
        describe('Divide', () =>
        {
            it('Should divide against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Divide(3, 4);
                expect(vector[0]).toBeCloseTo(1/3);
                expect(vector[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(3, 4);
                vector.Divide(other);
                expect(vector[0]).toBeCloseTo(1/3);
                expect(vector[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [3, 4];
                vector.Divide(other);
                expect(vector[0]).toBeCloseTo(1/3);
                expect(vector[1]).toBeCloseTo(0.5);
            });
        });

        describe('Scale', () =>
        {
            it('Should scale the values of the Vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Scale(5);
                expect(vector[0]).toBe(5);
                expect(vector[1]).toBe(10);
            });
        });
        
        describe('Dot', () =>
        {
            it('Should compute the dot product against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const product = vector.Dot(3, 4);
                expect(product).toBe(11);
            });
            
            it('Should compute the dot product against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(3, 4);
                const product = vector.Dot(other);
                expect(product).toBe(11);
            });
            
            it('Should compute the dot product against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [3, 4];
                const product = vector.Dot(other);
                expect(product).toBe(11);
            });
        });
        
        describe('Rotate', () =>
        {
            it('Should rotate the vector', () =>
            {
                const vector = new Vector2(1, 2);
                vector.Rotate(90);
                expect(vector[0]).toBeCloseTo(-2);
                expect(vector[1]).toBeCloseTo(1);
                vector.Rotate(-45);
                expect(vector[0]).toBeCloseTo(-1/Math.sqrt(2));
                expect(vector[1]).toBeCloseTo(3/Math.sqrt(2));
            });
        });
        
        describe('Distance', () =>
        {
            it('Should compute the distance against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const distance = vector.Distance(4, 6);
                expect(distance).toBe(5);
            });
            
            it('Should compute the distance against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(4, 6);
                const distance = vector.Distance(other);
                expect(distance).toBe(5);
            });
            
            it('Should compute the distance against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [4, 6];
                const distance = vector.Distance(other);
                expect(distance).toBe(5);
            });
        });
        
        describe('DistanceSquared', () =>
        {
            it('Should compute the distance squared against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const distance = vector.DistanceSquared(4, 6);
                expect(distance).toBe(25);
            });
            
            it('Should compute the distance squared against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other = new Vector2(4, 6);
                const distance = vector.DistanceSquared(other);
                expect(distance).toBe(25);
            });
            
            it('Should compute the distance squared against the components of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const other: Vector2Array = [4, 6];
                const distance = vector.DistanceSquared(other);
                expect(distance).toBe(25);
            });
        });

        describe('Normalize', () =>
        {
            it('Should normalize to be a unit vector when the vector has a valid length', () =>
            {
                const vector = new Vector2(3, 4);
                vector.Normalize();
                expect(vector[0]).toBeCloseTo(3/5);
                expect(vector[1]).toBeCloseTo(4/5);
            });
            
            it('Should not normalize to be a unit vector when the vector has an invalid length', () =>
            {
                const vector = new Vector2(0, 0);
                vector.Normalize();
                expect(vector[0]).toBeCloseTo(0);
                expect(vector[1]).toBeCloseTo(0);
            });
        });

        describe('Clone', () =>
        {
            it('Should create a new vector with the same values as the source', () =>
            {
                const vector = new Vector2(3, 4);
                const clone = vector.Clone();
                expect(clone).not.toBe(vector)
                expect(clone[0]).toBe(vector[0]);
                expect(clone[1]).toBe(vector[1]);
            });
        });

        describe('Equals', () =>
        {
            it('Should test whether two vectors have the same values', () =>
            {
                const vector = new Vector2(1, 2);
                const right = vector.Equals(new Vector2(1, 2));
                const wrong = vector.Equals(new Vector2(3, 4));
                expect(right).toBeTruthy();
                expect(wrong).toBeFalsy();
            });
        });
    });

    describe('Static Properties', () =>
    {
        it('Zero', () =>
        {
            const vector = Vector2.Zero;
            expect(vector[0]).toBe(0)
            expect(vector[1]).toBe(0)
        });
        
        it('One', () =>
        {
            const vector = Vector2.One;
            expect(vector[0]).toBe(1)
            expect(vector[1]).toBe(1)
        });
        
        it('Unit', () =>
        {
            const vector = Vector2.Unit;
            expect(vector[0]).toBeCloseTo(root_2)
            expect(vector[1]).toBeCloseTo(root_2)
        });
        
        it('UnitX', () =>
        {
            const vector = Vector2.UnitX;
            expect(vector[0]).toBe(1)
            expect(vector[1]).toBe(0)
        });
        
        it('UnitY', () =>
        {
            const vector = Vector2.UnitY;
            expect(vector[0]).toBe(0)
            expect(vector[1]).toBe(1)
        });
    });

    describe('Static Methods', () =>
    {
        describe('Negate', () =>
        {
            it('Should negate the component of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const out = Vector2.Negate(vector);
                Vector2.Negate(vector, out);
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
                expect(out[0]).toBe(-1);
                expect(out[1]).toBe(-2);
            });
            
            it('Should negate the component of the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const out = new Vector2();
                Vector2.Negate(vector, out);
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
                expect(out[0]).toBe(-1);
                expect(out[1]).toBe(-2);
            });
        });
        
        describe('Add', () =>
        {
            it('Should add to the components of the vector', () =>
            {
                const out = Vector2.Add(
                    1, 2,
                    3, 4
                );
                expect(out[0]).toBe(4);
                expect(out[1]).toBe(6);
            });

            it('Should add to the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Add(
                    1, 2,
                    3, 4,
                    out
                );
                expect(out[0]).toBe(4);
                expect(out[1]).toBe(6);
            });
            
            it('Should add to the components of the vector', () =>
            {
                const out = Vector2.Add(
                    new Vector2(1, 2),
                    new Vector2(3, 4)
                );
                expect(out[0]).toBe(4);
                expect(out[1]).toBe(6);
            });

            it('Should add to the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Add(
                    new Vector2(1, 2),
                    new Vector2(3, 4),
                    out
                );
                expect(out[0]).toBe(4);
                expect(out[1]).toBe(6);
            });
            
            it('Should add to the components of the vector', () =>
            {
                const out = Vector2.Add(
                    [1, 2],
                    [3, 4]
                );
                expect(out[0]).toBe(4);
                expect(out[1]).toBe(6);
            });

            it('Should add to the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Add(
                    [1, 2],
                    [3, 4],
                    out
                );
                expect(out[0]).toBe(4);
                expect(out[1]).toBe(6);
            });
        });
        
        describe('Subtract', () =>
        {
            it('Should subtract from the components of the vector', () =>
            {
                const out = Vector2.Subtract(
                    1, 2,
                    3, 4
                );
                expect(out[0]).toBe(-2);
                expect(out[1]).toBe(-2);
            });

            it('Should subtract from the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Subtract(
                    1, 2,
                    3, 4,
                    out
                );
                expect(out[0]).toBe(-2);
                expect(out[1]).toBe(-2);
            });
            
            it('Should subtract from the components of the vector', () =>
            {
                const out = Vector2.Subtract(
                    new Vector2(1, 2),
                    new Vector2(3, 4)
                );
                expect(out[0]).toBe(-2);
                expect(out[1]).toBe(-2);
            });
            
            it('Should subtract from the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Subtract(
                    new Vector2(1, 2),
                    new Vector2(3, 4),
                    out
                );
                expect(out[0]).toBe(-2);
                expect(out[1]).toBe(-2);
            });
            
            it('Should subtract from the components of the vector', () =>
            {
                const out = Vector2.Subtract(
                    [1, 2],
                    [3, 4]
                );
                expect(out[0]).toBe(-2);
                expect(out[1]).toBe(-2);
            });
            
            it('Should subtract from the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Subtract(
                    [1, 2],
                    [3, 4],
                    out
                );
                expect(out[0]).toBe(-2);
                expect(out[1]).toBe(-2);
            });
        });
        
        describe('Multiply', () =>
        {
            it('Should multiply with the components of the vector', () =>
            {
                const out = Vector2.Multiply(
                    1, 2,
                    3, 4
                );
                expect(out[0]).toBe(3);
                expect(out[1]).toBe(8);
            });

            it('Should multiply with the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Multiply(
                    1, 2,
                    3, 4,
                    out
                );
                expect(out[0]).toBe(3);
                expect(out[1]).toBe(8);
            });
            
            it('Should multiply with the components of the vector', () =>
            {
                const out = Vector2.Multiply(
                    new Vector2(1, 2),
                    new Vector2(3, 4)
                );
                expect(out[0]).toBe(3);
                expect(out[1]).toBe(8);
            });
            
            it('Should multiply with the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Multiply(
                    new Vector2(1, 2),
                    new Vector2(3, 4),
                    out
                );
                expect(out[0]).toBe(3);
                expect(out[1]).toBe(8);
            });
            
            it('Should multiply with the components of the vector', () =>
            {
                const out = Vector2.Multiply(
                    [1, 2],
                    [3, 4]
                );
                expect(out[0]).toBe(3);
                expect(out[1]).toBe(8);
            });
            
            it('Should multiply with the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Multiply(
                    [1, 2],
                    [3, 4],
                    out
                );
                expect(out[0]).toBe(3);
                expect(out[1]).toBe(8);
            });
        });
        
        describe('Divide', () =>
        {
            it('Should divide against the components of the vector', () =>
            {
                const out = Vector2.Divide(
                    1, 2,
                    3, 4
                );
                expect(out[0]).toBeCloseTo(1/3);
                expect(out[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Divide(
                    1, 2,
                    3, 4,
                    out
                );
                expect(out[0]).toBeCloseTo(1/3);
                expect(out[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const out = Vector2.Divide(
                    new Vector2(1, 2),
                    new Vector2(3, 4)
                );
                expect(out[0]).toBeCloseTo(1/3);
                expect(out[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Divide(
                    new Vector2(1, 2),
                    new Vector2(3, 4),
                    out
                );
                expect(out[0]).toBeCloseTo(1/3);
                expect(out[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const out = Vector2.Divide(
                    [1, 2],
                    [3, 4],
                );
                expect(out[0]).toBeCloseTo(1/3);
                expect(out[1]).toBeCloseTo(0.5);
            });
            
            it('Should divide against the components of the vector', () =>
            {
                const out = new Vector2();
                Vector2.Divide(
                    [1, 2],
                    [3, 4],
                    out
                );
                expect(out[0]).toBeCloseTo(1/3);
                expect(out[1]).toBeCloseTo(0.5);
            });
        });

        describe('Scale', () =>
        {
            it('Should scale the values of the Vector', () =>
            {
                const vector = new Vector2(1, 2);
                const out = Vector2.Scale(vector, 5);
                expect(out[0]).toBe(5);
                expect(out[1]).toBe(10);
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
            });
            
            it('Should scale the values of the Vector', () =>
            {
                const vector = new Vector2(1, 2);
                const out = new Vector2();
                Vector2.Scale(vector, 5, out);
                expect(out[0]).toBe(5);
                expect(out[1]).toBe(10);
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
            });
        });
        
        describe('Dot', () =>
        {
            it('Should compute the dot product against the components of the vector', () =>
            {
                const out = Vector2.Dot(
                    1, 2,
                    3, 4
                );
                expect(out).toBe(11);
            });
            
            it('Should compute the dot product against the components of the vector', () =>
            {
                const out = Vector2.Dot(
                    new Vector2(1, 2),
                    new Vector2(3, 4)
                );
                expect(out).toBe(11);
            });
            
            it('Should compute the dot product against the components of the vector', () =>
            {
                const out = Vector2.Dot(
                    [1, 2],
                    [3, 4]
                );
                expect(out).toBe(11);
            });
        });
        
        describe('Rotate', () =>
        {
            it('Should rotate the vector', () =>
            {
                const vector = new Vector2(1, 2);
                const outA = Vector2.Rotate(vector, 90);
                expect(outA[0]).toBeCloseTo(-2);
                expect(outA[1]).toBeCloseTo(1);
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
                const outB = Vector2.Rotate(vector, 45);
                expect(outB[0]).toBeCloseTo(-1/Math.sqrt(2));
                expect(outB[1]).toBeCloseTo(3/Math.sqrt(2));
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
            });
            
            it('Should rotate the vector', () =>
            {
                const out = new Vector2();
                const vector = new Vector2(1, 2);
                Vector2.Rotate(vector, 90, out);
                expect(out[0]).toBeCloseTo(-2);
                expect(out[1]).toBeCloseTo(1);
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
                Vector2.Rotate(vector, 45, out);
                expect(out[0]).toBeCloseTo(-1/Math.sqrt(2));
                expect(out[1]).toBeCloseTo(3/Math.sqrt(2));
                expect(vector[0]).toBe(1);
                expect(vector[1]).toBe(2);
            });
        });
        
        describe('Distance', () =>
        {
            it('Should compute the distance against the components of the vector', () =>
            {
                const out = Vector2.Distance(
                    1, 2,
                    4, 6
                );
                expect(out).toBe(5);
            });
            
            it('Should compute the distance against the components of the vector', () =>
            {
                const out = Vector2.Distance(
                    new Vector2(1, 2),
                    new Vector2(4, 6)
                );
                expect(out).toBe(5);
            });
            
            it('Should compute the distance against the components of the vector', () =>
            {
                const out = Vector2.Distance(
                    [1, 2],
                    [4, 6]
                );
                expect(out).toBe(5);
            });
        });
        
        describe('DistanceSquared', () =>
        {
            it('Should compute the distance squared against the components of the vector', () =>
            {
                const distance = Vector2.DistanceSquared(
                    1, 2,
                    4, 6
                );
                expect(distance).toBe(25);
            });
            
            it('Should compute the distance squared against the components of the vector', () =>
            {
                const distance = Vector2.DistanceSquared(
                    new Vector2(1, 2),
                    new Vector2(4, 6)
                );
                expect(distance).toBe(25);
            });
            
            it('Should compute the distance squared against the components of the vector', () =>
            {
                const distance = Vector2.DistanceSquared(
                    [1, 2],
                    [4, 6]
                );
                expect(distance).toBe(25);
            });
        });

        describe('Normalize', () =>
        {
            it('Should normalize to be a unit vector when the vector has a valid length', () =>
            {
                const vector = new Vector2(3, 4);
                const out = Vector2.Normalize(vector);
                expect(out[0]).toBeCloseTo(3/5);
                expect(out[1]).toBeCloseTo(4/5);
                expect(vector[0]).toBeCloseTo(3);
                expect(vector[1]).toBeCloseTo(4);
            });
            
            it('Should normalize to be a unit vector when the vector has a valid length', () =>
            {
                const vector = new Vector2(3, 4);
                const out = new Vector2();
                Vector2.Normalize(vector, out);
                expect(out[0]).toBeCloseTo(3/5);
                expect(out[1]).toBeCloseTo(4/5);
                expect(vector[0]).toBeCloseTo(3);
                expect(vector[1]).toBeCloseTo(4);
            });
            
            it('Should not normalize to be a unit vector when the vector has an invalid length', () =>
            {
                const vector = new Vector2(0, 0);
                const out = Vector2.Normalize(vector);
                expect(out[0]).toBeCloseTo(0);
                expect(out[1]).toBeCloseTo(0);
                expect(vector[0]).toBeCloseTo(0);
                expect(vector[1]).toBeCloseTo(0);
            });
            
            it('Should not normalize to be a unit vector when the vector has an invalid length', () =>
            {
                const vector = new Vector2(0, 0);
                const out = new Vector2();
                Vector2.Normalize(vector, out);
                expect(out[0]).toBeCloseTo(0);
                expect(out[1]).toBeCloseTo(0);
                expect(vector[0]).toBeCloseTo(0);
                expect(vector[1]).toBeCloseTo(0);
            });
        });
    });    
});

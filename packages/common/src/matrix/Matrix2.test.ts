// @vitest-environment jsdom
import { radian } from "../utils";
import { Vector2, Vector2Array } from "../vector";
import { Matrix2, Matrix2Array } from "./Matrix2";
import { describe, it, expect } from 'vitest';

describe('Matrix2', () =>
{
    describe('Matrix Creation', () => 
    {
        it('Should default all components to 0 when no arguments are passed', () =>
        {
            const matrix = new Matrix2();
            expect(matrix[0]).toBe(0);
            expect(matrix[1]).toBe(0);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(0);
        });

        it('Should assign diagonal component when an integer argument is passed', () =>
        {
            const matrix = new Matrix2(7);
            expect(matrix[0]).toBe(7);
            expect(matrix[1]).toBe(0);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(7);
        });

        it('Should assign component when integer arguments are passed', () =>
        {
            const matrix = new Matrix2(
                1, 2,
                3, 4
            );
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
        });

        it('Should assign component-wise when another matrix is passed', () =>
        {
            const other = new Matrix2(
                5, 6,
                7, 8
            );
            const matrix = new Matrix2(other);
            expect(matrix[0]).toBe(5);
            expect(matrix[1]).toBe(6);
            expect(matrix[2]).toBe(7);
            expect(matrix[3]).toBe(8);
        });

        it('Should assign component-wise when a 4-component array is passed', () =>
        {
            const other: Matrix2Array = [
                5, 6,
                7, 8
            ];
            const matrix = new Matrix2(other);
            expect(matrix[0]).toBe(5);
            expect(matrix[1]).toBe(6);
            expect(matrix[2]).toBe(7);
            expect(matrix[3]).toBe(8);
        });

        it('Should assign component-wise when an array buffer is passed', () =>
        {
            const data = new Float32Array([1, 2, 3, 4, 5, 6]);
            const matrix = new Matrix2(data.buffer);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
        });

        it('Should assign component-wise when an array buffer is passed with an offset', () =>
        {
            const data = new Float32Array([1, 2, 3, 4, 5, 6]);
            const matrix = new Matrix2(data.buffer, Float32Array.BYTES_PER_ELEMENT);
            expect(matrix[0]).toBe(2);
            expect(matrix[1]).toBe(3);
            expect(matrix[2]).toBe(4);
            expect(matrix[3]).toBe(5);
        });
    });

    describe('Local Properties', () => 
    {
        describe('M11', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                expect(matrix.M11).toBe(1);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.M11 = 7;
                expect(matrix.M11).toBe(7);
            });
        });

        describe('M12', () =>
        {
            it('Should get entry a12', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                expect(matrix.M12).toBe(2);
            });

            it('Should set entry a12', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.M12 = 7;
                expect(matrix.M12).toBe(7);
            });
        });

        describe('M21', () =>
        {
            it('Should get entry a21', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                expect(matrix.M21).toBe(3);
            });

            it('Should set entry a21', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.M21 = 7;
                expect(matrix.M21).toBe(7);
            });
        });

        describe('M22', () =>
        {
            it('Should get entry a22', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                expect(matrix.M22).toBe(4);
            });

            it('Should set entry a22', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.M22 = 7;
                expect(matrix.M22).toBe(7);
            });
        });

        describe('Determinant', () =>
        {
            it('Should calculate the determinant of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                expect(matrix.Determinant).toBe(-2);
            });
        });

        describe('Column1', () =>
        {
            it('Should get column 1 of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const column = matrix.Column1;
                expect(column).toBeInstanceOf(Vector2);
                expect(column[0]).toBe(1);
                expect(column[1]).toBe(3);
            });
        });

        describe('Column2', () =>
        {
            it('Should get column 2 of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const column = matrix.Column2;
                expect(column).toBeInstanceOf(Vector2);
                expect(column[0]).toBe(2);
                expect(column[1]).toBe(4);
            });
        });

        describe('Row1', () =>
        {
            it('Should get row 1 of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const row = matrix.Row1;
                expect(row).toBeInstanceOf(Vector2);
                expect(row[0]).toBe(1);
                expect(row[1]).toBe(2);
            });
        });

        describe('Row2', () =>
        {
            it('Should get row 2 of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const row = matrix.Row2;
                expect(row).toBeInstanceOf(Vector2);
                expect(row[0]).toBe(3);
                expect(row[1]).toBe(4);
            });
        });

        describe('Diagonal', () =>
        {
            it('Should get the diagonal of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const diag = matrix.Diagonal;
                expect(diag).toBeInstanceOf(Vector2);
                expect(diag[0]).toBe(1);
                expect(diag[1]).toBe(4);
            });
        });

        describe('Trace', () =>
        {
            it('Should calculate the trace of the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                expect(matrix.Trace).toBe(5);
            });
        });
    });

    describe('Local Methods', () =>
    {
        describe('Set', () => 
        {
            it('Should set all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Set(
                    5, 6,
                    7, 8
                );
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(6);
                expect(matrix[2]).toBe(7);
                expect(matrix[3]).toBe(8);
            });

            it('Should set all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other = new Matrix2(
                    5, 6,
                    7, 8
                );
                matrix.Set(other);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(6);
                expect(matrix[2]).toBe(7);
                expect(matrix[3]).toBe(8);
            });

            it('Should set all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                matrix.Set(other);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(6);
                expect(matrix[2]).toBe(7);
                expect(matrix[3]).toBe(8);
            });
        });

        describe('Add', () => 
        {
            it('Should add all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Add(
                    5, 6,
                    7, 8
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should add all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other = new Matrix2(
                    5, 6,
                    7, 8
                );
                matrix.Add(other);
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should add all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                matrix.Add(other);
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });
        });

        describe('Subtract', () => 
        {
            it('Should subtract all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Subtract(
                    5, 6,
                    7, 8
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should subtract all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other = new Matrix2(
                    5, 6,
                    7, 8
                );
                matrix.Subtract(other);
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should subtract all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                matrix.Subtract(other);
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });
        });

        describe('Multiply', () => 
        {
            it('Should multiply all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Multiply(
                    5, 6,
                    7, 8
                );
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should multiply all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other = new Matrix2(
                    5, 6,
                    7, 8
                );
                matrix.Multiply(other);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should multiply all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                matrix.Multiply(other);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });
        });

        describe('Scale', () => 
        {
            it('Should multiply all components by the scalar passed', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Scale(5);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
            });
        });

        describe('Transpose', () => 
        {
            it('Should transpose the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Transpose();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(3);
                expect(matrix[2]).toBe(2);
                expect(matrix[3]).toBe(4);
            });
        });

        describe('Inverse', () => 
        {
            it('Should attempt to invert the matrix', () =>
            {
                const matrix = new Matrix2(
                    0, 2,
                    0, 4
                );
                matrix.Inverse();
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(2);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(4);
            });

            it('Should successfully invert the matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Inverse();
                expect(matrix[0]).toBe(-2);
                expect(matrix[1]).toBe(1);
                expect(matrix[2]).toBe(1.5);
                expect(matrix[3]).toBe(-0.5);
            });
        });

        describe('Zero', () => 
        {
            it('Should set all the matrix entries to 0', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Zero();
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
            });
        });

        describe('Identity', () => 
        {
            it('Should reset the matrix to an identity matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                matrix.Identity();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(1);
            });
        });

        describe('Clone', () => 
        {
            it('Should create a new matrix with the same values as the source', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const clone = matrix.Clone();
                expect(clone[0]).toBe(matrix[0]);
                expect(clone[1]).toBe(matrix[1]);
                expect(clone[2]).toBe(matrix[2]);
                expect(clone[3]).toBe(matrix[3]);
            });
        });

        describe('Equals', () => 
        {
            it('Should succeed when two matrices have the same values', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other = new Matrix2(
                    1, 2,
                    3, 4
                );
                const equals = matrix.Equals(other);
                expect(equals).toBeTruthy();
            });

            it('Should succeed not when two matrices have the different values', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const other = new Matrix2(
                    1, 2,
                    3, 5
                );
                const equals = matrix.Equals(other);
                expect(equals).toBeFalsy();
            });
        });
    });

    describe('Static Properties', () => 
    {
        describe('Zero', () => 
        {
            it('Should create a new empty matrix', () =>
            {
                const matrix = Matrix2.Zero;
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
            });
        });

        describe('Identity', () => 
        {
            it('Should create a new identity matrix', () =>
            {
                const matrix = Matrix2.Identity;
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(1);
            });
        });
    });

    describe('Static Methods', () => 
    {
        describe('Add', () => 
        {
            it('Should compnent-wise add the values together and return a new matrix with the sum', () => 
            {
                const matrix = Matrix2.Add(
                    1, 2,
                    3, 4,

                    5, 6,
                    7, 8
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should compnent-wise add the values together and set a matrix with the sum', () => 
            {
                const matrix = new Matrix2();
                Matrix2.Add(
                    1, 2,
                    3, 4,

                    5, 6,
                    7, 8,

                    matrix
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should add two matrices and return a new matrix with the sum', () => 
            {
                const first = new Matrix2(
                    1, 2,
                    3, 4
                );
                const second = new Matrix2(
                    5, 6,
                    7, 8
                );
                const matrix = Matrix2.Add(
                    first,
                    second
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should add two matrices and set a matrix with the sum', () => 
            {
                const first = new Matrix2(
                    1, 2,
                    3, 4
                );
                const second = new Matrix2(
                    5, 6,
                    7, 8
                );
                const matrix = new Matrix2();
                Matrix2.Add(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should add two 4-component arrays and return a new matrix with the sum', () =>
            {
                const first: Matrix2Array = [
                    1, 2,
                    3, 4
                ];
                const second: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                const matrix = Matrix2.Add(
                    first,
                    second
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });

            it('Should add two 4-component arrays and set a matrix with the sum', () =>
            {
                const first: Matrix2Array = [
                    1, 2,
                    3, 4
                ];
                const second: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                const matrix = new Matrix2();
                Matrix2.Add(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(6);
                expect(matrix[1]).toBe(8);
                expect(matrix[2]).toBe(10);
                expect(matrix[3]).toBe(12);
            });
        });

        describe('Subtract', () => 
        {
            it('Should compnent-wise subtract the values together and return a new matrix with the difference', () => 
            {
                const matrix = Matrix2.Subtract(
                    1, 2,
                    3, 4,

                    5, 6,
                    7, 8
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should compnent-wise subtract the values together and set a matrix with the difference', () => 
            {
                const matrix = new Matrix2();
                Matrix2.Subtract(
                    1, 2,
                    3, 4,

                    5, 6,
                    7, 8,

                    matrix
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should subtract two matrices and return a new matrix with the difference', () => 
            {
                const first = new Matrix2(
                    1, 2,
                    3, 4
                );
                const second = new Matrix2(
                    5, 6,
                    7, 8
                );
                const matrix = Matrix2.Subtract(
                    first,
                    second
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should subtract two matrices and set a matrix with the difference', () => 
            {
                const first = new Matrix2(
                    1, 2,
                    3, 4
                );
                const second = new Matrix2(
                    5, 6,
                    7, 8
                );
                const matrix = new Matrix2();
                Matrix2.Subtract(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should subtract two 4-component arrays and return a new matrix with the difference', () =>
            {
                const first: Matrix2Array = [
                    1, 2,
                    3, 4
                ];
                const second: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                const matrix = Matrix2.Subtract(
                    first,
                    second
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });

            it('Should subtract two 4-component arrays and set a matrix with the difference', () =>
            {
                const first: Matrix2Array = [
                    1, 2,
                    3, 4
                ];
                const second: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                const matrix = new Matrix2();
                Matrix2.Subtract(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(-4);
                expect(matrix[1]).toBe(-4);
                expect(matrix[2]).toBe(-4);
                expect(matrix[3]).toBe(-4);
            });
        });

        describe('Multiply', () => 
        {
            it('Should compnent-wise multiply the values together and return a new matrix with the product', () => 
            {
                const matrix = Matrix2.Multiply(1, 2, 3, 4, 5, 6, 7, 8);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should compnent-wise multiply the values together and set a matrix with the product', () => 
            {
                const matrix = new Matrix2();
                Matrix2.Multiply(1, 2, 3, 4, 5, 6, 7, 8, matrix);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should multiply two matrices and return a new matrix with the product', () => 
            {
                const first = new Matrix2(
                    1, 2,
                    3, 4
                );
                const second = new Matrix2(
                    5, 6,
                    7, 8
                );
                const matrix = Matrix2.Multiply(first, second);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should multiply two matrices and set a matrix with the product', () => 
            {
                const first = new Matrix2(
                    1, 2,
                    3, 4
                );
                const second = new Matrix2(
                    5, 6,
                    7, 8
                );
                const matrix = new Matrix2();
                Matrix2.Multiply(first, second, matrix);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should multiply two 4-component arrays and return a new matrix with the product', () =>
            {
                const first: Matrix2Array = [
                    1, 2,
                    3, 4
                ];
                const second: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                const matrix = Matrix2.Multiply(first, second);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });

            it('Should multiply two 4-component arrays and set a matrix with the product', () =>
            {
                const first: Matrix2Array = [
                    1, 2,
                    3, 4
                ];
                const second: Matrix2Array = [
                    5, 6,
                    7, 8
                ];
                const matrix = new Matrix2();
                Matrix2.Multiply(first, second, matrix);
                expect(matrix[0]).toBe(19);
                expect(matrix[1]).toBe(22);
                expect(matrix[2]).toBe(43);
                expect(matrix[3]).toBe(50);
            });
        });

        describe('Scale', () => 
        {
            it('Should scale a matrix and return the new scaled matrix', () =>
            {
                const source = new Matrix2(
                    1, 2,
                    3, 4
                );
                const matrix = Matrix2.Scale(source, 5);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
            });

            it('Should scale a matrix and set the output matrix', () =>
            {
                const source = new Matrix2(
                    1, 2,
                    3, 4
                );
                const matrix = new Matrix2();
                Matrix2.Scale(source, 5, matrix);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
            });
        });

        describe('Transpose', () => 
        {
            it('Should transpose a matrix and return the new tranpose matrix', () =>
            {
                const source = new Matrix2(
                    1, 2,
                    3, 4
                );
                const matrix = Matrix2.Transpose(source);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(3);
                expect(matrix[2]).toBe(2);
                expect(matrix[3]).toBe(4);
            });

            it('Should tranpose a matrix and set the output matrix', () =>
            {
                const source = new Matrix2(
                    1, 2,
                    3, 4
                );
                const matrix = new Matrix2();
                Matrix2.Transpose(source, matrix);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(3);
                expect(matrix[2]).toBe(2);
                expect(matrix[3]).toBe(4);
            });
        });

        describe('Inverse', () => 
        {
            it('Should not invert a matrix and return the new matrix', () =>
            {
                const source = new Matrix2(
                    0, 2,
                    0, 4
                );
                const matrix = Matrix2.Inverse(source);
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
            });

            it('Should not invert a matrix and not set the output matrix', () =>
            {
                const source = new Matrix2(
                    0, 2,
                    0, 4
                );
                const matrix = new Matrix2();
                Matrix2.Inverse(source, matrix);
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
            });

            it('Should invert a matrix and return the new inverse matrix', () =>
            {
                const source = new Matrix2(
                    1, 2,
                    3, 4
                );
                const matrix = Matrix2.Inverse(source);
                expect(matrix[0]).toBe(-2);
                expect(matrix[1]).toBe(1);
                expect(matrix[2]).toBe(1.5);
                expect(matrix[3]).toBe(-0.5);
            });

            it('Should invert a matrix and set the output matrix', () =>
            {
                const source = new Matrix2(
                    1, 2,
                    3, 4
                );
                const matrix = new Matrix2();
                Matrix2.Inverse(source, matrix);
                expect(matrix[0]).toBe(-2);
                expect(matrix[1]).toBe(1);
                expect(matrix[2]).toBe(1.5);
                expect(matrix[3]).toBe(-0.5);
            });
        });

        describe('MultiplyVector', () => 
        {
            it('Should multiply a matrix with 2 numbers and return a {Vector2} with the product', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const result = Matrix2.MultiplyVector(matrix, 5, 6);
                expect(result[0]).toBe(17);
                expect(result[1]).toBe(39);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector2} with the product', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const result = new Vector2();
                Matrix2.MultiplyVector(matrix, 5, 6, result);
                expect(result[0]).toBe(17);
                expect(result[1]).toBe(39);
            });

            it('Should multiply a matrix with 2 numbers and return a {Vector2} with the product', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const vector = new Vector2(5, 6);
                const result = Matrix2.MultiplyVector(matrix, vector);
                expect(result[0]).toBe(17);
                expect(result[1]).toBe(39);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector2} with the product', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const vector = new Vector2(5, 6);
                const result = new Vector2();
                Matrix2.MultiplyVector(matrix, vector, result);
                expect(result[0]).toBe(17);
                expect(result[1]).toBe(39);
            });

            it('Should multiply a matrix with 2 numbers and return a {Vector2} with the product', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const vector: Vector2Array = [5, 6];
                const result = Matrix2.MultiplyVector(matrix, vector);
                expect(result[0]).toBe(17);
                expect(result[1]).toBe(39);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector2} with the product', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                const vector: Vector2Array = [5, 6];
                const result = new Vector2();
                Matrix2.MultiplyVector(matrix, vector, result);
                expect(result[0]).toBe(17);
                expect(result[1]).toBe(39);
            });
        });

        describe('RotationMatrix', () => 
        {
            const theta = radian(60);
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);
            const rotx = 0.6830127018922193;
            const roty = -0.1830127018922193;

            it('Should create a new rotation matrix', () =>
            {
                const matrix = Matrix2.RotationMatrix(60);
                const vector = Matrix2.MultiplyVector(matrix, 0.5, 0.5);

                expect(matrix[0]).toBeCloseTo(cosTheta);
                expect(matrix[1]).toBeCloseTo(sinTheta);
                expect(matrix[2]).toBeCloseTo(-sinTheta);
                expect(matrix[3]).toBeCloseTo(cosTheta);

                expect(vector[0]).toBeCloseTo(rotx);
                expect(vector[1]).toBeCloseTo(roty);
            });

            it('Should set a given matrix as a rotation matrix', () =>
            {
                const matrix = new Matrix2(
                    1, 2,
                    3, 4
                );
                Matrix2.RotationMatrix(60, matrix);
                const vector = Matrix2.MultiplyVector(matrix, 0.5, 0.5);

                expect(matrix[0]).toBeCloseTo(cosTheta);
                expect(matrix[1]).toBeCloseTo(sinTheta);
                expect(matrix[2]).toBeCloseTo(-sinTheta);
                expect(matrix[3]).toBeCloseTo(cosTheta);

                expect(vector[0]).toBeCloseTo(rotx);
                expect(vector[1]).toBeCloseTo(roty);
            });
        });
    });
});

// @vitest-environment jsdom
import { Vector3, Vector3Array } from "../vector";
import { Matrix2 } from "./Matrix2";
import { Matrix3, Matrix3Array } from "./Matrix3";
import { describe, it, expect } from 'vitest';

describe('Matrix3', () =>
{
    describe('Matrix Creation', () => 
    {
        it('Should create a new instance of a {Matrix3} class', () =>
        {
            const matrix = new Matrix3();
            expect(matrix).toBeInstanceOf(Matrix3);
            expect(matrix).not.toBeNull();
            expect(matrix).not.toBeUndefined();
        });

        it('Should default all components to 0 when no arguments are passed', () =>
        {
            const matrix = new Matrix3();
            expect(matrix[0]).toBe(0);
            expect(matrix[1]).toBe(0);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(0);
            expect(matrix[4]).toBe(0);
            expect(matrix[5]).toBe(0);
            expect(matrix[6]).toBe(0);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(0);
        });

        it('Should assign diagonal component when an integer argument is passed', () =>
        {
            const matrix = new Matrix3(7);
            expect(matrix[0]).toBe(7);
            expect(matrix[1]).toBe(0);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(0);
            expect(matrix[4]).toBe(7);
            expect(matrix[5]).toBe(0);
            expect(matrix[6]).toBe(0);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(7);
        });

        it('Should assign component when integer arguments are passed', () =>
        {
            const matrix = new Matrix3(
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            );
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
        });

        it('Should assign component-wise when another matrix is passed', () =>
        {
            const other = new Matrix3(
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            );
            const matrix = new Matrix3(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
        });


        it('Should assign component-wise when a {Matrix2} is passed', () =>
        {
            const other = new Matrix2(
                1, 2,
                3, 4
            );
            const matrix = new Matrix3(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(3);
            expect(matrix[4]).toBe(4);
            expect(matrix[5]).toBe(0);
            expect(matrix[6]).toBe(0);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(0);
        });

        it('Should assign component-wise when a 4-component array is passed', () =>
        {
            const other: Matrix3Array = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ];
            const matrix = new Matrix3(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
        });

        it('Should assign component-wise when an array buffer is passed', () =>
        {
            const data = new Float32Array([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
                10, 11, 12
            ]);
            const matrix = new Matrix3(data.buffer);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
        });

        it('Should assign component-wise when an array buffer is passed with an offset', () =>
        {
            const data = new Float32Array([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
                10, 11, 12
            ]);
            const matrix = new Matrix3(data.buffer, Float32Array.BYTES_PER_ELEMENT);
            expect(matrix[0]).toBe(2);
            expect(matrix[1]).toBe(3);
            expect(matrix[2]).toBe(4);
            expect(matrix[3]).toBe(5);
            expect(matrix[4]).toBe(6);
            expect(matrix[5]).toBe(7);
            expect(matrix[6]).toBe(8);
            expect(matrix[7]).toBe(9);
            expect(matrix[8]).toBe(10);
        });
    });

    describe('Local Properties', () => 
    {
        describe('M11', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M11).toBe(1);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M11 = 11;
                expect(matrix.M11).toBe(11);
            });
        });

        describe('M12', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M12).toBe(2);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M12 = 11;
                expect(matrix.M12).toBe(11);
            });
        });

        describe('M13', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M13).toBe(3);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M13 = 11;
                expect(matrix.M13).toBe(11);
            });
        });

        describe('M21', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M21).toBe(4);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M21 = 11;
                expect(matrix.M21).toBe(11);
            });
        });

        describe('M22', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M22).toBe(5);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M22 = 11;
                expect(matrix.M22).toBe(11);
            });
        });

        describe('M23', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M23).toBe(6);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M23 = 11;
                expect(matrix.M23).toBe(11);
            });
        });

        describe('M31', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M31).toBe(7);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M31 = 11;
                expect(matrix.M31).toBe(11);
            });
        });

        describe('M32', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M32).toBe(8);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M32 = 11;
                expect(matrix.M32).toBe(11);
            });
        });

        describe('M33', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.M33).toBe(9);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.M33 = 11;
                expect(matrix.M33).toBe(11);
            });
        });

        describe('Determinant', () =>
        {
            it('Should calculate the determinant of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.Determinant).toBe(0);
            });
        });

        describe('Column1', () =>
        {
            it('Should get column 1 of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const column = matrix.Column1;
                expect(column).toBeInstanceOf(Vector3);
                expect(column[0]).toBe(1);
                expect(column[1]).toBe(4);
                expect(column[2]).toBe(7);
            });
        });

        describe('Column2', () =>
        {
            it('Should get column 2 of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const column = matrix.Column2;
                expect(column).toBeInstanceOf(Vector3);
                expect(column[0]).toBe(2);
                expect(column[1]).toBe(5);
                expect(column[2]).toBe(8);
            });
        });

        describe('Column3', () =>
        {
            it('Should get column 3 of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const column = matrix.Column3;
                expect(column).toBeInstanceOf(Vector3);
                expect(column[0]).toBe(3);
                expect(column[1]).toBe(6);
                expect(column[2]).toBe(9);
            });
        });

        describe('Row1', () =>
        {
            it('Should get row 1 of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const row = matrix.Row1;
                expect(row).toBeInstanceOf(Vector3);
                expect(row[0]).toBe(1);
                expect(row[1]).toBe(2);
                expect(row[2]).toBe(3);
            });
        });

        describe('Row2', () =>
        {
            it('Should get row 2 of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const row = matrix.Row2;
                expect(row).toBeInstanceOf(Vector3);
                expect(row[0]).toBe(4);
                expect(row[1]).toBe(5);
                expect(row[2]).toBe(6);
            });
        });

        describe('Row3', () =>
        {
            it('Should get row 3 of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const row = matrix.Row3;
                expect(row).toBeInstanceOf(Vector3);
                expect(row[0]).toBe(7);
                expect(row[1]).toBe(8);
                expect(row[2]).toBe(9);
            });
        });

        describe('Diagonal', () =>
        {
            it('Should get the diagonal of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const diag = matrix.Diagonal;
                expect(diag).toBeInstanceOf(Vector3);
                expect(diag[0]).toBe(1);
                expect(diag[1]).toBe(5);
                expect(diag[2]).toBe(9);
            });
        });

        describe('Trace', () =>
        {
            it('Should calculate the trace of the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                expect(matrix.Trace).toBe(15);
            });
        });
    });

    describe('Instance Methods', () =>
    {
        describe('Set', () => 
        {
            it('Should set all components when all arguments are passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Set(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                expect(matrix[0]).toBe(10);
                expect(matrix[1]).toBe(11);
                expect(matrix[2]).toBe(12);
                expect(matrix[3]).toBe(13);
                expect(matrix[4]).toBe(14);
                expect(matrix[5]).toBe(15);
                expect(matrix[6]).toBe(16);
                expect(matrix[7]).toBe(17);
                expect(matrix[8]).toBe(18);
            });

            it('Should set all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18);
                matrix.Set(other);
                expect(matrix[0]).toBe(10);
                expect(matrix[1]).toBe(11);
                expect(matrix[2]).toBe(12);
                expect(matrix[3]).toBe(13);
                expect(matrix[4]).toBe(14);
                expect(matrix[5]).toBe(15);
                expect(matrix[6]).toBe(16);
                expect(matrix[7]).toBe(17);
                expect(matrix[8]).toBe(18);
            });

            it('Should set all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18];
                matrix.Set(other);
                expect(matrix[0]).toBe(10);
                expect(matrix[1]).toBe(11);
                expect(matrix[2]).toBe(12);
                expect(matrix[3]).toBe(13);
                expect(matrix[4]).toBe(14);
                expect(matrix[5]).toBe(15);
                expect(matrix[6]).toBe(16);
                expect(matrix[7]).toBe(17);
                expect(matrix[8]).toBe(18);
            });
        });

        describe('Add', () => 
        {
            it('Should add all components when all arguments are passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Add(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should add all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                matrix.Add(other);
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should add all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                matrix.Add(other);
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });
        });

        describe('Subtract', () => 
        {
            it('Should subtract all components when all arguments are passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Subtract(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should subtract all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                matrix.Subtract(other);
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should subtract all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                matrix.Subtract(other);
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });
        });

        describe('Multiply', () => 
        {
            it('Should multiply all components when all arguments are passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Multiply(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should multiply all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                matrix.Multiply(other);
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should multiply all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                matrix.Multiply(other);
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });
        });

        describe('Scale', () => 
        {
            it('Should multiply all components by the scalar passed', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Scale(5);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(25);
                expect(matrix[5]).toBe(30);
                expect(matrix[6]).toBe(35);
                expect(matrix[7]).toBe(40);
                expect(matrix[8]).toBe(45);
            });
        });

        describe('Transpose', () => 
        {
            it('Should transpose the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Transpose();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(4);
                expect(matrix[2]).toBe(7);
                expect(matrix[3]).toBe(2);
                expect(matrix[4]).toBe(5);
                expect(matrix[5]).toBe(8);
                expect(matrix[6]).toBe(3);
                expect(matrix[7]).toBe(6);
                expect(matrix[8]).toBe(9);
            });
        });

        describe('Inverse', () => 
        {
            it('Should attempt to invert the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Inverse();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(2);
                expect(matrix[2]).toBe(3);
                expect(matrix[3]).toBe(4);
                expect(matrix[4]).toBe(5);
                expect(matrix[5]).toBe(6);
                expect(matrix[6]).toBe(7);
                expect(matrix[7]).toBe(8);
                expect(matrix[8]).toBe(9);
            });

            it('Should successfully invert the matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 4,
                    3, 2, 1
                );
                matrix.Inverse();
                expect(matrix[0]).toBeCloseTo(3 / 8);
                expect(matrix[1]).toBeCloseTo(-0.5);
                expect(matrix[2]).toBeCloseTo(7 / 8);
                expect(matrix[3]).toBeCloseTo(-1);
                expect(matrix[4]).toBeCloseTo(1);
                expect(matrix[5]).toBeCloseTo(-1);
                expect(matrix[6]).toBeCloseTo(7 / 8);
                expect(matrix[7]).toBeCloseTo(-0.5);
                expect(matrix[8]).toBeCloseTo(3 / 8);
            });
        });

        describe('Zero', () => 
        {
            it('Should set all the matrix entries to 0', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Zero();
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
            });
        });

        describe('Identity', () => 
        {
            it('Should reset the matrix to an identity matrix', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                matrix.Identity();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(1);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(1);
            });
        });

        describe('Clone', () => 
        {
            it('Should create a new matrix with the same values as the source', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const clone = matrix.Clone();
                expect(clone[0]).toBe(matrix[0]);
                expect(clone[1]).toBe(matrix[1]);
                expect(clone[2]).toBe(matrix[2]);
                expect(clone[3]).toBe(matrix[3]);
                expect(clone[4]).toBe(matrix[4]);
                expect(clone[5]).toBe(matrix[5]);
                expect(clone[6]).toBe(matrix[6]);
                expect(clone[7]).toBe(matrix[7]);
                expect(clone[8]).toBe(matrix[8]);
            });
        });

        describe('Equals', () => 
        {
            it('Should succeed when two matrices have the same values', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const equals = matrix.Equals(other);
                expect(equals).toBeTruthy();
            });

            it('Should succeed not when two matrices have the different values', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const other = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 10
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
                const matrix = Matrix3.Zero;
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
            });
        });

        describe('Identity', () => 
        {
            it('Should create a new identity matrix', () =>
            {
                const matrix = Matrix3.Identity;
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(1);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(1);
            });
        });
    });

    describe('Static Methods', () => 
    {
        describe('Add', () => 
        {
            it('Should compnent-wise add the values together and return a new matrix with the sum', () => 
            {
                const matrix = Matrix3.Add(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,

                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should compnent-wise add the values together and set a matrix with the sum', () => 
            {
                const matrix = new Matrix3();
                Matrix3.Add(

                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,

                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18,

                    matrix
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should add two matrices and return a new matrix with the sum', () => 
            {
                const first = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const second = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                const matrix = Matrix3.Add(
                    first,
                    second
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should add two matrices and set a matrix with the sum', () => 
            {
                const first = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const second = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                const matrix = new Matrix3();
                Matrix3.Add(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should add two 4-component arrays and return a new matrix with the sum', () =>
            {
                const first: Matrix3Array = [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ];
                const second: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                const matrix = Matrix3.Add(
                    first,
                    second
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });

            it('Should add two 4-component arrays and set a matrix with the sum', () =>
            {
                const first: Matrix3Array = [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ];
                const second: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                const matrix = new Matrix3();
                Matrix3.Add(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(11);
                expect(matrix[1]).toBe(13);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(17);
                expect(matrix[4]).toBe(19);
                expect(matrix[5]).toBe(21);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(25);
                expect(matrix[8]).toBe(27);
            });
        });

        describe('Subtract', () => 
        {
            it('Should compnent-wise subtract the values together and return a new matrix with the difference', () => 
            {
                const matrix = Matrix3.Subtract(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,

                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18,
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should compnent-wise subtract the values together and set a matrix with the difference', () => 
            {
                const matrix = new Matrix3();
                Matrix3.Subtract(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,

                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18,

                    matrix
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should subtract two matrices and return a new matrix with the difference', () => 
            {
                const first = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const second = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                const matrix = Matrix3.Subtract(
                    first,
                    second
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should subtract two matrices and set a matrix with the difference', () => 
            {
                const first = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const second = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                const matrix = new Matrix3();
                Matrix3.Subtract(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should subtract two 4-component arrays and return a new matrix with the difference', () =>
            {
                const first: Matrix3Array = [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ];
                const second: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                const matrix = Matrix3.Subtract(
                    first,
                    second
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });

            it('Should subtract two 4-component arrays and set a matrix with the difference', () =>
            {
                const first: Matrix3Array = [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ];
                const second: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                const matrix = new Matrix3();
                Matrix3.Subtract(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(-9);
                expect(matrix[1]).toBe(-9);
                expect(matrix[2]).toBe(-9);
                expect(matrix[3]).toBe(-9);
                expect(matrix[4]).toBe(-9);
                expect(matrix[5]).toBe(-9);
                expect(matrix[6]).toBe(-9);
                expect(matrix[7]).toBe(-9);
                expect(matrix[8]).toBe(-9);
            });
        });

        describe('Multiply', () => 
        {
            it('Should compnent-wise multiply the values together and return a new matrix with the product', () => 
            {
                const matrix = Matrix3.Multiply(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,

                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should compnent-wise multiply the values together and set a matrix with the product', () => 
            {
                const matrix = new Matrix3();
                Matrix3.Multiply(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,

                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18,

                    matrix
                );
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should multiply two matrices and return a new matrix with the product', () => 
            {
                const first = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const second = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                const matrix = Matrix3.Multiply(first, second);
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should multiply two matrices and set a matrix with the product', () => 
            {
                const first = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const second = new Matrix3(
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                );
                const matrix = new Matrix3();
                Matrix3.Multiply(first, second, matrix);
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should multiply two 4-component arrays and return a new matrix with the product', () =>
            {
                const first: Matrix3Array = [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ];
                const second: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                const matrix = Matrix3.Multiply(first, second);
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });

            it('Should multiply two 4-component arrays and set a matrix with the product', () =>
            {
                const first: Matrix3Array = [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ];
                const second: Matrix3Array = [
                    10, 11, 12,
                    13, 14, 15,
                    16, 17, 18
                ];
                const matrix = new Matrix3();
                Matrix3.Multiply(first, second, matrix);
                expect(matrix[0]).toBe(84);
                expect(matrix[1]).toBe(90);
                expect(matrix[2]).toBe(96);
                expect(matrix[3]).toBe(201);
                expect(matrix[4]).toBe(216);
                expect(matrix[5]).toBe(231);
                expect(matrix[6]).toBe(318);
                expect(matrix[7]).toBe(342);
                expect(matrix[8]).toBe(366);
            });
        });

        describe('Scale', () => 
        {
            it('Should scale a matrix and return the new scaled matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const matrix = Matrix3.Scale(source, 5);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(25);
                expect(matrix[5]).toBe(30);
                expect(matrix[6]).toBe(35);
                expect(matrix[7]).toBe(40);
                expect(matrix[8]).toBe(45);
            });

            it('Should scale a matrix and set the output matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const matrix = new Matrix3();
                Matrix3.Scale(source, 5, matrix);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(25);
                expect(matrix[5]).toBe(30);
                expect(matrix[6]).toBe(35);
                expect(matrix[7]).toBe(40);
                expect(matrix[8]).toBe(45);
            });
        });

        describe('Transpose', () => 
        {
            it('Should transpose a matrix and return the new tranpose matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const matrix = Matrix3.Transpose(source);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(4);
                expect(matrix[2]).toBe(7);
                expect(matrix[3]).toBe(2);
                expect(matrix[4]).toBe(5);
                expect(matrix[5]).toBe(8);
                expect(matrix[6]).toBe(3);
                expect(matrix[7]).toBe(6);
                expect(matrix[8]).toBe(9);
            });

            it('Should tranpose a matrix and set the output matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const matrix = new Matrix3();
                Matrix3.Transpose(source, matrix);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(4);
                expect(matrix[2]).toBe(7);
                expect(matrix[3]).toBe(2);
                expect(matrix[4]).toBe(5);
                expect(matrix[5]).toBe(8);
                expect(matrix[6]).toBe(3);
                expect(matrix[7]).toBe(6);
                expect(matrix[8]).toBe(9);
            });
        });

        describe('Inverse', () => 
        {
            it('Should not invert a matrix and return the new matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const matrix = Matrix3.Inverse(source);
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
            });

            it('Should not invert a matrix and not set the output matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const matrix = new Matrix3();
                Matrix3.Inverse(source, matrix);
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
            });

            it('Should invert a matrix and return the new inverse matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 4,
                    3, 2, 1
                );
                const matrix = Matrix3.Inverse(source);
                expect(matrix[0]).toBeCloseTo(3 / 8);
                expect(matrix[1]).toBeCloseTo(-0.5);
                expect(matrix[2]).toBeCloseTo(7 / 8);
                expect(matrix[3]).toBeCloseTo(-1);
                expect(matrix[4]).toBeCloseTo(1);
                expect(matrix[5]).toBeCloseTo(-1);
                expect(matrix[6]).toBeCloseTo(7 / 8);
                expect(matrix[7]).toBeCloseTo(-0.5);
                expect(matrix[8]).toBeCloseTo(3 / 8);
            });

            it('Should invert a matrix and set the output matrix', () =>
            {
                const source = new Matrix3(
                    1, 2, 3,
                    4, 5, 4,
                    3, 2, 1
                );
                const matrix = new Matrix3();
                Matrix3.Inverse(source, matrix);
                expect(matrix[0]).toBeCloseTo(3 / 8);
                expect(matrix[1]).toBeCloseTo(-0.5);
                expect(matrix[2]).toBeCloseTo(7 / 8);
                expect(matrix[3]).toBeCloseTo(-1);
                expect(matrix[4]).toBeCloseTo(1);
                expect(matrix[5]).toBeCloseTo(-1);
                expect(matrix[6]).toBeCloseTo(7 / 8);
                expect(matrix[7]).toBeCloseTo(-0.5);
                expect(matrix[8]).toBeCloseTo(3 / 8);
            });
        });

        describe('MultiplyVector', () => 
        {
            it('Should multiply a matrix with 2 numbers and return a {Vector3} with the product', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const result = Matrix3.MultiplyVector(matrix, 10, 11, 12);
                expect(result[0]).toBe(68);
                expect(result[1]).toBe(167);
                expect(result[2]).toBe(266);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector3} with the product', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const result = new Vector3();
                Matrix3.MultiplyVector(matrix, 10, 11, 12, result);
                expect(result[0]).toBe(68);
                expect(result[1]).toBe(167);
                expect(result[2]).toBe(266);
            });

            it('Should multiply a matrix with 2 numbers and return a {Vector3} with the product', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const vector = new Vector3(10, 11, 12);
                const result = Matrix3.MultiplyVector(matrix, vector);
                expect(result[0]).toBe(68);
                expect(result[1]).toBe(167);
                expect(result[2]).toBe(266);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector3} with the product', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const vector = new Vector3(10, 11, 12);
                const result = new Vector3();
                Matrix3.MultiplyVector(matrix, vector, result);
                expect(result[0]).toBe(68);
                expect(result[1]).toBe(167);
                expect(result[2]).toBe(266);
            });

            it('Should multiply a matrix with 2 numbers and return a {Vector3} with the product', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const vector: Vector3Array = [10, 11, 12];
                const result = Matrix3.MultiplyVector(matrix, vector);
                expect(result[0]).toBe(68);
                expect(result[1]).toBe(167);
                expect(result[2]).toBe(266);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector3} with the product', () =>
            {
                const matrix = new Matrix3(
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                );
                const vector: Vector3Array = [10, 11, 12];
                const result = new Vector3();
                Matrix3.MultiplyVector(matrix, vector, result);
                expect(result[0]).toBe(68);
                expect(result[1]).toBe(167);
                expect(result[2]).toBe(266);
            });
        });

        // describe('RotationMatrix', () => 
        // {
        //     const theta = radian(60)
        //     const cosTheta = Math.cos(theta)
        //     const sinTheta = Math.sin(theta)

        //     it('Should create a new rotation matrix', () =>
        //     {
        //         const matrix = Matrix3.RotationMatrix(60)
        //         const vector = Matrix3.MultiplyVector(matrix, 0, 0, 1)
        //         expect(matrix[0]).toBeCloseTo( cosTheta)
        //         expect(matrix[1]).toBeCloseTo( sinTheta)
        //         expect(matrix[2]).toBeCloseTo(-sinTheta)
        //         expect(matrix[3]).toBeCloseTo( cosTheta)
        //     })

        //     it('Should set a given matrix as a rotation matrix', () =>
        //     {
        //         const matrix = new Matrix3(
        //             1, 2, 3,
        //             4, 5, 6,
        //             7, 8, 9
        //         )
        //         Matrix3.RotationMatrix(60, matrix)
        //         expect(matrix[0]).toBeCloseTo( cosTheta)
        //         expect(matrix[1]).toBeCloseTo( sinTheta)
        //         expect(matrix[2]).toBeCloseTo(-sinTheta)
        //         expect(matrix[3]).toBeCloseTo( cosTheta)
        //     })
        // })

        // describe('ScaleMatrix', () => 
        // {
        //     it('Should create a new rotation matrix', () =>
        //     {
        //         const matrix = Matrix3.ScaleMatrix(45, 45, 45);
        //         expect(matrix[0]).toBe(45);
        //         expect(matrix[1]).toBe(0);
        //         expect(matrix[2]).toBe(0);
        //         expect(matrix[3]).toBe(0);
        //         expect(matrix[4]).toBe(45);
        //         expect(matrix[5]).toBe(0);
        //         expect(matrix[6]).toBe(0);
        //         expect(matrix[7]).toBe(0);
        //         expect(matrix[8]).toBe(45);
        //     });

        //     it('Should set a given matrix as a rotation matrix', () =>
        //     {
        //         const matrix = new Matrix3(
        //             1, 2, 3,
        //             4, 5, 6,
        //             7, 8, 9
        //         );
        //         Matrix3.ScaleMatrix(45, 45, 45, matrix);
        //         expect(matrix[0]).toBe(45);
        //         expect(matrix[1]).toBe(0);
        //         expect(matrix[2]).toBe(0);
        //         expect(matrix[3]).toBe(0);
        //         expect(matrix[4]).toBe(45);
        //         expect(matrix[5]).toBe(0);
        //         expect(matrix[6]).toBe(0);
        //         expect(matrix[7]).toBe(0);
        //         expect(matrix[8]).toBe(45);
        //     });
        // });
    });
});

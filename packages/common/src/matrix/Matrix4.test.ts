// @vitest-environment jsdom
import { Vector3, Vector3Array, Vector4, Vector4Array } from "../vector";
import { Matrix2 } from "./Matrix2";
import { Matrix3 } from "./Matrix3";
import { Matrix4, Matrix4Array } from "./Matrix4";
import { describe, it, expect } from 'vitest';

describe('Matrix4', () =>
{
    describe('Matrix Creation', () => 
    {
        it('Should create a new instance of a {Matrix4} class', () =>
        {
            const matrix = new Matrix4();
            expect(matrix).toBeInstanceOf(Matrix4);
            expect(matrix).not.toBeNull();
            expect(matrix).not.toBeUndefined();
        });

        it('Should default all components to 0 when no arguments are passed', () =>
        {
            const matrix = new Matrix4();
            expect(matrix[0]).toBe(0);
            expect(matrix[1]).toBe(0);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(0);
            expect(matrix[4]).toBe(0);
            expect(matrix[5]).toBe(0);
            expect(matrix[6]).toBe(0);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(0);
            expect(matrix[9]).toBe(0);
            expect(matrix[10]).toBe(0);
            expect(matrix[11]).toBe(0);
            expect(matrix[12]).toBe(0);
            expect(matrix[13]).toBe(0);
            expect(matrix[14]).toBe(0);
            expect(matrix[15]).toBe(0);
        });

        it('Should assign diagonal component when an integer argument is passed', () =>
        {
            const matrix = new Matrix4(7);
            expect(matrix[0]).toBe(7);
            expect(matrix[1]).toBe(0);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(0);
            expect(matrix[4]).toBe(0);
            expect(matrix[5]).toBe(7);
            expect(matrix[6]).toBe(0);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(0);
            expect(matrix[9]).toBe(0);
            expect(matrix[10]).toBe(7);
            expect(matrix[11]).toBe(0);
            expect(matrix[12]).toBe(0);
            expect(matrix[13]).toBe(0);
            expect(matrix[14]).toBe(0);
            expect(matrix[15]).toBe(7);
        });

        it('Should assign component when integer arguments are passed', () =>
        {
            const matrix = new Matrix4(
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
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
            expect(matrix[9]).toBe(10);
            expect(matrix[10]).toBe(11);
            expect(matrix[11]).toBe(12);
            expect(matrix[12]).toBe(13);
            expect(matrix[13]).toBe(14);
            expect(matrix[14]).toBe(15);
            expect(matrix[15]).toBe(16);
        });

        it('Should assign component-wise when another {Matrix2} is passed', () =>
        {
            const other = new Matrix2(
                1, 2,
                3, 4
            );
            const matrix = new Matrix4(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(0);
            expect(matrix[3]).toBe(0);
            expect(matrix[4]).toBe(3);
            expect(matrix[5]).toBe(4);
            expect(matrix[6]).toBe(0);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(0);
            expect(matrix[9]).toBe(0);
            expect(matrix[10]).toBe(1);
            expect(matrix[11]).toBe(0);
            expect(matrix[12]).toBe(0);
            expect(matrix[13]).toBe(0);
            expect(matrix[14]).toBe(0);
            expect(matrix[15]).toBe(1);
        });


        it('Should assign component-wise when another {Matrix3} is passed', () =>
        {
            const other = new Matrix3(
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            );
            const matrix = new Matrix4(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(0);
            expect(matrix[4]).toBe(4);
            expect(matrix[5]).toBe(5);
            expect(matrix[6]).toBe(6);
            expect(matrix[7]).toBe(0);
            expect(matrix[8]).toBe(7);
            expect(matrix[9]).toBe(8);
            expect(matrix[10]).toBe(9);
            expect(matrix[11]).toBe(0);
            expect(matrix[12]).toBe(0);
            expect(matrix[13]).toBe(0);
            expect(matrix[14]).toBe(0);
            expect(matrix[15]).toBe(1);
        });


        it('Should assign component-wise when another {Matrix4} is passed', () =>
        {
            const other = new Matrix4(
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            );
            const matrix = new Matrix4(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
            expect(matrix[9]).toBe(10);
            expect(matrix[10]).toBe(11);
            expect(matrix[11]).toBe(12);
            expect(matrix[12]).toBe(13);
            expect(matrix[13]).toBe(14);
            expect(matrix[14]).toBe(15);
            expect(matrix[15]).toBe(16);
        });

        it('Should assign component-wise when a 4-component array is passed', () =>
        {
            const other: Matrix4Array = [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ];
            const matrix = new Matrix4(other);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
            expect(matrix[9]).toBe(10);
            expect(matrix[10]).toBe(11);
            expect(matrix[11]).toBe(12);
            expect(matrix[12]).toBe(13);
            expect(matrix[13]).toBe(14);
            expect(matrix[14]).toBe(15);
            expect(matrix[15]).toBe(16);
        });

        it('Should assign component-wise when an array buffer is passed', () =>
        {
            const data = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            const matrix = new Matrix4(data.buffer);
            expect(matrix[0]).toBe(1);
            expect(matrix[1]).toBe(2);
            expect(matrix[2]).toBe(3);
            expect(matrix[3]).toBe(4);
            expect(matrix[4]).toBe(5);
            expect(matrix[5]).toBe(6);
            expect(matrix[6]).toBe(7);
            expect(matrix[7]).toBe(8);
            expect(matrix[8]).toBe(9);
            expect(matrix[9]).toBe(10);
            expect(matrix[10]).toBe(11);
            expect(matrix[11]).toBe(12);
            expect(matrix[12]).toBe(13);
            expect(matrix[13]).toBe(14);
            expect(matrix[14]).toBe(15);
            expect(matrix[15]).toBe(16);
        });

        it('Should assign component-wise when an array buffer is passed with an offset', () =>
        {
            const data = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            const matrix = new Matrix4(data.buffer, Float32Array.BYTES_PER_ELEMENT);
            expect(matrix[0]).toBe(2);
            expect(matrix[1]).toBe(3);
            expect(matrix[2]).toBe(4);
            expect(matrix[3]).toBe(5);
            expect(matrix[4]).toBe(6);
            expect(matrix[5]).toBe(7);
            expect(matrix[6]).toBe(8);
            expect(matrix[7]).toBe(9);
            expect(matrix[8]).toBe(10);
            expect(matrix[9]).toBe(11);
            expect(matrix[10]).toBe(12);
            expect(matrix[11]).toBe(13);
            expect(matrix[12]).toBe(14);
            expect(matrix[13]).toBe(15);
            expect(matrix[14]).toBe(16);
            expect(matrix[15]).toBe(17);
        });
    });

    describe('Local Properties', () => 
    {
        describe('M11', () =>
        {
            it('Should get entry a11', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M11).toBe(1);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M11 = 19;
                expect(matrix.M11).toBe(19);
            });
        });

        describe('M12', () =>
        {
            it('Should get entry a12', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M12).toBe(2);
            });

            it('Should set entry a12', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M12 = 19;
                expect(matrix.M12).toBe(19);
            });
        });

        describe('M13', () =>
        {
            it('Should get entry a13', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M13).toBe(3);
            });

            it('Should set entry a13', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M13 = 19;
                expect(matrix.M13).toBe(19);
            });
        });

        describe('M14', () =>
        {
            it('Should get entry a14', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M14).toBe(4);
            });

            it('Should set entry a14', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M14 = 19;
                expect(matrix.M14).toBe(19);
            });
        });

        describe('M21', () =>
        {
            it('Should get entry a21', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M21).toBe(5);
            });

            it('Should set entry a21', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M21 = 19;
                expect(matrix.M21).toBe(19);
            });
        });

        describe('M22', () =>
        {
            it('Should get entry a22', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M22).toBe(6);
            });

            it('Should set entry a22', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M22 = 19;
                expect(matrix.M22).toBe(19);
            });
        });

        describe('M23', () =>
        {
            it('Should get entry a23', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M23).toBe(7);
            });

            it('Should set entry a23', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M23 = 19;
                expect(matrix.M23).toBe(19);
            });
        });

        describe('M24', () =>
        {
            it('Should get entry a24', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M24).toBe(8);
            });

            it('Should set entry a24', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M24 = 19;
                expect(matrix.M24).toBe(19);
            });
        });

        describe('M31', () =>
        {
            it('Should get entry a31', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M31).toBe(9);
            });

            it('Should set entry a11', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M31 = 19;
                expect(matrix.M31).toBe(19);
            });
        });

        describe('M32', () =>
        {
            it('Should get entry a32', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M32).toBe(10);
            });

            it('Should set entry a32', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M32 = 19;
                expect(matrix.M32).toBe(19);
            });
        });

        describe('M33', () =>
        {
            it('Should get entry a33', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M33).toBe(11);
            });

            it('Should set entry a33', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M33 = 19;
                expect(matrix.M33).toBe(19);
            });
        });

        describe('M34', () =>
        {
            it('Should get entry a34', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M34).toBe(12);
            });

            it('Should set entry a34', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M34 = 19;
                expect(matrix.M34).toBe(19);
            });
        });

        describe('M41', () =>
        {
            it('Should get entry a41', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M41).toBe(13);
            });

            it('Should set entry a41', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M41 = 19;
                expect(matrix.M41).toBe(19);
            });
        });

        describe('M42', () =>
        {
            it('Should get entry a42', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M42).toBe(14);
            });

            it('Should set entry a42', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M42 = 19;
                expect(matrix.M42).toBe(19);
            });
        });

        describe('M43', () =>
        {
            it('Should get entry a43', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M43).toBe(15);
            });

            it('Should set entry a43', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M43 = 19;
                expect(matrix.M43).toBe(19);
            });
        });

        describe('M44', () =>
        {
            it('Should get entry a44', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.M44).toBe(16);
            });

            it('Should set entry a44', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.M44 = 19;
                expect(matrix.M44).toBe(19);
            });
        });

        describe('Determinant', () =>
        {
            it('Should calculate the determinant of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.Determinant).toBe(0);
            });
        });

        describe('Column1', () =>
        {
            it('Should get column 1 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const column = matrix.Column1;
                expect(column).toBeInstanceOf(Vector4);
                expect(column[0]).toBe(1);
                expect(column[1]).toBe(5);
                expect(column[2]).toBe(9);
                expect(column[3]).toBe(13);
            });
        });

        describe('Column2', () =>
        {
            it('Should get column 2 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const column = matrix.Column2;
                expect(column).toBeInstanceOf(Vector4);
                expect(column[0]).toBe(2);
                expect(column[1]).toBe(6);
                expect(column[2]).toBe(10);
                expect(column[3]).toBe(14);
            });
        });

        describe('Column3', () =>
        {
            it('Should get column 1 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const column = matrix.Column3;
                expect(column).toBeInstanceOf(Vector4);
                expect(column[0]).toBe(3);
                expect(column[1]).toBe(7);
                expect(column[2]).toBe(11);
                expect(column[3]).toBe(15);
            });
        });

        describe('Column4', () =>
        {
            it('Should get column 1 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const column = matrix.Column4;
                expect(column).toBeInstanceOf(Vector4);
                expect(column[0]).toBe(4);
                expect(column[1]).toBe(8);
                expect(column[2]).toBe(12);
                expect(column[3]).toBe(16);
            });
        });

        describe('Row1', () =>
        {
            it('Should get row 1 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const row = matrix.Row1;
                expect(row).toBeInstanceOf(Vector4);
                expect(row[0]).toBe(1);
                expect(row[1]).toBe(2);
                expect(row[2]).toBe(3);
                expect(row[3]).toBe(4);
            });
        });

        describe('Row2', () =>
        {
            it('Should get row 2 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const row = matrix.Row2;
                expect(row).toBeInstanceOf(Vector4);
                expect(row[0]).toBe(5);
                expect(row[1]).toBe(6);
                expect(row[2]).toBe(7);
                expect(row[3]).toBe(8);
            });
        });

        describe('Row3', () =>
        {
            it('Should get row 3 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const row = matrix.Row3;
                expect(row).toBeInstanceOf(Vector4);
                expect(row[0]).toBe(9);
                expect(row[1]).toBe(10);
                expect(row[2]).toBe(11);
                expect(row[3]).toBe(12);
            });
        });

        describe('Row4', () =>
        {
            it('Should get row 4 of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const row = matrix.Row4;
                expect(row).toBeInstanceOf(Vector4);
                expect(row[0]).toBe(13);
                expect(row[1]).toBe(14);
                expect(row[2]).toBe(15);
                expect(row[3]).toBe(16);
            });
        });

        describe('Diagonal', () =>
        {
            it('Should get the diagonal of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const diag = matrix.Diagonal;
                expect(diag).toBeInstanceOf(Vector4);
                expect(diag[0]).toBe(1);
                expect(diag[1]).toBe(6);
                expect(diag[2]).toBe(11);
                expect(diag[3]).toBe(16);
            });
        });

        describe('Trace', () =>
        {
            it('Should calculate the trace of the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                expect(matrix.Trace).toBe(34);
            });
        });

        describe('Matrix2', () =>
        {
            it('Should top let corner {Matrix2} of the matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = source.Matrix2;
                expect(matrix).toBeInstanceOf(Matrix2);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(2);
                expect(matrix[2]).toBe(5);
                expect(matrix[3]).toBe(6);
            });
        });

        describe('Matrix3', () =>
        {
            it('Should top let corner {Matrix3} of the matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = source.Matrix3;
                expect(matrix).toBeInstanceOf(Matrix3);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(2);
                expect(matrix[2]).toBe(3);
                expect(matrix[3]).toBe(5);
                expect(matrix[4]).toBe(6);
                expect(matrix[5]).toBe(7);
                expect(matrix[6]).toBe(9);
                expect(matrix[7]).toBe(10);
                expect(matrix[8]).toBe(11);
            });
        });
    });

    describe('Instance Methods', () =>
    {
        describe('Set', () => 
        {
            it('Should set all components when all arguments are passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.Set(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(17);
                expect(matrix[1]).toBe(18);
                expect(matrix[2]).toBe(19);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(21);
                expect(matrix[5]).toBe(22);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(24);
                expect(matrix[8]).toBe(25);
                expect(matrix[9]).toBe(26);
                expect(matrix[10]).toBe(27);
                expect(matrix[11]).toBe(28);
                expect(matrix[12]).toBe(29);
                expect(matrix[13]).toBe(30);
                expect(matrix[14]).toBe(31);
                expect(matrix[15]).toBe(32);
            });

            it('Should set all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                matrix.Set(other);
                expect(matrix[0]).toBe(17);
                expect(matrix[1]).toBe(18);
                expect(matrix[2]).toBe(19);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(21);
                expect(matrix[5]).toBe(22);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(24);
                expect(matrix[8]).toBe(25);
                expect(matrix[9]).toBe(26);
                expect(matrix[10]).toBe(27);
                expect(matrix[11]).toBe(28);
                expect(matrix[12]).toBe(29);
                expect(matrix[13]).toBe(30);
                expect(matrix[14]).toBe(31);
                expect(matrix[15]).toBe(32);
            });

            it('Should set all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                matrix.Set(other);
                expect(matrix[0]).toBe(17);
                expect(matrix[1]).toBe(18);
                expect(matrix[2]).toBe(19);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(21);
                expect(matrix[5]).toBe(22);
                expect(matrix[6]).toBe(23);
                expect(matrix[7]).toBe(24);
                expect(matrix[8]).toBe(25);
                expect(matrix[9]).toBe(26);
                expect(matrix[10]).toBe(27);
                expect(matrix[11]).toBe(28);
                expect(matrix[12]).toBe(29);
                expect(matrix[13]).toBe(30);
                expect(matrix[14]).toBe(31);
                expect(matrix[15]).toBe(32);
            });
        });

        describe('Add', () => 
        {
            it('Should add all components when all arguments are passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.Add(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should add all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                matrix.Add(other);
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should add all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                matrix.Add(other);
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });
        });

        describe('Subtract', () => 
        {
            it('Should subtract all components when all arguments are passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.Subtract(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should subtract all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                matrix.Subtract(other);
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should subtract all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                matrix.Subtract(other);
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });
        });

        describe('Multiply', () => 
        {
            it('Should multiply all components when all arguments are passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.Multiply(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should multiply all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                matrix.Multiply(other);
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should multiply all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                matrix.Multiply(other);
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });
        });

        describe('Scale', () => 
        {
            it('Should multiply all components by the scalar passed', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
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
                expect(matrix[9]).toBe(50);
                expect(matrix[10]).toBe(55);
                expect(matrix[11]).toBe(60);
                expect(matrix[12]).toBe(65);
                expect(matrix[13]).toBe(70);
                expect(matrix[14]).toBe(75);
                expect(matrix[15]).toBe(80);
            });
        });

        describe('Transpose', () => 
        {
            it('Should transpose the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.Transpose();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(5);
                expect(matrix[2]).toBe(9);
                expect(matrix[3]).toBe(13);
                expect(matrix[4]).toBe(2);
                expect(matrix[5]).toBe(6);
                expect(matrix[6]).toBe(10);
                expect(matrix[7]).toBe(14);
                expect(matrix[8]).toBe(3);
                expect(matrix[9]).toBe(7);
                expect(matrix[10]).toBe(11);
                expect(matrix[11]).toBe(15);
                expect(matrix[12]).toBe(4);
                expect(matrix[13]).toBe(8);
                expect(matrix[14]).toBe(12);
                expect(matrix[15]).toBe(16);
            });
        });




        describe('Inverse', () => 
        {
            it('Should attempt to invert the matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
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
                expect(matrix[9]).toBe(10);
                expect(matrix[10]).toBe(11);
                expect(matrix[11]).toBe(12);
                expect(matrix[12]).toBe(13);
                expect(matrix[13]).toBe(14);
                expect(matrix[14]).toBe(15);
                expect(matrix[15]).toBe(16);
            });

            it('Should successfully invert the matrix', () =>
            {
                const matrix = new Matrix4(
                    5, 6, 4, 7,
                    9, 1, 3, 2,
                    4, 8, 9, 3,
                    1, 3, 2, 4
                );
                matrix.Inverse();
                expect(matrix[0]).toBeCloseTo(61 / 269);
                expect(matrix[1]).toBeCloseTo(11 / 269);
                expect(matrix[2]).toBeCloseTo(-7 / 269);
                expect(matrix[3]).toBeCloseTo(-107 / 269);
                expect(matrix[4]).toBeCloseTo(229 / 269);
                expect(matrix[5]).toBeCloseTo(-91 / 269);
                expect(matrix[6]).toBeCloseTo(9 / 269);
                expect(matrix[7]).toBeCloseTo(-362 / 269);
                expect(matrix[8]).toBeCloseTo(-202 / 269);
                expect(matrix[9]).toBeCloseTo(65 / 269);
                expect(matrix[10]).toBeCloseTo(32 / 269);
                expect(matrix[11]).toBeCloseTo(297 / 269);
                expect(matrix[12]).toBeCloseTo(-86 / 269);
                expect(matrix[13]).toBeCloseTo(33 / 269);
                expect(matrix[14]).toBeCloseTo(-21 / 269);
                expect(matrix[15]).toBeCloseTo(217 / 269);
            });
        });

        describe('Zero', () => 
        {
            it('Should set all the matrix entries to 0', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
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
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(0);
                expect(matrix[11]).toBe(0);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(0);
            });
        });

        describe('Identity', () => 
        {
            it('Should reset the matrix to an identity matrix', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                matrix.Identity();
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(0);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });
        });

        describe('Clone', () => 
        {
            it('Should create a new matrix with the same values as the source', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
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
                expect(clone[9]).toBe(matrix[9]);
                expect(clone[10]).toBe(matrix[10]);
                expect(clone[11]).toBe(matrix[11]);
                expect(clone[12]).toBe(matrix[12]);
                expect(clone[13]).toBe(matrix[13]);
                expect(clone[14]).toBe(matrix[14]);
                expect(clone[15]).toBe(matrix[15]);
            });
        });

        describe('Equals', () => 
        {
            it('Should succeed when two matrices have the same values', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const equals = matrix.Equals(other);
                expect(equals).toBeTruthy();
            });

            it('Should succeed not when two matrices have the different values', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const other = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 17
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
                const matrix = Matrix4.Zero;
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(0);
                expect(matrix[11]).toBe(0);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(0);
            });
        });

        describe('Identity', () => 
        {
            it('Should create a new identity matrix', () =>
            {
                const matrix = Matrix4.Identity;
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(0);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });
        });
    });

    describe('Static Methods', () => 
    {
        describe('Add', () => 
        {
            it('Should compnent-wise add the values together and return a new matrix with the sum', () => 
            {
                const matrix = Matrix4.Add(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,

                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should compnent-wise add the values together and set a matrix with the sum', () => 
            {
                const matrix = new Matrix4();
                Matrix4.Add(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,

                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32,

                    matrix
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should add two matrices and return a new matrix with the sum', () => 
            {
                const first = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const second = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                const matrix = Matrix4.Add(
                    first,
                    second
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should add two matrices and set a matrix with the sum', () => 
            {
                const first = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const second = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                const matrix = new Matrix4();
                Matrix4.Add(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should add two 4-component arrays and return a new matrix with the sum', () =>
            {
                const first: Matrix4Array = [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ];
                const second: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                const matrix = Matrix4.Add(
                    first,
                    second
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });

            it('Should add two 4-component arrays and set a matrix with the sum', () =>
            {
                const first: Matrix4Array = [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ];
                const second: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                const matrix = new Matrix4();
                Matrix4.Add(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(18);
                expect(matrix[1]).toBe(20);
                expect(matrix[2]).toBe(22);
                expect(matrix[3]).toBe(24);
                expect(matrix[4]).toBe(26);
                expect(matrix[5]).toBe(28);
                expect(matrix[6]).toBe(30);
                expect(matrix[7]).toBe(32);
                expect(matrix[8]).toBe(34);
                expect(matrix[9]).toBe(36);
                expect(matrix[10]).toBe(38);
                expect(matrix[11]).toBe(40);
                expect(matrix[12]).toBe(42);
                expect(matrix[13]).toBe(44);
                expect(matrix[14]).toBe(46);
                expect(matrix[15]).toBe(48);
            });
        });

        describe('Subtract', () => 
        {
            it('Should compnent-wise subtract the values together and return a new matrix with the difference', () => 
            {
                const matrix = Matrix4.Subtract(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,

                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should compnent-wise subtract the values together and set a matrix with the difference', () => 
            {
                const matrix = new Matrix4();
                Matrix4.Subtract(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,

                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32,

                    matrix
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should subtract two matrices and return a new matrix with the difference', () => 
            {
                const first = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const second = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                const matrix = Matrix4.Subtract(
                    first,
                    second
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should subtract two matrices and set a matrix with the difference', () => 
            {
                const first = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const second = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                const matrix = new Matrix4();
                Matrix4.Subtract(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should subtract two 4-component arrays and return a new matrix with the difference', () =>
            {
                const first: Matrix4Array = [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ];
                const second: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                const matrix = Matrix4.Subtract(
                    first,
                    second
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });

            it('Should subtract two 4-component arrays and set a matrix with the difference', () =>
            {
                const first: Matrix4Array = [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ];
                const second: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                const matrix = new Matrix4();
                Matrix4.Subtract(
                    first,
                    second,
                    matrix
                );
                expect(matrix[0]).toBe(-16);
                expect(matrix[1]).toBe(-16);
                expect(matrix[2]).toBe(-16);
                expect(matrix[3]).toBe(-16);
                expect(matrix[4]).toBe(-16);
                expect(matrix[5]).toBe(-16);
                expect(matrix[6]).toBe(-16);
                expect(matrix[7]).toBe(-16);
                expect(matrix[8]).toBe(-16);
                expect(matrix[9]).toBe(-16);
                expect(matrix[10]).toBe(-16);
                expect(matrix[11]).toBe(-16);
                expect(matrix[12]).toBe(-16);
                expect(matrix[13]).toBe(-16);
                expect(matrix[14]).toBe(-16);
                expect(matrix[15]).toBe(-16);
            });
        });

        describe('Multiply', () => 
        {
            it('Should compnent-wise multiply the values together and return a new matrix with the product', () => 
            {
                const matrix = Matrix4.Multiply(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,

                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should compnent-wise multiply the values together and set a matrix with the product', () => 
            {
                const matrix = new Matrix4();
                Matrix4.Multiply(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,

                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32,

                    matrix
                );
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should multiply two matrices and return a new matrix with the product', () => 
            {
                const first = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const second = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                const matrix = Matrix4.Multiply(first, second);
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should multiply two matrices and set a matrix with the product', () => 
            {
                const first = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const second = new Matrix4(
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                );
                const matrix = new Matrix4();
                Matrix4.Multiply(first, second, matrix);
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should multiply two 4-component arrays and return a new matrix with the product', () =>
            {
                const first: Matrix4Array = [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ];
                const second: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                const matrix = Matrix4.Multiply(first, second);
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });

            it('Should multiply two 4-component arrays and set a matrix with the product', () =>
            {
                const first: Matrix4Array = [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ];
                const second: Matrix4Array = [
                    17, 18, 19, 20,
                    21, 22, 23, 24,
                    25, 26, 27, 28,
                    29, 30, 31, 32
                ];
                const matrix = new Matrix4();
                Matrix4.Multiply(first, second, matrix);
                expect(matrix[0]).toBe(250);
                expect(matrix[1]).toBe(260);
                expect(matrix[2]).toBe(270);
                expect(matrix[3]).toBe(280);
                expect(matrix[4]).toBe(618);
                expect(matrix[5]).toBe(644);
                expect(matrix[6]).toBe(670);
                expect(matrix[7]).toBe(696);
                expect(matrix[8]).toBe(986);
                expect(matrix[9]).toBe(1028);
                expect(matrix[10]).toBe(1070);
                expect(matrix[11]).toBe(1112);
                expect(matrix[12]).toBe(1354);
                expect(matrix[13]).toBe(1412);
                expect(matrix[14]).toBe(1470);
                expect(matrix[15]).toBe(1528);
            });
        });

        describe('Scale', () => 
        {
            it('Should scale a matrix and return the new scaled matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = Matrix4.Scale(source, 5);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(25);
                expect(matrix[5]).toBe(30);
                expect(matrix[6]).toBe(35);
                expect(matrix[7]).toBe(40);
                expect(matrix[8]).toBe(45);
                expect(matrix[9]).toBe(50);
                expect(matrix[10]).toBe(55);
                expect(matrix[11]).toBe(60);
                expect(matrix[12]).toBe(65);
                expect(matrix[13]).toBe(70);
                expect(matrix[14]).toBe(75);
                expect(matrix[15]).toBe(80);
            });

            it('Should scale a matrix and set the output matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = new Matrix4();
                Matrix4.Scale(source, 5, matrix);
                expect(matrix[0]).toBe(5);
                expect(matrix[1]).toBe(10);
                expect(matrix[2]).toBe(15);
                expect(matrix[3]).toBe(20);
                expect(matrix[4]).toBe(25);
                expect(matrix[5]).toBe(30);
                expect(matrix[6]).toBe(35);
                expect(matrix[7]).toBe(40);
                expect(matrix[8]).toBe(45);
                expect(matrix[9]).toBe(50);
                expect(matrix[10]).toBe(55);
                expect(matrix[11]).toBe(60);
                expect(matrix[12]).toBe(65);
                expect(matrix[13]).toBe(70);
                expect(matrix[14]).toBe(75);
                expect(matrix[15]).toBe(80);
            });
        });

        describe('Transpose', () => 
        {
            it('Should transpose a matrix and return the new tranpose matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = Matrix4.Transpose(source);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(5);
                expect(matrix[2]).toBe(9);
                expect(matrix[3]).toBe(13);
                expect(matrix[4]).toBe(2);
                expect(matrix[5]).toBe(6);
                expect(matrix[6]).toBe(10);
                expect(matrix[7]).toBe(14);
                expect(matrix[8]).toBe(3);
                expect(matrix[9]).toBe(7);
                expect(matrix[10]).toBe(11);
                expect(matrix[11]).toBe(15);
                expect(matrix[12]).toBe(4);
                expect(matrix[13]).toBe(8);
                expect(matrix[14]).toBe(12);
                expect(matrix[15]).toBe(16);
            });

            it('Should tranpose a matrix and set the output matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = new Matrix4();
                Matrix4.Transpose(source, matrix);
                expect(matrix[0]).toBe(1);
                expect(matrix[1]).toBe(5);
                expect(matrix[2]).toBe(9);
                expect(matrix[3]).toBe(13);
                expect(matrix[4]).toBe(2);
                expect(matrix[5]).toBe(6);
                expect(matrix[6]).toBe(10);
                expect(matrix[7]).toBe(14);
                expect(matrix[8]).toBe(3);
                expect(matrix[9]).toBe(7);
                expect(matrix[10]).toBe(11);
                expect(matrix[11]).toBe(15);
                expect(matrix[12]).toBe(4);
                expect(matrix[13]).toBe(8);
                expect(matrix[14]).toBe(12);
                expect(matrix[15]).toBe(16);
            });
        });

        describe('Inverse', () => 
        {
            it('Should not invert a matrix and return the new matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = Matrix4.Inverse(source);
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(0);
                expect(matrix[11]).toBe(0);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(0);
            });

            it('Should not invert a matrix and not set the output matrix', () =>
            {
                const source = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                );
                const matrix = new Matrix4();
                Matrix4.Inverse(source, matrix);
                expect(matrix[0]).toBe(0);
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(0);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(0);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(0);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(0);
                expect(matrix[11]).toBe(0);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(0);
            });

            it('Should invert a matrix and return the new inverse matrix', () =>
            {
                const source = new Matrix4(
                    5, 6, 4, 7,
                    9, 1, 3, 2,
                    4, 8, 9, 3,
                    1, 3, 2, 4
                );
                const matrix = Matrix4.Inverse(source);
                expect(matrix[0]).toBeCloseTo(61 / 269);
                expect(matrix[1]).toBeCloseTo(11 / 269);
                expect(matrix[2]).toBeCloseTo(-7 / 269);
                expect(matrix[3]).toBeCloseTo(-107 / 269);
                expect(matrix[4]).toBeCloseTo(229 / 269);
                expect(matrix[5]).toBeCloseTo(-91 / 269);
                expect(matrix[6]).toBeCloseTo(9 / 269);
                expect(matrix[7]).toBeCloseTo(-362 / 269);
                expect(matrix[8]).toBeCloseTo(-202 / 269);
                expect(matrix[9]).toBeCloseTo(65 / 269);
                expect(matrix[10]).toBeCloseTo(32 / 269);
                expect(matrix[11]).toBeCloseTo(297 / 269);
                expect(matrix[12]).toBeCloseTo(-86 / 269);
                expect(matrix[13]).toBeCloseTo(33 / 269);
                expect(matrix[14]).toBeCloseTo(-21 / 269);
                expect(matrix[15]).toBeCloseTo(217 / 269);
            });

            it('Should invert a matrix and set the output matrix', () =>
            {
                const source = new Matrix4(
                    5, 6, 4, 7,
                    9, 1, 3, 2,
                    4, 8, 9, 3,
                    1, 3, 2, 4
                );
                const matrix = new Matrix4();
                Matrix4.Inverse(source, matrix);
                expect(matrix[0]).toBeCloseTo(61 / 269);
                expect(matrix[1]).toBeCloseTo(11 / 269);
                expect(matrix[2]).toBeCloseTo(-7 / 269);
                expect(matrix[3]).toBeCloseTo(-107 / 269);
                expect(matrix[4]).toBeCloseTo(229 / 269);
                expect(matrix[5]).toBeCloseTo(-91 / 269);
                expect(matrix[6]).toBeCloseTo(9 / 269);
                expect(matrix[7]).toBeCloseTo(-362 / 269);
                expect(matrix[8]).toBeCloseTo(-202 / 269);
                expect(matrix[9]).toBeCloseTo(65 / 269);
                expect(matrix[10]).toBeCloseTo(32 / 269);
                expect(matrix[11]).toBeCloseTo(297 / 269);
                expect(matrix[12]).toBeCloseTo(-86 / 269);
                expect(matrix[13]).toBeCloseTo(33 / 269);
                expect(matrix[14]).toBeCloseTo(-21 / 269);
                expect(matrix[15]).toBeCloseTo(217 / 269);
            });
        });

        describe('MultiplyVector', () => 
        {
            it('Should multiply a matrix with 2 numbers and return a {Vector4} with the product', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,
                );
                const result = Matrix4.MultiplyVector(matrix, 17, 18, 19, 20);
                expect(result[0]).toBe(190);
                expect(result[1]).toBe(486);
                expect(result[2]).toBe(782);
                expect(result[3]).toBe(1078);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector4} with the product', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,
                );
                const result = new Vector4();
                Matrix4.MultiplyVector(matrix, 17, 18, 19, 20, result);
                expect(result[0]).toBe(190);
                expect(result[1]).toBe(486);
                expect(result[2]).toBe(782);
                expect(result[3]).toBe(1078);
            });

            it('Should multiply a matrix with 2 numbers and return a {Vector4} with the product', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,
                );
                const vector = new Vector4(17, 18, 19, 20);
                const result = Matrix4.MultiplyVector(matrix, vector);
                expect(result[0]).toBe(190);
                expect(result[1]).toBe(486);
                expect(result[2]).toBe(782);
                expect(result[3]).toBe(1078);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector4} with the product', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,
                );
                const vector = new Vector4(17, 18, 19, 20);
                const result = new Vector4();
                Matrix4.MultiplyVector(matrix, vector, result);
                expect(result[0]).toBe(190);
                expect(result[1]).toBe(486);
                expect(result[2]).toBe(782);
                expect(result[3]).toBe(1078);
            });

            it('Should multiply a matrix with 2 numbers and return a {Vector4} with the product', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,
                );
                const vector: Vector4Array = [17, 18, 19, 20];
                const result = Matrix4.MultiplyVector(matrix, vector);
                expect(result[0]).toBe(190);
                expect(result[1]).toBe(486);
                expect(result[2]).toBe(782);
                expect(result[3]).toBe(1078);
            });

            it('Should multiply a matrix with 2 numbers and set a {Vector4} with the product', () =>
            {
                const matrix = new Matrix4(
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16,
                );
                const vector: Vector4Array = [17, 18, 19, 20];
                const result = new Vector4();
                Matrix4.MultiplyVector(matrix, vector, result);
                expect(result[0]).toBe(190);
                expect(result[1]).toBe(486);
                expect(result[2]).toBe(782);
                expect(result[3]).toBe(1078);
            });
        });


        describe('TranslationMatrix', () => 
        {
            it('Should create a new translation matrix using number inputs', () =>
            {
                const matrix = Matrix4.TranslationMatrix(3, 5, 7);
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(3);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(5);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(7);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });

            it('Should set a given matrix as a translation matrix using number inputs', () =>
            {
                const matrix = new Matrix4();
                Matrix4.TranslationMatrix(3, 5, 7, matrix);
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(3);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(5);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(7);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });
            
            it('Should create a new translation matrix using an array input', () =>
            {
                const translation = [3, 5, 7] as Vector3Array
                const matrix = Matrix4.TranslationMatrix(translation);
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(3);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(5);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(7);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });

            it('Should set a given matrix as a translation matrix using an array input', () =>
            {
                const translation = [3, 5, 7] as Vector3Array
                const matrix = new Matrix4();
                Matrix4.TranslationMatrix(translation,matrix);
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(3);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(5);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(7);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });
            
            it('Should create a new translation matrix using a vector input', () =>
            {
                const translation = new Vector3(3, 5, 7)
                const matrix = Matrix4.TranslationMatrix(translation);
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(3);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(5);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(7);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });

            it('Should set a given matrix as a translation matrix using a vector input', () =>
            {
                const translation = new Vector3(3, 5, 7)
                const matrix = new Matrix4();
                Matrix4.TranslationMatrix(translation, matrix);
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0);
                expect(matrix[2]).toBe(0);
                expect(matrix[3]).toBe(3);
                expect(matrix[4]).toBe(0);
                expect(matrix[5]).toBe(1);
                expect(matrix[6]).toBe(0);
                expect(matrix[7]).toBe(5);
                expect(matrix[8]).toBe(0);
                expect(matrix[9]).toBe(0);
                expect(matrix[10]).toBe(1);
                expect(matrix[11]).toBe(7);
                expect(matrix[12]).toBe(0);
                expect(matrix[13]).toBe(0);
                expect(matrix[14]).toBe(0);
                expect(matrix[15]).toBe(1);
            });
        });

        // describe('RotationMatrix', () => 
        // {
        //     const theta = radian(60);
        //     const cosTheta = Math.cos(theta);
        //     const sinTheta = Math.sin(theta);

        //     it('Should create a new rotation matrix', () =>
        //     {
        //         const matrix = Matrix4.RotationMatrix(60);
        //         expect(matrix[0]).toBeCloseTo(cosTheta);
        //         expect(matrix[1]).toBeCloseTo(sinTheta);
        //         expect(matrix[2]).toBeCloseTo(-sinTheta);
        //         expect(matrix[3]).toBeCloseTo(cosTheta);
        //     });

        //     it('Should set a given matrix as a rotation matrix', () =>
        //     {
        //         const matrix = new Matrix4(1, 2, 3, 4);
        //         Matrix4.RotationMatrix(60, matrix);
        //         expect(matrix[0]).toBeCloseTo(cosTheta);
        //         expect(matrix[1]).toBeCloseTo(sinTheta);
        //         expect(matrix[2]).toBeCloseTo(-sinTheta);
        //         expect(matrix[3]).toBeCloseTo(cosTheta);
        //     });
        // });

        // describe('ScaleMatrix', () => 
        // {
        //     it('Should create a new rotation matrix', () =>
        //     {
        //         const matrix = Matrix4.ScaleMatrix(45);
        //         expect(matrix[0]).toBe(45);
        //         expect(matrix[1]).toBe(0);
        //         expect(matrix[2]).toBe(0);
        //         expect(matrix[3]).toBe(45);
        //     });

        //     it('Should set a given matrix as a rotation matrix', () =>
        //     {
        //         const matrix = new Matrix4(1, 2, 3, 4);
        //         Matrix4.ScaleMatrix(45, matrix);
        //         expect(matrix[0]).toBe(45);
        //         expect(matrix[1]).toBe(0);
        //         expect(matrix[2]).toBe(0);
        //         expect(matrix[3]).toBe(45);
        //     });
        // });
    });
});

/**
 * @jest-environment jsdom
 */

import { Matrix2, Matrix2Array } from "./Matrix2"
 
describe('Matrix2', () =>
{
    describe('Matrix instance creation', () => 
    {
        it('Should create a new instance of a {Matrix2} class', () =>
        {
            const matrix = new Matrix2()
            expect(matrix).toBeInstanceOf(Matrix2)
            expect(matrix).not.toBeNull()
            expect(matrix).not.toBeUndefined()
        })
        
        it('Should default all components to 0 when no arguments are passed', () =>
        {
            const matrix = new Matrix2()
            expect(matrix[0]).toBe(0)
            expect(matrix[1]).toBe(0)
            expect(matrix[2]).toBe(0)
            expect(matrix[3]).toBe(0)
        })

        it('Should assign diagonal component when an integer argument is passed', () =>
        {
            const matrix = new Matrix2(7)
            expect(matrix[0]).toBe(7)
            expect(matrix[1]).toBe(0)
            expect(matrix[2]).toBe(0)
            expect(matrix[3]).toBe(7)
        })

        it('Should assign component when integer arguments are passed', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix[0]).toBe(1)
            expect(matrix[1]).toBe(2)
            expect(matrix[2]).toBe(3)
            expect(matrix[3]).toBe(4)
        })

        it('Should assign component-wise when another matrix is passed', () =>
        {
            const other = new Matrix2(5, 6, 7, 8)
            const matrix = new Matrix2(other)
            expect(matrix[0]).toBe(5)
            expect(matrix[1]).toBe(6)
            expect(matrix[2]).toBe(7)
            expect(matrix[3]).toBe(8)
        })

        it('Should assign component-wise when a 4-component array is passed', () =>
        {
            const other: Matrix2Array = [5, 6, 7, 8]
            const matrix = new Matrix2(other)
            expect(matrix[0]).toBe(5)
            expect(matrix[1]).toBe(6)
            expect(matrix[2]).toBe(7)
            expect(matrix[3]).toBe(8)
        })

        it('Should assign component-wise when an array buffer is passed', () =>
        {
            const buffer = new Float32Array([1,2,3,4,5,6])
            const matrix = new Matrix2(buffer.buffer)
            expect(matrix[0]).toBe(1)
            expect(matrix[1]).toBe(2)
            expect(matrix[2]).toBe(3)
            expect(matrix[3]).toBe(4)
        })

        it('Should assign component-wise when an array buffer is passed with an offset', () =>
        {
            const buffer = new Float32Array([1,2,3,4,5,6])
            const matrix = new Matrix2(buffer.buffer, Float32Array.BYTES_PER_ELEMENT)
            expect(matrix[0]).toBe(2)
            expect(matrix[1]).toBe(3)
            expect(matrix[2]).toBe(4)
            expect(matrix[3]).toBe(5)
        })
    })
    
    describe('Local Properties', () => 
    {        
        it('Should get entry a11', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix.M11).toBe(1)
        })

        it('Should set entry a11', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            matrix.M11 = 7
            expect(matrix.M11).toBe(7)
        })

        it('Should get entry a12', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix.M12).toBe(2)
        })

        it('Should set entry a12', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            matrix.M12 = 7
            expect(matrix.M12).toBe(7)
        })

        it('Should get entry a21', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix.M21).toBe(3)
        })

        it('Should set entry a21', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            matrix.M21 = 7
            expect(matrix.M21).toBe(7)
        })

        it('Should get entry a22', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix.M22).toBe(4)
        })

        it('Should set entry a22', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            matrix.M22 = 7
            expect(matrix.M22).toBe(7)
        })

        it('Should calculate the determinant of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix.Determinant).toBe(-2)
        })

        it('Should get column 1 of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            const column = matrix.Column1
            expect(column[0]).toBe(1)
            expect(column[1]).toBe(3)
        })

        it('Should get column 2 of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            const column = matrix.Column2
            expect(column[0]).toBe(2)
            expect(column[1]).toBe(4)
        })

        it('Should get row 1 of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            const row = matrix.Row1
            expect(row[0]).toBe(1)
            expect(row[1]).toBe(2)
        })

        it('Should get row 2 of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            const row = matrix.Row2
            expect(row[0]).toBe(3)
            expect(row[1]).toBe(4)
        })

        it('Should get the fiagonal of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            const diag = matrix.Diagonal
            expect(diag[0]).toBe(1)
            expect(diag[1]).toBe(4)
        })

        it('Should calculate the trace of the matrix', () =>
        {
            const matrix = new Matrix2(1, 2, 3, 4)
            expect(matrix.Trace).toBe(5)
        })
    })

    describe('Local Methods', () =>
    {
        describe('Set', () => 
        {        
            it('Should set all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Set(5, 6, 7, 8)
                expect(matrix[0]).toBe(5)
                expect(matrix[1]).toBe(6)
                expect(matrix[2]).toBe(7)
                expect(matrix[3]).toBe(8)
            })

            it('Should set all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other = new Matrix2(5, 6, 7, 8)
                matrix.Set(other)
                expect(matrix[0]).toBe(5)
                expect(matrix[1]).toBe(6)
                expect(matrix[2]).toBe(7)
                expect(matrix[3]).toBe(8)
            })

            it('Should set all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other: Matrix2Array = [5, 6, 7, 8]
                matrix.Set(other)
                expect(matrix[0]).toBe(5)
                expect(matrix[1]).toBe(6)
                expect(matrix[2]).toBe(7)
                expect(matrix[3]).toBe(8)
            })
        })
        
        describe('Add', () => 
        {        
            it('Should add all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Add(5, 6, 7, 8)
                expect(matrix[0]).toBe(6)
                expect(matrix[1]).toBe(8)
                expect(matrix[2]).toBe(10)
                expect(matrix[3]).toBe(12)
            })

            it('Should add all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other = new Matrix2(5, 6, 7, 8)
                matrix.Add(other)
                expect(matrix[0]).toBe(6)
                expect(matrix[1]).toBe(8)
                expect(matrix[2]).toBe(10)
                expect(matrix[3]).toBe(12)
            })
            it('Should add all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other: Matrix2Array = [5, 6, 7, 8]
                matrix.Add(other)
                expect(matrix[0]).toBe(6)
                expect(matrix[1]).toBe(8)
                expect(matrix[2]).toBe(10)
                expect(matrix[3]).toBe(12)
            })
        })
                
        describe('Subtract', () => 
        {        
            it('Should subtract all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Subtract(5, 6, 7, 8)
                expect(matrix[0]).toBe(-4)
                expect(matrix[1]).toBe(-4)
                expect(matrix[2]).toBe(-4)
                expect(matrix[3]).toBe(-4)
            })

            it('Should subtract all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other = new Matrix2(5, 6, 7, 8)
                matrix.Subtract(other)
                expect(matrix[0]).toBe(-4)
                expect(matrix[1]).toBe(-4)
                expect(matrix[2]).toBe(-4)
                expect(matrix[3]).toBe(-4)
            })

            it('Should subtract all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other: Matrix2Array = [5, 6, 7, 8]
                matrix.Subtract(other)
                expect(matrix[0]).toBe(-4)
                expect(matrix[1]).toBe(-4)
                expect(matrix[2]).toBe(-4)
                expect(matrix[3]).toBe(-4)
            })
        })
                
        describe('Multiply', () => 
        {        
            it('Should multiply all components when all arguments are passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Multiply(5, 6, 7, 8)
                expect(matrix[0]).toBe(19)
                expect(matrix[1]).toBe(22)
                expect(matrix[2]).toBe(43)
                expect(matrix[3]).toBe(50)
            })

            it('Should multiply all entries component-wise when another matrix is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other = new Matrix2(5, 6, 7, 8)
                matrix.Multiply(other)
                expect(matrix[0]).toBe(19)
                expect(matrix[1]).toBe(22)
                expect(matrix[2]).toBe(43)
                expect(matrix[3]).toBe(50)
            })

            it('Should multiply all entries component-wise when a 4-component array is passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other: Matrix2Array = [5, 6, 7, 8]
                matrix.Multiply(other)
                expect(matrix[0]).toBe(19)
                expect(matrix[1]).toBe(22)
                expect(matrix[2]).toBe(43)
                expect(matrix[3]).toBe(50)
            })
        })

        describe('Scale', () => 
        {        
            it('Should multiply all components by the scalar passed', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Scale(5)
                expect(matrix[0]).toBe(5)
                expect(matrix[1]).toBe(10)
                expect(matrix[2]).toBe(15)
                expect(matrix[3]).toBe(20)
            })
        })
  
        describe('Transpose', () => 
        {        
            it('Should transpose the matrix', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Transpose()
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(3)
                expect(matrix[2]).toBe(2)
                expect(matrix[3]).toBe(4)
            })
        })
  
        describe('Inverse', () => 
        {        
            it('Should attempt to invert the matrix', () =>
            {
                const matrix = new Matrix2(0, 2, 0, 4)
                matrix.Inverse()
                expect(matrix[0]).toBe(0)
                expect(matrix[1]).toBe(2)
                expect(matrix[2]).toBe(0)
                expect(matrix[3]).toBe(4)
            })

            it('Should successfully invert the matrix', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Inverse()
                expect(matrix[0]).toBe(-2)
                expect(matrix[1]).toBe(1)
                expect(matrix[2]).toBe(1.5)
                expect(matrix[3]).toBe(-0.5)
            })
        })
  
        describe('Zero', () => 
        {        
            it('Should set all the matrix entries to 0', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Zero()
                expect(matrix[0]).toBe(0)
                expect(matrix[1]).toBe(0)
                expect(matrix[2]).toBe(0)
                expect(matrix[3]).toBe(0)
            })
        })

        describe('Identity', () => 
        {        
            it('Should reset the matrix to an identity matrix', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                matrix.Identity()
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0)
                expect(matrix[2]).toBe(0)
                expect(matrix[3]).toBe(1)
            })
        })

        describe('Clone', () => 
        {        
            it('Should create a new matrix with the same values as the source', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const clone = matrix.Clone()
                
                expect(matrix).not.toEqual(clone)
                expect(clone[0]).toBe(matrix[0])
                expect(clone[1]).toBe(matrix[1])
                expect(clone[2]).toBe(matrix[2])
                expect(clone[3]).toBe(matrix[3])
            })
        })

        describe('Equals', () => 
        {        
            it('Should succeed when two matrices have the same values', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other = new Matrix2(1, 2, 3, 4)
                const equals = matrix.Equals(other)
                expect(equals).toBeTruthy()
            })

            it('Should succeed not when two matrices have the different values', () =>
            {
                const matrix = new Matrix2(1, 2, 3, 4)
                const other = new Matrix2(1, 2, 3, 5)
                const equals = matrix.Equals(other)
                expect(equals).toBeFalsy()
            })
        })
    })
    
    describe('Static Properties', () => 
    {
        describe('Zero', () => 
        {
            it('Should create a new empty matrix', () =>
            {
                const matrix = Matrix2.Zero
                expect(matrix[0]).toBe(0)
                expect(matrix[1]).toBe(0)
                expect(matrix[2]).toBe(0)
                expect(matrix[3]).toBe(0)
            })
        })

        describe('Identity', () => 
        {
            it('Should create a new identity matrix', () =>
            {
                const matrix = Matrix2.Identity
                expect(matrix[0]).toBe(1)
                expect(matrix[1]).toBe(0)
                expect(matrix[2]).toBe(0)
                expect(matrix[3]).toBe(1)
            })
        })
    })

    describe('Static Methods', () => 
    {
        describe('Add', () => 
        {
        })
        
        describe('Subtract', () => 
        {
        })
        
        describe('Multiply', () => 
        {
        })
        
        describe('Scale', () => 
        {
        })
        
        describe('Transpose', () => 
        {
        })
        
        describe('Inverse', () => 
        {
        })
        
        describe('MultiplyVector', () => 
        {
        })
        
        describe('RotationMatrix', () => 
        {
        })
        
        describe('ScaleMatrix', () => 
        {
        })
    })
})
 
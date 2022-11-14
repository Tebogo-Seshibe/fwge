/**
 * @jest-environment jsdom
 */

import { Matrix2 } from '../src/matrix'
import { describe, it, expect } from'@jest/globals'

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
    })
})

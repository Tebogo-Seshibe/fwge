import { Matrix2 } from '../../src'

describe('Matrix2', () =>
{
    it('Should create a new instance of a matrix', () =>
    {
        const matrix = new Matrix2()
        
        expect(matrix).not.toBe(null)
        expect(matrix).not.toBe(undefined)
    })
})
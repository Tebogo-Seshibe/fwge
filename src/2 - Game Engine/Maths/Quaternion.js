/**
 * @name        Quaternion
 * @module      FWGE.Maths
 * @description ...
 */

/**
 * @param {number}  w
 * @param {number}  x
 * @param {number}  y
 * @param {number}  z
 */
function Quaternion(w, x, y, z)
{
    Vector4.call(this, w, x, y, z);
}

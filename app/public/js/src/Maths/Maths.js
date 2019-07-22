const SIGNIFICANT_FIGURES = Math.pow(10, 6);
export function Sigfigs(value) {
    return (Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES);
}
export default class Maths {
    static Radian(degree) {
        return Math.PI / 180 * degree;
    }
    static Cot(angle) {
        return 1 / Math.tan(angle);
    }
    static Clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }
    static CleanFloat(value) {
        return (Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES);
    }
    static IsPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
}
//# sourceMappingURL=Maths.js.map
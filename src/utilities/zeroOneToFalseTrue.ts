export const zeroOneToFalseTrue = (val: 0 | 1) => {
    return val === 0? false: true;
}
export const falseTrueToZeroOne = (val: boolean) => {
    return val? 1: 0;
}
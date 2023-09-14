
/**
 * References:
 * https://github.com/jbuchmueller/motionrugs/blob/master/src/main/java/dbvis/motionrugs/strategies/HilbertCurveStrategy.java
 * http://stackoverflow.com/questions/106237/calculate-the-hilbert-value-of-a-point-for-use-in-a-hilbert-r-tree
 *
 **/
import {RugDataRow} from "./types/DataPoint";

export const hilbertSort = (unsorted: Array<Array<RugDataRow>>, hilbertOrder: number = 2) => {
    const result = Array(unsorted[0].length);
    for (let i = 0; i < result.length; i++) {
        result[i] = [];
    }
    for (let x = 0; x < unsorted.length; x += 1) {
        const idxs = Array(unsorted[x].length);
        const hilbertVals = Array(unsorted[x].length);

        //calculate the z-ordering numbers
        for (let y = 0; y < unsorted[x].length; y++) {
            idxs[y] = y;
            hilbertVals[y] = encode(unsorted[x][y].avg_distance, unsorted[x][y].news_id, hilbertOrder);
        }

        //sort the index array
        idxs.sort((o1: number, o2: number) => hilbertVals[o1] - hilbertVals[o2]);

        //sort result according to z-ordering
        for (let y = 0; y < unsorted[x].length; y++) {
            result[x][y] = unsorted[x][idxs[y]];
        }
    }
    return result;
}

const encode = (x: number, y: number, r: number) => {
    const mask = (1 << r) - 1;
    const heven = x ^ y;
    const notx = ~x & mask;
    const noty = ~y & mask;
    const temp = notx ^ y;

    let v0 = 0, v1 = 0;
    for (let k = 1; k < r; k++) {
        v1 = ((v1 & heven) | ((v0 ^ noty) & temp)) >> 1;
        v0 = ((v0 & (v1 ^ notx)) | (~v0 & (v1 ^ noty))) >> 1;
    }
    let hodd = (~v0 & (v1 ^ x)) | (v0 & (v1 ^ noty));

    return interleaveBits(hodd, heven);
}

const interleaveBits = (odd: number, even: number) => {
    let val = 0;
    let max = Math.max(odd, even);
    let n = 0;
    while (max > 0) {
        n += 1;
        max >>= 1;
    }

    for (let i: number = 0; i < n; i++) {
        const bitMask = 1 << i;
        const a = (even & bitMask) > 0 ? (1 << (2 * i)) : 0;
        const b = (odd & bitMask) > 0 ? (1 << (2 * i + 1)) : 0;
        val += a + b;
    }

    return val;
}
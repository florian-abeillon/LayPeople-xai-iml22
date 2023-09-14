import { JsonDecoder } from 'ts.data.json';
import { DataPoint } from '../types/DataPoint';

/* **********
 * number[] *
 ********** */
const dataPointDecoder = JsonDecoder.object<DataPoint>(
    {
        X1: JsonDecoder.number,
        X2: JsonDecoder.number,
        cat: JsonDecoder.string,
        subcat: JsonDecoder.string,
        index: JsonDecoder.string,
        isInRecommendation: JsonDecoder.boolean,
    },
    'DataPoint'
);

/* ***********
 * DataArray *
 *********** */
export const dataArrayDecoder = JsonDecoder.array<DataPoint>(dataPointDecoder, 'DataArray');

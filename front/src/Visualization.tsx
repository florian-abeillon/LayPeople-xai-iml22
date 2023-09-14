import React from 'react';
import {DataCountArray, RugArray} from './types/DataArray';
import {Margins} from './types/Margins';
import {Group} from '@visx/group';
import {scaleLinear, scaleBand} from '@visx/scale';
import {AxisBottom, AxisLeft} from '@visx/axis';
import DataPointComponent from './components/DataPointComponent';
import {RugDataRow} from "./types/DataPoint";
import RugComponent from "./components/RugComponent";
import {hilbertSort} from "./utils";

const DEFAULT_MARGINS: Margins = {
    left: 100,
    top: 50,
    bottom: 100,
    right: 20,
};

interface RugProps extends Props {
    data: RugArray;
}

interface DataCountProps extends Props {
    data: DataCountArray;
}

interface Props {
    width: number;
    height: number;
    margins?: Margins;
}

const getXYMax = (width: number, height: number, margins = DEFAULT_MARGINS) => {
    let xMax = width - margins.left - margins.right,
        yMax = height - margins.top - margins.bottom;
    return {xMax, yMax};
};



export const HilbertCurveVisual: React.FunctionComponent<RugProps> = ({
                                                                          data,
                                                                          width,
                                                                          height,
                                                                          margins = DEFAULT_MARGINS
                                                                      }: RugProps) => {


    let {xMax, yMax} = getXYMax(width, height, margins);

    // scales
    const frameidx = data.map((d) => d.frame);
    const xScale = scaleBand()
        .domain(frameidx)
        .range([0, xMax]);

    const entriesPerFrame = 20;
    const yScale = scaleBand()
        .domain(Array(entriesPerFrame).keys())
        .range([0, yMax]);

    // sort into frames
    const rowsByFrame = Array(50);
     for (let i = 0; i < rowsByFrame.length; i++) {
        rowsByFrame[i] = [];
    }
    for (let row of data) {
        rowsByFrame[row.frame].push(row);
    }

    const sortedVals = hilbertSort(rowsByFrame);

    return (
        <svg width={width} height={height}>
            <Group left={margins.left} top={margins.top}>
                <AxisBottom top={yMax} scale={xScale} stroke='white'/>
                <AxisLeft scale={yScale} stroke='white'/>
                <text x="-200" y="-70" transform="rotate(-90)" fontSize={30} fill='white'>
                    Time
                </text>
                <text x="500" y="500" transform="rotate(0)" fontSize={30} fill='white'>
                    News Articles Recommended for Users
                </text>
                {
                    sortedVals.map((row: Array<RugDataRow>, idxFrame: number) => (
                        row.map((elem: RugDataRow, idxRow: number) => (
                            <RugComponent key={idxFrame + "-" + idxRow} x={xScale(elem.frame) || 0} y={yScale((idxRow)) || 0}
                                      to_colorize={elem.category}/>
                        ))
                    ))
                }
            </Group>
        </svg>
    );
};


export const Visualization: React.FunctionComponent<DataCountProps> = ({
                                                                           data,
                                                                           width,
                                                                           height,
                                                                           margins = DEFAULT_MARGINS
                                                                       }: DataCountProps) => {
    // figure bounds
    let {xMax, yMax} = getXYMax(width, height, margins);

    // scales
    const xValues = data.map(d => d.X);
    const xScale = scaleLinear<number>()
        .domain([Math.min(...xValues), Math.max(...xValues)])
        .range([0, xMax]);

    const labels = data.map((d) => d.label);
    const yScale = scaleBand()
        .domain(labels)
        .range([0, yMax]);

    return (
        <svg width={width} height={height}>
            <Group left={margins.left} top={margins.top}>
                {/* <GridRows scale={yScale} width={xMax} height={yMax} stroke="#eaf0f6" /> */}
                {/* <GridColumns scale={xScale} width={xMax} height={yMax} stroke="#eaf0f6" /> */}
                {/* <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="white" /> */}
                <AxisBottom top={yMax} scale={xScale} stroke='white'/>
                <AxisLeft scale={yScale} stroke='white'/>

                <text x="-200" y="-70" transform="rotate(-90)" fontSize={30} fill='white'>
                    Labels
                </text>
                <text x="500" y="500" transform="rotate(0)" fontSize={30} fill='white'>
                    Count
                </text>
                {data.map((d, idx) => (
                    <DataPointComponent key={idx} x={xScale(d.X)} y={yScale(d.label) || 0} color={'red'}/>
                ))}
            </Group>
        </svg>
    );
};

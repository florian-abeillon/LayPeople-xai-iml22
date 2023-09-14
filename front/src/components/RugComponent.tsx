import React from 'react';
import { Polygon } from '@visx/shape';

interface RugRowProps {
    x: number;
    y: number;
    to_colorize: number;
}

var COLORS: string[] = [];
while (COLORS.length < 100) {
    COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
}

// random number generator
function rand(frm: number, to: number) {
    return ~~(Math.random() * (to - frm)) + frm;
}

const RugComponent: React.FunctionComponent<RugRowProps> = ({ x, y, to_colorize }: RugRowProps) => {
    let center = { x:x, y:y }
    return <Polygon center={center} r={5} fill={COLORS[to_colorize]} rotate={45} />;
};
export default RugComponent;

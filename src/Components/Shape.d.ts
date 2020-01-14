import * as Konva from 'konva'

declare class Shape {
    name: string;
    type: string;
    text: string;
    stroke: string;
    strokeWidth: number;
    anchorStroke: string;
    anchorFill: string;
    anchorStrokeWidth: number;
    anchorFocusStrokeWidth: number;
    anchorRadius: number;

    group: any;

    options: Object;

    constructor(options: any);
}

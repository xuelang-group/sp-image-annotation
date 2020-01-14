import Konva from 'konva/types/index-types'
type ShapeConfig = Konva.ShapeConfig

export declare class Shape<ShapeConfig> {
    public static name: string;
    public static type: string;
    public static text: string;
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

    group: Konva.Group;

    options: Object;

    constructor(options: Konva.ShapeConfig);
}

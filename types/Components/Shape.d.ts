import Konva from 'konva/types/index-types';
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
export type ShapeType = {
    shapeName: string,
    type: string,
    text: string,
    stroke: string,
    strokeWidth: number,
  
    anchorStroke: string,
    anchorFill: string,
    anchorStrokeWidth: number,
    anchorFocusStrokeWidth: number,
    anchorRadius: number,
  
    group: typeof Konva.Group,
    $rmBtn: typeof Konva.Path,
  
    options: Object,
  
    selected: Boolean,
  
    parent: ShapeType,
  
    constructor(options: typeof Konva.Shape): ShapeType,
    addAnchor(group: typeof Konva.Group, x: number, y: number, name: string): void,
    close(forceClose?: boolean): boolean,
    createRemoveButton(): typeof Konva.Path,
    getCoordinate(widthRatio: number, heightRatio: number): Array<number>[4],
    getTarget(): typeof Konva.Group,
    handleMouseDown(e: any, { lastX, lastY }: { lastX: number, lastY: number }): void,
    handleMouseMove(e: any, { lastX, lastY }: { lastX: number, lastY: number }): void,
    handleMouseUp(e: any): void,
    initEvents(group: typeof Konva.Group): void,
    setWidthHeight(width: number, height: number): void,
    toggleOperationButtons(show: Boolean): void,
    updateAnchor(activeAnchor: any): void,
    points(points?: number[]): number[],
    draggable(draggable: boolean): void,
    resize(data: { width?: number, height?: number, ratio?: number }): void,
    select(): void,
    unselect(): void
  };
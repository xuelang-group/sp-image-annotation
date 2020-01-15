import Konva from 'konva/types/index-types'

declare namespace SPImageAnnotation {
    export const Rect: typeof import('./Components/Rect').Rect;
    export type Rect = import('./Components/Rect').Rect;

    export const Circle: typeof import('./Components/Circle').Circle;
    export type Circle = import('./Components/Circle').Circle;

    export const ConcentricCircle: typeof import('./Components/ConcentricCircle').ConcentricCircle;
    export type ConcentricCircle = import('./Components/ConcentricCircle').ConcentricCircle;

    export const Layer: typeof import('./Layer').Layer;
    export type Layer = import('./Layer').Layer;

    export const Stage: typeof import('./Stage').Stage;
    export type Stage = import('./Stage').Stage;
}

export default SPImageAnnotation;
declare namespace SPImageAnnotation {
    export const Rect: typeof import('./Components/Rect').Rect;
    export type Rect = import('./Components/Rect').Rect;

    export const Circle: typeof import('./Components/Circle').Circle;
    export type Circle = import('./Components/Circle').Circle;

    export const ConcentricCircle: typeof import('./Components/ConcentricCircle').ConcentricCircle;
    export type ConcentricCircle = import('./Components/ConcentricCircle').ConcentricCircle;
}

export default SPImageAnnotation;
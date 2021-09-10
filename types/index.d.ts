import Konva from 'konva/types/index-types';

declare namespace SPImageAnnotation {
  export const Line: typeof import('./Components/Line').Line;
  export type Line = import('./Components/Line').Line;

  export const Rect: typeof import('./Components/Rect').Rect;
  export type Rect = import('./Components/Rect').Rect;

  export const Mask: typeof import('./Components/Mask').Mask;
  export type Mask = import('./Components/Mask').Mask;

  export const Circle: typeof import('./Components/Circle').Circle;
  export type Circle = import('./Components/Circle').Circle;

  export const ConcentricCircle: typeof import('./Components/ConcentricCircle').ConcentricCircle;
  export type ConcentricCircle = import('./Components/ConcentricCircle').ConcentricCircle;

  export const Coordinate: typeof import('./Components/Coordinate').Coordinate;
  export type Coordinate = import('./Components/Coordinate').Coordinate;

  export const Layer: typeof import('./Layer').Layer;
  export type Layer = import('./Layer').Layer;

  export const Stage: typeof import('./Stage').Stage;
  export type Stage = import('./Stage').Stage;

  export const Annotation: typeof import('./Annotation').Annotation;
  export type Annotation = import('./Annotation').Annotation;

  export const Point: typeof import('./Components/Point').Point;
  export type Point = import('./Components/Point').Point;
}

export default SPImageAnnotation;

import Annotation from './Annotation';
import Components from './Components/index';
import Layer from './Layer';
import Stage from './Stage';

const { Line, Rect, Circle, ConcentricCircle, Coordinate } = Components;

if (window) {
  (window as any).SpImageAnnotation = {
    Line,
    Rect,
    Circle,
    ConcentricCircle,
    Coordinate,
    Stage,
    Layer,
    Annotation,
  };
}

export { Line, Rect, Circle, ConcentricCircle, Coordinate, Stage, Layer, Annotation };

import * as Components from './Components/index'
import Layer from './Layer';
import Stage from './Stage'

if (window) {
    (window as any).SpImageAnnotation = { Stage, Layer, Components };
}

export default { Stage, Layer, ...Components }
import Annotation from './Annotation'
import Components from './Components/index'
import Layer from './Layer';
import Stage from './Stage'

if (window) {
    (window as any).SpImageAnnotation = { Annotation, Stage, Layer, Components };
}

export default Annotation

export { Stage, Layer, Components }
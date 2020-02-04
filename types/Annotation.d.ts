import Konva from 'konva/types/index-types';
import { StageType } from './Stage'
import { LayerType } from './Layer'
import { ShapeType } from './Components/Shape'

export type AnnotationOptions = {
  container: string,
  shapes?: string[],
  width?: number,
  height?: number,
  imgSrc?: string
}

export declare class Annotation {
  SHAPES_SUPPORTED: any
  $container: HTMLElement
  shapeType: string
  shapes: Array<any>

  stage: StageType
  $stage: HTMLElement
  stageState: string

  layer: LayerType

  $toolbar: HTMLElement
  $img: any
  $canvas: HTMLElement

  isPaint: Boolean
  isDrawingLine: Boolean
  lastX: number
  lastY: number
  lastShape: ShapeType
  lastSelected: ShapeType

  ctrlDown: Boolean

  stepFactor: number
  realWidth: number
  realHeight: number
  widthRatio: number
  heightRatio: number
  naturalWidth: number
  naturalHeight: number

  constructor(options: AnnotationOptions)

  change(factor: number): void

  getShapeData(): Array<ShapeType>

  getStage(): StageType

  handleKeydown(e: any):void

  handleMousedown(e: any): void

  handleMouseMove(e: any): void

  handleMouseUp(): void

  handleRemoveShape(group: Konva.Group): Array<ShapeType>

  initEvents(stage: StageType): void

  initStage(options: AnnotationOptions): void

  initToolbar(options: AnnotationOptions, $container: HTMLElement): HTMLElement

  resize(width: number, height: number): void

  resizeShapes(factor: number): void

  set(property?: string, value?: any): void

  setImage(src: string): void

  select(shape: any): void

  unselect(shape?: ShapeType): void
}

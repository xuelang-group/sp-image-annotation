import * as Konva from 'konva'
import Stage, { StageType } from './Stage'
import Shape, { ShapeType } from './Components/Shape'
import Layer from './Layer'
import Components from './Components/index'

import './less/annotation.less'

type AnnotationOptions = {
  container: string,
  shapes?: string[],
  width?: number,
  height?: number
}

export default class Annotation {
  SHAPES_SUPPORTED: any = {}
  $container: HTMLElement
  shapeType: string = ''
  shapes: Array<any> = []

  stage: StageType
  $stage: HTMLElement

  $img: HTMLElement
  $canvas: HTMLElement

  constructor(options: AnnotationOptions) {
    this.initStage(options)
  }

  getStage() {
    return this.stage
  }

  initEvents(stage: StageType) {
    const layer = new Layer()
    stage.add(layer)

    let isPaint = false
    let lastShape: ShapeType
    let lastX: number
    let lastY: number

    stage.on('mousedown touchstart', () => {
      isPaint = true;
      var pos = stage.getPointerPosition();
      lastX = pos.x;
      lastY = pos.y;
      lastShape = new this.SHAPES_SUPPORTED[this.shapeType]({ x: lastX, y: lastY, width: 1, height: 1 });
      this.shapes.push(lastShape);
      layer.add(lastShape.getTarget());
    })

    stage.on('mouseup touchend', () => {
      isPaint = false;
    })

    // and core function - drawing
    stage.on('mousemove touchmove', () => {
      if (!isPaint) {
        return;
      }

      var pos = stage.getPointerPosition();
      var width = Math.max(0, pos.x - lastX);
      var height = Math.max(0, pos.y - lastY);

      lastShape.setWidthHeight(width, height);
      layer.batchDraw();
    })

    stage.on('removeshape', (group: typeof Konva.Group) => {
      var index = this.shapes.findIndex((shape: ShapeType) => {
        return shape.getTarget() === group
      })

      this.shapes.splice(index, 1)
    })
  }

  initStage(options: AnnotationOptions) {
    const { container = '', width, height } = options
    const $container = this.$container = document.getElementById(container)

    this.initToolbar(options, $container)

    this.$stage = document.createElement('div')
    this.$img = document.createElement('img')
    this.$canvas = document.createElement('div')

    this.$stage.setAttribute('class', 'spia-canvas-container')

    this.$img.setAttribute('src', '')
    this.$img.setAttribute('class', 'image')
    this.$img.setAttribute('src', '')

    this.$canvas.setAttribute('id', 'cutimage')
    this.$canvas.setAttribute('class', 'canvas')

    this.$stage.appendChild(this.$img)
    this.$stage.appendChild(this.$canvas)
    this.$container.appendChild(this.$stage)

    this.stage = new Stage({
      container: 'cutimage',
      width: width || $container.clientWidth,
      height: height || $container.clientHeight
    })

    this.initEvents(this.stage)
  }

  initToolbar(options: AnnotationOptions, $container: HTMLElement) {
    const $toolbar = document.createElement('div')
    const $pencil = document.createElement('div')

    $toolbar.setAttribute('class', 'spia-toolbar')
    $pencil.setAttribute('id', 'pencil')
    $toolbar.appendChild($pencil)

    const components: any = Components

    Object.keys(components).map((shapeKey: string) => {
      const shape: any = components[shapeKey];
      this.SHAPES_SUPPORTED[shape.type] = shape;

      var shapeBtn = document.createElement('button');
      shapeBtn.setAttribute('id', shape.shapeName);
      shapeBtn.setAttribute('class', 'btn mr');

      shapeBtn.innerHTML = shape.text;
      shapeBtn.addEventListener('click', () => {
        this.shapeType = shape.type;
      });

      $pencil.appendChild(shapeBtn);
    });

    $container.appendChild($toolbar)
  }

  setImage(src: string) {
    this.$img.setAttribute('src', src)
  }
}

import * as Konva from 'konva'
import Stage, { StageType } from './Stage'
import { ShapeType } from './Components/Shape'
import Layer, { LayerType } from './Layer'
import Components from './Components/index'
import STAGE_STATE from './constants/states'

import './less/annotation.less'

type AnnotationOptions = {
  container: string,
  shapes?: string[],
  width?: number,
  height?: number,
  imgSrc?: string
}

export default class Annotation {
  SHAPES_SUPPORTED: any = {}
  $container: HTMLElement
  shapeType: string = ''
  shapes: Array<any> = []

  stage: StageType
  $stage: HTMLElement
  stageState: string = STAGE_STATE.IDLE

  layer: LayerType

  $toolbar: HTMLElement
  $img: HTMLImageElement
  $canvas: HTMLElement

  isPaint: Boolean
  lastX: number
  lastY: number
  lastShape: ShapeType
  lastSelected: ShapeType

  ctrlDown: Boolean = false

  constructor(options: AnnotationOptions) {
    this.initStage(options)
  }

  getShapeData() {
    const shapes = this.shapes.map(function (shape) {
      return { type: shape.type, coordinate: shape.getCoordinate() }
    })

    return shapes
  }

  getStage() {
    return this.stage
  }

  /**
   * 1、按下鼠标左键，如果在任一图形区域内，则：
   *   1）如果在空闲状态下，则选中图形，进入选中状态
   *   2）如果在选中状态下，则无状态转换
   *   3）如果在画图状态下，若按下 ctrl / command 键则进入画图状态，否则选中图形，进入选中状态
   * 2、按下鼠标左键，如果未在任一图形区域内，则：
   *   1）如果在空闲状态下，则进入画图状态
   *   2）如果在选中状态下，则进入空闲状态
   *   3）如果在画图状态下，则无状态转换
   * @param e 
   */
  handleMousedown(e: any) {
    this.unselect();
    if (this.ctrlDown) {
      this.stageState = STAGE_STATE.DRAWING;
      this.isPaint = true;
    } else {
      if (e.target === this.stage) {
        if (this.stageState === STAGE_STATE.IDLE) {
          this.stageState = STAGE_STATE.DRAWING;
          this.isPaint = true;
        } else if (this.stageState === STAGE_STATE.SELECT) {
          this.stageState = STAGE_STATE.IDLE;
        } else if (this.stageState === STAGE_STATE.DRAWING) {
        }
      } else {
        if (this.stageState === STAGE_STATE.IDLE || (this.stageState === STAGE_STATE.SELECT && e.target !== this.lastSelected)) {
          this.select(e.target)
          this.stageState = STAGE_STATE.SELECT;
        }
      }
    }

    if (this.stageState === STAGE_STATE.DRAWING) {
      const { x, y } = this.stage.getPointerPosition();
      this.lastX = x;
      this.lastY = y;
      this.lastShape = new this.SHAPES_SUPPORTED[this.shapeType]({ x: this.lastX, y: this.lastY, width: 1, height: 1 });
      this.shapes.push(this.lastShape);
      this.layer.add(this.lastShape.getTarget());
    }
  }

  handleMouseMove() {
    if (this.stageState === STAGE_STATE.IDLE) {
      return;
    } else if (this.stageState === STAGE_STATE.SELECT) {

    } else if (this.stageState === STAGE_STATE.DRAWING && this.isPaint) {
      const pos = this.stage.getPointerPosition();

      switch (this.shapeType) {
        case 'LINE':
        case 'POLYGON':
          this.lastShape.points([...this.lastShape.points(), ...[pos.x - this.lastX, pos.y - this.lastY]])
          break;
        default:
          const width = Math.max(0, pos.x - this.lastX);
          const height = Math.max(0, pos.y - this.lastY);

          this.lastShape.setWidthHeight(width, height);
          break;
      }
    }

    this.layer.batchDraw();
  }

  handleMouseUp() {
    if (this.stageState === STAGE_STATE.DRAWING) {
      this.isPaint = false
      this.stageState = STAGE_STATE.IDLE
    }
    // this.set('draggable', false)
  }

  handleRemoveShape(group: typeof Konva.Group) {
    var index = this.shapes.findIndex((shape: ShapeType) => {
      return shape.getTarget() === group
    })

    this.shapes.splice(index, 1)
  }

  initEvents(stage: StageType) {
    stage.on('mousedown touchstart', this.handleMousedown.bind(this))

    stage.on('mouseup touchend', this.handleMouseUp.bind(this))

    stage.on('mousemove touchmove', this.handleMouseMove.bind(this))

    stage.on('removeshape', this.handleRemoveShape.bind(this))

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 17) {
        this.ctrlDown = true;
      }
    })

    window.addEventListener('keyup', () => {
      this.ctrlDown = false;
    })
  }

  initStage(options: AnnotationOptions) {
    const { container = '', width, height, imgSrc = '' } = options
    const $container = this.$container = document.getElementById(container)

    this.$toolbar = this.initToolbar(options, $container)

    this.$stage = document.createElement('div')
    this.$img = document.createElement('img')
    this.$canvas = document.createElement('div')

    this.$stage.setAttribute('class', 'spia-canvas-container')

    this.$img.setAttribute('src', '')
    this.$img.setAttribute('class', 'image')
    this.$img.onload = () => { this.resize(this.$img.clientWidth, this.$img.clientHeight); console.log(this.$img.clientWidth / this.$img.naturalWidth, this.$img.clientHeight / this.$img.naturalHeight) }
    this.$img.setAttribute('src', imgSrc)

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

    this.layer = new Layer()
    this.stage.add(this.layer)

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
    return $toolbar
  }

  resize(width: number, height: number) {
    this.stage.width(width).height(height)
    this.$stage.style.width = `${width}px`
    this.$stage.style.height = `${height - this.$toolbar.clientHeight}px`
  }

  set(property?: string, value?: any) {
    this.shapes.map(shape => {
      shape.getTarget().set(property, value)
    })
  }

  setImage(src: string) {
    this.$img.setAttribute('src', src)
  }

  select(shape: any) {
    this.lastSelected = shape

    const group = shape.parent || shape
    group.draggable(true)

    group.__$$this.showAnchors(true)
  }

  unselect(shape?: ShapeType) {
    this.lastSelected = null
    this.shapes.map(shape => {
      shape.unselect()
    })
  }
}

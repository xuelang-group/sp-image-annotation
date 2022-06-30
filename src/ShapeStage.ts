import Stage, { StageType } from './Stage';
import { ShapeType } from './Components/Shape';
import Layer, { LayerType } from './Layer';
import Components from './Components/index';
import STAGE_STATE from './constants/states';
import ImageHelper from './helpers/Image';

import 'antd/dist/antd.css';
import './less/annotation.less';

const EventEmitter = require('events');
export interface AnnotationOptions {
  container: string;
  shapes?: string[];
  width?: number;
  height?: number;
  imgSrc?: string;
  removeBtnStyle?: object;
  onBeforeAddShape?: (shapeType: string, extraData: any) => boolean;
  onShapeAdded?: (shapeType: string, extraData: any) => boolean;
  onShapeRemoved?: (shape: ShapeType) => boolean;
}

export default class Annotation extends EventEmitter {
  SHAPES_SUPPORTED: any = {};

  config: AnnotationOptions;

  $container: HTMLElement;

  shapeType: string = '';

  shapes: any[] = [];

  stage: StageType;

  $stage: HTMLElement;

  stageState: string = STAGE_STATE.IDLE;

  layer: LayerType;

  $toolbar: HTMLElement;

  $img: any;

  $canvas: HTMLElement;

  isPaint: Boolean;

  isDrawingLine: Boolean;

  lastX: number;

  lastY: number;

  lastShape: ShapeType;

  lastSelected: ShapeType;

  ctrlDown: Boolean = false;

  stepFactor: number = 1.2;

  realWidth: number;

  realHeight: number;

  widthRatio: number;

  heightRatio: number;

  imageScaleRatio: number;

  naturalWidth: number;

  naturalHeight: number;

  removeBtnStyle: object = {};

  prevMouseDownName: string = '';

  constructor(options: AnnotationOptions) {
    super(options);
    this.config = options;
    this.initStage(options);
  }

  add(_shapes: { type: string; coordinate: number[] }[] = []) {
    let shapes = _shapes;
    if (!Array.isArray(_shapes)) {
      shapes = [_shapes];
    }

    shapes.forEach((shape: any) => {
      // 添加shapes
      const { type, coordinate } = shape;
      if (this.beforeAddShape(type, { coordinate })) {
        const newShape = new this.SHAPES_SUPPORTED[type]({
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          currentRatio: this.imageScaleRatio,
          removeBtnStyle: this.removeBtnStyle,
        });
        newShape.load(coordinate, this.imageScaleRatio);
        this.shapes.push(newShape);
        this.layer.add(newShape.getTarget());
        this.handleShapeAdded(type, { shape: newShape });
      }
    });
    this.layer.batchDraw();
  }

  beforeAddShape(shapeType: string, extraData: any): boolean {
    if (this.config.onBeforeAddShape) {
      return this.config.onBeforeAddShape(shapeType, extraData);
    }
    return true;
  }

  handleShapeAdded(shapeType: string, extraData: any) {
    if (this.config.onShapeAdded) {
      return this.config.onShapeAdded(shapeType, extraData);
    }
    return true;
  }

  change(factor: number) {
    this.realWidth *= factor;
    this.realHeight *= factor;
    this.imageScaleRatio *= factor;

    const imageHeight = this.imageScaleRatio * this.naturalHeight;
    const imageWidth = this.imageScaleRatio * this.naturalWidth;

    this.stage.width(imageWidth).height(imageHeight);
    this.$stage.style.width = `${imageWidth}px`;
    this.$stage.style.height = `${imageHeight}px`;

    this.$img.resize({ width: imageWidth, height: imageHeight });

    this.resizeShapes(factor);

    this.layer.batchDraw();
  }

  clear() {
    this.stage.clear();
  }

  getShapeData() {
    const shapes = this.shapes.map(shape => ({
      id: shape.getTarget().id(),
      type: shape.type,
      coordinate: shape.getCoordinate(this.imageScaleRatio),
    }));

    return shapes;
  }

  getStage() {
    return this.stage;
  }

  handleImageLoaded = () => {
    this.emit('imageloaded');
  };

  handleKeydown(e: any) {
    if (e.keyCode === 17) {
      this.ctrlDown = true;
    }

    if (this.ctrlDown) {
      if (e.keyCode === 187) {
        this.change(this.stepFactor);
      } else if (e.keyCode === 189) {
        this.change(1 / this.stepFactor);
      }
    }

    if (e.keyCode === 13) {
      this.lastShape.close(true);
      this.isPaint = false;
      this.stageState = STAGE_STATE.IDLE;
      this.isDrawingLine = false;
    }
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
    if (this.prevMouseDownName === 'removeBtn') {
      this.stageState = STAGE_STATE.IDLE;
    }
    this.unselect();
    if (this.ctrlDown) {
      this.stageState = STAGE_STATE.DRAWING;
    } else if (e.target === this.stage) {
      if (this.stageState === STAGE_STATE.IDLE) {
        this.stageState = STAGE_STATE.DRAWING;
      } else if (this.stageState === STAGE_STATE.SELECT) {
        this.stageState = STAGE_STATE.IDLE;
      } else if (this.stageState === STAGE_STATE.DRAWING) {
        // todo
      }
    } else if (
      this.stageState === STAGE_STATE.IDLE ||
      (this.stageState === STAGE_STATE.SELECT && e.target !== this.lastSelected)
    ) {
      this.select(e.target);
      this.stageState = STAGE_STATE.SELECT;
    }

    if (this.isPaint) {
      this.lastShape.handleMouseDown(e, { lastX: this.lastX, lastY: this.lastY });
    } else if (this.stageState === STAGE_STATE.DRAWING) {
      const { x, y } = this.stage.getPointerPosition();
      this.lastX = x;
      this.lastY = y;

      if (this.beforeAddShape(this.shapeType, { position: { x: this.lastX, y: this.lastY } })) {
        this.lastShape = new this.SHAPES_SUPPORTED[this.shapeType]({
          x: this.lastX,
          y: this.lastY,
          width: 1,
          height: 1,
          currentRatio: this.imageScaleRatio,
          removeBtnStyle: this.removeBtnStyle,
        });
        this.shapes.push(this.lastShape);
        this.layer.add(this.lastShape.getTarget());
        this.isPaint = true;
      }
      if (this.shapeType === 'POINT') {
        this.lastShape.handleMouseDown(e, { lastX: this.lastX, lastY: this.lastY });
        this.layer.batchDraw();
      }
    }

    this.prevMouseDownName = e.target.attrs.name || '';
  }

  handleMouseMove(e: any) {
    if (this.stageState === STAGE_STATE.IDLE) {
      return;
    }

    if (this.stageState === STAGE_STATE.SELECT) {
      // todo
    }

    if (this.stageState === STAGE_STATE.DRAWING && this.isPaint) {
      this.lastShape.handleMouseMove(e, { lastX: this.lastX, lastY: this.lastY });
    }

    this.layer.batchDraw();
  }

  handleMouseUp() {
    if (this.stageState === STAGE_STATE.DRAWING) {
      if (this.lastShape && this.lastShape.close()) {
        this.isPaint = false;
        this.stageState = STAGE_STATE.IDLE;
        this.handleShapeAdded(this.shapeType, { shape: this.lastShape });
      }
    }
  }

  handleDragEnd() {
    this.emit('shape:drag:end', this.lastSelected);
  }

  handleRemoveShape(evt: any) {
    const { shape } = evt;
    const index = this.shapes.findIndex((shp: ShapeType) => shp.getTarget() === shape.group);

    this.shapes.splice(index, 1);

    if (this.config.onShapeRemoved) {
      this.config.onShapeRemoved(shape);
    }
  }

  initEvents(stage: StageType) {
    stage.on('mousedown touchstart', this.handleMousedown.bind(this));

    stage.on('mouseup touchend', this.handleMouseUp.bind(this));

    stage.on('mousemove touchmove', this.handleMouseMove.bind(this));

    stage.on('removeshape', this.handleRemoveShape.bind(this));

    stage.on('dragend', this.handleDragEnd.bind(this));

    window.addEventListener('contextmenu', e => {
      e.preventDefault();
    });

    window.addEventListener('keydown', this.handleKeydown.bind(this));

    window.addEventListener('keyup', e => {
      if (e.keyCode === 17) {
        this.ctrlDown = false;
      }
    });
  }

  initStage(options: AnnotationOptions) {
    const { container = '', width, height, imgSrc = '', removeBtnStyle } = options;
    const $container = document.getElementById(container);
    const autoSize = !width || !height;

    this.$container = $container;
    this.removeBtnStyle = { ...removeBtnStyle };
    const $canvasContainer = document.createElement('div');
    $canvasContainer.setAttribute('class', 'spia-canvas-container');

    this.$toolbar = this.initToolbar(options, $container);

    this.$stage = document.createElement('div');
    this.$img = new ImageHelper({
      src: imgSrc,
      container: this.$stage,
      className: 'image',
      onImageLoaded: this.handleImageLoaded,
    });
    this.$img.onload(() => {
      const img = this.$img.getDOM();
      this.naturalWidth = parseFloat(img.naturalWidth);
      this.naturalHeight = parseFloat(img.naturalHeight);

      if (autoSize) {
        this.resize(this.naturalWidth, this.naturalHeight);
      } else {
        this.resize(width, height);
      }
      this.emit('imageloaded');
    });
    this.$canvas = document.createElement('div');

    this.$stage.setAttribute('class', 'spia-canvas');

    this.$canvas.setAttribute('id', 'cutimage');
    this.$canvas.setAttribute('class', 'canvas');

    this.$stage.appendChild(this.$img.getDOM());
    this.$stage.appendChild(this.$canvas);
    $canvasContainer.appendChild(this.$stage);
    this.$container.appendChild($canvasContainer);

    this.stage = new Stage({
      container: 'cutimage',
      width: width || $container.clientWidth,
      height: height || $container.clientHeight,
    });

    this.layer = new Layer();
    this.stage.add(this.layer);

    this.initEvents(this.stage);
  }

  initToolbar(options: AnnotationOptions, $container: HTMLElement) {
    const $toolbar = document.createElement('div');
    const $pencil = document.createElement('div');
    const $buttons: HTMLButtonElement[] = [];

    $toolbar.setAttribute('class', 'spia-toolbar');
    $pencil.setAttribute('id', 'pencil');
    $toolbar.appendChild($pencil);

    const components: any = Components;
    let shapeKeys = [];

    if (options.shapes && options.shapes.length) {
      shapeKeys = options.shapes;
    } else {
      shapeKeys = Object.keys(components);
    }

    shapeKeys.forEach((shapeKey: string) => {
      const shape: any = components[shapeKey];
      this.SHAPES_SUPPORTED[shape.type] = shape;
      this.shapeType = this.shapeType || shape.type;

      const shapeBtn = document.createElement('button');
      shapeBtn.setAttribute('id', shape.shapeName);
      shapeBtn.setAttribute('class', 'ant-btn mr');

      shapeBtn.innerHTML = shape.text;
      shapeBtn.addEventListener('click', () => {
        this.shapeType = shape.type;
        $buttons.forEach((btn: HTMLButtonElement) => {
          btn.setAttribute('class', 'ant-btn mr');
        });
        shapeBtn.className += ' active';
      });

      $pencil.appendChild(shapeBtn);
      $buttons.push(shapeBtn);
    });

    const $zoomInBtn = document.createElement('button');
    $zoomInBtn.setAttribute('id', 'zoomIn');
    $zoomInBtn.setAttribute('class', 'ant-btn ml');
    $zoomInBtn.innerHTML = '放大';
    $zoomInBtn.addEventListener('click', () => {
      this.change(this.stepFactor);
    });

    const $zoomOutBtn = document.createElement('button');
    $zoomOutBtn.setAttribute('id', 'zoomIn');
    $zoomOutBtn.setAttribute('class', 'ant-btn ml');
    $zoomOutBtn.innerHTML = '缩小';
    $zoomOutBtn.addEventListener('click', () => {
      this.change(1 / this.stepFactor);
    });

    $toolbar.appendChild($zoomInBtn);
    $toolbar.appendChild($zoomOutBtn);

    $container.appendChild($toolbar);
    return $toolbar;
  }

  load(shapes: { type: string; coordinate: number[] }[] = []) {
    this.shapes = [];
    this.layer.clear();
    this.layer.destroyChildren();

    shapes.forEach((shape: any) => {
      // 添加shapes
      const { type, coordinate, removable = true } = shape;
      if (this.beforeAddShape(type, { coordinate })) {
        const newShape = new this.SHAPES_SUPPORTED[type]({
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          currentRatio: this.imageScaleRatio,
          removeBtnStyle: this.removeBtnStyle,
          removable
        });
        newShape.load(coordinate, this.imageScaleRatio);
        this.shapes.push(newShape);
        this.layer.add(newShape.getTarget());
        this.handleShapeAdded(type, { shape: newShape });
      }
    });
    this.layer.batchDraw();
  }

  resize(width: number, height: number) {
    this.realWidth = width;
    this.realHeight = height;
    const widthRatio = width / this.naturalWidth;
    const viewHeight = height - this.$toolbar.clientHeight;
    const heightRatio = viewHeight / this.naturalHeight;

    this.imageScaleRatio = Math.min(widthRatio, heightRatio);

    const imageHeight = this.imageScaleRatio * this.naturalHeight;
    const imageWidth = this.imageScaleRatio * this.naturalWidth;

    this.stage.width(imageWidth).height(imageHeight);
    this.$stage.style.width = `${imageWidth}px`;
    this.$stage.style.height = `${imageHeight}px`;
    this.$img.resize({ width: imageWidth, height: imageHeight });

    this.layer.batchDraw();
  }

  resizeShapes(factor: number) {
    this.shapes.forEach(shape => {
      const targetShape = shape.getTarget();
      shape.resize({
        width: targetShape.width() * factor,
        height: targetShape.height() * factor,
        ratio: factor,
      });
      targetShape.x(targetShape.x() * factor);
      targetShape.y(targetShape.y() * factor);
    });
  }

  set(property?: string, value?: any) {
    this.shapes.forEach(shape => {
      shape.getTarget().set(property, value);
    });
  }

  setImage(src: string) {
    this.$img.setImageSrc(src);
  }

  select(shape: any) {
    this.lastSelected = shape;

    const group = shape.parent || shape;
    group.draggable(true);

    group.$$this.showAnchors(true);
    group.getLayer().batchDraw();

    this.emit('shape:select', group.$$this);
  }

  unselect() {
    this.lastSelected = null;
    if (this.stageState === STAGE_STATE.SELECT) {
      this.stageState = STAGE_STATE.IDLE;
    }
    this.shapes.forEach(shape => shape.unselect());
  }
}

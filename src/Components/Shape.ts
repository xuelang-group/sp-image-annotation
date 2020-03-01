/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import * as konva from 'konva';
import KonvaType from 'konva/types/index-types';

const uuidv4 = require('uuid/v4');

const Konva: any = konva;

export default class Shape {
  protected static shapeName = 'Shape';

  protected static type = 'Shape';

  protected static text = '形状';

  protected stroke = '#666';

  protected strokeWidth = 2;

  protected anchorStroke = '#666';

  protected anchorFill = '#ddd';

  protected anchorStrokeWidth = 2;

  protected anchorFocusStrokeWidth = 4;

  protected anchorRadius = 6;

  protected group: typeof Konva.Group = {};

  protected $rmBtn: typeof Konva.Path = {};

  protected options: Object = {};

  protected selected: Boolean = false;

  constructor(options: typeof Konva.Shape) {
    this.options = options;
    const { x, y } = options;
    const group = new Konva.Group({ id: uuidv4(), x, y, draggable: false });
    this.group = group;
    this.$rmBtn = this.createRemoveButton();

    this.initEvents(group);
  }

  addAnchor(group: typeof Konva.Group, x: number, y: number, name: string = '') {
    const anchor = new Konva.Circle({
      x,
      y,
      name,
      stroke: this.anchorStroke,
      fill: this.anchorFill,
      strokeWidth: this.anchorStrokeWidth,
      radius: this.anchorRadius,
      draggable: true,
      dragOnTop: false,
      visible: false,
    });

    anchor.on('dragmove', () => {
      this.updateAnchor(anchor);
    });

    anchor.on('mousedown touchstart', () => {
      group.draggable(false);
      anchor.moveToTop();
    });

    anchor.on('dragend', () => {
      group.draggable(true);
    });

    anchor.on('mouseover', (evt: any) => {
      evt.cancelBubble = true;
      const layer = anchor.getLayer();
      document.body.style.cursor = 'pointer';
      anchor.strokeWidth(this.anchorFocusStrokeWidth);
      layer.draw();
    });

    anchor.on('mouseout', () => {
      const layer = anchor.getLayer();
      document.body.style.cursor = 'default';
      anchor.strokeWidth(2);
      layer.draw();
    });

    group.add(anchor);

    return anchor;
  }

  close() {
    return true;
  }

  createRemoveButton() {
    const rmBtn = new Konva.Path({
      x: 10,
      y: 10,
      fill: 'rgba(192, 0, 0, 0.6)',
      data:
        'M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z',
      scale: {
        x: 0.04,
        y: 0.04,
      },
      width: 30,
      height: 30,
    });

    this.$rmBtn = rmBtn;

    rmBtn.on('click', (evt: any) => {
      const stage = this.group.getStage();
      const layer = this.group.getLayer();

      stage.fire('removeshape', this.group);

      this.group.destroy();
      layer.batchDraw();

      evt.cancelBubble = true;
    });

    this.group.add(rmBtn);

    return rmBtn;
  }

  getCoordinate(widthRatio: number = 1, heightRatio: number = 1) {
    const { group } = this;
    const target = group.find('.target')[0];
    return [
      group.x() / widthRatio,
      group.y() / heightRatio,
      target.width() / widthRatio,
      target.height() / heightRatio,
    ];
  }

  getTarget() {
    return this.group;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseDown(e: any, { lastX, lastY }: { lastX: number; lastY: number }) {}

  handleMouseMove(e: any, { lastX, lastY }: { lastX: number; lastY: number }) {
    const stage = this.group.getStage();
    const pos = stage.getPointerPosition();
    const width = Math.max(0, pos.x - lastX);
    const height = Math.max(0, pos.y - lastY);

    this.setWidthHeight(width, height);
  }

  handleMouseUp() {}

  initEvents(group: typeof Konva.Group) {
    group.on('mousedown', (e: any) => {
      if (this.getTarget().draggable()) {
        e.cancelBubble = true;
      }
    });
  }

  resize(data: { width?: number; height?: number; ratio?: number }) {
    return this.setWidthHeight(data.width, data.height);
  }

  setWidthHeight(width: number, height: number) {
    this.group.width(width).height(height);
    this.group
      .find('.target')[0]
      .width(width)
      .height(height);
    this.group
      .find('.topLeft')[0]
      .x(0)
      .y(0);
    this.group
      .find('.topRight')[0]
      .x(width)
      .y(0);
    this.group
      .find('.bottomRight')[0]
      .x(width)
      .y(height);
    this.group
      .find('.bottomLeft')[0]
      .x(0)
      .y(height);

    this.$rmBtn
      .x((this.group.width() - this.$rmBtn.width()) / 2.0)
      .y((this.group.height() - this.$rmBtn.height()) / 2.0)
      .show();
    this.$rmBtn.moveToTop();
  }

  select() {
    this.getTarget().draggable(false);
    this.showAnchors(true);
  }

  showAnchors(isShow: boolean) {
    return isShow;
  }

  unselect() {
    this.getTarget().draggable(false);
    this.showAnchors(false);
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    throw new Error(`updateAnchor should be overrided, activeAnchor: ${activeAnchor}`);
  }
}

export type ShapeType = {
  shapeName: string;
  type: string;
  text: string;
  stroke: string;
  strokeWidth: number;

  anchorStroke: string;
  anchorFill: string;
  anchorStrokeWidth: number;
  anchorFocusStrokeWidth: number;
  anchorRadius: number;

  group: typeof Konva.Group;
  $rmBtn: typeof Konva.Path;

  options: Object;

  selected: Boolean;

  parent: ShapeType;

  constructor(options: typeof Konva.Shape): ShapeType;
  addAnchor(group: typeof Konva.Group, x: number, y: number, name: string): KonvaType.Circle;
  showAnchors(isShow: boolean): boolean;
  close(forceClose?: boolean): boolean;
  createRemoveButton(): typeof Konva.Path;
  getCoordinate(widthRatio: number, heightRatio: number): Array<number>[4];
  getTarget(): typeof Konva.Group;
  handleMouseDown(e: any, { lastX, lastY }: { lastX: number; lastY: number }): any;
  handleMouseMove(e: any, { lastX, lastY }: { lastX: number; lastY: number }): void;
  handleMouseUp(e: any): void;
  initEvents(group: typeof Konva.Group): void;
  setWidthHeight(width: number, height: number): void;
  updateAnchor(activeAnchor: typeof Konva.Anchor): void;
  points(points?: number[]): number[];
  draggable(draggable: boolean): void;
  resize(data: { width?: number; height?: number; ratio?: number }): void;
  select(): void;
  unselect(): void;
};

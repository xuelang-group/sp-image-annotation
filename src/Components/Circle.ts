import * as konva from 'konva';
import Shape from './Shape';

const Konva: any = konva;

export default class Circle extends Shape {
  public static shapeName: string = 'CIRCLE';

  public static type: string = 'CIRCLE';

  public static text: string = '圆形';

  shapeName: string = 'CIRCLE';

  type: string = 'CIRCLE';

  text: string = '圆形';

  constructor(options: typeof Konva.Circle) {
    super(options);

    const { x, y } = options;
    const { group } = this;
    const circle = new Konva.Circle({
      name: 'target',
      x: 0,
      y: 0,
      radius: 1,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });

    group.$$this = this;
    group.add(circle);

    this.addAnchor(group, x, y, 'top');
  }

  getCoordinate(ratio: number = 1) {
    const { group } = this;
    const r = group.width() * 0.5;
    return [(group.x() + r) / ratio, (group.y() + r) / ratio, r / ratio];
  }

  handleAnchorDragEnd(evt: any, anchor: typeof Konva.Anchor) {
    const { group } = this;
    const circle = this.group.find('.target')[0];
    const r = group.width() * 0.5;

    const eventX = evt.evt.offsetX;
    const eventY = evt.evt.offsetY;

    circle.x(r).y(r);
    group.x(eventX - r).y(eventY);
    this.$rmBtn
      .x((this.group.width() - this.$rmBtn.width()) / 2.0)
      .y((this.group.height() - this.$rmBtn.height()) / 2.0);
    anchor.x(circle.x()).y(0);
  }

  load(coordinate: Array<number> = [], ratio: number) {
    const [x, y, radius] = coordinate;

    this.group.x((x - radius) * ratio).y((y - radius) * ratio);
    this.setWidthHeight(radius * 2 * ratio, radius * 2 * ratio);
  }

  setWidthHeight(width: number, height: number) {
    const size = Math.max(width, height);
    const circle = this.group.find('.target')[0];

    this.group.width(size);
    this.group.height(size);

    circle.width(width).height(height);

    this.group
      .find('.top')[0]
      .x(size / 2.0)
      .y(0);

    circle.x(size / 2.0);
    circle.y(size / 2.0);
    circle.width(size);
    circle.height(size);

    this.$rmBtn
      .x((this.group.width() - this.$rmBtn.width()) / 2.0)
      .y((this.group.height() - this.$rmBtn.height()) / 2.0)
      .show();
    this.$rmBtn.moveToTop();
  }

  showAnchors(isShow: boolean) {
    const anchor = this.group.find('.top')[0];
    if (isShow) {
      anchor.show();
    } else {
      anchor.hide();
    }

    return isShow;
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    const { group } = this;
    const target = group.find('.target')[0];

    const anchorY = activeAnchor.getY();

    const size = Math.max(0, (target.y() - anchorY) * 2.0);

    activeAnchor.x(target.x());
    target.width(size).height(size);
    group.width(size).height(size);
  }
}

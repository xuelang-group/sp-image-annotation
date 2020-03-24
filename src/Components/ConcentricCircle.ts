import * as konva from 'konva';
import Shape from './Shape';

const Konva: any = konva;

export default class ConcentricCircle extends Shape {
  public static shapeName = 'CONCENTRIC_CIRCLE';

  public static type = 'CONCENTRIC_CIRCLE';

  public static text = '同心圆';

  shapeName = 'CONCENTRIC_CIRCLE';

  type = 'CONCENTRIC_CIRCLE';

  text = '同心圆';

  constructor(options: typeof Konva.Circle) {
    super(options);

    const { x, y } = options;
    const { group } = this;
    const innerCircle = new Konva.Circle({
      name: 'target',
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });
    const outerCircle = new Konva.Circle({
      name: 'target',
      x: 0,
      y: 0,
      width: 5,
      height: 5,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });

    group.$$this = this;
    group.add(innerCircle);
    group.add(outerCircle);

    this.addAnchor(group, x, y, 'outerAnchor');
    this.addAnchor(group, x, y + outerCircle.width() / 2.0, 'innerAnchor');
  }

  getCoordinate(ratio: number = 1) {
    const innerCircle = this.group.find('.target')[0];
    const outerCircle = this.group.find('.target')[1];
    return [
      innerCircle.x() / ratio,
      innerCircle.y() / ratio,
      innerCircle.width() / ratio / 2.0,
      outerCircle.width() / ratio / 2.0,
    ];
  }

  load(coordinate: Array<number> = [], ratio: number) {
    const [x, y, innerRadius, outerRadius] = coordinate;
    const innerCircle = this.group.find('.target')[0];
    const outerCircle = this.group.find('.target')[1];

    innerCircle.width(innerRadius * 2 * ratio);
    outerCircle.width(outerRadius * 2 * ratio);

    this.group.x(x * ratio).y(y * ratio);
    this.setWidthHeight(outerRadius * 2 * ratio, outerRadius * 2 * ratio);
  }

  setWidthHeight(width: number, height: number) {
    const size = Math.max(width, height);
    const innerCircle = this.group.find('.target')[0];
    const outerCircle = this.group.find('.target')[1];

    this.group.width(size);
    this.group.height(size);

    this.group
      .find('.outerAnchor')[0]
      .x(size / 2.0)
      .y(0);
    this.group
      .find('.innerAnchor')[0]
      .x(size / 2.0)
      .y((outerCircle.width() - innerCircle.width()) / 2.0);

    outerCircle.x(size / 2.0);
    outerCircle.y(size / 2.0);
    outerCircle.width(size);
    outerCircle.height(size);

    const innerWidth = Math.max(5, innerCircle.width());
    const innerHeight = innerWidth;

    innerCircle.x(size / 2.0);
    innerCircle.y(size / 2.0);
    innerCircle.width(innerWidth);
    innerCircle.height(innerHeight);

    this.$rmBtn
      .x((this.group.width() - this.$rmBtn.width()) / 2.0)
      .y((this.group.height() - this.$rmBtn.height()) / 2.0)
      .show();
    this.$rmBtn.moveToTop();
  }

  showAnchors(isShow: boolean) {
    const outerAnchor = this.group.find('.outerAnchor')[0];
    const innerAnchor = this.group.find('.innerAnchor')[0];
    if (isShow) {
      outerAnchor.show();
      innerAnchor.show();
    } else {
      outerAnchor.hide();
      innerAnchor.hide();
    }

    return isShow;
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    const { group } = this;
    const innerCircle = group.find('.target')[0];
    const outerCircle = group.find('.target')[1];

    const anchorY = activeAnchor.getY();

    let minSize = 5;
    let maxSize = 0;
    const gap = 20;
    let size = minSize;

    switch (activeAnchor.name()) {
      case 'innerAnchor':
        maxSize = outerCircle.width() - gap * 2;
        size = Math.min(Math.abs(anchorY - innerCircle.y()) * 2.0, maxSize);
        innerCircle.width(size).height(size);
        activeAnchor.x(innerCircle.x());
        activeAnchor.y(Math.max(group.find('.outerAnchor')[0].y() + gap, anchorY));
        break;
      case 'outerAnchor':
        minSize = innerCircle.width() + gap * 2;
        size = Math.max(Math.abs(anchorY - outerCircle.y()) * 2.0, minSize);
        outerCircle.width(size).height(size);
        group.width(size).height(size);
        activeAnchor.x(outerCircle.x());
        activeAnchor.y(Math.min(group.find('.innerAnchor')[0].y() - gap, anchorY));
        break;
      default:
        break;
    }
  }
}

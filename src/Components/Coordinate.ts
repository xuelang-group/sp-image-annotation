import * as konva from 'konva';
import Shape from './Shape';

const Konva: any = konva;

export default class Coordinate extends Shape {
  public static shapeName: string = 'COORDINATE';

  public static type: string = 'COORDINATE';

  public static text: string = '坐标系';

  shapeName: string = 'COORDINATE';

  type: string = 'COORDINATE';

  text: string = '坐标系';

  constructor(options: typeof Konva.Rect) {
    super(options);

    const { group } = this;

    const axisX = new Konva.Arrow({
      x: 0,
      y: 0,
      name: 'axisx',
      points: [0, 0],
      pointerLength: 10,
      pointerWidth: 10,
      stroke: this.anchorStroke,
      fill: this.anchorFill,
      strokeWidth: this.anchorStrokeWidth,
    });

    const axisY = new Konva.Arrow({
      x: 0,
      y: 0,
      name: 'axisy',
      points: [0, 0],
      pointerLength: 10,
      pointerWidth: 10,
      stroke: this.anchorStroke,
      fill: this.anchorFill,
      strokeWidth: this.anchorStrokeWidth,
    });

    group.$$this = this;
    group.add(axisX);
    group.add(axisY);

    this.addAnchor(group, 0, 0, 'topLeft');
  }

  getCoordinate(ratio: number = 1) {
    const { group } = this;
    return [group.x() / ratio, group.y() / ratio, group.rotation() % 360];
  }

  load(coordinate: Array<number> = [], ratio: number) {
    const [x, y, rotation] = coordinate;

    this.group
      .x(x * ratio)
      .y(y * ratio)
      .rotate(rotation);
    this.setWidthHeight(100, 100);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseMove(e: any, data: { lastX: number; lastY: number }) {
    this.setWidthHeight(100, 100);
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    const { group } = this;

    const anchorX = activeAnchor.getX();
    const anchorY = activeAnchor.getY();

    let angle = (anchorX + anchorY) % 360;

    if (
      (angle >= -45 && angle < 45) ||
      (angle >= 90 && angle < 135) ||
      (angle >= 225 && angle < 315)
    ) {
      angle = anchorX % 360;
    } else if ((angle >= 45 && angle < 90) || (angle >= 135 && angle < 180) || angle >= 315) {
      angle = anchorY % 360;
    }

    // update anchor positions
    activeAnchor.x(0);
    activeAnchor.y(0);

    group.rotate(angle);
  }

  setWidthHeight(width: number, height: number) {
    this.group.width(width).height(height);
    this.group.find('.axisx')[0].points([0, height, width, height]);
    this.group.find('.axisy')[0].points([0, height, 0, 0]);

    this.group
      .find('.topLeft')[0]
      .x(0)
      .y(0);

    this.$rmBtn
      .x((this.group.width() - this.$rmBtn.width()) / 2.0)
      .y((this.group.height() - this.$rmBtn.height()) / 2.0)
      .show();
    this.$rmBtn.moveToTop();
  }

  showAnchors(isShow: boolean) {
    const topLeft = this.group.find('.topLeft')[0];

    if (isShow) {
      topLeft.show();
    } else {
      topLeft.hide();
    }

    return isShow;
  }
}

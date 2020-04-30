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

  computeGroupPosition(x: number, y: number, rotation: number, ratio: number) {
    const factor = Math.PI / 180;
    let groupX = x;
    let groupY = y;

    if ((rotation > 0 && rotation <= 90) || (rotation > -360 && rotation <= -270)) {
      groupX += 100 * Math.sin(rotation * factor);
      groupY += 100 * Math.cos(rotation * factor);
    }

    if ((rotation > 90 && rotation <= 180) || (rotation > -270 && rotation <= -180)) {
      groupX += 100 * Math.sin((180 - rotation) * factor);
      groupY -= 100 * Math.cos((180 - rotation) * factor);
    }

    if ((rotation > 180 && rotation <= 270) || (rotation > -180 && rotation <= -90)) {
      groupX -= 100 * Math.sin((rotation - 180) * factor);
      groupY -= 100 * Math.cos((rotation - 180) * factor);
    }

    if ((rotation > 270 && rotation <= 360) || (rotation > -90 && rotation <= 0)) {
      groupX -= 100 * Math.sin((360 - rotation) * factor);
      groupY += 100 * Math.cos((360 - rotation) * factor);
    }

    this.group
      .x(groupX * ratio)
      .y(groupY * ratio)
      .rotate(rotation);
  }

  getOriginPosition(ratio: number) {
    const { group } = this;
    const x = group.x();
    const y = group.y();
    const rotation = group.rotation() % 360;
    const factor = Math.PI / 180;

    if ((rotation > 0 && rotation <= 90) || (rotation > -360 && rotation <= -270)) {
      return {
        x: x / ratio - 100 * Math.sin(rotation * factor),
        y: y / ratio - 100 * Math.cos(rotation * factor),
      };
    }

    if ((rotation > 90 && rotation <= 180) || (rotation > -270 && rotation <= -180)) {
      return {
        x: x / ratio - 100 * Math.sin((180 - rotation) * factor),
        y: y / ratio + 100 * Math.cos((180 - rotation) * factor),
      };
    }

    if ((rotation > 180 && rotation <= 270) || (rotation > -180 && rotation <= -90)) {
      return {
        x: x / ratio + 100 * Math.sin((rotation - 180) * factor),
        y: y / ratio + 100 * Math.cos((rotation - 180) * factor),
      };
    }

    return {
      x: x / ratio + 100 * Math.sin((360 - rotation) * factor),
      y: y / ratio - 100 * Math.cos((360 - rotation) * factor),
    };
  }

  getCoordinate(ratio: number = 1) {
    const { group } = this;
    const deg = group.rotation() % 360;
    const { x, y } = this.getOriginPosition(ratio);
    return [x, y, deg];
  }

  load(coordinate: Array<number> = [], ratio: number) {
    const [x, y, rotation] = coordinate;

    this.computeGroupPosition(x, y, rotation, ratio);
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

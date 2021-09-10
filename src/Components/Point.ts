import * as konva from 'konva';
import Shape from './Shape';

const Konva: any = konva;

export default class Point extends Shape {
  public static shapeName: string = 'POINT';

  public static type: string = 'POINT';

  public static text: string = '点';

  shapeName: string = 'POINT';

  type: string = 'POINT';

  text: string = '点';

  constructor(options: typeof Konva.Rect) {
    super(options);

    const { group } = this;

    const lineX = new Konva.Line({
      name: 'lineX',
      points: [0, 0],
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });

    const lineY = new Konva.Line({
      name: 'lineY',
      points: [0, 0],
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });

    group.$$this = this;
    group.add(lineX);
    group.add(lineY);

  }

  getCoordinate(ratio: number = 1) {
    const { group } = this;
    const { x, y } = group.position();
    return [x, y];
  }

  load(point: Array<number> = [], ratio: number) {
    const [x, y, rotation] = point;

    this.group
      .x(x)
      .y(y)
      .rotate(rotation);

    this.setWidthHeight(10, 10);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseDown(e: any, data: { lastX: number; lastY: number }) {
    this.setWidthHeight(20, 20);
  }

  handleMouseMove(e: any, data: { lastX: number; lastY: number }) {
    this.setWidthHeight(20, 20);
  }

  setWidthHeight(width: number, height: number) {
    this.group.width(width).height(height);
    this.group.find('.lineX')[0].points([0 - width / 2, 0, width / 2, 0]);
    this.group.find('.lineY')[0].points([0, height / 2, 0, 0 - height / 2]);

    // this.$rmBtn
    //   .x((this.group.width() - this.$rmBtn.width()) / 2.0)
    //   .y((this.group.height() - this.$rmBtn.height()) / 2.0)
    //   .show();
    // this.$rmBtn.moveToTop();
  }

  showAnchors(isShow: boolean) {
    return false;
  }
}
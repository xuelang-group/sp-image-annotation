import * as konva from 'konva';
import Shape from './Shape';

const Konva: any = konva;

export default class Rect extends Shape {
  public static shapeName: string = 'RECTANGLE';

  public static type: string = 'RECTANGLE';

  public static text: string = '矩形';

  shapeName: string = 'RECTANGLE';

  type: string = 'RECTANGLE';

  text: string = '矩形';

  constructor(options: typeof Konva.Rect) {
    super(options);

    const { x, y, width, height } = options;
    const { group } = this;
    const rect = new Konva.Rect({
      name: 'target',
      x: 0,
      y: 0,
      width,
      height,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
    });

    group.$$this = this;
    group.add(rect);

    this.addAnchor(group, x, y, 'topLeft');
    this.addAnchor(group, x, y, 'topRight');
    this.addAnchor(group, x, y, 'bottomRight');
    this.addAnchor(group, x, y, 'bottomLeft');
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    const { group } = this;

    const topLeft = group.find('.topLeft')[0];
    const topRight = group.find('.topRight')[0];
    const bottomRight = group.find('.bottomRight')[0];
    const bottomLeft = group.find('.bottomLeft')[0];
    const target = group.find('.target')[0];

    const anchorX = activeAnchor.getX();
    const anchorY = activeAnchor.getY();

    const width = topRight.getX() - topLeft.getX();
    const height = bottomLeft.getY() - topLeft.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
      case 'topLeft':
        topRight.y(anchorY);
        bottomLeft.x(anchorX);
        break;
      case 'topRight':
        topLeft.y(anchorY);
        bottomRight.x(anchorX);
        break;
      case 'bottomRight':
        bottomLeft.y(anchorY);
        topRight.x(anchorX);
        break;
      case 'bottomLeft':
        bottomRight.y(anchorY);
        topLeft.x(anchorX);
        break;
      default:
        break;
    }

    target.position(topLeft.position());
    if (width && height) {
      target.width(width);
      target.height(height);
      group.width(width);
      group.height(height);
    }
  }

  showAnchors(isShow: boolean) {
    const topLeft = this.group.find('.topLeft')[0];
    const topRight = this.group.find('.topRight')[0];
    const bottomRight = this.group.find('.bottomRight')[0];
    const bottomLeft = this.group.find('.bottomLeft')[0];
    if (isShow) {
      topLeft.show();
      topRight.show();
      bottomRight.show();
      bottomLeft.show();
    } else {
      topLeft.hide();
      topRight.hide();
      bottomRight.hide();
      bottomLeft.hide();
    }

    return isShow;
  }
}

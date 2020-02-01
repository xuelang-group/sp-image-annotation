import * as konva from 'konva'
import Shape from './Shape'
const Konva: any = konva

export default class Circle extends Shape {
  public static shapeName: string = 'CIRCLE'
  public static type: string = 'CIRCLE'
  public static text: string = '圆形'

  shapeName: string = 'CIRCLE'
  type: string = 'CIRCLE'
  text: string = '圆形'

  constructor(options: typeof Konva.Circle) {
    super(options)

    const { x, y } = options
    const group = this.group
    const circle = new Konva.Circle({ name: 'target', x: 0, y: 0, radius: 1, stroke: this.stroke, strokeWidth: this.strokeWidth })

    group.__$$this = this
    group.add(circle)

    this.addAnchor(group, x, y, 'top')
  }

  getCoordinate(widthRatio: number = 1, heightRatio: number = 1) {
    const group = this.group
    return [group.x() / widthRatio, group.y() / heightRatio, group.width() / widthRatio / 2.0]
  }

  setWidthHeight(width: number, height: number) {
    const size = Math.max(width, height)
    const circle = this.group.find('.target')[0]

    this.group.width(size)
    this.group.height(size)

    this.group.find('.target')[0].width(width).height(height)
    this.group.find('.top')[0].x(size / 2.0).y(0)

    circle.x(size / 2.0)
    circle.y(size / 2.0)
    circle.width(size)
    circle.height(size)
  }

  showAnchors(isShow: boolean) {
    const anchor = this.group.find('.top')[0]
    if (isShow) {
      anchor.show()
    } else {
      anchor.hide()
    }
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    const group = activeAnchor.getParent()
    const target = group.find('.target')[0]

    const anchorY = activeAnchor.getY()

    const size = Math.max(0, (target.y() - anchorY) * 2.0)

    activeAnchor.x(target.x())
    target.width(size).height(size)
    group.width(size).height(size)
  }
}

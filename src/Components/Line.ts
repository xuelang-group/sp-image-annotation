import * as konva from 'konva'
import Shape from './Shape'
const Konva: any = konva

export default class Line extends Shape {
  public static shapeName: string = 'LINE'
  public static type: string = 'LINE'
  public static text: string = '线段'

  shapeName: string = 'LINE'
  type: string = 'LINE'
  text: string = '线段'

  constructor(options: typeof Konva.Line) {
    super(options)

    const group = this.group
    const line = new Konva.Line({ name: 'target', points: [0, 0], stroke: this.stroke, strokeWidth: this.strokeWidth })

    group.__$$this = this
    group.add(line)
  }

  points(pts: number[] = []) {
    const line = this.group.find('.target')[0]

    if (!pts || !pts.length) {
      return line.points()
    }

    const startPointX = pts[0]
    const startPointY = pts[1]
    const endPointX = pts[pts.length - 2]
    const endPointY = pts[pts.length - 1]

    if (Math.abs(startPointX - endPointX) <= 3 && Math.abs(endPointY - startPointY) <= 3) {
      line.closed(true)
    }
    return line.points(pts)
  }
}

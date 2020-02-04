import * as konva from 'konva'
import Shape from './Shape'
import KonvaType from 'konva/types/index-types'
const Konva: any = konva

export default class Line extends Shape {
  public static shapeName: string = 'LINE'
  public static type: string = 'LINE'
  public static text: string = '线段'

  shapeName: string = 'LINE'
  type: string = 'LINE'
  text: string = '线段'

  line: KonvaType.Line
  tmpLine: KonvaType.Line

  constructor(options: typeof Konva.Line) {
    super(options)

    const group = this.group
    const line = new Konva.Line({ name: 'target', points: [0, 0], stroke: this.stroke, strokeWidth: this.strokeWidth })

    this.line = line
    this.tmpLine = new Konva.Line({ points: [0, 0], stroke: this.stroke, strokeWidth: this.strokeWidth })

    group.__$$this = this
    group.add(line)
    group.add(this.tmpLine)
  }

  close(forceClose: boolean = false) {
    const line = this.getTarget().find('.target')[0]
    const pts = line.points()
    const startPointX = pts[0]
    const startPointY = pts[1]
    const endPointX = pts[pts.length - 2]
    const endPointY = pts[pts.length - 1]

    if (pts.length > 2 && Math.abs(startPointX - endPointX) <= 3 && Math.abs(endPointY - startPointY) <= 3) {
      forceClose = true
    }

    if (forceClose) {
      this.tmpLine.points([0, 0])
    }

    return forceClose
  }

  handleMouseDown(e: any, { lastX, lastY }: { lastX: number, lastY: number }) {
    const stage = this.group.getStage()
    const pos = stage.getPointerPosition();
    const pts = [...this.points(), ...[pos.x - lastX, pos.y - lastY]]

    this.points(pts)
  }

  handleMouseMove(e: any, data: { lastX: number, lastY: number }) {
    super.handleMouseMove(e, data)
    const stage = this.group.getStage()
    const pos = stage.getPointerPosition();
    const pts = this.points()

    this.tmpLine.points([pts[pts.length - 2], pts[pts.length - 1], pos.x - data.lastX, pos.y - data.lastY])
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

  resize(data: { width?: number, height?: number, ratio?: number }) {
    this.points(this.points().map((point: number) => point * data.ratio))
  }

  setWidthHeight(width: number, height: number) { }
}
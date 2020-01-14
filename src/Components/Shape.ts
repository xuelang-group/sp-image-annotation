import * as konva from 'konva'
const Konva: any = konva

export default class Shape {
  protected static shapeName = 'Shape'
  protected static type = 'Shape'
  protected static text = '形状'
  protected stroke = '#df4b26'
  protected strokeWidth = 2

  protected anchorStroke = '#666'
  protected anchorFill = '#ddd'
  protected anchorStrokeWidth = 2
  protected anchorFocusStrokeWidth = 4
  protected anchorRadius = 6

  protected group: typeof Konva.Group = {}

  protected options: Object = {}

  constructor(options: typeof Konva.Shape) {
    this.options = options
    const { x, y } = options
    const group = this.group = new Konva.Group({ x, y, draggable: true })

    group.on('mousedown', (event: any) => {
      event.cancelBubble = true
    })
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
      dragOnTop: false
    })

    anchor.on('dragmove', () => {
      this.updateAnchor(anchor)
    })

    anchor.on('mousedown touchstart', () => {
      group.draggable(false)
      anchor.moveToTop()
    })

    anchor.on('dragend', () => {
      group.draggable(true)
    })

    anchor.on('mouseover', () => {
      const layer = anchor.getLayer()
      document.body.style.cursor = 'pointer'
      anchor.strokeWidth(this.anchorFocusStrokeWidth)
      layer.draw()
    })

    anchor.on('mouseout', () => {
      const layer = anchor.getLayer()
      document.body.style.cursor = 'default'
      anchor.strokeWidth(2)
      layer.draw()
    })

    group.add(anchor)
  }

  getCoordinate() {
    const group = this.group
    const target = group.find('.target')[0]
    return [group.x(), group.y(), target.width(), target.height()]
  }

  getTarget() {
    return this.group
  }

  setWidthHeight(width: number, height: number) {
    this.group.width(width).height(height)
    this.group.find('.target')[0].width(width).height(height)
    this.group.find('.topLeft')[0].x(0).y(0)
    this.group.find('.topRight')[0].x(width).y(0)
    this.group.find('.bottomRight')[0].x(width).y(height)
    this.group.find('.bottomLeft')[0].x(0).y(height)
  }

  updateAnchor(activeAnchor: typeof Konva.Anchor) {
    throw new Error(`updateAnchor should be overrided, activeAnchor: ${activeAnchor}`)
  }
}

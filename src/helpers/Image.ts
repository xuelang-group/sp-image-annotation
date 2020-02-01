export type ImageConfig = {
  src?: string,
  container?: string | HTMLElement,
  containerDOM?: HTMLElement,
  className?: string
}

export default class ImageHelper {
  ratio: number
  originWidth: number
  originHeight: number

  $img: HTMLImageElement

  constructor(options: ImageConfig) {
    if (typeof options.container === 'string') {
      options.containerDOM = document.getElementById(options.container)
    } else {
      options.containerDOM = options.container
    }
    this.$img = this.createDOM(options)
  }

  createDOM(options: ImageConfig) {
    const $img = document.createElement('img')
    const { containerDOM, src = '', className = '' } = options

    $img.setAttribute('src', '')
    $img.setAttribute('class', className)
    $img.onload = () => {
      this.resize({ container: containerDOM });
    }
    $img.setAttribute('src', src)

    return $img
  }

  getDOM() {
    return this.$img
  }

  onload(callback: (event: Event) => void) {
    if (callback) {
      this.$img.onload = callback
    }
  }

  resize({
    container = null,
    width = 0,
    height = 0
  }: {
    container?: HTMLElement,
    width?: number, 
    height?: number
  }) {
    if (container) {
      width = container.clientWidth
      height = container.clientHeight
    }

    this.$img.setAttribute('width', `${width}`)
    this.$img.setAttribute('height', `${height}`)
  }

  setImageSrc(src: string) {
    this.$img.setAttribute('src', src)
  }
}

export type ImageType = typeof ImageHelper

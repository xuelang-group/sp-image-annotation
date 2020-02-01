import { StageType } from "../Stage";

export interface ResizerOptions {
  ratio?: number
  imgContainer?: HTMLElement
  canvas?: HTMLCanvasElement
  stage: StageType
}

export default class Resizer {
  constructor(options: ResizerOptions) {

  }
}
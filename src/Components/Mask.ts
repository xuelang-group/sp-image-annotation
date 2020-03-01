import Rect from './Rect';

export default class Mask extends Rect {
  public static shapeName: string = 'MASK';

  public static type: string = 'MASK';

  public static text: string = '遮罩';

  shapeName: string = 'MASK';

  type: string = 'MASK';

  text: string = '遮罩';

  constructor(options: any) {
    super({ ...options, fill: 'rgba(0, 0, 0, 0.2)' });
  }
}

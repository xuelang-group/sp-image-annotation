# sp-image-annotation

算盘组件中用于图片标定的画图工具。

支持：

- 线段
- 矩形
- 圆形
- 同心圆
- 遮罩
- 坐标系

## 示例

- 创建节点

```html
<div id="camera-image"></div>
```

- 初始化画图工具

```javascript
import { Annotation } from "sp-image-annotation";

const annotation = new Annotation({
  container: 'camera-image',
  width: imageSize.width,
  height: imageSize.height,
  imgSrc: './demo/demo.jpg',
  onBeforeAddShape: (shapeType, extra) => {
    console.log('before add shape:', shapeType, extra);
    return true;
  },
  onShapeAdded: (shapeType, extra) => {
    console.log('shape added:', shapeType, extra);
    return true;
  },
  onShapeRemoved: shape => {
    console.log('shape removed:', shape);
  },
});
```

- 页面结果

![](/docs/demo.png)

## 配置项

- container: string

  DOM 节点 id

- shapes?: string[]

  配置工具栏上支持的图形按钮，缺省是

  ```json
  ["RECTANGLE", "MASK", "CIRCLE", "LINE", "COORDINATE", "CONCENTRIC_CIRCLE"]
  ```

  如只需要加载 矩形 和 圆形 两种工具的按钮，可如下传参

  ```javascript
    new Annotation({
      ...
      shapes: ['RECTANGLE', 'CIRCLE'],
      ...
    })
  ```

  图形类型详见[框选图形](#框选图形)。

- width?: number
- height?: number

  图片的宽和高，单位为像素值

- imgSrc?: string

  图片的 URL

- onBeforeAddShape?: (shapeType: string, extraData: any) => boolean

  在添加框选区域前，触发该回调方法，入参为添加的类型及相关数据。

  如果该回调方法中返回 false，则图形不会被添加。

- onShapeAdded?: (shapeType: string, extraData: any) => boolean;

  在添加框选区域后，触发该回调方法，入参为添加的类型及相关数据。

  如果该回调方法中返回 false，则图形不会被添加。

- onShapeRemoved?: (shape: ShapeType) => boolean;

  在删除框选区域后，触发该回调方法，入参为添加的类型及相关数据。

  如果该回调方法中返回 false，则图形不会被删除。

## 框选图形

### 支持图形列表

`线段`

- 数据格式

  coordinate 记录线段上各个点的坐标，x / y 坐标成对出现，即 [x0, y0, x1, y1, x2, y2]

  ```json
  { "type": "LINE", "coordinate": [300, 150, 350, 200, 450, 120, 300, 150] }
  ```

`矩形`

- 数据格式

  coordinate 记录矩形的左上角和矩形的宽和高，即 [leftTopX, leftTopY, width, height]

  ```json
  { "type": "RECTANGLE", "coordinate": [100, 10, 100, 100] }
  ```

`圆形`

- 数据格式

  coordinate 记录圆形的圆心坐标及半径长度，即 [cx, cy, r]

  ```json
  { "type": "CIRCLE", "coordinate": [200, 200, 100] }
  ```

`同心圆`

- 数据格式

  coordinate 记录圆心坐标及内圆半径、外圆半径，即 [cx, cy, innerR, outerR]

  ```json
  { "type": "CONCENTRIC_CIRCLE", "coordinate": [600, 200, 10, 100] }
  ```

`遮罩`

- 数据格式

  coordinate 记录遮罩的左上角和矩形的宽和高, 即 [leftTopX, leftTopY, width, height]

  ```json
  { "type": "MASK", "coordinate": [100, 120, 100, 100] }
  ```

`坐标系`

- 数据格式

  coordinate 记录坐标系原点坐标和选角角度，即 [cx, cy, rotation]

  ```json
  { "type": "COORDINATE", "coordinate": [600, 50, 90] }
  ```

## 数据格式

输出数据包含了各个图形的 id、type 和 coordinate。

```json
[
  {
    "id": "e0190095-9a6c-450a-8f2e-135f26420cc6",
    "type": "RECTANGLE",
    "coordinate": [100, 10, 100, 100]
  },
  {
    "id": "b759ca53-2c97-463d-bcb4-1d7cfbf31b07",
    "type": "MASK",
    "coordinate": [100, 120, 100, 100]
  },
  {
    "id": "c8494868-b7e7-4eab-89dd-4ab1d428e050",
    "type": "CIRCLE",
    "coordinate": [200, 200, 100]
  },
  {
    "id": "23ac7e53-64e4-46c1-bded-2e5dcade1d17",
    "type": "LINE",
    "coordinate": [300, 150, 350, 200, 450, 120, 300, 150]
  },
  {
    "id": "5c04faa9-308b-4a42-98ea-43427a1e07cd",
    "type": "COORDINATE",
    "coordinate": [600, 50, 90]
  },
  {
    "id": "78fb3601-d588-4d80-b96e-a94e3a72c39a",
    "type": "CONCENTRIC_CIRCLE",
    "coordinate": [100, 100, 10, 100]
  },
  {
    "id": "29aea1a8-3d27-4321-9a10-2c9e36b784e1",
    "type": "LINE",
    "coordinate": [735.1237114501049, 54.419642857142854]
  }
]
```

## 事件

### 事件列表

- imageloaded

  图片加载完成后，触发该事件，可用于更新图形数据等。

  示例

  ```javascript
  var spImageAnnotation = new SpImageAnnotation.Annotation({
    ...
  });

  spImageAnnotation.on('imageloaded', function() {
    spImageAnnotation.load([
      { type: 'RECTANGLE', coordinate: [100, 10, 100, 100] },
      { type: 'MASK', coordinate: [100, 120, 100, 100] },
      { type: 'CIRCLE', coordinate: [200, 200, 100] },
      { type: 'LINE', coordinate: [300, 150, 350, 200, 450, 120, 300, 150] },
      { type: 'COORDINATE', coordinate: [600, 50, 90] },
      { type: 'CONCENTRIC_CIRCLE', coordinate: [600, 200, 10, 100] },
    ]);
  });

  ```

- shape:select

  在图形被选中时，触发该事件。

## API

- load

  加载图形数据

  ```javascript
  var spImageAnnotation = new SpImageAnnotation.Annotation({
    ...
  });

  spImageAnnotation.on('imageloaded', function() {
    spImageAnnotation.load([
      { type: 'RECTANGLE', coordinate: [100, 10, 100, 100] },
      { type: 'MASK', coordinate: [100, 120, 100, 100] },
      { type: 'CIRCLE', coordinate: [200, 200, 100] },
      { type: 'LINE', coordinate: [300, 150, 350, 200, 450, 120, 300, 150] },
      { type: 'COORDINATE', coordinate: [600, 50, 90] },
      { type: 'CONCENTRIC_CIRCLE', coordinate: [600, 200, 10, 100] },
    ]);
  });

  ```

- getShapeData

  获取图形数据

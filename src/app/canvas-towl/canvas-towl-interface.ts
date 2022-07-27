export interface Point {
  x: number,
  y: number
}

export interface Level {
  index: number,
  details: any
}

export interface Angle {
  LTB: number,
  RTB: number
}

export interface PyramidAttrs {
  top: Point,
  left: Point,
  right: Point,
  bottom: Point,
}

export interface PyramidPart {
  topLeft: Point,
  bottomLeft: Point,
  bottom: Point,
  bottomRight: Point,
  topRight: Point,
  top: Point
}

export interface Configuration {
  title: string,
  // 主体离边框距离
  padding: number[],
  // 主体偏移值 (x,y)
  offset: number[],
  // 层与层间距离
  margin: number,
  // 排序, max or min
  sort: string,
  // 鼠标点击事件
  click: any,
  // 鼠标移动事件
  move: any,
  // 颜色
  color: string[],
  // 格式化字体输出
  fontFormatter: any,
  // tooltip显示
  tooltip: {
    show: boolean,
    fontColor: string, //  字体内部颜色
    fontSize: number, // 字体大小
    backgroundColor: string, // tooltip背景
    formatter: any, // 返回方法
    z: number// tooltip z-index层级
  },
  // 样式
  infoStyle: {
    stroke: boolean, //是否描边
    strokeColor: string, // 描边颜色
    size: number, // 字体大小
    color: string, //颜色
    width: number, // 设置多少 就会在基础上加上设置的值
    offset: number[], // 字体x,y的偏移度
    setLineDash: number[], //虚线值
    highlightedColor: string, //高亮颜色
    dotSize: number//点大小
  }
}

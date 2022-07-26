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
  highlightColor: string,
  // tooltip显示
  tooltip: {
    show: boolean,
    fontColor: string, //  字体内部颜色
    fontSize: number, // 字体大小
    backgroundColor: string, // tooltip背景
    formatter: any, // 返回方法
    z: number// tooltip z-index层级
  },
}

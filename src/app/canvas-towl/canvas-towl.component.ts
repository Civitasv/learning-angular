import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Point, PyramidAttrs, PyramidPart, Angle, Configuration, Level } from "./canvas-towl-interface"

@Component({
  selector: 'app-canvas-towl',
  templateUrl: './canvas-towl.component.html',
  styleUrls: ['./canvas-towl.component.scss']
})
export class CanvasTowlComponent implements AfterViewInit, OnChanges {
  /** 组件属性 */
  canvas: any;
  ctx: CanvasRenderingContext2D;

  // 画布高度
  canvasHeight: number = 0;
  // 画布宽度
  canvasWidth: number = 0;
  // 画布中心点
  canvasCenter: Point;
  // 金字塔四个点位置，上，左下，前，右下
  points: PyramidAttrs = {
    top: { x: 0, y: 0 },
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
    bottom: { x: 0, y: 0 },
  };
  // 数据信息
  detailsDataInfo = [];
  // 顶端角度
  topAngle: Angle = {
    LTB: 0,
    RTB: 0
  };

  // tooltip 模板
  tooltipDiv = `<div style="margin: 0px 0 0; line-height: 1;border-color: $[backgroundColor]$ ;background-color: $[backgroundColor]$;color: $[fontColor]$;
    border-width: 1px;border-radius: 4px;padding: 10px;pointer-events: none;box-shadow: rgb(0 0 0 / 20%) 1px 2px 10px;border-style: solid;white-space: nowrap;">
        <div style="margin: 0px 0 0; line-height: 1">
          <div style="font-size: $[fontSize]$px; color: $[fontColor]$; font-weight: 400; line-height: 1"> $[title]$ </div>
          <div style="margin: 10px 0 0; line-height: 1">
            <div style="margin: 0px 0 0; line-height: 1">
              <div style="margin: 0px 0 0; line-height: 1">
                <span
                  style="
                    display: inline-block;
                    margin-right: 4px;
                    border-radius: 10px;
                    width: 10px;
                    height: 10px;
                    background-color: $[color]$;
                  "
                ></span>
                <span style="font-size: $[fontSize]$px; color: $[fontColor]$; font-weight: 400; margin-left: 2px">$[name]$</span>
                <span style="float: right; margin-left: 20px; font-size: $[fontSize]$px; color: $[fontColor]$; font-weight: 900">$[val]$</span>
                <div style="clear: both"></div>
              </div>
              <div style="clear: both"></div>
            </div>
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="clear: both"></div>
      </div>`;

  // 组件配置
  config: Configuration;

  /** ViewChild 注入 */
  @ViewChild("wrapper") canvasWrapper: ElementRef;
  @ViewChild("tooltip") canvasTooltip: ElementRef;

  /** 配置项 */
  @Input("options")
  options: Configuration = {
    title: '标题',
    // 主体离边框距离
    padding: [30, 30],
    // 主体偏移值 (x,y)
    offset: [0, -10],
    margin: 5,
    // 排序(max , min)优先
    sort: 'max',
    // 颜色
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    highlightColor: "#fff",
    // 格式化字体输出
    fontFormatter: () => {
      return 'default'
    },
    // 鼠标点击事件
    click: true,
    // 鼠标移动事件
    move: true,
    // tooltip信息配置
    tooltip: {
      show: false, // 是否显示
      fontColor: '#000', //  字体内部颜色
      fontSize: 14, // 字体大小
      backgroundColor: '#fff', // tooltip背景
      formatter: null, // 回调方法
      z: 999999 // tooltip z-index层级
    },
  };

  /** 数据项 */
  @Input("data")
  data: { name: string, value: number }[] = [
    { name: "示例1", value: 20 },
    { name: "示例2", value: 10 },
    { name: "示例3", value: 20 },
  ];

  @Output()
  onMouseDown = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["options"]) {
      this.config = this.configuration();
      this.init();
    }
    if (changes["data"]) {
      this.init();
    }
  }

  constructor() {
  }

  ngAfterViewInit(): void {
    console.log("🚀 ~ file: canvas-towl.component.ts ~ line 211 ~ CanvasTowlComponent ~ ngAfterViewInit ~ ngAfterViewInit")
    this.config = this.configuration();
    this.init();
  }

  configuration(): Configuration {
    return {
      title: this.options.title ? this.options.title : '',
      // 主体离边框距离
      padding: this.options.padding ? this.options.padding : [0, 0],
      // 层与层间距离
      margin: this.options.margin ? this.options.margin : 2,
      // 主体偏移值 (x,y)
      offset: this.options.offset ? this.options.offset : [0, 0],
      // 排序(max , min)优先
      sort: this.options.sort ? this.options.sort : '',
      // 鼠标点击事件
      click: this.options.click ? this.options.click : false,
      // 鼠标移动事件
      move: this.options.move ? this.options.move : false,
      // 颜色
      color: this.options.color ? this.options.color : ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
      highlightColor: "#fff",
      // 格式化字体输出
      fontFormatter: this.options.fontFormatter
        ? this.options.fontFormatter
        : () => {
          return 'default'
        },
      // tooltip显示
      tooltip: {
        show: this.options.tooltip ? (this.options.tooltip.show ? this.options.tooltip.show : false) : false, // 是否显示
        fontColor: this.options.tooltip
          ? this.options.tooltip.fontColor
            ? this.options.tooltip.fontColor
            : '#000'
          : '#000', //  字体内部颜色
        fontSize: this.options.tooltip ? (this.options.tooltip.fontSize ? this.options.tooltip.fontSize : 14) : 14, // 字体大小
        backgroundColor: this.options.tooltip
          ? this.options.tooltip.backgroundColor
            ? this.options.tooltip.backgroundColor
            : '#fff'
          : '#fff', // tooltip背景
        formatter: this.options.tooltip
          ? this.options.tooltip.formatter
            ? this.options.tooltip.formatter
            : null
          : null, // 返回方法
        z: this.options.tooltip ? (this.options.tooltip.z ? this.options.tooltip.z : 999999) : 999999 // tooltip z-index层级
      },
    }
  }

  init() {
    if (!this.checkData()) return;
    this.calCulateDetails();
    this.initCanvasDomElement()
    this.initCanvasBaseInfo()
    this.paintDataInfo()
    this.addShadow()
  }

  /**
   * @description: 检查 data 是否合法
   * @param {void}
   * @return {boolean}
   */
  checkData(): boolean {
    if (!this.data || !this.data.length) return false;

    for (const item of this.data) {
      if (isNaN(item.value)) return false;
    }
    return true;
  }

  calCulateDetails(): void {
    const total = this.data.reduce((pre, curr) => { return pre + curr.value }, 0)
    this.detailsDataInfo = this.data.map(item => {
      const percent = (item.value / total) * 100
      return { ...item, percent, title: this.config.title }
    })
    console.log("🚀 ~ file: canvas-towl.component.ts ~ line 286 ~ CanvasTowlComponent ~ dataFormatAssignment ~ dataInfo", this.detailsDataInfo)
    if (this.config.sort === 'max') {
      this.detailsDataInfo.sort((a, b) => {
        return a.value - b.value
      })
    } else if (this.config.sort === 'min') {
      this.detailsDataInfo.sort((a, b) => {
        return b.value - a.value
      })
    }
  }

  /**
   * @description: 创建 canvas Dom 元素
   * @return {void}
   */
  initCanvasDomElement(): void {
    let el = this.canvasWrapper.nativeElement
    console.log("🚀 ~ file: canvas-towl.component.ts ~ line 254 ~ CanvasTowlComponent ~ elementCreate ~ el", el.offsetWidth, el.offsetHeight)
    if (this.canvas) {
      el.removeChild(this.canvas)
    }
    // 创建canvas元素
    this.canvas = document.createElement('canvas')
    // 把canvas元素节点添加在el元素下
    el.appendChild(this.canvas)
    this.canvasWidth = el.offsetWidth
    this.canvasHeight = el.offsetHeight
  }

  /**
   * @description: 初始化 canvas 基本信息
   * @return {void}
   */
  initCanvasBaseInfo(): void {
    // 将canvas元素设置与父元素同宽
    this.canvas.setAttribute('width', this.canvasWidth)
    // 将canvas元素设置与父元素同高
    this.canvas.setAttribute('height', this.canvasHeight)

    this.canvasCenter = {
      x: Math.round((this.canvasWidth - this.config.padding[0] * 2) / 2) + this.config.padding[0],
      y: Math.round((this.canvasHeight - this.config.padding[1] * 2) / 2) + this.config.padding[1]
    }

    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d')
      // 金字塔基本点位置
      this.points.top = { x: this.canvasCenter.x, y: this.config.padding[1] }
      this.points.left = {
        x: this.config.padding[0] * 1.5,
        y: this.canvasHeight - this.config.padding[1] - this.canvasHeight / 5
      }
      this.points.right = {
        x: this.canvasWidth - this.config.padding[0] * 1.9,
        y: this.canvasHeight - this.config.padding[1] - this.canvasHeight / 5
      }
      this.points.bottom = {
        x: this.canvasCenter.x,
        y: this.canvasHeight - this.config.padding[1]
      }
      for (const key in this.points) {
        this.points[key].x = this.points[key].x + this.config.offset[0]
        this.points[key].y = this.points[key].y + this.config.offset[1]
      }
    } else {
      throw 'canvas下未找到 getContext方法'
    }
    this.topAngle.LTB = this.calculateAngle(this.points.top, this.points.left, this.points.bottom)
    this.topAngle.RTB = this.calculateAngle(this.points.top, this.points.right, this.points.bottom)
    // 计算金字塔各部分关键点
    this.calculatePyramidParts(this.detailsDataInfo)
  }

  /**
   * @description: 绘制数据图层
   * @return {*}
   */
  paintDataInfo(): void {
    const margin = 2
    let index = -1
    this.detailsDataInfo = this.detailsDataInfo.map(item => {
      index++
      if (this.config.color.length === index) {
        index = 0
      }
      return { ...item, color: this.config.color[index] }
    })

    this.ctx.shadowBlur = 0
    this.detailsDataInfo.forEach((item, index) => {
      this.ctx.fillStyle = item.color
      this.ctx.beginPath()

      this.ctx.moveTo(item.points.topLeft.x, item.points.topLeft.y)
      this.ctx.lineTo(item.points.bottomLeft.x, item.points.bottomLeft.y)
      this.ctx.lineTo(item.points.bottom.x, item.points.bottom.y)
      this.ctx.lineTo(item.points.bottomRight.x, item.points.bottomRight.y)
      this.ctx.lineTo(item.points.topRight.x, item.points.topRight.y)
      this.ctx.lineTo(item.points.top.x, item.points.top.y)

      this.ctx.fill()
    })
  }

  /**
   * @description: 添加阴影
   * @return {*}
   */
  addShadow(): void {
    this.ctx.shadowColor = 'rgba(90,90,90,0)'
    this.ctx.fillStyle = 'rgba(120,120,120,.15)'
    this.detailsDataInfo.forEach(item => {
      this.ctx.beginPath()
      this.ctx.moveTo(item.points.topLeft.x, item.points.topLeft.y)
      this.ctx.lineTo(item.points.bottomLeft.x, item.points.bottomLeft.y)
      this.ctx.lineTo(item.points.bottom.x, item.points.bottom.y)
      this.ctx.lineTo(item.points.top.x, item.points.top.y)
      this.ctx.fill()
    })
  }


  /**
    * @description: 显示tooltip位置
    * @param {*} layer 当前层级
    * @param {*} point 鼠标位置
    * @return {*}
    */
  showTooltip(layer: Level, point: Point) {
    let canvasWarpper = this.canvasWrapper.nativeElement
    let canvasTooltip = this.canvasTooltip.nativeElement
    if (layer) {
      canvasTooltip.style.zIndex = this.config.tooltip.z
      canvasTooltip.style.transition =
        ' opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,transform 0.15s'
      let html = JSON.parse(JSON.stringify(this.tooltipDiv))
      if (this.config.tooltip.formatter) {
        html = this.config.tooltip.formatter(layer)
      } else {
        const searchVal = [
          ['$[title]$', layer.details.title],
          ['$[name]$', layer.details.name],
          ['$[val]$', layer.details.value],
          ['$[color]$', layer.details.color],
          ['$[fontSize]$', this.config.tooltip.fontSize],
          ['$[backgroundColor]$', this.config.tooltip.backgroundColor],
          ['$[fontColor]$', this.config.tooltip.fontColor]
        ]
        searchVal.forEach(el => {
          html = html.replaceAll(...el)
        })
      }
      canvasTooltip.innerHTML = html
      canvasWarpper.style.cursor = 'pointer'
      canvasTooltip.style.visibility = 'visible'
      canvasTooltip.style.opacity = '1'
      let { x, y } = point
      x = x + 20
      y = y + 20
      // 画布高度
      // canvasHeight: 0,
      // 画布宽度
      // canvasWidth: 0,
      // 判断是否超出框架内容
      if (x + canvasTooltip.clientWidth > this.canvasWidth) {
        x = x - canvasTooltip.clientWidth - 40
      }
      if (y + canvasTooltip.clientHeight > this.canvasHeight) {
        y = y - canvasTooltip.clientHeight - 40
      }
      canvasTooltip.style.transform = `translate3d(${x}px, ${y}px, 0px)`
    } else {
      canvasWarpper.style.cursor = 'default'
      canvasTooltip.style.visibility = 'hidden'
      canvasTooltip.style.opacity = '0'
    }
  }

  /**
    * @description: 高亮某一层级
    * @param {*} layer 层级数据
    * @return {*}
    */
  highlightCurrentRegion(layer: Level) {
    // const width = this.canvas.width;
    // this.canvas.width = width;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.paintDataInfo()
    this.addShadow()
    if (!layer) {
      return
    }
    this.ctx.fillStyle = layer.details.color
    //  this.ctx.scale(1.05, 1.05)
    this.ctx.beginPath()

    this.ctx.moveTo(layer.details.points.topLeft.x, layer.details.points.topLeft.y)
    this.ctx.lineTo(layer.details.points.bottomLeft.x, layer.details.points.bottomLeft.y)
    this.ctx.lineTo(layer.details.points.bottom.x, layer.details.points.bottom.y)
    this.ctx.lineTo(layer.details.points.bottomRight.x, layer.details.points.bottomRight.y)
    this.ctx.lineTo(layer.details.points.topRight.x, layer.details.points.topRight.y)
    this.ctx.lineTo(layer.details.points.top.x, layer.details.points.top.y)

    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.shadowBlur = 6
    this.ctx.shadowColor = this.config.highlightColor
    this.ctx.fill()

    // 阴影绘制
    this.ctx.beginPath()
    this.ctx.moveTo(layer.details.points.topLeft.x, layer.details.points.topLeft.y)
    this.ctx.lineTo(layer.details.points.bottomLeft.x, layer.details.points.bottomLeft.y)
    this.ctx.lineTo(layer.details.points.bottom.x, layer.details.points.bottom.y)
    this.ctx.lineTo(layer.details.points.bottomRight.x, layer.details.points.bottomRight.y)
    this.ctx.lineTo(layer.details.points.topRight.x, layer.details.points.topRight.y)
    this.ctx.lineTo(layer.details.points.top.x, layer.details.points.top.y)
    this.ctx.fillStyle = 'rgba(120,120,120,.15)'
    this.ctx.fill()
  }

  /**
   * @description: 鼠标按下
   * @param {*} e
   * @return {*}
   */
  // eslint-disable-next-line no-unused-vars
  doMouseDown(e) {
    if (this.config.move) {
      const x = e.pageX
      const y = e.pageY
      if (this.determineDataMouse(this.getLocation(x, y))) {
        this.onMouseDown.emit(this.determineDataMouse(this.getLocation(x, y)));
      }
    }
  }

  /**
   * @description: 鼠标弹起
   * @param {*} e
   * @return {*}
   */
  doMouseUp(e) {
    console.log("🚀 ~ file: canvas-towl.component.ts ~ line 360 ~ CanvasTowlComponent ~ doMouseUp ~ doMouseUp")
  }
  /**
   * @description: 鼠标移动
   * @param {*} e
   * @return {*}
   */
  // eslint-disable-next-line no-unused-vars
  doMouseMove(e) {
    console.log("🚀 ~ file: canvas-towl.component.ts ~ line 369 ~ CanvasTowlComponent ~ doMouseMove ~ doMouseMove")
    if (this.config.move) {
      const x = e.pageX
      const y = e.pageY
      const level = this.determineDataMouse(this.getLocation(x, y))
      this.highlightCurrentRegion(level as Level)
      if (this.config.tooltip.show) {
        this.showTooltip(level as Level, this.getLocation(x, y))
      }
    }
  }

  /**
   *  @description 判断一个点是否在多边形内部
   *  @param points 多边形坐标集合
   *  @param point 测试点坐标
   *  返回true为真，false为假
   *  Refer https://blog.csdn.net/qq_23447231/article/details/121920282
   */
  insidePolygon(points: PyramidPart, point: Point) {
    // px，py为p点的x和y坐标
    let px = point.x,
      py = point.y,
      flag = false
    const poly: Point[] = [points.topLeft, points.bottomLeft, points.bottom, points.bottomRight, points.topRight, points.top]
    //这个for循环是为了遍历多边形的每一个线段
    for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
      let sx = poly[i].x,  //线段起点x坐标
        sy = poly[i].y,  //线段起点y坐标
        tx = poly[j].x,  //线段终点x坐标
        ty = poly[j].y   //线段终点y坐标

      // 点与多边形顶点重合
      if ((sx === px && sy === py) || (tx === px && ty === py)) {
        return true
      }

      // 点的射线和多边形的一条边重合，并且点在边上
      if ((sy === ty && sy === py) && ((sx > px && tx < px) || (sx < px && tx > px))) {
        return true
      }

      // 判断线段两端点是否在射线两侧
      if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 求射线和线段的交点x坐标，交点y坐标当然是py
        let x = sx + (py - sy) * (tx - sx) / (ty - sy)

        // 点在多边形的边上
        if (x === px) {
          return true
        }

        // x大于px来保证射线是朝右的，往一个方向射，假如射线穿过多边形的边界，flag取反一下
        if (x > px) {
          flag = !flag
        }
      }
    }

    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? true : false
  }

  /**
   * @description: 获取当前鼠标坐标
   * @param x x
   * @param y x
   * @return
   */
  getLocation(x: number, y: number): Point {
    const bbox = this.canvas.getBoundingClientRect()
    return { x: (x - bbox.left) * (this.canvas.width / bbox.width), y: (y - bbox.top) * (this.canvas.height / bbox.height) }
  }

  /**
   * @description: 根据A点旋转指定角度后B点的坐标位置
   * @param {*} ptSrc 圆上某点(初始点);
   * @param {*} ptRotationCenter 圆心点
   * @param {*} angle 旋转角度°  -- [angle * M_PI / 180]:将角度换算为弧度
   * 【注意】angle 逆时针为正，顺时针为负
   * @return {Point}
   */
  rotatePoint(ptSrc: Point, ptRotationCenter: Point, angle: number): Point {
    const a = ptRotationCenter.x
    const b = ptRotationCenter.y
    const x0 = ptSrc.x
    const y0 = ptSrc.y
    const rx = a + (x0 - a) * Math.cos((angle * Math.PI) / 180) - (y0 - b) * Math.sin((angle * Math.PI) / 180)
    const ry = b + (x0 - a) * Math.sin((angle * Math.PI) / 180) + (y0 - b) * Math.cos((angle * Math.PI) / 180)
    const point = { x: rx, y: ry }
    return point
  }

  /**
   * @description: 已知三点 a, b, c，求点 a 角度
   * @return {number} 点 a 角度，非弧度
   */
  calculateAngle(a: Point, b: Point, c: Point): number {
    const ab = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    const ac = Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2))
    const bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2))
    const cosA = (Math.pow(ab, 2) + Math.pow(ac, 2) - Math.pow(bc, 2)) / (2 * ab * ac)
    const angleA = Math.round((Math.acos(cosA) * 180) / Math.PI)
    return angleA
  }

  /**
   * @description: 计算数据的点位置
   * @param {Array} val 点占比
   * @return {void}
   */
  calculatePyramidParts(val: any): void {
    const height = this.points.bottom.y -
      this.points.top.y;
    const itemHeight = height / val.length;
    const factor = 0.9; // 缩小因子

    let last: PyramidPart;
    this.detailsDataInfo = val.map((item, index) => {
      if (index === 0) {
        const vertical = {
          x: this.points.top.x,
          y: itemHeight + this.points.top.y
        }

        last = {
          topLeft: this.points.top,
          bottomLeft: this.rotatePoint({ x: vertical.x, y: vertical.y * factor }, this.points.top, this.topAngle.LTB),
          bottom: vertical,
          bottomRight: this.rotatePoint({ x: vertical.x, y: vertical.y * factor }, this.points.top, this.topAngle.RTB * -1),
          topRight: this.points.top,
          top: this.points.top
        }
        return { ...item, points: last }
      } else {
        const verticalBottom = {
          x: this.points.top.x,
          y: itemHeight + last.bottom.y + this.config.margin
        }
        const verticalTop = {
          x: last.bottom.x,
          y: last.bottom.y + this.config.margin
        }
        last = {
          topLeft: this.rotatePoint({ x: verticalTop.x, y: verticalTop.y * factor }, this.points.top, this.topAngle.LTB),
          bottomLeft: this.rotatePoint({ x: verticalBottom.x, y: verticalBottom.y * factor }, this.points.top, this.topAngle.LTB),
          bottom: verticalBottom,
          bottomRight: this.rotatePoint({ x: verticalBottom.x, y: verticalBottom.y * factor }, this.points.top, this.topAngle.RTB * -1),
          topRight: this.rotatePoint({ x: verticalTop.x, y: verticalTop.y * factor }, this.points.top, -this.topAngle.RTB),
          top: verticalTop
        }
        return { ...item, points: last }
      }
    })
  }

  /**
   * @description: 判断鼠标在哪层位置上
   * @param {*}
   * @return {*}
   */
  determineDataMouse(mouseLocation: Point): Level | boolean {
    for (let index = 0; index < this.detailsDataInfo.length; index++) {
      if (this.insidePolygon(this.detailsDataInfo[index].points, mouseLocation)) {
        return { index: index + 1, details: this.detailsDataInfo[index] }
      }
    }
    return false
  }
}

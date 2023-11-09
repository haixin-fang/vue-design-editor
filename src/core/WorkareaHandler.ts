import { fabric } from "fabric";
import Handler from "./handler";
import { WorkareaOption, FabricRect } from "@/types/utils";

class EditorWorkspace {
  canvas: fabric.Canvas;
  workspaceEl: HTMLElement;
  workspace: FabricRect | null;
  option: WorkareaOption;
  handler: Handler;
  unitEnum: any;
  constructor(handler: Handler) {
    this.handler = handler;
    this.canvas = handler.canvas;
    const container = handler.container;
    if (!container) {
      throw new Error("element #workspace is missing, plz check!");
    }
    this.workspaceEl = container;
    this.workspace = null;
    this.option = handler.workareaOption;
    this.initialize();
    // 像素转换, 1cm等于37.9像素等
    this.unitEnum = {
      cm: 37.9,
      mm: 3.78,
      px: 1,
    };
  }

  initialize() {
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
  }

  // 初始化背景
  _initBackground() {
    this.canvas.backgroundImage = "";
    this.canvas
      .setWidth(this.workspaceEl.offsetWidth)
      .setHeight(this.workspaceEl.offsetHeight);
  }

  // 初始化画布
  _initWorkspace() {
    const workspace = new fabric.Rect(this.option);
    this.canvas.add(workspace);
    this.canvas.renderAll();
    this.workspace = workspace;
    this.auto();
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    )
      return;
    const ruleWidth = 10; // 标尺宽度
    // viewportTransform[0] x轴缩放
    viewportTransform[4] =
      canvas.width / 2 - objCenter.x * viewportTransform[0] + ruleWidth;
    viewportTransform[5] =
      canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  // 初始化监听器
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(() => {
      this.auto();
    });
    resizeObserver.observe(this.workspaceEl);
  }

  setSize(width: number, height: number) {
    this._initBackground();
    const unit = this.workspace?.unit || "px";
    this.option.width = width * this.unitEnum[unit];
    this.option.height = height * this.unitEnum[unit];
    // 重新设置workspace
    this.workspace = this.handler.utils.findById("workarea") as fabric.Rect;
    this.workspace.set("width", this.option.width);
    this.workspace.set("height", this.option.height);
    this.auto();
  }

  getBili() {
    return this.option.width / this.option.height;
  }

  setWidth(width: number) {
    this._initBackground();
    const unit = this.workspace?.unit || "px";
    this.option.width = width * this.unitEnum[unit];
    // 重新设置workspace
    this.workspace = this.handler.utils.findById("workarea") as fabric.Rect;
    this.workspace.set("width", width);
    this.auto();
  }

  setHeight(height: number) {
    this._initBackground();
    const unit = this.workspace?.unit || "px";
    this.option.height = height * this.unitEnum[unit];
    // 重新设置workspace
    this.workspace = this.handler.utils.findById("workarea") as fabric.Rect;
    this.workspace.set("height", height);
    this.auto();
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { workspaceEl } = this;
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    // this.canvas.centerObject(this.workspace);

    // 超出画布不展示
    this.workspace.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  }

  unpdateUnit(unit: string) {
    this.workspace?.set("unit", unit);
  }

  async setBgImage(options: WorkareaOption) {
    const { src } = options || {};

    const editable = false;
    const option = {
      editable,
      hasControls: editable, // 当设置为 `false` 时，对象的控件不显示并且不能用于操作对象
      hasBorders: editable, // 当设置为 `false` 时，对象的控制边界不会被渲染
      selectable: editable, // 当设置为 `false` 时，不能选择对象进行修改（使用基于点单击或基于组的选择）。但事件仍然发生在它身上。
      lockMovementX: !editable, // 当`true`时，对象水平移动被锁定
      lockMovementY: !editable, //当`true`时，对象垂直移动被锁定
      name: "背景图片",
      type: "background",
      src,
    };
    // 去重, 防止出现多个背景元素
    const bgObject = this.handler.canvas.getObjects().find((item: any) => {
      if (item.id == "background") {
        return item;
      }
    });
    if (bgObject && bgObject.src !== src) {
      this.handler.canvas.remove(bgObject);
    }
    const { width, height } = this.workspace as any;
    let scale = 1;
    if (width > options.width || height > options.height) {
      if (width / options.width > height / options.height) {
        scale = width / options.width;
      } else {
        scale = height / options.height;
      }
    }
    // 居中
    const bgHeight = options.height * scale;
    const bgWidth = options.width * scale;
    const bgLeft = width / 2 - bgWidth / 2;
    const bgTop = height / 2 - bgHeight / 2;
    const optionss = Object.assign({}, option, {
      name: "背景图片",
      type: "background",
      id: "background",
      src,
      left: bgLeft,
      top: bgTop,
      scaleX: scale,
      scaleY: scale,
      originX: "left",
      originY: "top",
      // lockMovementX: true,
      // lockMovementY: true
    });
    const newbgObject = await this.handler.add(optionss);
    this.setCenterFromObject(newbgObject);
  }

  _getScale() {
    const viewPortWidth = this.workspaceEl.offsetWidth;
    const viewPortHeight = this.workspaceEl.offsetHeight;
    // 按照宽度
    if (
      viewPortWidth / viewPortHeight <
      this.option.width / this.option.height
    ) {
      return viewPortWidth / this.option.width;
    } // 按照宽度缩放
    return viewPortHeight / this.option.height;
  }

  // 放大
  big() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    // const center = this.canvas.getCenter();
    // this.canvas.zoomToPoint(
    //   new fabric.Point(center.left, center.top),
    //   zoomRatio > 5 ? 5 : zoomRatio
    // );
    this.setZoomAuto(zoomRatio > 5 ? 5 : zoomRatio);
  }

  // 缩小
  small() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    // const center = this.canvas.getCenter();
    // this.canvas.zoomToPoint(
    //   new fabric.Point(center.left, center.top),
    //   zoomRatio < 0 ? 0.01 : zoomRatio
    // );
    this.setZoomAuto(zoomRatio < 0 ? 0.01 : zoomRatio);
  }

  // 自动缩放
  auto() {
    const scale = this._getScale();
    this.setZoomAuto(scale - 0.08 < 0.01 ? 0.01 : scale - 0.08);
  }

  // 1:1 放大
  one() {
    this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  }

  // 获取画布自适应下的比例
  getAutoScale() {
    return this._getScale();
  }
}

export default EditorWorkspace;

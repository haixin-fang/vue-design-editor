import { fabric } from "fabric";
import Handler from "./handler";
import { WorkareaObject } from "@/types/utils";
class WorkareaHandler {
  handler: Handler;
  constructor(handler: Handler) {
    this.handler = handler;
    this.initialize();
  }

  initialize = () => {
    const { workareaOption } = this.handler;
    const image = new Image(workareaOption.width, workareaOption.height);
    image.crossOrigin = "Anonymous";
    image.width = workareaOption.width;
    image.height = workareaOption.height;
    this.handler.workarea = new fabric.Image(
      image,
      workareaOption
    ) as WorkareaObject;
    this.handler.canvas.add(this.handler.workarea);
    this.initLayout(this.handler.workarea);
    this.handler.canvas.renderAll();
  };

  initLayout = (workarea: WorkareaObject) => {
    const { canvas, container } = this.handler;
    const { width, height } = canvas;
    const { width: workareaWidth, height: workareaHeight } = workarea as any;
    // 画布预留些空白 顶部24 左右40 底部120
    if (width > workareaWidth + 80 && height > workareaHeight + 144) {
      this.handler.canvas.centerObject(workarea);
    } else if (width <= workareaWidth + 80 && height > workareaHeight + 144) {
      this.handler.canvas.centerObjectV(workarea);
      this.handler.canvas.setWidth(workareaWidth + 80);
    } else if (width > workareaWidth + 80 && height < workareaHeight + 144) {
      this.handler.canvas.centerObjectH(workarea);
      workarea.set({
        top: 24,
      });
      this.handler.canvas.setHeight(workareaHeight + 144);
    } else if (height < workareaHeight + 144 && width <= workareaWidth + 80) {
      this.handler.canvas.setHeight(workareaHeight + 144);
      this.handler.canvas.setWidth(workareaWidth + 80);
      workarea.set({
        top: 24,
        left: 40,
      });
    }
    if (container && container.parentElement) {
      container.parentElement.style.width = canvas.width + "px";
      container.parentElement.style.height = canvas.height + "px";
    }
  };
}

export default WorkareaHandler;

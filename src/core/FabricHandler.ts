import { fabric } from "fabric";
import Handler from "./handler";
import { WorkareaOption, WorkareaObject, FabricImage } from "@/types/utils";

class FabricHandler {
  private handler: Handler;
  constructor(handler: Handler) {
    this.handler = handler;
  }

  textbox({ text, ...option }: any) {
    option.fontSize = parseInt(option.fontSize);
    delete option.type;
    return new fabric.Textbox(text, option);
  }

  FontCustom(option: WorkareaObject) {
    return this.textbox(option);
  }

  gradient(selectedItem: WorkareaObject, options: any) {
    if (!selectedItem) {
      selectedItem = this.handler.canvas.getActiveObject();
    }
    let gradient;
    if (options.type == "radial-gradient") {
      const { width, height } = selectedItem;
      const r = width > height ? width / 2 : height / 2;
      const coords = {
        r1: r, // 该属性仅径向渐变可用，外圆半径
        r2: 0, // 该属性仅径向渐变可用，外圆半径
        x1: width / 2, // 焦点的x坐标
        y1: height / 2, // 焦点的y坐标
        x2: width / 2, // 中心点的x坐标
        y2: height / 2, // 中心点的y坐标
      };
      const colorStops = options.colorStops.map((item: any) => {
        const offset = Number(item.length.value) / 100;
        const [red, green, blue, alpha] = item.value;
        const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        return { offset, color };
      });
      gradient = new fabric.Gradient({
        type: "radial",
        coords,
        colorStops,
      });
    } else {
      // 渐变
      const {
        x0: x1,
        y0: y1,
        x1: x2,
        y1: y2,
      } = this.handler.utils.calculateGradientCoordinate(
        selectedItem.width,
        selectedItem.height,
        Number(options.orientation.value)
      );
      const colorStops = options.colorStops.map((item: any) => {
        const offset = Number(item.length.value) / 100;
        const [red, green, blue, alpha] = item.value;
        const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        return { offset, color };
      });
      gradient = new fabric.Gradient({
        type: "linear", // linear or radial
        gradientUnits: "pixels", // pixels or pencentage 像素 或者 百分比
        coords: { x1, y1, x2, y2 }, // 至少2个坐标对(x1，y1和x2，y2)将定义渐变在对象上的扩展方式
        colorStops: colorStops,
      });
    }

    selectedItem.set({ fill: gradient });
  }

  async Image(options: WorkareaObject) {
    const type =
      this.handler.utils.getFileType(options.src) ||
      this.handler.utils.getBase64ImageType(options.src);
    if (type == "svg") {
      options.type = "svg";
      return this.addSvg(options);
    } else if (type && ["jpg", "png", "jpeg"].includes(type)) {
      return this.addImage(options);
    }
  }

  addSvg(obj: WorkareaOption) {
    return new Promise((resolve) => {
      const { src, path, ...otherOption } = obj;
      const { width } = this.handler.workareaHandler.option;
      if (!src) {
        const res = new fabric.Path(path);
        resolve(res);
      } else if (src) {
        fabric.loadSVGFromURL(src, (objects, options) => {
          const activeObject: any = fabric.util.groupSVGElements(
            objects,
            options
          );
          if (activeObject.width > width) {
            const scale = width / activeObject.width;
            activeObject.set({
              scaleX: scale,
              scaleY: scale,
            });
          }
          activeObject.set({
            crossOrigin: "Anonymous",
            src,
            ...otherOption,
          });
          resolve(activeObject);
        });
      }
    });
  }

  async addImage(obj: FabricImage) {
    const { src, ...otherOption } = obj;
    const { objectOption } = this.handler;
    const imageUrl = new Image();
    imageUrl.crossOrigin = "Anonymous"; //这里是主要添加的属性
    // 只有在单个图片素材导入情况下才自适应
    const { width } = this.handler.workareaHandler.workspace as any;
    if (
      otherOption.width &&
      this.handler.workareaHandler &&
      this.handler.workareaHandler.workspace &&
      otherOption.width > width
    ) {
      const scale = width / otherOption.width;
      otherOption.scaleX = scale;
      otherOption.scaleY = scale;
    }
    const canvasImage = new fabric.Image(imageUrl, {
      clipPath: null,
      ...JSON.parse(JSON.stringify(objectOption)),
      ...otherOption,
    });
    canvasImage.crossOrigin = "Anonymous"; //这里是主要添加的属性
    await this.handler.setImage(canvasImage, src);
    return canvasImage;
  }

  async background(options: WorkareaObject) {
    return this.addImage(options);
  }
}

export default FabricHandler;

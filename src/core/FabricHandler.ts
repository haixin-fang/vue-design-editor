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
    const { objectOption, workareaHandler } = this.handler;
    const imageUrl = new Image();
    imageUrl.crossOrigin = "Anonymous"; //这里是主要添加的属性
    if (
      otherOption.width &&
      workareaHandler &&
      workareaHandler.workspace &&
      otherOption.width > workareaHandler.workspace?.width
    ) {
      const scale = workareaHandler.workspace.width / otherOption.width;
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
}

export default FabricHandler;

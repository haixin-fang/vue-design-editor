import WorkareaHandler from "./WorkareaHandler";
import FabricHandler from "./FabricHandler";
import UitlsHandler from "./UtilsHandler";
import ImageHandler from "./ImageHandler";
import { WorkareaOption, WorkareaObject, FabricImage } from "@/types/utils";

import _ from "@/utils/_";
export interface HandlerOption {
  /**
   * 工作区默认配置
   */
  workareaOption: WorkareaOption;
  /**
   * fabric实例
   */
  canvas?: any;
  /*
   * 画布顶部dom
   */
  container?: HTMLDivElement;
  utils?: UitlsHandler;
  /**
   * 工作区对象
   */
  [key: string]: any;
}

export type HandlerOptions = HandlerOption;

interface FabricOptions {
  [key: string]: any;
}

class Handler implements HandlerOptions {
  public workareaOption: WorkareaOption;
  public workareaHandler: WorkareaHandler;
  public fabricObjects: FabricHandler & FabricOptions;
  public utils: UitlsHandler;
  public imageHandler: ImageHandler;
  public canvas: any;
  public container?: HTMLDivElement;
  public workarea?: WorkareaObject;
  public objectOption?: any;
  public editable?: boolean;
  constructor(options: HandlerOptions) {
    this.workareaOption = options.workareaOption;
    this.canvas = options.canvas;
    this.container = options.container;
    this.editable = options.editable;
    this.initialize(options);

    this.workareaHandler = new WorkareaHandler(this);
    this.fabricObjects = new FabricHandler(this);
    this.utils = new UitlsHandler(this);
    this.imageHandler = new ImageHandler(this);
  }

  initialize(options: HandlerOptions) {
    this.initOption(options);
  }

  initOption = (options: HandlerOptions) => {
    // 默认配置
    this.setObjectOption(options.objectOption);
  };

  setObjectOption = (objectOption: any) => {
    this.objectOption = Object.assign({}, this.objectOption, objectOption);
  };

  setImage = (obj: FabricImage, source: any) => {
    return new Promise((resolve) => {
      if (!this.canvas.contextTop) return;
      if (source instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          obj.set("file", source);
          obj.set("src", null);

          obj.setSrc(
            reader.result,
            () => {
              if (!this.canvas.contextTop) return;
              this.canvas.renderAll();
              resolve(obj);
            },
            {
              dirty: true,
            }
          );
        };
        reader.readAsDataURL(source);
      } else {
        obj.set("file", null);
        obj.set("src", source);
        obj.setSrc(
          source,
          () => {
            if (!this.canvas.contextTop) return;
            this.canvas.renderAll();
            resolve(obj);
          },
          {
            dirty: true,
            crossOrigin: "Anonymous",
          }
        );
      }
    });
  };

  add = async (obj: any) => {
    const { editable } = this;
    const option = {
      editable: editable,
      hasControls: editable, // 当设置为 `false` 时，对象的控件不显示并且不能用于操作对象
      hasBorders: editable, // 当设置为 `false` 时，对象的控制边界不会被渲染
      selectable: editable, // 当设置为 `false` 时，不能选择对象进行修改（使用基于点单击或基于组的选择）。但事件仍然发生在它身上。
      lockMovementX: !editable, // 当`true`时，对象水平移动被锁定
      lockMovementY: !editable, //当`true`时，对象垂直移动被锁定
    };
    const newOption = Object.assign(
      {},
      JSON.parse(JSON.stringify(this.objectOption)),
      obj,
      option,
      {
        container: this.container,
      }
    );
    let createdObj;
    if (obj.type == "material") {
      obj.type = "Image";
    }
    try {
      createdObj = this.fabricObjects[obj.type](newOption);
    } catch (e) {
      console.error(e);
      return;
    }

    if (_.isPromise(createdObj)) {
      const res = await createdObj;
      createdObj = this.addContent(res);
      // createdObj.then((res) => {
      //     this.addContent(res, obj);
      // });
    } else if (createdObj) {
      createdObj = this.addContent(createdObj);
    }
    return createdObj;
  };

  addContent(createdObj: any) {
    if (createdObj) {
      if (!createdObj.id) {
        createdObj.id = this.utils.uuid();
      }
      this.canvas.add(createdObj);
    }
    this.canvas.renderAll();
    return createdObj;
  }
}

export default Handler;

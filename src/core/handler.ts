import WorkareaHandler from "./WorkareaHandler";
import FabricHandler from "./FabricHandler";
import UitlsHandler from "./UtilsHandler";
import ImageHandler from "./ImageHandler";
import ControlHandler from "./ControlHandler";
import { WorkareaOption, WorkareaObject, FabricImage } from "@/types/utils";
import { objectOption } from "../constants/workspace";

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
  onAdd: (target: WorkareaObject) => void;
  onSelect: (target: any) => void;
  init?: () => void;
  /**
   * 画布是否可编辑
   */
  editable?: boolean;
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
  public workareaOption;
  public workareaHandler: WorkareaHandler;
  public fabricObjects: FabricHandler & FabricOptions;
  public utils: UitlsHandler;
  public imageHandler: ImageHandler;
  public objectOption?: any = objectOption;
  private control: ControlHandler;
  public canvas;
  public onAdd;
  public onSelect;
  public init;
  public editable;
  public container;
  constructor(options: HandlerOptions) {
    this.workareaOption = options.workareaOption;
    this.canvas = options.canvas;
    this.container = options.container;
    this.editable = options.editable;

    this.onAdd = options.onAdd;
    this.init = options.init;
    this.onSelect = options.onSelect;

    this.workareaHandler = new WorkareaHandler(this);
    this.fabricObjects = new FabricHandler(this);
    this.utils = new UitlsHandler(this);
    this.imageHandler = new ImageHandler(this);
    this.control = new ControlHandler();

    this.initialize(options);
  }

  async initialize(options: HandlerOptions) {
    const { init } = this;
    this.initOption(options);

    init && init();
  }

  initOption = (options: HandlerOptions) => {
    // 默认配置
    this.setObjectOption(options.objectOption);
  };

  setObjectOption = (objectOption: any) => {
    this.objectOption = Object.assign({}, this.objectOption, objectOption);
  };

  select = (obj: WorkareaObject, find = false) => {
    let findObject: WorkareaObject | null = obj;
    if (find) {
      findObject = this.utils.find(obj);
    }
    if (findObject) {
      this.canvas.discardActiveObject();
      this.canvas.setActiveObject(findObject);
      this.canvas.requestRenderAll();
      this.onSelect(findObject);
    }
  };

  cancelSelect = (obj?: WorkareaObject, canvas = this.canvas) => {
    const target = obj || canvas.getActiveObject();
    if (target) {
      canvas.discardActiveObject();
      canvas.renderAll();
      this.onSelect(null);
    }
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

  // 置顶
  bringToFront(createdObj: WorkareaObject) {
    const target = createdObj || this.canvas.getActiveObject();
    if (target) {
      this.canvas.bringToFront(target);
    }
  }
  // 上移一层
  bringForward(createdObj: WorkareaObject) {
    const target = createdObj || this.canvas.getActiveObject();
    if (target) {
      this.canvas.bringForward(target);
    }
  }

  // 置底
  sendToBack(createdObj: WorkareaObject | any) {
    const target = createdObj || this.canvas.getActiveObject();
    if (target) {
      // 如果有背景元素则元素再前一层
      let isbg = false;
      this.canvas.getObjects().find((item: WorkareaObject) => {
        if (item.type == "background") {
          isbg = true;
          return item;
        }
      });
      this.canvas.sendToBack(target);
      this.canvas.sendToBack(this.canvas.getObjects()[1]);
      console.log(this.canvas.getObjects());

      if (isbg && target.type != "background") {
        this.bringForward(target);
      }
    }
  }
  // 下移一层
  sendBackwards(item: WorkareaObject) {
    const target = item || this.canvas.getActiveObject();
    if (target) {
      // 兼容画布,使画布始终在底部
      const firstObject = this.canvas.getObjects()[1];
      if (firstObject.id === target.id) {
        return;
      }
      this.canvas.sendBackwards(target);
    }
  }

  set = async (selectedItem: WorkareaObject, changedValues: any) => {
    const activeObject = selectedItem || this.canvas.getActiveObject();
    const changedKey = Object.keys(changedValues)[0];
    const changedValue = changedValues[changedKey];
    activeObject.set(changedKey, changedValue);
    activeObject.setCoords();
    this.canvas.renderAll();
    this.onSelect(activeObject);
  };

  remove = (selectedItem: any) => {
    const target = selectedItem || this.canvas.getActiveObject();
    this.canvas.remove(target);
    this.canvas.requestRenderAll();
    if (target.dispose) {
      target.dispose();
    }
    this.onSelect(null);
  };

  /**
   *
   * @param obj 元素配置
   * @param isAdd 是否添加到画布中
   * @returns
   */
  add = async (obj: any, isAdd = true) => {
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
      option,
      JSON.parse(JSON.stringify(this.objectOption)),
      obj,
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
      createdObj = this.addContent(res, isAdd);
      // createdObj.then((res) => {
      //     this.addContent(res, obj);
      // });
    } else if (createdObj) {
      createdObj = this.addContent(createdObj, isAdd);
    }
    return createdObj;
  };

  addContent(createdObj: any, isAdd: boolean) {
    const { onAdd } = this;
    if (createdObj) {
      if (!createdObj.id) {
        createdObj.id = this.utils.uuid();
      }
      if (isAdd) {
        this.canvas.add(createdObj);
      }
      if (onAdd) {
        onAdd(createdObj);
      }
    }
    this.canvas.renderAll();
    return createdObj;
  }
}

export default Handler;

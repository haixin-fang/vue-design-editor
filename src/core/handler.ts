import WorkareaHandler from "./WorkareaHandler";
import { WorkareaOption, WorkareaObject } from "@/types/utils";

export interface HandlerOption {
  /**
   * 工作区默认配置
   */
  workareaOption?: WorkareaOption;
  /**
   * fabric实例
   */
  canvas?: any;
  /*
   * 画布顶部dom
   */
  container?: HTMLDivElement;
  /**
   * 工作区对象
   */
  [key: string]: any;
}

export type HandlerOptions = HandlerOption;

class Handler implements HandlerOptions {
  public workareaOption: any;
  public workareaHandler?: WorkareaHandler;
  public canvas: any;
  public container?: HTMLDivElement;
  public workarea?: WorkareaObject;
  constructor(options: HandlerOptions) {
    this.initialize(options);
  }

  initialize(options: HandlerOptions) {
    this.initOption(options);
    this.initHandler();
  }

  initHandler = () => {
    this.workareaHandler = new WorkareaHandler(this);
  };

  initOption = (options: HandlerOptions) => {
    this.workareaOption = options.workareaOption;
    this.canvas = options.canvas;
    this.container = options.container;
  };
}

export default Handler;

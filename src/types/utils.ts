import { fabric } from "fabric";

export interface WorkareaOption {
  /**
   * 链接
   * @type {string}
   */
  src?: string;
  /**
   * 图片File或blob
   * @type {File}
   */
  file?: File;
  /**
   * 工作区默认宽度
   * @type {number}
   */
  width?: number;
  /**
   * 工作区默认高度
   * @type {number}
   */
  height?: number;
  /**
   * 工作区背景图
   * @type {string}
   */
  backgroundColor?: string;
}

export type WorkareaObject = FabricImage & WorkareaOption;

export type FabricImage = fabric.Image;

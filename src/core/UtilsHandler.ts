import Handler from "./handler";
import { v4 as uuidv4 } from "uuid";
import { WorkareaObject } from "@/types/utils";
class UtilsHandler {
  private handler: Handler;
  constructor(handler: Handler) {
    this.handler = handler;
  }
  getFileType(src: string) {
    if (!src || src.indexOf("base64") != -1) return;
    src = src.split("?")[0];
    if (src) {
      const number = src.lastIndexOf(".");
      const typeStr = src.substring(number + 1);
      return typeStr;
    }
    return "";
  }

  // 根据base64获取图片类型
  getBase64ImageType(src: string) {
    if (!src) return;
    const reg = /data:image\/([a-zA-Z]*);/;
    const res = src.match(reg);
    if (res && res[1]) {
      return res[1];
    } else {
      return "png";
    }
  }

  uuid() {
    return uuidv4();
  }

  find = (obj: WorkareaObject): WorkareaObject | null => this.findById(obj.id);

  findById = (id: string): WorkareaObject | null => {
    let findObject = null;
    const exist = this.handler.canvas
      .getObjects()
      .some((obj: WorkareaObject) => {
        if (obj.id === id) {
          findObject = obj;
          return true;
        }
        return false;
      });
    if (!exist) {
      return null;
    }
    return findObject;
  };

  dataURItoBlob(dataURI) {
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString,
    });
  }

  fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e: any) {
        // e.target.result 即为base64结果
        resolve(e.target.result);
      };
    });
  };

  fileUpload = async (file: File, name: string, type: string) => {
    const src = await this.handler.utils.fileToBase64(file);
    if (src) {
      const image = new Image();
      image.src = src;
      const options: any = {
        name,
        type,
        src,
      };
      await new Promise((resolve) => {
        image.onload = () => {
          options.width = image.width;
          options.height = image.height;
          resolve(true);
        };
      });
      let marterialObject;
      if (type == "background") {
        marterialObject = this.handler.workareaHandler.setBgImage(options);
      } else {
        marterialObject = this.handler.add(options);
      }
      return marterialObject;
    }
  };

  async download(base64: string, filename: string) {
    const blob = await this.dataURItoBlob(base64);
    const a = document.createElement("a");
    // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
    const URL = window.URL || window.webkitURL;
    // 根据解析后的blob对象创建URL 对象
    const herf = URL.createObjectURL(blob);
    // 下载链接
    a.href = herf;
    // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
    a.download = filename || "vue-design-editor";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // 在内存中移除URL 对象
    window.URL.revokeObjectURL(herf);
  }

  calculateGradientCoordinate(width: number, height: number, angle = 180) {
    if (angle >= 360) angle = angle - 360;
    if (angle < 0) angle = angle + 360;
    angle = Math.round(angle);

    // 当渐变轴垂直于矩形水平边上的两种结果
    if (angle === 0) {
      return {
        x0: Math.round(width / 2),
        y0: height,
        x1: Math.round(width / 2),
        y1: 0,
      };
    }
    if (angle === 180) {
      return {
        x0: Math.round(width / 2),
        y0: 0,
        x1: Math.round(width / 2),
        y1: height,
      };
    }

    // 当渐变轴垂直于矩形垂直边上的两种结果
    if (angle === 90) {
      return {
        x0: 0,
        y0: Math.round(height / 2),
        x1: width,
        y1: Math.round(height / 2),
      };
    }
    if (angle === 270) {
      return {
        x0: width,
        y0: Math.round(height / 2),
        x1: 0,
        y1: Math.round(height / 2),
      };
    }

    // 从矩形左下角至右上角的对角线的角度
    const alpha = Math.round(
      (Math.asin(width / Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))) *
        180) /
        Math.PI
    );

    // 当渐变轴分别于矩形的两条对角线重合情况下的四种结果
    if (angle === alpha) {
      return {
        x0: 0,
        y0: height,
        x1: width,
        y1: 0,
      };
    }
    if (angle === 180 - alpha) {
      return {
        x0: 0,
        y0: 0,
        x1: width,
        y1: height,
      };
    }
    if (angle === 180 + alpha) {
      return {
        x0: width,
        y0: 0,
        x1: 0,
        y1: height,
      };
    }
    if (angle === 360 - alpha) {
      return {
        x0: width,
        y0: height,
        x1: 0,
        y1: 0,
      };
    }

    // 以矩形的中点为坐标原点，向上为Y轴正方向，向右为X轴正方向建立直角坐标系
    let x0 = 0,
      y0 = 0,
      x1 = 0,
      y1 = 0;

    // 当渐变轴与矩形的交点落在水平线上
    if (
      angle < alpha || // 处于第一象限
      (angle > 180 - alpha && angle < 180) || // 处于第二象限
      (angle > 180 && angle < 180 + alpha) || // 处于第三象限
      angle > 360 - alpha // 处于第四象限
    ) {
      // 将角度乘以（PI/180）即可转换为弧度
      const radian = (angle * Math.PI) / 180;
      // 当在第一或第四象限，y是height / 2，否则y是-height / 2
      const y = angle < alpha || angle > 360 - alpha ? height / 2 : -height / 2;
      const x = Math.tan(radian) * y;
      // 当在第一或第二象限，l是width / 2 - x，否则l是-width / 2 - x
      const l =
        angle < alpha || (angle > 180 - alpha && angle < 180)
          ? width / 2 - x
          : -width / 2 - x;
      const n = Math.pow(Math.sin(radian), 2) * l;
      x1 = x + n;
      y1 = y + n / Math.tan(radian);
      x0 = -x1;
      y0 = -y1;
    }

    // 当渐变轴与矩形的交点落在垂直线上
    if (
      (angle > alpha && angle < 90) || // 处于第一象限
      (angle > 90 && angle < 180 - alpha) || // 处于第二象限
      (angle > 180 + alpha && angle < 270) || // 处于第三象限
      (angle > 270 && angle < 360 - alpha) // 处于第四象限
    ) {
      // 将角度乘以（PI/180）即可转换为弧度
      const radian = ((90 - angle) * Math.PI) / 180;
      // 当在第一或第二象限，x是width / 2，否则x是-width / 2
      const x =
        (angle > alpha && angle < 90) || (angle > 90 && angle < 180 - alpha)
          ? width / 2
          : -width / 2;
      const y = Math.tan(radian) * x;
      // 当在第一或第四象限，l是height / 2 - y，否则l是-height / 2 - y
      const l =
        (angle > alpha && angle < 90) || (angle > 270 && angle < 360 - alpha)
          ? height / 2 - y
          : -height / 2 - y;
      const n = Math.pow(Math.sin(radian), 2) * l;
      x1 = x + n / Math.tan(radian);
      y1 = y + n;
      x0 = -x1;
      y0 = -y1;
    }

    // 坐标系更改为canvas标准，Y轴向下为正方向
    x0 = Math.round(x0 + width / 2);
    y0 = Math.round(height / 2 - y0);
    x1 = Math.round(x1 + width / 2);
    y1 = Math.round(height / 2 - y1);

    return { x0, y0, x1, y1 };
  }
}

export default UtilsHandler;

import PSD from "psd.js";
import Buffer from "buffer";
import { v4 as uuid } from "uuid";
if (typeof window.Buffer === "undefined") {
  window.Buffer = Buffer.Buffer;
}
class Psd {
  constructor(uploadUrl, uploadCallback) {
    // 存储模板json
    this.json = [];
    this.uploadUrl = uploadUrl;
    this.uploadCallback = uploadCallback;
  }

  async init(file) {
    return new Promise((jsonResolve) => {
      let fileName =
        file.name.substring(0, file.name.lastIndexOf(".")) + ".png";
      // psd文件
      var url = URL.createObjectURL(file);
      // 解析psd文件
      PSD.fromURL(url)
        .then(async (psd) => {
          const { backgroundImage, width, height } = await this.getPsdBgImage(
            psd
          );
          // 获取图层数据
          const childrens = psd.tree().children();
          // console.log("图层数据", childrens)
          let result = [];
          const outProArr = this.getPsdJson(childrens, null, result);
          Promise.all(outProArr)
            .then(() => {
              // 结构转化
              let newPsdObjArr = [];
              // 目的是符合fabric层级
              result = this.resReverse(result);
              // 工作区结构
              let workareaObj = {}; //JSON.parse(JSON.stringify(psdJson.workarea));
              workareaObj.width = width;
              workareaObj.height = height;
              workareaObj.id = "workarea";
              workareaObj.name = fileName;
              newPsdObjArr.push(workareaObj);
              result.forEach((obj) => {
                newPsdObjArr.push(obj);
              });
              return newPsdObjArr;
            })
            .then((arr) => {
              console.log(JSON.parse(JSON.stringify(arr)));
              // 转成json
              jsonResolve({
                json: arr,
                slImage: backgroundImage,
              });
            });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  // newTextObj.lineHeight = Math.round(fontSize * transY * 100) * 0.01; // 64 ✔
  getRotation(transform) {
    let rotation = Math.round(
      Math.atan(transform.xy / transform.xx) * (180 / Math.PI)
    );

    if (transform.xx < 0) {
      rotation += 180;
    } else if (rotation < 0) {
      rotation += 360;
    }

    return rotation;
  }

  getPsdJson(childrenList, resolve, list) {
    let outProArr = [];
    Array.from(childrenList).forEach((e, i) => {
      let outPro = new Promise((res) => {
        // 顶级图层/文件夹
        if (e.type == "group") {
          var i_child = e.children(); // 子图层
          let newGroupObj = {}; //JSON.parse(JSON.stringify(psdJson.group));
          newGroupObj.type = "group";
          newGroupObj.left = e.left;
          newGroupObj.top = e.top;
          newGroupObj.width = e.width;
          newGroupObj.height = e.height;
          newGroupObj.opacity = e.export().opacity;
          newGroupObj.visible = e.export().visible;
          newGroupObj.id = uuid();
          newGroupObj.name = e.name;
          newGroupObj.objects = [];
          e = newGroupObj;
          list[i] = e;
          return this.getPsdJson(i_child, res, e.objects);
        } else {
          let itemObj = {};
          itemObj = e;
          this.getChildData(childrenList[i])
            .then((a) => {
              if (a) {
                itemObj.type = a.type;
                if (a.type == "text") {
                  itemObj["tracking"] = a.data;
                  let newTextObj = {}; // JSON.parse(JSON.stringify(psdJson.FontCustom));
                  let exportObj = itemObj.export();
                  newTextObj.type = "FontCustom";
                  newTextObj.left = itemObj.left;
                  newTextObj.top = itemObj.top;
                  newTextObj.width = itemObj.width;
                  newTextObj.height = itemObj.height;
                  let color = exportObj.text.font.colors[0];
                  newTextObj.fill = `rgb(${color[0]},${color[1]},${color[2]})`;
                  //todo opacity !=1 赋值  visible=false 赋值  fontFamily 看下默认字体，非默认字体赋值 fontWeight 非normal赋值 fontStyle 非normal赋值
                  if (exportObj.opacity != 1) {
                    newTextObj.opacity = exportObj.opacity;
                  }
                  if (!exportObj.visible) {
                    newTextObj.visible = exportObj.visible;
                  }
                  if (exportObj.text.font.weights[0] != "normal") {
                    newTextObj.fontWeight = exportObj.text.font.weights[0];
                  }
                  newTextObj.fontSize = exportObj.text.font.sizes[0];
                  if (exportObj.text.font.styles[0] != "normal") {
                    newTextObj.fontStyle = exportObj.text.font.styles[0];
                  }
                  newTextObj.fontFamily = exportObj.text.font.names[0];
                  newTextObj.text = exportObj.text.value;
                  // newTextObj.underline
                  // newTextObj.overline
                  // newTextObj.linethrough

                  //todo：exportObj.text.font.alignment[0] 不是left才赋值
                  //charSpacing ！=0 赋值 angle！=0赋值
                  if (exportObj.text.font.alignment[0] != "left") {
                    newTextObj.textAlign = exportObj.text.font.alignment[0];
                  }
                  if (itemObj.tracking != 0) {
                    newTextObj.charSpacing = itemObj.tracking;
                  }
                  // newTextObj.id = uuid();
                  newTextObj.name = itemObj.name;
                  let angleR = this.getRotation(exportObj.text.transform);
                  if (angleR != 0) {
                    newTextObj.angle = angleR; //getRotation(exportObj.text.transform);
                  }
                  if (newTextObj.fontStyle == "italic") {
                    newTextObj.width += newTextObj.fontSize;
                  }
                  // 解决空格换行问题
                  if (newTextObj.text.indexOf(" ") != -1) {
                    let reg = /(^\s*)|(\s*$)/g;
                    const spaceList = newTextObj.text.match(reg) || [];
                    let len = 0;
                    spaceList.forEach((item) => {
                      len += item.length || 1;
                    });
                    newTextObj.width += newTextObj.fontSize * len;
                    newTextObj.width = parseInt(newTextObj.width);
                  }
                  let transY = exportObj.text.transform.yy;
                  let fontSize = newTextObj.fontSize;
                  newTextObj.fontSize =
                    Math.round(fontSize * transY * 100) * 0.01; // 32 ✔

                  itemObj = newTextObj;
                } else if (a.type == "image") {
                  if (e.isMask) {
                    res();
                    return;
                  }
                  itemObj["image"] = a.data;
                  let newImageObj = {}; //JSON.parse(JSON.stringify(psdJson.Image));
                  newImageObj.type = "Image";
                  newImageObj.left = itemObj.left;
                  newImageObj.top = itemObj.top;
                  newImageObj.width = itemObj.width;
                  newImageObj.height = itemObj.height;
                  if (itemObj.maskSvg) {
                    newImageObj.maskSvg = itemObj.maskSvg;
                    newImageObj.maskType = "custom";
                    newImageObj.poi = itemObj.poi;
                  }
                  if (itemObj.export().opacity != 1) {
                    newImageObj.opacity = itemObj.export().opacity;
                  }
                  if (!itemObj.export().visible) {
                    newImageObj.visible = itemObj.export().visible;
                  }
                  // newImageObj.id = uuid();
                  newImageObj.name = itemObj.name;
                  newImageObj.src = itemObj.image;
                  itemObj = newImageObj;
                }
                if (list && Array.isArray(list)) {
                  list[i] = itemObj;
                }
                res(itemObj);
              } else {
                res();
              }
            })
            .catch((e) => {
              console.error(childrenList[i].name, e);
            });
        }
      });
      outProArr.push(outPro);
    });
    if (resolve) {
      return Promise.all(outProArr).then(resolve);
    } else {
      return outProArr;
    }
  }
  getChildData(i) {
    return new Promise((resolve) => {
      let obj = {
        type: "",
        data: undefined,
      };
      try {
        const typeTool = i.get("typeTool");
        // if (i._children.length > 0) {
        //     // group直接返回未处理group组
        //     obj.type = "group";
        //     obj.data = i;
        //     resolve(obj);
        // } else {
        if (typeof typeTool !== "undefined") {
          // 文字
          if (typeof typeTool.styles().Tracking !== "undefined") {
            // 获取字间距
            i.tracking = typeTool.styles().Tracking[0];
          } else {
            i.tracking = undefined;
          }
          // 文字返回字间距信息
          obj.type = "text";
          obj.data = i.tracking;
          resolve(obj);
        } else {
          const base64 = i.layer.image.toBase64();
          // 图片
          var blob = this.dataURItoBlob(base64);
          this.slfileUpload(blob, i.name + ".png", base64).then((urlRes) => {
            // 子图层图片
            i.image = urlRes;
            // 图片返回图片url
            obj.type = "image";
            obj.data = i.image;
            resolve(obj);
          });
        }
      } catch (e) {
        console.log("eee", e);
        resolve();
      }
    }).catch((e) => {
      console.log("eeee", i, e);
    });
  }
  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString,
    });
  }
  slfileUpload(blob, fileName, base64) {
    return new Promise((resolve) => {
      if (this.uploadUrl) {
        /* FormData 是表单数据类 */
        var fd = new FormData();
        var ajax = new XMLHttpRequest();
        /* 把文件添加到表单里 */
        fd.append("file", blob, fileName);
        ajax.open("post", this.uploadUrl, true);
        ajax.onload = () => {
          try {
            const url = this.uploadCallback(ajax.responseText);
            resolve(url);
          } catch (e) {
            console.error(e);
            resolve();
          }
        };
        ajax.send(fd);
      } else {
        resolve(base64);
      }
    });
  }
  resReverse(group) {
    return group.reverse().map((item) => {
      if (item.type == "group") {
        item.objects = this.resReverse(item.objects);
        return item;
      } else {
        return item;
      }
    });
  }
  async getSliceData(file) {
    try {
      const result = await file.arrayBuffer();
      const psdFile = Psd.parse(result);
      const slices = psdFile.slices;
      const newSlices = slices.map((item) => {
        let width = item.right - item.left;
        let height = item.bottom - item.top;
        return {
          id: uuid(),
          left: item.left,
          width,
          height,
          ps: true,
          top: item.top,
        };
      });
      return newSlices;
    } catch (e) {
      return [];
    }
  }

  createCanvas() {
    return document.createElement("canvas");
  }

  getPsdBgImage(psd) {
    return new Promise((resolve) => {
      const l_background = psd.image.toBase64();
      let img = new Image();
      img.src = l_background;
      img.setAttribute("crossOrigin", "Anonymous");
      img.onload = () => {
        resolve({
          backgroundImage: l_background,
          width: img.width,
          height: img.height,
        });
      };
    });
  }
}

export default Psd;

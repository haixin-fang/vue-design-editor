<template>
  <div class="material">
    <div class="header">
      <el-button type="text">放大</el-button>
      <el-button type="text">20%</el-button>
      <el-button type="text">缩小</el-button>
      <el-button type="text">显示/隐藏参考线</el-button>
      <el-button type="text">显示/隐藏标尺</el-button>
      <el-button type="text" @click="download">下载</el-button>
      <el-button type="text">保存</el-button>
      <el-button type="text">预览</el-button>
    </div>
    <div class="container">
      <div class="left" @dragstart="handleDragStart">
        <el-scrollbar class="toolpanel">
          <div class="panel_item" :class="activeType == item.type ? 'panel_active' : ''" v-for="(item, index) in panel" :key="index" @click="handlePanel(item)">
            {{ item.name }}
          </div>
        </el-scrollbar>
        <div class="list">
          <template v-if="activeType == 'shape'">
            <div v-for="(element, index) in newcomponentlist" class="list-group-item" :key="index" :draggable="true" :data-index="JSON.stringify(element)">
              <div class="item-text">{{ element.name }}</div>
            </div>
          </template>
          <template v-if="activeType == 'resize'">
            <Resize @size="updateSize" />
          </template>
          <template v-if="activeType == 'vedio'">
            <div v-for="(element, index) in vedioList" class="list-group-item list-group-item2" :key="index" :draggable="true" :data-index="JSON.stringify(element)">
              <!-- <div class="item-text">{{ element.name }}</div> -->
              <video style="width: 100%; height: 100%" width="640" crossorigin="anonymous" useCORS height="360" autoplay x5-playsinline="" playsinline="" preload muted webkit-playsinline="" id="vedio">
                <source src="./assets/big_buck_bunny.mp4" type="video/mp4" />
              </video>
            </div>
            <!-- <div class="vedio">
              <video>
                <source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4" />
              </video>
            </div> -->
          </template>
        </div>
      </div>
      <div class="center" ref="center">
        <div class="attr">
          <el-button type="text">位置(包括图层顺序)</el-button>
          <el-button type="text">透明度</el-button>
          <el-button type="text">锁定</el-button>
          <el-button type="text">锁定</el-button>
          <el-button type="text">复制</el-button>
          <el-button type="text">删除</el-button>
        </div>
        <div class="editor">
          <div class="workspace" ref="workspace" :style="{ transform: `scale(${layout.scale})` }">
            <canvas id="canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, onMounted, ref, reactive } from "vue";
  import Guides from "@scena/guides";
  import { fabric } from "fabric";
  import Resize from "./components/resize.vue";
  import { Canvas2Video } from "canvas2video";
  export default defineComponent({
    components: {
      Resize,
    },
    setup() {
      const workspace = ref();
      const activeType = ref("template");
      const center = ref();
      const layout = reactive({
        win: {
          width: 0,
          height: 0,
        },
        workspace: {
          width: 375,
          height: 1000,
        },
        scale: 1,
      });
      let ctx;
      let horizontal, vertical;
      const vedioList = ref([
        {
          name: "视频",
          src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
          img: "https://m.elongstatic.com/HotelTenthousandAura/admin_images/2022_02_24/b9fff9b1ef2c466ca170137bb08ed17e.jpg",
        },
      ]);
      const newcomponentlist = ref([
        {
          name: "Image",
          id: 0,
        },
        {
          name: "Rect",
          id: 1,
        },
        {
          name: "Circle",
          id: 2,
        },
      ]);
      const panel = ref([
        {
          name: "模板",
          type: "template",
          icon: "<el-icon><Management /></el-icon>",
        },
        {
          name: "文字",
          type: "text",
          icon: "",
        },
        {
          name: "照片",
          type: "phote",
          icon: "",
        },
        {
          name: "视频",
          type: "vedio",
          icon: "",
        },
        {
          name: "图标",
          type: "icon",
          icon: "",
        },
        {
          name: "形状",
          type: "shape",
          icon: "",
        },
        {
          name: "背景",
          type: "background",
          icon: "",
        },
        {
          name: "图层",
          type: "layout",
          icon: "",
        },
        {
          name: "尺寸",
          type: "resize",
          icon: "",
        },
        {
          name: "二维码",
          type: "qrcode",
          icon: "",
        },
      ]);

      const getGuidesStyle = (type) => ({
        position: "absolute",
        zIndex: 1,
        left: type === "horizontal" ? 0 : "-30px",
        top: type === "horizontal" ? "-30px" : 0,
        width: type === "horizontal" ? "100%" : "30px",
        height: type === "horizontal" ? "30px" : "100%",
      });
      function initRule(type) {
        const a = new Guides(workspace.value, {
          type: type,
          displayDragPos: true,
          backgroundColor: "#fff",
          lineColor: "#000",
          textColor: "#000",
          style: getGuidesStyle(type),
        }).on("changeGuides", (e) => {});
        if (type == "horizontal") {
          horizontal = a;
        } else {
          vertical = a;
        }
      }
      function initFabric() {
        ctx = new fabric.Canvas("canvas", { preserveObjectStacking: true, width: 375, height: 1000, backgroundColor: "rgb(100,200,200)" });
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = "blue";
        fabric.Object.prototype.cornerStyle = "circle";
        ctx.on("mouse:down", (options) => {
          console.log(options);
        });
        ctx.on("drop", (options) => {
          const element = options.e.dataTransfer.getData("index");
          if (element) {
            let result = JSON.parse(element);
            if (activeType.value === "shape") {
              drawShape(result, options.e);
            } else if (activeType.value == "vedio") {
              drawVedio(result, options.e);
            }
          }
        });
        // 碰撞检测
        let activeObject = {};
        let edgedetection = 20
        ctx.on("object:moving", (e) => {
          var obj = e.target;
          obj.setCoords(); //Sets corner position coordinates based on current angle, width and height
          ctx.forEachObject(function (targ) {
            activeObject = ctx.getActiveObject();

            if (targ === activeObject) return;

            if (Math.abs(activeObject.oCoords.tr.x - targ.oCoords.tl.x) < edgedetection) {
              activeObject.left = targ.left - activeObject.width;
            }
            if (Math.abs(activeObject.oCoords.tl.x - targ.oCoords.tr.x) < edgedetection) {
              activeObject.left = targ.left + targ.width;
            }
            if (Math.abs(activeObject.oCoords.br.y - targ.oCoords.tr.y) < edgedetection) {
              activeObject.top = targ.top - activeObject.height;
            }
            if (Math.abs(targ.oCoords.br.y - activeObject.oCoords.tr.y) < edgedetection) {
              activeObject.top = targ.top + targ.height;
            }
            if (!activeObject.intersectsWithObject(targ)) {
              activeObject.strokeWidth = 0;
              activeObject.stroke = false;
            }
          });
        });
      }

      function getVideoElement(url) {
        var videoE = document.createElement("video");
        videoE.width = 400;
        videoE.height = 250;
        videoE.muted = true;
        videoE.useCORS = true; //解决跨域
        videoE.crossOrigin = "anonymous";
        var source = document.createElement("source");
        // source.src = url;
        source.setAttribute("src", url);
        source.type = "video/mp4";
        videoE.appendChild(source);
        return videoE;
      }
      function drawVedio(item, e) {
        var videoE = document.getElementById("vedio");
        // let videoE = getVideoElement('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')
        var video1 = new fabric.Image(videoE, {
          top: e.layerY,
          left: e.layerX,
          originX: "center",
          originY: "center",
          objectCaching: false,
        });
        ctx.add(video1);
        video1.getElement().play();
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
              return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        // adding webcam video element
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function getWebcamAllowed(localMediaStream) {
            webcamEl.srcObject = localMediaStream;

            canvas.add(webcam);
            webcam.moveTo(0); // move webcam element to back of zIndex stack
            webcam.getElement().play();
          })
          .catch(function getWebcamNotAllowed(e) {
            // block will be hit if user selects "no" for browser "allow webcam access" prompt
          });

        fabric.util.requestAnimFrame(function render() {
          ctx.renderAll();
          fabric.util.requestAnimFrame(render);
        });
      }

      function updateSize(item) {
        ctx.setWidth(item.width);
        ctx.setHeight(item.height);
        horizontal.resize();
        vertical.resize();
        layout.workspace = {
          width: item.width,
          height: item.height,
        };
        initLayout();
      }

      function drawShape(item, e) {
        if (item.name == "Rect") {
          debugger;
          let rect = new fabric.Rect({
            top: e.layerY,
            left: e.layerX,
            width: 100,
            height: 100,
            fill: "red",
          });
          // 可以通过自定义属性的方式确定唯一标识
          rect.custom = "ffffff";
          ctx.add(rect);
          console.log(ctx.item(0));
        }
      }

      function drawimg(item) {
        if (item.name == "Rect") {
          let rect = new fabric.Rect({
            top: 50,
            left: 100,
            width: 100,
            height: 100,
            fill: "red",
          });
          // 可以通过自定义属性的方式确定唯一标识
          rect.custom = "ffffff";
          ctx.add(rect);
          console.log(ctx.item(0));
        } else if (item.name == "Image") {
          // let imgOptions = {
          //   id: "image",
          //   left: 50,
          //   top: 50,
          //   scaleX: 1,
          //   scaleY: 1,
          //   originX: "center",
          //   originY: "center",
          //   cornerStrokeColor: "blue",
          // };
          // var canvasImage = new fabric.Image(document.getElementById('img'), imgOptions);
          // canvasImage.hasControls = true;
          // canvasImage.hasBorders = true;
          // ctx.add(canvasImage);
          fabric.Image.fromURL("http://pic5.40017.cn/i/ori/Xyim4zTzRC.jpg", (img) => {
            img.scale(0.5).set("flipX", true);
            ctx.add(img);
          });
        }
      }
      function initLayout() {
        layout.win.width = center.value.offsetWidth;
        layout.win.height = center.value.offsetHeight;
        if (layout.win.width - layout.workspace.width < 100) {
          layout.scale = (layout.win.width - 100) / layout.workspace.width;
        } else {
          layout.scale = 1;
        }
        if (layout.win.height - layout.workspace.height < 150) {
          workspace.value.style.top = "10%";
        } else {
          workspace.value.style.top = "";
        }
      }

      onMounted(() => {
        initRule("horizontal");
        initRule("vertical");
        initFabric();
        initLayout();
      });
      window.addEventListener("resize", (e) => {
        initLayout();
      });
      return {
        center,
        activeType,
        workspace,
        panel,
        layout,
        newcomponentlist,
        vedioList,
        updateSize,
        handleDragStart(e) {
          e.dataTransfer.setData("index", e.target.dataset.index);
        },
        getObject() {},
        handlePanel(item) {
          activeType.value = item.type;
        },
        download() {
          // if (!crossOriginIsolated) {
          //   SharedArrayBuffer = ArrayBuffer;
          // }
          const canvas2videoInstance = new Canvas2Video({
            canvas: document.querySelector("#canvas"),
            // outVideoType: "mp4",
            workerOptions: {
              // corePath: 'https://unpkg.com/@ffmpeg/core@0.6.0/ffmpeg-core.js'
            },
          });
          debugger;
          canvas2videoInstance.startRecord();

          setTimeout(() => {
            canvas2videoInstance.stopRecord();
          }, 3000);
          canvas2videoInstance
            .getStreamURL()
            .then((url) => {
              let link = url;
              let fileName = "xx.mp4";
              let x = new XMLHttpRequest();
              x.open("GET", link, true);
              x.responseType = "blob";
              x.onload = (e) => {
                let url = window.URL.createObjectURL(x.response);
                let a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.click();
              };
              x.send();
            })
            .catch((err) => console.error(err));
        },
      };
    },
  });
</script>
<style lang="scss">
  .material {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .header {
      height: 50px;
      border-bottom: 1px solid #eef2f8;
      // background: red;
      width: 100%;
    }
  }
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .left {
      width: 375px;
      display: flex;
      .toolpanel {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-right: 1px solid #eef2f8;
        .panel_item {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-size: 14px;
          &.panel_active {
            color: #2354f4;
          }
        }
      }
    }
    .list {
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .list-group-item {
        width: 60px;
        height: 60px;
        margin-bottom: 15px;
        border: 3px solid #409eff;
        border-radius: 10px;
        line-height: 60px;
        &.list-group-item2 {
          width: 150px;
          height: 150px;
        }
      }
    }
    .center {
      flex: 10;
      border-left: 1px solid #eef2f8;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      .editor {
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      // justify-content: center;
      // align-items: center;
      // overflow: auto;
      // padding: 50px;
      // position: relative;
      .attr {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #eef2f8;
        box-sizing: border-box;
      }
      .workspace {
        background: rgb(228, 224, 224);
        position: absolute;
        transform-origin: 50% 0;
      }
    }
  }
  .footer {
    position: fixed;
    width: 100%;
    height: 60px;
    background: red;
    bottom: 0;
  }
  #videoContainer {
    width: 300px;
    height: 300px;
  }
</style>

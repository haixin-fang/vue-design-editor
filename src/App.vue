<template>
  <div class="material">
    <div class="header">
      <el-button type="text">放大</el-button>
      <el-button type="text">20%</el-button>
      <el-button type="text">缩小</el-button>
      <el-button type="text">显示/隐藏参考线</el-button>
      <el-button type="text">显示/隐藏标尺</el-button>
      <el-button type="text" @click="download">下载</el-button>
      <el-button type="text" @click="downloadGif">gif下载</el-button>
      <el-button type="text">保存</el-button>
      <el-button type="text">预览</el-button>
    </div>
    <div class="container">
      <div class="left">
        <el-scrollbar class="toolpanel">
          <div
            class="panel_item"
            :class="activeType == item.type ? 'panel_active' : ''"
            v-for="(item, index) in panel"
            :key="index"
            @click="handlePanel(item)"
          >
            {{ item.name }}
          </div>
        </el-scrollbar>
        <div class="list" @dragstart="handleDragStart">
          <template v-if="activeType == 'shape'">
            <div
              v-for="(element, index) in newcomponentlist"
              class="list-group-item"
              :key="index"
              :draggable="true"
              :data-index="JSON.stringify(element)"
            >
              <div class="item-text">{{ element.name }}</div>
            </div>
          </template>
          <template v-if="activeType == 'resize'">
            <Resize @size="updateSize" />
          </template>
          <template v-if="activeType == 'vedio'">
            <div
              v-for="(element, index) in vedioList"
              class="list-group-item list-group-item2"
              :key="index"
              :draggable="true"
              :data-index="JSON.stringify(element)"
            >
              <!-- <div class="item-text">{{ element.name }}</div> -->
              <video
                style="width: 100%; height: 100%"
                width="640"
                crossorigin="anonymous"
                useCORS
                height="360"
                autoplay
                x5-playsinline=""
                playsinline=""
                preload
                muted
                webkit-playsinline=""
                id="vedio"
              >
                <source src="./assets/big_buck_bunny.mp4" type="video/mp4" />
              </video>
            </div>
            <!-- <div class="vedio">
              <video>
                <source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4" />
              </video>
            </div> -->
          </template>
          <div v-if="activeType == 'photo'" class="tp">
            <div
              class="tp_item"
              v-for="(item, index) in photo"
              :key="index"
              :draggable="true"
              :data-index="JSON.stringify(item)"
            >
              <img
                crossorigin="anonymous"
                :draggable="false"
                :src="item.src"
                alt=""
              />
              <div>{{ item.name }}</div>
            </div>
          </div>
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
          <div
            class="workspace"
            ref="workspace"
            :style="{ transform: `scale(${layout.scale})` }"
          >
            <canvas id="canvas"></canvas>
            <!-- <div class="horizontal" v-if="layout.moving"></div>
            <div class="vertical"  v-if="layout.moving"></div> -->
            <div
              v-for="(item, key) in layout.moving"
              :class="key"
              v-show="item.show"
              :style="{ top: `${item.top}px`, left: `${item.left}px` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  getCurrentInstance
} from 'vue'
import Guides from '@scena/guides'
import { fabric } from 'fabric'
import Resize from './components/resize.vue'
import { Canvas2Video } from 'canvas2video'
import json from './file/file.json'
import { fabricGif } from './gif/fabricGif'
import { saveAs } from 'file-saver'
import { parseGIF, decompressFrames } from 'gifuct-js'
export default defineComponent({
  components: {
    Resize
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const workspace = ref()
    const activeType = ref('photo')
    const center = ref()
    const layout = reactive({
      win: {
        width: 0,
        height: 0
      },
      workspace: {
        width: 375,
        height: 1000
      },
      scale: 1,
      moving: {
        horizontal: {
          show: false,
          top: 0
        },
        vertical: {
          show: false,
          left: 0
        }
      }
    })
    let ctx
    let horizontal, vertical
    const vedioList = ref(json.vedioList)
    const newcomponentlist = ref(json.newcomponentlist)
    const panel = ref(json.panel)
    const photo = ref(json.image.phote)
    const bg = ref(json.image.bg)
    let frameNum = 0
    let list = [],
      cb = () => {}
    let framesIndex = 0
    const getGuidesStyle = type => ({
      position: 'absolute',
      zIndex: 1,
      left: type === 'horizontal' ? 0 : '-30px',
      top: type === 'horizontal' ? '-30px' : 0,
      width: type === 'horizontal' ? '100%' : '30px',
      height: type === 'horizontal' ? '30px' : '100%'
    })
    function initRule(type) {
      const a = new Guides(workspace.value, {
        type: type,
        displayDragPos: true,
        backgroundColor: '#fff',
        lineColor: '#000',
        textColor: '#000',
        style: getGuidesStyle(type)
      }).on('changeGuides', e => {})
      if (type == 'horizontal') {
        horizontal = a
      } else {
        vertical = a
      }
    }
    function initFabric() {
      ctx = new fabric.Canvas('canvas', {
        preserveObjectStacking: true,
        width: 375,
        height: 1000,
        backgroundColor: 'rgb(100,200,200)'
      })
      fabric.Object.prototype.transparentCorners = false
      fabric.Object.prototype.cornerColor = 'blue'
      fabric.Object.prototype.cornerStyle = 'circle'
      ctx.on('mouse:down', options => {
        console.log(options)
      })
      ctx.on('drop', options => {
        options.e.preventDefault()
        options.e.stopPropagation()
        const element = options.e.dataTransfer.getData('index')
        console.log(element)
        if (element) {
          let result = JSON.parse(element)
          if (activeType.value === 'shape') {
            drawShape(result, options.e)
          } else if (activeType.value == 'vedio') {
            drawVedio(result, options.e)
          } else if (activeType.value == 'photo') {
            drawimg(result, options.e)
          }
        }
      })
      // 碰撞检测
      let activeObject = {}
      let edgedetection = 20
      ctx.on('object:moving', e => {
        let obj = e.target
        obj.setCoords() //Sets corner position coordinates based on current angle, width and height
        ctx.forEachObject(function (targ) {
          activeObject = ctx.getActiveObject()
          if (targ === activeObject) return
          if (
            Math.abs(activeObject.oCoords.tr.x - targ.oCoords.tl.x) <
            edgedetection
          ) {
            activeObject.left = targ.left - activeObject.width
            layout.moving.vertical.left = activeObject.left + activeObject.width
            layout.moving.vertical.show = true
          }
          if (
            Math.abs(activeObject.oCoords.tl.x - targ.oCoords.tr.x) <
            edgedetection
          ) {
            activeObject.left = targ.left + targ.width
            layout.moving.vertical.left = activeObject.left
            layout.moving.vertical.show = true
          }
          if (
            Math.abs(activeObject.oCoords.br.y - targ.oCoords.tr.y) <
            edgedetection
          ) {
            activeObject.top = targ.top - activeObject.height
            layout.moving.horizontal.top =
              activeObject.top + activeObject.height
            layout.moving.horizontal.show = true
          }
          if (
            Math.abs(targ.oCoords.br.y - activeObject.oCoords.tr.y) <
            edgedetection
          ) {
            activeObject.top = targ.top + targ.height
            layout.moving.horizontal.top = activeObject.top
            layout.moving.horizontal.show = true
          }

          let activeOcoords = activeObject.oCoords
          let targOcoords = targ.oCoords
          for (let key in activeOcoords) {
            for (let targ in targOcoords) {
              if (activeOcoords[key].x == targOcoords[targ].x) {
                layout.moving.vertical.left = targOcoords[targ].x
                layout.moving.vertical.show = true
              }
              if (activeOcoords[key].y == targOcoords[targ].y) {
                layout.moving.horizontal.top = targOcoords[targ].y
                layout.moving.horizontal.show = true
              }
            }
          }
        })
      })
      ctx.on('mouse:move:before', () => {
        Object.keys(layout.moving).forEach(item => {
          layout.moving[item].show = false
        })
      })
    }

    function getVideoElement(url) {
      var videoE = document.createElement('video')
      videoE.width = 400
      videoE.height = 250
      videoE.muted = true
      videoE.useCORS = true //解决跨域
      videoE.crossOrigin = 'anonymous'
      var source = document.createElement('source')
      // source.src = url;
      source.setAttribute('src', url)
      source.type = 'video/mp4'
      videoE.appendChild(source)
      return videoE
    }
    function drawVedio(item, e) {
      var videoE = document.getElementById('vedio')
      // let videoE = getVideoElement('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')
      var video1 = new fabric.Image(videoE, {
        top: e.layerY,
        left: e.layerX,
        originX: 'center',
        originY: 'center',
        objectCaching: false
      })
      ctx.add(video1)
      video1.getElement().play()
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }

      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // First get ahold of the legacy getUserMedia, if present
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia

          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            )
          }

          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      // adding webcam video element
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function getWebcamAllowed(localMediaStream) {
          webcamEl.srcObject = localMediaStream

          canvas.add(webcam)
          webcam.moveTo(0) // move webcam element to back of zIndex stack
          webcam.getElement().play()
        })
        .catch(function getWebcamNotAllowed(e) {
          // block will be hit if user selects "no" for browser "allow webcam access" prompt
        })

      fabric.util.requestAnimFrame(function render() {
        ctx.renderAll()
        fabric.util.requestAnimFrame(render)
      })
    }

    function updateSize(item) {
      ctx.setWidth(item.width)
      ctx.setHeight(item.height)
      horizontal.resize()
      vertical.resize()
      layout.workspace = {
        width: item.width,
        height: item.height
      }
      initLayout()
    }

    function drawShape(item, e) {
      if (item.name == 'Rect') {
        let rect = new fabric.Rect({
          top: e.layerY,
          left: e.layerX,
          width: 100,
          height: 100,
          fill: 'red'
        })
        // 可以通过自定义属性的方式确定唯一标识
        rect.custom = 'ffffff'
        ctx.add(rect)
        console.log(ctx.item(0))
      }
    }

    async function drawimg(item, e) {
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
      if (item.type != 'gif') {
        fabric.Image.fromURL(item.src, img => {
          // img.scale(0.5).set('flipX', true)
          img.set({
            top: e.layerY,
            left: e.layerX,
            width: img.width,
            height: img.height
          })
          ctx.add(img)
        })
      } else {
        // const gif1 = await fabricGif(item.src, 750, 172)
        // debugger
        // gif1.set({ top: e.layerY, left: e.layerX })
        // ctx.add(gif1)
        // fabric.util.requestAnimFrame(function render() {
        //   ctx.renderAll()
        //   fabric.util.requestAnimFrame(render)
        // })
        fabric.Image.fromURL(item.src, function (img) {
          img.left = e.layerX
          img.top = e.layerY
          gif(item.src, function (frames, delay) {
            frameNum = frames.length
            var animInterval
            img.dirty = true
            let a = -1
            img._render = function (ctx) {
              ctx.drawImage(
                frames[framesIndex],
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
              )
              if (a != framesIndex) {
                cb()
                console.log(framesIndex)
              }
              a = framesIndex
            }
            img.play = function () {
              if (typeof animInterval === 'undefined') {
                animInterval = setInterval(function () {
                  framesIndex++
                  if (framesIndex === frames.length) {
                    framesIndex = 0
                  }
                }, delay)
              }
            }
            img.stop = function () {
              clearInterval(animInterval)
              animInterval = undefined
            }
            img.play()
            ctx.add(img)
          })
        })

        function gif(url, callback) {
          var tempCanvas = document.createElement('canvas')
          var tempCtx = tempCanvas.getContext('2d')

          var gifCanvas = document.createElement('canvas')
          var gifCtx = gifCanvas.getContext('2d')

          var imgs = []

          var xhr = new XMLHttpRequest()
          xhr.open('get', url, true)
          xhr.responseType = 'arraybuffer'
          xhr.onload = function () {
            var tempBitmap = {}
            tempBitmap.url = url
            var arrayBuffer = xhr.response
            if (arrayBuffer) {
              var gif = parseGIF(arrayBuffer)
              var frames = decompressFrames(gif, true)
              gifCanvas.width = frames[0].dims.width
              gifCanvas.height = frames[0].dims.height

              for (var i = 0; i < frames.length; i++) {
                createFrame(frames[i])
              }
              callback(imgs, frames[0].delay)
            }
          }
          xhr.send(null)

          var disposalType

          function createFrame(frame) {
            if (!disposalType) {
              disposalType = frame.disposalType
            }

            var dims = frame.dims

            tempCanvas.width = dims.width
            tempCanvas.height = dims.height
            var frameImageData = tempCtx.createImageData(
              dims.width,
              dims.height
            )

            frameImageData.data.set(frame.patch)

            if (disposalType !== 1) {
              gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height)
            }

            tempCtx.putImageData(frameImageData, 0, 0)
            gifCtx.drawImage(tempCanvas, dims.left, dims.top)
            var dataURL = gifCanvas.toDataURL('image/png')
            var tempImg = fabric.util.createImage()
            tempImg.src = dataURL
            imgs.push(tempImg)
          }
        }
        render()

        function render() {
          if (canvas) {
            ctx.renderAll()
          }

          fabric.util.requestAnimFrame(render)
        }
      }
    }
    function initLayout() {
      layout.win.width = center.value.offsetWidth
      layout.win.height = center.value.offsetHeight
      if (layout.win.width - layout.workspace.width < 100) {
        layout.scale = (layout.win.width - 100) / layout.workspace.width
      } else {
        layout.scale = 1
      }
      if (layout.win.height - layout.workspace.height < 150) {
        workspace.value.style.top = '10%'
      } else {
        workspace.value.style.top = ''
      }
    }

    onMounted(() => {
      initRule('horizontal')
      initRule('vertical')
      initFabric()
      initLayout()
    })
    // const getAssetsFile = (url) => {
    //   return new URL(`../assets/images/${url}`, import.meta.url).href
    // }
    window.addEventListener('resize', e => {
      initLayout()
    })
    return {
      center,
      activeType,
      workspace,
      panel,
      layout,
      newcomponentlist,
      vedioList,
      photo,
      bg,
      updateSize,
      handleDragStart(e) {
        e.dataTransfer.setData('index', e.target.dataset.index)
      },
      getObject() {},
      handlePanel(item) {
        activeType.value = item.type
      },
      download() {
        // if (!crossOriginIsolated) {
        //   SharedArrayBuffer = ArrayBuffer;
        // }
        const canvas2videoInstance = new Canvas2Video({
          canvas: document.querySelector('#canvas'),
          // outVideoType: "mp4",
          workerOptions: {
            // corePath: 'https://unpkg.com/@ffmpeg/core@0.6.0/ffmpeg-core.js'
          }
        })
        canvas2videoInstance.startRecord()
        setTimeout(() => {
          canvas2videoInstance.stopRecord()
        }, 3000)
        canvas2videoInstance
          .getStreamURL()
          .then(url => {
            let link = url
            let fileName = 'xx.mp4'
            let x = new XMLHttpRequest()
            x.open('GET', link, true)
            x.responseType = 'blob'
            x.onload = e => {
              let url = window.URL.createObjectURL(x.response)
              let a = document.createElement('a')
              a.href = url
              a.download = fileName
              a.click()
            }
            x.send()
          })
          .catch(err => console.error(err))
      },
      downloadGif() {
        var gif = new GIF({
          workers: 4,
          quality: 10,
          workerScript: new URL(`./gifjs/gif.worker.js`, import.meta.url)
        })
        // or a canvas element

        gif.on('finished', function (blob) {
          // console.log('dddd', blob)
          // saveAs(blob, 'image/gif')
          let url = URL.createObjectURL(blob)
          const actions = document.createElement('a')
          actions.setAttribute('href', url)
          actions.setAttribute('download', '2')
          actions.click()
        })

        cb = function () {
          // list.forEach(item => {
          //   gif.addFrame(item, { delay: 200 })
          // })
          // gif.addFrame()
          // if (i < 1000) {
          //   gif.addFrame(document.getElementById('canvas'))
          //   requestAnimationFrame(render)
          //   i++
          // } else {
          //   gif.render()
          // }
          if (gif.frames.length < frameNum * 20) {
            gif.addFrame(document.getElementById('canvas'), { delay: 0 })
          } else {
            gif.render()
            cb = () => {}
          }
        }
      }
    }
  }
})
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
      box-sizing: border-box;
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
    overflow: hidden;
    width: calc(100% - 80px);
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
    .tp {
      width: 100%;
      .tp_item {
        width: 50%;
        display: inline-flex;
        vertical-align: top;
        text-align: center;
        flex-direction: column;
        align-items: center;
        img {
          width: 80%;
        }
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
      .horizontal,
      .vertical {
        position: absolute;
      }
      .horizontal {
        height: 1px;
        width: 100%;
        left: 0;
        background: #409eff;
      }
      .vertical {
        height: 100%;
        width: 1px;
        top: 0;
        background: #409eff;
      }
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

<template>
  <div class="gda-modal-root">
    <div class="gda-modal-mask"></div>
    <div
      tabindex="-1"
      role="dialog"
      aria-labelledby="rcDialogTitle1"
      class="gda-modal-wrap gda-modal-centered"
    >
      <div
        role="document"
        class="gda-modal"
        style="width: 560px; transform-origin: -308px 130.5px"
      >
        <div
          tabindex="0"
          aria-hidden="true"
          style="width: 0px; height: 0px; overflow: hidden"
        ></div>
        <div class="gda-modal-content">
          <button type="button" aria-label="Close" class="gda-modal-close">
            <span class="gda-modal-close-x" @click="onClose">
              <el-icon class="gdaicon gdaicon-close gda-modal-close-icon"
                ><Close /></el-icon
            ></span>
          </button>
          <div class="gda-modal-header">
            <div id="rcDialogTitle1" class="gda-modal-title">导入文件</div>
          </div>
          <div
            class="gda-modal-body"
            style="padding: 0px; height: 444px; box-sizing: border-box"
          >
            <div class="design-choose-file">
              <template v-if="fileList.length == 0">
                <div
                  class="design-choose-file__empty-file-main design-choose-file__flex-center"
                  ref="dragArea"
                >
                  <template v-if="!isDrag">
                    <img
                      src="https://cdn.dancf.com/fe-assets/20221017/f285085e35bfff5e3b59701095636a40.png"
                      alt=""
                      width="200"
                      class="design-choose-file__pointer-none"
                    />
                    <div style="font-weight: 600">拖拽文件到此处，或者</div>
                    <div
                      class="design-choose-file__choose-file-button-2"
                      @click="chooseFiles"
                    >
                      选择文件...
                    </div>
                  </template>
                  <template v-else>
                    <div class="design-choose-file__dragging-tip-title">
                      拖拽至此处并松开鼠标
                    </div>
                    <div class="design-choose-file__dragging-tip-text">
                      支持批量
                    </div>
                  </template>
                </div>
                <div
                  class="design-choose-file__drag-footer design-choose-file__flex-center"
                  v-show="!isDrag"
                >
                  <div>
                    支持 PSD
                    <!-- Sketch / Ai / PPTX / PDF 以及 图片 / 视频格式  -->
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="design-choose-file__files-wrap design-choose-file__hide-scrollbar"
                >
                  <div
                    class="design-choose-file__file-item design-choose-file__flex-center"
                    v-for="(item, index) in fileList"
                    :key="item.lastModified + item.name"
                  >
                    <div class="design-choose-file__file-item-main">
                      <img
                        src="../assets/upload-file-image.svg"
                        class="design-choose-file__file-image design-choose-file__pointer-none"
                      /><span
                        class="design-choose-file__file-name design-choose-file__text-ellipsis"
                      >
                        {{ item.name }}
                      </span>
                    </div>
                    <i
                      @click="fileList.splice(index, 1)"
                      class="iconfont icon-delete design-choose-file__close"
                    ></i>
                  </div>
                </div>
                <div
                  class="design-choose-file__not-empty-footer design-choose-file__flex-center"
                >
                  <span
                    class="design-choose-file__choose-file-button"
                    @click="chooseFiles"
                  >
                    <!-- + 添加文件 -->
                  </span>
                  <button
                    type="button"
                    class="gda-btn gda-btn-primary"
                    style="width: 88px"
                    @click="onGuide"
                  >
                    <span>导入</span>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div
          tabindex="0"
          aria-hidden="true"
          style="width: 0px; height: 0px; overflow: hidden"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineEmits, ref, computed } from "vue";
import { ElIcon } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { tryOnMounted, useEventListener } from "@vueuse/core";
import getFileType from "@/utils/getFileType";
import Psd from "@/parse/psd";
const fileList = ref<File[]>([]);
const dragArea = ref();
const isDrag = ref(false);

const mapStrategyType: any = {
  psd: (file: File) => {
    return new Psd(file);
  },
};

const types = computed(() => {
  return Object.keys(mapStrategyType);
});
// 其他限制
// 需要https环境，如果是本地localhost 不受此限制。
// 不能在 iframe 内使用，因为被认为不安全
const emit = defineEmits(["close", "render"]);

tryOnMounted(() => {
  useEventListener(dragArea.value, "dragover", onDragOver);
  useEventListener(dragArea.value, "dragleave", onDragLeave);
  useEventListener(dragArea.value, "drop", onDrop);
});

function onDragOver(e: Event) {
  e.preventDefault();
  dragArea.value.classList.add("dragover");
  isDrag.value = true;
}

function onDragLeave(e: Event) {
  e.preventDefault();
  dragArea.value.classList.remove("dragover");
  isDrag.value = false;
}

async function onDrop(e: any) {
  e.preventDefault();
  dragArea.value.classList.remove("dragover");
  isDrag.value = false;
  const files = e.dataTransfer.files;
  console.log(files);
  // if (files.length > 0) {
  //   fileList.value.push(...files);
  // }
  // 暂时只处理一个
  const fileType = await getFileType(files);
  if (fileType.ext && types.value.includes(fileType.ext)) {
    files.type = fileType.ext;
    fileList.value = [files];
  } else {
    console.log("不支持该类型");
  }
}

function onClose() {
  emit("close");
}
async function chooseFiles() {
  let arrFileHandle;
  if (!window.showOpenFilePicker) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.click();
    arrFileHandle = await new Promise((resolve) => {
      input.addEventListener("change", (e: any) => {
        resolve([...e.target.files]);
      });
    });
  } else {
    // 打开文件
    arrFileHandle = await window.showOpenFilePicker({
      types: [
        {
          accept: {
            "image/*": [types.value.map((key) => "." + key).join(",")], //".png", ".gif", ".jpeg", ".jpg", ".webp",
          },
        },
      ],
      // 可以选择多个图片
      multiple: false,
    });
  }
  // 遍历选择的文件
  for (const fileHandle of arrFileHandle) {
    // 获取文件内容
    const fileData = await fileHandle.getFile();
    fileList.value.push(fileData);
  }
}

async function onGuide() {
  const files = fileList.value[0];
  const file = await getFileType(files);
  if (file) {
    const { ext }: any = file;
    if (mapStrategyType[ext]) {
      const handler = mapStrategyType[ext]();
      const data = await handler.init(files);
      console.log("json", JSON.stringify(data.json));
      emit("render", data);
    }
  }
}
</script>
<style lang="scss" scoped>
@media (max-width: 959px) {
  .gda-modal {
    max-width: calc(100vw - 16px);
    margin: 8px auto;
  }
}
.gda-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  filter: alpha(opacity=50);
}
.gda-modal-centered {
  text-align: center;
  &::before {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
    content: "";
  }
  .gda-modal {
    top: 0;
    display: inline-block;
    text-align: left;
    vertical-align: middle;
  }
}
.gda-modal-close-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  line-height: 56px;
  font-style: normal;
  text-transform: none;
  text-rendering: auto;
  .gdaicon {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.15em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
.gda-modal-content {
  position: relative;
  background-color: #ffffff;
  background-clip: padding-box;
  border-radius: 12px;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2),
    0px 4px 16px 0px rgba(0, 0, 0, 0.12), 0px 4px 8px 2px rgba(0, 0, 0, 0.08);
  pointer-events: auto;
  .gda-modal-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 0;
    color: #9da3ac;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    background: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    transition: color 0.3s;
  }
  .gda-modal-header {
    padding: 16px 16px 16px 24px;
    color: #222529;
    border-radius: 12px 12px 0 0;
    .gda-modal-title {
      margin: 0;
      color: #222529;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      word-wrap: break-word;
    }
  }
  .gda-modal-body {
    font-size: var(--modal-content-font-size);
    line-height: 22px;
    word-wrap: break-word;
    height: 444px;

    .design-choose-file {
      position: relative;
      height: 100%;
      .design-choose-file__files-wrap {
        height: 384px;
        overflow-y: auto;

        .design-choose-file__file-item {
          display: flex;
          flex-direction: row;
          height: 64px;
          padding: 0 24px;
          line-height: 64px;
          cursor: pointer;
          &:hover {
            background: #f6f7f9;
            .design-choose-file__close {
              visibility: visible;
            }
          }
          .design-choose-file__file-item-main {
            display: flex;
            flex: 1;
            flex-direction: row;
            overflow: hidden;
            .design-choose-file__file-image {
              width: 32px;
            }
            .design-choose-file__pointer-none {
              pointer-events: none;
            }
            > *:nth-child(n + 2) {
              margin-left: 12px;
            }
            span {
              font-size: 14px;
              color: #222529;
            }
          }
          .design-choose-file__close {
            font-size: 16px;
            color: #7f8792;
            visibility: hidden;
          }
        }
        .design-choose-file__flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .design-choose-file__not-empty-footer {
        display: flex;
        justify-content: space-between !important;
        padding: 0 20px;
        margin-bottom: 20px;
        .design-choose-file__choose-file-button {
          color: #2254f4;
          font: 400 14px / 1.5 "PingFang SC", "Microsoft YaHei",
            "Hiragino Sans GB", "WenQuanYi Micro Hei", Arial, sans-serif,
            Apple Color Emoji, Segoe UI Emoji;
          cursor: pointer;
        }
        .gda-btn-primary {
          color: #ffffff;
          cursor: pointer;
          background-color: #2254f4;
          &:hover {
            background-color: #1338cf;
          }
        }
        .gda-btn {
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
      .design-choose-file__flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .design-choose-file__hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .design-choose-file__empty-file-main {
        flex-direction: column;
        height: 372px;
        background-image: url("../assets/upload-file-bg.png");
        background-size: cover;
        > *:nth-child(n + 2) {
          margin-top: 8px;
        }
        &.dragover {
          display: flex;
          flex-direction: column;
          height: calc(100% - 20px);
          margin: 0 20px 20px;
          background: rgba(34, 84, 244, 0.16);
          border: 3px dashed #2254f4;
          border-radius: 8px;
          .design-choose-file__dragging-tip-title {
            font: 600 20px / 1.3 "PingFang SC", "Microsoft YaHei",
              "Hiragino Sans GB", "WenQuanYi Micro Hei", Arial, sans-serif,
              Apple Color Emoji, Segoe UI Emoji;
            color: #222529;
            text-align: center;
          }
          .design-choose-file__dragging-tip-text {
            margin-top: 10px;
            font: 400 16px / 1.3 "PingFang SC", "Microsoft YaHei",
              "Hiragino Sans GB", "WenQuanYi Micro Hei", Arial, sans-serif,
              Apple Color Emoji, Segoe UI Emoji;
            color: #222529;
            text-align: center;
          }
        }
        .design-choose-file__choose-file-button-2 {
          font-weight: 600;
          font-size: 16px;
          color: #2254f4;
          cursor: pointer;
        }
      }
    }
    .design-choose-file__drag-footer {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      height: 72px;
      font: 400 14px / 1.5 "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB",
        "WenQuanYi Micro Hei", Arial, sans-serif, Apple Color Emoji,
        Segoe UI Emoji;
      color: #7f8792;
      background: #f6f7f9;
      border-radius: 0 0 12px 12px;
    }
    .design-choose-file__flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.gda-modal-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  overflow: auto;
  outline: 0;
  -webkit-overflow-scrolling: touch;
}
</style>

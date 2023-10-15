export const addTab = [
  {
    type: "image",
    title: "图片/视频/psd",
    list: [
      {
        type: "upload",
        icon: require("@/assets/upload.svg"),
        title: "本地上传",
      },
    ],
  },
  {
    type: "text",
    title: "文字",
    list: [
      {
        type: "h1",
        icon: require("@/assets/h1.svg"),
        title: "标题",
      },
      {
        type: "h2",
        icon: require("@/assets/h2.svg"),
        title: "副标题",
      },
      {
        type: "Aa",
        icon: require("@/assets/Aa.svg"),
        title: "正文",
      },
      {
        type: "Aa",
        icon: require("@/assets/3d.svg"),
        title: "3D文字",
      },
    ],
  },
  {
    type: "shape",
    title: "形状",
    list: [
      {
        type: "square",
        icon: require("@/assets/square.svg"),
      },
      {
        type: "triangle",
        icon: require("@/assets/triangle.svg"),
      },
      {
        type: "circle",
        icon: require("@/assets/circle.svg"),
      },
      {
        type: "line",
        icon: require("@/assets/line.svg"),
      },
    ],
  },
  {
    type: "component",
    title: "组件",
    list: [
      {
        type: "qrcode",
        icon: require("@/assets/qrcode.svg"),
        title: "二维码",
      },
    ],
  },
];

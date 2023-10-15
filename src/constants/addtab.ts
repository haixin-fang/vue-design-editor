const getImageUrl = (url: string) => {
  return new URL(url, import.meta.url).href;
};
export const addTab = [
  {
    type: "image",
    title: "图片/视频/psd",
    list: [
      {
        type: "upload",
        icon: require("/src/assets/upload.svg"),
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
        icon: getImageUrl("/src/assets/h1.svg"),
        title: "标题",
      },
      {
        type: "h2",
        icon: "/src/assets/h2.svg",
        title: "副标题",
      },
      {
        type: "Aa",
        icon: "/src/assets/Aa.svg",
        title: "正文",
      },
      {
        type: "Aa",
        icon: "/src/assets/3d.svg",
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
        icon: "/src/assets/square.svg",
      },
      {
        type: "triangle",
        icon: "/src/assets/triangle.svg",
      },
      {
        type: "circle",
        icon: "/src/assets/circle.svg",
      },
      {
        type: "line",
        icon: "/src/assets/line.svg",
      },
    ],
  },
  {
    type: "component",
    title: "组件",
    list: [
      {
        type: "qrcode",
        icon: "/src/assets/qrcode.svg",
        title: "二维码",
      },
    ],
  },
];

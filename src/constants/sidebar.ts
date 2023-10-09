export const modulelist = [
  {
    type: "add",
    text: "添加",
    drag: false,
    icon: "icon-tianjia",
  },
  {
    type: "template",
    text: "模板",
    drag: false,
    icon: "icon-templet-",
  },
  {
    type: "material",
    text: "素材",
    drag: false,
    show: true, //默认展示
    icon: "icon-xingzhuang",
    fileType: ["jpg", "png", "gif", "svg"],
  },
  {
    type: "text",
    text: "文字",
    drag: false,
    icon: "icon-text",
    options: {
      type: "FontCustom",
      text: "",
      width: 60,
      height: 30,
      fontSize: 32,
      name: "New text",
    },
  },
  {
    type: "Image",
    text: "图片",
    drag: false,
    icon: "icon-editor-background",
    fileType: ["jpg", "png", "gif", "svg"],
  },
  {
    type: "Video",
    text: "视频",
    drag: false,
    icon: "icon-shipinbofang",
    fileType: ["mp4"],
  },
  {
    type: "qrcode",
    text: "二维码",
    drag: false,
    icon: "icon-erweima1",
  },
];

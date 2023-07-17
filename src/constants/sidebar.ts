export const modulelist = [
  {
    type: "template",
    text: "模板",
    drag: false,
    icon: "icon-templet-",
  },
  {
    type: "Image",
    text: "素材",
    drag: false,
    icon: "icon-xingzhuang",
    fileType: ["jpg", "png", "gif", "svg"],
  },
  {
    type: "text",
    text: "文字",
    drag: true,
    icon: "icon-wenzi",
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
    type: "background",
    text: "背景",
    drag: false,
    icon: "icon-background",
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
    drag: true,
    icon: "icon-erweima",
  },
];

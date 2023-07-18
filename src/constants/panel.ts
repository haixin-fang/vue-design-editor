export const panel = [
  {
    select: false,
    text: "画布",
    type: "background",
  },
  {
    select: true,
    text: "图片",
    type: ["Image", "svg", "gif"],
  },
  {
    select: true,
    text: "图形",
    type: "shape",
  },
  {
    select: true,
    text: "文字",
    type: "FontCustom",
  },
  {
    select: true,
    text: "二维码",
    type: "qrcode",
  },
  {
    select: true,
    text: "视频",
    type: "Video",
  },
  {
    select: true,
    text: "组合",
    type: ["group", "activeSelection"],
  },
];

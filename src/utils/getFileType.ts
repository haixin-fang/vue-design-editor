/**
 * @description MIME Type与Byte signature映射表
 * @reference https://mimesniff.spec.whatwg.org/#matching-an-image-type-signature
 */
const signatureList = [
  {
    mime: "video/mp4",
    ext: "mp4",
    offset: 4,
    signature: [0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d],
  },
  {
    mime: "video/mp4",
    ext: "mp4",
    offset: 4,
    signature: [0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34],
  },
  {
    mime: "image/jpeg",
    ext: "jpeg",
    signature: [0xff, 0xd8, 0xff],
  },
  {
    mime: "image/png",
    ext: "png",
    signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  {
    mime: "image/gif",
    ext: "gif",
    signature: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
  },
  {
    mime: "image/gif",
    ext: "gif",
    signature: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  },
  {
    mime: "image/vnd.adobe.photoshop",
    ext: "psd",
    signature: [0x38, 0x42, 0x50, 0x53],
  },
  {
    mime: "image/webp",
    ext: "webp",
    signature: [
      0x52,
      0x49,
      0x46,
      0x46,
      undefined,
      undefined,
      undefined,
      undefined,
      0x57,
      0x45,
      0x42,
      0x50,
      0x56,
      0x50,
    ],
  },
  {
    mime: "image/x-icon",
    ext: "ico",
    signature: [0x00, 0x00, 0x01, 0x00],
  },
  {
    mime: "image/x-icon",
    ext: "cur",
    signature: [0x00, 0x00, 0x02, 0x00],
  },
  {
    ext: "tif",
    mime: "image/tiff",
    signature: [0x4d, 0x4d, 0x0, 0x2a],
  },
  {
    ext: "tif",
    mime: "image/tiff",
    signature: [0x49, 0x49, 0x2a, 0x00],
  },
  {
    ext: "bpg",
    mime: "image/bpg",
    signature: [0x42, 0x50, 0x47, 0xfb],
  },
  {
    mime: "application/pdf",
    ext: "pdf",
    signature: [0x25, 0x50, 0x44, 0x46, 0x2d],
  },
  {
    mime: "application/ogg",
    ext: "ogg",
    signature: [0x4f, 0x67, 0x67, 0x53],
  },
  {
    mime: "audio/midi",
    ext: "midi",
    signature: [0x4d, 0x54, 0x68, 0x64],
  },
  {
    mime: "audio/mpeg",
    ext: "mp3",
    signature: [0x49, 0x44, 0x33],
  },
  {
    ext: "flac",
    mime: "audio/x-flac",
    signature: [0x66, 0x4c, 0x61, 0x43],
  },
  {
    ext: "mpg",
    mime: "video/mpeg",
    signature: [0x0, 0x0, 0x1, 0xba],
  },
  {
    ext: "mpg",
    mime: "video/mpeg",
    signature: [0x0, 0x0, 0x1, 0xb3],
  },
  {
    mime: "video/x-flv",
    ext: "flv",
    signature: [0x46, 0x4c, 0x56],
  },
  {
    mime: "image/bmp",
    ext: "bmp",
    signature: [0x42, 0x4d],
  },
  {
    mime: "audio/aiff",
    ext: "aiff",
    signature: [
      0x46,
      0x4f,
      0x52,
      0x4d,
      undefined,
      undefined,
      undefined,
      undefined,
      0x41,
      0x49,
      0x46,
      0x46,
    ],
  },
  {
    mime: "video/vnd.avi",
    ext: "avi",
    signature: [
      0x52,
      0x49,
      0x46,
      0x46,
      undefined,
      undefined,
      undefined,
      undefined,
      0x41,
      0x56,
      0x49,
      0x20,
    ],
  },

  {
    mime: "video/webm",
    ext: "webm",
    signature: [0x1a, 0x45, 0xdf, 0xa3],
  },
  {
    mime: "audio/mpeg",
    ext: "mp3",
    signature: [0xff, 0xfb],
  },
  {
    mime: "audio/mpeg",
    ext: "mp3",
    signature: [0xff, 0xf3],
  },
  {
    mime: "audio/mpeg",
    ext: "mp3",
    signature: [0xff, 0xf2],
  },
  {
    mime: "audio/mpeg",
    ext: "mp3",
    signature: [0xff, 0xfb],
  },
  {
    mime: "audio/vnd.wave",
    ext: "wav",
    signature: [
      0x52,
      0x49,
      0x46,
      0x46,
      undefined,
      undefined,
      undefined,
      undefined,
      0x57,
      0x41,
      0x56,
      0x45,
    ],
  },
  {
    mime: "audio/qcelp",
    ext: "qcp",
    signature: [
      0x52,
      0x49,
      0x46,
      0x46,
      undefined,
      undefined,
      undefined,
      undefined,
      0x51,
      0x4c,
      0x43,
      0x4d,
    ],
  },
  {
    mime: "font/ttf",
    ext: "ttf",
    signature: [0x00, 0x01, 0x00, 0x00],
  },
  {
    mime: "font/otf",
    ext: "otf",
    signature: [0x4f, 0x54, 0x54, 0x4f],
  },
  {
    mime: "font/collection",
    ext: "ttcf",
    signature: [0x74, 0x74, 0x63, 0x66],
  },
  {
    mime: "font/woff",
    ext: "woff",
    signature: [0x77, 0x4f, 0x46, 0x46],
  },
  {
    mime: "font/woff2",
    ext: "woff2",
    signature: [0x77, 0x4f, 0x46, 0x32],
  },
  {
    mime: "application/x-rar-compressed",
    ext: "rar",
    signature: [0x52, 0x61, 0x72, 0x20, 0x1a, 0x07, 0x00],
  },
  {
    mime: "application/x-msdownload",
    ext: "exe",
    signature: [0x4d, 0x5a],
  },
  {
    ext: "xz",
    mime: "application/x-xz",
    signature: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00],
  },
  {
    ext: "7z",
    mime: "application/x-7z-compressed",
    signature: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c],
  },
  {
    mime: "application/wasm",
    ext: "wasm",
    signature: [0x00, 0x61, 0x73, 0x6d],
  },
  {
    mime: "application/x-nintendo-nes-rom",
    ext: "nes",
    signature: [0x4e, 0x45, 0x53, 0x1a],
  },
  {
    ext: "rpm",
    mime: "application/x-rpm",
    signature: [0xed, 0xab, 0xee, 0xdb],
  },
  {
    ext: "zst",
    mime: "application/zstd",
    signature: [0x28, 0xb5, 0x2f, 0xfd],
  },
  {
    ext: "alias",
    mime: "application/x.apple.alias",
    signature: [
      0x62, 0x6f, 0x6f, 0x6b, 0x00, 0x00, 0x00, 0x00, 0x6d, 0x61, 0x72, 0x6b,
      0x00, 0x00, 0x00, 0x00,
    ],
  },
  {
    ext: "deb",
    mime: "application/x-deb",
    signature: [0x21, 0x3c, 0x61, 0x72, 0x63, 0x68, 0x3e, 0x0a],
  },
  {
    ext: "blend",
    mime: "application/x-blender",
    signature: [0x42, 0x4c, 0x45, 0x4e, 0x44, 0x45, 0x52],
  },
  {
    ext: "chm",
    mime: "application/vnd.ms-htmlhelp",
    signature: [
      0x49, 0x54, 0x53, 0x46, 0x03, 0x00, 0x00, 0x00, 0x60, 0x00, 0x00, 0x00,
    ],
  },
  {
    ext: "rtf",
    mime: "application/rtf",
    signature: [0x7b, 0x5c, 0x72, 0x74, 0x66, 0x31],
  },
  {
    ext: "cab",
    mime: "application/vnd.ms-cab-compressed",
    signature: [0x4d, 0x53, 0x43, 0x46],
  },
  {
    ext: "cab",
    mime: "application/vnd.ms-cab-compressed",
    signature: [0x49, 0x53, 0x63, 0x28],
  },
  {
    ext: "crx",
    mime: "application/x-google-chrome-extension",
    signature: [0x43, 0x72, 0x32, 0x34],
  },
  {
    ext: "nes",
    mime: "application/x-nintendo-nes-rom",
    signature: [0x4e, 0x45, 0x53, 0x1a],
  },
  {
    ext: "sqlite",
    mime: "application/x-sqlite3",
    signature: [
      0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61,
      0x74, 0x20, 0x33, 0x00,
    ],
  },
  {
    ext: "lz",
    mime: "application/x-lzip",
    signature: [0x4c, 0x5a, 0x49, 0x50],
  },
  {
    ext: "pcap",
    mime: "application/vnd.tcpdump.pcap",
    signature: [0xd4, 0xc3, 0xb2, 0xa1],
  },
  {
    ext: "pcap",
    mime: "application/vnd.tcpdump.pcap",
    signature: [0xa1, 0xb2, 0xc3, 0xd4],
  },
  {
    mime: "text/plain",
    ext: "txt",
    signature: [0xef, 0xbb, 0xbf],
  },
  {
    mime: "text/plain",
    ext: "txt",
    signature: [0xfe, 0xff],
  },
  {
    mime: "text/plain",
    ext: "txt",
    signature: [0xff, 0xfe],
  },
];

/**
 * @description 校验给出的字节数据是否符合某种MIME Type的signature
 * @param {Array} bufferss 字节数据
 * @param {Object} typeItem 校验项 { signature, offset  }
 */
const check = (bufferss: Buffer, { signature, offset = 0 }: any) => {
  for (let i = 0, len = signature.length; i < len; i++) {
    // 传入字节数据与文件signature不匹配
    // 需考虑有offset的情况以及signature中有值为undefined的情况
    if (bufferss[i + offset] !== signature[i] && signature[i] !== undefined)
      return false;
  }
  return true;
};

/**
 * @description 获取文件二进制数据
 * @param {File} file 文件对象实例
 * @param {Object} options 配置项，指定读取的起止范围
 */
const getArrayBuffer = (file: File, { start, end }: any) => {
  return new Promise((reslove, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const buffers = new Uint8Array(e.target.result);
        reslove(buffers);
      };
      reader.onerror = (err) => reject(err);
      reader.onabort = (err) => reject(err);
      reader.readAsArrayBuffer(file.slice(start, end));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description 获取文件的真实类型
 * @param {File} file 文件对象实例
 * @param {Object} options 配置项，指定读取的起止范围
 */
const getFileType = (file: File, options = { start: 0, end: 32 }) =>
  getArrayBuffer(file, options)
    .then((buffers: any) => {
      // 找出签名列表中定义好的类型，并返回
      for (let i = 0, len = signatureList.length; i < len; i++) {
        if (check(buffers, signatureList[i])) {
          const { mime, ext } = signatureList[i];
          return { mime, ext };
        }
      }
      // 未找到则返回file对象中的信息
      return { mime: file.type, ext: "" };
    })
    .catch((err) => err);

export default getFileType;

import axios from "axios";
import { ElMessage } from "element-plus";
// import store from '../store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    //
    // if (config.params.operateItemList) {

    // }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// request interceptor
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    if (!response) {
      // return res
      console.log("无数据返回");
      throw new Error("无数据返回");
    } else {
      return response.data;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    ElMessage({
      message: error.message,
      type: "error",
      duration: 3 * 1000,
      showClose: true,
    });
    return Promise.reject(error);
  }
);

function autoSend(config: any, retryTimes: any, resolve: any, reject: any) {
  service(config)
    .then((response: any) => {
      if (config.retry) {
        response.retry = retryTimes - config.retry;
      }
      resolve(response);
    })
    .catch((error) => {
      config.retry--;
      if (config.retry >= 0) {
        setTimeout(() => {
          autoSend(config, retryTimes, resolve, reject);
        }, 10);
      } else {
        error.retry = retryTimes;
        reject(error);
      }
    });
}

function Service(config: any) {
  return new Promise((resolve, reject) => {
    if (!config || !config.url) {
      reject({
        errorMsg: "请求对象不完整",
      });
    }
    if (!config.type) {
      config.type = "get";
    }

    if (!config.timeout) {
      config.timeout = 5000;
    }

    if (typeof config.retry != "number") {
      config.retry = 3;
    }

    autoSend(config, config.retry, resolve, reject);
  }).then((data) => {
    return data;
  });
}
export default Service;

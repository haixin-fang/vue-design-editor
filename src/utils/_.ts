export default {
  debounce(fn: () => any, wait: number) {
    let timer: any = null;
    return function () {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    };
  },
  deepClone(target: any) {
    // 定义一个变量
    let result: any;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === "object") {
      // 如果是一个数组的话
      if (Array.isArray(target)) {
        result = []; // 将result赋值为一个数组，并且执行遍历
        for (let i = 0; i < target.length; i++) {
          // 递归克隆数组中的每一项
          if (Object.prototype.hasOwnProperty.call(target, i)) {
            result.push(this.deepClone(target[i]));
          }
        }
        // 判断如果当前的值是null的话；直接赋值为null
      } else if (target === null) {
        result = null;
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
      } else if (target.constructor === RegExp) {
        result = target;
      } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
        result = {};
        for (const i in target) {
          if (Object.prototype.hasOwnProperty.call(target, i)) {
            result[i] = this.deepClone(target[i]);
          }
        }
      }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
      result = target;
    }
    // 返回最终结果
    return result;
  },
  isPromise(obj: any) {
    return (
      !!obj && //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
      (typeof obj === "object" || typeof obj === "function") && // 初始promise 或 promise.then返回的
      typeof obj.then === "function"
    );
  },
};

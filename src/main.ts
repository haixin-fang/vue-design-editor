import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./style.css";
import "./styles/index.scss";

import Popover from "@/common/popover.vue";
const app = createApp(App);

app.use(store).use(router).component("popover", Popover).mount("#app");

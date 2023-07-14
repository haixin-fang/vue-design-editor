import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Editor from "../page/editor.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Editor,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

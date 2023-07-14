import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import EditPage from "../page/editor-page.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: EditPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

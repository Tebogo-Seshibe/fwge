import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Editor from "../views/Editor.vue"
import SplashScreen from "../views/SplashScreen.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Editor,
  },
  {
    path: "/editor",
    name: "About",
    component: SplashScreen
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
 
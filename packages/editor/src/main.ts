import 'reflect-metadata'
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import {Person} from './models/Hello'
new Person('', '', 0)
createApp(App).use(store).use(router).mount("#app");

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import {interceptors} from './services/interceptors'

interceptors()
createApp(App).use(router).use(VueAxios,axios).mount('#app')

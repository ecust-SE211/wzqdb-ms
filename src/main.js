import {
	createApp
} from 'vue'
import App from './App.vue'
import router from './router'
// import {
// 	createStore
// } from 'vuex'
// import websocketModule from './store/websocket.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(router).use(ElementPlus).mount('#app')
// const store = createStore({
// 	modules: {
// 		websocket: websocketModule
// 	}
// })

// createApp(App).use(router).use(ElementPlus).use(store).mount('#app')
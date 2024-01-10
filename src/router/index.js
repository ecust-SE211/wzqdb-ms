import {
	createRouter,
	createWebHistory
} from 'vue-router'
const routes = [{
	path: '/',
	name: "主页",
	component: () => import('../views/indexPage.vue')
}, {
	path: '/studio',
	name: "工作页面",
	component: () => import('../views/mainPage.vue')
}]
const router = createRouter(({
	history: createWebHistory(),
	routes: routes
}))

export default router
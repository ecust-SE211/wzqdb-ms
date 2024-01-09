import {
	createRouter,
	createWebHistory
} from 'vue-router'
const pageModules = import.meta.glob('../views/**/page.js', {
	eager: true,
	import: 'default'
})
const compModules = import.meta.glob('../views/**/index.vue', {
	eager: true,
	import: 'default'
})
const routes = Object.entries(pageModules).map(([pagePath, config]) => {
	let path = pagePath.replace('../views', '').replace('/page.js', '')
	path = path || '/'
	const name = path.split('/').filter(Boolean).join('-') || 'index'
	const compPath = pagePath.replace('page.js', 'index.vue')
	return {
		path,
		name,
		component: () => compModules[compPath],
		meta: config
	}
})
console.log(routes)
const router = createRouter(({
	history: createWebHistory(),
	routes: routes
}))

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token');
	if (to.path !== '/login' && to.path !== '/register' && !token) {
		next('/login'); // 重定向到 login 页面
	} else {
		next(); // 继续路由导航
	}
});
export default router
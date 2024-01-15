<template>
	<el-container class="container">
		<el-aside class="aside">
			<el-scrollbar>
				<l-affix :offset="0">
					<router-link to="/">
						<el-button class="aside-header" type="primary" text>
							Close connect.
						</el-button>
					</router-link>
				</l-affix>
				<el-menu>
					<el-sub-menu v-for="(database,index_db) in databases" :index="index_db" :key="index_db"
						:db_name="database.name" :class="{'activate':database.is_activate}">
						<template #title>
							<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"
								data-v-ea893728="">
								<path fill="currentColor"
									d="m161.92 580.736 29.888 58.88C171.328 659.776 160 681.728 160 704c0 82.304 155.328 160 352 160s352-77.696 352-160c0-22.272-11.392-44.16-31.808-64.32l30.464-58.432C903.936 615.808 928 657.664 928 704c0 129.728-188.544 224-416 224S96 833.728 96 704c0-46.592 24.32-88.576 65.92-123.264z">
								</path>
								<path fill="currentColor"
									d="m161.92 388.736 29.888 58.88C171.328 467.84 160 489.792 160 512c0 82.304 155.328 160 352 160s352-77.696 352-160c0-22.272-11.392-44.16-31.808-64.32l30.464-58.432C903.936 423.808 928 465.664 928 512c0 129.728-188.544 224-416 224S96 641.728 96 512c0-46.592 24.32-88.576 65.92-123.264z">
								</path>
								<path fill="currentColor"
									d="M512 544c-227.456 0-416-94.272-416-224S284.544 96 512 96s416 94.272 416 224-188.544 224-416 224m0-64c196.672 0 352-77.696 352-160S708.672 160 512 160s-352 77.696-352 160 155.328 160 352 160">
								</path>
							</svg>
							<span style="margin-left: 0.25rem;">{{database.name}}</span>
						</template>
						<el-menu-item v-for="(table,index_tb) in database.tables" :index="`${index_db}-${index_tb}`"
							@click="select(index_db,index_tb)" :key="index_tb" style="height: 2rem;">
							<svg class="icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
								style="enable-background:new 0 0 1024 1024;" viewBox="0 0 1024 1024" data-v-ea893728="">
								<path fill="currentColor"
									d="M480 320h192c21.33 0 32-10.67 32-32s-10.67-32-32-32H480c-21.33 0-32 10.67-32 32s10.67 32 32 32">
								</path>
								<path fill="currentColor"
									d="M887.01 72.99C881.01 67 873.34 64 864 64H160c-9.35 0-17.02 3-23.01 8.99C131 78.99 128 86.66 128 96v832c0 9.35 2.99 17.02 8.99 23.01S150.66 960 160 960h704c9.35 0 17.02-2.99 23.01-8.99S896 937.34 896 928V96c0-9.35-3-17.02-8.99-23.01M192 896V128h96v768zm640 0H352V128h480z">
								</path>
								<path fill="currentColor"
									d="M480 512h192c21.33 0 32-10.67 32-32s-10.67-32-32-32H480c-21.33 0-32 10.67-32 32s10.67 32 32 32m0 192h192c21.33 0 32-10.67 32-32s-10.67-32-32-32H480c-21.33 0-32 10.67-32 32s10.67 32 32 32">
								</path>
							</svg>
							<span style="margin-left: 0.25rem;">{{table.name}}</span>
						</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</el-scrollbar>
		</el-aside>
		<el-container>
			<el-header>Header</el-header>
			<el-main class="main">
				<el-tabs v-model="selectedTab" type="card" closable>
					<el-tab-pane v-for="(item,index) in tabs" :key="index" :label="item.title">
						<div>

						</div>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
	import {
		ElMessage
	} from 'element-plus';
	import {
		ref,
		onMounted,
		reactive
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	// 验证路由
	const route = useRoute()
	const router = useRouter();
	const connectName = route.params.connectName;
	const recentConnect = JSON.parse(localStorage.getItem(connectName))
	recentConnect.date = Date.now();
	if (recentConnect == null) {
		ElMessage.error('Unknown Connect.')
		router.push('/')
	} else {
		localStorage.setItem(connectName, JSON.stringify(recentConnect))
	}
	// 数据库信息获取
	const databases = reactive([])
	var db_dic = {}
	console.log(databases[0]);
	const loadDataBase = (index) => {
		databases[index].tables = [{
			name: "table-1"
		}, {
			name: "table-2"
		}, {
			name: "table-3"
		}]
		databases[index].is_activate = true;
		return true
	}
	const getDataBases = async () => {
		const rspn = `["user","other","unOpened"]`;
		const database_names = JSON.parse(rspn);
		databases.splice(0, databases.length)
		for (const database_name of database_names) {
			databases.push({
				name: database_name,
				is_activate: false
			})
		}
		console.log(JSON.parse(rspn))
	}
	// 选择具体的表
	const current_table = ref()
	const selectedTab = ref()
	const tabs = reactive([{
		title: "tab-1",
		type: "1",
		data: {

		}
	}, {
		title: "tab-2",
		type: "2",
		data: {}
	}])
	const select = (index_db, index_tb) => {
		index_db = parseInt(index_db)
		index_tb = parseInt(index_tb)
		alert(databases[index_db].tables[index_tb].name)
		current_table.value = databases[index_db].tables[index_tb].name
	}
	onMounted(async () => {
		await getDataBases();

		const dbBtns = document.querySelectorAll(".el-sub-menu");
		for (const dbBtn of dbBtns) {
			db_dic[dbBtn.getAttribute('db_name')] = dbBtn;
		}

		function createClickHandler(index, element) {
			function clickHandler() {
				if (loadDataBase(index))
					element.removeEventListener('click', clickHandler);
			}
			return clickHandler;
		}
		for (let i = 0; i < dbBtns.length; i++) {
			const clickHandler = createClickHandler(i, dbBtns[i])
			dbBtns[i].addEventListener("click", clickHandler)
		}
	})
</script>

<style>
	.aside {
		width: 10rem;
		background-color: #ffffff;
		box-shadow: 0 0 0.5rem #888;
		filter: drop-shadow(0 0 0.5rem #eee);
	}

	.aside-header {
		display: flex;
		height: 2rem;
		border: none;
		border-radius: 0;
		width: 100%;
		align-items: center;
		flex-direction: column;
		justify-content: space-around;
	}

	.aside .el-sub-menu.activate>* {
		color: var(--el-color-success);
	}

	.aside .el-menu {
		border: none;
	}

	.main {
		padding: 0;
	}

	.el-tabs__nav {
		background: #fff;
	}

	.el-tabs__item {
		height: 2rem;
	}

	.el-tabs--card>.el-tabs__header {
		margin: 0;
		height: 2rem;
	}

	.el-tabs__content {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
</style>
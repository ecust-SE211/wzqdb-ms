<template>
	<el-container class="container">
		<el-aside class="aside">
			<el-scrollbar>
				<div>
					<router-link to="/">
						<el-button class="aside-header" type="primary" text>
							Close connect.
						</el-button>
					</router-link>
				</div>
				<el-menu>
					<el-sub-menu v-for="(database,index_db) in databases" :index="`${index_db}`" :key="index_db"
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
							@click="select(index_db,index_tb)" @mousedown="clickTable($event,index_db,index_tb)"
							:key="index_tb" style="height: 2rem;">
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
		<el-container style="border-left: 1px solid #e4e7e4;">
			<el-header class="tools">Header</el-header>
			<el-main class="main">
				<el-tabs v-model="selectedTab" type="card" closable>
					<el-tab-pane v-for="(item,index) in tabs" :key="index" :label="item.title">
						<div v-if="item.type==1">
							<!-- <el-table :data="viewTableData">
								<el-table-column v-for="(prop,index_p) of item.column" :key="index_p"
									:label="prop"></el-table-column>
							</el-table> -->
						</div>
						<div v-if="item.type==2">

						</div>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</el-container>
	<div class="rightClick_menu" :style="{top:`${tPosition}px`,left:`${lPosition}px`}" v-show="showRightClickMenu">
		<div @click="viewTable()">
			<el-text>View Tabel</el-text>
		</div>
		<div @click="altTable()">
			<el-text>Edit Table</el-text>
		</div>
		<div @click="newTable()">
			<el-text>New Table</el-text>
		</div>
		<div @click="dropTable()">
			<el-text>Drop Table</el-text>
		</div>
	</div>
</template>

<script setup>
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus';
	import {
		ref,
		onMounted,
		// computed,
		reactive
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import axios from '../axios.js'
	// 验证路由
	const route = useRoute()
	const router = useRouter();
	const connectName = route.params.connectName;
	const recentConnect = JSON.parse(localStorage.getItem(connectName))
	const sqlRequest = async (sql) => {
		try {
			console.log(sql)
			const response = await axios.post(`http://${recentConnect.url}/sql/execute`, {
				sql: sql
			}, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return response.data; // 返回异步请求的数据
		} catch (error) {
			alert(error); // 捕获错误并进行处理
			return null; // 或者返回一个默认值
		}
	};
	recentConnect.date = Date.now();
	if (recentConnect == null) {
		ElMessage.error('Unknown Connect.')
		router.push('/')
	} else {
		localStorage.setItem(connectName, JSON.stringify(recentConnect))
	}
	// 数据库信息获取
	const databases = reactive([])
	var db_dic = {};
	const getDataBases = async () => {
		let rspn = await sqlRequest("show databases;");
		if (rspn == null) {
			return;
		}
		rspn = rspn.split('\n')
		const database_names = rspn.filter(item => item !== '');
		databases.splice(0, databases.length)
		for (const database_name of database_names) {
			databases.push({
				name: database_name,
				is_activate: false
			})
		}
	}
	const loadDataBase = (index) => {
		sqlRequest(`use database ${databases[index].name};`);
		let rspn = await sqlRequest("show tables;");
		if (rspn == null) {
			return;
		}
		rspn = rspn.split('\n')
		const table_names = rspn.filter(item => item !== '')
		databases[index].tables = [{
			name: "table-1",
			column: [{
				name: "id",
				type: "int",
				primary_key: true
			}, {
				name: "name",
				type: "string",
				primary_key: false
			}],
			is_activate: false,
			data: []
		}, {
			name: "table-2",
			column: [{
				name: "id",
				type: "int",
				primary_key: true
			}, {
				name: "name",
				type: "string",
				primary_key: false
			}],
			is_activate: false,
			data: []
		}, {
			name: "table-3",
			column: [{
				name: "id",
				type: "int",
				primary_key: true
			}, {
				name: "name",
				type: "string",
				primary_key: false
			}]
		}]
		databases[index].is_activate = true;
		return true
	}
	// 选择具体的表
	/**type:
	 * 1: 查看表
	 * 2: 新建表
	 * 3: 编辑表 (弃用)
	 */
	const current_table = ref()
	const selectedTab = ref()
	const tabs = reactive([{
		title: "Show table-1",
		type: "1",
		database_name: "user",
		table_name: "table-1",
		data: {
			column: [{
				name: "id",
				type: "int",
				primary_key: true
			}, {
				name: "name",
				type: "string",
				primary_key: false
			}],
			initialValue: [{
				id: 1,
				name: "王占全"
			}, {
				id: 2,
				name: "王维佳"
			}],
			update: [{
				index: 1,
				alterations: {
					name: "王唯佳"
				}
			}],
			new: [{
				id: 3,
				name: "张小勤"
			}]
		}
	}, {
		title: "tab-2",
		type: "2",
		database_name: "user",
		table_name: "table-1",
		data: {
			column: [{
				name: "id",
				type: "int",
				primary_key: true
			}, {
				name: "name",
				type: "string",
				primary_key: false
			}],
		}
	}])
	// const viewTableData = computed(() => {
	// 	let data = tabs[selectedTab].data;
	// 	let tableData = data.initialValue;
	// 	for (const changeInfo of tableData.update) {
	// 		for (const attr of Object.keys(changeInfo.alterations)) {
	// 			tableData[changeInfo.index] = changeInfo.alterations[attr];
	// 		}
	// 	}
	// 	tableData.push([...tableData.new]);
	// 	return tableData;
	// })
	// const x = ref()
	// const createViewTableData = (table) => {
	// 	return computed(() => {
	// 		x.value * num
	// 	})
	// }
	const select = (index_db, index_tb) => {
		index_db = parseInt(index_db)
		index_tb = parseInt(index_tb)
		current_table.value = databases[index_db].tables[index_tb].name
	}
	// 右键表
	const showRightClickMenu = ref(false);
	const tPosition = ref(0)
	const lPosition = ref(0)
	var rightClickTable = ""
	const clickTable = (event, index_db, index_tb) => {
		if (event.button != 2) return;
		index_db = parseInt(index_db)
		index_tb = parseInt(index_tb)
		rightClickTable = databases[index_db].tables[index_tb].name
		showRightClickMenu.value = true
		tPosition.value = event.clientY;
		lPosition.value = event.clientX;
	}
	const newTable = () => {
		tabs.push({
			title: "New Table"
		})
	}
	const altTable = () => {
		tabs.push({
			title: `Edit ${rightClickTable}`
		})
	}
	const viewTable = () => {
		tabs.push({
			title: `View ${rightClickTable}`
		})
	}
	const dropTable = () => {
		ElMessageBox.confirm(
				"This operation will permanently delete the table, continue?", 'Confirm', {
					confirmButtonText: 'OK',
					cancelButtonText: 'Cancel',
					type: 'warning',
					center: true,
				}
			)
			.then(() => {
				ElMessage({
					type: 'success',
					message: 'Delete completed',
				})
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: 'Delete canceled',
				})
			})
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
		window.addEventListener('click', () => {
			showRightClickMenu.value = false;
		})
	})
</script>

<style>
	.aside {
		width: 10rem;
		background-color: #ffffff;
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

	.tools {
		height: 5rem;
		background-color: #fffa;
	}

	.main {
		padding: 0;
	}

	.el-tabs__nav-scroll {
		transform: translateY(-1px);
	}

	.el-tabs--card>.el-tabs__header .el-tabs__nav.is-top {
		border-color: transparent;
	}

	.el-tabs__item {
		height: 2rem;
	}

	.el-tabs--card>.el-tabs__header .el-tabs__item.is-closable:first-child {
		border-top-left-radius: 0.5rem;
		border-left: 1px solid #e4e7e4;
	}

	.el-tabs--card>.el-tabs__header .el-tabs__item.is-closable:last-child {
		border-top-right-radius: 0.5rem;
		border-right: 1px solid #e4e7e4;
	}

	.el-tabs--card>.el-tabs__header .el-tabs__item.is-closable {
		border-bottom: 1px solid #fff;
		border-top: #e4e7ed 1px solid;
		background-color: #fff;
	}

	.el-tabs--card>.el-tabs__header .el-tabs__item.is-closable:not(.is-active) {
		border-bottom: 1px solid transparent;
	}

	.el-tabs--card>.el-tabs__header {
		margin: 0;
		height: 2rem;
	}

	.el-tabs__content {
		width: 100%;
		height: calc(100vh - 7rem);
		background-color: #fff;
	}

	.rightClick_menu {
		width: 8rem;
		position: absolute;
		display: block;
		background-color: #fff;
		filter: drop-shadow(0.1rem 0.1rem 0.125rem #aaa);
		box-sizing: border-box;
		border-radius: 0.2rem;
		padding: 0.5rem 0;
	}

	.rightClick_menu>div {
		width: 8rem;
		height: 1.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
	}

	.rightClick_menu>div {
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.rightClick_menu>div:hover {
		background-color: #d9ecff;
	}

	.rightClick_menu>div+div {}
</style>
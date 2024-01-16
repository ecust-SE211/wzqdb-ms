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
					<el-button class="aside-header" type="primary" text @click="getDataBases()">
						Refresh databases.
					</el-button>
				</div>
				<el-menu default-active="">
					<el-sub-menu v-for="(database,index_db) in databases" :index="`${index_db}`" :key="index_db"
						:db_name="database.name" :class="{'activate':database.is_activate}"
						@click="clickHandler(index_db)()">
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
							@click="select(index_db,index_tb)" @mouseup="clickTable($event,index_db,index_tb)"
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
							<span style="margin-left: 0.25rem;">{{table.tableName}}</span>
						</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</el-scrollbar>
		</el-aside>
		<el-container style="border-left: 1px solid #e4e7e4;">
			<el-header class="tool_bar">
				<el-button :icon="CircleCheck" type="primary" plain @click="submit" :disabled="!tabsValue">
					Submit</el-button>
				<el-button :icon="Refresh" type="primary" plain @click="refresh" :disabled="!tabsValue">
					Refresh</el-button>
				<el-button :icon="EditPen" type="primary" plain @click="createSql">
					Sql Query</el-button>
			</el-header>
			<el-main class="main">
				<el-tabs v-model.lazy="tabsValue" type="card" closable @tab-remove="removeTab">
					<el-tab-pane v-for="(tab,index_tab) in tabs" :key="index_tab" :label="tab.title" :name="tab.title">
						<el-scrollbar style="height: calc(100vh - 5rem); padding:1rem;">
							<div v-if="tab.type==1">
								<el-table :data="viewTableData[tab.title]" border>
									<el-table-column
										v-for="(prop,index_p) of databases[db_dic[tab.database_name]].tables[tb_dic[tab.database_name][tab.table_name]].columns"
										:key="index_p" :label="prop.columnName" :type="prop.columnType">
										<template #header>
											<el-text>{{prop.columnName}}</el-text>
											<el-text style="margin-left: 0.25rem;"
												type="success">({{prop.columnType}})</el-text>
										</template>
										<template #default="scope">
											<el-text v-if="prop.isPrimaryKey" type="primary"
												@mouseup="clickValue($event,index_tab,scope.$index,scope.column.label,scope.column.type)">{{scope.row[prop.columnName]}}</el-text>
											<el-text v-else
												@mouseup="clickValue($event,index_tab,scope.$index,scope.column.label,scope.column.type)">{{scope.row[prop.columnName]}}</el-text>
										</template>
									</el-table-column>
								</el-table>
							</div>
							<div v-if="tab.type==2">

							</div>
							<div class="sql-tab" v-if="tab.type==3">
								<el-input v-model="sqlInput" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"
									:parser="(value) => value.replace(/\n[\s]*\n/g, '\n')">
								</el-input>
								<div v-if="!sqlRunning">
									<el-button :disabled="!sqls" @click="runFullSql()" :icon="SwitchButton"
										type="primary" plain>Run Sqls.</el-button>
								</div>
								<div v-else>
									<el-button :disabled="!sqls" @click="sqlRunning = false" :icon="SwitchButton"
										type="danger" plain>Stop!</el-button>
								</div>
								<div class="sql-block" v-for="(sql,index) in sqls" :key="index">
									<el-button @click="runSql(index,sql)" :type="sqlType[index]">{{sql}}</el-button>
									<div>
										<el-text plain type="info">{{sqlResult[index]}}</el-text>
									</div>

								</div>
							</div>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</el-container>
	<div class="rightClick_menu" :style="{top:`${tPosition}px`,left:`${lPosition}px`}" v-show="showTableMenu">
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
	<div class="rightClick_menu" :style="{top:`${tPosition}px`,left:`${lPosition}px`}" v-show="showValueMenu">
		<div @click="editValue()">
			<el-text>Edit Value</el-text>
		</div>
		<div @click="restoreValue()">
			<el-text>Restore Value</el-text>
		</div>
		<div @click="refresh()">
			<el-text>Refresh</el-text>
		</div>
	</div>
</template>

<script setup>
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus';
	import {
		debounce,
		isNull
	} from 'lodash';
	import {
		ref,
		onMounted,
		computed,
		reactive
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		CircleCheck,
		Refresh,
		EditPen,
		SwitchButton
	} from '@element-plus/icons-vue'
	import axios from '../axios.js'
	// 验证路由
	const route = useRoute()
	const router = useRouter();
	const connectName = route.params.connectName;
	const recentConnect = JSON.parse(localStorage.getItem(connectName))
	const sqlRequest = async (sql) => {
		const response = await axios.post(`http://${recentConnect.url}/sql/execute`, JSON.stringify({
			sql: sql
		}), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.data; // 返回异步请求的数据
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
	var tb_dic = {};
	const setDic = () => {
		db_dic = {}
		tb_dic = {}
		for (let i = 0; i < databases.length; i++) {
			const database = databases[i]
			db_dic[database.name] = i
			if (database.is_activate) {
				let temp_dic = {}
				for (let j = 0; j < database.tables.length; j++) {
					temp_dic[database.tables[j].tableName] = j
				}
				tb_dic[database.name] = temp_dic
			}
		}
	}
	const getDataBases = async () => {
		let rspn = await sqlRequest("show databases;");
		if (rspn == null) {
			ElMessage({
				type: "error",
				message: "Load databases fail."
			})
			return;
		}
		rspn = rspn.split('\n')
		const database_names = rspn.filter(item => item !== '');
		console.log(databases)
		databases.splice(0, databases.length)
		console.log(databases)
		for (const database_name of database_names) {
			databases.push({
				name: database_name,
				is_activate: false
			})
		}
		console.log(databases)
		setDic();
		ElMessage({
			type: "success",
			message: "Load databases completed."
		})
	}
	const loadDataBase = async (index) => {
		try {
			const response = await axios.get(`http://${recentConnect.url}/sql/${databases[index].name}`)
			databases[index].tables = response.data
		} catch (error) {
			alert(error); // 捕获错误并进行处理
			return false
		}
		for (let i = 0; i < databases[index].tables.length; i++) {
			databases[index].tables[i].is_activate = false;
			databases[index].tables[i].data = [];
		}
		databases[index].is_activate = true;
		setDic();
		return true
	}
	// 选择具体的表
	/**type:
	 * 1: 查看表
	 * 2: 新建表
	 * 3: 编辑表 (弃用)
	 */
	const current_table = ref()
	const tabsValue = ref()
	const tabs = ref([])
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
	const removeTab = (targetName) => {
		console.log(targetName)
		const tabs_copy = tabs.value;
		let activeName = tabsValue.value;
		if (activeName === targetName) {
			tabs_copy.forEach((tab, index) => {
				if (tab.title === targetName) {
					const nextTab = tabs_copy[index + 1] || tabs_copy[index - 1];
					if (nextTab) {
						activeName = nextTab.title;
					} else {
						activeName = null
					}
				}
			})
		}
		tabsValue.value = activeName
		tabs.value = tabs_copy.filter((tab) => tab.title !== targetName)
	}
	const select = (index_db, index_tb) => {
		index_db = parseInt(index_db)
		index_tb = parseInt(index_tb)
		current_table.value = databases[index_db].tables[index_tb].name
	}
	// 右键表
	const showTableMenu = ref(false);
	const tPosition = ref(0)
	const lPosition = ref(0)
	var rightClickDatabase = ""
	var rightClickTable = ""
	const clickTable = (event, index_db, index_tb) => {
		if (event.button != 2) return;
		event.stopPropagation();
		index_db = parseInt(index_db)
		index_tb = parseInt(index_tb)
		rightClickDatabase = databases[index_db].name
		rightClickTable = databases[index_db].tables[index_tb].tableName
		showValueMenu.value = false;
		showTableMenu.value = true
		tPosition.value = event.clientY;
		lPosition.value = event.clientX;
	}

	const newTable = () => {
		tabs.value.push({
			title: "New Table"
		})
	}
	const altTable = () => {
		tabs.value.push({
			title: `Edit ${rightClickTable}`
		})
	}
	const reloadTable = async (db_index, tb_index) => {
		try {
			const response = await axios.get(
				`http://${recentConnect.url}/sql/${rightClickDatabase}/${rightClickTable}`)
			databases[db_index].tables[tb_index].data = response.data
			databases[db_index].tables[tb_index].is_activate = true
			return true
		} catch (error) {
			alert(error); // 捕获错误并进行处理
			return false
		}
	}
	const viewTable = async () => {
		let db_index = db_dic[rightClickDatabase];
		let tb_index = tb_dic[rightClickDatabase][rightClickTable];
		if (!databases[db_index].tables[tb_index].is_activate) {
			if (!await reloadTable(db_index, tb_index)) {
				new Error("Get TableData fail.")
				return;
			}
		}
		const tabs_ = tabs.value;
		let title = `View ${rightClickTable}`
		for (let i = 0; i < tabs_.length; i++) {
			if (tabs_[i].title == title) {
				tabsValue.value = title;
				return
			}
		}
		tabs.value.push({
			title: `View ${rightClickTable}`,
			type: '1',
			database_name: rightClickDatabase,
			table_name: rightClickTable,
			data: {
				update: [],
				new: []
			}
		})
		tabsValue.value = title;
	}
	const viewTableData = computed(() => {
		let tableData = {}
		for (const tab of tabs.value) {
			if (tab.type != "1")
				continue;
			let originalData = databases[db_dic[tab.database_name]].tables[tb_dic[tab.database_name][tab
				.table_name
			]].data;
			let data = JSON.parse(JSON.stringify(originalData))
			for (const changedData of tab.data.update) {
				for (const key of Object.keys(changedData.data)) {
					data[changedData.index][key] = `*${changedData.data[key]}`;
				}
				for (const newData of tab.data.new) {
					data.push(newData)
				}
			}
			tableData[tab.title] = data
		}
		return tableData
	})
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
				try {
					sqlRequest(`use database ${rightClickDatabase};`)
					sqlRequest(`drop table ${rightClickTable};`)
				} catch (e) {
					ElMessage({
						type: 'error',
						message: 'Bad Network',
					})
					return
				}
				ElMessage({
					type: 'success',
					message: 'Delete completed',
				})
				databases[db_dic[rightClickDatabase]].tables.splice(tb_dic[rightClickDatabase][rightClickTable], 1)
				setDic()
			})
	}
	// 右键值
	const showValueMenu = ref(false)
	var rightClickTab = ""
	var rigthClickRow = ""
	var rightClickLabel = ""
	var rightClickType = ""
	const clickValue = (event, index_tab, index_row, label, type) => {
		if (event.button != 2 && event.button != 0) return;
		event.stopPropagation();
		rightClickTab = parseInt(index_tab)
		rigthClickRow = parseInt(index_row)
		rightClickLabel = label
		rightClickType = type
		showTableMenu.value = false;
		showValueMenu.value = true;
		tPosition.value = event.clientY;
		lPosition.value = event.clientX;
	}
	const editValue = () => {
		let inputPattern = /^[\S\s]*$/;
		if (rightClickType == "int") {
			inputPattern = /^([1-9][0-9]*|0)$/
		} else {
			let ans = rightClickType.match(/^varchar\(([1-9][0-9]*|0)\)$/)
			if (!isNull(ans)) {
				inputPattern = new RegExp(`^[\\S\\s]{0,${ans[1]}}$`);
			}
		}
		ElMessageBox.prompt(
				`Please input new value for ${rightClickLabel}`, "Edit Value", {
					confirmButtonText: 'OK',
					cancelButtonText: 'Cancel',
					inputPattern: inputPattern,
					inputErrorMessage: 'Invalid Value',
				}).then(({
				value
			}) => {
				let update_copy = tabs.value[rightClickTab].data.update
				for (let i = 0; i < update_copy.length; i++) {
					if (update_copy[i].index == rigthClickRow) {
						tabs.value[rightClickTab].data.update[i].data[rightClickLabel] = value;
						return true;
					}
				}
				let temp = {
					index: rigthClickRow,
					data: {}
				}
				temp.data[rightClickLabel] = value;
				tabs.value[rightClickTab].data.update.push(temp);
			})
			.catch(error => console.log(error))
	}
	const restoreValue = () => {
		let updata_copy = tabs.value[rightClickTab].data.update
		for (let i = 0; i < updata_copy.length; i++) {
			if (updata_copy[i].index == rigthClickRow) {
				delete tabs.value[rightClickTab].data.update[i].data[rightClickLabel]
			}
		}
	}
	const refresh = () => {
		let tab_index = -1;
		for (let i = 0; i < tabs.value.length; i++) {
			if (tabs.value[i].title == tabsValue.value) {
				tab_index = i;
				break;
			}
		}
		try {
			let tab = tabs.value[tab_index]
			reloadTable(db_dic[tab.database_name], tb_dic[tab.database_name][tab.table_name]);
		} catch (e) {
			ElMessage({
				type: "error",
				message: "Get table data fail."
			})
		}
		tabs.value[tab_index].data = {
			update: [],
			new: []
		}

		// 重新加载数据库内容
	}
	const submit = () => {
		let tab_index = -1;
		for (let i = 0; i < tabs.value.length; i++) {
			if (tabs.value[i].title == tabsValue.value) {
				tab_index = i;
				break;
			}
		}
		console.log(tab_index)
		console.log(tabsValue.value)
		if (tab_index == -1) {
			throw new Error("Cannot find current tab.")
		}
		sqlRequest(`use database ${tabs.value[tab_index].database_name}`)
		const data_copy = tabs.value[tab_index].data;
		const dbName = tabs.value[tab_index].database_name;
		const tbName = tabs.value[tab_index].table_name
		for (let i = 0; i < data_copy.update.length; i++) {
			const update_data = data_copy.update[i];
			let requestData = JSON.stringify({
				dbName: dbName,
				tbName: tbName,
				updataIndex: update_data.index,
				updateKeyValue: update_data.data
			})
			axios.post(`http://${recentConnect.url}/sql/update`, requestData, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(rspn => {
				console.log(rspn.data)
			})
		}
		refresh();
	}
	// 自定义Sql:
	const sqlInput = ref(`show databases;
use database rjjsss;
show tables;
select * from rjj;`)
	const sqlResult = reactive({})
	const sqlType = reactive({})
	const sqlRunning = ref(false)
	const sqls = computed(() => {
		return sqlInput.value.match(/[^;]+;/g)
	})
	const createSql = () => {
		for (let i = 0; i < tabs.value.length; i++) {
			if (tabs.value[i].title == "Sql Query") {
				tabsValue.value = "Sql Query";
				return
			}
		}
		tabs.value.push({
			title: "Sql Query",
			type: "3",
		})
		tabsValue.value = "Sql Query";
	}
	const runFullSql = async () => {
		sqlRunning.value = true;
		Object.keys(sqlType).forEach(key => {
			delete sqlType[key]
		})
		for (let i = 0; i < sqls.value.length; i++) {
			if (sqlRunning.value) {
				await runSql(i, sqls.value[i])
			} else {
				sqlType[i] = "warning"
				break
			}
		}
		console.log(sqlType)
		sqlRunning.value = false;
	}
	const runSql = async (index, sql) => {
		sqlType[index] = "primary";
		delete sqlResult[index];
		try {
			const rspn = await sqlRequest(sql)
			sqlResult[index] = rspn
			sqlType[index] = "success"
		} catch (e) {
			sqlResult[index] = e.message
			sqlType[index] = "danger"
		}
	}
	const clickHandler = (index) => {
		return function() {
			if (!databases[index].is_activate) {
				loadDataBase(index)
			}
		}
	}
	onMounted(async () => {
		await getDataBases();

		window.addEventListener('mouseup', () => {
			showTableMenu.value = false;
			showValueMenu.value = false;
		})
		const _ResizeObserver = window.ResizeObserver;
		window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
			constructor(callback) {
				callback = debounce(callback, 16);
				super(callback)
			}
		}

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

	.tool_bar {
		height: 3rem;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
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
		border-bottom: 1px solid #e4e7e4;
	}

	.el-tabs--card>.el-tabs__header {
		margin: 0;
		height: 2rem;
	}

	.el-tabs__content {
		width: 100%;
		height: calc(100vh - 5rem);
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
		z-index: 99;
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

	.el-table {
		margin-top: 0.5rem;
	}

	.sql-tab>div {
		margin-top: 0.25rem;
	}

	.sql-block {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: flex-start;
	}

	.sql-block>div {
		margin-left: 0.25rem;
	}
</style>
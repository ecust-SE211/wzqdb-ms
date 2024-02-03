<template>
	<el-scrollbar class="container">
		<el-card shadow="hover" class="addItem"
			@click="new_connect_account= ``;new_connect_name = ``;new_connect_password =``;new_connect_url=`http://`;show_dialog = true;">
			<el-text class="icon-inline" type="primary" size="large">
				<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728="">
					<path fill="currentColor"
						d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-38.4 409.6H326.4a38.4 38.4 0 1 0 0 76.8h147.2v147.2a38.4 38.4 0 0 0 76.8 0V550.4h147.2a38.4 38.4 0 0 0 0-76.8H550.4V326.4a38.4 38.4 0 1 0-76.8 0v147.2z">
					</path>
				</svg>
				<span>CREATE NEW CONNECT</span>
			</el-text>
		</el-card>
		<el-card shadow="hover" class="connectItem" v-for="(item,index) in connects" :key="index"
			@mouseup="clickItem($event,index)">
			<div class="descriptions">
				<div><el-text type="primary" size="large">{{item.name}}</el-text></div>
				<div class="inlineB" :style="{width : descriptWidth}">
					<el-text>account: </el-text><el-text>{{item.account}}</el-text>
				</div>
				<div class="inlineB" :style="{width : descriptWidth}">
					<el-text>url: </el-text><el-text>{{item.url}}</el-text>
				</div>
			</div>
			<div class="operate">
				<el-button type="primary" plain @click="connect(item)">Open</el-button>
				<!-- <router-link :to="item.name"><el-button plain>Open</el-button></router-link> -->
				<el-button type="danger" plain @click="removeConnect(item.name)"
					style="margin-left: 1rem;">Remove</el-button>
			</div>
			<el-text type="info">{{new Date(item.date).toLocaleDateString()}}</el-text>
		</el-card>
		<div style="height: 1rem;width: auto;"></div>
	</el-scrollbar>
	<el-dialog v-model="show_dialog" width="600px" :style="{borderRadius:'10px'}">
		<template #header>
			<el-text type="primary">CREATE CONNECT</el-text>
		</template>
		<el-form label-position="left" label-width="6rem">
			<el-form-item label="NAME:">
				<el-input v-model="new_connect_name" placeholder="Short name to identify connect."></el-input>
			</el-form-item>
			<el-form-item label="URL:">
				<el-input v-model="new_connect_url" placeholder="Url for the target database."></el-input>
			</el-form-item>
			<el-form-item label="ACCOUNT:">
				<el-input v-model="new_connect_account"
					placeholder="Account used to log in to the target database."></el-input>
			</el-form-item>
			<el-form-item label="PASSWORD:">
				<el-input v-model="new_connect_password"
					placeholder="Password used to log in to the target database."></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span>
				<el-button @click="show_dialog = false;alt_connect = false">CANCEL</el-button>
				<el-button type="primary" @click="createConnect();">CONNECT</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import axios from '../axios.js'
	import throttle from 'lodash/throttle'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		useRouter
	} from 'vue-router'
	const router = useRouter()
	let connectNames = JSON.parse(localStorage.getItem('connects'))
	var newConnectNames = [];
	let connectTemp = [];
	if (connectNames != null) {
		newConnectNames = [...connectNames];
		for (let i = 0; i < connectNames.length; i++) {
			let connectInfo = JSON.parse(localStorage.getItem(connectNames[i]));
			if (connectInfo == null) {
				newConnectNames.splice(i, 1);
			} else {
				connectTemp.push(connectInfo);
			}
		}
		connectTemp.sort((a, b) => {
			return b.date - a.date;
		})
		localStorage.setItem('connects', JSON.stringify(newConnectNames));
	}

	const connects = ref([...connectTemp])
	const descriptWidth = ref('0px');
	const show_dialog = ref(false);
	const new_connect_name = ref('')
	const new_connect_url = ref('');
	const new_connect_account = ref('');
	const new_connect_password = ref('');
	const connect = (connectInfo) => {
		axios.post(`${connectInfo.url}/user/login`, JSON.stringify({
			username: connectInfo.account,
			password: connectInfo.password
		}), {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(rspn => {
			if (rspn.data) {
				ElMessage({
					type: "success",
					message: "Log in successed.",
					duration: 1000
				})
				router.push(`/${connectInfo.name}`)
				return
			}
			ElMessage.error("Log in failed.")
		}).catch(e => ElMessage.error(e.message))
	}
	const createConnect = () => {
		if (!alt_connect) {
			if (newConnectNames.includes(new_connect_name.value)) {
				ElMessage.error(`"${new_connect_name.value}" already taken.`)
				return;
			}
			let connectInfo = {
				name: new_connect_name.value,
				url: new_connect_url.value,
				account: new_connect_account.value,
				password: new_connect_password.value,
				date: Date.now()
			}
			localStorage.setItem(new_connect_name.value, JSON.stringify(connectInfo))
			connects.value = [connectInfo, ...connects.value]
			newConnectNames.push(new_connect_name.value);
			localStorage.setItem('connects', JSON.stringify(newConnectNames));
			show_dialog.value = false
		} else {
			if (newConnectNames.includes(new_connect_name.value) && new_connect_name.value != alt_connect_name) {
				ElMessage.error(`"${new_connect_name.value}" already taken.`)
				return;
			}
			removeConnect(alt_connect_name)
			let connectInfo = {
				name: new_connect_name.value,
				url: new_connect_url.value,
				account: new_connect_account.value,
				password: new_connect_password.value,
				date: Date.now()
			}
			localStorage.setItem(new_connect_name.value, JSON.stringify(connectInfo))
			connects.value = [connectInfo, ...connects.value]
			newConnectNames.push(new_connect_name.value);
			localStorage.setItem('connects', JSON.stringify(newConnectNames));
			show_dialog.value = false
			alt_connect = false;
		}
	}
	var alt_connect_name = ""
	var alt_connect = false
	const clickItem = (event, index) => {
		if (event.button != 2) return;
		alt_connect = true;
		const connect = connects.value[index];
		alt_connect_name = connect.name
		new_connect_account.value = connect.account;
		new_connect_password.value = connect.password;
		new_connect_url.value = connect.url;
		new_connect_name.value = connect.name;
		show_dialog.value = true;
	}
	const removeConnect = (remove_connect_name) => {
		if (alt_connect) {
			newConnectNames = newConnectNames.filter((item) => item != remove_connect_name);
			localStorage.removeItem(remove_connect_name)
			connectTemp = connectTemp.filter((item) => item.name != remove_connect_name)
			connects.value = [...connectTemp]
			localStorage.setItem('connects', JSON.stringify(newConnectNames));
			return
		}
		ElMessageBox.confirm(
				`"${remove_connect_name}" will be permanenttly removed. Continue?`,
				'warning', {
					confirmButtonText: 'OK',
					cancelButtonText: 'Cancel',
					type: 'warning',
				}
			)
			.then(() => {
				newConnectNames = newConnectNames.filter((item) => item != remove_connect_name);
				localStorage.removeItem(remove_connect_name)
				connectTemp = connectTemp.filter((item) => item.name != remove_connect_name)
				connects.value = [...connectTemp]
				localStorage.setItem('connects', JSON.stringify(newConnectNames));
				ElMessage({
					type: 'success',
					message: `"${remove_connect_name} has been removed.`,
				})
			}).catch(() => {
				ElMessage({
					type: 'info',
					message: 'Canceled.',
				})
			})
	}
	onMounted(() => {
		descriptWidth.value = `${window.innerWidth*0.45 - 135}px`
		const handleThrottledChangeSize = throttle(() => {
			descriptWidth.value = `${window.innerWidth*0.45 - 135}px`
		}, 100)
		window.addEventListener('resize', () => {
			handleThrottledChangeSize();
		})
	})
</script>

<style>
	.addItem {
		box-sizing: border-box;
		width: auto;
		margin: 1rem 1rem 0rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
	}

	.connectItem {
		box-sizing: border-box;
		width: auto;
		margin: 1rem 1rem 0rem 1rem;
		padding-bottom: 1rem;
	}

	.connectInfo {
		width: 30%;
		height: 100%;
		float: right;
	}

	.descriptions {
		float: left;
	}

	.inlineB {
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.operate {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		float: right;
	}
</style>
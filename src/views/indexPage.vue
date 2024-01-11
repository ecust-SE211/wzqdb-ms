<template>
	<div class="container">
		<div class="connectTable">
			<div class="TableHead">
				<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728="">
					<path fill="currentColor"
						d="M256 128v698.88l196.032-156.864a96 96 0 0 1 119.936 0L768 826.816V128zm-32-64h576a32 32 0 0 1 32 32v797.44a32 32 0 0 1-51.968 24.96L531.968 720a32 32 0 0 0-39.936 0L243.968 918.4A32 32 0 0 1 192 893.44V96a32 32 0 0 1 32-32">
					</path>
				</svg>
				<span>CONNECT</span>
			</div>
			<el-scrollbar class="TableBody">
				<el-card shadow="hover" class="connectItem">
					<el-button>创建新连接</el-button>
				</el-card>
				<el-card shadow="hover" class="connectItem" v-for="(item,index) in connects" :key="index">
					<div class="descriptions">
						<div><el-text type="primary" size="large">{{item.title}}</el-text></div>
						<div class="inlineB" :style="{width : descriptWidth}">
							<el-text>username: </el-text><el-text>{{item.userName}}</el-text>
						</div>
						<div class="inlineB"  :style="{width : descriptWidth}">
							<el-text>url: </el-text><el-text>{{item.url}}</el-text>
						</div>
					</div>
					<div class="operate">
						<el-button plain>Open</el-button>
						<el-button plain>Remove</el-button>
					</div>
				</el-card>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	const connects = ref([{
		title: "001",
		userName: "root",
		url: "localhost:3306"
	}, {
		title: "002",
		userName: "",
		url: ""
	}, {
		title: "003",
		userName: "",
		url: ""
	}, {
		title: "004",
		userName: "",
		url: ""
	}, {
		title: "005",
		userName: "",
		url: ""
	}])
	const descriptWidth = ref('0px')
	onMounted(() => {
		const tableHead = document.getElementsByClassName('TableHead')[0];
		const tableDraw = document.getElementsByClassName('TableBody')[0];
		tableDraw.style.height = `${window.innerHeight - tableHead.offsetHeight * 3.75}px`
		descriptWidth.value = `${tableDraw.offsetWidth*0.3}px`
	})
</script>

<style>
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.connectTable {
		margin: 2rem 0;
		width: calc(80vw);
		max-width: 50rem;
		height: calc(100vh - 4rem);
		box-sizing: border-box;
		float: left;
		background-color: #fff;
		border-radius: 0.5rem;
	}

	.connectTable>* {
		box-sizing: border-box;
		padding: 0 1rem;
	}

	.TableHead {
		margin-top: 0.5rem;
		height: 2rem;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border-bottom: 1px solid #e4e7ed;
	}

	.TableHead>span {
		font-size: 1rem;
	}

	.TableBody {
		display: block;
		margin-bottom: 1rem;
		width: auto;
	}

	.connectItem {
		box-sizing: border-box;
		width: 100%;
		margin-top: 1rem;
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
	}

	.operate {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		float: right;
	}
</style>
<template>
	<div class="container">
		<el-scrollbar class="connectTable">
			<el-space direction="vertical">
				<el-card v-for="(item,index) in connects" :key="index">
					<template #header>
						{{item.title}}
					</template>
				</el-card>
			</el-space>
		</el-scrollbar>
		<el-card class="connectInfo" v-if="selectedDB">

		</el-card>
		<el-card class="connectInfo" v-else>
			<el-text>请选择数据库。</el-text>
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const connects = ref([{
		title: "001",
		userName: "",
		url: ""
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
	const selectedDB = ref()
</script>

<style>
	.container {
		padding: 1rem;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.scrollbar {
		width: auto;
		float: left;
	}

	.connectInfo {
		float: right;
	}
</style>
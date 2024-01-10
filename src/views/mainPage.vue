<template>
	<div>牢大</div>
</template>

<script setup>
	import {
		onMounted
	} from 'vue'
	import {
		useStore
	} from 'vuex'
	import {
		useRouter
	} from 'vue-router'
	const store = useStore();
	const router = useRouter();
	alert(route.params.dbName);
	if (store.state.websocket.socket == null) {
		router.push('/')
	}
	onMounted(() => {

	})
</script>

<style>
</style>
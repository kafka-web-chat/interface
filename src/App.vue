<template>
<v-app>
	<router-view></router-view>
	<alert-toast></alert-toast>
</v-app>
</template>

<script lang="ts">
import {
	Component,
	Watch,
	Vue
} from 'vue-property-decorator';


import router from '@/router'

@Component({})
export default class App extends Vue {
	@Watch('$store.state.connectedToBackend')
	onBackendStateChanges() {
		if (this.$store.state.connectedToBackend === false) {
			router.push({
				path: '/connect'
			})
		}
	}

	mounted() {
		console.log('mounted')
		this.onBackendStateChanges();
	}
}
</script>
<style style="sass">
html {
	overflow-y: auto !important;
}

::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-button {
	width: 0px;
	height: 0px;
}

::-webkit-scrollbar-thumb {
	background: var(--v-primary-base);
	border: 0px;
	border-radius: 0px;
}

::-webkit-scrollbar-corner {
	background: transparent;
}

.v-card {
	box-sizing: border-box;
}
</style>

<template>
<div class="at_container">
	<v-row align="end"
		justify="end">
		<v-col cols="2">
			<v-alert v-for="([i, data]) in $alertToast.notifications"
				:key="i"
				:type="data.type"
				text
				dismissible
				border="left"
				@input="close(i)">
				{{data.text}}
			</v-alert>
		</v-col>
	</v-row>
</div>
</template>
<script lang="ts">
import {
	Component,
	Vue
} from 'vue-property-decorator';

@Component({})
export default class AlertToast extends Vue {
	mounted() {
		this.$alertToast.linkedComponents.push(this);
	}

	close(key: number) {
		this.$alertToast.delete(key)
	}
}
</script>
<style>
.at_container {
	width: 100%;

	position: absolute;
	bottom: 0px;
}
</style>

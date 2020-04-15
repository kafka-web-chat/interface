<template>
<div class="at_container">
	<v-row align="end"
		justify="end">
		<v-col cols="2">
			<v-alert v-for="([i, data]) in $test.notifications"
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
	<!-- <v-alert v-for="(message, i) in $test.messages">{{message}}</v-alert> -->
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
		this.$test.linkedComponents.push(this);
	}

	close(key: number) {
		this.$test.delete(key)
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

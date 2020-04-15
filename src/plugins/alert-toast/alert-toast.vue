<template>
<div class="at_container"
	:transition="$alertToast._transition">
	<v-row align="end"
		justify="end">
		<v-col cols="2">
			<transition-group :mode="$alertToast._mode"
				:name="$alertToast._transition">
				<v-alert v-for="([i, data]) in $alertToast.notifications"
					:key="i"
					text
					dismissible
					border="left"
					transition="slide-x-reverse-transition"
					:type="data.type"
					@input="close(i)">
					{{data.text}}
				</v-alert>
			</transition-group>
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
	pointer-events: none;
	position: absolute;
	bottom: 0px;
}

.at_container .v-alert {
	pointer-events: all;
}
</style>

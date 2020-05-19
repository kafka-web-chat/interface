<template>
<div class="at_container"
	:transition="$alertToast._transition">
	<v-row align="end"
		justify="end">
		<v-col cols="2">
			<transition-group :mode="$alertToast._mode"
				:name="$alertToast._transition"
				:leave-active-class="`testing ${$alertToast._transition}-leave-active`">
				<v-alert v-for="([i, data]) in $alertToast.notifications"
					:key="i"
					:ref="i"
					dismissible
					prominent
					border="left"
					elevation="8"
					:type="data.type"
					@input="close(i)"
					style="">
					{{data.text}}
				</v-alert>
				<!-- :style="$alertToast.has(i) ? '' : 'position: absolute'"> -->

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
	// private isAbosolute
	mounted() {
		this.$alertToast.linkedComponents.push(this);
	}

	close(key: number, ) {

		const alertElement = ( < Vue[] > this.$refs[key])[0].$el;
		console.log(alertElement)
		// alertElement.style.position = 'absolute';

		this.$alertToast.delete(key)
		delete this.$refs[key];
	}
}
</script>
<style lang="scss">
.at_container {
    width: 100%;
    pointer-events: none;
    position: fixed;
    bottom: 0;
    z-index: 999;
    /* GG */
}

.at_container .v-alert {
    pointer-events: all;
    display: block !important;
}

.testing {
    // transform: translateY(30px);
    // transition: position 5s;
    // position: absolute;
}
</style>

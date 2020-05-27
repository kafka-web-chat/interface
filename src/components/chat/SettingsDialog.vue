<template>
<v-dialog width="500"
	v-model="dialogIsOpen">
	<v-card>
		<v-card-title>Settings</v-card-title>
		<v-card-text>
			<v-switch v-model="$vuetify.theme.dark"
				primary
				label="Dark Mode" />

			<!-- <v-color-picker v-model="$vuetify.theme.primary"></v-color-picker> -->
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="primary"
				text
				@click="$emit('close')">
				Close
			</v-btn>
		</v-card-actions>
	</v-card>
</v-dialog>
</template>

<script lang="ts">
import {
	Component,
	Prop,
	Vue
} from 'vue-property-decorator'

@Component({
	props: ['value'],
})

export default class SettingsDialog extends Vue {
	private value!: boolean;

	get dialogIsOpen() {
		return this.value
	}

	set dialogIsOpen(newValue) {
		this.$emit('input', newValue)
	}

}
</script>

<style>
.mdi-backup-restore {
	color: white !important;
}
</style>

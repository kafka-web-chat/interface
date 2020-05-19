<template>
<!-- <v-app> -->
<v-content>
	<v-container fluid
		fill-height>
		<v-layout align-center
			justify-center>
			<v-flex xs12
				sm8
				md6
				lg4>
				<v-card class="elevation-8">
					<v-toolbar color="primary"
						dark
						flat>
						<v-toolbar-title>Notification Test</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-card-text>
						<v-form>
							<v-row>
								<v-col cols="6">
									<v-select :items="['success', 'info', 'warning', 'error']"
										label="Type"
										v-model="type"
										:color="type"></v-select>

									<v-text-field label="Text"
										v-model="text"></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-select :items="['out-in', 'in-out']"
										label="Mode"
										v-model="$alertToast._mode"></v-select>
									<v-select :items="transitionList"
										label="Transition"
										v-model="$alertToast._transition"></v-select>
								</v-col>
								<v-col cols="5">
									<v-text-field type="number"
										label="Timeout"
										:disabled="!timeoutIsEnabled"
										v-model="timeout"></v-text-field>
								</v-col>
								<v-col cols="1">
									<v-checkbox v-model="timeoutIsEnabled"></v-checkbox>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary"
							@click="push">Push Notification</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</v-content>
<!-- </v-app> -->
</template>
<script lang="ts">
import {
	Component,
	Prop,
	Vue
} from 'vue-property-decorator';

import route from '@/router'

// __PluginInterface.

@Component({})
export default class App extends Vue {

	private type!: 'success' | 'info' | 'warning' | 'error';
	private text!: string;
	private timeout!: number;
	private timeoutIsEnabled!: boolean;

	private transitionList!: string[];


	public data() {
		return {
			type: 'success',
			text: 'This is a sample text',
			timeout: 0,
			timeoutIsEnabled: false,
			transitionList: [
				"fab-transition", "fade-transition", "expand-transition",
				"scale-transition", "scroll-x-transition", "scroll-x-reverse-transition",
				"scroll-y-transition", "scroll-y-reverse-transition", "slide-x-transition",
				"slide-x-reverse-transition", "slide-y-transition", "slide-y-reverse-transition"
			]
		}
	}

	public push() {
		console.log('Pushing')
		this.$alertToast.push({
			type: this.type,
			text: this.text,
			timeout: this.timeoutIsEnabled ?
				this.timeout : undefined
		})
	}

}
</script>

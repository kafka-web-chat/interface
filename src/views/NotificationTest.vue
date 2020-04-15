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
				lg3>
				<v-card class="elevation-8">
					<v-toolbar color="primary"
						dark
						flat>
						<v-toolbar-title>Connect to backend</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-card-text>
						<v-form>
							<v-row>
								<v-col cols="8">
									<v-select :items="['success', 'info', 'warning', 'error']"
										label="Type"
										:color="type"
										v-model="type"></v-select>

									<v-text-field label="Text"
										v-model="text"></v-text-field>
								</v-col>
								<v-col cols="7">
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

@Component({})
export default class App extends Vue {

	private type!: string;
	private text!: string;
	private timeout!: number;
	private timeoutIsEnabled!: boolean;

	public data() {
		return {
			type: 'success',
			text: 'This is a sample text',
			timeout: 0,
			timeoutIsEnabled: false,
		}
	}

	public push() {
		this.$test.push({
			type: this.type,
			text: this.text,
			timeout: this.timeoutIsEnabled ?
				this.timeout : undefined
		})
	}

}
</script>

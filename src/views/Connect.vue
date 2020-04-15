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
				<v-card class="elevation-8"
					:loading="isLoading"
					:disabled="isLoading">
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
									<v-text-field type="text"
										label="Host"
										prepend-icon="mdi-lan-connect"
										v-model="host"></v-text-field>
								</v-col>
								<v-col>
									<v-text-field type="number"
										label="Port"
										prepend-icon="mdi-unfold-less-horizontal"
										v-model="port"></v-text-field>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary"
							@click="connect">Connect</v-btn>
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

	private isLoading!: boolean;

	private host!: string;
	private port!: string;

	public data() {
		return {
			isLoading: false,
			host: '',
			port: ''
		}
	}

	public connect() {
		console.log('Connect')
		this.isLoading = true;

		setTimeout(() => {

			this.isLoading = false;

			if (this.host === 'lmn806.ddns.net' && this.port === '9091') {
				route.push({
					path: '/login'
				})
			}

		}, 1000)
	}
}
</script>

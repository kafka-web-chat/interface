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
				lg4
				xl3>
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
						<v-form ref="form">
							<v-row>
								<v-col>
									<v-combobox :items="['localhost', 'lmn806.ddns.net', 'test']"
										label="Host"
										prepend-icon="mdi-lan-connect"
										v-model="$store.state.connection.host"></v-combobox>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="6">
									<v-text-field type="number"
										label="HTTP Port"
										prepend-icon="mdi-unfold-less-horizontal"
										v-model="$store.state.connection.httpPort"></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field type="number"
										label="WebSocket Port"
										prepend-icon="mdi-unfold-less-horizontal"
										v-model="$store.state.connection.wsPort"></v-text-field>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<!-- <v-btn @click="reset">Reset</v-btn> -->
						<v-btn color="primary"
							:disabled="isLoading"
							@click="checkConnection">Ok</v-btn>
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

	public data() {
		return {
			isLoading: false,
		}
	}

	private get connection() {
		return this.$store.state.connection
	}

	public reset() {
		( < any > this.$refs.form).reset();
		( < any > this.$refs.form).resetValidation();
	}

	public async checkConnection() {
		this.isLoading = true;

		const fetchPromise = new Promise((resolve, reject) => {
			fetch(`${this.connection.httpURL}/check`)
				.then(response => resolve())
				.catch(error => {
					this.$alertToast.push({
						type: 'error',
						text: 'Error while trying to connect to http server',
						timeout: 3000
					});

					reject();
				})
		});

		const wsPromise = new Promise((resolve, reject) => {

			const url = `${this.connection.wsURL}/check`;
			const ws = new WebSocket(url);

			ws.addEventListener('open', () => {
				this.$alertToast.push({
					type: 'success',
					text: 'Connection opened',
					timeout: 3000
				});

				ws.close()
				resolve();
			});

			ws.addEventListener('error', (error) => {
				this.$alertToast.push({
					type: 'error',
					text: 'Error while trying to connect to WebSocket server',
					timeout: 3000
				})

				ws.close()
				reject();
			});
		});

		Promise.all([fetchPromise, wsPromise])
			.then(() => {
				route.push({
					path: '/login'
				})
			})
			.finally(() => {
				this.isLoading = false
			});
	}
}
</script>

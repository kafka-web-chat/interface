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
								<!-- :items="['lmn806.ddns.net', 'test']" -->
								<v-col cols="8">
									<!-- hide-no-data
									hide-selected -->
									<v-combobox :items="['localhost', 'lmn806.ddns.net', 'test']"
										label="Host"
										prepend-icon="mdi-lan-connect"
										v-model="host"></v-combobox>
									<!-- <v-text-field type="text"
										label="Host"
										prepend-icon="mdi-lan-connect"
										v-model="host"></v-text-field> -->
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
						<v-btn color="error"
							:disabled="isConnected === false">Disconnect</v-btn>
						<v-btn color="primary"
							:disabled="isConnected"
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
	private isConnected!: boolean;

	private host!: string;
	private port!: string;

	public data() {
		return {
			isLoading: false,
			isConnected: false,
			host: 'localhost',
			port: '49090'
		}
	}

	public connect() {
		console.log('Connect')
		this.isLoading = true;




		const url = `ws://${this.host}:${this.port}`;
		const ws = new WebSocket(url);

		ws.addEventListener('open', () => {
			this.isLoading = false;
			this.isConnected = true;

			this.$alertToast.push({
				type: 'success',
				text: 'Connection opened',
				timeout: 3000
			});

			route.push({
				path: '/login'
			})
		});

		ws.addEventListener('message', (event) => {
			try {

				const data = JSON.parse(event.data);

				if (data.type === 'notification') {
					this.$alertToast.push({
						type: 'info',
						text: < string > data.text,
						timeout: 3000
					})
				} else if (data.type === 'chat-message') {
					try {
						// {"plain":"ygyf","source":"client2","timestamp":1589461210950}
						let message = JSON.parse(data.text);

						if (this.$store.state.chatMessages[message.source] === undefined)
							this.$set(this.$store.state.chatMessages, message.source, [])

						this.$store.state.chatMessages[message.source].push({
							text: message.plain,
							timestamp: message.timestamp,
							received: true
						})
					} catch (e) {}

					console.log(this.$store.state.chatMessages)
				}
			} catch {
				console.error('Invalid json packet')
			}
		});

		ws.addEventListener('error', (error) => {
			this.$alertToast.push({
				type: 'error',
				text: 'Websocket: Error',
				timeout: 3000
			})

			console.log(error)

			if (ws.readyState === ws.CLOSED) {
				this.isLoading = false;
				this.isConnected = false;
			}
		})

		ws.addEventListener('close', (event) => {
			this.isLoading = false;
			this.isConnected = false;

			this.$alertToast.push({
				type: 'info',
				text: 'Websocket: Connection closed\nasdasdf',
				timeout: 3000
			})


			console.log(event)


			route.push({
				path: '/connect'
			})
		});

		// if (this.host === 'lmn806.ddns.net' && this.port === '9091') {
		// 	route.push({
		// 		path: '/login'
		// 	})
		//
		// 	this.$alertToast.push({
		// 		type: 'success',
		// 		text: 'Se ha conectado correctamente',
		// 		timeout: 5000
		//
		// 	})
		// } else {
		// 	this.$alertToast.push({
		// 		type: 'error',
		// 		text: 'Hubo un error al conectarse al servidor',
		// 		timeout: 5000
		// 	})
		// }

	}
}
</script>

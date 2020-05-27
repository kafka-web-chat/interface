<template>
<v-app>
	<v-app-bar app
		clipped-left>
		<v-toolbar-title>Chat</v-toolbar-title>
		<v-spacer />

		<!-- User drop menu -->
		<v-menu offset-y>
			<template v-slot:activator="{ on }">
				<v-btn icon
					v-on="on">
					<v-icon>mdi-account</v-icon>
				</v-btn>
			</template>

			<v-list>
				<v-list-item v-for="(item, index) in items"
					:key="index"
					@click="item.callback">
					<v-list-item-icon>
						<v-icon v-text="item.icon"></v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{ item.title }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>

	<v-navigation-drawer app
		permanent
		clipped
		:width="windowWidth * 0.25">

		<v-list>
			<v-list-item>
				<v-text-field append-icon="mdi-magnify"></v-text-field>

				<v-btn-toggle mandatory
					class="ml-5"
					v-model="selectedNavigationMode">
					<v-btn icon>
						<v-icon>mdi-message-text</v-icon>
					</v-btn>
					<v-btn icon>
						<v-icon>mdi-account-multiple</v-icon>
					</v-btn>
				</v-btn-toggle>

			</v-list-item>
		</v-list>

		<v-list class="mt-n2">
			<v-list-item-group active-class="deep-gray--text text--accent-4"
				v-model="selectedChat"
				mandatory
				v-if="selectedNavigationMode === 0">
				<p v-if="Object.keys(chatMessages).length === 0"
					class="text-center"
					style="margin-top: 10px">No chat messages :(</p>
				<v-list-item v-for="(messages, username) in chatMessages"
					:key="username"
					:value="username">

					<v-list-item-icon>
						<v-icon>mdi-account</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>
							{{ username }}

							<span class="grey--text text--lighten-1"
								v-if="messages.length > 0">
								{{getTimeFromTimestap(messages[messages.length - 1].timestamp)}}
							</span>
						</v-list-item-title>
						<v-list-item-subtitle v-if="messages.length > 0">
							{{messages[messages.length - 1].text}}

						</v-list-item-subtitle>
						<v-list-item-subtitle v-else>
							<i>No chat messages</i>
						</v-list-item-subtitle>

					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>

			<v-list-item-group active-class="deep-gray--text text--accent-4"
				v-else>
				<v-list-item key="-1"
					value="-1"
					@click="newContactDialogIsOpen = true">
					<v-list-item-icon>
						<v-icon>mdi-plus</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>Add new contact</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item v-for="(contact, i) in contacts"
					:key="i"
					:value="i">

					<v-list-item-icon>
						<v-icon>mdi-account</v-icon>
					</v-list-item-icon>

					<v-list-item-content @click="openChatWithContact(contact.username)">
						<v-list-item-title>{{ contact.username }}</v-list-item-title>
					</v-list-item-content>

					<v-list-item-action>
						<v-btn icon
							@click.stop="deleteContact(contact.username)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</v-list-item-action>


				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-navigation-drawer>

	<v-content>
		<!-- <v-container class="scrollable-content"> -->
		<v-row v-for="(data, i) in chatMessages[selectedChat]"
			:key="i"
			style="padding: 0px 10px; ">
			<v-col>
				<v-card color="primary"
					class="message-bubble"
					:style="{float: `${data.received === true ? 'left' : 'right'}`}">
					<v-card-text style="color: white">{{data.text}}</v-card-text>
					<v-card-actions style="color: white">
						<v-spacer />{{new Date(data.timestamp).toLocaleTimeString('es')}}</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<!-- </v-container> -->
	</v-content>
	<v-footer app
		inset>
		<v-text-field append-icon="mdi-send"
			:disabled="canSendMessages"
			@click:append="send"
			@keydown.enter="send"
			value=""
			v-model="message"></v-text-field>
	</v-footer>

	<KeyShareDialog v-model="keyShareDialogIsOpen" />

	<SettingsDialog v-model="settingsDialogIsOpen"
		@close="settingsDialogIsOpen = false" />

	<NewContactDialog v-model="newContactDialogIsOpen"
		@contactAdded="addContact" />
</v-app>
</template>
<script lang="ts">
import axios from 'axios';

import {
	Component,
	Watch,
	Vue
} from 'vue-property-decorator';

import route from '@/router';


import NewContactDialog from '@/components/chat/NewContactDialog.vue';
import SettingsDialog from '@/components/chat/SettingsDialog.vue';
import KeyShareDialog from '@/components/chat/KeyShareDialog.vue';




@Component({
	components: {
		NewContactDialog,
		SettingsDialog,
		KeyShareDialog
	}
})
export default class Chat extends Vue {

	private http: AxiosInstance = null;

	private items!: string[];

	private selectedNavigationMode!: number;

	private selectedChat!: string;
	private message!: string;

	private keyShareDialogIsOpen!: boolean;
	private settingsDialogIsOpen!: boolean;
	private newContactDialogIsOpen!: boolean;

	private ws: WebSocket | null = null;
	private windowWidth: number = 0;

	data() {
		return {
			items: [{
					title: 'Share key',
					icon: 'mdi-key-wireless',
					callback: () => {
						this.keyShareDialogIsOpen = true;
					}
				}, {
					title: 'Settings',
					icon: 'mdi-tune',
					callback: () => {
						this.settingsDialogIsOpen = true;
					}
				},
				{
					title: 'Log out',
					icon: 'mdi-logout',
					callback: () => {
						this.$vuetify.theme.dark = false;
						route.push({
							path: '/'
						})
					}
				},
			],
			selectedNavigationMode: null,
			selectedChat: null,
			message: "",

			keyShareDialogIsOpen: false,
			settingsDialogIsOpen: false,
			newContactDialogIsOpen: false,
		}
	}

	get connection() {
		return this.$store.state.connection;
	}

	get chatMessages() {
		return this.$store.state.chatMessages;
	}

	get contacts() {
		return this.$store.state.contacts
	}

	get canSendMessages(): boolean {
		return this.selectedChat === null || (this.userIsInContacts(this.selectedChat) === false)
	}

	public getTimeFromTimestap(timestamp: number) {
		return new Date(timestamp).toLocaleTimeString('es')
	}

	send() {
		if (this.message.length > 0 && this.selectedChat !== null) {

			const data = {
				text: this.message,
				timestamp: Date.now(),
				received: false
			};

			this.chatMessages[this.selectedChat].push({
				text: this.message,
				timestamp: Date.now(),
				received: false
			});

			if (this.ws === null)
				return

			this.ws.send(JSON.stringify({
				type: 'send-message',
				text: this.message,
				to: this.selectedChat
			}))

			this.message = '';
		}
	}

	public async getChatHistory() {
		const response: any = await this.http.get('/get/chat-history')
			.catch(err => {})

		if (response.data.success === false)
			throw new Error(response.data.error)

		return response.data.data
	}

	public async getContacts() {
		const response: any = await this.http.get('/get/contacts')
			.catch(err => {})

		if (response.data.success === false)
			throw new Error(response.data.error)

		return response.data.data
	}

	public async addContact(username: string, key: string) {
		this.newContactDialogIsOpen = false;

		const response: any = await this.http.post('/add/contact', {
			username: username,
			key: key,
		}).catch(err => {})

		if (response.data.success === false)
			throw new Error(response.data.error)

		this.contacts.push({
			username: username,
			key: key,
		})
	}

	public async deleteContact(username: string) {
		this.newContactDialogIsOpen = false;

		const response: any = await this.http.post(`/delete/contact/${username}`)
			.catch(err => {})

		if (response.data.success === false)
			throw new Error(response.data.error)

		for (let i = 0; i < this.contacts.length; i++) {
			const contact = this.contacts[i];

			if (contact.username == username) {
				this.contacts.splice(i, 1);
				break;
			}
		}
	}

	public openChatWithContact(username: string) {
		if (this.chatMessages[username] === undefined)
			this.$set(this.chatMessages, username, []);

		this.selectedNavigationMode = 0;
		this.selectedChat = username;
	}

	public userIsInContacts(username: string): boolean {
		return this.contacts.some((contact: any) =>
			contact.username == username
		);
	}

	public mounted() {

		this.windowWidth = window.innerWidth;

		this.$nextTick(() => {
			window.addEventListener('resize', this.onResize);
		})

		if (this.connection.token === null)
			return route.push({
				path: '/login'
			});

		this.http = axios.create({
			baseURL: this.connection.httpURL,
			headers: {
				'Authorization': this.connection.token
			}
		});;

		this.getContacts().then(contacts => {
			this.contacts.splice(0, this.contacts.length)
			this.contacts.push(...contacts)
		})

		const url = `${this.connection.wsURL}/${this.connection.token}`;
		this.ws = new WebSocket(url);

		this.ws.addEventListener('open', () => {
			this.$alertToast.pushDefault('success', 'Connection opened');
		});

		this.ws.addEventListener('message', (event) => {
			console.log('message', event.data)
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
						let message = JSON.parse(data.message);

						if (this.chatMessages[message.source] === undefined)
							this.$set(this.chatMessages, message.source, [])

						this.chatMessages[message.source].push({
							text: message.plain,
							timestamp: message.timestamp,
							received: true
						})
					} catch (e) {}

					console.log(this.chatMessages)
				}
			} catch {
				console.error('Invalid json packet')
			}
		});

		this.ws.addEventListener('error', (error) => {
			this.$alertToast.push({
				type: 'error',
				text: 'Websocket: Error',
				timeout: 3000
			})
		})

		this.ws.addEventListener('close', (event) => {
			this.$alertToast.push({
				type: 'info',
				text: 'Websocket: Connection closed\n',
				timeout: 3000
			})

			this.ws = null;

			route.push({
				path: '/connect'
			});
		});
	}

	public beforeDestroy() {
		if (this.ws !== null)
			this.ws.close()
	}

	onResize() {
		this.windowWidth = window.innerWidth
	}
}
</script>

<style>
.message-bubble {
	margin-bottom: 10px;
	width: 50%;
	float: right;
}

/* .v-content {
	overflow-y: auto;
}

.scrollable-content {
	overflow-y: scroll;
	overflow-x: hidden;
	max-height: 100%;
	max-width: 100%;
	height: 100%;
	box-sizing: content-box
} */
</style>

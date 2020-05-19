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
		overflow>
		<p v-if="Object.keys(chatMessages).length === 0"
			class="text-center"
			style="margin-top: 10px">No chat messages :(</p>

		<v-list v-else
			class="mt-n2">
			<v-list-item-group active-class="deep-gray--text text--accent-4"
				v-model="selectedChat"
				mandatory>
				<v-list-item v-for="(_, username) in chatMessages"
					:key="username"
					:value="username">

					<v-list-item-icon>
						<v-icon>mdi-account</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ username }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-navigation-drawer>

	<v-content>
		<v-row v-for="(data, i) in $store.state.chatMessages[selectedChat]"
			:key="i">
			<v-col>
				<v-card color="primary"
					class="message-bubble"
					:style="{float: `${data.received === true ? 'left' : 'right'}`}">
					<v-card-text style="color: white">{{data.text}}</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-footer absolute>
			<v-text-field append-icon="mdi-send"
				@click:append="send"
				@keydown.enter="send"
				value=""
				v-model="message"></v-text-field>
		</v-footer>
	</v-content>
	<v-dialog width="500"
		v-model="dialogIsOpen">
		<v-card>
			<v-card-title>Settings</v-card-title>
			<v-card-text>
				<v-switch v-model="$vuetify.theme.dark"
					primary
					label="Dark Mode" />
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary"
					text
					@click="dialogIsOpen = false">
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</v-app>
</template>
<script lang="ts">
import {
	Component,
	Vue
} from 'vue-property-decorator';

import route from '@/router'

@Component({})
export default class Chat extends Vue {

	private items!: string[];

	private selectedChat!: string;

	private message!: string;


	private dialogIsOpen!: boolean;

	data() {
		return {
			items: [{
					title: 'Settings',
					icon: 'mdi-tune',
					callback: () => {
						this.dialogIsOpen = true;
					}
				},
				{
					title: 'Log out',
					icon: 'mdi-logout',
					callback: function() {
						route.push({
							path: '/'
						})
					}
				},
			],
			selectedChat: null,
			message: "",
			dialogIsOpen: false,
		}
	}

	get chatMessages() {
		return this.$store.state.chatMessages;
	}

	send() {
		if (this.message.length > 0 && this.selectedChat !== null) {

			this.$store.state.chatMessages[this.selectedChat].push({
				text: this.message,
				timestamp: Date.now(),
				received: false
			});

			this.message = '';
		}
	}
}
</script>

<style>
.message-bubble {
	margin-bottom: 10px;
	width: 50%;
	float: right;
}
</style>

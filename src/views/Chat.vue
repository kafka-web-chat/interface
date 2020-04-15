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
		<v-list class="mt-n2">
			<v-list-item-group active-class="deep-gray--text text--accent-4">
				<v-list-item v-for="(user, i) in connectedUsers"
					:key="i">

					<v-list-item-icon>
						<v-icon>mdi-account</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ user.name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-navigation-drawer>
	<v-content>
		<v-row v-for="(m, i) in messageList"
			:key="i">
			<v-col>
				<v-card color="primary"
					class="message-bubble">
					<v-card-text style="color: white">{{m}}</v-card-text>
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
	private message!: string;

	private messageList!: string[];

	data() {
		return {
			items: [{
					title: 'Settings',
					icon: 'mdi-tune',
					callback: function() {}
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
			messageList: [],
			message: "",
		}
	}

	get connectedUsers() {
		return this.$store.state.connectedUsers;
	}

	send() {
		if (this.message.length > 0) {
			this.messageList.push(this.message);
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

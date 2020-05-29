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
						<v-toolbar-title>Register</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-card-text>
						<v-form ref="form">
							<!-- <v-file-input clearable=""></v-file-input> -->
							<v-text-field type="text"
								label="Username"
								prepend-icon="mdi-account"
								:rules="[rules.required, rules.minUsername, rules.maxUsername, rules.validCharsUsername]"
								v-model="username"></v-text-field>

							<v-text-field :type="show_password ? 'text' : 'password'"
								label="Password"
								prepend-icon="mdi-lock"
								:append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="show_password = !show_password"
								:rules="[rules.required, rules.minPassword, rules.maxPassword, rules.validCharsPassword, rules.passwordIsStrong]"
								counter
								v-model="password"></v-text-field>

							<v-text-field :type="show_password ? 'text' : 'password'"
								label="Retype Password"
								prepend-icon="mdi-lock"
								:append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="show_password = !show_password"
								:rules="[rules.required, rules.passwordsMatch(password, re_password)]"
								counter
								v-model="re_password"></v-text-field>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary"
							@click="reset">Reset</v-btn>
						<v-btn color="primary"
							@click="register">Register</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</v-content>
<!-- </v-app> -->
</template>
<script lang="ts">
import axios from 'axios';

import {
	Component,
	Prop,
	Vue
} from 'vue-property-decorator';

import route from '@/router'

import Rules from '@/utils/input-rules'

@Component({})
export default class App extends Vue {

	private isLoading!: boolean;

	private username!: string;
	private password!: string;
	private re_password!: string;

	private show_password!: boolean;

	public data() {
		return {
			username: '',
			password: '',
			re_password: '',
			show_password: false,
			isLoading: false,
		}
	}

	get rules() {
		return Rules;
	}

	private get connection() {
		return this.$store.state.connection
	}

	public reset() {
		( < any > this.$refs.form).reset();
		( < any > this.$refs.form).resetValidation();
	}

	public async register() {

		if (( < any > this.$refs.form).validate() === false)
			return;

		this.isLoading = true;

		const response = await axios.post(`${this.connection.httpURL}/register`, {
				username: this.username,
				password: this.password
			}).catch(err => {})
			.finally(() => this.isLoading = false)

		if (response === undefined)
			return this.$alertToast.pushDefault('error', 'Unknown error on connection');

		if (response.data === undefined)
			return this.$alertToast.pushDefault('error', 'Invalid response');

		if (response.data.success === false)
			return this.$alertToast.pushDefault('error', response.data.error);

		this.connection.username = this.username;
		this.connection.token = response.data.data.token;
		this.connection.private_key = response.data.data.private_key;
		this.connection.public_key = response.data.data.public_key;


		this.$alertToast.pushDefault('success', 'Registered succesfully');

		route.push({
			path: '/chat'
		});
	}

	public mounted() {
		this.connection.username = null;
		this.connection.token = null;
		this.connection.private_key = null;
		this.connection.public_key = null;
		this.$store.state.chatMessages = {}
		this.$store.state.contacts = []
	}
}
</script>

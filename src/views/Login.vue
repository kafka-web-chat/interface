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
						<v-toolbar-title>Login</v-toolbar-title>
						<v-spacer></v-spacer>
						<router-link to="register"
							style="color: white">No account?</router-link>
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
								:rules="[rules.required, rules.minPassword, rules.maxPassword, rules.validCharsPassword]"
								counter
								v-model="password"></v-text-field>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary"
							@click="reset">Reset</v-btn>
						<v-btn color="primary"
							@click="login">Login</v-btn>
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

import route from '@/router';

import Rules from '@/utils/input-rules';

@Component({})
export default class App extends Vue {

	private isLoading!: boolean;

	private username!: string;
	private password!: string;
	private show_password!: boolean;

	public data() {
		return {
			username: '',
			password: '',
			show_password: false,
			isLoading: false,
		}
	}

	get rules() {
		return Rules;
	}

	get connection() {
		return this.$store.state.connection;
	}

	public reset() {
		( < any > this.$refs.form).reset();
		( < any > this.$refs.form).resetValidation();
	}

	public async login() {


		if (( < any > this.$refs.form).validate() === false)
			return;

		this.isLoading = true;


		const response = await axios.post(`${this.connection.httpURL}/login`, {
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

		this.$alertToast.pushDefault('success', 'Login succesfully');

		route.push({
			path: '/chat'
		})
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

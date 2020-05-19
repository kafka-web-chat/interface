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
					</v-toolbar>
					<v-card-text>
						<v-form>
							<!-- <v-file-input clearable=""></v-file-input> -->
							<v-text-field type="text"
								label="Username"
								prepend-icon="mdi-account"
								v-model="username"></v-text-field>

							<v-text-field type="password"
								label="Password"
								prepend-icon="mdi-lock"
								v-model="password"></v-text-field>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary"
							@click="">Reset</v-btn>
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
import {
	Component,
	Prop,
	Vue
} from 'vue-property-decorator';

import route from '@/router'

@Component({})
export default class App extends Vue {

	private isLoading!: boolean;

	private username!: string;
	private password!: string;

	public data() {
		return {
			username: '',
			password: '',
			isLoading: false,
		}
	}

	public login() {
		this.isLoading = true;

		setTimeout(() => {

			this.isLoading = false;

			if (this.username === 'root' && this.password === 'root') {
				route.push({
					path: '/chat'
				})
			}

		}, 1000)
	}
	//
	// mounted() {
	// 	route.push({
	// 		path: '/chat'
	// 	})
	// }
}
</script>

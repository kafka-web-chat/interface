<template>
<v-dialog width="600"
	v-model="dialogIsOpen">
	<v-card>
		<v-card-title>
			New Contact
			<v-spacer />
			<v-btn icon
				@click="switchFormat">
				<v-icon>{{usingJsonFormat ? 'mdi-pencil-outline' : 'mdi-code-json'}}</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<v-form ref="form">
				<div v-if="usingJsonFormat">
					<v-textarea label="JSON"
						auto-grow
						:rules="[rules.required, rules.isValidJSON]"
						v-model="json"></v-textarea>
				</div>
				<div v-else>
					<v-text-field label="Username"
						:rules="[rules.required]"
						v-model="username"></v-text-field>
					<v-textarea label="Key"
						auto-grow
						:rules="[rules.required]"
						v-model="key"></v-textarea>
				</div>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="error"
				text
				@click="dialogIsOpen  = false">
				Cancel
			</v-btn>
			<v-btn text
				@click="reset">
				Reset
			</v-btn>
			<v-btn color="primary"
				text
				@click="contactAdded">
				Add
			</v-btn>
		</v-card-actions>
	</v-card>
</v-dialog>
</template>

<script lang="ts">
import {
	Component,
	Watch,
	Prop,
	Vue
} from 'vue-property-decorator'

@Component({
	props: ['value'],
})

export default class NewContactDialog extends Vue {
	@Prop() private value!: boolean;

	private usingJsonFormat!: boolean;
	private json!: string;


	private username!: string;
	private key!: string;

	private rules!: any;

	data() {
		return {
			usingJsonFormat: false,
			json: '',
			username: '',
			key: '',

			rules: {
				required: (value: string) =>
					!!value || 'Required',

				isValidJSON: (value: string) => {
					try {
						const data = JSON.parse(value);

						if (data === undefined || data instanceof Array)
							throw new Error();

						if (typeof data.username != 'string' || typeof data.publicKey != 'string')
							return "Property has invalid data type"

						if (data.username.length == 0 || data.publicKey.length == 0)
							return "Property has invalid length"

					} catch (e) {
						return 'Invalid json format'
					}

					return true
				}


			},
		}
	}

	get dialogIsOpen() {
		return this.value
	}

	set dialogIsOpen(newValue) {
		this.$emit('input', newValue)
	}

	@Watch('value')
	public dialogIsOpenChanged() {
		if (this.value === true) {
			this.usingJsonFormat = false;
			this.json = '';
			this.username = '';
			this.key = '';
		}
	}

	switchFormat() {
		this.reset();
		this.usingJsonFormat = !this.usingJsonFormat;
	}

	public reset() {
		( < any > this.$refs.form).reset();
		( < any > this.$refs.form).resetValidation();
	}

	public contactAdded() {

		if (( < any > this.$refs.form).validate() === false)
			return;

		let username, key;

		if (this.usingJsonFormat) {
			const data = JSON.parse(this.json);


			username = data.username;
			key = data.publicKey;
		} else {
			username = this.username;
			key = this.key;
		}

		this.$emit('contactAdded', username, key)
	}

	public mounted() {
		this.usingJsonFormat = false;
		this.json = '';
		this.username = '';
		this.key = '';
	}


}
</script>

<style>
.mdi-backup-restore {
	color: white !important;
}
</style>

<template>
<v-dialog width="600"
	v-model="dialogIsOpen">
	<v-card>
		<v-card-title>
			Share public key
			<v-spacer />
			<v-btn icon
				@click="switchFormat">
				<v-icon>{{usingQRFormat ? 'mdi-code-json' : 'mdi-qrcode'}}</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<div v-if="usingQRFormat">
				<v-img :src="dataURL" />
			</div>
			<div v-else>
				<v-textarea readonly
					auto-grow
					:value="getJson()" />
			</div>

		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="error"
				text
				@click="dialogIsOpen = false">
				Close
			</v-btn>
			<v-btn color="primary"
				text
				v-if="!usingQRFormat"
				@click="copyText">
				copy
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

import QRCode from 'qrcode'

@Component({
	props: ['value'],
})

export default class NewContactDialog extends Vue {
	@Prop() private value!: boolean;

	private usingQRFormat!: boolean;
	private textToShare!: string;
	private dataURL!: string;

	data() {
		return {
			usingQRFormat: true,
			textToShare: '',
			dataURL: ''
		}
	}

	get connection() {
		return this.$store.state.connection;
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
			this.usingQRFormat = true;
			this.textToShare = this.getJson();
			QRCode.toDataURL(this.textToShare, (err, url) => {
				this.dataURL = url
			})
		}
	}

	public switchFormat() {
		this.usingQRFormat = !this.usingQRFormat;
	}

	public getJson() {
		return JSON.stringify({
			username: this.$store.state.connection.username,
			publicKey: this.connection.public_key

		})
	}

	public copyText() {
		navigator.clipboard.writeText(this.getJson()).then(() => {
			this.$alertToast.pushDefault('success', 'Copied succesfully')
		}, () => {
			this.$alertToast.pushDefault('error', 'Error occurred while trying to copy')
		});
	}
}
</script>

<style>
.mdi-backup-restore {
	color: white !important;
}
</style>

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		connection: {
			host: 'localhost',
			httpPort: '49090',
			wsPort: '49091',
			use_secure: false,

			get httpURL() {
				return `http${this.use_secure ? 's' : ''}://${this.host}:${this.httpPort}`
			},

			get wsURL() {
				return `ws${this.use_secure ? 's' : ''}://${this.host}:${this.wsPort}`
			},

			username: null,
			token: null,
			private_key: null,
			public_key: null
		},

		connectedToBackend: false,

		chatMessages: {},

		contacts: []
	}
})

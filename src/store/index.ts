import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		connectedToBackend: false,
		connectedUsers: [
			{ name: 'Pedro', icon: 'tune-vertical' },
			{ name: 'Alvaro', icon: 'package-variant-closed' },
			{ name: 'Jesus', icon: 'palette-outline' },
			{ name: 'Mario', icon: 'plus' }, // github-circle loading?? idk wth is this
		]
	}
})

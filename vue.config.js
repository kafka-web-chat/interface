const fs = require('fs')

module.exports = {
	transpileDependencies: [
		"vuetify",
		"vuetify/lib",
	],

	devServer: {
		disableHostCheck: true
	}
}

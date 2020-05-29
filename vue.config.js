const fs = require('fs')
const path = require('path');

module.exports = {
	transpileDependencies: [
		"vuetify",
		"vuetify/lib",
	],

	configureWebpack: {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		},
	},

	devServer: {
		disableHostCheck: true
	}
}

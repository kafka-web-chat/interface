import Vue from 'vue'
import AlertToastComponent from './alert-toast.vue'

interface NotificationData {
	type: 'success' | 'info' | 'warning' | 'error';
	text: string;
	timeout?: number;
}

class PluginInterface {
	private notificationsMap: Map<number, NotificationData> = new Map();
	public linkedComponents: Vue[] = [];

	constructor() { }

	public get notifications() {
		return this.notificationsMap.entries();
	}

	push(data: NotificationData) {
		const currentKey = Math.random();
		this.notificationsMap.set(currentKey, data);

		if (data.timeout !== undefined && data.timeout >= 0) {
			setTimeout(() => {
				this.delete(currentKey)
			}, data.timeout)
		}

		this.update();
	}

	delete(key: number) {
		this.notificationsMap.delete(key)
		this.update();
	}

	update() {
		console.log(this.notificationsMap)

		this.linkedComponents.forEach(c => {
			c.$forceUpdate();
		})
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$test: PluginInterface;
	}
}


// export default
class Plugin {

	public install(vue: typeof Vue, options?: any) {
		console.log('asd', options)
		Vue.component('alert-toast', AlertToastComponent)
		vue.prototype.$test = new PluginInterface();
	}
}


export default new Plugin();

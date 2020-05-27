import Vue from 'vue';
import AlertToastComponent from './alert-toast.vue'

export namespace PluginInterface {
	export interface NotificationData {
		type: 'success' | 'info' | 'warning' | 'error';
		text: string;
		timeout?: number;
	}
}

const listOfTransitions = [
	"fab-transition", "fade-transition", "expand-transition",
	"scale-transition", "scroll-x-transition", "scroll-x-reverse-transition",
	"scroll-y-transition", "scroll-y-reverse-transition", "slide-x-transition",
	"slide-x-reverse-transition", "slide-y-transition", "slide-y-reverse-transition"
];

export class PluginInterface {
	private notificationsMap: Map<number, PluginInterface.NotificationData> = new Map();
	public linkedComponents: Vue[] = [];

	public _mode: string = 'out-in';
	public _transition: string = 'slide-x-reverse-transition';

	constructor() { }


	public get notifications() {
		return this.notificationsMap.entries();
	}

	push(data: PluginInterface.NotificationData) {
		const currentKey = Math.random();
		this.notificationsMap.set(currentKey, data);

		if (data.timeout !== undefined && data.timeout >= 0) {
			setTimeout(() => {
				this.delete(currentKey)
			}, data.timeout)
		}

		this.update();
	}

	pushDefault(type: string, text: string) {
		this.push({
			type: <any>type,
			text: text,
			timeout: 3000
		})
	}

	has(key: number): boolean {
		return this.notificationsMap.has(key);
	}

	delete(key: number) {
		this.notificationsMap.delete(key)
		this.update();
	}

	update() {
		this.linkedComponents.forEach(c => {
			c.$forceUpdate();
		})
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$alertToast: PluginInterface;
	}
}

// export default
class Plugin {

	public install(vue: typeof Vue, options?: any) {
		Vue.component('alert-toast', AlertToastComponent)
		vue.prototype.$alertToast = new PluginInterface();
	}
}


export default new Plugin();

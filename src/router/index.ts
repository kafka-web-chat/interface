import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

import Connect from '@/views/Connect.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Chat from '@/views/Chat.vue'

import NotificationTest from '@/views/NotificationTest.vue'


const routes: Array<RouteConfig> = [
	{ path: '/', redirect: '/login' },
	{ path: '/connect', component: Connect },
	{ path: '/login', component: Login },
	{ path: '/register', component: Register },
	{ path: '/chat', component: Chat },
	{ path: '/test', component: NotificationTest },
	{ path: '/*', redirect: '/test' }
]

const router = new VueRouter({
	// mode: 'abstract',
	routes
})

export default router;

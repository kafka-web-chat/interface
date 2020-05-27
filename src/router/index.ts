import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

import Connect from '@/views/Connect.vue'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'



const routes: Array<RouteConfig> = [
	// { path: '/', redirect: '/login' },
	{ path: '/connect', component: Connect },
	{ path: '/login', component: Login },
	{ path: '/chat', component: Chat },
	{ path: '/*', redirect: '/' }
]

const router = new VueRouter({
	// mode: 'abstract',
	routes
})

export default router;

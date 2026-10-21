'use strict'

import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import './components'

import App from './App.vue'
import i18n from './i18n'
import './plugins'
import router from './routes'
import store from './store'
import './registerServiceWorker.js'

Vue.config.productionTip = false
Vue.use(Vuetify)

export default new Vue({
	el: '#app',
	i18n,
	render: h => h(App),
	router,
	store,
	vuetify: new Vuetify({
		icons: {
			iconfont: 'mdiSvg',
		},
		theme: {
			themes: {
				// domotek: paleta del tema oscuro domoBIO
				dark: {
					primary: '#3CC9B0',
					secondary: '#262C33',
					accent: '#3CC9B0',
					success: '#3CC9B0',
					info: '#6CB8E6',
					warning: '#F2A65A',
					error: '#C93C35'
				}
			}
		},
		lang: { t: (key, ...params) => i18n.t(key, params) }
	})
})

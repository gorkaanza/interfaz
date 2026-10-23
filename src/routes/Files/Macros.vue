<template>
	<div v-if="!permitido"></div>
	<bio-macro-editor v-else-if="temaBio && escritorio"></bio-macro-editor>
	<v-row v-else>
		<v-col class="blue lighten-4">
			<macro-file-list></macro-file-list>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { registerRoute } from '..'
import { esEscritorio } from '../../utils/modoPantalla.js'

export default {
	computed: {
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		escritorio() { return esEscritorio(); },
		permitido() { return (this.$store.state.nivelUsuario || 0) >= 1; }
	},
	beforeRouteEnter(to, from, next) {
		next(vm => { if (!vm.permitido) { vm.$router.replace((from.name !== null && from.path !== to.path) ? from.fullPath : '/Settings/General'); } });
	},
	watch: {
		permitido(v) { if (!v) { this.$router.replace('/Settings/General'); } }
	},
	install() {
		// Register a route via Files -> Macros
		registerRoute(this, {
			Files: {
				Macros: {
					icon: 'mdi-polymer',
					caption: 'menu.files.macros',
					path: '/Files/Macros',
					nivel: 2 //luis - control de usuario
				}
			}
		});
	}
}
</script>

<template>
	<bio-macro-editor v-if="temaBio && escritorio"></bio-macro-editor>
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
		escritorio() { return esEscritorio(); }
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

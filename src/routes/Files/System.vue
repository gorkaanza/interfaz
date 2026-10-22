<template>
	<v-row v-if="permitido">
		<v-col>
			<system-file-list></system-file-list>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { registerRoute } from '..'

export default {
	computed: {
		// domotek: System solo para E500 (restringido a UserSettings) y D500
		permitido() { return (this.$store.state.nivelUsuario || 0) >= 2; }
	},
	beforeRouteEnter(to, from, next) {
		next(vm => { if (!vm.permitido) { vm.$router.replace((from.name !== null && from.path !== to.path) ? from.fullPath : '/Settings/General'); } });
	},
	watch: {
		permitido(v) { if (!v) { this.$router.replace('/Settings/General'); } }
	},
	install() {
		// Register a route via Files -> System
		registerRoute(this, {
			Files: {
				System: {
					icon: 'mdi-cog',
					caption: 'menu.files.system',
					path: '/Files/System',
					nivel: 2 //luis - control de usuario
				}
			}
		});
	}
}
</script>

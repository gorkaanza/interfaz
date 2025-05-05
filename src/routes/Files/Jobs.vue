<template>
	<v-row class="blue lighten-4">
		<v-col>
			<job-file-list></job-file-list>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { registerRoute } from '..'

export default {
	install() {
		// Register a route via Files -> Jobs
		registerRoute(this, {
			Files: {
				Jobs: {
					icon: 'mdi-play',
					caption: 'menu.files.jobs',
					path: '/Files/Jobs',
					nivel: 0 //luis - control de usuario
				}
			}
		});
	},
	mounted() {
		this.$vuetify.goTo(0);
	}
}
</script>

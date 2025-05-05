<template>
	<v-row>
		<v-col>
			<updates-file-list></updates-file-list>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { registerRoute } from '..'

export default {
	install() {
		// Register a route via Files -> System
		registerRoute(this, {
			Files: {
				Updates: {
					icon: 'mdi-cog',
					caption: 'menu.files.updates',
					path: '/Files/Updates',
					nivel: 1 //luis - control de usuario
				}
			}
		});
	}
}
</script>

<style scoped>
strong {
	align-self: center;
	text-align: center;
}

.category-header {
	flex: 0 0 100px;
}

a:not(:hover) {
	color: inherit;
}

.content span,
.content strong {
	padding-left: 8px;
	padding-right: 8px;
}

.probe-span {
	border-radius: 5px;
}
.probe-span:not(:last-child) {
	margin-right: 8px;
}
.botonCustom{
	margin-top: 50px;
	float: left;
}
</style>

<template>
	<v-card>
		<v-card-title class="py-2">
			<!-- <directory-breadcrumbs v-model="directory"></directory-breadcrumbs> -->
			<span>hola</span>
		</v-card-title>

		<!-- <v-card-actions>
			<v-row v-for="(category, index) in category" :key="index" :prepend-icon="category.icon" no-action :value="isExpanded(category)">
				<template v-for="(page, pageIndex) in getPages(routes.category)">
					<v-col cols="4" v-if="page.nivel <= $store.state.nivelUsuario" :key="`${index}-${pageIndex}`" v-ripple :to="page.path" @click.prevent="">
						<v-btn width="100%" height="100">
							<v-row>
								<v-col cols="12">
									<v-icon class="mr-2">{{ page.icon }}</v-icon>
								</v-col>
								<v-col cols="12">
									<span>{{ page.translated ? page.caption : $t(page.caption) }}</span>
								</v-col>
							</v-row>
						</v-btn>
				</v-col>
				</template>
			</v-row>
		</v-card-actions> -->
		
	</v-card>
</template>

<script>
import Path from "../../utils/path.js";
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'
import rutas from '../../routes/index.js'

export default {
	computed: {
		...mapState('settings', ['darkTheme']),
		...mapState('machine/model', {
			boards: state => state.boards,
			fans: state => state.fans,
			move: state => state.move,
			machineMode: state => state.state.machineMode,
			sensors: state => state.sensors,
			macrosDirectory: (state) => state.directories.calibration,
			status: state => state.state.status
		}),
		...mapGetters(['isConnected']),
	},
	data() {
		return {
			category: rutas.category,
			displayToolPosition: true,
			directory: Path.home
		}
	},
	methods: {
		...mapActions(['connect', 'disconnectAll']),
		...mapActions('settings', ['load']),
		getPages(category) {
			return category.pages.filter(page => page.condition);
		},
		isExpanded(category) {
			if (this.$vuetify.breakpoint.xsOnly) {
				const route = this.$route;
				return category.pages.some(page => page.path === route.path);
			}
			return true;
		},
	}
}
</script>

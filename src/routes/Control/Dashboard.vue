<template>
	<v-row class="mb-0 pb-0">
		<v-col xs="12" sm="12" md="12" lg="12" xl="12" class="mt-0 pt-0">
			<movement-panel></movement-panel>

			<!-- <v-row v-if="isFFForUnset" class="my-3"> -->
				<!-- <v-col sm="12" :md="(atxPower !== null) ? 9 : 12" :lg="(atxPower !== null) ? 9 : 12" :xl="(atxPower !== null) ? 10 : 12">
					<extrude-panel></extrude-panel>
				</v-col> -->

				<!-- <v-col v-if="atxPower !== null" md="3" lg="3" xl="2" align-self="center">
					<atx-panel></atx-panel>
				</v-col>
			</v-row> -->

			<!-- <v-row class="my-3">
				<v-col sm="12" :md="(!isFFForUnset && atxPower !== null) ? 9 : 12" :lg="(!isFFForUnset && atxPower !== null) ? 9 : 12" :xl="(!isFFForUnset && atxPower !== null) ? 10 : 12">
					<fan-panel></fan-panel>
				</v-col>

				<v-col v-if="!isFFForUnset && atxPower !== null" md="3" lg="3" xl="2" align-self="center">
					<atx-panel></atx-panel>
				</v-col>
			</v-row> -->
		</v-col>

		<!-- <v-col class="hidden-xs-only" sm="12" md="4" lg="3" xl="3">
			<macro-list></macro-list>
		</v-col> -->
	</v-row>
</template>

<script>
'use strict';

import { mapState } from 'vuex';

import { registerRoute } from '..'
import { DashboardMode } from '../../store/settings.js'
import { MachineMode } from '../../store/machine/modelEnums.js'

export default {
	install() {
		// Register a route via Control -> Dashboard
		registerRoute(this, {
			Control: {
				Dashboard: {
					icon: 'mdi-view-dashboard',
					caption: 'menu.control.dashboard',
					path: '/',
					nivel: 0 //luis - control de usuario
				}
			}
		});
	},
	computed: {
		...mapState('machine/model', {
			atxPower: state => state.state.atxPower,
			machineMode: state => state.state.machineMode
		}),
		...mapState('settings', ['dashboardMode']),
		isFFForUnset() {
			if (this.dashboardMode === DashboardMode.default) {
				return !this.machineMode || this.machineMode === MachineMode.fff;
			}
			return this.dashboardMode === DashboardMode.fff;
		},
	},
	
	mounted() {
		this.$vuetify.goTo(0);
	}
}
</script>

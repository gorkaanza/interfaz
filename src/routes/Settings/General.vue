<template>
	<v-row class="pa-3 blue lighten-4">
		<v-tabs class="elevation-2 mt-3 blue lighten-4"  v-if="$store.state.nivelUsuario >= 2" background-color="blue lighten-3">
			<v-tabs-slider></v-tabs-slider>

			<v-tab v-for="(tab, index) in tabs" :key="index" :href="`#general-tab-${index}`" >
				<v-icon v-if="tab.icon" class="mr-1">{{ tab.icon }}</v-icon> {{ tab.translated ? tab.caption : $t(tab.caption) }}
			</v-tab>

			<v-tab-item v-for="(tab, index) in tabs" :key="index" :value="`general-tab-${index}`" class="blue lighten-4">
				<component :is="tab.component"></component>
			</v-tab-item>
		</v-tabs>
		<v-col cols="12" md="12" lg="12"  v-if="$store.state.nivelUsuario <= 1">
			<v-row>
				<v-col cols="12" sm="12">
					<settings-about-panel></settings-about-panel>
				</v-col>
				<v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
					<settings-apperance-panel></settings-apperance-panel>
				</v-col>
				<!-- <v-col cols="12" sm="12" md="12">
					<settings-notifications-panel></settings-notifications-panel>
				</v-col>
				<v-col cols="12">
					<settings-general-panel></settings-general-panel>
				</v-col> -->
			</v-row>
		</v-col>

		<!-- <v-col cols="12" md="8">
			<v-row>
				<v-col cols="12">
					<settings-webcam-panel></settings-webcam-panel>
				</v-col>
			</v-row>
		</v-col> -->
	</v-row>
</template>

<script>
'use strict'

import { registerRoute, GeneralSettingTabs } from '..'

export default {
	install() {
		// Register a route via Settings -> General
		registerRoute(this, {
			Settings: {
				General: {
					icon: 'mdi-tune',
					caption: 'menu.settings.general',
					path: '/Settings/General',
					nivel: 0 //luis - control de usuario
				}
			}
		});
	},
	data() {
		return {
			tab: 'general-tab-0',
			tabs: GeneralSettingTabs
		}
	}
}
</script>

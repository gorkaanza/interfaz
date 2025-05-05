<template>
	<v-row>
		<v-col cols="12" align="center" class="mt-10">
			<v-img src="@/assets/domoBIO.png" contain :max-width="150" :max-height="150"></v-img>
		</v-col>
		<v-col cols="12" align="center" class="mt-10">
			<v-toolbar-title>
				<a class="ml-3" href="javascript:void(0)" id="title">{{ name }}</a>
			</v-toolbar-title>
		<!-- <v-divider></v-divider> -->
		</v-col>
		<v-col cols="6" align="center" class="mt-10">
			<v-btn href="https://domotek.es/" icon>
				<v-row>
					<v-col cols="12">
						<v-icon x-large>mdi-wifi-arrow-up-down</v-icon>
					</v-col>
					<v-col cols="12">
						<span>	Slicer </span> 
					</v-col>
				</v-row>
			</v-btn>
		</v-col>
		<v-col cols="6" align="center" class="mt-10">
			<v-btn @click="cambiarRuta('/')" icon>
				<v-row>
					<v-col cols="12">
						<v-icon x-large>mdi-tune</v-icon>
					</v-col>
					<v-col cols="12">
						<span>	Control </span> 
					</v-col>
				</v-row>
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { registerRoute, MachineSettingTabs } from '..'
import { mapState } from 'vuex'

export default {
	install() {
		// Register a route via Settings -> Machine
		registerRoute(this, {
			Settings: {
				Machine: {
					icon: 'mdi-cogs',
					caption: 'Tools/Cama',
					path: '/Settings/MenuTools',
					nivel: 2 //luis - control de usuario
				}
			}
		});
	},
	computed: {
		tabs: () => MachineSettingTabs,
		...mapState({
		name: state => state.machine.model.network.name,
		})
	},
	methods:{
		cambiarRuta(ruta){
			this.$router.push(ruta)
		}
	}
}
</script>

<template>
	<v-card outlined v-if="$store.state.nivelUsuario >= 2">
		<v-card-title>
			{{ $t('panel.settingsNotifications.caption') }}
		</v-card-title>

		<v-card-text class="d-flex flex-column">
			<v-switch class="mt-0 mb-3" v-model="notificationErrorsPersistent" :label="$t('panel.settingsNotifications.notificationErrorsPersistent')" hide-details></v-switch>
			<v-text-field v-model.number="notificationTimeout" type="number" step="any" min="0" :label="$t('panel.settingsNotifications.notificationTimeout', ['ms'])" hide-details></v-text-field>
		</v-card-text>

		<v-card-text class="d-flex flex-column">
			<span>Email</span>
			<v-row>
				<v-col cols="12">
					<v-text-field v-model="email" @change="CambiarEmail()" type="string" step="any" min="0" hide-details></v-text-field>
				</v-col>
				<v-col cols="6">
					<v-checkbox v-model="checkbox" label="Inicio impresión"></v-checkbox>					
				</v-col>
				<v-col cols="6">
					<v-checkbox v-model="checkbox" label="Impresión terminada"></v-checkbox>			
				</v-col>
				<v-col cols="6">
					<v-checkbox v-model="checkbox" label="Tinta acabada"></v-checkbox>					
				</v-col>
				<v-col cols="6">
					<v-checkbox v-model="checkbox" label="Impresión Pausada"></v-checkbox>			
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapMutations } from 'vuex'
import store from '../../store';

export default {
	computed: {
		...mapState(['settings']),
		...mapState('machine/model', {
			mainboard: state => (state.boards.length > 0) ? state.boards[0] : {},
		}),
		notificationErrorsPersistent: {
			get() { return this.settings.notifications.errorsPersistent; },
			set(value) { this.update({ notifications: { errorsPersistent: value } }); }
		},
		notificationTimeout: {
			get() { return this.settings.notifications.timeout; },
			set(value) { if (this.isNumber(value) && value >= 0) { this.update({ notifications: { timeout: value } }); } }
		},
		email:{
			//get() { return this.mainboard.EmailAddress; },
			get() { return this.settings.emailUsuario; },
			//set(value) { this.CambiarEmail(value) },
			set(value) { this.update({ emailUsuario: value }); } ,
			
			
		},
		checkbox:{
			get() { return false; }
		}
	},
	methods:
	{
		...mapMutations('settings', ['update']),
		CambiarEmail(){
			store.commit('settings/guardarEmail');
		}

	}
}
</script>

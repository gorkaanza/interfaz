<template>
	<v-card outlined v-if="$store.state.nivelUsuario >= 0" class="blue lighten-5" elevation="5">
		<v-card-title>
			{{ $t('panel.settingsAppearance.caption') }}
		</v-card-title>

		<v-card-text class="d-flex flex-column">
		<!--
			<v-switch :label="$t('panel.settingsAppearance.darkTheme')" class="mt-0 mb-3" hide-details v-model="darkTheme"></v-switch>
			<v-select :items="languages" :label="$t('panel.settingsAppearance.language')" :return-object="false" hide-details item-text="language" item-value="code" v-model="language"></v-select>
			<v-tooltip bottom>
				<template #activator="{ on }">
					<v-switch :label="$t('panel.settingsAppearance.binaryFileSizes')" hide-details v-model="useBinaryPrefix" v-on="on"></v-switch>
				</template>
				{{ $t('panel.settingsAppearance.binaryFileSizesTitle') }}
			</v-tooltip>
			<v-tooltip bottom>
				<template #activator="{ on }">
					<v-switch :label="$t('panel.settingsAppearance.disableAutoComplete')" hide-details v-model="disableAutoComplete" v-on="on"></v-switch>
				</template>
				{{ $t('panel.settingsAppearance.disableAutoCompleteTitle') }}
			</v-tooltip>
			<v-select :items="dashboardModes" :label="$t('panel.settingsAppearance.dashboardModeTitle')" class="mt-3" hide-details item-text="value" item-value="value" v-model="dashboardMode"></v-select>
			<v-switch :label="$t('panel.settingsAppearance.bottomNavigation')" hide-details v-model="bottomNavigation"></v-switch>
			<v-switch :label="$t('panel.settingsAppearance.numericInputs')" hide-details v-model="numericInputs"></v-switch>
			<v-switch :label="$t('panel.settingsAppearance.iconMenu')" hide-details v-model="iconMenu"></v-switch>
		-->
			<v-row>
				<!-- <v-col cols="12">
					<v-switch v-model="darkTheme" :label="$t('panel.settingsAppearance.darkTheme')" hide-details class="mt-0 mb-3"></v-switch>
				</v-col> -->
				<!-- <v-col cols="4" align="center" class="mt-3">
					<v-switch v-model="usuarioAvanzado" :label=" $t('domotek.settings.usuarioAvanzado') " @click="$store.commit('cambiarUsuario')" hide-details class="mt-0 mb-3"></v-switch>
				</v-col> -->
				<v-col cols="12" v-if="$store.state.nivelUsuario >= 0">
						<emergency-btn rounded></emergency-btn>
				</v-col>
				<v-col cols="12">
					<v-select v-model="language" :items="languages" item-text="language" item-value="code" :return-object="false" :label="$t('panel.settingsAppearance.language')" hide-details></v-select>
				</v-col>
				<!-- <v-col cols="6">
					<v-tooltip bottom>
						<template #activator="{ on }">
							<v-switch v-model="useBinaryPrefix" v-on="on" :label="$t('panel.settingsAppearance.binaryFileSizes')" hide-details></v-switch>
						</template>
						{{ $t('panel.settingsAppearance.binaryFileSizesTitle') }}
					</v-tooltip>
				</v-col>
				<v-col cols="6">
					<v-tooltip bottom>
						<template #activator="{ on }">
							<v-switch v-model="disableAutoComplete" v-on="on" :label="$t('panel.settingsAppearance.disableAutoComplete')" hide-details></v-switch>
						</template>
						{{ $t('panel.settingsAppearance.disableAutoCompleteTitle') }}
					</v-tooltip>
				</v-col> -->
			</v-row>
		</v-card-text>
		<v-card-actions class="mt-3" v-if="$store.state.nivelUsuario >= 1">
			<v-row>
				<v-col cols="12" v-if="$store.state.nivelUsuario >= 1">

					<v-btn @click="cambiarRutaTop('/Console')" height="70px" block color="blue lighten-4" rounded>
						<v-row>
							<v-col>
								<v-icon>mdi-code-tags</v-icon>
								<span class="pl-3">{{$t('menu.control.console')}}</span>
							</v-col>
							<v-col cols="1">
								<v-icon align="left">mdi-arrow-right</v-icon>
							</v-col>
						</v-row>
					</v-btn>
				</v-col>
				<v-col cols="12" v-if="$store.state.nivelUsuario >= 1">

					<v-btn @click="cambiarRuta('/Files/Macros')" height="70px" block color="blue lighten-4" rounded>
						<v-row>
							<v-col>
								<v-icon>mdi-polymer</v-icon>
								<span class="pl-3">{{$t('menu.files.macros')}}</span>
							</v-col>
							<v-col cols="1">
								<v-icon align="left">mdi-arrow-right</v-icon>
							</v-col>
						</v-row>
					</v-btn>
				</v-col>
				
				<v-col cols="12" v-if="$store.state.nivelUsuario >= 1">
						<v-btn @click="cambiarRuta('/Files/Updates')" height="70px" block color="blue lighten-4" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-cogs</v-icon>
									<span class="pl-3">{{$t('menu.files.updates')}}</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
				</v-col>
				<!-- <v-col cols="12" v-if="$store.state.nivelUsuario >= 1">
					<v-btn @click="cambiarRuta('/Job/Status')" height="70px" block color="blue lighten-5" rounded>
						<v-row>
							<v-col>
								<v-icon>mdi-play</v-icon>
								<span class="pl-3">{{$t('menu.job.status')}}</span>
							</v-col>
							<v-col cols="1">
								<v-icon align="left">mdi-arrow-right</v-icon>
							</v-col>
						</v-row>
					</v-btn>
				</v-col> -->
				<template v-if="$store.state.nivelUsuario >= 2">
					<v-col cols="12">
						<v-btn @click="cambiarRuta('/Files/System')" height="70px" block color="blue lighten-4" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-cogs</v-icon>
									<span class="pl-3">{{$t('menu.files.system')}}</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn @click="cambiarRuta('/ObjectModel')" height="70px" block color="blue lighten-4" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-globe-model</v-icon>
									<span class="pl-3">Object Model</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn @click="cambiarRuta('/HeightMap')" height="70px" block color="blue lighten-4" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-grid</v-icon>
									<span class="pl-3">{{$t('plugins.heightmap.menuCaption')}}</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn @click="cambiarRuta('/Plugins')" height="70px" block color="blue lighten-4" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-puzzle</v-icon>
									<span class="pl-3">{{$t('menu.files.plugins')}}</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn @click="cambiarRuta('/ToolsOffsetCfg')" height="70px" block color="blue lighten-4" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-wrench</v-icon>
									<span class="pl-3">Tools Offset</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>

					<!-- <v-col cols="12">
						<v-btn @click="cambiarRuta('/NodeDSF')" height="70px" block color="blue lighten-5" rounded>
							<v-row>
								<v-col>
									<v-icon>mdi-email</v-icon>
									<span class="pl-3">Email</span>
								</v-col>
								<v-col cols="1">
									<v-icon align="left">mdi-arrow-right</v-icon>
								</v-col>
							</v-row>
						</v-btn>
					</v-col> -->
				</template>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
'use strict';

import { mapState, mapMutations } from 'vuex'

import { DashboardMode } from '@/store/settings'
import { UnitOfMeasure } from '../../store/settings';

export default {
	computed: {
		...mapState(['settings']),
		usuarioAvanzado: {
			get() { return this.settings.usuarioAvanzado; },
			set(value) { this.update({ usuarioAvanzado: value }); },
		},
		usuarios(){
			//$store.state.nivelUsuario = 2
			//this.index.nivelUsuario = 2;
			return true
		},
		darkTheme: {
			get() { return this.settings.darkTheme; },
			set(value) { this.update({ darkTheme: value }); }
		},
		decimalPlaces: {
			get() { return this.settings.decimalPlaces; },
			set(value) { this.update({ decimalPlaces: value }); }
		},
		displayUnits: {
			get() { return this.settings.displayUnits; },
			set(value) { this.update({ displayUnits: value }); }
		},
		language: {
			get() { return this.settings.language; },
			set(value) { this.update({ language: value }); }
		},
		languages() {
			const result = [];
			for (let key in this.$i18n.messages) {
				result.push({code: key, language: this.$i18n.messages[key].language});
			}
			return result;
		},
		useBinaryPrefix: {
			get() { return this.settings.useBinaryPrefix; },
			set(value) { this.update({ useBinaryPrefix: value }); }
		},
		disableAutoComplete: {
			get() { return this.settings.disableAutoComplete; },
			set(value) { this.update({ disableAutoComplete: value }); }
		},
		dashboardMode: {
			get() {
				if (!this.settings.dashboardMode) {
					return DashboardMode.default;
				}
				return this.settings.dashboardMode;
			},
			set(value) {
				this.update({ dashboardMode: value });
			},
		},
		dashboardModes() {
			return Object.keys(DashboardMode).map((key) => {
				return { key, value: DashboardMode[key] };
			});
		},
		unitsOfMeasure() {
			return Object.keys(UnitOfMeasure).map((key) => {
				return { key, value: UnitOfMeasure[key] };
			});
		},
		bottomNavigation: {
			get() { return this.settings.bottomNavigation; },
			set(value) { this.update({ bottomNavigation: value }); }
		},
		numericInputs: {
			get() { return this.settings.numericInputs; },
			set(value) { this.update({ numericInputs: value }); }
		},
		iconMenu: {
			get() { return this.settings.iconMenu; },
			set(value) { this.update({ iconMenu: value }); }
		},
	},
	methods:{
		...mapMutations('settings', ['update']),
		cambiarRuta(ruta){
			this.$router.push(ruta)
		},
		cambiarRutaTop(ruta){
			window.scrollTo(0,0);
			this.$router.push(ruta)
		}
	}
};
</script>

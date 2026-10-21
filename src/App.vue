<style lang="scss">
@import "./scss/tema-bio.scss";

#title:not(:hover) {
	color: inherit;
}
#title {
	margin-right: 20px;
}
/* @media (max-width: 1200px) {
     *{
        font-size: 17px;
    }
} */

.stopScroll{
	overflow: hidden;
	height: 100%;
}

.empty-table-fix td {
	padding-left: 0px !important;
	padding-right: 0px !important;
}

.global-control.theme--light {
	background-color: #F5F5F5 !important;
}
#global-container .v-card.theme--light {
	background-color: #F5F5F5 !important;
}
.global-control.theme--dark {
	background-color: #515151 !important;
}
#global-container .v-card.theme--dark {
	background-color: #515151 !important;
}

input[type='number'] {
	-moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

/*Luis - Quitar Scrollbar*/
::-webkit-scrollbar{
	display:none;
}

a:not(:hover) {
	text-decoration: none;
}

textarea {
	line-height: 1.25rem !important;
}

.theme--dark textarea {
	caret-color: #FFF;
}

.v-item-group.theme--dark .v-btn__content {
	color: #FFF !important;
}

.v-card__title {
	font-size: 1rem;
}

.v-app {
	font-size:17px;
}
	
.v-speed-dial--fixed {
	z-index: 5;
}

/* .v-btn {
	text-transform: unset !important; 
} */
</style>

<template>
	<v-app :class="{ 'tema-bio': temaBio }">
		<!-- domotek: barra lateral del tema oscuro -->
		<v-navigation-drawer v-if="temaBio" app permanent width="80px" class="bio-rail">
			<button v-for="item in railItems" :key="item.id" type="button" class="bio-rail-btn" :class="{ activo: railActivo === item.id }" :aria-label="item.label" @click="railClick(item)">
				<svg v-if="item.id === 'job' && isPrinting" class="anillo" viewBox="0 0 48 48" aria-hidden="true">
					<circle cx="24" cy="24" r="21" fill="none" stroke="#2A4A45" stroke-width="3"></circle>
					<circle cx="24" cy="24" r="21" fill="none" stroke="#3CC9B0" stroke-width="3" stroke-linecap="round" :stroke-dasharray="`${(jobProgress || 0) * 131.9} 131.9`" transform="rotate(-90 24 24)"></circle>
				</svg>
				<v-icon large>{{ item.icon }}</v-icon>
			</button>
			<div class="bio-rail-hueco"></div>
			<button v-for="item in railItemsAbajo" :key="item.id" type="button" class="bio-rail-btn" :class="{ activo: railActivo === item.id }" :aria-label="item.label" @click="railClick(item)">
				<v-icon large>{{ item.icon }}</v-icon>
			</button>
		</v-navigation-drawer>
		<v-navigation-drawer v-else app permanent width="100px" class="blue lighten-4">
			<v-bottom-navigation color="teal" height="0" v-model="numMenuSelect">
				<v-row >
					<v-col cols="12" class="mb-0 pb-0">
						<v-btn block height="95" @click="mostrarHome = true">
							<v-icon x-large>mdi-home-roof</v-icon>
						</v-btn>
						<v-divider></v-divider>
						<v-btn block height="95" @click="cambiarRuta('/Files/tools'),mostrarHome = false">
							<v-icon x-large>mdi-tools</v-icon>
						</v-btn>
						<v-divider></v-divider>
						<v-btn block height="95" @click="cambiarRuta('/Job/Status'),mostrarHome = false">
							<v-icon x-large>mdi-play</v-icon>
						</v-btn>
						<v-divider></v-divider>
						<v-btn block height="95" @click="cambiarRuta('/'),mostrarHome = false">
							<v-icon x-large>mdi-camera-control</v-icon>
						</v-btn>
						<v-divider></v-divider>
						<v-btn block height="95" @click="cambiarRuta('/Settings/General'),mostrarHome = false">
							<v-icon x-large>mdi-cog</v-icon>
						</v-btn>
						<v-divider v-if="$store.state.nivelUsuario >= 3"></v-divider>
						<v-btn  v-if="$store.state.nivelUsuario >= 3" block height="95" @click="cambiarRuta('/Settings/Machine'),mostrarHome = false">
							<v-icon x-large>mdi-cogs</v-icon>
						</v-btn>
						<v-divider></v-divider>
					</v-col>
				</v-row>
			</v-bottom-navigation>
		</v-navigation-drawer>

		<v-main id="content" class="blue lighten-4 mb-0 pb-0">
			<v-scroll-y-transition>
				<v-container v-show="!hideGlobalContainer || $vuetify.breakpoint.lgAndUp" id="global-container" fluid>
					<v-row>
						<v-col cols="9">
							<code-input class="mx-3 hidden-sm-and-down"></code-input>
						</v-col>
						<v-col cols="3">
							<emergency-btn></emergency-btn>
						</v-col>

						<v-col cols="12" sm="12" md="4" lg="4" xl="4">
							<status-panel></status-panel>
							<webcam-panel class="pa-0 mt-5" v-if="modeloMaquina != '2A'"></webcam-panel>	  <!-- 2024_06_Jon_Ander--> 	<!--he movido el panel de webcam de sitio -->
						</v-col>
						<v-col cols="12" sm="12" md="5" lg="5" xl="4">
							<tools-panel v-if="$vuetify.breakpoint.lgAndUp" ></tools-panel> 
						</v-col>
						<v-col v-if="$vuetify.breakpoint.mdAndUp" :class="{ 'd-flex': hasTemperaturesToDisplay }" md="3" lg="3" xl="4">
							<temperature-chart></temperature-chart>
						</v-col>
					</v-row>
				</v-container>
			</v-scroll-y-transition>
		<!--		
			<v-container class="hidden-sm-and-down" id="global-container" fluid>
				<fff-container-panel v-if="isFFForUnset"/>
				<cnc-container-panel v-else/>
			</v-container>
		-->

			<v-divider v-show="!hideGlobalContainer || $vuetify.breakpoint.mdAndUp"></v-divider>

			<!-- domotek: Inicio con el tema oscuro -->
			<div v-if="mostrarHome && temaBio" class="bio-inicio px-4">
				<header class="bio-inicio-cab">
					<span class="bio-maquina"><span>{{ bioNombre.domo }}</span><span class="bio-marca-bio">{{ bioNombre.marca }}</span><span class="bio-tenue" style="font-weight: 500">{{ bioNombre.resto }}</span></span>
					<status-label v-if="status"></status-label>
					<div style="flex: 1"></div>
					<span v-if="bioPuerta !== null" class="bio-tenue" style="font-size: 14px">
						<v-icon small class="mr-1" :color="bioPuerta ? '#3CC9B0' : '#9AA5AF'">{{ bioPuerta ? 'mdi-door-open' : 'mdi-door-closed' }}</v-icon>{{ bioPuerta ? $t('domotek.home.doorOpen') : $t('domotek.home.doorClosed') }}
					</span>
				</header>
				<section class="bio-inicio-marca">
					<img v-if="modeloMaquina != 'HK'" src="@/assets/domoBIO_icono.png" alt="" class="bio-inicio-logo">
					<div class="bio-inicio-nombre"><span>domo</span><span class="bio-marca-bio">{{ modeloMaquina == 'HK' ? 'MAT' : 'BIO' }}</span></div>
					<div class="bio-tenue" style="font-size: 15px">Providing bioprinting solutions</div>
				</section>
				<section class="bio-temps" :style="{ gridTemplateColumns: `repeat(${bioTemps.length}, minmax(0, 1fr))` }">
					<div v-for="t in bioTemps" :key="t.et" class="bio-temp">
						<div class="et"><span class="bio-cap">{{ t.et }}</span></div>
						<div class="vl" :class="{ vacio: t.vl === null }">{{ t.vl === null ? '—' : `${t.vl} °C` }}</div>
					</div>
				</section>
			</div>

			<template v-if="mostrarHome && !temaBio">
					<v-row align="end">
						<v-col cols="4" align="center" justify="center" class="mt-5">
							<v-toolbar-title>
								<!--< class=" ma-0" href="javascript:void(0)" id="title">{{ name | replaceFilter }}</p>  -->
								<span v-html="replaceFilter(name)"></span>
							</v-toolbar-title>
							<status-label v-if="status"></status-label>
						</v-col>
						<v-col cols="4" align="center" justify="center" class="mt-5">
						</v-col>
						<v-col cols="4" align="center" justify="center" class="mt-5">
							<!-- <v-btn icon href="https://www.google.es" > 
								<v-row class="mt-10">
									<v-col cols="12">
										<v-icon x-large> mdi-animation-outline </v-icon>
									</v-col>
									<v-col>
										<span>{{ $t('domotek.home.slicer') }}</span>
									</v-col> 
								</v-row>
							</v-btn> -->
							<!-- <v-btn href="http://domobio.local:8080/en/configurer" icon>
								<v-row>
									<v-col cols="12">
										<v-icon x-large> mdi-animation-outline </v-icon>
									</v-col>
									<v-col cols="12">
										<span>{{ $t('domotek.home.slicer') }}</span>
									</v-col>
								</v-row>
							</v-btn> -->
						</v-col>
						<v-col cols="12" align="center" class="mt-5" v-if="modeloMaquina != 'HK'">
							<v-img src="@/assets/domoBIO.png" contain max-height="250" max-width="250"></v-img>
						</v-col>
						<v-col cols="12" align="center" class="mt-5" v-else>
							<v-img src="@/assets/domoMAT.png" contain max-height="250" max-width="250"></v-img>
						</v-col>
						<v-col class="mt-7 pb-0 mx-1" v-show="$vuetify.breakpoint.lgAndDown">
							<v-card class="blue lighten-5">
								<v-card-text>

								<v-row v-if="nameTools.length > 0"> <!--nameTools.length>0 -->
									<v-col align="center" v-if="nameTools.length > 0">
										<v-icon class="ml-5">mdi-tray</v-icon> : {{heaterTools[0].current.toFixed(1) == -273.1 || heaterTools[0].current == -273.15 ? "--": heaterTools[0].current.toFixed(1)}}
									</v-col>
									<v-col align="center" v-if="nameTools.length >= 1">
										{{ $t('domotek.tools.T0Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[1].current.toFixed(1) == -273.1 || heaterTools[1].current == -273.15? "--": heaterTools[1].current.toFixed(1)}}
									</v-col>
									<v-col align="center" v-if="nameTools.length >= 2">
										{{ $t('domotek.tools.T1Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[2].current.toFixed(1) == -273.1 || heaterTools[2].current == -273.15? "--": heaterTools[2].current.toFixed(1)}}
									</v-col>
									<v-col align="center" v-if="nameTools.length >= 3">
										{{ $t('domotek.tools.T2Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[3].current.toFixed(1) == -273.1 || heaterTools[3].current == -273.15? "--": heaterTools[3].current.toFixed(1)}}
									</v-col>
									<v-col align="center" v-if="nameTools.length >= 4">
										{{ $t('domotek.tools.T3Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[4].current.toFixed(1) == -273.1 || heaterTools[4].current == -273.15? "--": heaterTools[4].current.toFixed(1)}}
									</v-col>
								</v-row>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
			</template>

			<v-container fluid class="pb-0">
									<!--2024_06_Jon_Ander--> <!-- Original Duet3D -->
				<!-- <keep-alive>		
					<router-view/>
				</keep-alive> -->

									<!--2024_06_Jon_Ander-->  <!-- Domotek. No he hecho yo el cambio, solo lo he comentado -->
				<keep-alive>
					<router-view v-if="!mostrarHome"></router-view>
				</keep-alive>
				
			</v-container>
		</v-main>

		<notification-display/>

		<!-- <v-bottom-navigation v-if="showBottomNavigation" app>
			<v-menu v-for="(category, index) in categories" :key="index" top offset-y>
				<template #activator="{ on }">
					<v-btn v-on="on">
						{{ category.translated ? category.caption : $t(category.caption) }}
						<v-icon v-text="category.icon" class="mb-1"/>
					</v-btn>
				</template>

				<v-list-item v-for="(page, pageIndex) in getPages(category)" :key="`${index}-${pageIndex}`" :to="page.path" @click.prevent="" class="global-control">
					<v-icon v-text="page.icon" class="mr-2"/>
					{{ page.translated ? page.caption : $t(page.caption) }}
				</v-list-item>
			</v-menu>
		</v-bottom-navigation>
		-->
		<connect-dialog/>
		<connection-dialog/>
		<file-transfer-dialog/>
		<messagebox-dialog/>
		<plugin-install-dialog/>
		<component v-for="component in injectedComponentNames" :is="component" :key="component"/>
	</v-app>
</template>

<script>
'use strict'

import Vue from 'vue'
import Piecon from 'piecon'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { Menu, Routes } from './routes'
import { isPrinting, StatusType } from './store/machine/modelEnums.js'
import ToolsPanel from './components/panels/ToolsPanel.vue'
import PositionPanel from './components/panels/PositionPanel.vue'

import { MachineMode } from './store/machine/modelEnums.js';
import { DashboardMode } from './store/settings.js'


export default {
  components: { ToolsPanel, PositionPanel },
	computed: {
		...mapMutations(['cambiarMenu']),
		...mapState({
			isLocal: state => state.isLocal,
			globalShowConnectDialog: state => state.showConnectDialog,

			boards: state => state.machine.model.boards,
			menuDirectory: state => state.machine.model.directories.menu,
			name: state => state.machine.model.network.name,
			status: state => state.machine.model.state.status,

			darkTheme: state => state.settings.darkTheme,
			temaBio: state => state.settings.temaBio, // domotek
			webcam: state => state.settings.webcam,
			machineMode: state => state.machine.model.state.machineMode,
			bottomNavigation: state => state.settings.bottomNavigation,
			iconMenu: state => state.settings.iconMenu,

			injectedComponents: state => state.uiInjection.injectedComponents,

			menuT: state => state.mostrarMenu,
			heaterTools: state => state.machine.model.heat.heaters,
			nameTools: state => state.machine.model.tools,
		}),
		...mapState('settings',['dashboardMode']),
		...mapGetters('machine', ['hasTemperaturesToDisplay']),
		...mapGetters('machine/model', ['jobProgress']),
		categories() {
			return Object.keys(Menu)
				.map(key => Menu[key])
				.filter(item => item.condition || item.pages.some(page => page.condition));
		},
		currentPageCondition() {
			const currentRoute = this.$route;
			let checkRoute = function(route, isChild) {
				let flag = (route.path === currentRoute.path && route.condition);
				if (!flag && isChild) {
					let curPath = currentRoute.path.replace(/\/$/, '');
					if (curPath.endsWith(route.path))
						flag = (curPath.substring(0, curPath.length-route.path.length) + route.path === curPath && route.condition)
				}
				if (!flag && route.children !== undefined) {
					flag = route.children.some(child => checkRoute(child, true));
				}
				return flag;
			};
			return Routes.some(route => checkRoute(route));
		},
		bioNombre() { // domotek: nombre de la máquina separado para colorear "BIO"
			const n = this.name || '';
			const m = n.match(/^(domo)(BIO|MAT)(.*)$/i);
			return m ? { domo: 'domo', marca: m[2].toUpperCase(), resto: m[3] } : { domo: n, marca: '', resto: '' };
		},
		bioPuerta() {
			try {
				const v = this.$store.state.machine.model.global.doorStateOpen;
				return (v === undefined || v === null) ? null : !!v;
			} catch (e) { return null; }
		},
		bioTemps() { // domotek: plataforma + una casilla por tool
			const h = this.heaterTools || [];
			const val = x => (!x || x.current === undefined || x.current <= -273) ? null : x.current.toFixed(1);
			const out = [{ et: this.$t('domotek.tools.platform'), vl: val(h[0]) }];
			const n = (this.nameTools || []).length;
			for (let i = 0; i < n && i < 4; i++) {
				out.push({ et: `T${i + 1}`, vl: val(h[i + 1]) });
			}
			return out;
		},
		isPrinting() {
			return isPrinting(this.status);
		},
		railItems() {
			return [
				{ id: 'home', icon: 'mdi-home-variant-outline', label: 'Inicio' },
				{ id: 'tools', icon: 'mdi-tools', label: 'Herramientas', ruta: '/Files/tools' },
				{ id: 'job', icon: 'mdi-play', label: 'Trabajos', ruta: '/Job/Status' },
				{ id: 'move', icon: 'mdi-arrow-all', label: 'Movimiento', ruta: '/' }
			];
		},
		railItemsAbajo() {
			const items = [{ id: 'settings', icon: 'mdi-cog-outline', label: 'Ajustes', ruta: '/Settings/General' }];
			if (this.$store.state.nivelUsuario >= 3) {
				items.push({ id: 'machine', icon: 'mdi-cogs', label: 'Máquina', ruta: '/Settings/Machine' });
			}
			return items;
		},
		railActivo() {
			if (this.mostrarHome) { return 'home'; }
			const path = (this.$route.path || '').toLowerCase();
			const item = this.railItems.concat(this.railItemsAbajo).find(i => i.ruta && i.ruta.toLowerCase() === path);
			return item ? item.id : null;
		},
		isFFForUnset() {
			if (this.dashboardMode === DashboardMode.default) {
				return !this.machineMode || this.machineMode === MachineMode.fff;
			}
			return this.dashboardMode === DashboardMode.fff;
		},
		showBottomNavigation() {
			return this.$vuetify.breakpoint.mobile && !this.$vuetify.breakpoint.xsOnly && this.bottomNavigation;
		},
		modeloMaquina: {
			get() {
					try {
							return this.$store.state.machine.model.global.MachineModel ;
					} catch (error) {
							console.log(`error app.vue modeloMaquina`);
							return 0;
					}
			}
		},
	},
	data() {
		return {
			drawer: this.$vuetify.breakpoint.lgAndUp,
			drawer2: true, //domotek
			hideGlobalContainer: true, //domotek
			wasXs: this.$vuetify.breakpoint.xsOnly, //domotek
			injectedComponentNames: [],
			showConnectButton: process.env.NODE_ENV === 'development',
			mostrarHome: true, //domotek //Luis - cambia entre el inicio y los paneles
			MenuTools: false, //domotek
			numMenuSelect: 0, //domotek
			snackbarES:false,
			snackbarValorES:"HV WARNING",
		}
	},
	filters: {
		
	},
	methods: {
		...mapActions(['connect', 'disconnectAll']),
		...mapActions('settings', ['load']),
		...mapMutations(['cambiarUsuario']), //domotek
		changeMenu(){ //domotek
			this.cambiarMenu; //domotek
		},//domotek
		hiddenStatus(){ //domotek
			console.log("Oculta los paneles"); //domotek
		},//domotek
		isExpanded(category) {
			if (this.$vuetify.breakpoint.xsOnly) { //domotek
				const route = this.$route;
				return category.pages.some(page => page.path === route.path);
			}
			return true;
		},
		getPages(category) {
			return category.pages.filter(page => page.condition);
		},
		updateTitle() {
			if (this.status === StatusType.disconnected) {
				document.title = `(${this.name})`;
			} else {
				const jobProgress = this.jobProgress;
				const title = ((jobProgress > 0 && isPrinting(this.status)) ? `(${(jobProgress * 100).toFixed(1)}%) ` : '') + this.name;
				if (document.title !== title) {
					document.title = title;
				}
			}
		},
		replaceFilter: function(string) {
			var domoBIO="";
			var domoMAT="";
			var reemplazo=""; 
			domoBIO+="<span style='color:#0a21ad;font-weight:bold;'>domo</span>";
			domoBIO+="<span style='color:#ffb812;font-weight:bold;'>BIO</span>";
			domoMAT+="<span style='color:#0a21ad;font-weight:bold;'>domo</span>";
			domoMAT+="<span style='color:#ffb812;font-weight:bold;'>MAT</span>";
			//reemplazo=string.replace("domoBIO", domoBIO);
			//reemplazo=string.replace("domoMAT", domoMAT);
			reemplazo=string.replace("domoBIO", domoBIO);
			reemplazo=reemplazo.replace("domoMAT", domoMAT);
			reemplazo=reemplazo.replace("domobio", domoBIO);

			return reemplazo;
		},
		railClick(item) { // domotek: barra lateral del tema oscuro
			if (item.id === 'home') {
				this.mostrarHome = true;
			} else {
				this.cambiarRuta(item.ruta);
				this.mostrarHome = false;
			}
		},
		cambiarRuta(ruta){  // domotek
			if (this.$route.path !== ruta){
				console.log("Cambio de Ruta"); //domotek
				console.log(ruta); //domotek

				this.$router.push(ruta); // domotek
			}
			//else
			//{
			//	console.log("No hay cambio de Ruta, ya estamos en la ruta"); //domotek
			//} 
		},// domotek
		HVStatus: {
			get() {
					try {
							this.snackbarES = true;
							this.snackbarValorES = "HV WARNING";
							return !(this.$store.state.machine.model.state.gpOut[1].pwm<1);
					} catch (error) {
							console.log(`error app.vue HVStatus`);
							return 0;
					}
			}
		}
	},
	mounted() {
		// Attempt to disconnect from every machine when the page is being unloaded
		window.addEventListener('unload', this.disconnectAll);

		// Connect if running on a board
		if (process.env.NODE_ENV === 'production') {
			this.connect();
		}

		// Attempt to load the settings
		this.load();
		this.$vuetify.theme.dark = this.temaBio || this.darkTheme; // domotek

		// Validate navigation
		Vue.prototype.$vuetify = this.$vuetify;
		this.$router.beforeEach((to, from, next) => {
			if (Routes.some(route => route.path === to.path && !route.condition)) {
				next('/');
			} else {
				next();
			}
		});

		// Set up Piecon
		Piecon.setOptions({
			color: '#00f',			// Pie chart color
			background: '#bbb',		// Empty pie chart color
			shadow: '#fff',			// Outer ring color
			fallback: false			// Toggles displaying percentage in the title bar (possible values - true, false, 'force')
		});
	},
	watch: {
		currentPageCondition(to) {
			if (!to) {
				this.$router.push('/');
			}
		},
		darkTheme(to) {
			this.$vuetify.theme.dark = to || this.temaBio;
		},
		temaBio(to) { // domotek
			this.$vuetify.theme.dark = to || this.darkTheme;
		},
		status(to, from) {
			if (to === StatusType.disconnected || from === StatusType.disconnected) {
				this.updateTitle();
			}

			const printing = isPrinting(to);
			if (printing !== isPrinting(from)) {
				if (printing) {
					// Go to Job Status when a print starts
					if (this.$router.currentRoute.path !== '/Job/Status') {
						//console.log("Cambio de Ruta pedida this.$router.currentRoute.path:"+this.$router.currentRoute.path)
						//console.log("Cambio de Ruta pedida this.$route.path:"+this.$route.path)
						
						this.$router.push('/Job/Status');
						
					}
					//if (this.$route.path !== ruta){
					//	console.log("Cambio de Ruta"); //domotek
					//	this.$router.push(ruta); // domotek
					//}


				} else {
					// Remove the Piecon again when the print has finished
					Piecon.reset();
				}
			}
		},
		name() { this.updateTitle(); },
		jobProgress(to, from) {
			if (isPrinting(this.status) && Math.round(to * 100) !== Math.round(from * 100)) {
				Piecon.setProgress(to * 100);
			}
			this.updateTitle();
		},
		injectedComponents() {
			this.injectedComponents.forEach(function(item) {
				if (this.injectedComponentNames.indexOf(item.name) === -1) {
					this.$options.components[item.name] = item.component;
					this.injectedComponentNames.push(item.name);
				}
			}, this);
		}
	}
}
</script>

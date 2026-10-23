<style>
	#selectorCfg.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
    height: 48px;
    min-height: 0;
    min-width: 300px;
    }
	.btnContinue {
		height: 48px;
		width: 120px;
	} 
	.btnSelectorSelected {
		border-left-style: none !important;
		border-right-style: none !important;
	}
	.btnSelectorUnselected {
		border-style: none !important;
	}

	.v-stepper__step__step {
		font-size: 1rem !important;
	}
	.etiqueta {
	font-size: 1.3rem;
	color:black;	
	}
	.valor {
	font-size: 1.3rem;
	font-weight: bold;	
	color:#0a21ad;
	}
	.v-label {
		color:black!important;	
		font-size: 1.3rem !important;
	}
	.snack {
		font-size: 4rem !important;
	}

	/* Menos relleno en los pasos del stepper de este panel (evita el scroll vertical en la pantalla de la impresora) */
	.panelStepper .v-stepper__content {
		padding: 8px 12px 8px 12px !important;
	}
</style>
<template>
<div class="es-raiz">
	<!-- domotek: mantener temperaturas con el tema oscuro -->
	<div v-if="temaBio" class="bio-pp">
		<header class="bio-proc-cab">
			<button type="button" class="bio-volver" :aria-label="$t('domotek.tools.back')" @click="closeDialog"><v-icon>mdi-chevron-left</v-icon></button>
			<v-icon color="var(--bio-calor)">mdi-thermometer-lines</v-icon>
			<span class="bio-proc-titulo">{{ $t('domotek.jobs.keepTemps') }}</span>
		</header>
		<main class="bio-proc-cuerpo">
			<p class="bio-tenue bio-proc-nota">{{ $t('domotek.proc.keepTempsHint') }}</p>
			<div class="bio-proc-lista">
				<div v-for="f in bioFilas" :key="f.id" class="fila grande">
					<span class="ic"><v-icon>{{ f.icono }}</v-icon></span>
					<span class="txt"><strong>{{ f.nombre }}</strong><small>{{ f.detalle }}</small></span>
					<span class="pildora" :class="{ on: f.valor }">{{ f.valor ? $t('domotek.proc.on') : $t('domotek.proc.off') }}</span>
					<button type="button" class="interruptor" :class="{ on: f.valor }" role="switch" :aria-checked="f.valor" :aria-label="f.nombre" @click="f.cambiar(!f.valor)"><i></i></button>
				</div>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-principal ancho" @click="StartSaveSettings()"><span class="bio-cap">{{ $t('domotek.varios.save') }}</span></button>
			</footer>
		</main>
	</div>
	<v-row v-else class="mb-0 pb-0"  > 
		<v-col cols="12" align="center" class="py-0">
			<v-stepper v-model="pasos" class="blue lighten-5 panelStepper"  >
				<v-stepper-header class="Stephead">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
						<v-icon x-large> mdi-thermometer </v-icon> 
					</v-btn>
					<v-stepper-step editable step="S"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="S">
						<v-card class="mb-0" color="blue lighten-4" :height="panelCardPx">
							<v-card id="vcselectorCfg" outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px">	
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-0 text-center">{{ $t('domotek.varios.generalSettings') }}</p>
								<v-row style="height:30px;margin:0px;" class="ma-0 ">
									<v-col cols="2" class="ma-0 pa-0">
									</v-col>
									<v-col cols="10" align="left" class="ma-0 pl-2 pt-0">
										<!--<v-checkbox v-model="enableTMPTools" :label="'Keep Tool temperatures'" class=""></v-checkbox>-->
										<v-checkbox 
  											v-model="enableTMPTools" 
  											:label="$t('panel.temperatures.toolTemperatures')" 
 											class="">
										</v-checkbox>
										<!--<v-checkbox v-model="enableTMPBed" :label="'Keep Bed temperatures'" class=""></v-checkbox> -->
										<v-checkbox 
  											v-model="enableTMPBed" 
  											:label="$t('panel.temperatures.bedTemperatures')" 
 											class="">
										</v-checkbox>
										<v-checkbox 
											v-if="ChamberMode"
  											v-model="enableTMPChamber" 
  											:label="$t('panel.temperatures.chamberTemperatures')" 
 											class="">
										</v-checkbox>
									</v-col>
								</v-row>		
							</v-card>
							
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>{{ $t('domotek.varios.save') }}
								<v-icon class="mr-1">mdi-floppy</v-icon>
							</v-btn>
							<!-- <v-btn v-if="isprinting == 'idle' || isprinting == 'paused'" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartClean();" rounded>RUN ONCE</v-btn>
							<v-btn v-if="isprinting != 'idle' && isprinting != 'paused'" class="btnContinue mt-10 mr-5" color="#ffb812" @click="StartCleanPausing();" rounded>RUN ONCE</v-btn> -->
							<!-- <v-btn class="btnContinue mt-10 " color="primary" @click="CambiaStep('1')"> Change <v-icon dark right> mdi-wrench-outline </v-icon></v-btn> -->
							
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</v-col>
	</v-row>
			<!-- Dialogos y aviso dentro de la misma columna: asi no crean filas vacias que alargan el panel -->
			<v-dialog v-model="dialogTMP" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogTMP = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogTMP = false" outlined rounded>
									<code-btn width="120" height="48" :code='`${codigo}`' :log="false" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }}
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="dialogTMP_SAV" max-width="500">
				<v-card>
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogTMP_SAV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogTMP_SAV = false" outlined rounded>
									<code-btn width="120" height="48" :code='`${codigo}`' :log="false" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }}
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-snackbar content-class="snack" v-model="snackbar" :timeout="400" absolute left top :min-width="50"   color="light-blue white--text" >
				{{this.snackbarValor}}
			</v-snackbar>
</div>
</template>
<script>
'use strict'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	data(){
		return{
			dialogTMP: false,
			codigo:null,
			nombreMacro: null,
			pasos: 'S',
			rutaMacro: '',
			codigoExp: '',
			param1Macro: '',
			param2Macro: '',
			param3Macro: '',
			dialogTMP_SAV: false,
			benched: 0,
			selectedItem: 5,
			snackbar:false,
			snackbarValor:"0",
			// --- Altura del panel: se ajusta a la pantalla (igual que en los paneles UV y ES) ---
			windowHeight: window.innerHeight,
			panelOffsetPx: 80,		// alto que ocupan cabecera del stepper + margenes (subir si vuelve a salir scroll)
			panelMinPx: 350,		// altura minima de la tarjeta
			panelMaxPx: 400,		// altura maxima (para que en el PC no quede una tarjeta enorme)
		}
	},
	computed:{
		...mapState({
			boards: state => state.machine.model.boards,
		}),
		
		...mapGetters('machine/model', ['global']),
		
		
		
		enableTMPBed: {
			get() {
				return this.$store.state.machine.model.global.enableTMPBed},
			set(value){
				this.sendCode(`set global.enableTMPBed = ${value}`);
			}			
		},
		enableTMPTools: {
			get() {
				return this.$store.state.machine.model.global.enableTMPTools},
			set(value){
				this.sendCode(`set global.enableTMPTools = ${value}`);
			}			
		},
		enableTMPChamber: {
			get() {
				return this.$store.state.machine.model.global.enableTMPChamber},
			set(value){
				this.sendCode(`set global.enableTMPChamber = ${value}`);
			}			
		},
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioFilas() {
			const m = this.$store.state.machine.model;
			const heat = m.heat || {};
			const actual = lista => {
				const h = (lista || []).filter(i => i !== null && i >= 0).map(i => (heat.heaters || [])[i]).find(x => x);
				return (h && typeof h.current === 'number') ? `${this.$t('domotek.keypad.current')} ${this.$display(h.current, 1)} °C` : '';
			};
			const nombresTools = (m.tools || []).filter(t => t).map(t => t.name || `T${t.number}`).join(' · ');
			const filas = [
				{ id: 'tools', icono: 'mdi-printer-3d-nozzle-outline', nombre: this.$t('panel.temperatures.toolTemperatures'), detalle: nombresTools, valor: !!this.enableTMPTools, cambiar: v => { this.enableTMPTools = v; } },
				{ id: 'bed', icono: 'mdi-radiator', nombre: this.$t('panel.temperatures.bedTemperatures'), detalle: actual(heat.bedHeaters), valor: !!this.enableTMPBed, cambiar: v => { this.enableTMPBed = v; } }
			];
			if (this.ChamberMode) {
				filas.push({ id: 'chamber', icono: 'mdi-cube-outline', nombre: this.$t('panel.temperatures.chamberTemperatures'), detalle: actual(heat.chamberHeaters), valor: !!this.enableTMPChamber, cambiar: v => { this.enableTMPChamber = v; } });
			}
			return filas;
		},
		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		},
		ChamberMode: {
			get() {
				return this.$store.state.machine.model.global.ChamberMode},		
		},	
		// Altura de la tarjeta: llena la pantalla sin hacer scroll
		panelCardPx() {
			return Math.round(Math.min(this.panelMaxPx, Math.max(this.panelMinPx, this.windowHeight - this.panelOffsetPx)));
		},



	},
	methods: {
		...mapActions('machine', ['sendCode']),
		closeDialog(){
			this.$emit('close-dialog');
		},
		StartSaveSettings(){
			this.dialogTMP_SAV = true;
			console.info(`Grabamos config TMP`);
			this.nombreMacro = this.$t('domotek.varios.confirm_settings');
			this.codigo = '';
			this.codigo += 'M28 "/sys/declare_variablesTMP.g"' + '\n';
			this.codigo += "global variablesTMP = 1" + '\n';
			this.codigo += "global enableTMPBed = "+ this.$store.state.machine.model.global.enableTMPBed + '\n';
			this.codigo += "global enableTMPTools = "+ this.$store.state.machine.model.global.enableTMPTools + '\n';
			this.codigo += "global enableTMPChamber = "+ this.$store.state.machine.model.global.enableTMPChamber + '\n';
			
			this.codigo += 'M29' + '\n';
		},
		onWindowResize() {
			this.windowHeight = window.innerHeight;
		},
		CambiaStep(newStep){
			this.pasos = newStep;
		},
		

	},	
	mounted() {
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
		this.$vuetify.goTo(0);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onWindowResize);
	},
	
	watch: {
	},
	created() {
	},
	updated() {
	},
}
</script>
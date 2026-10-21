<!-- Posiblemente este modulo ya no este en uso -->

<!-- <style scoped>
	.FondoIzdaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FondoIzdaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
	.FondoDchaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FondoDchaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
	.FrenteIzdaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FrenteIzdaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
	.FrenteDchaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FrenteDchaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
</style> -->

<template>
	<v-row class="mb-0 pb-0">
		<v-col class="ml-2 mt-2">
			<v-icon>mdi-axis-arrow</v-icon><span class="mt-5 ml-2">{{  $t('domotek.calibracion.calibrate_button') }}</span>
			<!-- <v-icon>mdi-radiobox-marked</v-icon><span class="mt-5 ml-2">Calibration</span> -->
		</v-col>
		<v-col cols="12" align="center">
			<v-stepper v-model="pasos" non-linear class="blue lighten-5"  >
				<v-stepper-header>
					<v-stepper-step editable step="1" color="teal">
					</v-stepper-step>

					<v-divider></v-divider>

					<v-stepper-step editable step="2" color="teal">
					</v-stepper-step>

					<v-divider></v-divider>

					<v-stepper-step editable step="3" color="teal">
					</v-stepper-step>

					<!-- <v-divider></v-divider> -->

					<!-- <v-stepper-step editable step="4" color="teal"> 
						
					</v-stepper-step> -->
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="1" class="">
						<v-card class="mb-4" color="teal lighten-4"	height="270px" elevation="0">
								<v-row class="pa-5">
									<v-col cols="12" class="mt-7">
										{{ $t('domotek.calibracion.autoCal') }}
									</v-col>
									<v-col cols="12">
										<v-btn class="mt-8 blue lighten-5" @click="SelectCalibration(0)" rounded block>
											<v-row>
												<v-col cols="12">
													<span>{{ $t('domotek.calibracion.start') }}</span>
												</v-col>
											</v-row>
										</v-btn>
									</v-col>
								</v-row>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="2">
						<v-card class="mb-4" color="teal lighten-4"	height="270px">
							<v-row class="pt-3">
								<v-col cols="2"/>
								<v-col cols="2" class="mt-1 " >
									<icon-base v-if="valFOI == 0" width="96" height="96" icon-name="write"><icon-izquierda /></icon-base>	
									<icon-base v-if="valFOI < 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-left-left /> <icon-turn-value offsetX="75" :valor = nivelFOI /></icon-base>
									<icon-base v-if="valFOI > 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-right-left /> <icon-turn-value offsetX="75" :valor = nivelFOI /></icon-base>
								</v-col>
								<v-col cols="4" class="mt-15" >
									{{ $t('domotek.calibracion.platformLeveling') }}
								</v-col>
								<v-col cols="2" class="mt-1 ">
									<icon-base v-if="valFOD == 0" width="96" height="96" icon-name="write"><icon-derecha /></icon-base>	
									<icon-base v-if="valFOD < 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-left-right /> <icon-turn-value offsetX="145" :valor = nivelFOD /></icon-base>
									<icon-base v-if="valFOD > 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-right-right /> <icon-turn-value offsetX="145" :valor = nivelFOD /></icon-base>		
								</v-col>
								<v-col cols="2"/>
							</v-row>
							<v-row class="pb-1">
								<v-col cols="2"/>
								<v-col cols="2" class="mt-1 ">
									<icon-base v-if="valFRI == 0" width="96" height="96" icon-name="write"><icon-izquierda /></icon-base>	
									<icon-base v-if="valFRI < 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-left-left /> <icon-turn-value offsetX="75" :valor = nivelFRI /></icon-base>
									<icon-base v-if="valFRI > 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-right-left /> <icon-turn-value offsetX="75" :valor = nivelFRI /></icon-base>
								</v-col>
								<v-col cols="4"  class="mt-9">
									<v-btn class="mt-1 blue lighten-5" @click="SelectCalibration(1)" rounded block>
										<v-row>
											<v-col cols="12" class="mt-1">
												<span>{{ $t('domotek.calibracion.start') }}</span>
											</v-col>
										</v-row>
									</v-btn>
								</v-col>
								<v-col cols="2" class="mt-1 ">
									<icon-base v-if="valFRD == 0" width="96" height="96" icon-name="write"><icon-derecha /></icon-base>	
									<icon-base v-if="valFRD < 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-left-right /> <icon-turn-value offsetX="145" :valor = nivelFRD /></icon-base>
									<icon-base v-if="valFRD > 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-right-right /> <icon-turn-value offsetX="145" :valor = nivelFRD /></icon-base>
								</v-col>
								<v-col cols="2"/>
							</v-row>	
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="3">
						<v-card class="mb-4" color="teal lighten-4"	height="270px">
								<movement-panel-calibration></movement-panel-calibration>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				
			</v-stepper>
		</v-col>
		<v-col cols="12" v-if="$store.state.nivelUsuario >= 3">
			<calibration-file-list></calibration-file-list>
		</v-col>
		<v-col class="mb-0 pb-0">
			<v-dialog v-model="dialog" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						<!-- You sure want to select {{nombreCal}} calibration? -->
						{{ $t(nombreCal) }}
					</v-card-title>
					<v-card-actions>
						<!-- <v-spacer></v-spacer> -->
						<v-row>
							<v-col cols="6" align="right">
								<v-btn width="90" height="90" color="green darken-1" text @click="dialog = false,ChangeTool(numTool),toolClick = true" outlined rounded>
									{{ $t('domotek.varios.no') }}
								</v-btn>
							</v-col>
							<v-col>
								<v-btn width="90" height="90" color="green darken-1" text @click="dialog = false, toolClick = false, numTool = null" outlined rounded>
									<code-btn width="90" height="90" :code='`M98 p${codigo}`' color="green darken-1" rounded>
										{{ $t('domotek.varios.yes') }}
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
	</v-row>
</template>


<script>
'use strict'

import { registerRoute } from '..'
import { mapState } from 'vuex'

export default {
	install() {
		// Register a route via Files -> Macros
		registerRoute(this, {
			Files: {
				Calibration: {
					icon: 'mdi-radiobox-marked',
					caption: 'Calibración',
					path: '/Files/Calibracion',
					nivel: 0 //luis - control de usuario

				}
			}
		});
	},
	data(){
		return{
			dialog: false,
			codigo:null,
			nombreCal: null,
			pasos: 1,
			//nivelFOI: -1,
			//nivelFOD: 1,
			//nivelFRI: -1,
			//nivelFRD: 1,

		}
	},
	computed:{
		...mapState('machine/model', {
				boards: state => state.boards,
			}),
			nivelFOI: {
				get() {
					const valor_nivelFOI = this.$store.state.machine.model.global.calibrPnt0;
					return (valor_nivelFOI);
				}
			},
			valFOI: {
				get() {
					const valor_valFOI = this.$store.state.machine.model.global.calibrVal0;
					return (valor_valFOI);
				}
			},
			nivelFRI: {
				get() {
					const valor_nivelFRI = this.$store.state.machine.model.global.calibrPnt1;
					return (valor_nivelFRI);
				}
			},
			valFRI: {
				get() {
					const valor_valFRI = this.$store.state.machine.model.global.calibrVal1;
					return (valor_valFRI);
				}
			},
			nivelFRD: {
				get() {
					const valor_nivelFRD = this.$store.state.machine.model.global.calibrPnt2;
					return (valor_nivelFRD);
				}
			},
			valFRD: {
				get() {
					const valor_valFRD = this.$store.state.machine.model.global.calibrVal2;
					return (valor_valFRD);
				}
			},
			nivelFOD: {
				get() {
					const valor_nivelFOD = this.$store.state.machine.model.global.calibrPnt3;
					return (valor_nivelFOD);
				}
			},
			valFOD: {
				get() {
					const valor_valFOD = this.$store.state.machine.model.global.calibrVal3;
					return (valor_valFOD);
				}
			},
	},
	methods: {
		SelectCalibration(numero){
			this.dialog = true;
			this.codigo = '"/calibration/';
			switch (numero) {
				case 0:
					this.codigo += '01_AUTO_CAL vs Z_endstop.g"';
					this.nombreCal = 'domotek.calibracion.dialogAutoCal';
					break;
				case 1:
					this.codigo += '02_Manual Bed Leveling Assistant.g"';
					this.nombreCal = 'domotek.calibracion.dialogPlatformLeveling';
					break;
				case 2:
					this.codigo += '04_T_izq Z offset.g"';
					this.nombreCal = "domotek.calibracion.dialogT0Z"
					break;
				case 3:
					this.codigo += '04_T_dercha Z offset.g"';
					this.nombreCal = "domotek.calibracion.dialogT1Z"
					break;
				case 4:
					this.codigo += '03_T0_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT0Z';
					break;
				case 5:
					this.codigo += '03_T1_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT1Z';
					break;
				case 6:
					this.codigo += '03_T2_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT2Z';
					break;
				case 7:
					this.codigo += '03_T3_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT3Z';
					break;
				default:
					break;
			}
		},
	},
	mounted() {
		this.$vuetify.goTo(0);
	}
}
</script>






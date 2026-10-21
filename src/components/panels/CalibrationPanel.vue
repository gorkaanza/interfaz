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
	<v-row class="mb-0 pb-0"  style="background-color: #e3f2fd ;">
		<v-col class="ml-2 mt-2">
			<v-icon>mdi-axis-arrow</v-icon><span class="mt-5 ml-2">{{ $t('domotek.calibracion.calibrate_button') }}</span>
			<!-- <v-icon>mdi-radiobox-marked</v-icon><span class="mt-5 ml-2">Calibration</span> -->
		</v-col>
		<v-col cols="12" align="center">
			<v-stepper v-model="pasos" non-linear class="blue lighten-5"  >
				<v-stepper-header v-if="modeloMaquina != 'HK'">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
						<v-icon large> mdi-axis-arrow </v-icon>
					</v-btn>
					<v-stepper-step editable step="1" color="#0a21ad">
					</v-stepper-step>

					<v-divider></v-divider>

					<v-stepper-step editable step="2" color="#0a21ad">
					</v-stepper-step>

					<v-divider></v-divider>

					<v-stepper-step editable step="3" color="#0a21ad">
					</v-stepper-step>

					<!-- <v-divider></v-divider> -->

					<!-- <v-stepper-step editable step="4" color="teal"> 
						
					</v-stepper-step> -->
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-header v-else>
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
						<v-icon large> mdi-axis-arrow </v-icon>
					</v-btn>
					<v-stepper-step editable step="1" color="#0a21ad">
					</v-stepper-step>

					

					<v-divider></v-divider>

					<v-stepper-step editable step="3" color="#0a21ad">
					</v-stepper-step>

					<!-- <v-divider></v-divider> -->

					<!-- <v-stepper-step editable step="4" color="teal"> 
						
					</v-stepper-step> -->
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="1" class="">
						<v-card class="mb-4" color="blue lighten-4"	height="270px" elevation="0">
								<v-row class="pa-5">
									<v-col cols="12" class="mt-7">
										{{ $t('domotek.calibracion.autoCal') }}
									</v-col>
									<v-col cols="12">
										<v-btn class="mt-8 blue lighten-5" @click="SelectCalibration(0)" :disabled="calibrando" rounded block>
											<v-row>
												<v-col cols="12">
													<span>{{$t('domotek.calibracion.start')}}</span>
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
						<v-card class="mb-4" color="blue lighten-4"	height="270px">
							<v-row class="pt-3">
								<v-col cols="2"/>
								<v-col cols="2" class="mt-1 " >
									<icon-base v-if="valFOI == 0" width="96" height="96" icon-name="write"><icon-izquierda /></icon-base>	
									<icon-base v-if="valFOI < 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-left-left /> <icon-turn-value offsetX="75" :valor = nivelFOI /></icon-base>
									<icon-base v-if="valFOI > 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-right-left /> <icon-turn-value offsetX="75" :valor = nivelFOI /></icon-base>
								</v-col>
								<v-col cols="4" class="mt-4 text-center">
									<div style="font-size: 1.2em;">
										{{ $t('domotek.calibracion.platformLeveling') }}
									</div>
									<div class="mt-3 text-left" style="font-size: 0.85em; display: inline-block;">
										<div class="d-flex align-center mb-2">
											<div class="mr-2" style="width: 12px; height: 12px; background-color: green; border-radius: 50%;"></div>
											<span>{{ $t('domotek.calibracion.greenLegend') }}</span>
										</div>
										<div class="d-flex align-center">
											<div class="mr-2" style="width: 12px; height: 12px; background-color: red; border-radius: 50%;"></div>
											<span>{{ $t('domotek.calibracion.redLegend') }}</span>
										</div>
									</div>
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
								<v-col cols="4" class="mt-9">
									<v-btn v-if="!calibrandoPaso2" class="mt-1 blue lighten-5" @click="SelectCalibration(1)" :disabled="calibrando" rounded block>
										<v-row>
											<v-col cols="12" class="mt-1">
												<span>{{ $t('domotek.calibracion.start') }}</span>
											</v-col>
										</v-row>
									</v-btn>

									<div v-else class="mt-1">
										<v-progress-linear
											indeterminate
											rounded
											height="8"
											color="blue darken-2"
										></v-progress-linear>
										<div class="text-center mt-2" style="font-size: 0.85em;">
											{{ $t('domotek.calibracion.leveling') }}
										</div>
									</div>
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
						<v-card class="mb-4" color="blue lighten-4"	height="270px">
								<movement-panel-calibration :calibrando-externo="calibrando"></movement-panel-calibration>
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
									<code-btn width="90" height="90"  color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col>
								<v-btn width="90" height="90" color="green darken-1" text outlined rounded :disabled="calibrando" @click="ConfirmarCalibracion">
									<code-btn width="90" height="90" color="green lighten-3" rounded>
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

//import { registerRoute } from '..'
import { mapState } from 'vuex'

export default {
	/* install() {
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
	}, */
	data(){
		return{
			dialog: false,
			codigo:null,
			nombreCal: null,
			pasos: 1,
			calibrando: false,
			numeroActual: null
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
			modeloMaquina: {
				get() {
						try {
								return this.$store.state.machine.model.global.MachineModel ;
						} catch (error) {
								console.log(`error CalibrationPanel.vue modeloMaquina`);
								return "2A";
						}
				}
			},
			calibrandoPaso2() {
				return this.calibrando && this.numeroActual === 1;
			}
	},
	methods: {
		closeDialog(){
			this.$emit('close-dialog');
		},
		SelectCalibration(numero){
			this.dialog = true;
			this.numeroActual = numero;
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
			// Enviar el comando M98 a la impresora
			//this.sendGCode('M98 P"0:/macros/Pruebas_AUTO-CAL/Enable-Disable/habilitar.g"');
		},
		async ConfirmarCalibracion(){
			this.dialog = false;
			this.toolClick = false;
			this.numTool = null;

			this.calibrando = true;
			try {
			await this.$store.dispatch('machine/sendCode', { code: `M98 p${this.codigo}` });
			} catch (e) {
			console.error('Error ejecutando calibración:', e);
			// opcional: mostrar snackbar/alerta
			} finally {
			this.calibrando = false;
			}
		},
		// async sendGCode(gcode) {
		// 	try {
		// 		await fetch('/machine/code', {
		// 			method: 'POST',
		// 			headers: { 'Content-Type': 'application/json' },
		// 			body: JSON.stringify({ code: gcode })
		// 		});
		// 		console.log(`Enviado: ${gcode}`);
		// 	} catch (error) {
		// 		console.error('Error enviando GCODE:', error);
		// 	}
		// }
	},
	mounted() {
		this.$vuetify.goTo(0);
	}
}
</script>






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
	<v-row class="mb-0 pb-0"  > 
		<v-col cols="12" align="center" class="py-0">
			<v-stepper v-model="pasos" class="blue lighten-5 panelStepper"  >
				<v-stepper-header class="Stephead">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
						<v-icon x-large> mdi-brush-variant </v-icon> 
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
										<!-- <v-checkbox v-model="enableCL" :label="'Enable Clean'" class=""></v-checkbox>--> 
										<v-checkbox 
  											v-model="enableCL" 
  											:label="$t('panel.clean.enableClean')" 
 											class="">
										</v-checkbox>
									</v-col>
								</v-row>
								<v-row style="height: 62px; margin-left: 180px" align="center">  
									<!-- Segundo checkbox -->
									<v-col cols="5">
										<v-checkbox 
										:disabled="!enableCL" 
										v-model="cadenceEnableCL" 
										:label="$t('domotek.varios.cleanDuringES') + ' ' + (exposureTimeSeconds / 60).toFixed(2)  + ' ' + $t('domotek.varios.minutes')"  
										class="etiqueta align-center justify-center">
										</v-checkbox>
									</v-col>

									<!-- Botón, solo aparece si ambos checkbox están activos -->
									<v-col cols="6" v-show="enableCL && cadenceEnableCL">
										<v-btn
										x-large
										outlined
										color="#1976d2"
										@click="openTimeDialog"
										>
										<v-icon left>mdi-timer-outline</v-icon>
										<span class="title font-weight-bold mr-2">{{ (exposureTimeSeconds / 60).toFixed(2) }}</span>
										<span class="subtitle-1">{{ $t('panel.electrospinning.minutes') }}</span>
										</v-btn>
									</v-col>
								</v-row>		
							</v-card>
							
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>{{ $t('domotek.varios.save') }}
								<v-icon class="mr-1">mdi-floppy</v-icon>
							</v-btn>
							<v-btn v-if="isprinting == 'idle' || isprinting == 'paused'" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartClean();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn v-if="isprinting != 'idle' && isprinting != 'paused'" class="btnContinue mt-10 mr-5" color="#fb8c00" @click="StartCleanPausing();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<!-- <v-btn class="btnContinue mt-10 " color="primary" @click="CambiaStep('1')"> Change <v-icon dark right> mdi-wrench-outline </v-icon></v-btn> -->
						</v-card>
						<v-dialog v-model="dialogManualTime" persistent max-width="380px">
							<v-card>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('panel.electrospinning.timeInMinutes') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<!-- Campo de texto único para el tiempo -->
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualTimeInput" @keydown="handleKeydownManualInput" outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.timeRange]" :error-messages="manualTimeError"></v-text-field>
											</v-col>
										</v-row>

										<!-- Teclado Numérico Personalizado -->
										 <div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<!-- <v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleTimeKeyPress(key.value)" :disabled="key.value === 'DEL' && !manualTimeInput.length" > -->
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleTimeKeyPress(key.value)">	
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualTime">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualTime" :disabled="!!manualTimeError || !manualTimeInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
			<!-- Dialogos y aviso dentro de la misma columna: asi no crean filas vacias que alargan el panel -->
			<v-dialog v-model="dialogCL" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogCL = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogCL = false" outlined rounded>
									<code-btn width="120" height="48" :code='`${codigo}`' :log="false" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }}
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="dialogCL_SAV" max-width="500">
				<v-card>
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogCL_SAV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogCL_SAV = false" outlined rounded>
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
		</v-col>
	</v-row>
</template>
<script>
'use strict'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	data(){
		return{
			dialogCL: false,
			codigo:null,
			nombreMacro: null,
			pasos: 'S',
			rutaMacro: '',
			codigoExp: '',
			param1Macro: '',
			param2Macro: '',
			param3Macro: '',
			dialogCL_SAV: false,
			
			benched: 0,
			selectedItem: 5,
			snackbar:false,
			snackbarValor:"0",
			// --- Altura del panel: se ajusta a la pantalla (igual que en el panel de temperaturas) ---
			windowHeight: window.innerHeight,
			panelOffsetPx: 80,		// alto que ocupan cabecera del stepper + margenes (subir si vuelve a salir scroll)
			panelMinPx: 350,		// altura minima de la tarjeta
			panelMaxPx: 400,		// altura maxima: en la pantalla de la impresora llena el hueco y en el PC no crece mas
			dialogManualTime: false,
			dialogTimePicker: false,
			manualTimeInput: '',
			manualTimeError: '',
			keypadLayout: [ // Definición del layout del teclado
                [{text: '7', value: '7'}, {text: '8', value: '8'}, {text: '9', value: '9'}],
                [{text: '4', value: '4'}, {text: '5', value: '5'}, {text: '6', value: '6'}],
                [{text: '1', value: '1'}, {text: '2', value: '2'}, {text: '3', value: '3'}],
                [{text: '.', value: '.'}, {text: '0', value: '0'}, {icon: 'mdi-backspace-outline', value: 'DEL', color: 'blue lighten-4'}],
				[{text: '', value: 'EMPTY'}, {text: 'C', value: 'CLEAR', color: 'blue lighten-4'}, {text: '', value: 'EMPTY'}]
            ],
			rules: { // Reglas para los text fields (aunque la validación principal es en handleKeyPress)
				timeRange: value => {
					if (value === '' || value === null) return true; // Permitir vacío mientras escribe

					const num = parseFloat(value);

					const min = 0.1;
					const max = 120;

					if (isNaN(num) || num < min || num > max) {
						return this.$t('panel.electrospinning.timeRangeErrorDetailed', {
							min,
							max,
							val: value
						});
					}

					return true;
				},

				required: value => !!value || this.$t('domotek.varios.valorRequerido'),
				positiveNumber: value => {
					const num = Number(value);
					return !isNaN(num) && num > 0 || this.$t('domotek.varios.numeroPositivo');
				}
            }            
		}
	},
	computed:{
		...mapState({
			boards: state => state.machine.model.boards,
		}),
		
		...mapGetters('machine/model', ['global']),
		
		
		
		enableCL: {
			get() {
				return this.$store.state.machine.model.global.enableCL},
			set(value){
				this.sendCode(`set global.enableCL = ${value}`);
			}			
		},
		cadenceEnableCL: {
			get() {
				return this.$store.state.machine.model.global.cadenceEnableCL},
			set(value){
				this.sendCode(`set global.cadenceEnableCL = ${value}`);
			}			
		},
		cadenceAmountCL: {
			get() {
				return this.$store.state.machine.model.global.cadenceAmountCL},
			set(value){
				this.sendCode(`set global.cadenceAmountCL = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;
			}			
		},

		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		},
		exposureTimeSeconds() {
			return this.$store.state.machine.model.global.cadenceAmountCL;
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
			this.dialogCL_SAV = true;
			console.info(`Grabamos config CL`);
			this.nombreMacro = this.$t('domotek.varios.confirm_settings');
			this.codigo = '';
			this.codigo += 'M28 "/sys/declare_variablesCL.g"' + '\n';
			this.codigo += "global variablesCL = 1" + '\n';
			this.codigo += "global enableCL = "+ this.$store.state.machine.model.global.enableCL + '\n';
			this.codigo += "global cadenceEnableCL = "+ this.$store.state.machine.model.global.cadenceEnableCL + '\n';
			this.codigo += "global cadenceAmountCL = "+ this.$store.state.machine.model.global.cadenceAmountCL + '\n';
			
			this.codigo += 'M29' + '\n';
		},
		
		StartClean(){
			this.dialogCL = true;
			console.info(`Run once Clean`);
			this.nombreMacro = this.$t('domotek.varios.confirm_clean');
			this.codigo = 'M98 P"/macros/Scripts/CLMacro.g"';
		},
		StartCleanPausing(){
			this.dialogCL = true;
			console.info(`Run once Clean`);
			this.nombreMacro = this.$t('panel.clean.clJobInProgress');
		},
		onWindowResize() {
			this.windowHeight = window.innerHeight;
		},
		CambiaStep(newStep){
			this.pasos = newStep;
		},
		openTimeDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			//this.manualTimeInput = this.exposureTimeSeconds.toString();
			this.manualTimeInput = (this.exposureTimeSeconds / 60).toFixed(2).toString();
			this.manualTimeError = ''; // Limpia errores previos
			this.dialogManualTime = true;
		},

		handleTimeKeyPress(key) {
			if (key === 'DEL') {
				this.manualTimeInput = this.manualTimeInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualTimeInput = '';
			} else {
				if (this.manualTimeInput.length < 5) { // Límite de 5 dígitos
					this.manualTimeInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateTime();
		},
		validateTime() {
			const value = this.manualTimeInput;
			const ruleRequired = this.rules.required(value);
			if (ruleRequired !== true) {
				this.manualTimeError = ruleRequired;
				return;
			}

			const rulePositive = this.rules.positiveNumber(value);
			if (rulePositive !== true) {
				this.manualTimeError = rulePositive;
				return;
			}

			// Si todas las reglas pasan, se limpia el error
			this.manualTimeError = '';
		},

		/**
		 * Cierra el diálogo sin guardar cambios.
		 */
		cancelManualTime() {
			this.dialogManualTime = false;
		},

		/**
		 * Confirma el valor, lo guarda y llama a tu método principal.
		 */
		confirmManualTime() {
			this.validateTime();
			if (this.manualTimeError) return;

			const minutes = parseFloat(this.manualTimeInput);
			const newValue = Math.round(minutes * 60); // convierte a segundos

			this.sendCode(`set global.cadenceAmountCL = ${newValue}`);

			//this.ChangeSelectedExp(newValue); // actualiza gcode si aplica

			this.dialogManualTime = false;
		},
		//Validacion de caracteres por teclado
		handleKeydownManualInput(event) {
			const allowedKeys = [
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
			];

			// Permitir teclas de control
			if (allowedKeys.includes(event.key)) {
				// Obtener el valor actual y el valor seleccionado en el campo
				const input = event.target;
				const currentVal = input.value;
				const selectionStart = input.selectionStart;
				const selectionEnd = input.selectionEnd;

				// No permitir más de 5 caracteres si se intenta añadir uno nuevo
				const isCharKey = event.key.length === 1 && !['Backspace', 'Delete'].includes(event.key);

				// Si es punto, y ya hay uno, lo bloqueamos
				if (event.key === '.' && currentVal.includes('.')) {
					event.preventDefault();
					return;
				}

				if (isCharKey) {
					const newLength = 
						currentVal.length - (selectionEnd - selectionStart) + 1;
					if (newLength > 5) {
						event.preventDefault();
					}
				}
			} else {
				// Bloquear cualquier otra tecla no permitida
				event.preventDefault();
			}
		}
		

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
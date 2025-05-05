<style>
	#selectorPatt.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
		height: 48px;
		min-height: 0;
		min-width: 300px;
	}
	#selectorSyr.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
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
</style>
<template>
	<v-row class="mb-0 pb-0"  > 
		<v-col cols="12" align="center">
			<v-stepper v-model="pasos" class="blue lighten-5 "  >
				<v-stepper-header class="Stephead">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
							<v-img  src="@/assets/uv-ray.svg" contain max-height="40" max-width="40"></v-img>
					</v-btn>
					<v-stepper-step editable step="S"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="1"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="2"  color="#0a21ad" class="Stephead_step" />
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="1">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	style="height: 250px; width: 800px">	

								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">	{{ $t('panel.ultraviolet.ultravioletParams') }}	</p>

								<template	v-if="uvProbe">
									<v-icon  large style="color: yellow;" mr-1>	mdi-flash	</v-icon>
									<span style="color:red; ">	<strong>{{ $t('panel.jobControl.warninguv') }}</strong>	</span>
									<v-icon large style="color: yellow;" mr-1>	mdi-flash	</v-icon>								
								</template>

								<span class="px-2 subtitle-2" :class="statusClass">
									{{ statusText }}
								</span>
								<v-row style="height:60px;">  
									<v-col cols="4" align="right">
										<p class="etiqueta">{{ $t('domotek.varios.exposureheightMm') }}</p>
									</v-col>
									<v-col cols="7" align="left">
										<v-slider v-model="alturaUV" :thumb-size="24" step="5" thumb-label="always"  :max="maxAlturaUV" :min="minAlturaUV" label="" > </v-slider>
									</v-col>		
								</v-row>
								<v-row style="height:60px;">  
									<v-col cols="4" align="right">
										<p class="etiqueta">{{ $t('panel.ultraviolet.UvPower') }}</p>
									</v-col>
									<v-col cols="7" align="left">
										<v-slider v-model="potenciaUV" :thumb-size="24" step="5" thumb-label="always" :max="maxPotenciaUV" :min="minPotenciaUV" label=""> </v-slider>
									</v-col>		
								</v-row>
								<v-row style="height:60px;">  
									<v-col cols="4" align="right">
										<p  class="etiqueta" >{{ $t('domotek.varios.exposureTimeS') }}</p>
									</v-col>
									<v-col cols="7" align="left">
										<v-slider v-model="exposicionUV" :thumb-size="24" step="1" thumb-label="always" :max="maxExposureTimeUV" :min="minExposureTimeUV" label="" > </v-slider>
									</v-col>		
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('S')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10 "  color="primary" @click="CambiaStep('2')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn> 
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="2">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	style="height: 250px; width: 800px">	
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">	{{ $t('panel.ultraviolet.ultravioletParams') }}	</p>

								<template	v-if="uvProbe">
									<v-icon  large style="color: yellow;" mr-1>	mdi-flash	</v-icon>
									<span style="color:red; ">	<strong>{{ $t('panel.jobControl.warninguv') }}</strong>	</span>
									<v-icon large style="color: yellow;" mr-1>	mdi-flash	</v-icon>								
								</template>
								
								<v-row style="height:40px;margin-left:40px;">  
									<v-checkbox v-model="enableUV" :label="$t('panel.ultraviolet.autoUvMode')"  class="etiqueta align-center justify-center"></v-checkbox>		
								</v-row>
								<v-row style="height:40px;margin-left:140px;">  
									<v-checkbox :disabled="!enableUV" v-model="firstLayerUV" :label="$t('panel.ultraviolet.applyBefore')"  class="etiqueta align-center justify-center"></v-checkbox>	
								</v-row>
								<v-row style="height:62px;margin-left:128px;">  
										<v-col cols=5 >
											<v-checkbox :disabled="!enableUV" v-model="cadenceEnableUV" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountUV + ' ' + $t('domotek.varios.layers')"  class="etiqueta align-center justify-center"></v-checkbox>	
										</v-col>
										<v-col cols=6 v-show="enableUV">
											<v-slider style="margin:35px 0px 0px 0px; width:200px;" v-model="cadenceAmountUV" :thumb-size="32" step="1" thumb-label="always" :max="10" :min="0" label="" > </v-slider>
										</v-col>
								</v-row>
								<v-row style="height:40px;margin-left:140px;">  
									<v-checkbox :disabled="!enableUV" v-model="aplicarFinUV" :label="$t('panel.ultraviolet.applyWhen')"  class="etiqueta align-center justify-center"></v-checkbox>								
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('1')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10"  color="primary" @click="CambiaStep('S')"> {{ $t('domotek.varios.settings') }} <v-icon dark right> mdi-cog </v-icon></v-btn> 
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="S">
						<v-card class="mb-4" color="blue lighten-4"	height="350px">
							<v-card id="vcselectorSyr" outlined class="blue lighten-4" style="height: 250px; width: 800px">	
								<p	style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-0 text-center">   {{ $t('panel.ultraviolet.ultravioletSettings') }}	</p>
								
								<template	v-if="uvProbe">
									<v-icon  large style="color: yellow;" mr-1>	mdi-flash	</v-icon>
									<span style="color:red; ">	<strong>{{ $t('panel.jobControl.warninguv') }}</strong>	</span>
									<v-icon large style="color: yellow;" mr-1>	mdi-flash	</v-icon>								
								</template>
					
								<v-row style="height:30px;" class="ma-0" >  
									<v-col cols="2" align="right">
									</v-col>		
									<v-col cols="5" align="left">
										<div class="etiqueta">{{ $t('domotek.varios.exposureheightMm') }}</div>
									</v-col>
									<v-col cols="3" align="right">
										<div class="valor ">{{alturaUV}}</div> 
									</v-col>
									<v-col cols="2" align="right">
									</v-col>		
								</v-row>
								<v-row style="height:30px;" class=" ma-0" > 
									<v-col cols="2" align="right">
									</v-col>		
									<v-col cols="5" align="left">
										<div class="etiqueta">{{ $t('panel.ultraviolet.autoUvMode') }}</div>
									</v-col>
									<v-col cols="3" align="right">
										<div class="valor ">{{potenciaUV}}</div> 
									</v-col>
									<v-col cols="2" align="right">
									</v-col>		
								</v-row>
								<v-row style="height:30px;" class=" ma-0" > 
									<v-col cols="2" align="right" class="">
									</v-col>		
									<v-col cols="5" align="left" class="">
										<div class="etiqueta">{{ $t('domotek.varios.exposureTimeS') }}</div>
									</v-col>
									<v-col cols="3" align="right" class="">
										<div class="valor ">{{exposicionUV}}</div> 
									</v-col>
									<v-col cols="2" align="right" class="">
									</v-col>		
								</v-row>
								<v-row style="height:30px;margin:0px;" class="ma-0 ">
									<v-col cols="2" class="ma-0 pa-0">
									</v-col>
									<v-col cols="10" align="left" class="ma-0 pl-2 pt-0">
										<v-checkbox readonly v-model="enableUV" :label="$t('panel.ultraviolet.autoUvMode')" class=""></v-checkbox> 
										<!-- <div class="valor">UV automatic active</div> --> 
									</v-col>
									
								</v-row>		
								<v-row style="height:30px;margin:0px;" class="ma-0">
									<v-col cols="2">
									</v-col>
									<v-col cols="10" align="left">
										<!-- <div class="valor ml-10">Apply after first layer(sterilize surface)</div> -->
										<v-checkbox readonly :disabled="!enableUV" v-model="firstLayerUV" :label="$t('panel.ultraviolet.applyBefore')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
									
								</v-row>
								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2">
									</v-col>
									<v-col cols="10" align="left">
										<v-checkbox readonly :disabled="!enableUV" v-model="cadenceEnableUV" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountUV + ' ' + $t('domotek.varios.layers')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox> 
									</v-col>
									
								</v-row>
								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2">
									</v-col>
									<v-col cols="10" align="left">
										<v-checkbox  readonly :disabled="!enableUV" v-model="aplicarFinUV" :label="$t('panel.ultraviolet.applyWhen')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox> 
									</v-col>
								</v-row>

							</v-card>
							
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>{{ $t('domotek.varios.save') }}
								<v-icon class="mr-1">mdi-floppy</v-icon>
							</v-btn>
							<v-btn v-if="isprinting == 'idle' || isprinting == 'paused'" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartUltraviolet();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn v-if="isprinting != 'idle' && isprinting != 'paused'" class="btnContinue mt-10 mr-5" color="#ffb812" @click="StartUltravioletPausing();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn class="btnContinue mt-10 " color="primary" @click="CambiaStep('1')"> {{ $t('domotek.varios.change') }} <v-icon dark right> mdi-wrench-outline </v-icon></v-btn>
							
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</v-col>
		<v-col class="mb-0 pb-0">
			<v-dialog v-model="dialogUV" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV = false" outlined rounded>
									<code-btn width="120" height="48" :code='`${codigo}`' :log="false" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }}
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
		<v-col class="mb-0 pb-0">
			<v-dialog v-model="dialogUV_SAV" max-width="500">
				<v-card>
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV_SAV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV_SAV = false" outlined rounded>
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
			dialogUV: false,
			codigo:null,
			nombreMacro: null,
			pasos: 'S',
			rutaMacro: '',
			codigoExp: '',
			param1Macro: '',
			param2Macro: '',
			param3Macro: '',
			dialogUV_SAV: false,
			maxAlturaUV:120,
			minAlturaUV:20,
			maxPotenciaUV:100,
			minPotenciaUV:0,
			maxExposureTimeUV:300,
			minExposureTimeUV:1,
			benched: 0,
			selectedItem: 5,
			snackbar:false,
			snackbarValor:"0",
		}
	},
	computed:{
		...mapState({
			boards: state => state.machine.model.boards,
		}),
		...mapState('machine/model', {
			gpOuts: state => state.state.gpOut
		}),
		...mapGetters('machine/model', ['global']),
		
		alturaUV: {
			get() {
				const valor_alturaUV = this.$store.state.machine.model.global.alturaUV;
				return (valor_alturaUV);
			},
			set(value) {
				this.sendCode(`set global.alturaUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;

			}
		},
		potenciaUV: {
			get() {
				const valor_potenciaUV=this.$store.state.machine.model.global.potenciaUV;
				return valor_potenciaUV},
			set(value){
				this.sendCode(`set global.potenciaUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;

			}
		},
		exposicionUV: {
			get() {
				return this.$store.state.machine.model.global.exposicionUV},
			set(value){
				this.sendCode(`set global.exposicionUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;
			}			
			

		},
		aplicarFinUV: {
			get() {
				return this.$store.state.machine.model.global.aplicarFinUV},
			set(value){
				this.sendCode(`set global.aplicarFinUV = ${value}`);
			}			
		},
		enableUV: {
			get() {
				return this.$store.state.machine.model.global.enableUV},
			set(value){
				this.sendCode(`set global.enableUV = ${value}`);
			}			
		},
		firstLayerUV: {
			get() {
				return this.$store.state.machine.model.global.firstLayerUV},
			set(value){
				this.sendCode(`set global.firstLayerUV = ${value}`);
			}			
		},
		cadenceEnableUV: {
			get() {
				return this.$store.state.machine.model.global.cadenceEnableUV},
			set(value){
				this.sendCode(`set global.cadenceEnableUV = ${value}`);
			}			
		},
		cadenceAmountUV: {
			get() {
				return this.$store.state.machine.model.global.cadenceAmountUV},
			set(value){
				this.sendCode(`set global.cadenceAmountUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;
			}			
		},
		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		},
		uvProbe(){
			if ((this.gpOuts[9].pwm > 0)||(this.gpOuts[10].pwm > 0)||(this.gpOuts[11].pwm > 0)||(this.gpOuts[12].pwm > 0))	{	return true;	}
			else {	return false;	}
		},
		// uvProbe(){
		// 	if ((this.gpOuts[9].pwm > 0)||(this.gpOuts[10].pwm > 0)||(this.gpOuts[11].pwm > 0)||(this.gpOuts[12].pwm > 0)) {
				
		// 		return this.$t('panel.jobControl.warninguv');
		// 		//"WARNING HIGH VOLTAGE";
		// 		//;return this.$t(this.isPaused ? 'panel.jobControl.resumeSimulation' : 'panel.jobControl.pauseSimulation');
		// 	}
		// 	return "";
		// }

	},
	methods: {
		...mapActions('machine', ['sendCode']),
		closeDialog(){
			this.$emit('close-dialog');
		},
		StartSaveSettings(){
			this.dialogUV_SAV = true;
			console.info(`Grabamos config UV`);
			this.nombreMacro = this.$t('domotek.varios.confirm_settings');
			this.codigo = '';
			this.codigo += 'M28 "/sys/declare_variablesUV.g"' + '\n';
			this.codigo += "set global.variablesUV = 1"+ '\n';	
			this.codigo += "set global.alturaUV = "+ this.$store.state.machine.model.global.alturaUV + '\n';
			this.codigo += "set global.potenciaUV = "+ this.$store.state.machine.model.global.potenciaUV + '\n';
			this.codigo += "set global.exposicionUV = "+ this.$store.state.machine.model.global.exposicionUV + '\n';
			this.codigo += "set global.aplicarFinUV = "+ this.$store.state.machine.model.global.aplicarFinUV + '\n';
			this.codigo += "set global.enableUV = "+ this.$store.state.machine.model.global.enableUV + '\n';
			this.codigo += "set global.firstLayerUV = "+ this.$store.state.machine.model.global.firstLayerUV + '\n';
			this.codigo += "set global.cadenceEnableUV = "+ this.$store.state.machine.model.global.cadenceEnableUV + '\n';
			this.codigo += "set global.cadenceAmountUV = "+ this.$store.state.machine.model.global.cadenceAmountUV + '\n';
			this.codigo += 'M29' + '\n';
		},
		StartUltraviolet(){
			this.dialogUV = true;
			console.info(`Run once UV`);
			this.nombreMacro = this.$t('domotek.varios.confirm_UV');
			this.codigo = 'M98 P"/macros/Scripts/UVMacro.g"';
		},
		StartUltravioletPausing(){
			this.dialogUV = true;
			console.info(`Run once UV`);
			this.nombreMacro = 'Job in progress, would you like to launch UV?';
			this.codigo = 'M25'+'\n'+'M98 P"/macros/Scripts/UVMacro.g"'+'\n'+'M24';
		},
		CambiaStep(newStep){
			this.pasos = newStep;
		},
		

	},	
	mounted() {
		this.$vuetify.goTo(0);
	},
	
	watch: {
	},
	created() {
	},
	updated() {
	},
}
</script>
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
</style>
<template>
	<v-row class="mb-0 pb-0"  > 
		<v-col cols="12" align="center">
			<v-stepper v-model="pasos" class="blue lighten-5 "  >
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
						<v-card class="mb-4" color="blue lighten-4"	height="350px">
							<v-card id="vcselectorCfg" outlined class="blue lighten-4" style="height: 250px; width: 800px">	
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
							</v-card>
							
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>{{ $t('domotek.varios.save') }}
								<v-icon class="mr-1">mdi-floppy</v-icon>
							</v-btn>
							<v-btn v-if="isprinting == 'idle' || isprinting == 'paused'" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartClean();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn v-if="isprinting != 'idle' && isprinting != 'paused'" class="btnContinue mt-10 mr-5" color="#ffb812" @click="StartCleanPausing();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<!-- <v-btn class="btnContinue mt-10 " color="primary" @click="CambiaStep('1')"> Change <v-icon dark right> mdi-wrench-outline </v-icon></v-btn> -->
							
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</v-col>
		<v-col class="mb-0 pb-0">
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
		</v-col>
		<v-col class="mb-0 pb-0">
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

		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		}		

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
			this.nombreMacro = 'Job in progress, would you like to launch Clean?';
			this.codigo = 'M25'+'\n'+'M98 P"/macros/Scripts/CLMacro.g"'+'\n'+'M24';
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
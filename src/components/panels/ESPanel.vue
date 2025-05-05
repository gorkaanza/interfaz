<style >
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
	.btnInfo {
		font-size: 1.1rem !important;

	}

</style>

<template>
	<v-row class="mb-0 pb-0"  > 
		<v-col cols="12" align="center">
			<v-stepper v-model="pasos" class="blue lighten-5 "  >
				<v-stepper-header class="Stephead">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">	
						<!--<v-icon x-large> mdi-flare </v-icon>-->
						<v-img  src="@/assets/ES_logo.svg" contain max-height="45" max-width="45"></v-img>  
					</v-btn>
					<v-stepper-step editable step="S"  color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="1"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="2"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="3"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="4"  color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="5"  color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="6"  color="#0a21ad" class="Stephead_step" />
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="S">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card id="vcselectorRes" outlined class="blue lighten-4" style="height: 250px;">	

								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-0 text-center">{{ $t('panel.electrospinning.electrospinningSettings') }}</p>

								<template	v-if= hvProbe>
									<v-icon	large style="color: yellow;" mr-1>mdi-flash</v-icon>
									<span	style="color:red" >		<strong> {{ $t('panel.jobControl.warninghv') }} </strong>		</span>
									<v-icon	large style="color: yellow;" mr-1>mdi-flash</v-icon>
								</template>

								<v-row style="height:30px;" class="ma-0 mt-5" >  
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0">
									</v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<span class="etiqueta">{{ $t('domotek.varios.heightMm') }}</span><span class="ml-30 valor">{{alturaES}}</span>
									</v-col>		
								</v-row><div class=""></div>
								<v-row style="height:30px;margin:0px;" class="ma-0 ">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0">
									</v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<v-checkbox readonly v-model="enableES" :label="$t('panel.electrospinning.autoEsMode')"  class=""></v-checkbox>
									</v-col>
								</v-row>		
								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4">
									</v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6">
										<v-checkbox readonly :disabled="!enableES" v-model="cadenceEnableES" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountES + ' ' + $t('domotek.varios.layers')"  class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
								</v-row>
								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4">
									</v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6">
										<v-checkbox  readonly :disabled="!enableES" v-model="aplicarFinES" :label="$t('panel.electrospinning.applyWhen')"  class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox> 
									</v-col>
								</v-row>
								<v-row style="height:60px;" class="ml-5 mr-5 mt-0">
									<v-col cols="2" sm="0" md="3" lg="3" xl="3">
									</v-col>
									<v-col cols="1" sm="12" md="6" lg="6" xl="6">
										<v-row class="mt-2 " align="center" justify="center">
											<v-btn v-show="patronES == 1"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>{{ $t('domotek.varios.allPlatform') }}</strong></v-btn>
											<v-btn v-show="patronES == 2"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>{{ $t('domotek.varios.centered') }}</strong></v-btn>
											<v-btn v-show="syrModelES == 10"		class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>10 ml</strong> {{ $t('domotek.varios.syringe') }}</v-btn>
											<v-btn v-show="syrModelES == 5"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>5 ml</strong> {{ $t('domotek.varios.syringe') }}</v-btn> 
											<v-btn v-show="syrModelES == 3"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>3 ml</strong> {{ $t('domotek.varios.syringe') }}</v-btn>
											<v-btn v-show="syrModelES == 1"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>1 ml</strong> {{ $t('domotek.varios.syringe') }}</v-btn>
											<v-btn v-show="calibreES == 21"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>21</strong> {{ $t('domotek.varios.ga') }}</v-btn>
											<v-btn v-show="calibreES == 22"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>22</strong> {{ $t('domotek.varios.ga') }}</v-btn>
											<v-btn v-show="calibreES == 25"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>25</strong> {{ $t('domotek.varios.ga') }}</v-btn>
											<v-btn v-show="calibreES == 27"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>27</strong> {{ $t('domotek.varios.ga') }}</v-btn>
											<!-- <v-btn v-show="flujoES == 5" 			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.05</strong> ml / min</v-btn> -->		<!-- Lo quito porque no funciona con ES ALL PLATFORM, no hay archivos "Patrones" en la carpeta  2024/07/08	-->
											<!-- <v-btn v-show="flujoES == 7" 			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.07</strong> ml / min</v-btn> -->		<!-- Lo quito porque no funciona con ES ALL PLATFORM, no hay archivos "Patrones" en la carpeta  2024/07/08	-->
											<v-btn v-show="flujoES == 10" 			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.10</strong> {{ $t('domotek.varios.mlMin') }}</v-btn>
											<v-btn v-show="flujoES == 15"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.15</strong> {{ $t('domotek.varios.mlMin') }}</v-btn>
											<v-btn v-show="flujoES == 20"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.20</strong> {{ $t('domotek.varios.mlMin') }}</v-btn>
											<v-btn v-show="flujoES == 30"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.30</strong> {{ $t('domotek.varios.mlMin') }}</v-btn>
											<v-btn v-show="exposureTimeES == 30" 	class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>0.5</strong> {{ $t('domotek.varios.min') }}</v-btn>
											<v-btn v-show="exposureTimeES == 60" 	class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>1.0</strong> {{ $t('domotek.varios.min') }}</v-btn>
											<v-btn v-show="exposureTimeES == 120"	class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>2.0</strong> {{ $t('domotek.varios.min') }}</v-btn>
											<v-btn v-show="exposureTimeES == 180" 	class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>3.0</strong> {{ $t('domotek.varios.min') }}</v-btn>
										</v-row>
										

									</v-col>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>{{ $t('domotek.varios.save') }} <v-icon class="mr-1">mdi-floppy</v-icon> </v-btn>
							<v-btn v-if="((isprinting == 'idle') || (isprinting == 'paused'))" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartElectrospinning();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn v-if="((isprinting != 'idle') && (isprinting != 'paused'))" class="btnContinue mt-10 mr-5" color="#ffb812" @click="StartElectrospinningPausing();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn class="btnContinue mt-10 " color="primary" @click="CambiaStep('1')"> {{ $t('domotek.varios.change') }} <v-icon dark right> mdi-wrench-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>

				<v-stepper-items>
					<v-stepper-content step="1">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	 height="250px">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 text-center">{{ $t('panel.electrospinning.electrospinningPattern') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorPatt" class="blue lighten-4" v-model="patronES" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<v-btn :value="1" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedPatt(1);" rounded> {{ $t('domotek.varios.allPlatform') }}</v-btn>
												<v-btn :value="2" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedPatt(2);" rounded>{{ $t('domotek.varios.centered') }}</v-btn>
											</v-col>
										</v-row>
									</v-btn-toggle>
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('S')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('2')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="2">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card id="vcselectorSyr" outlined class="blue lighten-4" style="height: 250px;">	
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 text-center">{{ $t('panel.electrospinning.electrospinningSyrMod') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorSyr" class="blue lighten-4" v-model="syrModelES" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<v-btn :value ="10" active-class="teal lighten-3" class=" ma-1 blue lighten-5 text-none" @click="ChangeSelectedSyr(10);" rounded>{{ $t('panel.electrospinning.diconNEX10ml') }}</v-btn>
												<!-- <v-btn :value ="5" active-class="teal lighten-3" class=" ma-1 blue lighten-5 text-none" @click="ChangeSelectedSyr(5);"  rounded>diconNEX        (5 ml)</v-btn> -->
												<v-btn :value ="3" active-class="teal lighten-3" class=" ma-1 blue lighten-5 text-none" @click="ChangeSelectedSyr(3);"  rounded>{{ $t('panel.electrospinning.diconNEX3ml') }}</v-btn>
												<!-- <v-btn :value ="1" active-class="teal lighten-3" class=" ma-1 blue lighten-5 text-none" @click="ChangeSelectedSyr(1);"  rounded>Braun Omnifix F (1 ml)</v-btn> -->
											</v-col>	
										</v-row>
									</v-btn-toggle>	
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('1')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('3')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="3">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	 height="250px">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 text-center"> {{ $t('panel.electrospinning.electrospinningNeedGauge') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorGau" class="blue lighten-4" v-model="calibreES" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<v-btn :value = "21" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedGau(21);"  rounded>21 GA</v-btn>
												<v-btn :value = "22" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedGau(22);"  rounded>22 GA</v-btn>
												<v-btn :value = "25" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedGau(25);"  rounded>25 GA</v-btn>
												<v-btn :value = "27" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedGau(27);"  rounded>27 GA</v-btn>
											</v-col>	
										</v-row>
									</v-btn-toggle>	
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('2')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('4')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="4">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	 style="height: 250px;">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2  text-center">{{ $t('panel.electrospinning.electrospinningFlow') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorFr" class="blue lighten-4" v-model="flujoES" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<!-- <v-btn :value ="5" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedFlow(5);" rounded>0.05 ml / min</v-btn> -->		<!-- Lo quito porque no funciona con ES ALL PLATFORM, no hay archivos "Patrones" en la carpeta  2024/07/08	-->
												<!-- <v-btn :value ="7" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedFlow(7);" rounded>0.07 ml / min</v-btn> -->		<!-- Lo quito porque no funciona con ES ALL PLATFORM, no hay archivos "Patrones" en la carpeta  2024/07/08	-->
												<v-btn :value ="10" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedFlow(10);" rounded>0.10 ml / min</v-btn>
												<v-btn :value ="15" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedFlow(15);" rounded>0.15 ml / min</v-btn>
												<v-btn :value ="20" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedFlow(20);" rounded>0.20 ml / min</v-btn>
												<v-btn :value ="30" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedFlow(30);" rounded>0.30 ml / min</v-btn>
											</v-col>
										</v-row>
									</v-btn-toggle>
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('3')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('5')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="5">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	 style="height: 250px;">	
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 text-center">{{ $t('panel.electrospinning.electrospinningExpTime') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorEt" class="blue lighten-4" v-model="exposureTimeES" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<v-btn :value ="30" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedExp(30);" rounded>0.5 min</v-btn>
												<v-btn :value ="60" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedExp(60);" rounded>1.0 min</v-btn>
												<v-btn :value ="120" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedExp(120);" rounded>2.0 min</v-btn>
												<v-btn :value ="180" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedExp(180);" rounded>3.0 min</v-btn>
											</v-col>	
										</v-row>
									</v-btn-toggle>	
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('4')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('6')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="6">
						<v-card class="mb-4 blue lighten-4"	height="350px">
							<v-card outlined class="blue lighten-4"	style="height: 250px; width: 800px">	
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">{{ $t('panel.electrospinning.electrospinningParams') }}</p>
								<v-row style="height: 40px;margin:20px 0px 0px 40px;">  
									<v-col cols="6" align="left">
										<p class="etiqueta">{{ $t('domotek.varios.exposureheightMm') }}</p>
									</v-col>
									<v-col cols="5" align="left">
										<v-slider v-model="alturaES" :thumb-size="24" step="5" thumb-label="always"  :max="maxAlturaES" :min="minAlturaES" label="" > </v-slider>
									</v-col>		
								</v-row>
								<v-row style="height:40px;margin-left:40px;">  
									<v-checkbox v-model="enableES" :label="$t('panel.electrospinning.autoEsMode')"  class="etiqueta align-center justify-center"></v-checkbox>		
								</v-row>
								<v-row style="height:62px;margin-left:128px;">  
										<v-col cols=5 >
											<v-checkbox :disabled="!enableES" v-model="cadenceEnableES" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountES + ' ' + $t('domotek.varios.layers')"  class="etiqueta align-center justify-center"></v-checkbox>
										</v-col>
										<v-col cols=6 v-show="enableES">
											<v-slider style="margin:35px 0px 0px 0px; width:200px;" v-model="cadenceAmountES" :thumb-size="32" step="1" thumb-label="always" :max="10" :min="0" label="" > </v-slider>
										</v-col>
								</v-row>
								<v-row style="height:40px;margin-left:140px;">  
									<v-checkbox :disabled="!enableES" v-model="aplicarFinES" :label="$t('panel.electrospinning.applyWhen')"  class="etiqueta align-center justify-center"></v-checkbox>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('5')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10"  color="primary" @click="CambiaStep('S')">  {{ $t('domotek.varios.settings') }} <v-icon dark right> mdi-cog </v-icon></v-btn> 
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>	
		</v-col>
		<v-col class="mb-0 pb-0">
			<v-dialog v-model="dialogES" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogES = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogES = false" outlined rounded>
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
			<v-dialog v-model="dialogES_SAV" max-width="500">
				<v-card>
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogES_SAV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogES_SAV = false" outlined rounded>
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
		<v-col>
			<v-snackbar content-class="snack" v-model="snackbar" :timeout="400" absolute left top :min-width="50"   color="light-blue white--text" >
					{{this.snackbarValor}}
			</v-snackbar>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'
// import es from './es.json'
export default {
	data(){
		return{
			codigo:null,
			nombreMacro: null,
			dialogES: false,
			dialogES_SAV: false,
			pasos: 'S',
			rutaMacro: '',
			param1Macro: '',
			param2Macro: '',
			param3Macro: '',
			patron: 1,
			calibre: 21,
			flujo: 10 ,
			exposureTime: 30,
			syrModel: 10,
			codigoPatt: '',
			codigoGau: '',
			codigoFlow: '',
			codigoExp: '',
			codigoSyr: '',
			maxAlturaES:120,
			minAlturaES:15,
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

		hvProbe() {
			if ((this.gpOuts[1].pwm > 0)||(this.gpOuts[2].pwm > 0)||(this.gpOuts[3].pwm > 0)||(this.gpOuts[4].pwm > 0))		{	return true;	}
			else {	return false;	}
		},
		
		patronES: {
			get() {
				return this.$store.state.machine.model.global.patronES},
			set(value){
				this.sendCode(`set global.patronES = ${value}`);
			}			
		},
		calibreES: {
			get() {
				return this.$store.state.machine.model.global.calibreES},				
			set(value){
				this.sendCode(`set global.calibreES = ${value}`);
			}
		},
		flujoES: {
			get() {
				return this.$store.state.machine.model.global.flujoES},
			set(value){
				this.sendCode(`set global.flujoES = ${value}`);
			}
		},
		exposureTimeES: {
			get() {
				return this.$store.state.machine.model.global.exposureTimeES},
			set(value){
				this.sendCode(`set global.exposureTimeES = ${value}`);
			}
		},
		syrModelES: {
			get() {
				return this.$store.state.machine.model.global.syrModelES},
			set(value){
				this.sendCode(`set global.syrModelES = ${value}`);
			}
		},

		enableES: {
			get() {
				return this.$store.state.machine.model.global.enableES},
			set(value){
				this.sendCode(`set global.enableES = ${value}`);
			}			
		},
		
		cadenceEnableES: {
			get() {
				return this.$store.state.machine.model.global.cadenceEnableES},
			set(value){
				this.sendCode(`set global.cadenceEnableES = ${value}`);
			}			
		},
		cadenceAmountES: {
			get() {
				return this.$store.state.machine.model.global.cadenceAmountES},
			set(value){
				this.sendCode(`set global.cadenceAmountES = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;
			}			
		},
		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		},
		
		aplicarFinES: {
			get() {
				return this.$store.state.machine.model.global.aplicarFinES},
			set(value){
				this.sendCode(`set global.aplicarFinES = ${value}`);
			}			
		},
		alturaES: {
			get() {
				const valor_alturaES = this.$store.state.machine.model.global.alturaES;
				return (valor_alturaES);
			},
			set(value) {
				this.sendCode(`set global.alturaES = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;

			}
		},


	},
	methods: {
		...mapActions('machine', ['sendCode']),
		closeDialog(){
			this.$emit('close-dialog');
		},
		StartElectrospinning(){
			this.dialogES = true;
			console.info(`Lanzamos macro de ElectroSpinning`);
			this.nombreMacro = this.$t('domotek.varios.confirm_electospinning');
			this.codigo = 'M98 P"/macros/Scripts/ESMacro.g"';
		},
		StartElectrospinningPausing(){
			this.dialogES = true;
			console.info(`Run once ES`);
			this.nombreMacro = 'Job in progress, would you like to launch ES?';
			this.codigo = 'M25'+'\n'+'M98 P"/macros/Scripts/ESMacro.g"'+'\n'+'M24';
		},
		CambiaStep(newStep){
			this.pasos = newStep;
		},

/*import methods*/
		StartSaveSettings(){
			this.dialogES_SAV = true;
			console.info(`Grabamos config ES`);
			this.nombreMacro = this.$t('domotek.varios.confirm_settings');
			//guardamos ruta
			console.info(this.codigoPatt);
			this.ChangeSelectedPatt(this.$store.state.machine.model.global.patronES);
			console.info(this.codigoPatt);
			console.info(this.codigoGau);
			this.ChangeSelectedGau(this.$store.state.machine.model.global.calibreES);
			console.info(this.codigoGau);
			this.ChangeSelectedFlow(this.$store.state.machine.model.global.flujoES);
			this.ChangeSelectedExp(this.$store.state.machine.model.global.exposureTimeES);
			this.ChangeSelectedSyr(this.$store.state.machine.model.global.syrModelES);
			
			this.rutaMacro = '"/macros/Scripts/Patrones/'
			this.rutaMacro += this.codigoPatt + '/';
			this.rutaMacro += this.codigoGau + '/';
			this.rutaMacro += this.codigoFlow + '/';
			this.rutaMacro += this.codigoExp +'"';
			this.sendCode(`set global.rutaMacroES = ${this.rutaMacro}`);

			this.codigo = '';
			this.codigo += 'M28 "/sys/declare_variablesES.g"' + '\n';
			this.codigo += " "+"set global.variablesES = 1"+ '\n';
			this.codigo += " "+"set global.patronES = "+ this.$store.state.machine.model.global.patronES + '\n';
			this.codigo += " "+"set global.calibreES = "+ this.$store.state.machine.model.global.calibreES +'\n';
			this.codigo += " "+"set global.flujoES = "+ this.$store.state.machine.model.global.flujoES +'\n';
			this.codigo += " "+"set global.exposureTimeES = "+ this.$store.state.machine.model.global.exposureTimeES +'\n';
			this.codigo += " "+"set global.syrModelES = " + this.$store.state.machine.model.global.syrModelES +'\n';
			this.codigo += " "+"set global.rutaMacroES = " + this.rutaMacro +'\n';
			this.codigo += " "+"set global.alturaES = "+ this.$store.state.machine.model.global.alturaES + '\n';
			this.codigo += " "+"set global.enableES = "+ this.$store.state.machine.model.global.enableES + '\n';
			this.codigo += " "+"set global.cadenceEnableES = "+ this.$store.state.machine.model.global.cadenceEnableES + '\n';
			this.codigo += " "+"set global.cadenceAmountES = "+ this.$store.state.machine.model.global.cadenceAmountES + '\n';
			this.codigo += " "+"set global.aplicarFinES = "+ this.$store.state.machine.model.global.aplicarFinES + '\n';
			this.codigo += 'M29' + '\n';

			
			console.info(this.codigo);
			

			
		},
		
		ChangeSelectedPatt(numero){
			switch (numero) {
				case 1:
					this.codigoPatt = 'ALL PLATFORM';
					break;
				case 2:
					this.codigoPatt = 'CENTERED';
					break;
				default:
					break;
			}
			
		},

		ChangeSelectedGau(numero){
			switch (numero) {
				case 21:
					this.codigoGau = '21G';
					break;
				case 22:
					this.codigoGau = '22G';
					break;
				case 25:
					this.codigoGau = '25G';
					break;	
				case 27:
					this.codigoGau = '27G';
					break;	
				default:
					break;
			}
			
		},
		ChangeSelectedFlow(numero){
			switch (numero) {
				case 5:
					this.codigoFlow = '0,05_ml_min';
					break;
				case 7:
					this.codigoFlow = '0,07_ml_min';
					break;
				case 10:
					this.codigoFlow = '0,10_ml_min';
					break;		
				case 15:
					this.codigoFlow = '0,15_ml_min';
					break;
				case 20:
					this.codigoFlow = '0,20_ml_min';
					break;	
				case 30:
					this.codigoFlow = '0,30_ml_min';
					break;	
				default:
					break;
			}
			
		},
		ChangeSelectedExp(numero){
			switch (numero) {
				case 30:
					this.codigoExp = '0,5_min.gcode';
					break;
				case 60:
					this.codigoExp = '1,0_min.gcode';
					break;
				case 120:
					this.codigoExp = '2,0_min.gcode';
					break;	
				case 180:
					this.codigoExp = '3,0_min.gcode';
					break;		
				default:
					break;
			}
			
		}, 
		ChangeSelectedSyr(numero){
			switch (numero) {
				case 1:
					this.codigoSyr = 'syr01.g';
					break;	
				case 3:
					this.codigoSyr = 'syr03.g';
					break;
				case 5:
					this.codigoSyr = 'syr05.g';
					break;
				case 10:
					this.codigoSyr = 'syr10.g';
					break;
				default:
					break;
			}
			
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
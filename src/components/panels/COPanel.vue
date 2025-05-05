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
			<v-btn v-on:click="closeDialog" x-large block class="blue lighten-3">
				<v-icon style="" class="align-center" x-large>mdi-close</v-icon>
				<!-- <v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img> -->
			</v-btn>
			<v-card class="blue lighten-5 mt-3 mb-3 ">
				<v-row class="ma-0">
					<v-col class="ma-0" cols="12">
						<v-row class="ma-0">
							<v-col align="center" cols="12" class="ma-0 clsVcol">
								<v-row>
									<v-col align="center" cols="4" sm="4" md="4" lg="4" xl="4" class="mt-3 clsTitleMixLeft"></v-col>
									<v-col v-if="$store.state.machine.model.global.TSeleccionado < 2" align="center" cols="4" sm="4" md="4" lg="4" xl="4" class="ma-0 clsVcol">
										<v-btn v-if="$store.state.machine.model.global.coaxial1 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="green darken-1" @click="LinkTools( $store.state.machine.model.global.TSeleccionado );">LINK TOOLS</v-btn>	
										<v-btn v-if="$store.state.machine.model.global.coaxial1 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="red darken-1" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">REMOVE TOOLS</v-btn>	
										<v-btn v-on:click="closeDialog" v-if="$store.state.machine.model.global.coaxial1 == 1" width="150" height="48" rounded class="btnContinue ma-3 " color="red darken-1" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">UNLINK TOOLS</v-btn>	
									</v-col>
									<v-col v-if="$store.state.machine.model.global.TSeleccionado > 1" align="center" cols="4" sm="4" md="4" lg="4" xl="4" class="ma-0 clsVcol">
										<v-btn v-if="$store.state.machine.model.global.coaxial2 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="green darken-1" @click="LinkTools( $store.state.machine.model.global.TSeleccionado );">LINK TOOLS</v-btn>	
										<v-btn v-if="$store.state.machine.model.global.coaxial2 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="red darken-1" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">REMOVE TOOLS</v-btn>	
										<v-btn v-on:click="closeDialog" v-if="$store.state.machine.model.global.coaxial2 == 1" width="150" height="48" rounded class="btnContinue ma-3 " color="red darken-1" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">UNLINK TOOLS</v-btn>	
									</v-col>
									<v-col align="center" cols="4" sm="4" md="4" lg="4" xl="4" class="mt-3 clsTitleMixRight"></v-col>
								</v-row>
								<v-card v-if="(($store.state.machine.model.global.coaxial1 == 1) && ($store.state.machine.model.global.TSeleccionado < 2))" class="blue lighten-5 mt-3 mb-3" >
									<v-row>
										<v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-3 clsMixLeft" style="align: center;">
											<span>MIXING RATIO</span>  
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-0 clsMixLeft" style="align: center;">
											<v-btn class="btnContinue ma-0  pa-0" color="primary" @click="StartSaveSettings($store.state.machine.model.global.TSeleccionado);" rounded>APPLY
											</v-btn> 
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4"	class="mt-3 clsMixLeft"></v-col>
										<v-col cols="2" sm="5" md="2" lg="2" xl="2" class="mt-3 clsMixCenter">
											<span>PRIMARY</span>
										</v-col>
										<v-col cols="2" sm="5" md="2" lg="2" xl="2" class="mt-3 clsMixCenter">
											<span>SECUNDARY</span>
										</v-col>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4"	class="mt-3 clsMixLeft"></v-col>
									</v-row>
									<v-row>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4"	class="mt-3 clsMixLeft"></v-col>
										<v-col cols="4" sm="10" md="4" lg="4" xl="4" class="mt-3 clsMixCenter">
											<v-slider 
												:min="0"
												:max="1" 
												:step="0.05"
												v-model="sliderG1"
												class="align-center ma-0 pa-0" show-ticks="always"	tick-size="4">
												<template v-slot:prepend>
													<v-text-field
														v-model="sliderG11"
														variant="solo-filled"
														hide-details
														readonly
														single-line
														type="number"
														style="width: 45px;font-size: 1.3rem !important;"
														class="ma-0 ml-5 pa-0"
														>
													</v-text-field>
												</template>
												<template v-slot:append>
													<v-text-field
														v-model="sliderG12"
														variant="solo-filled"
														hide-details
														single-line
														readonly
														type="number"
														style="width: 45px; font-size: 1.3rem !important;"
														class="ma-0 pa-0"
														>
													</v-text-field>
												</template>
											</v-slider>
										</v-col>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4" class="clsMixRight"></v-col>
									</v-row>
								</v-card>
								<v-card v-if="(($store.state.machine.model.global.coaxial2 == 1) && ($store.state.machine.model.global.TSeleccionado > 1))" class="blue lighten-5 mt-3 mb-3" >
									<v-row>
										<v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-3 clsMixLeft" style="align: center;">
											<span>MIXING RATIO</span>  
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-0 clsMixLeft" style="align: center;">
											<v-btn class="btnContinue ma-0  pa-0" color="primary" @click="StartSaveSettings($store.state.machine.model.global.TSeleccionado);" rounded>APPLY
											</v-btn> 
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4"	class="mt-3 clsMixLeft"></v-col>
										<v-col cols="2" sm="5" md="2" lg="2" xl="2" class="mt-3 clsMixCenter">
											<span>PRIMARY</span>
										</v-col>
										<v-col cols="2" sm="5" md="2" lg="2" xl="2" class="mt-3 clsMixCenter">
											<span>SECUNDARY</span>
										</v-col>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4"	class="mt-3 clsMixLeft"></v-col>
									</v-row>
									<v-row>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4"	class="mt-3 clsMixLeft"></v-col>
										<v-col cols="4" sm="10" md="4" lg="4" xl="4" class="mt-3 clsMixCenter">
											<v-slider 
												:min="0"
												:max="1" 
												:step="0.05"
												v-model="sliderG2"
												class="align-center ma-0 pa-0" show-ticks="always"	tick-size="4">
												<template v-slot:prepend>
													<v-text-field
														v-model="sliderG21"
														variant="solo-filled"
														hide-details
														readonly
														single-line
														type="number"
														style="width: 45px;font-size: 1.3rem !important;"
														class="ma-0 ml-5 pa-0"
														>
													</v-text-field>
												</template>
												<template v-slot:append>
													<v-text-field
														v-model="sliderG22"
														variant="solo-filled"
														hide-details
														single-line
														readonly
														type="number"
														style="width: 45px; font-size: 1.3rem !important;"
														class="ma-0 pa-0"
														>
													</v-text-field>
												</template>
											</v-slider>
										</v-col>
										<v-col cols="4" sm="1" md="4" lg="4" xl="4" class="clsMixRight"></v-col>
									</v-row>
								</v-card>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card>
		</v-col>
		<v-col class="mb-0 pb-0">
			<v-dialog v-model="dialogATTACH" persistent max-width="500px">
				<v-card>                                                                                  
					<v-card-title class="title">
						{{ $t(textoDialogo) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogATTACH = false" outlined rounded>
										{{ $t('domotek.varios.no') }}
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogATTACH = false" outlined rounded>
									<code-btn width="120" height="48" :code='`${codigo}`' :log="false" color="green darken-1" rounded>
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
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	data(){
		return{
			dialogATTACH: false,
			codigo:null,
			textoDialogo: null,
			dialogCL_SAV: false,
			sliderG01: 2.00,
			sliderG02: 2.00,
			sliderG1: this.$store.state.machine.model.global.group1T1Mix,
			sliderG2: this.$store.state.machine.model.global.group2T1Mix,
		}
	},
	computed:{
		...mapState({
			boards: state => state.machine.model.boards,
		}),
		...mapGetters('machine/model', ['global']),
		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		},
		/* sliderkkG1:{
			get() {
				if(this.sliderG01==2.00){
					this.sliderG01 = 0.50;
					return this.$store.state.machine.model.global.group1T1Mix;
				}
				else
					return this.sliderG1;
				},
		}, */
		/* sliderG2:{
			get() {
				return this.$store.state.machine.model.global.group2T1Mix},
		}, */
		sliderG11: {
			get() { return (this.sliderG1).toFixed(2)}
		},
		sliderG12: {
			get() { return (1-this.sliderG1).toFixed(2)}
		},
		sliderG21: {
			get() { return (this.sliderG2).toFixed(2)}
		},
		sliderG22: {
			get() { return (1-this.sliderG2).toFixed(2)}
		},
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		closeDialog(){
			this.$emit('close-dialog');
		},
		async LinkTools(toolactivo){
			console.info(`COAXIAL LINK`);
			this.textoDialogo = 'Please, confirm COAXIAL ATTACH';
			if ((toolactivo == 0)||(toolactivo == 1)) {
				this.codigo = 'M98 P"/sys/Coaxial/coaxial_4AT0.g"';
				await this.sendCode(this.codigo);
				this.codigo = 'set global.coaxial1 = 1';
			}
			else
			{
				this.codigo = 'M98 P"/sys/Coaxial/coaxial_4AT3.g"';
				await this.sendCode(this.codigo);
				this.codigo = 'set global.coaxial2 = 1';
			}
			this.dialogATTACH = true;
		},
		async UnLinkTools(toolactivo){
			console.info(`COAXIAL UNLINK`);
			this.textoDialogo = 'Please, confirm COAXIAL DETTACH';
			if ((toolactivo == 0)||(toolactivo == 1)) {
				this.codigo = 'M98 P"/sys/Coaxial/grupo1Off.g"';
				await this.sendCode(this.codigo);
			}
			else
			{
				this.codigo = 'M98 P"/sys/Coaxial/grupo2Off.g"';
				await this.sendCode(this.codigo);
			}
			this.dialogATTACH = true;
		},
		StartSaveSettings(toolactivo){
			console.info(`startSaveSettings`);
			this.codigo = '';
			if ((toolactivo == 0)||(toolactivo == 1)) {
				this.codigo = "set global.group1T1Mix = "+ this.sliderG11 + "\n";
				console.info(this.codigo);
				this.sendCode(this.codigo);
				this.codigo = "set global.group1T2Mix = "+ this.sliderG12 + "\n";
				console.info(this.codigo);
				this.sendCode(this.codigo);
				this.codigo = 'M28 "/sys/declare_variablesCO.g"' + '\n';
				this.codigo += "global variablesCO = 1" + '\n';
				this.codigo += "global coaxial1 = "+ this.$store.state.machine.model.global.coaxial1 + '\n';
				this.codigo += "global coaxial2 = "+ this.$store.state.machine.model.global.coaxial2 + '\n';
				this.codigo += "global group1T1Mix = "+ this.sliderG11 + '\n';
				this.codigo += "global group1T2Mix = "+ this.sliderG12 + '\n';
				this.codigo += "global group2T1Mix = "+ this.$store.state.machine.model.global.group2T1Mix + '\n';
				this.codigo += "global group2T2Mix = "+ this.$store.state.machine.model.global.group2T2Mix + '\n';
				this.codigo += "global TSeleccionado = -1 "+ '\n';//+ this.$store.state.machine.model.global.coaxial2 + '\n';
				this.codigo += 'M29' + '\n';
			}
			else
			{
				this.codigo = "set global.group2T1Mix = "+ this.sliderG21 + "\n";
				console.info(this.codigo);
				this.sendCode(this.codigo);
				this.codigo = "set global.group2T2Mix = "+ this.sliderG22 + "\n";
				console.info(this.codigo);
				this.sendCode(this.codigo);
				this.codigo = 'M28 "/sys/declare_variablesCO.g"' + '\n';
				this.codigo += "global variablesCO = 1" + '\n';
				this.codigo += "global coaxial1 = "+ this.$store.state.machine.model.global.coaxial1 + '\n';
				this.codigo += "global coaxial2 = "+ this.$store.state.machine.model.global.coaxial2 + '\n';
				this.codigo += "global group1T1Mix = "+ this.$store.state.machine.model.global.group1T1Mix + '\n';
				this.codigo += "global group1T2Mix = "+ this.$store.state.machine.model.global.group1T2Mix + '\n';
				this.codigo += "global group2T1Mix = "+ this.sliderG21 + '\n';
				this.codigo += "global group2T2Mix = "+ this.sliderG22 + '\n';
				this.codigo += "global TSeleccionado = -1 "+ '\n';//+ this.$store.state.machine.model.global.coaxial2 + '\n';
				this.codigo += 'M29' + '\n';			
			}
			console.info(this.codigo);
			this.sendCode({ code: this.codigo, log: false });
		 }	
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
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
	<!-- domotek: coaxial con el diseño nuevo -->
	<div v-if="temaBio" class="bio-co">
		<header class="bio-teclado-cab">
			<span class="bio-teclado-icono acento"><v-icon>mdi-circle-double</v-icon></span>
			<span class="bio-teclado-nombre">{{ $t('domotek.coaxial.title') }} · {{ $t('domotek.coaxial.group', [grupo]) }}</span>
			<span class="pildora" :class="{ on: enlazado }">{{ enlazado ? $t('domotek.coaxial.linked') : $t('domotek.coaxial.unlinked') }}</span>
			<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.close')" @click="closeDialog"><v-icon>mdi-close</v-icon></button>
		</header>

		<div class="bio-co-tools">
			<div v-for="(t, i) in toolsGrupo" :key="t.id" class="bio-co-tool" :class="{ enlazado }">
				<span class="n">{{ t.id }}</span>
				<span class="nom">{{ t.nombre }}</span>
				<span class="rol">{{ i === 0 ? $t('domotek.coaxial.primary') : $t('domotek.coaxial.secondary') }}</span>
			</div>
			<span class="bio-co-union" :class="{ enlazado }"><v-icon>{{ enlazado ? 'mdi-link-variant' : 'mdi-link-variant-off' }}</v-icon></span>
		</div>

		<!-- Sin enlazar -->
		<template v-if="!enlazado">
			<p class="bio-co-nota">{{ $t('domotek.coaxial.linkHint') }}</p>
			<p v-if="!allAxesHomed" class="bio-co-nota aviso"><v-icon small>mdi-alert-outline</v-icon>{{ $t('domotek.coaxial.homeFirst') }}</p>
			<div style="flex: 1"></div>
			<div class="bio-co-pie">
				<button type="button" class="bio-teclado-sec peligro" @click="UnLinkTools(seleccionado)">{{ $t('domotek.coaxial.remove') }}</button>
				<button type="button" class="bio-teclado-ok acento" @click="LinkTools(seleccionado)"><v-icon small>mdi-link-variant</v-icon>{{ $t('domotek.coaxial.link') }}</button>
			</div>
		</template>

		<!-- Enlazados: proporción de mezcla -->
		<template v-else>
			<div class="bio-co-mezcla">
				<div class="bio-co-valores">
					<div><span>{{ $t('domotek.coaxial.primary') }}</span><strong>{{ pctPrimario }}<small> %</small></strong></div>
					<div class="sec"><span>{{ $t('domotek.coaxial.secondary') }}</span><strong>{{ 100 - pctPrimario }}<small> %</small></strong></div>
				</div>
				<div class="bio-co-slider">
					<button type="button" :disabled="pctPrimario <= 0" :aria-label="$t('domotek.coaxial.lessPrimary')" @click="fijarPct(pctPrimario - 5)">−</button>
					<input type="range" min="0" max="100" step="5" :value="pctPrimario" :aria-label="$t('domotek.coaxial.ratio')" :style="{ '--pct': pctPrimario + '%' }" @input="fijarPct($event.target.value)">
					<button type="button" :disabled="pctPrimario >= 100" :aria-label="$t('domotek.coaxial.morePrimary')" @click="fijarPct(pctPrimario + 5)">+</button>
				</div>
				<div class="bio-co-atajos">
					<button v-for="v in [0, 25, 50, 75, 100]" :key="v" type="button" :class="{ activo: pctPrimario === v }" @click="fijarPct(v)">{{ v }} / {{ 100 - v }}</button>
				</div>
				<p class="bio-co-nota" :class="{ aviso: cambiado }">{{ cambiado ? $t('domotek.coaxial.notApplied') : $t('domotek.coaxial.applied') }}</p>
			</div>
			<div class="bio-co-pie">
				<button type="button" class="bio-teclado-sec peligro" @click="UnLinkTools(seleccionado), closeDialog()"><v-icon small>mdi-link-variant-off</v-icon>{{ $t('domotek.coaxial.unlink') }}</button>
				<button type="button" class="bio-teclado-ok acento" @click="StartSaveSettings(seleccionado)">{{ $t('domotek.coaxial.apply', [pctPrimario, 100 - pctPrimario]) }}</button>
			</div>
		</template>
	</div>
	<v-row v-else class="mb-0 pb-0"  > 
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
										<v-btn v-if="$store.state.machine.model.global.coaxial1 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="green lighten-3" @click="LinkTools( $store.state.machine.model.global.TSeleccionado );">LINK TOOLS</v-btn>	
										<v-btn v-if="$store.state.machine.model.global.coaxial1 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="red lighten-3" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">REMOVE TOOLS</v-btn>	
										<v-btn v-on:click="closeDialog" v-if="$store.state.machine.model.global.coaxial1 == 1" width="150" height="48" rounded class="btnContinue ma-3 " color="red lighten-3" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">UNLINK TOOLS</v-btn>	
									</v-col>
									<v-col v-if="$store.state.machine.model.global.TSeleccionado > 1" align="center" cols="4" sm="4" md="4" lg="4" xl="4" class="ma-0 clsVcol">
										<v-btn v-if="$store.state.machine.model.global.coaxial2 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="green lighten-3" @click="LinkTools( $store.state.machine.model.global.TSeleccionado );">LINK TOOLS</v-btn>	
										<v-btn v-if="$store.state.machine.model.global.coaxial2 == 0" width="150" height="48" rounded class="btnContinue ma-3 " color="red lighten-3" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">REMOVE TOOLS</v-btn>	
										<v-btn v-on:click="closeDialog" v-if="$store.state.machine.model.global.coaxial2 == 1" width="150" height="48" rounded class="btnContinue ma-3 " color="red lighten-3" @click="UnLinkTools( $store.state.machine.model.global.TSeleccionado );">UNLINK TOOLS</v-btn>	
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
		<!-- <v-col class="mb-0 pb-0">
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
		</v-col>  -->
	</v-row>
</template>
<script>
'use strict'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	data(){
		return{
			//dialogATTACH: false,
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
			move: state => state.machine.model.move,
		}),
		...mapGetters('machine/model', ['global']),
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		seleccionado() { return this.$store.state.machine.model.global.TSeleccionado; },
		grupo() { return this.seleccionado > 1 ? 2 : 1; },
		enlazado() {
			const g = this.$store.state.machine.model.global;
			return (this.grupo === 1 ? g.coaxial1 : g.coaxial2) == 1;
		},
		toolsGrupo() {
			const g = this.$store.state.machine.model.global;
			const ids = this.grupo === 1 ? [0, 1] : [2, 3];
			return ids.map(i => ({ id: `T${i + 1}`, nombre: g[`T${i}Name`] || '—' }));
		},
		pctPrimario() { // la mezcla se guarda de 0 a 1; aquí en %
			const v = this.grupo === 1 ? this.sliderG1 : this.sliderG2;
			return Math.round((Number(v) || 0) * 100);
		},
		cambiado() {
			const g = this.$store.state.machine.model.global;
			const guardado = this.grupo === 1 ? g.group1T1Mix : g.group2T1Mix;
			return Math.round((Number(guardado) || 0) * 100) !== this.pctPrimario;
		},
		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
		},
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
		allAxesHomed () { // domotek: misma regla que el resto (4 ejes en la 2A, 7 en las demás) sin fallar si faltan ejes
			const a = (this.move && this.move.axes) || [];
			const n = (this.$store.state.machine.model.global.MachineModel === '2A') ? 4 : 7;
			for (let i = 0; i < n; i++) { if (!a[i] || !a[i].homed) { return false; } }
			return true;
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		fijarPct(v) { // domotek
			const n = Math.max(0, Math.min(100, Math.round(Number(v) / 5) * 5)) / 100;
			if (this.grupo === 1) { this.sliderG1 = n; } else { this.sliderG2 = n; }
		},
		closeDialog(){
			this.$emit('close-dialog');
		},
		
		async LinkTools(toolactivo){
			if (!this.allAxesHomed) {
				const msg = this.$t('domotek.varios.axesNotHomedLink');
				const title = this.$t('domotek.varios.axesNotHomedTitle');
				await this.sendCode(`M291 P"${msg}" R"${title}" S1`);
				return;
			}

			console.info(`COAXIAL LINK`);
			this.textoDialogo = 'Please, confirm COAXIAL ATTACH';
			if ((toolactivo == 0) || (toolactivo == 1)) {
				await this.sendCode('M98 P"/sys/Coaxial/coaxial_4AT0.g"');
				await this.sendCode('set global.coaxial1 = 1');
			} else {
				await this.sendCode('M98 P"/sys/Coaxial/coaxial_4AT3.g"');
				await this.sendCode('set global.coaxial2 = 1');
			}
		},
		async UnLinkTools(toolactivo){
			console.info(`COAXIAL UNLINK`);
			this.textoDialogo = 'Please, confirm COAXIAL DETTACH';
			if ((toolactivo == 0)||(toolactivo == 1)) {
				this.codigo = 'M98 P"/sys/Coaxial/grupo1Off.g"';
				await this.sendCode(this.codigo);
				this.codigo = 'set global.coaxial1 = 0';
				await this.sendCode(this.codigo);
			}
			else
			{
				this.codigo = 'M98 P"/sys/Coaxial/GRUPO2OFF.g"';
				await this.sendCode(this.codigo);
				this.codigo = 'set global.coaxial2 = 0';
				await this.sendCode(this.codigo);
			}
			//this.dialogATTACH = true;
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
				this.codigo = "M567 P0 E" + this.sliderG11 + ":" + this.sliderG12 + "\n";
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
				this.codigo = "M567 P3 E" + this.sliderG22 + ":" + this.sliderG21 + "\n";
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
		// domotek: al abrir para otro grupo o si la placa cambia la mezcla, partir del valor guardado
		'$store.state.machine.model.global.group1T1Mix'(v) { if (v !== undefined) { this.sliderG1 = v; } },
		'$store.state.machine.model.global.group2T1Mix'(v) { if (v !== undefined) { this.sliderG2 = v; } },
	},
	created() {
	},
	updated() {
	},
}
</script>
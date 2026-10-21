<style scoped>
.chart-height-limit {
	max-height: 320px;
}

@media (max-width: 900px) {
     *{
        font-size: 15px;
		
    }
}
</style>

<template>
	<div class="d-flex flex-column mb-0 pb-0">
		<v-row v-if="!temaBio" id="row_0A">
			<v-col id="col_0A" cols="12" style="height:10%;padding-top: 5px; /*height:45%;*/ /* padding-top: 10px; */">  
				<job-progress class="mb-3"></job-progress>
			</v-col>
		</v-row>
		<v-dialog v-model="DialogBabyStep" class="blue lighten-3">
			<v-btn @click="DialogBabyStep = false" x-large block class="blue lighten-3">
				<v-icon x-large>mdi-close</v-icon>
			</v-btn>
			<v-col cols="12" align="center" class="mt-0">
				<z-babystep-panel></z-babystep-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogSpeed">
			<v-btn @click="DialogSpeed = false" x-large block class="blue lighten-3">
				<v-icon x-large>mdi-close</v-icon>
			</v-btn>
			<v-col cols="12" align="center" class="mt-0">
				<speed-factor-panel></speed-factor-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogExtrusion" content-class="clsDialogExtrusion">
			<v-btn @click="DialogExtrusion = false" x-large block class="blue lighten-3">
				<v-icon x-large>mdi-close</v-icon>
			</v-btn>
			<v-col cols="12" align="center" class="mt-0">
				<extrusion-factors-panel></extrusion-factors-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogElectroSpinning" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<electrospinning-panel v-on:close-dialog="closeDialog"></electrospinning-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogUltraviolet" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<ultraviolet-panel v-on:close-dialog="closeDialog"></ultraviolet-panel> 
				<!---<spindle-speed-panel></spindle-speed-panel> -->
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogClean" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<clean-panel v-on:close-dialog="closeDialog"></clean-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogEMD" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<emd-panel v-on:close-dialog="closeDialog"></emd-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogTmp" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<temp-panel v-on:close-dialog="closeDialog"></temp-panel>
			</v-col>
		</v-dialog>
		
		<!-- domotek: Trabajos con el tema oscuro -->
		<div v-if="temaBio" class="bio-job">
			<section class="bio-job-cab">
				<div class="bio-job-fila">
					<span class="bio-estado" :class="{ activo: bioImprimiendo }"><span class="bio-estado-punto" :style="{ background: bioPausado ? '#F2A65A' : (bioImprimiendo ? '#3CC9B0' : '#5A6670') }"></span>{{ bioEstadoTexto }}</span>
					<span class="bio-job-archivo">{{ bioImprimiendo ? bioArchivo : $t('domotek.jobs.noJob') }}</span>
					<span v-if="bioImprimiendo" class="bio-job-pct">{{ Math.round(jobProgress * 100) }} %</span>
					<button v-else type="button" class="bio-btn-acento" @click="cambiarRuta('/Files/Jobs')">{{ $t('domotek.jobs.chooseFile') }}</button>
				</div>
				<div class="bio-barra" role="img" :aria-label="`${Math.round(jobProgress * 100)} %`"><div :style="{ width: (bioImprimiendo ? jobProgress * 100 : 0) + '%' }"></div></div>
				<div v-if="bioImprimiendo" class="bio-job-datos">
					<span v-if="job.file && job.file.numLayers">{{ $t('domotek.jobs.layer') }} <strong>{{ job.layer || 0 }} / {{ job.file.numLayers }}</strong></span>
					<span>{{ $t('domotek.jobs.elapsed') }} <strong>{{ $displayTime(job.duration) }}</strong></span>
					<span v-if="bioQueda !== null">{{ $t('domotek.jobs.remaining') }} <strong>{{ $displayTime(bioQueda) }}</strong></span>
					<div style="flex: 1"></div>
					<span v-if="bioHV" class="bio-aviso"><v-icon small color="#F5B52E">mdi-flash</v-icon>{{ $t('panel.jobControl.warninghv') }}</span>
					<span v-if="bioUV" class="bio-aviso"><v-icon small color="#B49CF2">mdi-flash</v-icon>{{ $t('panel.jobControl.warninguv') }}</span>
				</div>
			</section>

			<section class="bio-job-grid" :class="{ cinco: bioImprimiendo }">
				<code-btn v-if="bioImprimiendo" class="bio-tile" :code="bioPausado ? 'M24' : 'M25'" :disabled="!bioImprimiendo" no-wait>
					<v-icon>{{ bioPausado ? 'mdi-play' : 'mdi-pause' }}</v-icon><span>{{ bioPausado ? $t('domotek.jobs.resume') : $t('domotek.jobs.pause') }}</span>
				</code-btn>
				<code-btn v-if="bioImprimiendo" class="bio-tile peligro" :code="bioCancelCode" :disabled="!bioPausado" no-wait>
					<v-icon>mdi-stop</v-icon><span>{{ $t('domotek.jobs.cancel') }}</span>
				</code-btn>
				<code-btn v-if="!bioImprimiendo && bioRepetirCode" class="bio-tile" :code="bioRepetirCode" no-wait>
					<v-icon>mdi-restart</v-icon><span>{{ $t('domotek.jobs.repeat') }}</span>
				</code-btn>
				<button type="button" class="bio-tile" @click="DialogBabyStep = true"><v-icon>mdi-format-vertical-align-center</v-icon><span>{{ $t('panel.babystepping.caption') }}</span></button>
				<button type="button" class="bio-tile" @click="DialogSpeed = true"><v-icon>mdi-speedometer</v-icon><span>{{ $t('panel.speedFactor.caption') }}</span></button>
				<button type="button" class="bio-tile" @click="DialogExtrusion = true"><v-icon>mdi-texture-box</v-icon><span>{{ $t('panel.extrusionFactors.caption') }}</span></button>
				<button type="button" class="bio-tile" @click="cambiarRuta('/Files/Jobs')"><v-icon>mdi-folder-outline</v-icon><span class="bio-cap">{{ $t('domotek.jobs.jobs') }}</span></button>
				<button v-if="ESCapable" type="button" class="bio-tile" @click="MuestraES"><v-icon color="#F2D35A">mdi-flash-outline</v-icon><span>{{ $t('domotek.jobs.electrospinning') }}</span></button>
				<button v-if="UVCapable" type="button" class="bio-tile" @click="MuestraUV"><v-icon color="#B49CF2">mdi-white-balance-sunny</v-icon><span>{{ $t('domotek.jobs.ultraviolet') }}</span></button>
				<button v-if="EMDCapable" type="button" class="bio-tile" @click="MuestraEMD"><v-icon color="#3CC9B0">mdi-water-outline</v-icon><span>{{ $t('domotek.jobs.EMD') }}</span></button>
				<button v-if="TMCapable" type="button" class="bio-tile" @click="DialogTmp = true"><v-icon color="#F2A65A">mdi-thermometer</v-icon><span>{{ $t('domotek.jobs.temperatures') }}</span></button>
			</section>

			<section class="bio-job-temps">
				<span v-for="t in bioTemps" :key="t.et"><span>{{ t.et }}</span> <strong>{{ t.vl === null ? '—' : `${t.vl} °C` }}</strong><span v-if="t.obj" class="obj"> / {{ t.obj }}</span></span>
			</section>
		</div>

		<v-row v-if="!temaBio" id="row_AA">
			<v-col order="1" order-md="1" cols="12" sm="12" md="12" xl="12">
				<v-row id="row_AB" align="center" class="blue lighten-4" style="height:45%; /* padding-top: 10px; */">
					<v-col cols="12"    >
						
							<job-control-panel></job-control-panel>
						
					</v-col>
				</v-row>
				<v-row id="row_AC" align="center" class="blue lighten-4" style="height:20%; /* padding-top: 10px; */">
					
					<!-- <v-col cols="12" v-show="$vuetify.breakpoint.lgAndDown"> 
							<v-card class="blue lighten-5">
								<v-card-text>
								<v-row v-if="heaterTools.length > 0">
									<v-col align="center" v-if="heaterTools.length > 0">
										<v-icon class="ml-5">mdi-bed</v-icon> : {{heaterTools[0].current == -273.1 ? "--": heaterTools[0].current}}
									</v-col>
									<v-col align="center" v-if="heaterTools.length > 1">
										{{ $t('domotek.tools.T0Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[1].current == -273.1 ? "--": heaterTools[1].current}}
									</v-col>
									<v-col align="center" v-if="heaterTools.length > 2">
										{{ $t('domotek.tools.T1Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[2].current == -273.1 ? "--": heaterTools[2].current}}
									</v-col>
									<v-col align="center" v-if="heaterTools.length > 3">
										{{ $t('domotek.tools.T2Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[3].current == -273.1 ? "--": heaterTools[3].current}}
									</v-col>
									<v-col align="center" v-if="heaterTools.length > 4">
										{{ $t('domotek.tools.T3Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[4].current == -273.1 ? "--": heaterTools[4].current}}
									</v-col>
								</v-row>
								</v-card-text>
							</v-card>
					</v-col> -->
					<v-col cols="3" align="center">
						<v-btn @click="DialogBabyStep = true" icon>
							<v-row no-gutters>
								<v-col cols="12">
									<v-icon x-large> mdi-format-vertical-align-center </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('panel.babystepping.caption') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="3" align="center">
						<v-btn @click="DialogSpeed = true" icon>
							<v-row no-gutters>
								<v-col cols="12">
									<v-icon x-large> mdi-timer </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('panel.speedFactor.caption') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="3" align="center">
						<v-btn @click="DialogExtrusion = true" icon>
							<v-row no-gutters>
								<v-col cols="12">
									<v-icon x-large> mdi-texture </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('panel.extrusionFactors.caption') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col cols="3" align="center" >
						<v-btn @click="cambiarRuta('/Files/Jobs')" icon>
							<v-row no-gutters>
								<v-col cols="12">
									<v-icon x-large> mdi-format-list-bulleted </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('domotek.jobs.jobs') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
				</v-row>
				
				<v-row id="row_AD" align="center" class="blue lighten-4 " style="height:20%; margin-bottom: 4.5%; ">
					<v-col v-if="ESCapable" cols="3" align="center">
						<v-btn @click="MuestraES" icon>
							<v-row no-gutters>
								<v-col class="mt-5 " cols="12" align="center"> <!-- <v-col class="mt-3" cols="12" align="center"> -->
									<v-img  src="@/assets/ES_logo.svg" contain max-height="45" max-width="45"></v-img> 
									<!--<v-icon x-large > mdi-flare </v-icon>-->
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('domotek.jobs.electrospinning') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col v-if="UVCapable" cols="3" align="center">
						<v-btn  @click="MuestraUV" icon>
							<v-row no-gutters>
								<v-col class="mt-3" cols="12" align="center">
									<v-img  src="@/assets/uv-ray.svg" contain max-height="45" max-width="45"></v-img>
								</v-col>
								<v-col class="mt-1">
									<span>{{ $t('domotek.jobs.ultraviolet') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<!-- <v-col v-if="CLCapable" cols="3" align="center">
						<v-btn @click="DialogClean = true" icon>
							<v-row no-gutters>
								<v-col class="mt-5" cols="12" align="center">
									<v-icon x-large > mdi-brush-variant </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('domotek.jobs.clean') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col> -->
					<v-col v-if="EMDCapable" cols="3" align="center">
						<v-btn @click="MuestraEMD" icon>
							<v-row no-gutters>
								<v-col class="mt-5" cols="12" align="center">
									<v-icon x-large > mdi-magnet-on </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('domotek.jobs.EMD') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-col v-if="TMCapable" cols="3" align="center">
						<v-btn @click="DialogTmp = true" icon>
							<v-row no-gutters>
								<v-col class="mt-5" cols="12" align="center">
									<!-- <v-img  src="@/assets/uv-ray.svg" contain max-height="45" max-width="45"></v-img> -->
									<v-icon x-large > mdi-thermometer </v-icon>
								</v-col>
								<v-col class="mt-4">
									<span>{{ $t('domotek.jobs.temperatures') }}</span>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
				</v-row>
				
				<v-row id="row_AE_4A"  align="center" class="blue lighten-5" style="height:10%; /* padding-top: 10px; */" v-if="nameTools.length > 2 "> 
					<v-col cols="1" align="center"> 
					</v-col>
					<v-col cols="2" align="center" style="padding: 6px;" v-if="nameTools.length > 0 ">
						<v-icon class="ma-0">mdi-tray</v-icon>: {{heaterTools[0].current.toFixed(1) == -273.1 || heaterTools[0].current == -273.15? "--": heaterTools[0].current.toFixed(1)}}
					</v-col>
					<v-col cols="2" align="center" style="padding: 6px;" v-if="nameTools.length >= 1"> 
						{{ $t('domotek.tools.T0Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[1].current.toFixed(1) == -273.1 || heaterTools[1].current == -273.15? "--": heaterTools[1].current.toFixed(1)}}
					</v-col>
					<v-col cols="2" align="center" style="padding: 6px;" v-if="nameTools.length >= 2"> 
						{{ $t('domotek.tools.T1Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[2].current.toFixed(1) == -273.1 || heaterTools[2].current == -273.15? "--": heaterTools[2].current.toFixed(1)}}
					</v-col>
					<v-col cols="2" align="center" style="padding: 6px;" v-if="nameTools.length >= 3">
						{{ $t('domotek.tools.T2Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[3].current.toFixed(1) == -273.1 || heaterTools[3].current == -273.15? "--": heaterTools[3].current.toFixed(1)}}
					</v-col>
					<v-col cols="2" align="center" style="padding: 6px;" v-if="nameTools.length >= 4">
						{{ $t('domotek.tools.T3Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[4].current.toFixed(1) == -273.1 || heaterTools[4].current == -273.15? "--": heaterTools[4].current.toFixed(1)}}
					</v-col>
					<v-col cols="1" align="center"> 
					</v-col>
				</v-row>
				<v-row id="row_AE_2A"  align="center" class="blue lighten-5" style="height:10%; /* padding-top: 10px; */" v-if="nameTools.length < 3 ">
					<v-col cols="4" align="center" style="padding: 6px;" v-if="nameTools.length > 0 ">
						<v-icon class="ma-0">mdi-tray</v-icon>: {{heaterTools[0].current.toFixed(1) == -273.1 || heaterTools[0].current == -273.15? "--": heaterTools[0].current.toFixed(1)}}
					</v-col>
					<v-col cols="4" align="center" style="padding: 6px;" v-if="nameTools.length > 1"> 
						{{ $t('domotek.tools.T0Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[1].current.toFixed(1) == -273.1 || heaterTools[1].current == -273.15? "--": heaterTools[1].current.toFixed(1)}}
					</v-col>
					<v-col cols="4" align="center" style="padding: 6px;" v-if="nameTools.length === 2"> 
						{{ $t('domotek.tools.T1Mini') }}<v-icon>mdi-printer-3d-nozzle</v-icon>: {{heaterTools[2].current.toFixed(1) == -273.1 || heaterTools[2].current == -273.15? "--": heaterTools[2].current.toFixed(1)}}
					</v-col>
				</v-row>
			</v-col>
		</v-row>	
	</div>
</template>

<script>
'use strict'

import { registerRoute } from '..'
import { mapState, mapGetters, mapActions } from 'vuex'
import { isPrinting, isPaused } from '../../store/machine/modelEnums.js'
import { extractFileName } from '../../utils/path.js'
export default {
	install() {
		// Register a route via Job -> Status
		registerRoute(this, {
			Job: {
				Status: {
					icon: 'mdi-information',
					caption: 'menu.job.status',
					path: '/Job/Status',
					nivel: 0 //luis - control de usuario
				}
			}
		});
	},
	data(){
		return{
			DialogBabyStep: false,
			DialogSpeed: false,
			DialogExtrusion: false,
			DialogElectroSpinning: false,
			DialogUltraviolet: false,
			DialogClean: false,
			DialogTmp: false,
			DialogEMD: false
		}
	},

	computed: {
		
		...mapState({
			nameCama: state => state.machine.model.sensors,
			nameTools: state => state.machine.model.tools,
			heaterTools: state => state.machine.model.heat.heaters,
		}),
		...mapGetters('machine/model', ['global', 'jobProgress']),
		...mapState('machine/model', { job: state => state.job, bioStatus: state => state.state.status, bioGpOut: state => state.state.gpOut }),
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioImprimiendo() { return isPrinting(this.bioStatus); },
		bioPausado() { return isPaused(this.bioStatus); },
		bioEstadoTexto() {
			if (this.bioPausado) { return this.$t('domotek.jobs.paused'); }
			if (this.bioImprimiendo) { return this.$t('domotek.jobs.printing'); }
			return this.$t('domotek.jobs.idle');
		},
		bioArchivo() {
			const f = this.job && this.job.file && this.job.file.fileName;
			return f ? extractFileName(f) : '';
		},
		bioQueda() {
			const t = this.job && this.job.timesLeft;
			if (!t) { return null; }
			const v = t.file || t.slicer || t.filament;
			return v ? v : null;
		},
		bioCancelCode() { // igual que JobControlPanel
			if (this.$store.state.machine.model.global.notifyPrintCanceled) {
				return "set global.jobWasCancelled = true\nM1212\nM0 H1";
			}
			return "set global.jobWasCancelled = true\nM0 H1";
		},
		bioRepetirCode() { // igual que JobControlPanel
			const j = this.job || {};
			if (!j.lastFileName) { return ''; }
			return j.lastFileSimulated ? `M37 P"${j.lastFileName}"` : `M32 "${j.lastFileName}"`;
		},
		bioHV() {
			const g = this.bioGpOut || [];
			const idx = (this.$store.state.machine.model.global.MachineModel === '2A') ? [1, 2] : [1, 2, 3, 4];
			return idx.some(i => g[i] && g[i].pwm > 0);
		},
		bioUV() {
			const g = this.bioGpOut || [];
			const idx = (this.$store.state.machine.model.global.MachineModel === '2A') ? [9, 10] : [9, 10, 11, 12];
			return idx.some(i => g[i] && g[i].pwm > 0);
		},
		bioTemps() {
			const h = this.heaterTools || [];
			const val = x => (!x || x.current === undefined || x.current <= -273) ? null : x.current.toFixed(1);
			const obj = x => (x && x.state === 'active' && x.active) ? x.active : null;
			const out = [{ et: this.$t('domotek.tools.platformMini'), vl: val(h[0]), obj: obj(h[0]) }];
			const n = (this.nameTools || []).length;
			for (let i = 0; i < n && i < 4; i++) { out.push({ et: `T${i + 1}`, vl: val(h[i + 1]), obj: obj(h[i + 1]) }); }
			return out;
		},

		ESCapable: {
			get() {
				return this.$store.state.machine.model.global.ES_Capable},
			// set(value){
			// 	this.sendCode(`set global.ES_Capable = ${value}`);
			// }			
		},

		UVCapable: {
			get() {
				return this.$store.state.machine.model.global.UV_Capable},
			// set(value){
			// 	this.sendCode(`set global.UV_Capable = ${value}`);
			// }			
		},
		TMCapable: {
			get() {
				return this.$store.state.machine.model.global.TM_Capable},
			// set(value){
			// 	this.sendCode(`set global.UV_Capable = ${value}`);
			// }			
		},
		CLCapable: {
			get() {
				return this.$store.state.machine.model.global.CL_Capable},
			// set(value){
			// 	this.sendCode(`set global.UV_Capable = ${value}`);
			// }			
		},
		EMDCapable: {
		 	get() {
		 		return this.$store.state.machine.model.global.EMD_Capable},			
		 },
	},
	/* computed:{
		heaterTools: this.$store.state.machine.model.heat.heaters
	}, */

	methods: {
		...mapActions("machine", ["sendCode"]),
		cambiarRuta(ruta){
			this.$router.push(ruta)
		},
		cambiarRutaAdv(ruta){
			//this.$router.push(ruta)
			this.$router.push({path: ruta, params: { pruebaparam: 'ricardo' }})
		},
		closeDialog(){
			console.log('Close Dialog UV - ES - CL - TMP - EMD');
			this.DialogUltraviolet = false;
			this.DialogElectroSpinning = false;
			this.DialogClean = false;
			this.DialogTmp = false;
			this.DialogEMD = false;
         },  
		 MuestraES(){
			console.log('MuestraES ->Sendcode');
			this.sendCode('M98 P"declare_variablesES.g"');
			console.log('MuestraES ->dialog');
			this.DialogElectroSpinning = true;
		},
		MuestraUV(){
			console.log('MuestraUV ->Sendcode');
			this.sendCode('M98 P"declare_variablesUV.g"');
			console.log('MuestraUV ->dialog');
			this.DialogUltraviolet = true;
		}, 
		MuestraEMD(){
			console.log('MuestraEMD ->Sendcode');
			this.sendCode('M98 P"declare_variablesEMD.g"');
			console.log('MuestraEMD ->dialog');
			this.DialogEMD = true;
		} 
	}, 
	mounted() {
		this.$vuetify.goTo(0);
	}
}
</script>
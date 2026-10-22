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
		<!-- domotek: z con el diseño nuevo -->
		<v-dialog v-if="temaBio" v-model="DialogBabyStep" max-width="760" content-class="bio-teclado-dialogo">
			<bio-ajuste-trabajo v-if="DialogBabyStep" tipo="z" @cerrar="DialogBabyStep = false"></bio-ajuste-trabajo>
		</v-dialog>
		<v-dialog v-else v-model="DialogBabyStep" class="blue lighten-3">
			<v-btn @click="DialogBabyStep = false" x-large block class="blue lighten-3">
				<v-icon x-large>mdi-close</v-icon>
			</v-btn>
			<v-col cols="12" align="center" class="mt-0">
				<z-babystep-panel></z-babystep-panel>
			</v-col>
		</v-dialog>
		<!-- domotek: velocidad con el diseño nuevo -->
		<v-dialog v-if="temaBio" v-model="DialogSpeed" max-width="760" content-class="bio-teclado-dialogo">
			<bio-ajuste-trabajo v-if="DialogSpeed" tipo="velocidad" @cerrar="DialogSpeed = false"></bio-ajuste-trabajo>
		</v-dialog>
		<v-dialog v-else v-model="DialogSpeed">
			<v-btn @click="DialogSpeed = false" x-large block class="blue lighten-3">
				<v-icon x-large>mdi-close</v-icon>
			</v-btn>
			<v-col cols="12" align="center" class="mt-0">
				<speed-factor-panel></speed-factor-panel>
			</v-col>
		</v-dialog>
		<!-- domotek: extrusion con el diseño nuevo -->
		<v-dialog v-if="temaBio" v-model="DialogExtrusion" max-width="760" content-class="bio-teclado-dialogo">
			<bio-ajuste-trabajo v-if="DialogExtrusion" tipo="extrusion" @cerrar="DialogExtrusion = false"></bio-ajuste-trabajo>
		</v-dialog>
		<v-dialog v-else v-model="DialogExtrusion" content-class="clsDialogExtrusion">
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
		<v-dialog v-model="DialogCalibration" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<calibration-panel v-on:close-dialog="DialogCalibration = false"></calibration-panel>
			</v-col>
		</v-dialog>
		<v-dialog v-model="DialogTmp" fullscreen hide-overlay>
			<v-col cols="12" align="center" class="ma-0 pa-0">
				<temp-panel v-on:close-dialog="closeDialog"></temp-panel>
			</v-col>
		</v-dialog>
		
		<!-- domotek: Trabajos con el tema oscuro: pestaña Trabajo y pestaña Procesos -->
		<div v-if="temaBio" class="bio-job">
			<div class="bio-job-tabs bio-segmentos" role="tablist">
				<button type="button" role="tab" class="bio-seg" :class="{ activo: bioPestana === 'trabajo' }" :aria-selected="bioPestana === 'trabajo'" @click="bioPestana = 'trabajo'">{{ $t('domotek.jobs.tabJob') }}</button>
				<button type="button" role="tab" class="bio-seg" :class="{ activo: bioPestana === 'procesos' }" :aria-selected="bioPestana === 'procesos'" @click="bioPestana = 'procesos'">
					{{ $t('domotek.jobs.tabProcesses') }}<span v-if="bioProcesosActivos.length" class="bio-job-tab-n">{{ bioProcesosActivos.length }}</span>
				</button>
			</div>

			<section class="bio-job-cab">
				<div class="bio-job-fila">
					<span class="bio-estado" :class="{ activo: bioImprimiendo && !bioPausado, pausa: bioPausado }"><span class="bio-estado-punto" :style="{ background: bioPausado ? '#F2A65A' : (bioImprimiendo ? '#3CC9B0' : '#5A6670') }"></span>{{ bioEstadoTexto }}</span>
					<span class="bio-job-archivo">{{ bioImprimiendo ? bioArchivo : $t('domotek.jobs.noJob') }}</span>
					<span v-if="bioImprimiendo" class="bio-job-pct">{{ Math.round(jobProgress * 100) }} %</span>
					<template v-else>
						<code-btn v-if="bioRepetirCode" class="bio-btn-sec-peq" :code="bioRepetirCode" no-wait><v-icon left small>mdi-restart</v-icon>{{ $t('domotek.jobs.repeat') }}</code-btn>
						<button type="button" class="bio-btn-acento" @click="cambiarRuta('/Files/Jobs')">{{ $t('domotek.jobs.chooseFile') }}</button>
					</template>
				</div>
				<div class="bio-barra" role="img" :aria-label="`${Math.round(jobProgress * 100)} %`"><div :style="{ width: (bioImprimiendo ? jobProgress * 100 : 0) + '%' }"></div></div>
				<div class="bio-job-datos">
					<span>{{ $t('domotek.jobs.layer') }} <strong>{{ bioImprimiendo && job.file && job.file.numLayers ? `${job.layer || 0} / ${job.file.numLayers}` : '—' }}</strong></span>
					<span>{{ $t('domotek.jobs.elapsed') }} <strong>{{ bioImprimiendo ? $displayTime(job.duration) : '—' }}</strong></span>
					<span>{{ $t('domotek.jobs.remaining') }} <strong>{{ bioImprimiendo && bioQueda !== null ? $displayTime(bioQueda) : '—' }}</strong></span>
					<div style="flex: 1"></div>
					<span v-if="bioHV" class="bio-aviso"><v-icon small color="#F5B52E">mdi-flash</v-icon>{{ $t('panel.jobControl.warninghv') }}</span>
					<span v-if="bioUV" class="bio-aviso"><v-icon small color="#B49CF2">mdi-flash</v-icon>{{ $t('panel.jobControl.warninguv') }}</span>
					<span>Tool <strong>{{ bioToolActual }}</strong></span>
				</div>
			</section>

			<!-- Pestaña Trabajo -->
			<div v-show="bioPestana === 'trabajo'" class="bio-job-cuerpo">
				<section class="bio-job-vista">
					<bio-vista-trabajo :modos="bioEscritorio ? ['webcam', 'capas', 'figura'] : ['figura']"></bio-vista-trabajo>
					<div class="bio-job-chips">
						<span v-for="p in bioProcesosActivos" :key="p.id" class="bio-chip-proc" :style="{ color: p.color }">{{ p.texto }}</span>
					</div>
				</section>

				<section class="bio-job-controles">
					<code-btn class="bio-tile" :code="bioPausado ? 'M24' : 'M25'" :disabled="!bioImprimiendo" no-wait>
						<v-icon>{{ bioPausado ? 'mdi-play' : 'mdi-pause' }}</v-icon><span>{{ bioPausado ? $t('domotek.jobs.resume') : $t('domotek.jobs.pause') }}</span>
					</code-btn>
					<code-btn class="bio-tile peligro" :code="bioCancelCode" :disabled="!bioPausado" no-wait>
						<v-icon>mdi-stop</v-icon><span>{{ $t('domotek.jobs.cancel') }}</span>
					</code-btn>
					<button type="button" class="bio-tile valor" @click="DialogBabyStep = true"><span class="et">{{ $t('domotek.jobs.zAdjust') }}</span><span class="vl">{{ bioBabystep }}</span></button>
					<button type="button" class="bio-tile valor" @click="DialogSpeed = true"><span class="et">{{ $t('domotek.jobs.speed') }}</span><span class="vl">{{ bioVelocidad }} %</span></button>
					<button type="button" class="bio-tile valor" @click="DialogExtrusion = true"><span class="et">{{ $t('domotek.jobs.extrusion') }}</span><span class="vl">{{ bioExtrusion }} %</span></button>
					<button type="button" class="bio-tile" :disabled="!TMCapable" @click="DialogTmp = true"><v-icon color="#F2A65A">mdi-thermometer-lines</v-icon><span>{{ $t('domotek.jobs.keepTemps') }}</span></button>
				</section>
			</div>

			<!-- Pestaña Procesos -->
			<section v-show="bioPestana === 'procesos'" class="bio-job-procesos">
				<button v-if="ESCapable" type="button" class="bio-proc" @click="MuestraES">
					<v-icon color="#F2D35A">mdi-flash-outline</v-icon>
					<span class="nom">{{ $t('domotek.jobs.electrospinning') }}</span>
					<span class="est" :class="{ on: bioProc.ES }">{{ bioProc.ES || $t('domotek.jobs.notScheduled') }}</span>
				</button>
				<button v-if="UVCapable" type="button" class="bio-proc" @click="MuestraUV">
					<v-icon color="#B49CF2">mdi-white-balance-sunny</v-icon>
					<span class="nom">{{ $t('domotek.jobs.ultraviolet') }}</span>
					<span class="est" :class="{ on: bioProc.UV }">{{ bioProc.UV || $t('domotek.jobs.notScheduled') }}</span>
				</button>
				<button v-if="EMDCapable" type="button" class="bio-proc" @click="MuestraEMD">
					<v-icon color="#3CC9B0">mdi-water-outline</v-icon>
					<span class="nom">{{ $t('domotek.jobs.EMD') }}</span>
					<span class="est" :class="{ on: bioProc.EMD }">{{ bioProc.EMD || $t('domotek.jobs.notScheduled') }}</span>
				</button>
				<button v-if="CLCapable" type="button" class="bio-proc" @click="DialogClean = true">
					<v-icon>mdi-brush-variant</v-icon>
					<span class="nom">{{ $t('domotek.jobs.clean') }}</span>
					<span class="est" :class="{ on: bioProc.CL }">{{ bioProc.CL || $t('domotek.jobs.notScheduled') }}</span>
				</button>
				<div v-if="!ESCapable && !UVCapable && !EMDCapable && !CLCapable" class="bio-tenue" style="grid-column: 1 / -1; text-align: center; align-self: center">{{ $t('domotek.jobs.noProcesses') }}</div>
			</section>

			<section class="bio-job-temps">
				<span v-for="t in bioTemps" :key="t.et"><span class="bio-cap">{{ t.et }}</span> <strong>{{ t.vl === null ? '—' : `${t.vl}` }}</strong><span v-if="t.obj" class="obj"> / {{ t.obj }}</span> <span class="ud">{{ t.ud || '°C' }}</span></span>
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
import { esEscritorio } from '../../utils/modoPantalla.js'
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
			DialogEMD: false,
			bioPestana: 'trabajo', // domotek
			DialogCalibration: false
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
		bioEscritorio() { return esEscritorio(); },
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
		bioToolActual() {
			const g = this.$store.state.machine.model.global || {};
			for (let i = 0; i < 4; i++) {
				if (g['T' + i + 'Activo']) { return `T${i + 1} · ${g['T' + i + 'Name'] || ''}`; }
			}
			return '—';
		},
		bioBabystep() {
			const ax = this.$store.state.machine.model.move.axes;
			const v = (ax && ax.length >= 3) ? ax[2].babystep : 0;
			return (v > 0 ? '+' : '') + (v || 0).toFixed(2);
		},
		bioVelocidad() { return Math.round((this.$store.state.machine.model.move.speedFactor || 1) * 100); },
		bioExtrusion() {
			const e = this.$store.state.machine.model.move.extruders || [];
			return e.length ? Math.round((e[0].factor || 1) * 100) : 100;
		},
		bioWebcam() {
			const w = this.$store.state.settings.webcam;
			return !!(w && w.url);
		},
		bioProc() { // domotek: resumen de los procesos automáticos programados
			const g = this.$store.state.machine.model.global || {};
			const texto = (id) => {
				if (!g['enable' + id]) { return ''; }
				if (g['cadenceEnable' + id]) { return this.$t('domotek.jobs.everyNLayers', [g['cadenceAmount' + id] || 1]); }
				if (g['aplicarFin' + id]) { return this.$t('domotek.jobs.atEnd'); }
				return this.$t('domotek.jobs.scheduled');
			};
			return { ES: texto('ES'), UV: texto('UV'), EMD: texto('EMD'), CL: texto('CL') };
		},
		bioProcesosActivos() {
			const lista = [
				{ id: 'UV', nombre: 'UV', color: '#B49CF2', ok: this.UVCapable },
				{ id: 'ES', nombre: 'ES', color: '#F2D35A', ok: this.ESCapable },
				{ id: 'EMD', nombre: 'EMD', color: '#3CC9B0', ok: this.EMDCapable },
				{ id: 'CL', nombre: this.$t('domotek.jobs.clean'), color: '#E8EDF1', ok: this.CLCapable }
			];
			return lista.filter(p => p.ok && this.bioProc[p.id]).map(p => ({ ...p, texto: `${p.nombre} ${this.bioProc[p.id].toLowerCase()}` }));
		},
		bioTemps() { // domotek: tool activa (o T1), plataforma, chamber y humedad
			const h = this.heaterTools || [];
			const g = this.$store.state.machine.model.global || {};
			const val = x => (!x || x.current === undefined || x.current <= -273) ? null : x.current.toFixed(1);
			const obj = x => (x && x.state === 'active' && x.active) ? x.active : null;
			let t = 0;
			for (let i = 0; i < 4; i++) { if (g['T' + i + 'Activo']) { t = i; break; } }
			const out = [];
			if ((this.nameTools || []).length) { out.push({ et: `T${t + 1}`, vl: val(h[t + 1]), obj: obj(h[t + 1]) }); }
			out.push({ et: this.$t('domotek.tools.platform'), vl: val(h[0]), obj: obj(h[0]) });
			if (h[20] && g.ChamberMode) { out.push({ et: 'Chamber', vl: val(h[20]), obj: obj(h[20]) }); }
			if (g.miniclima_rh !== undefined && g.miniclima_rh !== null) { out.push({ et: this.$t('domotek.tools.humidity'), vl: Number(g.miniclima_rh).toFixed(0), obj: null, ud: '%' }); }
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
		bioAbrirDesdeRuta() { // domotek: el menú de escritorio abre procesos con ?abrir=ES|UV|EMD|CL|CAL o ?pestana=procesos
			const q = this.$route.query || {};
			if (q.pestana === 'procesos' || q.pestana === 'trabajo') { this.bioPestana = q.pestana; }
			const abrir = q.abrir;
			if (!abrir) { return; }
			if (abrir === 'ES') { this.MuestraES(); }
			else if (abrir === 'UV') { this.MuestraUV(); }
			else if (abrir === 'EMD') { this.MuestraEMD(); }
			else if (abrir === 'CL') { this.DialogClean = true; }
			else if (abrir === 'CAL') { this.DialogCalibration = true; }
			this.$router.replace({ path: this.$route.path, query: {} }).catch(() => {});
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
		this.bioAbrirDesdeRuta(); // domotek
	},
	activated() { this.bioAbrirDesdeRuta(); }, // domotek
	watch: {
		'$route.query'() { this.bioAbrirDesdeRuta(); } // domotek
	}
}
</script>

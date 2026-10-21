<template>
	<v-card id="vcard1" class="blue lighten-4"  elevation="0">
		<!-- Quitado por Ricardo <v-card-title class="pb-5">
			<v-icon small class="mr-1">mdi-wrench</v-icon> {{ $t('panel.jobControl.caption') }}
		</v-card-title> -->

		<!-- Jon Ander 2024/07/16    cambio el siguiente "v-card-text". He bajado la altura 200 → 190 pixeles  para que no haya scroll  -->
		<v-card-text style="height:190px" class="pt-5 pb-5"  >			
			<!-- Jon Ander 2024/07/16	cambio el siguiente "v-row". He metido tambien UV y les he puesto los v-if para que no ocupen sitio vertical cuando no hacen falta -->
			<v-row>
				<v-col v-if= "hvProbe || uvProbe"  cols="12" align="center" >
					
					<template	v-if= hvProbe>
						<v-icon	large style="color: yellow;" mr-1>mdi-flash</v-icon>
						<span	style="color:red" >		<strong> {{ $t('panel.jobControl.warninghv') }} </strong>		</span>
						<v-icon	large style="color: yellow;" mr-1>mdi-flash</v-icon>
					</template>

					<template	v-if="uvProbe">
						<v-icon	large style="color: yellow;" mr-1>	mdi-flash	</v-icon>
						<span	style="color:red; ">	<strong>{{ $t('panel.jobControl.warninguv') }}</strong>	</span>
						<v-icon	large style="color: yellow;" mr-1>	mdi-flash	</v-icon>								
					</template>

					<!-- 2024/07/17		Jon Ander -->
					<!-- He provado otros iconos para que salgan a los lados del mensaje de luz UV, ninguno a llegado a convencernos -->
					<!--	mdi-flashlight	-->
					<!--	mdi-lightbulb	-->
					
				</v-col>
			</v-row>


			<v-row>
				<v-col :cols="isPaused ? '6':'12'" v-if="isPrinting" align="center">
					<code-btn-redondo color="warning" height="130px" width="130px" :disabled="uiFrozen || !isPrinting" :code="isPaused ? 'M24' : 'M25'" tabindex="0">
						<!-- <v-icon class="mr-1">mdi-pause</v-icon> -->
						<!-- <v-icon class="mr-1">{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon> {{ pauseResumeText }} -->
						<v-icon class="mr-1" x-large>{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
					</code-btn-redondo>
				</v-col>
				<v-col cols="6" v-if="isPaused" align="center" >
					<code-btn-redondo height="130px" width="130px" color="error" :code="cancelCode">
						<!-- <v-icon class="mr-1">mdi-stop</v-icon> {{ cancelText }} -->
						<v-icon class="mr-1" x-large>mdi-stop</v-icon>
					</code-btn-redondo>
				</v-col>
				<v-col cols="12" v-if="!isPrinting && processAnotherCode" align="center">
					<code-btn-redondo height="130px" width="130px" color="success" :code="processAnotherCode">
						<v-icon class="mr-1" x-large>	mdi-restart	</v-icon>
						<!-- <v-icon class="mr-1">mdi-restart</v-icon> {{ processAnotherText }} -->
					</code-btn-redondo>
				</v-col>
			</v-row>
			

			
			<!-- <v-switch :label="$t('panel.jobControl.autoSleep')" v-model="autoSleepActive" :disabled="uiFrozen" hide-details></v-switch> -->
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapMutations } from 'vuex'

import { MachineMode, StatusType, isPaused, isPrinting } from '@/store/machine/modelEnums'

export default {
	computed: {
		...mapState('machine', ['autoSleep']),
		...mapState('machine/model', {
			lastFileName: state => state.job.lastFileName,
			lastFileSimulated: state => state.job.lastFileSimulated,
			machineMode: state => state.state.machineMode,
			status: state => state.state.status,
			thumbnails: state => state.job.file.thumbnails,
			gpOuts: state => state.state.gpOut
		}),
		...mapGetters(['uiFrozen']),
		autoSleepActive: {
			get() { return this.autoSleep; },
			set(value) { this.setAutoSleep(value) }
		},
		isPausing() { return this.status === StatusType.pausing; },
		isPaused() { return isPaused(this.status); },
		isPrinting() { return isPrinting(this.status); },
		pauseResumeText() {
			if (this.isSimulating) {
				return this.$t(this.isPaused ? 'panel.jobControl.resumeSimulation' : 'panel.jobControl.pauseSimulation');
			}
			if (this.machineMode === MachineMode.fff) {
				return this.$t(this.isPaused ? 'panel.jobControl.resumePrint' : 'panel.jobControl.pausePrint');
			}
			return this.$t(this.isPaused ? 'panel.jobControl.resumeJob' : 'panel.jobControl.pauseJob');
		},


		hvProbe() {
			if (this.modeloMaquina === "2A") {
				return (
					this.gpOuts[1].pwm > 0 ||
					this.gpOuts[2].pwm > 0
				);
			} else {
				return (
					this.gpOuts[1].pwm > 0 ||
					this.gpOuts[2].pwm > 0 ||
					this.gpOuts[3].pwm > 0 ||
					this.gpOuts[4].pwm > 0
				);
			}
		},

		uvProbe() {
			if (this.modeloMaquina === "2A") {
				return (
					this.gpOuts[9].pwm > 0 ||
					this.gpOuts[10].pwm > 0
				);
			} else {
				return (
					this.gpOuts[9].pwm > 0 ||
					this.gpOuts[10].pwm > 0 ||
					this.gpOuts[11].pwm > 0 ||
					this.gpOuts[12].pwm > 0
				);
			}
		},
		
		cancelText() {
			if (this.isSimulating) {
				return this.$t('panel.jobControl.cancelSimulation');
			}
			if (this.machineMode === MachineMode.fff) {
				return this.$t('panel.jobControl.cancelPrint');
			}
			return this.$t('panel.jobControl.cancelJob');
		},
		processAnotherCode() {
			if (this.lastFileName) {
				if (this.lastFileSimulated) {
					return `M37 P"${this.lastFileName}"`;
				}
				return `M32 "${this.lastFileName}"`;
			}
			return '';
		},
		processAnotherText() {
			if (this.lastFileSimulated) {
				return this.$t('panel.jobControl.repeatSimulation');
			}
			if (this.machineMode === MachineMode.fff) {
				return this.$t('panel.jobControl.repeatPrint');
			}
			return this.$t('panel.jobControl.repeatJob');
		},
		validThumbnails() {
			return this.thumbnails.filter(thumbnail => !!thumbnail.data);
		},
		modeloMaquina: {
			get() {
					try {
							return this.$store.state.machine.model.global.MachineModel ;
					} catch (error) {
							console.log(`error PositionPanel.vue modeloMaquina`);
							return "2A";
					}
			}
		},
		cancelCode() {
			if (this.$store.state.machine.model.global.notifyPrintCanceled) {
				return "set global.jobWasCancelled = true\nM1212\nM0 H1"
			}
			return "set global.jobWasCancelled = true\nM0 H1"
		}
	},
	data() {
		return {
			isSimulating: false
		}
	},
	methods: mapMutations('machine', ['setAutoSleep']),
	mounted() {
		this.isSimulating = (this.status === StatusType.simulating);
	},
	watch: {
		status(to) {
			if (to === StatusType.simulating) {
				this.isSimulating = true;
			} else if (!this.isPrinting) {
				this.isSimulating = false;
			}
		}
	}
}
</script>

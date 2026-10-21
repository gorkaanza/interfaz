<style>
.move-btn {
	padding-left: 0 !important;
	padding-right: 0 !important;
	min-width: 0;
}
</style>

<template>
	<v-row elevation="0" class="blue lighten-4">

		<v-card-text v-show="visibleAxes.length">
			<!-- Mobile home buttons -->
			<!-- <position-panel class="mt-1"></position-panel> -->
			

			
			<v-row class="mt-0">
				
				<v-col cols="10" lg="9" class="">
					<v-row>
						<v-col cols="" align="center" class="mb-0">
							<v-icon class="mt-0">mdi-alpha-y-circle-outline</v-icon>
							<code-btn-redondo :code="modeloMaquina != '2A' ? `M120\nG91\nG1 Y${sizeMove} F600\nG90\nM121`:`M120\nG91\nG1 Y-${sizeMove}  F600\nG90\nM121`" no-wait class="move-btn material-icons">
								<v-icon size="70"> mdi-arrow-up-bold-circle </v-icon>
							</code-btn-redondo>
							<v-icon class="mx-3"></v-icon>
						</v-col>
					
						<v-col cols="12" align="center" class="pa-0">
							<v-icon class="mt-10">mdi-alpha-x-circle-outline</v-icon>
							<code-btn-redondo :code="modeloMaquina != '2A' ? `M120\nG91\nG1 X${sizeMove} F600\nG90\nM121`:`M120\nG91\nG1 X-${sizeMove} F600\nG90\nM121`" no-wait class="move-btn mr-10">
								<v-icon  size="70">mdi-arrow-left-bold-circle</v-icon>
							</code-btn-redondo>
							<!-- <v-btn-toggle v-model="toggleTool" color="blue" background-color="teal lighten-5" rounded>
								<code-btn :code="toolsActive0state == 'active' ? `t-1` : `t0`" no-wait class="move-btn" height="50" width="60">
									<span>	{{ $t('domotek.tools.T0Mini') }}	</span>
								</code-btn>
								<code-btn :code="toolsActive1state == 'active' ? `t-1` : `t1`" no-wait class="move-btn" height="50" width="60">
									<span>	{{ $t('domotek.tools.T1Mini') }}	</span>
								</code-btn>
								<code-btn :code="toolsActive2state == 'active' ? `t-1` : `t2`" no-wait class="move-btn" height="50" width="60"		v-if="modeloMaquina != '2A'">
									<span>	{{ $t('domotek.tools.T2Mini') }}	</span>
								</code-btn>
								<code-btn :code="toolsActive3state == 'active' ? `t-1` : `t3`" no-wait class="move-btn" height="50" width="60"		v-if="modeloMaquina != '2A'" >
									<span>	{{ $t('domotek.tools.T3Mini') }}	</span>
								</code-btn> -->
							<v-btn-toggle v-model="toogleToolState" color="blue" background-color="blue lighten-5" rounded>
								<code-btn :code="toolsActive0state == 'active' ? `t-1` : `t0`" no-wait class="move-btn" height="50" width="60">
									<span>	{{ $t('domotek.tools.T0Mini') }}	</span>
								</code-btn>
								<code-btn :code="toolsActive1state == 'active' ? `t-1` : `t1`" no-wait class="move-btn" height="50" width="60">
									<span>	{{ $t('domotek.tools.T1Mini') }}	</span>
								</code-btn>
								<code-btn :code="toolsActive2state == 'active' ? `t-1` : `t2`" no-wait class="move-btn" height="50" width="60"   v-if="modeloMaquina != '2A'">
									<span> 	{{ $t('domotek.tools.T2Mini') }}	</span>
								</code-btn>
								<code-btn :code="toolsActive3state == 'active' ? `t-1` : `t3`" no-wait class="move-btn" height="50" width="60"   v-if="modeloMaquina != '2A'">
									<span>	{{ $t('domotek.tools.T3Mini') }}	</span>
								</code-btn>
								<!-- <v-btn @click="changeAxis('X')" tile class="move-btn" height="50" width="60">
								</v-btn> -->
								<!-- <v-btn @click="changeAxis('U')" tile class="move-btn" height="50" width="60">
									<span>T1</span>
								</v-btn>
								<v-btn v-if="boards.length > 0" @click="changeAxis('v')" tile class="move-btn" height="50" width="60">
									<span>T2</span>
								</v-btn>
								<v-btn v-if="boards.length > 0" @click="changeAxis('v')" tile class="move-btn" height="50" width="60">
									<span>T3</span>
								</v-btn> -->
							</v-btn-toggle>
							<v-icon class="mt-10 ml-6">mdi-alpha-x-circle-outline</v-icon>
							<code-btn-redondo :code="boards.length > 2 ? `M120\nG91\nG1 X-${sizeMove}  F600\nG90\nM121`:`M120\nG91\nG1 X${sizeMove} F600\nG90\nM121`" no-wait class="move-btn ml-0 mr-4">
								<v-icon size="70">mdi-arrow-right-bold-circle</v-icon>
							</code-btn-redondo>
						</v-col>
						
						<!-- <v-col cols="2" align="right">
						</v-col> -->
						<v-col cols="12" align="center" class="mt-1 pa-0">
							<v-icon class="mt-10 pa-0">mdi-alpha-y-circle-outline</v-icon>
							<code-btn-redondo :code="boards.length > 2 ? `M120\nG91\nG1 Y-${sizeMove} F600\nG90\nM121`:`M120\nG91\nG1 Y${sizeMove}  F600\nG90\nM121`" no-wait class="move-btn">
								<v-icon size="70">mdi-arrow-down-bold-circle</v-icon>
							</code-btn-redondo>
							<v-icon class="mx-3"></v-icon>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="2" lg="3" class="mt-0 pa-0" align="left">
					<v-col cols="12" class="">
						<code-btn-redondo :code="`M120\nG91\nG1 Z${sizeMove} F600\nG90\nM121`" no-wait class="move-btn">
							<v-icon size="70">mdi-arrow-up-bold-circle</v-icon>
						</code-btn-redondo>
					</v-col>
					<v-col cols="12" class="ml-7 pa-0">
						<v-icon>mdi-alpha-z-circle-outline</v-icon>
					</v-col>
					<v-col cols="12" class="">
						<code-btn-redondo :code="`M120\nG91\nG1 Z-${sizeMove}  F600\nG90\nM121`" no-wait class="move-btn">
							<v-icon size="70">mdi-arrow-down-bold-circle</v-icon>
						</code-btn-redondo>
					</v-col>
				</v-col>
				<v-col cols="1" class="hidden-md-and-down"></v-col>
				<v-col cols="7" align="center" justify="center" class="ml-0">
					<v-btn-toggle v-model="toggleMove" color="blue" background-color="blue lighten-4" rounded>
						<v-btn @click="changeSizeMove(0.1)" tile class="move-btn" height="40" width="60">
							<span>0.1 </span>
						</v-btn>
						<v-btn @click="changeSizeMove(0.5)" tile class="move-btn" height="40" width="60">
							<span>0.5</span>
						</v-btn>
						<v-btn @click="changeSizeMove(1)" tile class="move-btn" height="40" width="60">
							<span>1</span>
						</v-btn>
						<v-btn @click="changeSizeMove(5)" tile class="move-btn" height="40" width="60">
							<span>5</span>
						</v-btn>
						<v-btn @click="changeSizeMove(25)" tile class="move-btn" height="40" width="60">
							<span>25</span>
						</v-btn>
					</v-btn-toggle>
					<span class="ml-2 pt-5">mm</span> 
				</v-col>
				
				<v-col cols="4">
						<!-- <v-badge color="teal" v-if="move.axes[0].homed">
							<v-btn class="blue lighten-5" block rounded @click="dialog = true">

								<span>{{ $t('domotek.calibracion.calibrate_button') }}</span> 
							</v-btn>
						</v-badge> -->

						<!-- BOTÓN CALIBRATION (solo si todo está homed) -->
						<v-badge color="teal" v-if="allAxesHomed">
							<v-btn class="blue lighten-5" block rounded @click="dialog = true" :disabled="bloqueado">
								<span>{{ $t('domotek.calibracion.calibrate_button') }}</span>
							</v-btn>
						</v-badge>
						<!-- <code-btn v-if="!move.axes[0].homed" :color="move.axes[0].homed ? 'teal':'warning'" code="G28" :title="$t('button.home.titleAll')" block rounded style="border:10px;">
							<span>
								{{ $t('button.home.captionAll') }}
							</span>
						</code-btn> -->
						<!-- <code-btn :color="(modeloMaquina === '2A' ? move.axes[0].homed && move.axes[1].homed && move.axes[2].homed && move.axes[3].homed : move.axes[0].homed && move.axes[1].homed && move.axes[2].homed && move.axes[3].homed && move.axes[4].homed && move.axes[5].homed && move.axes[6].homed ) ? 'teal' : 'warning'" code="G28" :title="$t('button.home.titleAll')" block rounded style="border:10px;" >
							<span>
								{{ $t('button.home.captionAll') }}
							</span>
						</code-btn> -->
						<!-- BOTÓN HOME (solo si NO está todo homed) -->
						<v-btn
							v-else
							color="warning"
							block
							rounded
							style="border:10px;"
							:disabled="bloqueado"
							:title="$t('button.home.titleAll')"
							@click="EjecutarHome"
						>
							<span>{{ $t('button.home.captionAll') }}</span>
						</v-btn>
				</v-col>
				<!-- <v-col cols="2" lg="1" class="ml-0 mt-5" align="center">
					<code-btn :code="`M18`" icon>
						<v-row>
							<v-col cols="12">
								<v-icon class="mb-4" x-large> mdi-engine-off </v-icon>
								<br>
								<span>{{ $t('domotek.movePanel.disableSteppers') }}</span>
							</v-col>
							<v-col>
								
							</v-col>
						</v-row>
					</code-btn>
				</v-col>
				<v-col cols="3" lg="2" class="ml-0 mt-5" align="center">
					<v-btn @click="dialogExtrude = true" icon>
						<v-row>
							<v-col cols="12">
								<v-icon class="mb-4" x-large> mdi-printer-3d-nozzle-alert </v-icon>
								<br>
								<span >{{ $t('domotek.movePanel.extrude') }}</span>
							</v-col>
							<v-col>
							</v-col>
						</v-row>
					</v-btn>
				</v-col> -->

				<v-dialog v-model="dialog" max-width="600">
					<v-card>
						<v-card-title class="headline">
						{{ $t('domotek.calibracion.calibrate_option') }}
						</v-card-title>
						<v-card-actions>
							<!-- <v-spacer></v-spacer> -->
							<v-row>
								<v-col align="center">
									<v-btn width="100" height="100" rounded color="red lighten-3" text @click="dialog = false" outlined>
										<code-btn width="100" height="100"  color="red lighten-3" rounded>
											{{ $t('generic.cancel') }}
										</code-btn>
									</v-btn>
								</v-col>
								<v-col align="center">
									<v-btn
										width="100" height="100" rounded color="green darken-1" text outlined
										:disabled="bloqueado"
										@click="EjecutarCalibracion('XY')"
									>
										<code-btn width="100" height="100" rounded color="green lighten-3">
											X-Y
										</code-btn>
									</v-btn>
								</v-col>
								<v-col align="center">
									<v-btn
										width="100" height="100" rounded color="green darken-1" text outlined
										:disabled="bloqueado"
										@click="EjecutarCalibracion('Z')"
									>
										<code-btn width="100" height="100" rounded color="blue lighten-3">
											Z
										</code-btn>
									</v-btn>
								</v-col>
							</v-row>

						</v-card-actions>
					</v-card>
				</v-dialog>
				
				<v-dialog v-model="dialogExtrude">
					<v-btn @click="dialogExtrude = false" x-large block class="blue lighten-3">
						<v-icon x-large> mdi-close </v-icon>
					</v-btn>
					<v-col cols="12" align="center" class="mb-3">
						
						<!-- <calibration-file-list></calibration-file-list> -->
						<extrude-panel></extrude-panel>
					</v-col>
				</v-dialog>
			</v-row>
		</v-card-text>

		<mesh-edit-dialog :shown.sync="showMeshEditDialog"></mesh-edit-dialog>
		<input-dialog :shown.sync="moveStepDialog.shown" :title="$t('dialog.changeMoveStep.title')" :prompt="$t('dialog.changeMoveStep.prompt')" :preset="moveStepDialog.preset" is-numeric-value @confirmed="moveStepDialogConfirmed"></input-dialog>
			<!-- IVAN - Luis -->
			<!-- Nombre de los ejes personalizados -->
		<!-- <v-row>
			<v-col cols="12" align="center">
				<v-alert :value="unhomedAxes.length !== 0" type="warning" class="mb-0">
					{{ $tc('panel.movement.axesNotHomed', unhomedAxes.length) }}
					<strong v-for="axis in unhomedAxes" :key="axis">
						<span v-if="boards.length <= 1">
							<span v-if="axis.letter=='X'">
								{{'X0,'}}
							</span>
							<span v-if="axis.letter=='Y'">
								{{'Y,'}}
							</span>
							<span v-if="axis.letter=='Z'">
								{{'Z,'}}
							</span>
							<span v-if="axis.letter=='U'">
								{{'X1'}}
							</span>
						</span>
						<span v-if="boards.length > 1">
							<span v-if="axis.letter=='X'">
								{{'X,'}}
							</span>
							<span v-if="axis.letter=='Y'">
								{{'Y0,'}}
							</span>
							<span v-if="axis.letter=='Z'">
								{{'Z0,'}}
							</span>
							<span v-if="axis.letter=='U'">
								{{'Y1,'}}
							</span>
							<span v-if="axis.letter=='V'">
								{{'Y2,'}}
							</span>
							<span v-if="axis.letter=='W'">
								{{ 'Y3,'}}
							</span>
							<span v-if="axis.letter=='A'">
								{{'Z1'}}
							</span>
						</span>
					</strong>
				</v-alert>
			</v-col>
		</v-row> -->

		<v-alert :value="visibleAxes.length === 0" type="info">
			{{ $t('panel.movement.noAxes') }}
		</v-alert>
	</v-row>
</template>

<script>
'use strict'


import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import { KinematicsName } from '../../store/machine/modelEnums.js'

export default {
	props: {
        calibrandoExterno: {
            type: Boolean,
            default: false
        }
    },
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', {
			boards: state => state.boards,
			fans: state => state.fans,
			move: state => state.move,
			machineMode: state => state.state.machineMode,
			sensors: state => state.sensors,
			status: state => state.state.status,
			toolsActive: state => state.tools,
			correntTool: state => state.state.currentTool
		}),
		...mapState('machine/settings', ['moveFeedrate']),
		...mapGetters('machine/settings', ['moveSteps', 'numMoveSteps']),
		isCompensationEnabled() { return this.move.compensation.type.toLowerCase() !== 'none' },
		visibleAxes() { return this.move.axes.filter(axis => axis.visible); },
		isDelta() {
			return ((this.move.kinematics.name === KinematicsName.delta) ||
					(this.move.kinematics.name === KinematicsName.rotaryDelta));
		},
		unhomedAxes() { return this.move.axes.filter(axis => axis.visible && !axis.homed); },

		//toolsActive[0].state
		
		toolsActive0state: {
			get() {
					try {
							if(this.$store.state.machine.model.global.T0Activo){
								return  "active";
							}
							else
							{
								return "inactive";
							}
					} catch (error) {
							console.log(`error toolsActive0state`);
							return "active";
					}
			}
		},
		toolsActive1state: {
			get() {
					try {
							if(this.$store.state.machine.model.global.T1Activo){
								return  "active";
							}
							else
							{
								return "inactive";
							}
							
					} catch (error) {
							console.log(`error toolsActive1state`);
							return "active";
					}
			}
		},
		toolsActive2state: {
			get() {
					try {
							if(this.$store.state.machine.model.global.T2Activo){
								return  "active";
							}
							else
							{
								return "inactive";
							}
							
					} catch (error) {
							console.log(`error toolsActive2state`);
							return "active";
					}
			}
		},
		toolsActive3state: {
			get() {
					try {
							if(this.$store.state.machine.model.global.T3Activo){
								return  "active";
							}
							else
							{
								return "inactive";
							}
							
					} catch (error) {
							console.log(`error toolsActive3state MovementPanel.vue`);
							return "active";
					}
			}
		},
		toogleToolState: {
			get() {
					try {
						if(this.$store.state.machine.model.global.T0Activo){
							return  1;
						}
						else
						if(this.$store.state.machine.model.global.T1Activo){
							return  3;
						}
						else
						if(this.$store.state.machine.model.global.T2Activo){
							return  5;
						}
						else
						if(this.$store.state.machine.model.global.T3Activo){
							return  7;
						}
						else
							{
								return 0;
							}
							
					} catch (error) {
							console.log(`error toogleTollstate`);
							return 0;
					}
			}
		},

		modeloMaquina: {
			get() {
					try {
							return this.$store.state.machine.model.global.MachineModel ;
					} catch (error) {
							console.log(`error movementPanelCalibration modeloMaquina`);
							return 0;
					}
			}
		},
		allAxesHomed () {
			if (this.modeloMaquina === '2A') {
				return this.move.axes[0].homed &&
						this.move.axes[1].homed &&
						this.move.axes[2].homed &&
						this.move.axes[3].homed
				}

			return this.move.axes[0].homed &&
				this.move.axes[1].homed &&
				this.move.axes[2].homed &&
				this.move.axes[3].homed &&
				this.move.axes[4].homed &&
				this.move.axes[5].homed &&
				this.move.axes[6].homed
		},
		bloqueado() {
            return this.calibrando || this.calibrandoExterno;
        }
	},
	data() {
		return {
			showMeshEditDialog: false,
			dialogExtrude: false,
			moveStepDialog: {
				shown: false,
				axis: 'X',
				index: 0,
				preset: 0
			},
			letter: 'X',
			sizeMove: 1,
			toggleTool: 0,
			toggleMove: 2,
			countTools: 0,
			dialog: false,
			calibrando: false
		}

	},
	methods: {
		...mapActions('machine', ['sendCode']),
		...mapMutations('machine/settings', ['setMoveStep']),
		getMoveCellClass(index) {
			let classes = '';
			if (index === 0 || index === 5) {
				classes += 'hidden-lg-and-down';
			}
			if (index > 1 && index < 4 && index % 2 === 1) {
				classes += 'hidden-md-and-down';
			}
			return classes;
		},
		showSign: (value) => (value > 0) ? `+${value}` : value,
		showMoveStepDialog(axis, index) {
			this.moveStepDialog.axis = axis;
			this.moveStepDialog.index = index;
			this.moveStepDialog.preset = this.moveSteps(this.moveStepDialog.axis)[this.moveStepDialog.index];
			this.moveStepDialog.shown = true;
		},
		moveStepDialogConfirmed(value) {
			this.setMoveStep({ axis: this.moveStepDialog.axis, index: this.moveStepDialog.index, value });
		},
		changeAxis(letra){
			this.letter = letra;
		},
		changeSizeMove(size){
			this.sizeMove = size;
		},
		async EjecutarHome() {
			this.calibrando = true;
			try {
				await this.sendCode({ code: 'G28' });
			} catch (e) {
				console.error('Error ejecutando home:', e);
			} finally {
				this.calibrando = false;
			}
		},

		async EjecutarCalibracion(tipo) {
			this.dialog = false;
			const archivo = tipo === 'XY'
				? '/calibration/03_XY_offset.g'
				: '/calibration/03_Z_offset.g';

			this.calibrando = true;
			try {
				await this.sendCode({ code: `M98 P"${archivo}"` });
			} catch (e) {
				console.error('Error ejecutando calibración:', e);
			} finally {
				this.calibrando = false;
			}
		},
		// viewToolActive(){
		// 	return;
		// 	this.countTools = 0;
		// 	while (this.toolsActive.length) {
		// 		if (this.countTools == this.toolsActive.length) {
		// 			return;
		// 		}
		// 		try {
		// 			if (this.toolsActive[this.countTools].state == "active") {
		// 			console.log(this.toggleTool);
		// 			switch (this.countTools) {
		// 				case 0:
		// 					this.toggleTool = 1;
		// 					break;
		// 				case 1:
		// 					this.toggleTool = 3;
		// 					break;
		// 				case 2:
		// 					this.toggleTool = 5;
		// 					break;
		// 				case 3:
		// 					this.toggleTool = 7;
		// 					break;
					
		// 				default:
		// 					break;
		// 			}
		// 			return;
		// 		}else{
		// 			this.toggleTool = 0;
		// 		}	
		// 		} catch (error) {
					
		// 			console.log(`Catch error MovementPanelCalibration.viewToolActive()`);
		// 			this.toggleTool = 0;
		// 		}
				
		// 		this.countTools++;
		// 	}
		// }
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.showMeshEditDialog = false;
			this.moveStepDialog.shown = false;
		}
	},
	/* beforeMount(){
		//this.viewToolActive();
	} */
}
</script>

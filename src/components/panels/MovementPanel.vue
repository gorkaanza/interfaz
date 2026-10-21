<style>
 .move-btn {
	padding-left: 0 !important;
	padding-right: 0 !important;
	min-width: 0;
}

.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
    height: 48px;
    min-height: 0;
    min-width: unset;
}

</style> 

<template>
	<v-card elevation="0" class="blue lighten-4">

		<!-- <v-card-title > -->
			
			<!-- <code-btn v-show="visibleAxes.length" color="primary" small code="G28" :title="$t('button.home.titleAll')" class="ml-0 hidden-sm-and-down">
				{{ $t('button.home.captionAll') }}
			</code-btn> -->

			<!-- <v-spacer class="hidden-sm-and-down"></v-spacer>

			<v-icon small class="mr-1">mdi-swap-horizontal</v-icon> {{ $t('panel.movement.caption') }}

			<v-spacer></v-spacer> -->

			<!-- <v-menu offset-y left :disabled="uiFrozen">
				<template #activator="{ on }">
					<v-btn v-show="visibleAxes.length" color="primary" small class="mx-0" :disabled="uiFrozen" :elevation="1" v-on="on">
						{{ $t('panel.movement.compensation') }} <v-icon>mdi-menu-down</v-icon>
					</v-btn>
				</template>

				<v-card>
					<v-list>
						<template v-show="move.compensation">
							<v-list-item>
								<v-spacer></v-spacer>
								{{ $t('panel.movement.compensationInUse', [$t(`panel.movement.compensationType.${move.compensation.type}`)]) }}
								<v-spacer></v-spacer>
							</v-list-item>

							<v-divider></v-divider>
						</template>

						<v-list-item :disabled="!canHome" @click="sendCode('G32')">
							<v-icon class="mr-1">mdi-format-vertical-align-center</v-icon> {{ $t(isDelta ? 'panel.movement.runDelta' : 'panel.movement.runBed') }}
						</v-list-item>
						<v-list-item :disabled="!move.compensation.type || move.compensation.type.indexOf('Point') === -1" @click="sendCode('M561')">
							<v-icon class="mr-1">mdi-border-none</v-icon> {{ $t('panel.movement.disableBedCompensation') }} 
						</v-list-item>

						<v-divider></v-divider>

						<v-list-item :disabled="!canHome" @click="sendCode('G29')">
							<v-icon class="mr-1">mdi-grid</v-icon> {{ $t('panel.movement.runMesh') }}
						</v-list-item>
						<v-list-item :disabled="uiFrozen" @click="showMeshEditDialog = true">
							<v-icon class="mr-1">mdi-pencil</v-icon> {{ $t('panel.movement.editMesh') }}
						</v-list-item>
						<v-list-item :disabled="uiFrozen" @click="sendCode('G29 S1')">
							<v-icon class="mr-1">mdi-content-save</v-icon> {{ $t('panel.movement.loadMesh') }}
						</v-list-item>
						<v-list-item :disabled="!isCompensationEnabled" @click="sendCode('G29 S2')">
							<v-icon class="mr-1">mdi-grid-off</v-icon> {{ $t('panel.movement.disableMeshCompensation') }}
						</v-list-item>
					</v-list>
				</v-card>
			</v-menu> -->
		<!-- </v-card-title> -->

		<!-- domotek: Movimiento con el tema oscuro -->
		<div v-if="temaBio" v-show="visibleAxes.length !== 0" class="bio-mov">
			<section class="bio-pos">
				<div v-for="(axis, index) in visibleAxes" :key="index" class="bio-pos-eje">
					<div class="et">{{ bioEtiquetaEje(index, axis) }}</div>
					<div class="vl" :class="{ 'sin-home': !axis.homed }">{{ bioPosicion(axis) }}</div>
				</div>
				<code-btn code="G28" :title="$t('button.home.titleAll')" class="bio-home" :class="{ ok: bioTodoHomed }" no-wait>
					<v-icon left>mdi-home-outline</v-icon>{{ $t('button.home.captionAll') }}
				</code-btn>
			</section>

			<section class="bio-mandos">
				<div class="bio-cruz">
					<div></div>
					<code-btn class="bio-flecha" :code="boards.length > 2 ? `M120\nG91\nG1 Y${sizeMove}\nG90\nM121`:`M120\nG91\nG1 Y-${sizeMove}\nG90\nM121`" no-wait :title="'Y +'"><v-icon>mdi-arrow-up</v-icon>Y</code-btn>
					<div></div>
					<code-btn class="bio-flecha col" :code="modeloMaquina != '2A' ? `M120\nG91\nG1 X${sizeMove}\nG90\nM121`:`M120\nG91\nG1 X-${sizeMove}\nG90\nM121`" no-wait :title="'X −'"><v-icon>mdi-arrow-left</v-icon>X</code-btn>
					<div class="bio-cruz-centro">
						<div class="bio-segmentos" role="group" :aria-label="$t('domotek.movePanel.toolToMove')">
							<code-btn v-for="i in (modeloMaquina != '2A' ? [0, 1, 2, 3] : [0, 1])" :key="i" class="bio-seg" :class="{ activo: bioToolActivo === i }" :code="bioToolActivo === i ? `t-1` : `t${i}`" no-wait>
								{{ $t('domotek.tools.T' + i + 'Mini') }}
							</code-btn>
						</div>
					</div>
					<code-btn class="bio-flecha col" :code="modeloMaquina != '2A' ? `M120\nG91\nG1 X-${sizeMove}\nG90\nM121`:`M120\nG91\nG1 X${sizeMove}\nG90\nM121`" no-wait :title="'X +'"><v-icon>mdi-arrow-right</v-icon>X</code-btn>
					<div></div>
					<code-btn class="bio-flecha" :code="modeloMaquina != '2A' ? `M120\nG91\nG1 Y-${sizeMove}\nG90\nM121`:`M120\nG91\nG1 Y${sizeMove}\nG90\nM121`" no-wait :title="'Y −'"><v-icon>mdi-arrow-down</v-icon>Y</code-btn>
					<div></div>
				</div>
				<div class="bio-z">
					<code-btn class="bio-flecha" :code="`M120\nG91\nG1 Z${sizeMove} F2000\nG90\nM121`" no-wait :title="'Z +'"><v-icon>mdi-arrow-up</v-icon></code-btn>
					<span class="bio-tenue">Z</span>
					<code-btn class="bio-flecha" :code="`M120\nG91\nG1 Z-${sizeMove} F2000\nG90\nM121`" no-wait :title="'Z −'"><v-icon>mdi-arrow-down</v-icon></code-btn>
				</div>
			</section>

			<section class="bio-mov-abajo">
				<div class="bio-segmentos bio-pasos" role="group" :aria-label="$t('domotek.movePanel.stepSize')">
					<button v-for="(d, k) in [1, 5, 25, 50, 100]" :key="d" type="button" class="bio-seg" :class="{ activo: sizeMove === d }" @click="changeSizeMove(d), toggleMove = k">{{ d }}</button>
					<span class="bio-tenue bio-mm">mm</span>
				</div>
				<div style="flex: 1"></div>
				<button type="button" class="bio-accion" @click="disableSteppers"><v-icon>mdi-engine-off-outline</v-icon><span class="bio-cap">{{ $t('domotek.movePanel.disableSteppers') }}</span></button>
				<button type="button" class="bio-accion" @click="dialogExtrude = true"><v-icon>mdi-printer-3d-nozzle-outline</v-icon><span class="bio-cap">{{ $t('domotek.movePanel.extrude') }}</span></button>
				<button v-if="CLCapable" type="button" class="bio-accion" @click="DialogClean = true"><v-icon>mdi-brush-variant</v-icon><span class="bio-cap">{{ $t('domotek.jobs.clean') }}</span></button>
			</section>
		</div>

		<v-card-text v-if="!temaBio" v-show="visibleAxes.length !== 0" class="pb-0">
			<!-- Mobile home buttons -->
			<v-row class="mt-2"></v-row>
			<position-panel></position-panel>
			<v-row class="py-2" no-gutters>
				<v-col>
						<!-- <code-btn :color="move.axes[0].homed && move.axes[1].homed && move.axes[2].homed && move.axes[3].homed && move.axes[4].homed && move.axes[5].homed && move.axes[6].homed? 'teal':'warning'" code="G28" :title="$t('button.home.titleAll')" block rounded style="border:10px;">
							<span>
								{{ $t('button.home.captionAll') }}
							</span>
						</code-btn> -->
						<code-btn :color="(modeloMaquina === '2A' ? move.axes[0].homed && move.axes[1].homed && move.axes[2].homed && move.axes[3].homed : move.axes[0].homed && move.axes[1].homed && move.axes[2].homed && move.axes[3].homed && move.axes[4].homed && move.axes[5].homed && move.axes[6].homed ) ? 'teal' : 'warning'" code="G28" :title="$t('button.home.titleAll')" block rounded style="border:10px;" >
							<span>
								{{ $t('button.home.captionAll') }}
							</span>
						</code-btn>
				</v-col>
				<!-- <template v-if="!isDelta">
					<v-col v-for="(axis, axisIndex) in visibleAxes" :key="axisIndex">
						<code-btn :color="axis.homed ? 'primary' : 'warning'" :disabled="!canHome" :title="$t('button.home.title', [axis.letter])" :code="getHomeCode(axis)" block tile>
							{{ $t('button.home.caption', [axis.letter]) }}
						</code-btn>
					</v-col>
				</template> -->
			</v-row>
			<!-- Regular home buttons -->
			<!--IVAN - Luis -->
			<!-- <v-row v-for="(axis, axisIndex) in visibleAxes" :key="axisIndex" dense>

				<v-col v-if="!isDelta" cols="auto" class="flex-shrink-1 hidden-sm-and-down">
					<code-btn :color="axis.homed ? 'primary' : 'warning'" :disabled="uiFrozen" :title="$t('button.home.title', [axis.letter])" :code="`G28 ${axis.letter}`" class="ml-0">

						<strong v-if="boards.length <= 1">
							<span v-if="axisIndex==0"> 
								{{ 'X0' }}
							</span>
							<span v-if="axisIndex==1">
								{{ 'Y' }}
							</span>
							<span v-if="axisIndex==2">
								{{ 'Z' }}
							</span>
							<span v-if="axisIndex==3">
								{{ 'X1' }}
							</span>
						</strong>
						<strong v-if="boards.length > 1">
							<span v-if="axisIndex==0"> 
								{{ 'X' }}
							</span>
							<span v-if="axisIndex==1">
								{{ 'Y0' }}
							</span>
							<span v-if="axisIndex==2">
								{{ 'Z0' }}
							</span>
							<span v-if="axisIndex==3">
								{{ 'Y1' }}
							</span>
							<span v-if="axisIndex==4">
								{{ 'Y2' }}
							</span>
							<span v-if="axisIndex==5">
								{{ 'y3' }}
							</span>
							<span v-if="axisIndex==6">
								{{ 'Z1' }}
							</span>
						</strong>
					</code-btn>
				</v-col> -->

				<!-- Decreasing movements -->
				<!-- <v-col>
					<v-row no-gutters>
						<v-col v-for="index in numMoveSteps" :key="index"  :class="getMoveCellClass(index - 1)">
							<code-btn :code="getMoveCode(axis, index - 1, true)" :disabled="!canMove(axis)" no-wait @contextmenu.prevent="showMoveStepDialog(axis.letter, index - 1)" block tile class="move-btn">
								<v-icon>mdi-chevron-left</v-icon> {{ axis.letter + showSign(-moveSteps(axis.letter)[index - 1]) }}
							</code-btn>
						</v-col>
					</v-row>
				</v-col> -->

				<!-- Increasing movements -->
				<!-- z -->
			<!-- </v-row> -->
			<v-row class="mt-2">
				
				<v-col cols="10" lg="9" class="">
					<v-row>
						<v-col cols="" align="center" class="mb-0">
							<v-icon class="mt-10">mdi-alpha-y-circle-outline</v-icon>
							<!-- <span>Z+</span> -->
							<code-btn-redondo :code="boards.length > 2 ? `M120\nG91\nG1 Y${sizeMove}\nG90\nM121`:`M120\nG91\nG1 Y-${sizeMove}\nG90\nM121`" no-wait class="move-btn material-icons">
								<v-icon size="70"> mdi-arrow-up-bold-circle </v-icon>
							</code-btn-redondo>
							<v-icon class="mx-3"></v-icon>
							<!-- <span>...</span> -->
						</v-col>
						<!-- <v-col cols="2">
						</v-col> -->
						<v-col cols="12" align="center" class="pa-0 pt-3">
							<v-icon class="mt-10">mdi-alpha-x-circle-outline</v-icon>
							<code-btn-redondo :code="modeloMaquina != '2A' ? `M120\nG91\nG1 X${sizeMove}\nG90\nM121`:`M120\nG91\nG1 X-${sizeMove}\nG90\nM121`" no-wait class="move-btn mr-10">
								<v-icon  size="70">mdi-arrow-left-bold-circle</v-icon>
							</code-btn-redondo>
							<v-btn-toggle v-model="toogleToolState" color="teal" background-color="blue lighten-4" rounded>
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


								<!-- 													Jon Ander  2024/07/15															 	-->
								<!--		NO VEO NINGUN MOTIVO PARA USAR ESTE CODIGO EN 2 TROZOS PARA EL TOOL 4 CUANDO SE USA EL MISMO CODIGO PARA LOS TOOLS 1-2-3		-->
								<!-- 		LO HE PROBADO UN POCO Y SI FUNCIONA DE LA "NUEVA" MANERA																		-->
								<!-- 																																		-->
								<!-- <code-btn  v-if="modeloMaquina != '2A' && toolsActive3state == 'active'" :code="`T-1`" no-wait class="move-btn" height="50" width="60">
									<span>	{{ $t('domotek.tools.T3Mini') }}	 ??</span>
								</code-btn>
								<code-btn  v-if="modeloMaquina != '2A' && toolsActive3state != 'active'" :code="`T3`" no-wait class="move-btn" height="50" width="60">
									<span>	{{ $t('domotek.tools.T3Mini') }} ?	</span>
								</code-btn> -->
								


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
							<code-btn-redondo :code="modeloMaquina != '2A' ? `M120\nG91\nG1 X-${sizeMove}\nG90\nM121`:`M120\nG91\nG1 X${sizeMove}\nG90\nM121`" no-wait class="move-btn ml-0 mr-4">
								<v-icon size="70">mdi-arrow-right-bold-circle</v-icon>
							</code-btn-redondo>
						</v-col>
						
						<!-- <v-col cols="2" align="right">
						</v-col> -->
						<v-col cols="12" align="center" class="mt-3 pa-0">
							<v-icon class="mt-10 pa-0">mdi-alpha-y-circle-outline</v-icon>
							<code-btn-redondo :code="modeloMaquina != '2A' ? `M120\nG91\nG1 Y-${sizeMove}\nG90\nM121`:`M120\nG91\nG1 Y${sizeMove}\nG90\nM121`" no-wait class="move-btn">
								<v-icon size="70">mdi-arrow-down-bold-circle</v-icon>
							</code-btn-redondo>
							<v-icon class="mx-3"></v-icon>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="2" lg="3" class="mt-6 pa-0" align="left">
					<v-col cols="12" class="">
						<code-btn-redondo :code="`M120\nG91\nG1 Z${sizeMove} F2000\nG90\nM121`" no-wait class="move-btn">
							<v-icon size="70">mdi-arrow-up-bold-circle</v-icon>
						</code-btn-redondo>
					</v-col>
					<v-col cols="12" class="ml-7 pa-0">
						<v-icon>mdi-alpha-z-circle-outline</v-icon>
					</v-col>
					<v-col cols="12" class="">
						<code-btn-redondo :code="`M120\nG91\nG1 Z-${sizeMove} F2000\nG90\nM121`" no-wait class="move-btn">
							<v-icon size="70">mdi-arrow-down-bold-circle</v-icon>
						</code-btn-redondo>
					</v-col>
				</v-col>
				<v-col cols="1" class="hidden-md-and-down"></v-col>
				<v-col cols="6" align="center" justify="center" class="ml-0 pl-0 pr-0">
					<v-btn-toggle v-model="toggleMove" color="teal" background-color="blue lighten-4" rounded>
						<v-btn @click="changeSizeMove(1)" tile class="move-btn" height="50" width="60">
							<span>1 </span>
						</v-btn>
						<v-btn @click="changeSizeMove(5)" tile class="move-btn" height="50" width="60">
							<span>5</span>
						</v-btn>
						<v-btn @click="changeSizeMove(25)" tile class="move-btn" height="50" width="60">
							<span>25</span>
						</v-btn>
						<v-btn @click="changeSizeMove(50)" tile class="move-btn" height="50" width="60">
							<span>50</span>
						</v-btn>
						<v-btn @click="changeSizeMove(100)" tile class="move-btn" height="50" width="60">
							<span>100</span>
						</v-btn>
					</v-btn-toggle>
					<span class="ml-2 pt-5">mm</span> 
				</v-col>
				<v-col cols="2" lg="1" class="ml-0 mt-4 pa-0 ma-0" align="center">
					<v-btn @click="disableSteppers" icon>
						<v-row dense>
							<v-col cols="12">
								<v-icon class="mb-4" x-large> mdi-engine-off </v-icon>
								<br>
								<span >{{ $t('domotek.movePanel.disableSteppers') }}</span>
							</v-col>
							<v-col>
							</v-col>
						</v-row>
					</v-btn>
				</v-col>
				<v-col cols="2" lg="1" class="ml-0 mt-4 pa-0 ma-0" align="center">
					<v-btn @click="dialogExtrude = true" icon>
						<v-row dense>
							<v-col cols="12">
								<v-icon class="mb-4" x-large> mdi-printer-3d-nozzle-alert </v-icon>
								<br>
								<span >{{ $t('domotek.movePanel.extrude') }}</span>
							</v-col>
							<v-col>
							</v-col>
						</v-row>
					</v-btn>
				</v-col>

				<v-col v-if="CLCapable" cols="2" lg="1" class="ml-0 mt-4 pa-0 ma-0" align="center">
						<v-btn @click="DialogClean = true" icon>
							<v-row dense>
								<v-col cols="12">
									<v-icon class="mb-4" x-large>  mdi-brush-variant </v-icon>
									<br>
									<span>{{ $t('domotek.jobs.clean') }}</span>
								</v-col>
								<v-col>
								</v-col>
							</v-row>
						</v-btn>
					</v-col>	


			</v-row>
		</v-card-text>

				<v-dialog v-model="dialogExtrude" class="mb-0 pb-0">
					<v-btn @click="dialogExtrude = false" x-large block class="blue lighten-3">
						<v-icon x-large> mdi-close </v-icon>
					</v-btn>
					<v-col cols="12" align="center" class="mb-3">
						<!-- <tools-panel></tools-panel> -->
						<!-- <calibration-file-list></calibration-file-list> -->
						<extrude-panel></extrude-panel>
					</v-col>
				</v-dialog>
				<v-dialog v-model="DialogClean" fullscreen hide-overlay>
					<v-col cols="12" align="center" class="ma-0 pa-0">
					<clean-panel v-on:close-dialog="closeDialog"></clean-panel>
				</v-col>
		</v-dialog>
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
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import { KinematicsName, StatusType } from '@/store/machine/modelEnums'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', {
			boards: state => state.boards,
			fans: state => state.fans,
			move: state => state.move,
			machineMode: state => state.state.machineMode,
			sensors: state => state.sensors,
			status: state => state.state.status,
			toolsActive: state => state.tools
		}),
		...mapState('machine/settings', ['moveFeedrate']),
		...mapGetters('machine/settings', ['moveSteps', 'numMoveSteps']),
		isCompensationEnabled() { return this.move.compensation.type.toLowerCase() !== 'none' },
		visibleAxes() { return this.move.axes.filter(axis => axis.visible); },
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioTodoHomed() { // domotek: misma condición que el botón Home antiguo
			const a = this.move.axes;
			const n = (this.modeloMaquina === '2A') ? 4 : 7;
			for (let i = 0; i < n; i++) { if (!a[i] || !a[i].homed) { return false; } }
			return true;
		},
		bioToolActivo() {
			try {
				const g = this.$store.state.machine.model.global;
				for (let i = 0; i < 4; i++) { if (g['T' + i + 'Activo']) { return i; } }
			} catch (e) { /* sin globales */ }
			return -1;
		},
		isDelta() {
			return (this.move.kinematics.name === KinematicsName.delta ||
					this.move.kinematics.name === KinematicsName.rotaryDelta);
		},
		canHome() {
			return !this.uiFrozen && (
				this.state.status !== StatusType.pausing &&
				this.state.status !== StatusType.processing &&
				this.state.status !== StatusType.resuming
			);
		},
		unhomedAxes() { return this.move.axes.filter(axis => axis.visible && !axis.homed); },
		//toolsActive[0].state
		
		/*
		toolsActive0state: {
			get() {
					try {
							return this.$store.state.machine.model.tools[0].state	;
					} catch (error) {
							console.log(`error toolsActive0state`);
							return 0;
					}
			}
		},
		//toolsActive[1].state
		toolsActive1state: {
			get() {
					try {
							return this.$store.state.machine.model.tools[1].state	;
					} catch (error) {
							console.log(`error toolsActive1state`);
							return 0;
					}
			}
		},
		//toolsActive[2].state
		toolsActive2state: {
			get() {
					try {
							return this.$store.state.machine.model.tools[2].state	;
					} catch (error) {
							console.log(`error toolsActive2state`);
							return 0;
					}
			}
		},
		//toolsActive[3].state
		 toolsActive3state() {
			try {
					return this.$store.state.machine.model.tools[3].state	;
				} catch (error) {
					console.log(`error toolsActive3state`);
					return 0;
			}
			
		}, */
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
							console.log(`error MovementPanel.vue modeloMaquina`);
							return "2A";
					}
			}
		},
		
		CLCapable: {
			get() {
				return this.$store.state.machine.model.global.CL_Capable},
			// set(value){
			// 	this.sendCode(`set global.UV_Capable = ${value}`);
			// }
		},
	},
	data() {
		return {
			showMeshEditDialog: false,
			dialogExtrude: false,
			DialogClean: false,
			moveStepDialog: {
				shown: false,
				axis: 'X',
				index: 0,
				preset: 0
			},
			letter: 'X',
			sizeMove: 25,
			toggleTool: 0,
			toggleMove: 2,
			countTools: 0
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		...mapMutations('machine/settings', ['setMoveStep']),
		canMove(axis) {
			return (axis.homed || !this.move.noMovesBeforeHoming) && this.canHome;
		},
		getHomeCode(axis) {
			return `G28 ${/[a-z]/.test(axis.letter) ? '\'' : ''}${axis.letter.toUpperCase()}`;
		},
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
		getMoveCode(axis, index, decrementing) {
			return `M120\nG91\nG1 ${/[a-z]/.test(axis.letter) ? '\'' : ''}${axis.letter.toUpperCase()}${decrementing ? '-' : ''}${this.moveSteps(axis.letter)[index]} F${this.moveFeedrate}\nM121`;
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
		bioEtiquetaEje(index, axis) { // domotek: nombres de ejes como en PositionPanel
			const nombres = { '2A': ['X0', 'Y', 'Z', 'X1'], '4A': ['X', 'Y1', 'Z1', 'Y2', 'Y3', 'Y4', 'Z2'], 'HK': ['X1', 'Y1', 'Z', 'X2', 'X3', 'X4', 'Y2'] };
			const lista = nombres[this.modeloMaquina];
			return (lista && lista[index]) ? lista[index] : axis.letter;
		},
		bioPosicion(axis) {
			return (axis.letter === 'Z') ? this.$displayZ(axis.userPosition, false) : this.$display(axis.userPosition, 1);
		},
		changeSizeMove(size){
			this.sizeMove = size;
		},
		closeDialog(){
			console.log('Close Dialog CL');
			this.DialogClean = false;
			this.DialogTmp = false;
         },  
		disableSteppers(){
			this.sendCode(`M18`);
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
		// 			console.log(`Catch error MovementPanel.viewToolActive()`);
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
	// beforeMount(){
	// 	//this.viewToolActive();
	// }
}
</script>

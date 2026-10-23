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

	/* Menos relleno en los pasos del stepper de este panel (evita el scroll vertical en la pantalla de la impresora) */
	.panelStepper .v-stepper__content {
		padding: 8px 12px 8px 12px !important;
	}
</style>

<template>
<div class="es-raiz">
	<!-- domotek: electrospinning con el tema oscuro -->
	<div v-if="temaBio" class="bio-pp">
		<header class="bio-proc-cab">
			<button type="button" class="bio-volver" :aria-label="$t('domotek.tools.back')" @click="closeDialog"><v-icon>mdi-chevron-left</v-icon></button>
			<v-icon color="var(--bio-amarillo)">mdi-flash-outline</v-icon>
			<span class="bio-proc-titulo">{{ $t('domotek.jobs.electrospinning') }}</span>
			<div style="flex: 1"></div>
			<ol class="bio-cal-pasos">
				<li v-for="p in bioPasos" :key="p.id"><button type="button" :class="{ activo: pasos === p.id }" :aria-current="pasos === p.id ? 'step' : null" @click="CambiaStep(p.id)">{{ p.texto }}</button></li>
			</ol>
		</header>

		<!-- Resumen -->
		<main v-show="pasos === 'S'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.esSettings') }}
				<span v-if="hvProbe" class="bio-proc-hv"><v-icon small color="var(--bio-ambar)">mdi-flash</v-icon>{{ $t('panel.jobControl.warninghv') }}</span>
			</h2>
			<div class="bio-proc-datos">
				<div><span>{{ $t('domotek.proc.pattern') }}</span><strong>{{ bioNombrePatron }}<small v-if="patronES == 3 && esPointsCount > 1"> ({{ esPointsCount }})</small></strong></div>
				<div><span>{{ $t('domotek.proc.height') }}</span><strong>{{ alturaES }}<small> mm</small></strong></div>
				<div><span>{{ $t('domotek.proc.flow') }}</span><strong>{{ $display(flowMlMin / 100, 2) }}<small> {{ $t('domotek.varios.mlMin') }}</small></strong></div>
				<div><span>{{ $t('domotek.proc.time') }}</span><strong>{{ $display(exposureTimeSeconds / 60, 2) }}<small> min</small></strong></div>
			</div>
			<div class="bio-proc-lista">
				<div class="fila cab"><span>{{ $t('panel.electrospinning.autoEsMode') }}</span><span class="pildora" :class="{ on: enableES }">{{ enableES ? $t('domotek.proc.on') : $t('domotek.proc.off') }}</span></div>
				<div class="fila" :class="{ tenue: !enableES }"><span>{{ $t('domotek.varios.applyEvery') }} {{ cadenceAmountES }} {{ $t('domotek.varios.layers') }}</span><span>{{ cadenceEnableES ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
				<div class="fila" :class="{ tenue: !enableES }"><span>{{ $t('panel.electrospinning.applyWhen') }}</span><span>{{ aplicarFinES ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
			</div>
			<div class="bio-proc-avisos">
				<span v-if="ChamberMode" :class="{ off: enableDoorDetection }"><v-icon small>{{ enableDoorDetection ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline' }}</v-icon>{{ enableDoorDetection ? $t('domotek.varios.door_interlock_disabled') : $t('domotek.varios.door_interlock_enabled') }}</span>
				<span v-if="enableCL && cadenceEnableCL"><v-icon small>mdi-brush-variant</v-icon>{{ $t('panel.electrospinning.cleanDuringES') }}</span>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')"><span class="bio-cap">{{ $t('domotek.varios.change') }}</span></button>
				<button type="button" class="bio-cal-sec listo" @click="StartSaveSettings()"><span class="bio-cap">{{ $t('domotek.varios.save') }}</span></button>
				<button v-if="isprinting == 'idle' || isprinting == 'paused'" type="button" class="bio-cal-principal ancho" @click="StartElectrospinning()">{{ $t('domotek.proc.run') }}</button>
				<button v-else type="button" class="bio-cal-principal ancho aviso" @click="StartElectrospinningPausing()">{{ $t('domotek.proc.pauseAndRun') }}</button>
			</footer>
		</main>

		<!-- 1 · Patrón -->
		<main v-show="pasos === '1'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.pattern') }}</h2>
			<div class="bio-proc-patrones">
				<button v-for="pt in bioPatrones" :key="pt.id" type="button" class="bio-proc-patron" :class="{ activo: patronES === pt.id }" :aria-pressed="patronES === pt.id" @click="patronES = pt.id, ChangeSelectedPatt(pt.id)">
					<span class="icono" v-html="pt.svg"></span>
					<strong>{{ pt.nombre }}</strong>
					<span>{{ pt.desc }}</span>
				</button>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('S')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" @click="handleContinue">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 1.5 · Puntos -->
		<main v-if="patronES === 3" v-show="pasos === '1.5'" class="bio-proc-cuerpo">
			<div class="bio-proc-canvas-zona">
				<div class="bio-proc-lateral">
					<span class="bio-tenue"><strong class="bio-blanco">{{ customPoints.length }}</strong> {{ $t('domotek.proc.points') }}</span>
					<div class="bio-proc-puntos">
						<div v-for="(pt, i) in customPoints" :key="i" class="bio-proc-punto" :class="{ editando: i === editingPointIndex }">
							<span class="n">{{ i + 1 }}</span>
							<span class="xy">{{ $display(pt.x, 1) }} · {{ $display(pt.y, 1) }}</span>
							<button type="button" :aria-label="$t('domotek.proc.edit')" @click="editPoint(i)"><v-icon small>mdi-pencil-outline</v-icon></button>
							<button type="button" class="borrar" :aria-label="$t('domotek.proc.remove')" @click="removePoint(i)"><v-icon small>mdi-close</v-icon></button>
						</div>
						<span v-if="!customPoints.length" class="bio-tenue">{{ $t('domotek.proc.noPoints') }}</span>
					</div>
				</div>
				<div class="bio-proc-lienzo">
					<canvas ref="gridCanvas" :width="canvasSizePx" :height="canvasSizePx" @click="handleCanvasClick"></canvas>
					<span>{{ $t('domotek.proc.tapToAdd') }} · {{ gridRealSizeMm }} × {{ gridRealSizeMm }} mm</span>
				</div>
				<div class="bio-proc-acciones">
					<button type="button" @click="centerPoint">{{ $t('domotek.varios.center', 'Centro') }}</button>
					<button type="button" @click="openManualCoordsDialog">{{ $t('domotek.varios.manual', 'Manual') }}</button>
					<button type="button" :disabled="!customPoints.length" @click="undoLastPoint">{{ $t('panel.ultraviolet.undoStroke') }}</button>
					<button type="button" class="peligro" :disabled="!customPoints.length" @click="clearPoints">{{ $t('domotek.proc.clearAll') }}</button>
				</div>
			</div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" :disabled="!isPointSelected" @click="CambiaStep('2')">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 1.5 · Drum -->
		<main v-if="patronES === 2" v-show="pasos === '1.5'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('panel.electrospinning.electrospinningDrumParams') }}</h2>
			<div class="bio-proc-valores">
				<button type="button" @click="openDrumRPMDialog"><span class="ic verde"><v-icon>mdi-reload</v-icon></span><span>{{ $t('domotek.proc.drumSpeed') }}</span><strong>{{ drumRPM }}<small> {{ $t('generic.rpm') }}</small></strong></button>
				<button type="button" @click="openXSpeedDialog"><span class="ic azul"><v-icon>mdi-speedometer</v-icon></span><span>{{ $t('panel.electrospinning.platformSpeedX') }}</span><strong>{{ FPlataformaXMms / 60 }}<small> mm/s</small></strong></button>
				<button type="button" @click="openXPointsDialog"><span class="ic lila"><v-icon>mdi-arrow-expand-horizontal</v-icon></span><span>X1 / X2</span><strong>{{ X1PointValue }} / {{ X2PointValue }}<small> mm</small></strong></button>
			</div>
			<p class="bio-tenue bio-proc-nota">{{ $t('domotek.proc.tapToChange') }}</p>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" @click="CambiaStep('2')">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 1.5 · Trazo libre -->
		<main v-if="patronES === 4" v-show="pasos === '1.5'" class="bio-proc-cuerpo">
			<div class="bio-proc-canvas-zona">
				<div class="bio-proc-lateral">
					<span class="bio-tenue"><strong class="bio-blanco">{{ strokes.length }}</strong> {{ $tc('domotek.proc.strokes', strokes.length) }}</span>
					<div class="bio-proc-puntos">
						<template v-for="(st, i) in strokes">
							<button v-if="isClosedStroke(st)" :key="i" type="button" class="bio-proc-relleno" @click="toggleStrokeFill(i)">
								<span class="n">{{ i + 1 }}</span><span>{{ $t('panel.electrospinning.fillArea') }}</span>
								<span class="interruptor" :class="{ on: strokeFill[i] }"><i></i></span>
							</button>
						</template>
					</div>
					<span class="bio-tenue bio-proc-ayuda">{{ $t('panel.electrospinning.electrospinningDrawPathHelp') }}</span>
				</div>
				<div class="bio-proc-lienzo">
					<canvas ref="freehandCanvas" :width="canvasSizePx" :height="canvasSizePx"
						@pointerdown="handleFreehandPointerDown" @pointermove="handleFreehandPointerMove"
						@pointerup="handleFreehandPointerUp" @pointerleave="handleFreehandPointerUp" style="touch-action: none;"></canvas>
					<span>{{ gridRealSizeMm }} × {{ gridRealSizeMm }} mm</span>
				</div>
				<div class="bio-proc-acciones">
					<button type="button" @click="openFreehandBig"><v-icon small>mdi-arrow-expand-all</v-icon>{{ $t('domotek.proc.enlarge') }}</button>
					<button type="button" :disabled="!strokes.length" @click="undoLastFreehandStroke">{{ $t('panel.ultraviolet.undoStroke') }}</button>
					<button type="button" class="peligro" :disabled="!strokes.length" @click="clearFreehandPath">{{ $t('domotek.proc.clearAll') }}</button>
				</div>
			</div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" :disabled="!strokes.length" @click="confirmFreehandPath">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 2 · Parámetros -->
		<main v-show="pasos === '2'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.params') }}</h2>
			<div class="bio-proc-valores">
				<button type="button" @click="openHeightDialog"><span class="ic verde"><v-icon>mdi-arrow-up-down</v-icon></span><span>{{ $t('domotek.proc.height') }}</span><strong>{{ alturaES }}<small> mm</small></strong></button>
				<button type="button" @click="openFlowDialog"><span class="ic azul"><v-icon>mdi-water-outline</v-icon></span><span>{{ $t('domotek.proc.flow') }}</span><strong>{{ $display(flowMlMin / 100, 2) }}<small> {{ $t('domotek.varios.mlMin') }}</small></strong></button>
				<button type="button" @click="openTimeDialog"><span class="ic lila"><v-icon>mdi-timer-outline</v-icon></span><span>{{ $t('domotek.proc.exposure') }}</span><strong>{{ $display(exposureTimeSeconds / 60, 2) }}<small> min</small></strong></button>
			</div>
			<p class="bio-tenue bio-proc-nota">{{ $t('domotek.proc.tapToChange') }}</p>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="handleBack">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" @click="CambiaStep('3')">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 3 · Auto -->
		<main v-show="pasos === '3'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.autoMode') }}</h2>
			<div class="bio-proc-lista">
				<div class="fila cab">
					<span><strong>{{ $t('panel.electrospinning.autoEsMode') }}</strong><small>{{ $t('domotek.proc.appliesDuringPrint') }}</small></span>
					<button type="button" class="interruptor" :class="{ on: enableES }" role="switch" :aria-checked="!!enableES" @click="enableES = !enableES"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableES }">
					<span>{{ $t('domotek.varios.applyEvery') }}</span>
					<div class="bio-proc-contador">
						<button type="button" :disabled="!enableES || cadenceAmountES <= Math.max(1, minCadenceAmountES)" @click="cadenceAmountES = cadenceAmountES - 1">−</button>
						<button type="button" class="valor" :disabled="!enableES" @click="openLayersDialog"><strong>{{ cadenceAmountES }}</strong> {{ $t('domotek.varios.layers') }}</button>
						<button type="button" :disabled="!enableES || cadenceAmountES >= maxCadenceAmountES" @click="cadenceAmountES = cadenceAmountES + 1">+</button>
					</div>
					<button type="button" class="interruptor" :class="{ on: cadenceEnableES }" role="switch" :aria-checked="!!cadenceEnableES" :disabled="!enableES" @click="cadenceEnableES = !cadenceEnableES"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableES }">
					<span>{{ $t('panel.electrospinning.applyWhen') }}</span>
					<button type="button" class="interruptor" :class="{ on: aplicarFinES }" role="switch" :aria-checked="!!aplicarFinES" :disabled="!enableES" @click="aplicarFinES = !aplicarFinES"><i></i></button>
				</div>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('2')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" @click="CambiaStep('S')">{{ $t('domotek.proc.seeSummary') }}</button>
			</footer>
		</main>
	</div>
	<v-row v-else class="mb-0 pb-0"  > 
		<v-col cols="12" align="center" class="py-0">
			<v-stepper v-model="pasos" class="blue lighten-5 panelStepper"  >
				<v-stepper-header class="Stephead">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">	
						<v-img  src="@/assets/ES_logo.svg" contain max-height="45" max-width="45"></v-img>  
					</v-btn>
					<v-stepper-step editable step="S"  color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="1"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<!-- Step 1.5 solo si DRUM COLLECTOR (2), CUSTOM POINT (3) o FREEHAND (4) -->
					<v-stepper-step
						v-if="patronES === 2 || patronES === 3 || patronES === 4"
						editable
						step="1.5"
						color="#0a21ad"
						class="Stephead_step"
					/>
					<v-divider v-if="patronES === 2 || patronES === 3 || patronES === 4"/>
					<v-stepper-step editable step="2"  color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="3"  color="#0a21ad" class="Stephead_step" />
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="S">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card id="vcselectorRes" outlined class="blue lighten-4" :style="{ minHeight: (panelCardPx - 100) + 'px' }">

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
											<v-btn v-show="patronES == 2"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>{{ $t('domotek.varios.drumCollector') }}</strong></v-btn>
											<v-btn v-show="patronES == 3"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>{{ $t('domotek.varios.customPoint') }}</strong><span v-if="esPointsCount > 1">&nbsp;({{ esPointsCount }})</span></v-btn>
											<v-btn v-show="patronES == 4"			class=" ma-1 teal lighten-3 text-none btnInfo" ><strong>{{ $t('domotek.varios.freehand') }}</strong></v-btn>
											<v-btn v-if="flowMlMin > 0" class="ma-1 teal lighten-3 text-none btnInfo">
												<strong>{{ (flowMlMin / 100).toFixed(2) }}</strong> {{ $t('domotek.varios.mlMin') }}
											</v-btn>
											<v-btn v-if="exposureTimeSeconds > 0" class="ma-1 teal lighten-3 text-none btnInfo">
												<strong>{{ (exposureTimeSeconds / 60).toFixed(2) }}</strong> {{ $t('domotek.varios.min') }}
											</v-btn>
											<v-tooltip top v-if="ChamberMode">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-show="ChamberMode" elevation="1" @click="reserve" class="ma-1 teal lighten-3 text-none btnInfo" v-bind="attrs" v-on="on" >
														<v-icon large color="black">
															{{ enableDoorDetection ? 'mdi-door-closed-cancel' : 'mdi-door-closed-lock' }}
														</v-icon>
													</v-btn>
												</template>
												<span>
													{{ enableDoorDetection
														? $t('domotek.varios.door_interlock_disabled')
														: $t('domotek.varios.door_interlock_enabled')
													}}
												</span>
											</v-tooltip>
											<v-tooltip top v-if="enableCL && cadenceEnableCL">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-show="enableCL && cadenceEnableCL" v-bind="attrs" v-on="on" elevation="1" @click="reserve" class="ma-1 teal lighten-3 text-none btnInfo" >
														<v-icon large color="black">mdi-brush-variant</v-icon>
													</v-btn>
												</template>
												<span>{{ $t('panel.electrospinning.cleanDuringES') }}</span>
											</v-tooltip>
										</v-row>
									</v-col>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>{{ $t('domotek.varios.save') }} <v-icon class="mr-1">mdi-floppy</v-icon> </v-btn>
							<v-btn v-if="((isprinting == 'idle') || (isprinting == 'paused'))" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartElectrospinning();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn v-if="((isprinting != 'idle') && (isprinting != 'paused'))" class="btnContinue mt-10 mr-5" color="#fb8c00" @click="StartElectrospinningPausing();" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn class="btnContinue mt-10 " color="primary" @click="CambiaStep('1')"> {{ $t('domotek.varios.change') }} <v-icon dark right> mdi-wrench-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>

				<v-stepper-items>
					<v-stepper-content step="1">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 text-center">{{ $t('panel.electrospinning.electrospinningPattern') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorPatt" class="blue lighten-4" v-model="patronES" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<v-btn v-if="bedSelected !== 'D'"  :value="1" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedPatt(1);" rounded> {{ $t('domotek.varios.allPlatform') }}</v-btn>
												<v-btn v-if="bedSelected == 'D'" :value="2" active-class="teal lighten-3" class=" ma-1 blue lighten-5" @click="ChangeSelectedPatt(2);" rounded>{{ $t('domotek.varios.drumCollector') }}</v-btn>
												<v-btn v-if="bedSelected !== 'D'" :value="3" active-class="teal lighten-3" class=" ma-1 blue lighten-5"  @click="ChangeSelectedPatt(3);" rounded>{{ $t('domotek.varios.customPoint') }}</v-btn>
												<v-btn v-if="bedSelected !== 'D'" :value="4" active-class="teal lighten-3" class=" ma-1 blue lighten-5"  @click="ChangeSelectedPatt(4);" rounded>{{ $t('domotek.varios.freehand') }}</v-btn>
											</v-col>
										</v-row>
									</v-btn-toggle>
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('S')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="handleContinue"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>

					<!-- STEP 1.5 → CUSTOM POINT MULTIPUNTO (solo si patronES === 3) -->
					<v-stepper-content step="1.5" v-if="patronES === 3">
						<v-card class="mb-0 blue lighten-5" :height="panelCardPx">
							<v-card outlined class="blue lighten-4 d-flex flex-column" :height="panelCardPx - 20">
								<p class="mt-2 text-center" style="font-size: 1.15rem; font-weight: bold;">
									{{ $t('panel.electrospinning.electrospinningCustomPoint') }}
								</p>

								<v-card-text class="pa-1 my-auto">
									<div style="position: relative; display: inline-grid; grid-template-columns: 150px auto 150px; align-items: center; gap: 15px; margin-bottom: 5px;">
										<!-- Lista de puntos -->
										<div class="text-center" style="max-height: 200px; overflow-y: auto; font-size: 0.8rem; width: 150px;">
											<p style="margin:0;"><strong>{{ customPoints.length }}</strong> {{ $t('panel.ultraviolet.points', 'puntos') }}</p>
											<div v-for="(p, i) in customPoints" :key="i"
												style="display:flex; align-items:center; justify-content:space-between; padding: 3px 2px; border-radius: 4px;"
												:style="{ background: i === editingPointIndex ? '#80cbc4' : 'transparent' }">
												<span>{{ i + 1 }}: {{ p.x.toFixed(1) }}, {{ p.y.toFixed(1) }}</span>
												<span style="white-space: nowrap;">
													<v-icon color="primary" style="cursor:pointer;" @click="editPoint(i)">mdi-pencil</v-icon>
													<v-icon color="error" class="ml-3" style="cursor:pointer;" @click="removePoint(i)">mdi-close</v-icon>
												</span>
											</div>
										</div>
										<!-- Canvas -->
										<div style="display: flex; flex-direction: column; align-items: center;">
											<div style="display: flex; align-items: flex-end; gap: 5px;">
												<span style="writing-mode: vertical-rl; transform: rotate(180deg); font-weight: bold; font-size: 0.9em; letter-spacing: 1px; margin-bottom: 100px;">{{ $t('domotek.varios.ejeY') }}</span>
												<div style="display: flex; flex-direction: column; align-items: center;">
													<canvas ref="gridCanvas" :width="canvasSizePx" :height="canvasSizePx" @click="handleCanvasClick" style="border: 1px solid #999; cursor: crosshair; background-color: white;"></canvas>
													<div style="width: 100%; margin-top: 5px; display: flex; justify-content: center; position: relative;">
														<span style="position: absolute; left: 0; bottom: 0; font-weight: bold; font-size: 0.8em; color: #333;">(0,0)</span>
														<span style="font-weight: bold; font-size: 0.9em; letter-spacing: 1px;">{{ $t('domotek.varios.ejeX') }}</span>
													</div>
												</div>
											</div>
										</div>
										<!-- Botones a la derecha del canvas -->
										<div style="display: flex; flex-direction: column; gap: 40px; margin-left: 5px;">
											<v-btn class="btnAction" small color="primary" @click="centerPoint" :title="$t('domotek.varios.centerTitle', 'Añadir punto en (71,71)')">
												{{ $t('domotek.varios.center', 'Centro') }}
											</v-btn>
											<v-btn class="btnAction" small color="primary" @click="openManualCoordsDialog" :title="$t('domotek.varios.manual', 'Manual')">
												{{ $t('domotek.varios.manual', 'Manual') }}
											</v-btn>
											<v-btn class="btnAction" small color="primary" @click="undoLastPoint" :disabled="customPoints.length === 0">
												{{ $t('panel.ultraviolet.undoStroke') }}
											</v-btn>
											<v-btn class="btnAction" small color="error" @click="clearPoints" :disabled="customPoints.length === 0">
												{{ $t('list.eventLog.clear', 'Borrar') }}
											</v-btn>
										</div>
									</div>									
								</v-card-text>
							
								<!-- Contenedor de botones de navegación -->
								<div class="text-center pb-2 pt-1 mt-auto">
									<v-btn class="btnContinue mr-4"  color="primary" @click="CambiaStep('1')">
										<v-icon dark left > mdi-arrow-left-bold-outline </v-icon>
										{{ $t('domotek.toolNames.BACK') }}
									</v-btn>
									<v-btn class="btnContinue"  color="primary" @click="CambiaStep('2')" :disabled="!isPointSelected">
										{{ $t('domotek.toolNames.CONTINUE') }}
										<v-icon dark right > mdi-arrow-right-bold-outline </v-icon>
									</v-btn>
								</div>
							</v-card>
						</v-card>
						
						<!-- DIÁLOGO PARA ENTRADA MANUAL DE COORDENADAS -->
					</v-stepper-content>

					<!-- Si el patron seleccionado es drum collector mostrar este step -->
					<v-stepper-content step="1.5" v-if="patronES === 2">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2  text-center">{{ $t('panel.electrospinning.electrospinningDrumParams') }}</p>
								<v-row justify="center" style="height:60px;">
									<v-col cols="12" md="8" align="center">
										<v-btn x-large outlined color="#1976d2" @click="openDrumRPMDialog" >								
											<v-icon left>mdi-reload</v-icon>											
											<span class="title font-weight-bold mr-2">{{ drumRPM }}</span>										
											<span class="subtitle-1">{{ $t('generic.rpm') }}</span>
										</v-btn>
									</v-col>
								</v-row>
								<v-row justify="center" style="height:60px;">
									<v-col cols="12" md="8" align="center">
										<v-btn x-large outlined color="#1976d2" @click="openXSpeedDialog" >
											<v-icon left>mdi-speedometer</v-icon>
											<span class="title font-weight-bold mr-2">{{ (FPlataformaXMms/60)}}</span>
											<span class="subtitle-1">{{ $t('panel.settingsAppearance.unitMmSpeed') }}</span>
										</v-btn>
									</v-col>
								</v-row>
								<v-row justify="center" style="height:60px;">
									<v-col cols="12" md="8" align="center">
										<v-btn x-large outlined color="#1976d2" @click="openXPointsDialog">
											<v-icon left>mdi-map-marker</v-icon>
											<span class="title font-weight-bold mr-2">{{ X1PointValue }} / {{ X2PointValue }}</span>
											<span class="subtitle-1">X1 / X2</span>
										</v-btn>
									</v-col>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('1')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('2')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>

					<!-- STEP 1.5 → Trazo libre FREEHAND (solo si patronES === 4) -->
					<v-stepper-content step="1.5" v-if="patronES === 4">
						<v-card class="mb-0 blue lighten-5" :height="panelCardPx">
							<v-card outlined class="blue lighten-4 d-flex flex-column" :height="panelCardPx - 20">

								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-2 text-center"> {{ $t('panel.electrospinning.electrospinningDrawPath') }} </p>
								<p class="text-center mb-2" style="font-size: 0.85rem;"> {{ $t('panel.electrospinning.electrospinningDrawPathHelp') }} </p>

								<v-card-text class="pa-1 my-auto">
									<div style="position: relative; display: inline-grid; grid-template-columns: 150px auto 150px; align-items: center; gap: 15px; margin-bottom: 5px;">
										<div class="text-center" style="max-height: 200px; overflow-y: auto; font-size: 0.8rem; width: 150px;">
											<p style="margin:0;"><strong>{{ strokes.length }}</strong> {{ $t('panel.ultraviolet.strokes') }}</p>
											<!-- Solo se muestra una fila por cada figura CERRADA (las unicas que se pueden rellenar) -->
											<template v-for="(st, i) in strokes">
												<!-- Toda la fila es pulsable; numero, casilla y texto juntos -->
												<div v-if="isClosedStroke(st)" :key="i" @click="toggleStrokeFill(i)" style="display:flex; align-items:center; justify-content:flex-start; gap: 4px; padding: 4px 2px; cursor:pointer;">
													<span style="font-weight:bold; min-width: 18px; text-align:right;">{{ i + 1 }}</span>
													<v-icon size="20" :color="strokeFill[i] ? 'teal darken-2' : 'grey darken-1'">{{ strokeFill[i] ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
													<span style="white-space:nowrap;">{{ $t('panel.electrospinning.fillArea') }}</span>
												</div>
											</template>
										</div>
										<div style="display: flex; flex-direction: column; align-items: center;">
											<div style="display: flex; align-items: flex-end; gap: 5px;">
												<span style="writing-mode: vertical-rl; transform: rotate(180deg); font-weight: bold; font-size: 0.9em; letter-spacing: 1px; margin-bottom: 100px;">{{ $t('domotek.varios.ejeY') }}</span>
												<div style="display: flex; flex-direction: column; align-items: center;">
													<canvas
														ref="freehandCanvas"
														:width="canvasSizePx"
														:height="canvasSizePx"
														@pointerdown="handleFreehandPointerDown"
														@pointermove="handleFreehandPointerMove"
														@pointerup="handleFreehandPointerUp"
														@pointerleave="handleFreehandPointerUp"
														style="border: 1px solid #999; cursor: crosshair; background-color: white; touch-action: none;"
													></canvas>
													<div style="width: 100%; margin-top: 5px; display: flex; justify-content: center; position: relative;">
														<span style="position: absolute; left: 0; bottom: 0; font-weight: bold; font-size: 0.8em; color: #333;">(0,0)</span>
														<span style="font-weight: bold; font-size: 0.9em; letter-spacing: 1px;">{{ $t('domotek.varios.ejeX') }}</span>
													</div>
												</div>
											</div>
										</div>
										<div style="display: flex; flex-direction: column; gap: 40px;">
											<v-btn class="btnAction" small color="primary" @click="openFreehandBig">
												<v-icon>mdi-arrow-expand-all</v-icon>
											</v-btn>
											<v-btn class="btnAction" small color="primary" @click="undoLastFreehandStroke" :disabled="strokes.length === 0">
												{{ $t('panel.ultraviolet.undoStroke') }}
											</v-btn>
											<v-btn class="btnAction" small color="error" @click="clearFreehandPath" :disabled="strokes.length === 0">
												{{ $t('list.eventLog.clear', 'Borrar') }}
											</v-btn>
										</div>
									</div>
								</v-card-text>

								<div class="text-center pb-2 pt-1 mt-auto">
									<v-btn class="btnContinue mr-4" color="primary" @click="CambiaStep('1')">
										<v-icon dark left> mdi-arrow-left-bold-outline </v-icon>
										{{ $t('domotek.toolNames.BACK') }}
									</v-btn>
									<v-btn class="btnContinue" color="primary" @click="confirmFreehandPath" :disabled="strokes.length === 0">
										{{ $t('domotek.toolNames.CONTINUE') }}
										<v-icon dark right> mdi-arrow-right-bold-outline </v-icon>
									</v-btn>
								</div>
							</v-card>
						</v-card>
						<!-- CANVAS GRANDE: se abre por encima de todo para dibujar con mas precision -->
					</v-stepper-content>
				</v-stepper-items>
				<!-- STEP 2 → Altura / Flujo / Tiempo (todo en una pantalla, como en UV) -->
				<v-stepper-items>
					<v-stepper-content step="2">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">{{ $t('panel.electrospinning.electrospinningParams') }}</p>
								<!-- Rejilla de una columna: la columna toma el ancho del boton mas largo y los tres se estiran a ese ancho -->
								<div style="display: inline-grid; grid-template-columns: auto; row-gap: 16px;">
									<v-btn x-large outlined block color="#1976d2" @click="openHeightDialog" >
										<v-icon left>mdi-ruler</v-icon>
										<span class="subtitle-1">
											{{ $t('panel.jobInfo.height') }}<span class="font-weight-bold">{{ alturaES }}</span> {{ $t('panel.settingsAppearance.unitMm') }}
										</span>
									</v-btn>
									<v-btn x-large outlined block color="#1976d2" @click="openFlowDialog" >
										<v-icon left>mdi-water</v-icon>
										<span class="subtitle-1">
											{{ flowLabel }}<span class="font-weight-bold">{{ (flowMlMin / 100).toFixed(2) }}</span> {{ $t('domotek.varios.mlMin') }}
										</span>
									</v-btn>
									<v-btn x-large outlined block color="#1976d2" @click="openTimeDialog" >
										<v-icon left>mdi-timer-outline</v-icon>
										<span class="subtitle-1">
											{{ $t('panel.ultraviolet.time') }}<span class="font-weight-bold">{{ (exposureTimeSeconds / 60).toFixed(2) }}</span> {{ $t('domotek.varios.min') }}
										</span>
									</v-btn>
								</div>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="handleBack"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="CambiaStep('3')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>

				<!-- STEP 3 → Modo automatico / cadencia -->
				<v-stepper-items>
					<v-stepper-content step="3">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">{{ $t('panel.electrospinning.electrospinningParams') }}</p>
								<v-row style="height:40px;margin-left:40px;">  
									<v-checkbox v-model="enableES" :label="$t('panel.electrospinning.autoEsMode')"  class="etiqueta align-center justify-center"></v-checkbox>		
								</v-row>
								<v-row style="height:62px;margin-left:128px;">  
										<v-col cols=5 >
											<v-checkbox :disabled="!enableES" v-model="cadenceEnableES" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountES + ' ' + $t('domotek.varios.layers')"  class="etiqueta align-center justify-center"></v-checkbox>
										</v-col>
										<v-col cols=6 v-show="enableES">
											<v-btn x-large outlined color="#1976d2" @click="openLayersDialog" >
												<v-icon left>mdi-layers</v-icon>
												<span class="subtitle-1">
													<span class="font-weight-bold">{{ cadenceAmountES}}</span> {{ $t('domotek.varios.layers') }}
												</span>
											</v-btn>
										</v-col>
								</v-row>
								<v-row style="height:40px;margin-left:140px;">  
									<v-checkbox :disabled="!enableES" v-model="aplicarFinES" :label="$t('panel.electrospinning.applyWhen')"  class="etiqueta align-center justify-center"></v-checkbox>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('2')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10"  color="primary" @click="CambiaStep('S')">  {{ $t('domotek.varios.settings') }} <v-icon dark right> mdi-cog </v-icon></v-btn> 
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>	
			<!-- Dialogos y aviso dentro de la misma columna: asi no crean filas vacias que alargan el panel -->
		</v-col>
	</v-row>
	<!-- diálogos compartidos por las dos vistas -->
						<v-dialog v-model="dialogManualCoords" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualCoords" :titulo="$t('panel.ultraviolet.manualEditCoordsTittle')" icono="mdi-crosshairs-gps" color="acento" unidad="mm" :campos="[{ id: 'x', etiqueta: 'X', valor: manualX, error: manualXError }, { id: 'y', etiqueta: 'Y', valor: manualY, error: manualYError }]" :activo="activeManualInput" :rango="$t('domotek.keypad.coordRange', [minCoord, maxCoord])" :atajos="[{ valor: 'centro', texto: $t('domotek.varios.center', 'Centro') }]" @activar="id => activeManualInput = id" @tecla="handleKeyPress" @atajo="() => { manualX = String(Math.round(maxCoord / 2)); manualY = String(Math.round(maxCoord / 2)); manualXError = ''; manualYError = ''; }" @aceptar="confirmManualInput" @cancelar="cancelManualInput"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('panel.ultraviolet.manualEditCoordsTittle') }}</span>
								</v-card-title>
									<v-card-text class="pb-0">
										<v-container>
											<v-row class="mb-1">
												<v-col cols="12" sm="6" class="py-1">
													<label class="mb-1 d-block font-weight-medium">{{ $t('panel.ultraviolet.CoordsX') }}</label>
													<v-text-field v-model="manualX" @keydown="handleKeydownManualInput" outlined dense @focus="activeManualInput = 'x'" :rules="[rules.coordRange, rules.required]" :error-messages="manualXError" hide-details="auto" label="" 
													></v-text-field>
												</v-col>
												<v-col cols="12" sm="6" class="py-1">
													<label class="mb-1 d-block font-weight-medium">{{ $t('panel.ultraviolet.CoordsY') }}</label>
													<v-text-field v-model="manualY"  @keydown="handleKeydownManualInput" outlined dense @focus="activeManualInput = 'y'" :rules="[rules.coordRange, rules.required]" :error-messages="manualYError" hide-details="auto" label=""
													></v-text-field>
												</v-col>
											</v-row>

										<!-- Teclado Numérico Personalizado -->
										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1" >
													<v-btn v-if="key.value !== 'EMPTY'" block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'"  @click="handleKeyPress(key.value)">
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</v-col>
											</v-row>
										</div>	
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualInput">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualInput" :disabled="!!manualXError || !!manualYError">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualDrumRPM" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualDrumRPM" :titulo="$t('domotek.proc.drumSpeed')" icono="mdi-reload" color="acento" :valor="manualDrumRPMInput" :unidad="$t('generic.rpm')" :error="manualDrumRPMError" :actual="drumRPM" permitido="0 – 4000" :rango="$t('domotek.keypad.rangeGeneric', [0, 4000, $t('generic.rpm')])" :decimales="false" :atajos="[500, 1000, 2000, 3000].map(v => ({ valor: v }))" @tecla="handleDrumRPMKeyPress" @atajo="v => { manualDrumRPMInput = String(v); validateDrumRPM(); }" @aceptar="confirmManualDrumRPM" @cancelar="cancelManualDrumRPM"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('generic.rpm') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualDrumRPMInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.drumRPMRange]" :error-messages="manualDrumRPMError"></v-text-field>
											</v-col>
										</v-row>

										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleDrumRPMKeyPress(key.value)">
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualDrumRPM">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualDrumRPM" :disabled="!!manualDrumRPMError || !manualDrumRPMInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualXSpeed" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualXSpeed" :titulo="$t('panel.electrospinning.platformSpeedX')" icono="mdi-speedometer" color="azul" :valor="manualXSpeedInput" unidad="mm/s" :error="manualXSpeedError" :actual="FPlataformaXMms / 60" permitido="10 – 100 mm/s" :rango="$t('domotek.keypad.rangeGeneric', [10, 100, 'mm/s'])" @tecla="handleXSpeedKeyPress" @aceptar="confirmManualXSpeed" @cancelar="cancelManualXSpeed"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('panel.electrospinning.platformSpeedX') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualXSpeedInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.xSpeedRange]" :error-messages="manualXSpeedError"></v-text-field>
											</v-col>
										</v-row>

										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleXSpeedKeyPress(key.value)">
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualXSpeed">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualXSpeed" :disabled="!!manualXSpeedError || !manualXSpeedInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualXPoints" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualXPoints" :titulo="$t('panel.electrospinning.editXPoints')" icono="mdi-arrow-expand-horizontal" color="lila" unidad="mm" :campos="[{ id: 'x1', etiqueta: 'X1', valor: manualX1PointInput, error: manualX1PointError }, { id: 'x2', etiqueta: 'X2', valor: manualX2PointInput, error: manualX2PointError }]" :activo="activeManualXPointsInput" :rango="$t('domotek.keypad.rangeGeneric', [0, 140, 'mm'])" @activar="id => activeManualXPointsInput = id" @tecla="handleXPointsKeyPress" @aceptar="confirmManualXPoints" @cancelar="cancelManualXPoints"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
								<span class="headline">{{ $t('panel.electrospinning.editXPoints') }}</span>
								</v-card-title>
								<v-card-text class="pb-0">
								<v-container>
									<v-row class="mb-1">
										<v-col cols="12" sm="6" class="py-1">
											<label class="mb-1 d-block font-weight-medium">X1</label>
											<v-text-field  v-model="manualX1PointInput" @keydown="handleKeydownManualInput"  outlined dense  @focus="activeManualXPointsInput = 'x1'"  :rules="[rules.required, rules.positiveNumber, rules.xPointRange]"  :error-messages="manualX1PointError" hide-details="auto" label="" ></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" class="py-1">
											<label class="mb-1 d-block font-weight-medium">X2</label>
											<v-text-field v-model="manualX2PointInput" @keydown="handleKeydownManualInput" outlined dense @focus="activeManualXPointsInput = 'x2'" :rules="[rules.required, rules.positiveNumber, rules.xPointRange]" :error-messages="manualX2PointError" hide-details="auto" label=""></v-text-field>
										</v-col>
									</v-row>

									<div class="numeric-keypad text-center">
									<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
										<v-col v-for="key in row" :key="key.value" class="pa-1">
										<v-btn v-if="key.value !== 'EMPTY'" block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'"  @click="handleXPointsKeyPress(key.value)">
											<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
											<span v-else class="headline">{{ key.text }}</span>
										</v-btn>
										</v-col>
									</v-row>
									</div>
								</v-container>
								</v-card-text>
								<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="cancelManualXPoints">{{ $t('generic.cancel') }}</v-btn>
								<v-btn color="blue darken-1" text @click="confirmManualXPoints" :disabled="!!manualX1PointError || !!manualX2PointError">
									{{ $t('generic.ok') }}
								</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogFreehandBig" :max-width="freehandBigPx + 200">
							<v-card class="pa-3">
								<div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
									<div style="display: flex; align-items: flex-end; gap: 5px;">
										<span style="writing-mode: vertical-rl; transform: rotate(180deg); font-weight: bold; font-size: 0.9em; letter-spacing: 1px; align-self: center;">{{ $t('domotek.varios.ejeY') }}</span>
										<div style="display: flex; flex-direction: column; align-items: center;">
											<canvas
												ref="freehandCanvasBig"
												:width="freehandBigPx"
												:height="freehandBigPx"
												@pointerdown="handleFreehandPointerDown"
												@pointermove="handleFreehandPointerMove"
												@pointerup="handleFreehandPointerUp"
												@pointerleave="handleFreehandPointerUp"
												style="border: 1px solid #999; cursor: crosshair; background-color: white; touch-action: none;"
											></canvas>
											<div style="width: 100%; margin-top: 5px; display: flex; justify-content: center; position: relative;">
												<span style="position: absolute; left: 0; bottom: 0; font-weight: bold; font-size: 0.8em; color: #333;">(0,0)</span>
												<span style="font-weight: bold; font-size: 0.9em; letter-spacing: 1px;">{{ $t('domotek.varios.ejeX') }}</span>
											</div>
										</div>
									</div>
									<div style="display: flex; flex-direction: column; gap: 80px;">
										<v-btn class="btnAction" small color="primary" @click="undoLastFreehandStroke" :disabled="strokes.length === 0">
											{{ $t('panel.ultraviolet.undoStroke') }}
										</v-btn>
										<v-btn class="btnAction" small color="error" @click="clearFreehandPath" :disabled="strokes.length === 0">
											{{ $t('list.eventLog.clear', 'Borrar') }}
										</v-btn>
										<v-btn class="btnAction" small color="primary" @click="closeFreehandBig">
											<v-icon>mdi-arrow-collapse-all</v-icon>
										</v-btn>
									</div>
								</div>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualHeight" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualHeight" :titulo="$t('domotek.proc.height')" icono="mdi-arrow-up-down" color="acento" :valor="manualHeightInput" unidad="mm" :error="manualHeightError" :actual="alturaES" :permitido="`${minAlturaES} – ${maxAlturaES} mm`" :rango="$t('domotek.keypad.rangeGeneric', [minAlturaES, maxAlturaES, 'mm'])" :decimales="false" :atajos="[20, 50, 80, 100].filter(v => v >= minAlturaES && v <= maxAlturaES).map(v => ({ valor: v }))" @tecla="handleHeightKeyPress" @atajo="v => { manualHeightInput = String(v); validateHeight(); }" @aceptar="confirmManualHeight" @cancelar="cancelManualHeight"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('domotek.varios.exposureheightMm') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualHeightInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.HeightRange]" :error-messages="manualHeightError"></v-text-field>
											</v-col>
										</v-row>

										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleHeightKeyPress(key.value)">
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualHeight">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualHeight" :disabled="!!manualHeightError || !manualHeightInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualFlow" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualFlow" :titulo="$t('domotek.proc.flow')" icono="mdi-water-outline" color="azul" :valor="manualFlowInput" :unidad="$t('domotek.varios.mlMin')" :error="manualFlowError" :actual="$display(flowMlMin / 100, 2)" :permitido="`${minFlow} – ${maxFlow}`" :rango="$t('domotek.keypad.rangeGeneric', [minFlow, maxFlow, $t('domotek.varios.mlMin')])" :atajos="[0.1, 0.25, 0.5, 1].filter(v => v >= minFlow && v <= maxFlow).map(v => ({ valor: v, texto: $display(v, 2) }))" @tecla="handleFlowKeyPress" @atajo="v => { manualFlowInput = String(v); validateFlow(); }" @aceptar="confirmManualFlow" @cancelar="cancelManualFlow"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('panel.electrospinning.flowInMlMin') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualFlowInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.flowRange]" :error-messages="manualFlowError"></v-text-field>
											</v-col>
										</v-row>

										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleFlowKeyPress(key.value)">
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualFlow">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualFlow" :disabled="!!manualFlowError || !manualFlowInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualTime" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualTime" :titulo="$t('domotek.proc.exposure')" icono="mdi-timer-outline" color="lila" :valor="manualTimeInput" unidad="min" :error="manualTimeError" :actual="$display(exposureTimeSeconds / 60, 2)" permitido="0,1 – 120 min" :rango="$t('domotek.keypad.rangeGeneric', ['0,1', 120, 'min'])" :atajos="[0.5, 1, 2, 5].map(v => ({ valor: v, texto: $display(v, v % 1 ? 1 : 0) }))" @tecla="handleTimeKeyPress" @atajo="v => { manualTimeInput = String(v); validateTime(); }" @aceptar="confirmManualTime" @cancelar="cancelManualTime"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('panel.electrospinning.timeInMinutes') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualTimeInput" @keydown="handleKeydownManualInput" outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.timeRange]" :error-messages="manualTimeError"></v-text-field>
											</v-col>
										</v-row>

										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleTimeKeyPress(key.value)">	
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualTime">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualTime" :disabled="!!manualTimeError || !manualTimeInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualLayers" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualLayers" :titulo="$t('domotek.varios.Layers')" icono="mdi-layers-outline" color="acento" :valor="manualLayersInput" :error="manualLayersError" :actual="cadenceAmountES" :permitido="`${Math.max(1, minCadenceAmountES)} – ${maxCadenceAmountES}`" :rango="$t('domotek.keypad.rangeGeneric', [Math.max(1, minCadenceAmountES), maxCadenceAmountES, $t('domotek.varios.layers')])" :decimales="false" :atajos="[1, 2, 3, 5].map(v => ({ valor: v }))" @tecla="handleLayersKeyPress" @atajo="v => { manualLayersInput = String(v); validateLayers(); }" @aceptar="confirmManualLayers" @cancelar="cancelManualLayers"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{  $t('domotek.varios.Layers') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualLayersInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.LayersRange]" :error-messages="manualLayersError"></v-text-field>
											</v-col>
										</v-row>

										<div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handleLayersKeyPress(key.value)">
														<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
														<span v-else class="headline">{{ key.text }}</span>
													</v-btn>
												</template>
												<template v-else>
													<div style="visibility: hidden; height: 48px;"></div>
												</template>
												</v-col>
											</v-row>
										</div>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="cancelManualLayers">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualLayers" :disabled="!!manualLayersError || !manualLayersInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
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
			<v-snackbar content-class="snack" v-model="snackbar" :timeout="400" absolute left top :min-width="50"   color="light-blue white--text" >
					{{this.snackbarValor}}
			</v-snackbar>
</div>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

import { paletaBio } from '../../utils/temaBio.js'

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
			// --- Altura del panel: se ajusta a la pantalla ---
			windowHeight: window.innerHeight,
			panelOffsetPx: 80,		// alto que ocupan cabecera del stepper + margenes (subir si vuelve a salir scroll)
			panelMinPx: 350,		// altura minima de las tarjetas
			panelMaxPx: 400,		// altura maxima (para que en el PC no queden tarjetas enormes)
			canvasSizePx: 200,      // Tamaño visual del canvas en píxeles
			gridRealSizeMm: 142,    
			cellSizeMm: 10,         
			ctx: null,  
			// --- CUSTOM POINT MULTIPUNTO ---
			editingPointIndex: -1,			// -1 = añadiendo punto nuevo; >=0 = editando ese punto
			customPoints: [],				// lista de puntos [{x, y}] en mm (origen abajo-izquierda)
			lastSavedPointsSignature: '[]',	// para no reescribir el fichero si la lista no ha cambiado
			lastOwnPointsRev: null,			// ultima revision escrita por ESTE cliente (para ignorar su propio eco)
			savePointsTimer: null,
			// --- FREEHAND (trazo libre) ---
			strokes: [],			// array de sub-trazos; cada uno es un array de {x, y} en mm
			currentStroke: [],		// puntos del sub-trazo que se esta dibujando ahora mismo (en mm)
			isDrawingFreehand: false,
			minSegmentDistanceMm: 2,	// simplificacion: descarta puntos a menos de esta distancia del anterior
			freehandCtx: null,
			lastSavedFreehandSignature: '{"s":[],"f":[]}',
			strokeFill: [],			// paralelo a strokes: true = rellenar el area de esa figura (solo si esta cerrada)
			fillSpacingMm: 10,		// separacion entre lineas del relleno [mm] (AJUSTAR al ancho real de deposicion)
			closeToleranceMm: 6,		// tolerancia MINIMA de cierre [mm]
			closeToleranceRel: 0.15,	// la tolerancia crece con la figura: 15% de su diagonal...
			closeToleranceMaxMm: 15,	// ...hasta un maximo de 15 mm
			lastOwnPathRev: null,	// ultima revision del trazo escrita por ESTE cliente
			saveFreehandTimer: null,
			dialogFreehandBig: false,	// canvas grande abierto
			freehandBigPx: 500,			// tamaño del canvas grande (se recalcula al abrir segun la pantalla)
			dialogManualCoords: false,
			manualX: '', // Usar string para facilitar la concatenación del teclado
			manualY: '',
			manualXError: '',
			manualYError: '',
			activeManualInput: 'x', // 'x' o 'y'
			minCoord: 0,
			maxCoord: 142,
			minFlow: 0.01, 
			maxFlow: 1, 
			maxCadenceAmountES:10,
			minCadenceAmountES:0,
			drumRPM: '',
			dialogManualDrumRPM: false,
			manualDrumRPMInput: '',
			manualDrumRPMError: '',
			dialogManualXPoints: false, // diálogo único
			activeManualXPointsInput : 'x1', // 'x1' o 'x2'
			X1Point: '',
			manualX1PointInput: '',
			manualX1PointError: '',
			X2Point: '',
			manualX2PointInput: '',
			manualX2PointError: '',
			dialogManualXSpeed: false,
			manualXSpeedInput: '', 
			manualXSpeedError: '',
			dialogManualTime: false,
			dialogTimePicker: false,
			manualTimeInput: '',
			manualTimeError: '',
			dialogManualFlow: false,
			manualFlowInput: '',
			manualFlowError: '',
			dialogManualHeight: false,
			manualHeightInput: '',
			manualHeightError: '',
			dialogManualLayers: false,
			manualLayersInput: '',
			manualLayersError: '',
			keypadLayout: [ // Definición del layout del teclado
				[{text: '7', value: '7'}, {text: '8', value: '8'}, {text: '9', value: '9'}],
				[{text: '4', value: '4'}, {text: '5', value: '5'}, {text: '6', value: '6'}],
				[{text: '1', value: '1'}, {text: '2', value: '2'}, {text: '3', value: '3'}],
				[{text: '.', value: '.'}, {text: '0', value: '0'}, {icon: 'mdi-backspace-outline', value: 'DEL', color: 'blue lighten-4'}],
				[{text: '', value: 'EMPTY'}, {text: 'C', value: 'CLEAR', color: 'blue lighten-4'}, {text: '', value: 'EMPTY'}]
			],
			rules: { // Reglas para los text fields (aunque la validación principal es en handleKeyPress)
				coordRange: value => {
					if (value === '' || value === null) return true;

					const num = parseFloat(value);
					if (isNaN(num) || num < this.minCoord || num > this.maxCoord) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
							min: this.minCoord,
							max: this.maxCoord,
							val: value
						});
					}

					return true;
				},
				flowRange: value => {
					if (value === '' || value === null) return true; // Permitir vacío mientras escribe
					
					const num = parseFloat(value);
					
					if (isNaN(num) || num < this.minFlow || num > this.maxFlow) {
						return this.$t('panel.electrospinning.flowRangeErrorDetailed', {
						min: this.minFlow,
						max: this.maxFlow,
						val: value
						});
					}
					
					return true;
				},
				timeRange: value => {
					if (value === '' || value === null) return true; // Permitir vacío mientras escribe

					const num = parseFloat(value);

					const min = 0.1;
					const max = 120;

					if (isNaN(num) || num < min || num > max) {
						return this.$t('panel.electrospinning.timeRangeErrorDetailed', {
							min,
							max,
							val: value
						});
					}

					return true;
				},

				drumRPMRange: value => {
					if (value === '' || value === null) return true; // Permitir vacío mientras escribe

					const num = parseFloat(value);

					const min = 0;
					const max = 4000;

					if (isNaN(num) || num < min || num > max) {
						return this.$t('panel.electrospinning.drumRPMRangeErrorDetailed', {
							min,
							max,
							val: value
						});
					}

					return true;
				},
				xPointRange: value => {
					if (value === '' || value === null) return true; // Permitir vacío mientras escribe

					const num = parseFloat(value);

					const min = 0;
					const max = 140;

					if (isNaN(num) || num < min || num > max) {
						return this.$t('panel.electrospinning.drumRPMRangeErrorDetailed', {
							min,
							max,
							val: value
						});
					}

					return true;
				},
				
				xSpeedRange: value => {
					if (value === '' || value === null) return true; // Permitir vacío mientras escribe

					const num = parseFloat(value);

					const min = 10;
					const max = 100;

					if (isNaN(num) || num < min || num > max) {
						return this.$t('panel.electrospinning.drumRPMRangeErrorDetailed', {
							min,
							max,
							val: value
						});
					}

					return true;
				},

				required: value=>value !== null && value !== undefined && value !== ''|| this.$t('domotek.varios.valorRequerido'),

				positiveNumber: value => {
					const num = Number(value);
					return !isNaN(num) && num >= 0 || this.$t('domotek.varios.numeroPositivo');
				},
				HeightRange: value => {
					if (value === '' || value === null) return true;

					const max = this.bedSelected === 'D' ? 80 : 120;

					const num = parseFloat(value);
					if (isNaN(num) || num < this.minAlturaES || num > max) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
							min: this.minAlturaES,
							max: max,
							val: value
						});
					}

					return true;
				},
				LayersRange: value => {
					if (value === '' || value === null) return true;

					const num = Number(value);

					// No es número o no es entero
					if (!Number.isInteger(num)) {
						return this.$t('domotek.varios.numeroEntero');
					}

					// Fuera de rango
					if (num < this.minCadenceAmountES || num > this.maxCadenceAmountES) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
						min: this.minCadenceAmountES,
						max: this.maxCadenceAmountES,
						val: value
						});
					}

					return true;
				},
			}            
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
		
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioColores() { // colores de los lienzos según el tema (oscuro o claro)
			const c = paletaBio();
			return this.temaBio
				? { rejilla: c.linea, borde: c.linea2, punto: c.acento, puntoEdit: c.amarillo, puntoBorde: c.acentoBg, texto: c.texto, trazo: c.acento, relleno: `rgba(${c.acentoRgb},0.18)`, rayado: `rgba(${c.acentoRgb},0.45)`, cierra: c.verde, cierraFondo: `rgba(${c.verdeRgb},0.22)`, zona: c.zona, abierto: c.peligro }
				: { rejilla: '#ddd', borde: '#999', punto: 'red', puntoEdit: '#1976d2', puntoBorde: 'darkred', texto: '#000', trazo: '#1976d2', relleno: 'rgba(25,118,210,0.22)', rayado: 'rgba(25,118,210,0.55)', cierra: '#2e7d32', cierraFondo: 'rgba(46,125,50,0.25)', zona: 'rgba(0,0,0,0.06)', abierto: 'red' };
		},
		bioPasos() {
			const lista = [{ id: 'S', texto: this.$t('domotek.proc.summary') }, { id: '1', texto: `1 · ${this.$t('domotek.proc.pattern')}` }];
			if (this.patronES === 3) { lista.push({ id: '1.5', texto: `1.5 · ${this.$t('domotek.proc.pointsStep')}` }); }
			if (this.patronES === 4) { lista.push({ id: '1.5', texto: `1.5 · ${this.$t('domotek.proc.strokeStep')}` }); }
			if (this.patronES === 2) { lista.push({ id: '1.5', texto: '1.5 · Drum' }); }
			lista.push({ id: '2', texto: `2 · ${this.$t('domotek.proc.params')}` }, { id: '3', texto: '3 · Auto' });
			return lista;
		},
		bioPatrones() {
			const ico = {
				1: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><rect x="11" y="11" width="26" height="26" rx="3" fill="currentColor" opacity=".25"/></svg>',
				2: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="24" rx="19" ry="11" fill="none" stroke="currentColor" stroke-width="3"/><path d="M5 24v4c0 6 8.5 11 19 11s19-5 19-11v-4" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
				3: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="19" r="4" fill="currentColor"/><circle cx="31" cy="15" r="4" fill="currentColor"/><circle cx="26" cy="32" r="4" fill="currentColor"/></svg>',
				4: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 32c4-10 8-12 11-8s6 4 13-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
			};
			const todos = [
				{ id: 1, nombre: this.$t('domotek.varios.allPlatform'), desc: this.$t('domotek.proc.fullSweep') },
				{ id: 2, nombre: this.$t('domotek.varios.drumCollector'), desc: this.$t('domotek.proc.drumDesc') },
				{ id: 3, nombre: this.$t('domotek.varios.customPoint'), desc: this.$t('domotek.proc.pointsDesc') },
				{ id: 4, nombre: this.$t('domotek.varios.freehand'), desc: this.$t('domotek.proc.freehandDesc') }
			].map(p => ({ ...p, svg: ico[p.id] }));
			return this.bedSelected == 'D' ? todos.filter(p => p.id === 2) : todos.filter(p => p.id !== 2);
		},
		bioNombrePatron() {
			const p = { 1: 'allPlatform', 2: 'drumCollector', 3: 'customPoint', 4: 'freehand' }[this.patronES];
			return p ? this.$t('domotek.varios.' + p) : '—';
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
		// Etiqueta "Flujo: " del paso 2 (añadir panel.electrospinning.flowLabel a las traducciones)
		flowLabel() {
			if (this.$te && this.$te('panel.electrospinning.flowLabel')) return this.$t('panel.electrospinning.flowLabel');
			return this.$store.state.machine.model.global.language === 'en' ? 'Flow: ' : 'Flujo: ';
		},
		flowMlMin() {
			return this.$store.state.machine.model.global.flujoES;
		},
		rpmRodilloES:{
			get() {
				return this.$store.state.machine.model.global.rpmRodilloES},
			set(value){
				this.sendCode(`set global.rpmRodilloES = ${value}`);
			}
		},
		drumRPMValue() {
			return this.$store.state.machine.model.global.rpmRodilloES;
		},
		X1PointValue:{
			get() {
				return this.$store.state.machine.model.global.posX1DrumES},
			set(value){
				this.sendCode(`set global.posX1DrumES = ${value}`);
			}
		},
		X2PointValue:{
			get() {
				return this.$store.state.machine.model.global.posX2DrumES},
			set(value){
				this.sendCode(`set global.posX2DrumES = ${value}`);
			}
		},
		exposureTimeES: {
			get() {
				return this.$store.state.machine.model.global.exposureTimeES},
			set(value){
				this.sendCode(`set global.exposureTimeES = ${value}`);
			}
		},
		exposureTimeSeconds() {
			return this.$store.state.machine.model.global.exposureTimeES;
		},
		FPlataformaX: {
			get() {
				return this.$store.state.machine.model.global.FPlataformaX},
			set(value){
				this.sendCode(`set global.FPlataformaX = ${value}`);
			}
		},
		FPlataformaXMms() {
			return this.$store.state.machine.model.global.FPlataformaX;
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
		posxES: {
			get() {
				return this.$store.state.machine.model.global.posxES},
			set(value){
				this.sendCode(`set global.posxES = ${value}`);
			}			
		},
		posyES: {
			get() {
				return this.$store.state.machine.model.global.posyES},
			set(value){
				this.sendCode(`set global.posyES = ${value}`);
			}			
		},
		// Numero de puntos guardados en la impresora (para el resumen)
		esPointsCount() {
			const n = this.$store.state.machine.model.global.esPointsCount;
			return (n === undefined || n === null) ? 0 : n;
		},
		// Altura comun de la tarjeta de todos los pasos (llena la pantalla sin hacer scroll)
		panelCardPx() {
			return Math.round(Math.min(this.panelMaxPx, Math.max(this.panelMinPx, this.windowHeight - this.panelOffsetPx)));
		},
		pxPerMm() {
			if (this.gridRealSizeMm === 0) return 1;
			return this.canvasSizePx / this.gridRealSizeMm;
		},
		cellSizePx() {
			return this.cellSizeMm * this.pxPerMm;
		},
		isPointSelected() {
			return this.customPoints.length > 0;
		},
		// FREEHAND: tamaño y escala del canvas activo (pequeño o grande)
		freehandSizePx() {
			return this.dialogFreehandBig ? this.freehandBigPx : this.canvasSizePx;
		},
		freehandPxPerMm() {
			if (this.gridRealSizeMm === 0) return 1;
			return this.freehandSizePx / this.gridRealSizeMm;
		},
		freehandCellPx() {
			return this.cellSizeMm * this.freehandPxPerMm;
		},
		enableCL: {
			get() {
				return this.$store.state.machine.model.global.enableCL},
			set(value){
				this.sendCode(`set global.enableCL = ${value}`);
			}			
		},
		cadenceEnableCL: {
			get() {
				return this.$store.state.machine.model.global.cadenceEnableCL},
			set(value){
				this.sendCode(`set global.cadenceEnableCL = ${value}`);
			}			
		},
		enableDoorDetection: {
			get() {
				return this.$store.state.machine.model.global.doorDetectionDisabled},
			set(value){
				this.sendCode(`set global.doorDetectionDisabled = ${value}`);
			}			
		},
		ChamberMode: {
			get() {
				return this.$store.state.machine.model.global.ChamberMode},		
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
		bedSelected: {
			get() {
					try {
							return this.$store.state.machine.model.global.bedSelected ;
					} catch (error) {
							console.log(`error ToolsPanel.vue bedSelected`);
							return "M";
					}
			},
		},

	},
	methods: {
		...mapActions('machine', ['sendCode', 'download']),
		// Envia G-code a la impresora SIN volcarlo en la consola, y deja solo un mensaje corto
		// tipo: 'points' (CUSTOM POINT) o 'path' (FREEHAND)
		sendCodeQuiet(code, tipo) {
			this.sendCode({ code, log: false });
			const en = this.$store.state.machine.model.global.language === 'en';
			const textos = {
				points: en ? 'Points saved' : 'Puntos guardados',
				path:   en ? 'Path saved'   : 'Trazo guardado'
			};
			if (typeof this.$log === 'function') {
				this.$log('info', textos[tipo] || (en ? 'Saved' : 'Guardado'));
			}
		},
		closeDialog(){
			// El step 1.5 lo comparten DRUM (2), CUSTOM POINT (3) y FREEHAND (4)
			if (this.pasos === '1.5' && this.patronES === 3) {
				this.saveCustomPoints();
			}
			if (this.pasos === '1.5' && this.patronES === 4) {
				this.saveFreehandPath();
			}
			this.$emit('close-dialog');
		},
		StartElectrospinning(){
			this.dialogES = true;
			console.info(`Lanzamos macro de ElectroSpinning`);
			this.nombreMacro = this.$t('domotek.varios.confirm_electospinning');
			this.codigo ='M32 "/gcodes/Admin/runOnce_ESMacro.g"';
		},
		StartElectrospinningPausing(){
			this.dialogES = true;
			console.info(`Run once ES`);
			this.nombreMacro = this.$t('panel.electrospinning.esJobInProgress');
			this.codigo = 'M25'+'\n'+'M32 "/gcodes/Admin/runOnce_ESMacro.g"'+'\n'+'M24';
		},
		onWindowResize() {
			this.windowHeight = window.innerHeight;
		},
		bioRedibujar() { // domotek: vuelve a pintar los lienzos con los colores del tema
			this.$nextTick(() => {
				if (this.patronES === 3 && this.ctx) { this.drawGrid(); }
				if (this.patronES === 4 && this.freehandCtx) { this.drawFreehandCanvas(); }
			});
		},
		CambiaStep(newStep){
			this.pasos = newStep;
		},
		handleContinue() {
			if (this.patronES === 2 || this.patronES === 3 || this.patronES === 4) {
				this.CambiaStep('1.5');
			} else {
				this.CambiaStep('2');
			}
		},
		handleBack() {
			if (this.patronES === 2 || this.patronES === 3 || this.patronES === 4) {
				this.CambiaStep('1.5');
			} else {
				this.CambiaStep('1');
			}
		},

		// ================== CUSTOM POINT MULTIPUNTO ==================
		initializeCanvasAndGrid() {
			const canvas = this.$refs.gridCanvas;
			if (!canvas) {
				this.$nextTick(() => {
					const canvasRetry = this.$refs.gridCanvas;
					if (canvasRetry) {
						this.ctx = canvasRetry.getContext('2d');
						this.loadCustomPoints(); // Cargar lista inicial
						this.drawGrid();
					} else {
						console.error("GridSelectorStep: Canvas element not found.");
					}
				});
				return;
			}
			this.ctx = canvas.getContext('2d');
			this.loadCustomPoints(); // Cargar lista inicial
			this.drawGrid();
		},
		// Descarga un fichero de texto de la impresora ('' si falla)
		async downloadPrinterFile(filename) {
			try {
				let res = await this.download({ filename, type: 'text', showProgress: false, showSuccess: false, showError: false });
				if (res && typeof res.text === 'function') res = await res.text();			// Blob
				if (res && typeof res === 'object' && typeof res.data === 'string') res = res.data;	// respuesta tipo axios
				console.log('[ES-SYNC] download', filename, '→', typeof res, (typeof res === 'string') ? res.length + ' bytes' : res);
				return (typeof res === 'string') ? res : '';
			} catch (e) {
				console.error('[ES-SYNC] ERROR descargando', filename, e);
				return '';
			}
		},
		// Devuelve un id de revision unico (entero < 2^31) para avisar a los demas clientes de un cambio
		newRevision() {
			return Math.floor(Date.now() % 2000000000);
		},
		// Lee las lineas:  M98 P"...Patron_CUSTOM-POINT.g" S{param.S} F{param.F} D{param.D} X12.00 Y34.00 U0 W1
		parsePointsFile(text) {
			const pts = [];
			const re = /^\s*M98\b.*\sX(-?[\d.]+)\s+Y(-?[\d.]+)/i;
			text.split(/\r?\n/).forEach(line => {
				const m = re.exec(line);
				if (m) pts.push({ x: parseFloat(m[1]), y: parseFloat(m[2]) });
			});
			return pts;
		},
		// Carga la lista de puntos DESDE LA IMPRESORA (fichero ESCustomPoints.g), asi todos los clientes ven lo mismo.
		// allowLegacy: si no hay lista guardada, partir del punto unico posxES/posyES (solo al abrir el menu).
		async loadCustomPoints(allowLegacy = true) {
			const g = this.$store.state.machine.model.global;
			console.log('[ES-SYNC] loadCustomPoints, esPointsCount =', g.esPointsCount, 'allowLegacy =', allowLegacy);
			let pts = [];
			if (g.esPointsCount > 0) {
				pts = this.parsePointsFile(await this.downloadPrinterFile('0:/macros/Scripts/Patrones/ESCustomPoints.g'));
			}
			if (pts.length === 0 && allowLegacy) {
				const sx = g.posxES;
				const sy = g.posyES;
				if (sx !== null && sy !== null && sx !== undefined && sy !== undefined) {
					pts = [{ x: parseFloat(sx), y: parseFloat(sy) }];
				}
			}
			console.log('[ES-SYNC] puntos cargados:', pts.length);
			this.customPoints = pts;
			this.lastSavedPointsSignature = JSON.stringify(pts);
			if (this.ctx) this.drawGrid();
		},
		// Guarda en la impresora 400 ms despues del ultimo cambio (para no escribir en cada clic)
		scheduleSaveCustomPoints() {
			clearTimeout(this.savePointsTimer);
			this.savePointsTimer = setTimeout(() => this.saveCustomPoints(), 400);
		},
		addCustomPoint(x, y) {
			this.customPoints.push({ x, y });
			this.scheduleSaveCustomPoints();
			this.syncFirstPointToStore();
			this.drawGrid();
		},
		undoLastPoint() {
			this.customPoints.pop();
			this.scheduleSaveCustomPoints();
			this.syncFirstPointToStore();
			this.drawGrid();
		},
		clearPoints() {
			this.customPoints = [];
			this.scheduleSaveCustomPoints();
			this.drawGrid();
		},
		removePoint(i) {
			this.customPoints.splice(i, 1);
			this.scheduleSaveCustomPoints();
			this.syncFirstPointToStore();
			this.drawGrid();
		},
		replacePoint(i, x, y) {
			this.customPoints.splice(i, 1, { x, y });
			this.scheduleSaveCustomPoints();
			this.syncFirstPointToStore();
			this.drawGrid();
		},
		// Mantiene posxES/posyES = primer punto (compatibilidad con el modo "sin lista" y con los ajustes guardados)
		syncFirstPointToStore() {
			if (this.customPoints.length > 0) {
				this.posxES = this.customPoints[0].x;
				this.posyES = this.customPoints[0].y;
			}
		},
		// Abre el dialogo con las coordenadas del punto i para modificarlas
		editPoint(i) {
			const p = this.customPoints[i];
			if (!p) return;
			this.editingPointIndex = i;
			this.manualX = String(parseFloat(p.x.toFixed(1)));
			this.manualY = String(parseFloat(p.y.toFixed(1)));
			this.manualXError = '';
			this.manualYError = '';
			this.activeManualInput = 'x';
			this.dialogManualCoords = true;
			this.drawGrid();
		},
		drawGrid() {
			if (!this.ctx) return;
			const canvas = this.$refs.gridCanvas;
			const ctx = this.ctx;
			const col = this.bioColores;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = col.rejilla;
			ctx.lineWidth = 0.5;
			for (let x = 0; x <= this.canvasSizePx; x += this.cellSizePx) {
				ctx.beginPath();
				ctx.moveTo(Math.round(x), 0);
				ctx.lineTo(Math.round(x), this.canvasSizePx);
				ctx.stroke();
			}
			for (let y = 0; y <= this.canvasSizePx; y += this.cellSizePx) {
				ctx.beginPath();
				ctx.moveTo(0, Math.round(y));
				ctx.lineTo(this.canvasSizePx, Math.round(y));
				ctx.stroke();
			}
			ctx.strokeStyle = col.borde;
			ctx.lineWidth = 1;
			ctx.strokeRect(0, 0, this.canvasSizePx, this.canvasSizePx);

			// Puntos numerados
			ctx.font = this.temaBio ? '11px "IBM Plex Sans", sans-serif' : '10px sans-serif';
			this.customPoints.forEach((p, i) => {
				const px = p.x * this.pxPerMm;
				const py = (this.gridRealSizeMm - p.y) * this.pxPerMm;
				ctx.beginPath();
				ctx.arc(px, py, this.temaBio ? (i === this.editingPointIndex ? 6 : 5) : (i === this.editingPointIndex ? 5 : 3), 0, 2 * Math.PI, false);
				ctx.fillStyle = (i === this.editingPointIndex) ? col.puntoEdit : col.punto;
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = col.puntoBorde;
				ctx.stroke();
				ctx.fillStyle = col.texto;
				ctx.fillText(String(i + 1), px + (this.temaBio ? 7 : 5), py - (this.temaBio ? 6 : 4));
			});
		},
		handleCanvasClick(event) {
			if (!this.ctx) return;
			const rect = this.$refs.gridCanvas.getBoundingClientRect(); 
			const clickXpx = Math.max(0, Math.min(event.clientX - rect.left, this.canvasSizePx));
			const clickYpx = Math.max(0, Math.min(event.clientY - rect.top, this.canvasSizePx));
			this.addCustomPoint(clickXpx / this.pxPerMm, this.gridRealSizeMm - (clickYpx / this.pxPerMm));
		},
		centerPoint() {
			if (!this.ctx) {
				console.error("centerPoint: Canvas context (ctx) not available. Attempting to initialize.");
				this.initializeCanvasAndGrid(); // Intenta inicializar si no está listo
				this.$nextTick(() => {
					if (!this.ctx) {
						console.error("centerPoint: Canvas context still not available after re-init attempt.");
						return;
					}
					this.doCenterPointLogic();
				});
				return;
			}
			this.doCenterPointLogic();
		},
		doCenterPointLogic() {
			// Añade un punto en el centro de la plataforma
			this.addCustomPoint(71, 71);
		},
		// Escribe la lista de puntos en la impresora. Se llama automaticamente al SALIR del step 1.5
		// (con Continuar, Atras, la barra de steps o cerrando el menu) y 400 ms despues del ultimo cambio.
		saveCustomPoints() {
			clearTimeout(this.savePointsTimer);
			// Evitar reescribir si la lista no ha cambiado desde el ultimo guardado
			const signature = JSON.stringify(this.customPoints);
			if (signature === this.lastSavedPointsSignature) return;
			this.lastSavedPointsSignature = signature;

			const g = this.$store.state.machine.model.global;
			const n = this.customPoints.length;
			const rev = this.newRevision();
			this.lastOwnPointsRev = rev;

			let code = '';
			if (n > 0) {
				// Una llamada a Patron_CUSTOM-POINT.g por punto: ir, extruir S segundos.
				// U=1 → G11 al llegar (todos menos el 1º; el 1º lo hace ESMacro.g)
				// W=1 → G10 al salir  (todos menos el ultimo; el ultimo lo hace ESMacro.g)
				// Para desactivar el antigoteo entre puntos pon unretract = 0 y retract = 0.
				code += 'M28 "/macros/Scripts/Patrones/ESCustomPoints.g"\n';
				code += 'M98 R1\n';
				this.customPoints.forEach((p, i) => {
					const unretract = (i > 0) ? 1 : 0;
					const retract   = (i < n - 1) ? 1 : 0;
					code += `M98 P"0:/macros/Scripts/Patrones/Patron_CUSTOM-POINT.g" S{param.S} F{param.F} D{param.D} X${p.x.toFixed(2)} Y${p.y.toFixed(2)} U${unretract} W${retract}\n`;
				});
				code += 'M29\n';
			}
			// Contador (0 = sin lista → la macro usa el punto unico posxES/posyES) y revision (avisa a los demas clientes)
			code += (g.esPointsCount === undefined ? 'global esPointsCount = ' : 'set global.esPointsCount = ') + n + '\n';
			code += (g.esPointsRev === undefined ? 'global esPointsRev = ' : 'set global.esPointsRev = ') + rev + '\n';
			console.log('[ES-SYNC] guardando puntos, n =', n, 'rev =', rev);
			this.sendCodeQuiet(code, 'points');
		},
		// ================== FIN CUSTOM POINT MULTIPUNTO ==================

		// ================== FREEHAND (trazo libre) ==================
		initializeFreehandCanvas() {
			const canvas = this.$refs.freehandCanvas;
			if (!canvas) {
				this.$nextTick(() => {
					const retry = this.$refs.freehandCanvas;
					if (retry) {
						this.freehandCtx = retry.getContext('2d');
						this.loadFreehandPath();
					} else {
						console.error("FreehandCanvas: elemento canvas no encontrado.");
					}
				});
				return;
			}
			this.freehandCtx = canvas.getContext('2d');
			this.loadFreehandPath();
		},
		// Lee ESFreehandPath.g. Lineas validas:
		//   G1 X.. Y.. F{param.J}               → inicio de sub-trazo (salto, sin extruir)
		//   G1 X.. Y.. E{..*param.K} F{param.C} → tramo de deposicion
		// El bloque G4 P1 ... G4 P2 es el relleno: se ignora y se regenera al guardar
		parseFreehandFile(text) {
			const strokes = [];
			const fill = [];
			let cur = null;
			let inFill = false;
			const re = /^\s*G1\s+X(-?[\d.]+)\s+Y(-?[\d.]+)(?:\s+E\{[^}]*\})?\s+F\{param\.([JC])\}/i;
			text.split(/\r?\n/).forEach(line => {
				if (/^\s*G4\s+P1\b/i.test(line)) {		// inicio de relleno de la ultima figura
					inFill = true;
					if (strokes.length > 0) fill[strokes.length - 1] = true;
					return;
				}
				if (/^\s*G4\s+P2\b/i.test(line)) { inFill = false; return; }
				if (inFill) return;
				const m = re.exec(line);
				if (!m) return;
				const pt = { x: parseFloat(m[1]), y: parseFloat(m[2]) };
				if (m[3].toUpperCase() === 'J') {	// salto = inicio de sub-trazo
					cur = [pt];
					strokes.push(cur);
					fill.push(false);
				} else if (cur) {
					cur.push(pt);
				}
			});
			return { strokes, fill };
		},
		freehandSignature() {
			return JSON.stringify({ s: this.strokes, f: this.strokeFill });
		},
		// Una figura esta cerrada si tiene suficientes puntos y el final vuelve cerca del inicio
		isClosedStroke(stroke) {
			if (!stroke || stroke.length < 4) return false;
			const a = stroke[0];
			const b = stroke[stroke.length - 1];
			return Math.hypot(a.x - b.x, a.y - b.y) <= this.closeToleranceMm;
		},
		// ---- Deteccion de figuras cerradas ----
		// Tolerancia de cierre para un trazo: crece con el tamaño de la figura
		closeToleranceFor(stroke) {
			let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
			stroke.forEach(p => {
				xmin = Math.min(xmin, p.x); xmax = Math.max(xmax, p.x);
				ymin = Math.min(ymin, p.y); ymax = Math.max(ymax, p.y);
			});
			const diag = Math.hypot(xmax - xmin, ymax - ymin);
			return Math.min(this.closeToleranceMaxMm, Math.max(this.closeToleranceMm, diag * this.closeToleranceRel));
		},
		// Punto de corte de los segmentos a-b y c-d (null si no se cortan)
		segmentIntersection(a, b, c, d) {
			const rx = b.x - a.x, ry = b.y - a.y;
			const sx = d.x - c.x, sy = d.y - c.y;
			const den = rx * sy - ry * sx;
			if (Math.abs(den) < 1e-9) return null;		// paralelos
			const t = ((c.x - a.x) * sy - (c.y - a.y) * sx) / den;
			const u = ((c.x - a.x) * ry - (c.y - a.y) * rx) / den;
			if (t < 0 || t > 1 || u < 0 || u > 1) return null;
			return { x: a.x + t * rx, y: a.y + t * ry };
		},
		// Intenta cerrar un trazo. Devuelve el trazo cerrado (ultimo punto = primero) o null si no parece una figura cerrada.
		// Casos que detecta:
		//   1) El final se ha pasado del inicio y cruza el principio del trazo → se recorta lo que sobra por los dos lados
		//   2) El final ha quedado cerca del inicio → se une al inicio
		//   3) El final ha quedado cerca de uno de los primeros puntos → se recorta el principio y se cierra ahi
		tryCloseStroke(stroke) {
			const n = stroke.length;
			if (n < 4) return null;
			const tol = this.closeToleranceFor(stroke);
			const start = stroke[0];
			const end = stroke[n - 1];

			// El trazo tiene que haberse alejado del inicio (evita cerrar rayas cortas o garabatos)
			let maxDist = 0;
			stroke.forEach(p => { maxDist = Math.max(maxDist, Math.hypot(p.x - start.x, p.y - start.y)); });
			if (maxDist < 2 * tol) return null;

			// Solo se buscan cierres entre el primer 40% y el ultimo 40% del trazo (un "8" no se cierra solo)
			const jMax = Math.ceil((n - 1) * 0.4);
			const iMin = Math.floor((n - 1) * 0.6);
			const valido = r => (r && r.length >= 4) ? r : null;

			// 1) Auto-cruce: ultimo segmento que cruza alguno de los primeros
			for (let i = n - 2; i >= iMin; i--) {
				for (let j = 0; j <= Math.min(jMax, i - 2); j++) {
					const p = this.segmentIntersection(stroke[j], stroke[j + 1], stroke[i], stroke[i + 1]);
					if (p) return valido([p, ...stroke.slice(j + 1, i + 1), { x: p.x, y: p.y }]);
				}
			}
			// 2) Final cerca del inicio
			if (Math.hypot(end.x - start.x, end.y - start.y) <= tol) {
				return valido([...stroke, { x: start.x, y: start.y }]);
			}
			// 3) Final cerca de uno de los primeros puntos
			for (let j = 1; j <= jMax; j++) {
				if (Math.hypot(end.x - stroke[j].x, end.y - stroke[j].y) <= tol) {
					return valido([...stroke.slice(j), { x: stroke[j].x, y: stroke[j].y }]);
				}
			}
			return null;
		},
		toggleStrokeFill(i) {
			if (!this.isClosedStroke(this.strokes[i])) return;
			this.$set(this.strokeFill, i, !this.strokeFill[i]);
			this.scheduleSaveFreehand();
			this.drawFreehandCanvas();
		},
		// Relleno por barrido en zig-zag (lineas horizontales, regla par-impar).
		// Devuelve una lista de segmentos [[{x,y},{x,y}], ...] en orden de recorrido.
		computeFillSegments(stroke) {
			const n = stroke.length;
			let ymin = Infinity, ymax = -Infinity;
			stroke.forEach(p => { ymin = Math.min(ymin, p.y); ymax = Math.max(ymax, p.y); });
			const sp = this.fillSpacingMm;
			const ys = [];
			for (let y = ymin + sp / 2; y < ymax; y += sp) ys.push(y);
			if (ys.length === 0) ys.push((ymin + ymax) / 2);		// figura muy estrecha: una sola pasada

			const segs = [];
			let dir = 1;
			ys.forEach(y => {
				const xs = [];
				for (let i = 0; i < n; i++) {
					const p = stroke[i];
					const q = stroke[(i + 1) % n];		// el ultimo punto se une con el primero (cierra la figura)
					if ((p.y <= y && q.y > y) || (q.y <= y && p.y > y)) {
						xs.push(p.x + (y - p.y) * (q.x - p.x) / (q.y - p.y));
					}
				}
				xs.sort((a, b) => a - b);
				const row = [];
				for (let k = 0; k + 1 < xs.length; k += 2) {
					if (xs[k + 1] - xs[k] > 0.2) row.push([{ x: xs[k], y }, { x: xs[k + 1], y }]);
				}
				if (dir < 0) {
					row.reverse();
					row.forEach(sg => sg.reverse());
				}
				row.forEach(sg => segs.push(sg));
				dir = -dir;
			});
			return segs;
		},
		drawFillPreview(ctx, stroke) {
			ctx.save();
			ctx.beginPath();
			stroke.forEach((pt, i) => {
				const p = this.freehandMmToPixel(pt.x, pt.y);
				if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
			});
			ctx.closePath();
			ctx.fillStyle = this.bioColores.relleno;
			ctx.fill();
			ctx.strokeStyle = this.bioColores.rayado;
			ctx.lineWidth = 0.7;
			this.computeFillSegments(stroke).forEach(sg => {
				const a = this.freehandMmToPixel(sg[0].x, sg[0].y);
				const b = this.freehandMmToPixel(sg[1].x, sg[1].y);
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			});
			ctx.restore();
		},
		// Carga el trazo DESDE LA IMPRESORA (fichero ESFreehandPath.g), asi todos los clientes ven lo mismo
		async loadFreehandPath() {
			const len = this.$store.state.machine.model.global.esPathLength;
			if (len !== undefined && len !== null) {
				if (len > 0) {
					const text = await this.downloadPrinterFile('0:/macros/Scripts/Patrones/ESFreehandPath.g');
					if (text) {
						const parsed = this.parseFreehandFile(text);
						this.strokes = parsed.strokes;
						this.strokeFill = parsed.fill;
					}
				} else {
					// Trazo vacio (por ejemplo, otro cliente lo ha borrado)
					this.strokes = [];
					this.strokeFill = [];
				}
				this.currentStroke = [];
				this.lastSavedFreehandSignature = this.freehandSignature();
			}
			this.drawFreehandCanvas();
		},
		scheduleSaveFreehand() {
			clearTimeout(this.saveFreehandTimer);
			this.saveFreehandTimer = setTimeout(() => this.saveFreehandPath(), 400);
		},
		// ---- Canvas grande ----
		// Canvas sobre el que se dibuja ahora mismo (el grande si esta abierto)
		freehandCanvasEl() {
			return this.dialogFreehandBig ? this.$refs.freehandCanvasBig : this.$refs.freehandCanvas;
		},
		openFreehandBig() {
			// Tamaño segun la pantalla: que quepa en alto y deje sitio a los botones en ancho
			const h = window.innerHeight - 140;
			const w = window.innerWidth - 260;
			this.freehandBigPx = Math.max(250, Math.floor(Math.min(h, w, 900)));
			this.dialogFreehandBig = true;
			this.attachFreehandCanvas(true);
		},
		closeFreehandBig() {
			this.dialogFreehandBig = false;		// el watcher devuelve el dibujo al canvas pequeño
		},
		// Engancha el contexto de dibujo al canvas grande o al pequeño (con reintento: el dialogo se monta con retraso)
		attachFreehandCanvas(big, intento = 0) {
			this.$nextTick(() => {
				const c = big ? this.$refs.freehandCanvasBig : this.$refs.freehandCanvas;
				if (c) {
					this.freehandCtx = c.getContext('2d');
					this.drawFreehandCanvas();
				} else if (intento < 10) {
					setTimeout(() => this.attachFreehandCanvas(big, intento + 1), 50);
				}
			});
		},
		freehandPixelToMm(pxX, pxY) {
			const x = pxX / this.freehandPxPerMm;
			const y = this.gridRealSizeMm - (pxY / this.freehandPxPerMm);
			return { x, y };
		},
		freehandMmToPixel(mmX, mmY) {
			const x = mmX * this.freehandPxPerMm;
			const y = (this.gridRealSizeMm - mmY) * this.freehandPxPerMm;
			return { x, y };
		},
		freehandEventToLocalPx(event) {
			const canvas = this.freehandCanvasEl();
			const rect = canvas.getBoundingClientRect();
			// Corrige si el canvas se ve escalado por CSS
			const sx = rect.width  ? canvas.width  / rect.width  : 1;
			const sy = rect.height ? canvas.height / rect.height : 1;
			let px = (event.clientX - rect.left) * sx;
			let py = (event.clientY - rect.top) * sy;
			px = Math.max(0, Math.min(px, this.freehandSizePx));
			py = Math.max(0, Math.min(py, this.freehandSizePx));
			return { px, py };
		},
		drawFreehandCanvas() {
			if (!this.freehandCtx) return;
			const canvas = this.freehandCanvasEl();
			if (!canvas) return;
			const ctx = this.freehandCtx;
			const size = this.freehandSizePx;
			const cell = this.freehandCellPx;
			const col = this.bioColores;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Rejilla
			ctx.strokeStyle = col.rejilla;
			ctx.lineWidth = 0.5;
			for (let x = 0; x <= size; x += cell) {
				ctx.beginPath();
				ctx.moveTo(Math.round(x), 0);
				ctx.lineTo(Math.round(x), size);
				ctx.stroke();
			}
			for (let y = 0; y <= size; y += cell) {
				ctx.beginPath();
				ctx.moveTo(0, Math.round(y));
				ctx.lineTo(size, Math.round(y));
				ctx.stroke();
			}
			ctx.strokeStyle = col.borde;
			ctx.lineWidth = 1;
			ctx.strokeRect(0, 0, size, size);

			// Sub-trazos ya guardados
			ctx.strokeStyle = col.trazo;
			ctx.lineWidth = this.dialogFreehandBig ? 3 : 2;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			this.strokes.forEach((stroke, si) => {
				if (this.strokeFill[si] && this.isClosedStroke(stroke)) this.drawFillPreview(ctx, stroke);
				this.drawStrokePolyline(ctx, stroke);
			});

			// Trazo que se esta dibujando ahora mismo
			if (this.currentStroke.length > 0) {
				// Zona de cierre alrededor del inicio: se pone verde cuando al soltar la figura se cerraria
				const willClose = this.tryCloseStroke(this.currentStroke) !== null;
				const st = this.freehandMmToPixel(this.currentStroke[0].x, this.currentStroke[0].y);
				const r = this.closeToleranceFor(this.currentStroke) * this.freehandPxPerMm;
				ctx.save();
				ctx.beginPath();
				ctx.arc(st.x, st.y, r, 0, 2 * Math.PI);
				ctx.fillStyle = willClose ? col.cierraFondo : col.zona;
				ctx.fill();
				ctx.setLineDash([3, 3]);
				ctx.lineWidth = 1;
				ctx.strokeStyle = willClose ? col.cierra : col.borde;
				ctx.stroke();
				ctx.restore();

				ctx.strokeStyle = willClose ? col.cierra : col.abierto;
				this.drawStrokePolyline(ctx, this.currentStroke);
			}
		},
		drawStrokePolyline(ctx, stroke) {
			if (stroke.length < 1) return;
			ctx.beginPath();
			const first = this.freehandMmToPixel(stroke[0].x, stroke[0].y);
			ctx.moveTo(first.x, first.y);
			for (let i = 1; i < stroke.length; i++) {
				const p = this.freehandMmToPixel(stroke[i].x, stroke[i].y);
				ctx.lineTo(p.x, p.y);
			}
			ctx.stroke();
		},
		handleFreehandPointerDown(event) {
			if (!this.freehandCtx) return;
			this.isDrawingFreehand = true;
			const { px, py } = this.freehandEventToLocalPx(event);
			const mm = this.freehandPixelToMm(px, py);
			this.currentStroke = [mm];
			this.drawFreehandCanvas();
		},
		handleFreehandPointerMove(event) {
			if (!this.isDrawingFreehand || !this.freehandCtx) return;
			const { px, py } = this.freehandEventToLocalPx(event);
			const mm = this.freehandPixelToMm(px, py);

			const last = this.currentStroke[this.currentStroke.length - 1];
			const dist = last ? Math.hypot(mm.x - last.x, mm.y - last.y) : Infinity;

			// Simplificacion: solo guarda el punto si esta suficientemente lejos del anterior
			if (dist >= this.minSegmentDistanceMm) {
				this.currentStroke.push(mm);
				this.drawFreehandCanvas();
			}
		},
		handleFreehandPointerUp() {
			if (!this.isDrawingFreehand) return;
			this.isDrawingFreehand = false;
			if (this.currentStroke.length >= 2) {
				// Si el trazo parece una figura cerrada, se cierra exactamente (ultimo punto = primero)
				const cerrado = this.tryCloseStroke(this.currentStroke);
				this.strokes.push(cerrado || this.currentStroke);
				this.strokeFill.push(false);
				this.scheduleSaveFreehand();
			}
			this.currentStroke = [];
			this.drawFreehandCanvas();
		},
		undoLastFreehandStroke() {
			this.strokes.pop();
			this.strokeFill.pop();
			this.scheduleSaveFreehand();
			this.drawFreehandCanvas();
		},
		clearFreehandPath() {
			this.strokes = [];
			this.strokeFill = [];
			this.currentStroke = [];
			this.scheduleSaveFreehand();
			this.drawFreehandCanvas();
		},
		confirmFreehandPath() {
			this.saveFreehandPath();
			this.CambiaStep('2');
		},
		// Escribe el trazo en la impresora. Se llama 400 ms despues del ultimo cambio y al SALIR del step 1.5 (FREEHAND).
		// En el fichero generado:
		//   {param.C} = velocidad de deposicion [mm/min]
		//   {param.J} = velocidad de salto [mm/min]
		//   {param.K} = mm de embolo (trampeados x1000) por cada mm de trayectoria → lo calcula Patron_FREEHAND.g
		saveFreehandPath() {
			clearTimeout(this.saveFreehandTimer);
			// Evitar reescribir si el trazo no ha cambiado desde el ultimo guardado
			const signature = this.freehandSignature();
			if (signature === this.lastSavedFreehandSignature) return;
			this.lastSavedFreehandSignature = signature;

			const g = this.$store.state.machine.model.global;
			let depositLength = 0;		// longitud total de deposicion (sin saltos)
			let code = 'M28 "/macros/Scripts/Patrones/ESFreehandPath.g"\nM98 R1\n';

			// Salto: sin extruir (la FAV sigue encendida, la gestiona ESMacro.g)
			const jump = (p) => {
				code += `G1 X${p.x.toFixed(2)} Y${p.y.toFixed(2)} F{param.J}\n`;
			};
			// Tramo de deposicion: la extrusion es proporcional a la longitud del tramo
			const deposit = (a, b) => {
				const len = Math.hypot(b.x - a.x, b.y - a.y);
				if (len <= 0) return;
				depositLength += len;
				code += `G1 X${b.x.toFixed(2)} Y${b.y.toFixed(2)} E{${len.toFixed(3)}*param.K} F{param.C}\n`;
			};

			this.strokes.forEach((stroke, si) => {
				stroke.forEach((p, idx) => {
					if (idx === 0) jump(p);
					else deposit(stroke[idx - 1], p);
				});
				// Figura cerrada con relleno: barrido del area interior (marcado con G4 P1 ... G4 P2 para poder releerlo)
				if (this.strokeFill[si] && this.isClosedStroke(stroke)) {
					code += 'G4 P1 ; FILL-BEGIN\n';
					this.computeFillSegments(stroke).forEach(sg => {
						jump(sg[0]);
						deposit(sg[0], sg[1]);
					});
					code += 'G4 P2 ; FILL-END\n';
				}
			});
			code += 'M400\n';
			code += 'M29\n';

			// Longitud de deposicion (contorno + relleno). Si el trazo esta vacio queda a 0 y Patron_FREEHAND.g avisa de que no hay trazo
			code += (g.esPathLength === undefined ? 'global esPathLength = ' : 'set global.esPathLength = ') + depositLength.toFixed(2) + '\n';
			// Revision: avisa a los demas clientes de que el trazo ha cambiado
			const rev = this.newRevision();
			this.lastOwnPathRev = rev;
			code += (g.esPathRev === undefined ? 'global esPathRev = ' : 'set global.esPathRev = ') + rev + '\n';

			console.log('[ES-SYNC] guardando freehand, trazos =', this.strokes.length, 'rev =', rev);
			this.sendCodeQuiet(code, 'path');
		},
		// ================== FIN FREEHAND ==================

		openManualCoordsDialog() {
			this.editingPointIndex = -1; // añadir punto nuevo
			// Por defecto propone el ultimo punto añadido (o 0,0 si no hay ninguno)
			const last = this.customPoints.length > 0 ? this.customPoints[this.customPoints.length - 1] : null;
			this.manualX = last ? String(Math.round(last.x)) : '0';
			this.manualY = last ? String(Math.round(last.y)) : '0';
			this.manualXError = '';
			this.manualYError = '';
			this.activeManualInput = 'x'; // Por defecto, el foco al campo X
			this.dialogManualCoords = true;
		},

		canBackspace() {
			if (this.activeManualInput === 'x') {
				return this.manualX.length > 0;
			} else if (this.activeManualInput === 'y') {
				return this.manualY.length > 0;
			}
			return false;
		},
		handleKeyPress(value) {
			let currentVal = this.activeManualInput === 'x' ? this.manualX : this.manualY;
			let newError = '';

			if (value === 'CLEAR') {
				currentVal = '';
			} else if (value === 'DEL') {
				currentVal = currentVal.slice(0, -1);
			} else {
				// Permitir un solo punto decimal
				if (value === '.' && currentVal.includes('.')) return;

				// Limitar a 5 caracteres
				if (currentVal.length < 5) {
				currentVal += value;
				}
			}

			// Validación: dentro del rango, sin importar cantidad de decimales
			if (currentVal !== '') {
				const numVal = parseFloat(currentVal);
				if (isNaN(numVal) || numVal < this.minCoord || numVal > this.maxCoord) {
				newError = this.$t('panel.ultraviolet.rangeErrorDetailed', {
					min: this.minCoord,
					max: this.maxCoord,
					val: currentVal
				});
				} else {
				newError = '';
				}
			} else {
				newError = '';
			}

			if (this.activeManualInput === 'x') {
				this.manualX = currentVal;
				this.manualXError = newError;
			} else {
				this.manualY = currentVal;
				this.manualYError = newError;
			}
		},
		cancelManualInput() {
			this.editingPointIndex = -1;
			this.drawGrid();
			this.dialogManualCoords = false;
			this.manualXError = '';
			this.manualYError = '';
		},
		confirmManualInput() {
			const xVal = parseFloat(this.manualX);
			const yVal = parseFloat(this.manualY);

			const xIsValid = !isNaN(xVal) && xVal >= this.minCoord && xVal <= this.maxCoord;
			const yIsValid = !isNaN(yVal) && yVal >= this.minCoord && yVal <= this.maxCoord;

			this.manualXError = xIsValid ? '' : this.$t('panel.ultraviolet.invalidOrRange');
			this.manualYError = yIsValid ? '' : this.$t('panel.ultraviolet.invalidOrRange');

			if (!xIsValid || !yIsValid) {
				return;
			}

			// Edita el punto seleccionado o añade uno nuevo a la lista
			if (this.editingPointIndex >= 0) {
				this.replacePoint(this.editingPointIndex, xVal, yVal);
				this.editingPointIndex = -1;
			} else {
				this.addCustomPoint(xVal, yVal);
			}
			this.dialogManualCoords = false;
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
			this.codigo += " "+"set global.rpmRodilloES = "+ this.$store.state.machine.model.global.rpmRodilloES +'\n';
			this.codigo += " "+"set global.FPlataformaX = "+ this.$store.state.machine.model.global.FPlataformaX +'\n';
			this.codigo += " "+"set global.flujoES = "+ this.$store.state.machine.model.global.flujoES +'\n';
			this.codigo += " "+"set global.exposureTimeES = "+ this.$store.state.machine.model.global.exposureTimeES +'\n';
			this.codigo += " "+"set global.syrModelES = " + this.$store.state.machine.model.global.syrModelES +'\n';
			this.codigo += " "+"set global.rutaMacroES = " + this.rutaMacro +'\n';
			this.codigo += " "+"set global.alturaES = "+ this.$store.state.machine.model.global.alturaES + '\n';
			this.codigo += " "+"set global.posxES = "+ this.$store.state.machine.model.global.posxES + '\n';
			this.codigo += " "+"set global.posyES = "+ this.$store.state.machine.model.global.posyES + '\n';
			this.codigo += " "+"set global.enableES = "+ this.$store.state.machine.model.global.enableES + '\n';
			this.codigo += " "+"set global.cadenceEnableES = "+ this.$store.state.machine.model.global.cadenceEnableES + '\n';
			this.codigo += " "+"set global.cadenceAmountES = "+ this.$store.state.machine.model.global.cadenceAmountES + '\n';
			this.codigo += " "+"set global.aplicarFinES = "+ this.$store.state.machine.model.global.aplicarFinES + '\n';
			this.codigo += " "+"set global.posX1DrumES = "+ this.$store.state.machine.model.global.posX1DrumES + '\n';
			this.codigo += " "+"set global.posX2DrumES = "+ this.$store.state.machine.model.global.posX2DrumES + '\n';
			// Persistir el numero de puntos de CUSTOM POINT (los movimientos ya estan en la SD: ESCustomPoints.g)
			const nPts = this.$store.state.machine.model.global.esPointsCount;
			if (nPts !== undefined && nPts !== null) {
				this.codigo += " "+"set global.esPointsCount = "+ nPts + '\n';
			}
			// Persistir la longitud del trazo FREEHAND (los movimientos ya estan en la SD: ESFreehandPath.g)
			const pathLength = this.$store.state.machine.model.global.esPathLength;
			if (pathLength !== undefined && pathLength !== null) {
				this.codigo += " "+"set global.esPathLength = "+ pathLength + '\n';
			}
			this.codigo += 'M29' + '\n';

			
			console.info(this.codigo);
			

			
		},
		
		ChangeSelectedPatt(numero){
			switch (numero) {
				case 1:
					this.codigoPatt = 'ALL PLATFORM';
					break;
				case 2:
					this.codigoPatt = 'DRUM COLLECTOR';
					break;
				case 3:
					this.codigoPatt = 'CUSTOM POINT';		
					break;
				case 4:
					this.codigoPatt = 'FREEHAND';
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
		ChangeSelectedFlow(numero) {
			this.flujoES = numero;  // Si tienes un v-model similar, lo actualizas aquí

			// Convierte el número a mililitros por minuto, con 2 decimales
			const ml = (numero / 100).toFixed(2).replace('.', ',');

			// Construye el nombre del código
			this.codigoFlow = `${ml}_ml_min`;
		},
		ChangeSelectedFlow2(numero){
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
		ChangeSelectedExp(numero) {
			// Guarda el número en exposureTimeES
			this.exposureTimeES = numero;

			// Convierte el tiempo a minutos con un decimal
			const minutos = (numero / 60).toFixed(1).replace('.', ',');

			// Crea el nombre del archivo dinámicamente
			this.codigoExp = `${minutos}_min.gcode`;
		},

		ChangeSelectedExp2(numero){
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
		openTimeDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualTimeInput = (this.exposureTimeSeconds / 60).toFixed(2).toString();
			this.manualTimeError = ''; // Limpia errores previos
			this.dialogManualTime = true;
		},
		handleTimeKeyPress(key) {
			if (key === 'DEL') {
				this.manualTimeInput = this.manualTimeInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualTimeInput = '';
			} else {
				if (this.manualTimeInput.length < 5) { // Límite de 5 dígitos
					this.manualTimeInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateTime();
		},
		validateTime() {
			const value = this.manualTimeInput;
			const ruleRequired = this.rules.required(value);
			if (ruleRequired !== true) {
				this.manualTimeError = ruleRequired;
				return;
			}

			const rulePositive = this.rules.positiveNumber(value);
			if (rulePositive !== true) {
				this.manualTimeError = rulePositive;
				return;
			}

			// Si todas las reglas pasan, se limpia el error
			this.manualTimeError = '';
		},

		/**
		 * Cierra el diálogo sin guardar cambios.
		 */
		cancelManualTime() {
			this.dialogManualTime = false;
		},

		/**
		 * Confirma el valor, lo guarda y llama a tu método principal.
		 */
		confirmManualTime() {
			this.validateTime();
			if (this.manualTimeError) return;

			const minutes = parseFloat(this.manualTimeInput);
			const newValue = Math.round(minutes * 60); // convierte a segundos

			this.sendCode(`set global.exposureTimeES = ${newValue}`);

			this.ChangeSelectedExp(newValue); // actualiza gcode si aplica

			this.dialogManualTime = false;
		},

		openXSpeedDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualXSpeedInput = (this.FPlataformaXMms/60).toString();
			this.manualXSpeedError = ''; // Limpia errores previos
			this.dialogManualXSpeed = true;
		},
		handleXSpeedKeyPress(key) {
			if (key === 'DEL') {
				this.manualXSpeedInput = this.manualXSpeedInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualXSpeedInput = '';
			} else {
				if (this.manualXSpeedInput.length < 5) { // Límite de 5 dígitos
					this.manualXSpeedInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateXSpeed();
		},
		validateXSpeed() {
			const value = this.manualXSpeedInput;
			const ruleRequired = this.rules.required(value);
			if (ruleRequired !== true) {
				this.manualXSpeedError = ruleRequired;
				return;
			}

			const rulePositive = this.rules.positiveNumber(value);
			if (rulePositive !== true) {
				this.manualXSpeedError = rulePositive;
				return;
			}

			// Si todas las reglas pasan, se limpia el error
			this.manualXSpeedError = '';
		},

		cancelManualXSpeed() {
			this.dialogManualXSpeed = false;
		},

		confirmManualXSpeed() {
			this.validateXSpeed();
			if (this.manualXSpeedError) return;

			const mm = parseFloat(this.manualXSpeedInput * 60);
			const newValue = Math.round(mm); // convierte a mm/min

			this.sendCode(`set global.FPlataformaX = ${newValue}`);

			this.dialogManualXSpeed = false;
		},

		openFlowDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualFlowInput = (this.flowMlMin / 100).toFixed(2).toString();
			this.manualFlowError = ''; // Limpia errores previos
			this.dialogManualFlow = true;
		},
		handleFlowKeyPress(key) {
			if (key === 'DEL') {
				this.manualFlowInput = this.manualFlowInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualFlowInput = '';
			} else {
				if (this.manualFlowInput.length < 4) { // Límite de 4 dígitos
					this.manualFlowInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateFlow();
		},
		validateFlow() {
			const value = this.manualFlowInput;

			const required = this.rules.required(value);
			if (required !== true) {
				this.manualFlowError = required;
				return;
			}

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) {
				this.manualFlowError = positive;
				return;
			}

			const range = this.rules.flowRange(value);
			if (range !== true) {
				this.manualFlowError = range;
				return;
			}

			this.manualFlowError = '';
		},
		
		cancelManualFlow() {
			this.dialogManualFlow = false;
		},
		confirmManualFlow() {
			this.validateFlow();
			if (this.manualFlowError) return;

			const mlMin = parseFloat(this.manualFlowInput);
			const newFlowValue = Math.round(mlMin * 100); // convierte a mililitros por minuto

			this.sendCode(`set global.flujoES = ${newFlowValue}`);

			this.ChangeSelectedFlow(newFlowValue); // actualiza gcode si aplica

			this.dialogManualFlow = false;
		},


		openDrumRPMDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualDrumRPMInput = (this.drumRPM).toString();
			this.manualDrumRPMError = ''; // Limpia errores previos
			this.dialogManualDrumRPM = true;
		},
		handleDrumRPMKeyPress(key) {
			if (key === 'DEL') {
				this.manualDrumRPMInput = this.manualDrumRPMInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualDrumRPMInput = '';
			} else {
				if (this.manualDrumRPMInput.length < 4) { // Límite de 4 dígitos
					this.manualDrumRPMInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateDrumRPM();
		},

		validateDrumRPM() {
			const value = this.manualDrumRPMInput;

			const required = this.rules.required(value);
			if (required !== true) {
				this.manualDrumRPMError = required;
				return;
			}

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) {
				this.manualDrumRPMError = positive;
				return;
			}

			const range = this.rules.drumRPMRange(value);
			if (range !== true) {
				this.manualDrumRPMError = range;
				return;
			}

			this.manualDrumRPMError = '';
		},
		cancelManualDrumRPM() {
			this.dialogManualDrumRPM = false;
		},
		
		confirmManualDrumRPM() {
			this.validateDrumRPM();
			if (this.manualDrumRPMError) return;

			const rpm = parseFloat(this.manualDrumRPMInput);
			this.drumRPM = rpm; 
			this.sendCode(`set global.rpmRodilloES = ${rpm}`);

			this.dialogManualDrumRPM = false;
		},

		openXPointsDialog() {
			this.manualX1PointInput = this.X1PointValue.toString();
			this.manualX2PointInput = this.X2PointValue.toString();
			this.manualX1PointError = '';
			this.manualX2PointError = '';
			this.dialogManualXPoints = true;
		},

		handleXPointsKeyPress(key) {
			const target = this.activeManualXPointsInput === 'x1' ? 'manualX1PointInput' : 'manualX2PointInput';
			if (key === 'DEL') {
			this[target] = this[target].slice(0, -1);
			} else if (key === 'CLEAR') {
			this[target] = '';
			} else if (this[target].length < 4) {
			this[target] += key;
			}

			// Validar en tiempo real
			if (this.activeManualXPointsInput === 'x1') this.validateX1Point();
			else this.validateX2Point();
		},

		validateX1Point() {
			const value = this.manualX1PointInput;
			const required = this.rules.required(value);
			if (required !== true) { this.manualX1PointError = required; return; }

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) { this.manualX1PointError = positive; return; }

			const range = this.rules.xPointRange(value);
			this.manualX1PointError = range === true ? '' : range;
		},

		validateX2Point() {
			const value = this.manualX2PointInput;
			const required = this.rules.required(value);
			if (required !== true) { this.manualX2PointError = required; return; }

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) { this.manualX2PointError = positive; return; }

			const range = this.rules.xPointRange(value);
			this.manualX2PointError = range === true ? '' : range;
		},

		cancelManualXPoints() {
			this.dialogManualXPoints = false;
			this.manualX1PointError = '';
			this.manualX2PointError = '';
		},

		confirmManualXPoints() {
			this.validateX1Point();
			this.validateX2Point();
			if (this.manualX1PointError || this.manualX2PointError) return;

			const x1Point = parseFloat(this.manualX1PointInput);
			const x2Point = parseFloat(this.manualX2PointInput);

			this.sendCode(`set global.posX1DrumES = ${x1Point}`);
			this.sendCode(`set global.posX2DrumES = ${x2Point}`);

			this.dialogManualXPoints = false;
		},


		//Validacion de caracteres por teclado
		handleKeydownManualInput(event) {
			const allowedKeys = [
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
			];

			// Permitir teclas de control
			if (allowedKeys.includes(event.key)) {
				// Obtener el valor actual y el valor seleccionado en el campo
				const input = event.target;
				const currentVal = input.value;
				const selectionStart = input.selectionStart;
				const selectionEnd = input.selectionEnd;

				// No permitir más de 5 caracteres si se intenta añadir uno nuevo
				const isCharKey = event.key.length === 1 && !['Backspace', 'Delete'].includes(event.key);

				// Si es punto, y ya hay uno, lo bloqueamos
				if (event.key === '.' && currentVal.includes('.')) {
					event.preventDefault();
					return;
				}

				if (isCharKey) {
					const newLength = 
						currentVal.length - (selectionEnd - selectionStart) + 1;
					if (newLength > 5) {
						event.preventDefault();
					}
				}
			} else {
				// Bloquear cualquier otra tecla no permitida
				event.preventDefault();
			}
		},
		openHeightDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualHeightInput = (this.alturaES).toString();
			this.manualHeightError = ''; // Limpia errores previos
			this.dialogManualHeight = true;
		},
		handleHeightKeyPress(key) {
			if (key === 'DEL') {
				this.manualHeightInput = this.manualHeightInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualHeightInput = '';
			} else {
				if (this.manualHeightInput.length < 3) { // Límite de 3 dígitos
					this.manualHeightInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateHeight();
		},
		validateHeight() {
			const value = this.manualHeightInput;

			const required = this.rules.required(value);
			if (required !== true) {
				this.manualHeightError = required;
				return;
			}

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) {
				this.manualHeightError = positive;
				return;
			}

			const range = this.rules.HeightRange(value);
			if (range !== true) {
				this.manualHeightError = range;
				return;
			}

			this.manualHeightError = '';
		},
		cancelManualHeight() {
			this.dialogManualHeight = false;
		},
		confirmManualHeight() {
			this.validateHeight();
			if (this.manualHeightError) return;

			const height = parseFloat(this.manualHeightInput);
		
			this.sendCode(`set global.alturaES = ${height}`);


			this.dialogManualHeight = false;
		},

		openLayersDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualLayersInput = (this.cadenceAmountES).toString();
			this.manualLayersError = ''; // Limpia errores previos
			this.dialogManualLayers = true;
		},
		handleLayersKeyPress(key) {
			if (key === 'DEL') {
				this.manualLayersInput = this.manualLayersInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualLayersInput = '';
			} else {
				if (this.manualLayersInput.length < 3) { // Límite de 3 dígitos
					this.manualLayersInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validateLayers();
		},
		validateLayers() {
			const value = this.manualLayersInput;

			const required = this.rules.required(value);
			if (required !== true) {
				this.manualLayersError = required;
				return;
			}

			const range = this.rules.LayersRange(value);
			if (range !== true) {
				this.manualLayersError = range;
				return;
			}

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) {
				this.manualLayersError = positive;
				return;
			}

			this.manualLayersError = '';
		},
		cancelManualLayers() {
			this.dialogManualLayers = false;
		},
		confirmManualLayers() {
			this.validateLayers();
			if (this.manualLayersError) return;

			const layers = parseFloat(this.manualLayersInput);
		
			this.sendCode(`set global.cadenceAmountES = ${layers}`);


			this.dialogManualLayers = false;
		},

	},	
	mounted() {
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
		this.$vuetify.goTo(0);
		if (this.patronES === 3) { 
			this.initializeCanvasAndGrid();
		} else if (this.patronES === 4) {
			this.initializeFreehandCanvas();
		}
		
	},
	
	watch: {
		bioColores() { // domotek: al cambiar de modo claro/oscuro se vuelven a pintar los lienzos
			this.$nextTick(() => { if (this.ctx) { this.drawGrid(); } if (this.$refs.freehandCanvas) { this.drawFreehandCanvas(); } });
		},
		patronES(newVal) {
			if (newVal === 3) {
				this.$nextTick(() => {
					this.initializeCanvasAndGrid();
				});
			} else if (newVal === 4) {
				this.$nextTick(() => {
					this.initializeFreehandCanvas();
				});
			}
		},
		// Otro cliente (PC / pantalla de la impresora) ha cambiado los puntos → recargar desde la impresora
		'$store.state.machine.model.global.esPointsRev'(newVal) {
			console.log('[ES-SYNC] cambio esPointsRev →', newVal, '(mia:', this.lastOwnPointsRev, ')');
			if (newVal === undefined || newVal === null || newVal === this.lastOwnPointsRev) return;
			if (this.patronES === 3) this.loadCustomPoints(false);
		},
		// Otro cliente ha cambiado el trazo FREEHAND → recargar desde la impresora
		'$store.state.machine.model.global.esPathRev'(newVal) {
			console.log('[ES-SYNC] cambio esPathRev →', newVal, '(mia:', this.lastOwnPathRev, ')');
			if (newVal === undefined || newVal === null || newVal === this.lastOwnPathRev || this.isDrawingFreehand) return;
			if (this.patronES === 4) this.loadFreehandPath();
		},
		// Al cerrar el canvas grande (boton o clic fuera) se vuelve a dibujar en el pequeño
		dialogFreehandBig(open) {
			if (!open) {
				if (this.isDrawingFreehand) this.handleFreehandPointerUp();
				this.attachFreehandCanvas(false);
			}
		},
		// Al salir del step 1.5 se guarda la lista de puntos (CUSTOM POINT) o el trazo (FREEHAND)
		pasos(newStep, oldStep) {
			if (oldStep === '1.5' && newStep !== '1.5' && this.patronES === 3) {
				this.saveCustomPoints();
			}
			if (oldStep === '1.5' && newStep !== '1.5' && this.patronES === 4) {
				this.saveFreehandPath();
			}
		}
		// (Eliminados los watchers de posxES / posyES: con multipunto provocarian que la lista se reseteara)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onWindowResize);
	},
	created() {
		
	},
	updated() {
		
	},
}
</script>
<style scoped>
/* Aquí va el estilo */
.btn-medium-custom {
  font-size: 1rem;
  padding: 10px 16px;
  min-height: 38px;
}


</style>
<style>
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
	/* Menos relleno en los pasos del stepper de este panel (evita el scroll vertical en la pantalla de la impresora) */
	.panelStepper .v-stepper__content {
		padding: 8px 12px 8px 12px !important;
	}
</style>
<template>
<div class="es-raiz">
	<!-- domotek: ultravioleta con el tema oscuro -->
	<div v-if="temaBio" class="bio-pp">
		<header class="bio-proc-cab">
			<button type="button" class="bio-volver" :aria-label="$t('domotek.tools.back')" @click="closeDialog"><v-icon>mdi-chevron-left</v-icon></button>
			<v-icon color="var(--bio-lila)">mdi-white-balance-sunny</v-icon>
			<span class="bio-proc-titulo">{{ $t('domotek.jobs.ultraviolet') }}</span>
			<div style="flex: 1"></div>
			<ol class="bio-cal-pasos">
				<li v-for="p in bioPasos" :key="p.id"><button type="button" :class="{ activo: pasos === p.id }" :aria-current="pasos === p.id ? 'step' : null" @click="CambiaStep(p.id)">{{ p.texto }}</button></li>
			</ol>
		</header>

		<!-- Resumen -->
		<main v-show="pasos === 'S'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.uvSettings') }}
				<span v-if="uvProbe" class="bio-proc-hv uv"><v-icon small color="var(--bio-lila)">mdi-flash</v-icon>{{ $t('panel.jobControl.warninguv') }}</span>
			</h2>
			<div class="bio-proc-datos">
				<div><span>{{ $t('domotek.proc.pattern') }}</span><strong>{{ bioNombrePatron }}<small v-if="patronUV == 2 && uvPointsCount > 1"> ({{ uvPointsCount }})</small></strong></div>
				<div><span>{{ $t('domotek.proc.height') }}</span><strong>{{ alturaUV }}<small> mm</small></strong></div>
				<div><span>{{ $t('domotek.proc.power') }}</span><strong>{{ potenciaUV }}<small> %</small></strong></div>
				<div><span>{{ $t('domotek.proc.time') }}</span><strong>{{ $display(exposicionUV / 60, 2) }}<small> min</small></strong></div>
			</div>
			<div class="bio-proc-lista">
				<div class="fila cab"><span>{{ $t('panel.ultraviolet.autoUvMode') }}</span><span class="pildora" :class="{ on: enableUV }">{{ enableUV ? $t('domotek.proc.on') : $t('domotek.proc.off') }}</span></div>
				<div class="fila" :class="{ tenue: !enableUV }"><span>{{ $t('panel.ultraviolet.applyBefore') }}</span><span>{{ firstLayerUV ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
				<div class="fila" :class="{ tenue: !enableUV }"><span>{{ $t('domotek.varios.applyEvery') }} {{ cadenceAmountUV }} {{ $t('domotek.varios.layers') }}</span><span>{{ cadenceEnableUV ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
				<div class="fila" :class="{ tenue: !enableUV }"><span>{{ $t('panel.ultraviolet.applyWhen') }}</span><span>{{ aplicarFinUV ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
			</div>
			<div class="bio-proc-avisos">
				<span v-if="ChamberMode" :class="{ off: enableDoorDetection }"><v-icon small>{{ enableDoorDetection ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline' }}</v-icon>{{ enableDoorDetection ? $t('domotek.varios.door_interlock_disabled') : $t('domotek.varios.door_interlock_enabled') }}</span>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')"><span class="bio-cap">{{ $t('domotek.varios.change') }}</span></button>
				<button type="button" class="bio-cal-sec listo" @click="StartSaveSettings()"><span class="bio-cap">{{ $t('domotek.varios.save') }}</span></button>
				<button v-if="isprinting == 'idle' || isprinting == 'paused'" type="button" class="bio-cal-principal ancho" @click="StartUltraviolet()">{{ $t('domotek.proc.run') }}</button>
				<button v-else type="button" class="bio-cal-principal ancho aviso" @click="StartUltravioletPausing()">{{ $t('domotek.proc.pauseAndRun') }}</button>
			</footer>
		</main>

		<!-- 1 · Patrón -->
		<main v-show="pasos === '1'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.pattern') }}</h2>
			<div class="bio-proc-patrones">
				<button v-for="pt in bioPatrones" :key="pt.id" type="button" class="bio-proc-patron" :class="{ activo: patronUV === pt.id }" :aria-pressed="patronUV === pt.id" @click="patronUV = pt.id">
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
		<main v-if="patronUV === 2" v-show="pasos === '1.5'" class="bio-proc-cuerpo">
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

		<!-- 1.5 · Trazo libre -->
		<main v-if="patronUV === 3" v-show="pasos === '1.5'" class="bio-proc-cuerpo">
			<div class="bio-proc-canvas-zona">
				<div class="bio-proc-lateral">
					<span class="bio-tenue"><strong class="bio-blanco">{{ strokes.length }}</strong> {{ $tc('domotek.proc.strokes', strokes.length) }}</span>
					<div class="bio-proc-puntos">
						<template v-for="(st, i) in strokes">
							<button v-if="isClosedStroke(st)" :key="i" type="button" class="bio-proc-relleno" @click="toggleStrokeFill(i)">
								<span class="n">{{ i + 1 }}</span><span>{{ $t('panel.ultraviolet.fillArea') }}</span>
								<span class="interruptor" :class="{ on: strokeFill[i] }"><i></i></span>
							</button>
						</template>
					</div>
					<span class="bio-tenue bio-proc-ayuda">{{ $t('panel.ultraviolet.ultravioletDrawPathHelp') }}</span>
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
				<button type="button" @click="openHeightDialog"><span class="ic verde"><v-icon>mdi-arrow-up-down</v-icon></span><span>{{ $t('domotek.proc.height') }}</span><strong>{{ alturaUV }}<small> mm</small></strong></button>
				<button type="button" @click="openPowerDialog"><span class="ic lila"><v-icon>mdi-lightbulb-on-outline</v-icon></span><span>{{ $t('domotek.proc.power') }}</span><strong>{{ potenciaUV }}<small> %</small></strong></button>
				<button type="button" @click="openTimeDialog"><span class="ic azul"><v-icon>mdi-timer-outline</v-icon></span><span>{{ $t('domotek.proc.exposure') }}</span><strong>{{ $display(exposicionUV / 60, 2) }}<small> min</small></strong></button>
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
					<span><strong>{{ $t('panel.ultraviolet.autoUvMode') }}</strong><small>{{ $t('domotek.proc.appliesDuringPrint') }}</small></span>
					<button type="button" class="interruptor" :class="{ on: enableUV }" role="switch" :aria-checked="!!enableUV" @click="enableUV = !enableUV"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableUV }">
					<span>{{ $t('panel.ultraviolet.applyBefore') }}</span>
					<button type="button" class="interruptor" :class="{ on: firstLayerUV }" role="switch" :aria-checked="!!firstLayerUV" :disabled="!enableUV" @click="firstLayerUV = !firstLayerUV"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableUV }">
					<span>{{ $t('domotek.varios.applyEvery') }}</span>
					<div class="bio-proc-contador">
						<button type="button" :disabled="!enableUV || cadenceAmountUV <= Math.max(1, minCadenceAmountUV)" @click="cadenceAmountUV = cadenceAmountUV - 1">−</button>
						<button type="button" class="valor" :disabled="!enableUV" @click="openLayersDialog"><strong>{{ cadenceAmountUV }}</strong> {{ $t('domotek.varios.layers') }}</button>
						<button type="button" :disabled="!enableUV || cadenceAmountUV >= maxCadenceAmountUV" @click="cadenceAmountUV = cadenceAmountUV + 1">+</button>
					</div>
					<button type="button" class="interruptor" :class="{ on: cadenceEnableUV }" role="switch" :aria-checked="!!cadenceEnableUV" :disabled="!enableUV" @click="cadenceEnableUV = !cadenceEnableUV"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableUV }">
					<span>{{ $t('panel.ultraviolet.applyWhen') }}</span>
					<button type="button" class="interruptor" :class="{ on: aplicarFinUV }" role="switch" :aria-checked="!!aplicarFinUV" :disabled="!enableUV" @click="aplicarFinUV = !aplicarFinUV"><i></i></button>
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
							<v-img  src="@/assets/uv-ray.svg" contain max-height="40" max-width="40"></v-img>
					</v-btn>
					<v-stepper-step editable step="S"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="1"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<!-- Step 1.5 solo si el patron elegido es CUSTOM POINT (2) o FREEHAND (3) -->
					<v-stepper-step
						v-if="patronUV === 2 || patronUV === 3"
						editable
						step="1.5"
						color="#0a21ad"
						class="Stephead_step"
					/>
					<v-divider v-if="patronUV === 2 || patronUV === 3"/>
					<v-stepper-step editable step="2"  color="#0a21ad" class="Stephead_step" />
					<v-divider/>
					<v-stepper-step editable step="3"  color="#0a21ad" class="Stephead_step" />
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>

				<!-- STEP 1 → Selector de patron (ALL PLATFORM / CUSTOM POINT / FREEHAND) -->
				<v-stepper-items>
					<v-stepper-content step="1">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 text-center">{{ $t('panel.ultraviolet.ultravioletPattern') }}</p>
								<v-col cols="12" align="center">
									<v-btn-toggle id="selectorPatt" class="blue lighten-4" v-model="patronUV" color="teal" mandatory>
										<v-row>
											<v-col cols="12" align="center" class="blue lighten-4" >
												<v-btn :value="1" active-class="teal lighten-3" class=" ma-1 blue lighten-5" rounded> {{ $t('domotek.varios.allPlatform') }}</v-btn>
												<v-btn :value="2" active-class="teal lighten-3" class=" ma-1 blue lighten-5" rounded>{{ $t('domotek.varios.customPoint') }}</v-btn>
												<v-btn :value="3" active-class="teal lighten-3" class=" ma-1 blue lighten-5" rounded>{{ $t('domotek.varios.freehand') }}</v-btn>
											</v-col>
										</v-row>
									</v-btn-toggle>
								</v-col>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('S')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" 	 color="primary" @click="handleContinue"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>

				<!-- STEP 1.5 → Cuadricula de CUSTOM POINT MULTIPUNTO (solo si patronUV === 2) -->
				<v-stepper-items>
					<v-stepper-content step="1.5" v-if="patronUV === 2">
						<v-card class="mb-0 blue lighten-5" :height="panelCardPx">
							<v-card outlined class="blue lighten-4 d-flex flex-column" :height="panelCardPx - 20">
							
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center"> {{ $t('panel.ultraviolet.ultravioletSelectPoint') }} </p>
								
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
										<div style="display: flex; flex-direction: column; align-items: center;">
											<div style="display: flex; align-items: flex-end; gap: 5px;">
												<span style="writing-mode: vertical-rl; transform: rotate(180deg); font-weight: bold; font-size: 0.9em; letter-spacing: 1px; margin-bottom: 100px;">{{ $t('domotek.varios.ejeY') }}</span>
												<div style="display: flex; flex-direction: column; align-items: center;">
													<!-- Canvas -->
													<canvas ref="gridCanvas" :width="canvasSizePx" :height="canvasSizePx" @click="handleCanvasClick" style="border: 1px solid #999; cursor: crosshair; background-color: white;"></canvas>
													<div style="width: 100%; margin-top: 5px; display: flex; justify-content: center; position: relative;">
														<span style="position: absolute; left: 0; bottom: 0; font-weight: bold; font-size: 0.8em; color: #333;">(0,0)</span>
														<span style="font-weight: bold; font-size: 0.9em; letter-spacing: 1px;">{{ $t('domotek.varios.ejeX') }}</span>
													</div>
												</div>
											</div>
										</div>
										<!-- Contenedor para botones a la derecha del canvas -->
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
						
								
								<div class="text-center pb-2 pt-1 mt-auto">
									<v-btn class="btnContinue mr-4" color="primary" @click="CambiaStep('1')">
										<v-icon dark left> mdi-arrow-left-bold-outline </v-icon> 
										{{ $t('domotek.toolNames.BACK') }}
									</v-btn>
									<v-btn class="btnContinue" color="primary" @click="CambiaStep('2')" :disabled="!isPointSelected">
										{{ $t('domotek.toolNames.CONTINUE') }} 
										<v-icon dark right> mdi-arrow-right-bold-outline </v-icon>
									</v-btn> 
								</div>
							</v-card>
						</v-card>

						<!-- DIÁLOGO PARA ENTRADA MANUAL DE COORDENADAS -->
					</v-stepper-content>
				</v-stepper-items>

				<!-- STEP 1.5 → Trazo libre FREEHAND (solo si patronUV === 3) -->
				<v-stepper-items>
					<v-stepper-content step="1.5" v-if="patronUV === 3">
						<v-card class="mb-0 blue lighten-5" :height="panelCardPx">
							<v-card outlined class="blue lighten-4 d-flex flex-column" :height="panelCardPx - 20">

								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-2 text-center"> {{ $t('panel.ultraviolet.ultravioletDrawPath') }} </p>
								<p class="text-center mb-2" style="font-size: 0.85rem;"> {{ $t('panel.ultraviolet.ultravioletDrawPathHelp') }} </p>

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
													<span style="white-space:nowrap;">{{ $t('panel.ultraviolet.fillArea') }}</span>
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

				<!-- STEP 2 → Altura / Potencia / Tiempo (antes era el STEP "1") -->
				<v-stepper-items>
					<v-stepper-content step="2">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px">

								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">	{{ $t('panel.ultraviolet.ultravioletParams') }}	</p>

								<span class="px-2 subtitle-2" :class="statusClass">
									{{ statusText }}
								</span>
								<v-row justify="center" style="height:60px;">  		
									<v-col cols="12" md="8">
										<v-btn x-large outlined color="#1976d2" @click="openHeightDialog" >
											<v-icon left>mdi-ruler</v-icon>		
											<span class="subtitle-1">
												{{ $t('panel.jobInfo.height') }}<span class="font-weight-bold">{{ alturaUV }}</span> {{ $t('panel.settingsAppearance.unitMm') }}
											</span>
										</v-btn>
									</v-col>
								</v-row>
								<v-row justify="center" style="height:60px;">  
									<v-col cols="12" md="8">
										<v-btn x-large outlined color="#1976d2" @click="openPowerDialog" >
											<v-icon left>mdi-lightbulb-on-outline</v-icon>
											<span class="subtitle-1">
												{{ $t('panel.ultraviolet.power') }}<span class="font-weight-bold">{{ potenciaUV }}</span> {{ $t('panel.ultraviolet.percent') }}</span>
											
										</v-btn>
									</v-col>
								</v-row>
								<v-row justify="center" style="height:60px;">  
									<v-col cols="12" md="8">
										<v-btn x-large outlined color="#1976d2" @click="openTimeDialog" >
											<v-icon left>mdi-timer-outline</v-icon>
											<span class="subtitle-1">
											{{ $t('panel.ultraviolet.time') }}<span class="font-weight-bold">{{ (exposicionUV / 60).toFixed(2) }}</span> {{ $t('domotek.varios.min') }}
											</span>
										</v-btn>
									</v-col>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="handleBack"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10 "  color="primary" @click="CambiaStep('3')"> {{ $t('domotek.toolNames.CONTINUE') }} <v-icon dark right> mdi-arrow-right-bold-outline </v-icon></v-btn> 
						</v-card>


					</v-stepper-content>
				</v-stepper-items>

				<!-- STEP 3 → Modo automatico / cadencia (sin cambios) -->
				<v-stepper-items>
					<v-stepper-content step="3">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">	{{ $t('panel.ultraviolet.ultravioletParams') }}	</p>
								
								<v-row style="height:40px;margin-left:40px;">  
									<v-checkbox v-model="enableUV" :label="$t('panel.ultraviolet.autoUvMode')"  class="etiqueta align-center justify-center"></v-checkbox>		
								</v-row>
								<v-row style="height:40px;margin-left:140px;">  
									<v-checkbox :disabled="!enableUV" v-model="firstLayerUV" :label="$t('panel.ultraviolet.applyBefore')"  class="etiqueta align-center justify-center"></v-checkbox>	
								</v-row>
								<v-row style="height:62px;margin-left:128px;">  
										<v-col cols=5 >
											<v-checkbox :disabled="!enableUV" v-model="cadenceEnableUV" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountUV + ' ' + $t('domotek.varios.layers')"  class="etiqueta align-center justify-center"></v-checkbox>	
										</v-col>
										<v-col cols=6 v-show="enableUV">
											<v-btn x-large outlined color="#1976d2" @click="openLayersDialog" >
												<v-icon left>mdi-layers</v-icon>
												<span class="subtitle-1">
													<span class="font-weight-bold">{{ cadenceAmountUV}}</span> {{ $t('domotek.varios.layers') }}
												</span>
											</v-btn>
										</v-col>
								</v-row>
								<v-row style="height:40px;margin-left:140px;">  
									<v-checkbox :disabled="!enableUV" v-model="aplicarFinUV" :label="$t('panel.ultraviolet.applyWhen')"  class="etiqueta align-center justify-center"></v-checkbox>								
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('2')"> <v-icon dark left> mdi-arrow-left-bold-outline </v-icon> {{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10"  color="primary" @click="CambiaStep('S')"> {{ $t('domotek.varios.settings') }} <v-icon dark right> mdi-cog </v-icon></v-btn> 
						</v-card>
					</v-stepper-content>
				</v-stepper-items>

				<!-- STEP S → Resumen / Ajustes -->
				<v-stepper-items>
					<v-stepper-content step="S">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card id="vcselectorSyr" outlined class="blue lighten-4" :style="{ minHeight: (panelCardPx - 100) + 'px' }">
								
								<p class="text-center mt-2 mb-0" style="font-size: 1.3rem; font-weight:bold;">
								{{ $t('panel.ultraviolet.ultravioletSettings') }}
								</p>

								<template v-if="uvProbe">
									<v-icon large style="color: yellow;" mr-1>mdi-flash</v-icon>
									<span style="color:red;"><strong>{{ $t('panel.jobControl.warninguv') }}</strong></span>
									<v-icon large style="color: yellow;" mr-1>mdi-flash</v-icon>
								</template>

								<v-row style="height:50px;" class="ma-0 mt-2">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<v-checkbox readonly v-model="enableUV" :label="$t('panel.ultraviolet.autoUvMode')"></v-checkbox>
									</v-col>
								</v-row>

								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<v-checkbox readonly :disabled="!enableUV" v-model="firstLayerUV" :label="$t('panel.ultraviolet.applyBefore')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
								</v-row>

								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<v-checkbox readonly :disabled="!enableUV" v-model="cadenceEnableUV" :label="$t('domotek.varios.applyEvery') + ' ' + cadenceAmountUV + ' ' + $t('domotek.varios.layers')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
								</v-row>

								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<v-checkbox readonly :disabled="!enableUV" v-model="aplicarFinUV" :label="$t('panel.ultraviolet.applyWhen')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
								</v-row>

								<v-row style="height:60px;" class="ml-5 mr-5 mt-0">
									<v-col cols="2" sm="0" md="3" lg="3" xl="3"></v-col>
									<v-col cols="1" sm="12" md="6" lg="6" xl="6">
										<v-row class="mt-2" align="center" justify="center">
											<v-btn v-show="patronUV == 1" class="ma-1 teal lighten-3 text-none btnInfo"><strong>{{ $t('domotek.varios.allPlatform') }}</strong></v-btn>
											<v-btn v-show="patronUV == 2" class="ma-1 teal lighten-3 text-none btnInfo"><strong>{{ $t('domotek.varios.customPoint') }}</strong><span v-if="uvPointsCount > 1">&nbsp;({{ uvPointsCount }})</span></v-btn>
											<v-btn v-show="patronUV == 3" class="ma-1 teal lighten-3 text-none btnInfo"><strong>{{ $t('domotek.varios.freehand') }}</strong></v-btn>
											<v-btn v-if="alturaUV > 0" class="ma-1 teal lighten-3 text-none btnInfo">
												<strong>{{alturaUV}}</strong> {{ $t('panel.settingsAppearance.unitMm') }}
											</v-btn>
											<v-btn v-if="potenciaUV > 0" class="ma-1 teal lighten-3 text-none btnInfo">
												<strong>{{potenciaUV}}</strong> {{ $t('panel.ultraviolet.resumeUvPower') }}
											</v-btn>
											<v-btn v-if="exposicionUV > 0" class="ma-1 teal lighten-3 text-none btnInfo">
												<strong>{{ (exposicionUV / 60).toFixed(2) }}</strong> {{ $t('domotek.varios.min') }}
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
										</v-row>
									</v-col>
								</v-row>
							</v-card>

							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings();" rounded>
								{{ $t('domotek.varios.save') }} <v-icon class="mr-1">mdi-floppy</v-icon>
							</v-btn>
							<v-btn v-if="isprinting == 'idle' || isprinting == 'paused'" class="btnContinue mt-10 mr-5" color="green white--text" @click="StartUltraviolet();" rounded>
								{{ $t('domotek.varios.runOnce') }}
							</v-btn>
							<v-btn v-if="isprinting != 'idle' && isprinting != 'paused'" class="btnContinue mt-10 mr-5" color="#fb8c00" @click="StartUltravioletPausing();" rounded>
								{{ $t('domotek.varios.runOnce') }}
							</v-btn>
							<v-btn class="btnContinue mt-10" color="primary" @click="CambiaStep('1')">
								{{ $t('domotek.varios.change') }} <v-icon dark right>mdi-wrench-outline</v-icon>
							</v-btn>
						</v-card>

					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
			<!-- Dialogos y aviso dentro de la misma columna: asi no crean filas vacias que alargan el panel -->
		</v-col>
	</v-row>
	<!-- diálogos compartidos por las dos vistas -->
						<v-dialog v-model="dialogManualCoords" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualCoords" :titulo="$t('panel.ultraviolet.manualEditCoordsTittle')" icono="mdi-crosshairs-gps" color="lila" unidad="mm" :campos="[{ id: 'x', etiqueta: 'X', valor: manualX, error: manualXError }, { id: 'y', etiqueta: 'Y', valor: manualY, error: manualYError }]" :activo="activeManualInput" :rango="$t('domotek.keypad.coordRange', [minCoord, maxCoord])" :atajos="[{ valor: 'centro', texto: $t('domotek.varios.center', 'Centro') }]" @activar="id => activeManualInput = id" @tecla="handleKeyPress" @atajo="() => { manualX = String(Math.round(maxCoord / 2)); manualY = String(Math.round(maxCoord / 2)); manualXError = ''; manualYError = ''; }" @aceptar="confirmManualInput" @cancelar="cancelManualInput"></bio-teclado-valor>
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
												<v-col v-for="key in row" :key="key.value" class="pa-1">
													<v-btn v-if="key.value !== 'EMPTY'" block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'"  @click="handleKeyPress(key.value)" >
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
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualHeight" :titulo="$t('domotek.proc.height')" icono="mdi-arrow-up-down" color="acento" :valor="manualHeightInput" unidad="mm" :error="manualHeightError" :actual="alturaUV" :permitido="`${minAlturaUV} – ${maxAlturaUV} mm`" :rango="$t('domotek.keypad.rangeGeneric', [minAlturaUV, maxAlturaUV, 'mm'])" :decimales="false" :atajos="[20, 40, 60, 80].filter(v => v >= minAlturaUV && v <= maxAlturaUV).map(v => ({ valor: v }))" @tecla="handleHeightKeyPress" @atajo="v => { manualHeightInput = String(v); validateHeight(); }" @aceptar="confirmManualHeight" @cancelar="cancelManualHeight"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('domotek.varios.exposureheightMm') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<!-- Campo de texto único para la altura -->
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualHeightInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.HeightRange]" :error-messages="manualHeightError"></v-text-field>
											</v-col>
										</v-row>

										<!-- Teclado Numérico Personalizado -->
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
						<v-dialog v-model="dialogManualPower" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualPower" :titulo="$t('domotek.proc.power')" icono="mdi-lightbulb-on-outline" color="lila" :valor="manualPowerInput" unidad="%" :error="manualPowerError" :actual="potenciaUV" :permitido="`${minPotenciaUV} – ${maxPotenciaUV} %`" :rango="$t('domotek.keypad.rangeGeneric', [minPotenciaUV, maxPotenciaUV, '%'])" :decimales="false" :atajos="[25, 50, 75, 100].map(v => ({ valor: v }))" @tecla="handlePowerKeyPress" @atajo="v => { manualPowerInput = String(v); validatePower(); }" @aceptar="confirmManualPower" @cancelar="cancelManualPower"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('panel.ultraviolet.UvPower') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<!-- Campo de texto único para la potencia -->
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualPowerInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.PowerRange]" :error-messages="manualPowerError"></v-text-field>
											</v-col>
										</v-row>

										<!-- Teclado Numérico Personalizado -->
										 <div class="numeric-keypad text-center">
											<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
												<v-col v-for="key in row" :key="key.value" class="pa-1">
												<template v-if="key.value !== 'EMPTY'">
													<v-btn block class ="btn-medium-custom" :color="key.color || 'grey lighten-2'" @click="handlePowerKeyPress(key.value)">
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
									<v-btn color="blue darken-1" text @click="cancelManualPower">
										{{ $t('generic.cancel') }}
									</v-btn>
									<v-btn color="blue darken-1" text @click="confirmManualPower" :disabled="!!manualPowerError || !manualPowerInput">
										{{ $t('generic.ok') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogManualTime" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualTime" :titulo="$t('domotek.proc.exposure')" icono="mdi-timer-outline" color="azul" :valor="manualTimeInput" unidad="min" :error="manualTimeError" :actual="$display(exposicionUV / 60, 2)" :permitido="`${minExposureTimeUV} – ${maxExposureTimeUV} min`" :rango="$t('domotek.keypad.rangeGeneric', [minExposureTimeUV, maxExposureTimeUV, 'min'])" :atajos="[0.5, 1, 2, 5].map(v => ({ valor: v, texto: $display(v, v % 1 ? 1 : 0) }))" @tecla="handleTimeKeyPress" @atajo="v => { manualTimeInput = String(v); validateTime(); }" @aceptar="confirmManualTime" @cancelar="cancelManualTime"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{ $t('domotek.varios.exposureTimeM') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<!-- Campo de texto único para el tiempo -->
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualTimeInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.positiveNumber, rules.TimeRange]" :error-messages="manualTimeError"></v-text-field>
											</v-col>
										</v-row>

										<!-- Teclado Numérico Personalizado -->
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
							<bio-teclado-valor v-if="temaBio" :abierto="dialogManualLayers" :titulo="$t('domotek.varios.Layers')" icono="mdi-layers-outline" color="acento" :valor="manualLayersInput" :error="manualLayersError" :actual="cadenceAmountUV" :permitido="`${Math.max(1, minCadenceAmountUV)} – ${maxCadenceAmountUV}`" :rango="$t('domotek.keypad.rangeGeneric', [Math.max(1, minCadenceAmountUV), maxCadenceAmountUV, $t('domotek.varios.layers')])" :decimales="false" :atajos="[1, 2, 3, 5].map(v => ({ valor: v }))" @tecla="handleLayersKeyPress" @atajo="v => { manualLayersInput = String(v); validateLayers(); }" @aceptar="confirmManualLayers" @cancelar="cancelManualLayers"></bio-teclado-valor>
							<v-card v-else>
								<v-card-title class="justify-center text-center">
									<span class="headline">{{  $t('domotek.varios.Layers') }} </span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container>
										<!-- Campo de texto único para la cantidad de capas -->
										<v-row justify="center">
											<v-col cols="12" class="py-1">
												<v-text-field v-model="manualLayersInput" @keydown="handleKeydownManualInput"  outlined class="title text-center font-weight-bold" :rules="[rules.required, rules.LayersRange]" :error-messages="manualLayersError"></v-text-field>
											</v-col>
										</v-row>

										<!-- Teclado Numérico Personalizado -->
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
			<v-dialog v-model="dialogUV" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV = false" outlined rounded>
									<code-btn width="120" height="48" :code='`${codigo}`' :log="false" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }}
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="dialogUV_SAV" max-width="500">
				<v-card>
					<v-card-title class="headline">
						{{ $t(nombreMacro) }}
					</v-card-title>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="center">
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV_SAV = false" outlined rounded>
									<code-btn width="120" height="48" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col cols="6" align="center"> 
								<v-btn width="120" height="48" color="green darken-1" text @click="dialogUV_SAV = false" outlined rounded>
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
			dialogUV: false,
			codigo:null,
			nombreMacro: null,
			pasos: 'S',
			rutaMacro: '',
			codigoExp: '',
			param1Macro: '',
			param2Macro: '',
			param3Macro: '',
			dialogUV_SAV: false,
			maxAlturaUV:120,
			minAlturaUV:20,
			maxPotenciaUV:100,
			minPotenciaUV:0,
			maxExposureTimeUV:120,
			minExposureTimeUV:0.1,
			maxCadenceAmountUV:10,
			minCadenceAmountUV:0,
			benched: 0,
			selectedItem: 5,
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
			lastSavedPointsSignature: '[]',
			lastOwnPointsRev: null,		// ultima revision escrita por ESTE cliente (para ignorar su propio eco)
			lastOwnPathRev: null,
			savePointsTimer: null,
			saveFreehandTimer: null,	// para no reescribir el fichero si la lista no ha cambiado
			// --- FREEHAND (trazo libre) ---
			strokes: [],			// array de sub-trazos; cada uno es un array de {x, y} en mm
			currentStroke: [],		// puntos del sub-trazo que se esta dibujando ahora mismo (en mm)
			isDrawingFreehand: false,
			minSegmentDistanceMm: 2,	// simplificacion: descarta puntos a menos de esta distancia del anterior
			freehandCtx: null,
			lastSavedFreehandSignature: '{"s":[],"f":[]}',
			strokeFill: [],			// paralelo a strokes: true = rellenar el area de esa figura (solo si esta cerrada)
			fillSpacingMm: 5,		// separacion entre lineas del relleno [mm] (ajustar al ancho util de la lampara)
			closeToleranceMm: 6,		// tolerancia MINIMA de cierre [mm]
			closeToleranceRel: 0.15,	// la tolerancia crece con la figura: 15% de su diagonal...
			closeToleranceMaxMm: 15,	// ...hasta un maximo de 15 mm
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
			dialogManualHeight: false,
			manualHeightInput: '',
			manualHeightError: '',
			dialogManualPower: false,
			manualPowerInput: '',
			manualPowerError: '',
			dialogManualTime: false,
			manualTimeInput: '',
			manualTimeError: '',
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
				required: value=>value !== null && value !== undefined && value !== ''|| this.$t('domotek.varios.valorRequerido'),
				positiveNumber: value => {
					const num = Number(value);
					return !isNaN(num) && num >= 0 || this.$t('domotek.varios.numeroPositivo');
				},
				HeightRange: value => {
					if (value === '' || value === null) return true;

					const num = parseFloat(value);
					if (isNaN(num) || num < this.minAlturaUV || num > this.maxAlturaUV) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
							min: this.minAlturaUV,
							max: this.maxAlturaUV,
							val: value
						});
					}

					return true;
				},
				PowerRange: value => {
					if (value === '' || value === null) return true;

					const num = parseFloat(value);
					if (isNaN(num) || num < this.minPotenciaUV || num > this.maxPotenciaUV) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
							min: this.minPotenciaUV,
							max: this.maxPotenciaUV,
							val: value
						});
					}

					return true;
				},
				TimeRange: value => {
					if (value === '' || value === null) return true;

					const num = parseFloat(value);
					if (isNaN(num) || num < this.minExposureTimeUV || num > this.maxExposureTimeUV) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
							min: this.minExposureTimeUV,
							max: this.maxExposureTimeUV,
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
					if (num < this.minCadenceAmountUV || num > this.maxCadenceAmountUV) {
						return this.$t('panel.ultraviolet.rangeErrorDetailed', {
						min: this.minCadenceAmountUV,
						max: this.maxCadenceAmountUV,
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

		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioColores() { // colores de los lienzos según el tema (oscuro o claro)
			const c = paletaBio();
			return this.temaBio
				? { rejilla: c.linea, borde: c.linea2, punto: c.lila, puntoEdit: c.amarillo, puntoBorde: c.lilaBg, texto: c.texto, trazo: c.lila, relleno: `rgba(${c.lilaRgb},0.18)`, rayado: `rgba(${c.lilaRgb},0.45)`, cierra: c.verde, cierraFondo: `rgba(${c.verdeRgb},0.22)`, zona: c.zona, abierto: c.peligro }
				: { rejilla: '#ddd', borde: '#999', punto: 'red', puntoEdit: '#1976d2', puntoBorde: 'darkred', texto: '#000', trazo: '#1976d2', relleno: 'rgba(25,118,210,0.22)', rayado: 'rgba(25,118,210,0.55)', cierra: '#2e7d32', cierraFondo: 'rgba(46,125,50,0.25)', zona: 'rgba(0,0,0,0.06)', abierto: 'red' };
		},
		bioPasos() {
			const lista = [{ id: 'S', texto: this.$t('domotek.proc.summary') }, { id: '1', texto: `1 · ${this.$t('domotek.proc.pattern')}` }];
			if (this.patronUV === 2) { lista.push({ id: '1.5', texto: `1.5 · ${this.$t('domotek.proc.pointsStep')}` }); }
			if (this.patronUV === 3) { lista.push({ id: '1.5', texto: `1.5 · ${this.$t('domotek.proc.strokeStep')}` }); }
			lista.push({ id: '2', texto: `2 · ${this.$t('domotek.proc.params')}` }, { id: '3', texto: '3 · Auto' });
			return lista;
		},
		bioPatrones() {
			const ico = {
				1: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><rect x="11" y="11" width="26" height="26" rx="3" fill="currentColor" opacity=".25"/></svg>',
				2: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="19" r="4" fill="currentColor"/><circle cx="31" cy="15" r="4" fill="currentColor"/><circle cx="26" cy="32" r="4" fill="currentColor"/></svg>',
				3: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 32c4-10 8-12 11-8s6 4 13-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
			};
			return [
				{ id: 1, nombre: this.$t('domotek.varios.allPlatform'), desc: this.$t('domotek.proc.fullSweep') },
				{ id: 2, nombre: this.$t('domotek.varios.customPoint'), desc: this.$t('domotek.proc.pointsDesc') },
				{ id: 3, nombre: this.$t('domotek.varios.freehand'), desc: this.$t('domotek.proc.freehandDesc') }
			].map(p => ({ ...p, svg: ico[p.id] }));
		},
		bioNombrePatron() {
			const p = { 1: 'allPlatform', 2: 'customPoint', 3: 'freehand' }[this.patronUV];
			return p ? this.$t('domotek.varios.' + p) : '—';
		},
		patronUV: {
			get() {
				return this.$store.state.machine.model.global.patronUV},
			set(value){
				this.sendCode(`set global.patronUV = ${value}`);
			}
		},
		
		alturaUV: {
			get() {
				const valor_alturaUV = this.$store.state.machine.model.global.alturaUV;
				return (valor_alturaUV);
			},
			set(value) {
				this.sendCode(`set global.alturaUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;

			}
		},
		potenciaUV: {
			get() {
				const valor_potenciaUV=this.$store.state.machine.model.global.potenciaUV;
				return valor_potenciaUV},
			set(value){
				this.sendCode(`set global.potenciaUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;

			}
		},
		exposicionUV: {
			get() {
				return this.$store.state.machine.model.global.exposicionUV},
			set(value){
				this.sendCode(`set global.exposicionUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;
			}			
			

		},
		aplicarFinUV: {
			get() {
				return this.$store.state.machine.model.global.aplicarFinUV},
			set(value){
				this.sendCode(`set global.aplicarFinUV = ${value}`);
			}			
		},
		enableUV: {
			get() {
				return this.$store.state.machine.model.global.enableUV},
			set(value){
				this.sendCode(`set global.enableUV = ${value}`);
			}			
		},
		firstLayerUV: {
			get() {
				return this.$store.state.machine.model.global.firstLayerUV},
			set(value){
				this.sendCode(`set global.firstLayerUV = ${value}`);
			}			
		},
		cadenceEnableUV: {
			get() {
				return this.$store.state.machine.model.global.cadenceEnableUV},
			set(value){
				this.sendCode(`set global.cadenceEnableUV = ${value}`);
			}			
		},
		cadenceAmountUV: {
			get() {
				return this.$store.state.machine.model.global.cadenceAmountUV},
			set(value){
				this.sendCode(`set global.cadenceAmountUV = ${value}`);
				this.snackbar = true;
				this.snackbarValor = value;
			}			
		},
		posxUV: {
			get() {
				return this.$store.state.machine.model.global.posxUV},
			set(value){
				this.sendCode(`set global.posxUV = ${value}`);
			}			
		},
		posyUV: {
			get() {
				return this.$store.state.machine.model.global.posyUV},
			set(value){
				this.sendCode(`set global.posyUV = ${value}`);
			}			
		},
		uvPointsCount() {
			// Numero de puntos guardados en la impresora (para el resumen)
			const n = this.$store.state.machine.model.global.uvPointsCount;
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

		isprinting: {
			get() {
				return this.$store.state.machine.model.state.status},
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
		}
	

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
			// El step 1.5 lo comparten CUSTOM POINT (2) y FREEHAND (3)
			if (this.pasos === '1.5' && this.patronUV === 2) {
				this.saveCustomPoints();
			}
			if (this.pasos === '1.5' && this.patronUV === 3) {
				this.saveFreehandPath();
			}
			this.$emit('close-dialog');
		},
		StartSaveSettings(){
			this.dialogUV_SAV = true;
			console.info(`Grabamos config UV`);
			this.nombreMacro = this.$t('domotek.varios.confirm_settings');
			this.codigo = '';
			this.codigo += 'M28 "/sys/declare_variablesUV.g"' + '\n';
			this.codigo += "set global.variablesUV = 1"+ '\n';
			this.codigo += "set global.patronUV = "+ this.$store.state.machine.model.global.patronUV + '\n';
			this.codigo += "set global.alturaUV = "+ this.$store.state.machine.model.global.alturaUV + '\n';
			this.codigo += "set global.potenciaUV = "+ this.$store.state.machine.model.global.potenciaUV + '\n';
			this.codigo += "set global.exposicionUV = "+ this.$store.state.machine.model.global.exposicionUV + '\n';
			this.codigo += "set global.aplicarFinUV = "+ this.$store.state.machine.model.global.aplicarFinUV + '\n';
			this.codigo += "set global.enableUV = "+ this.$store.state.machine.model.global.enableUV + '\n';
			this.codigo += "set global.firstLayerUV = "+ this.$store.state.machine.model.global.firstLayerUV + '\n';
			this.codigo += "set global.cadenceEnableUV = "+ this.$store.state.machine.model.global.cadenceEnableUV + '\n';
			this.codigo += "set global.cadenceAmountUV = "+ this.$store.state.machine.model.global.cadenceAmountUV + '\n';
			this.codigo += " "+"set global.posxUV = "+ this.$store.state.machine.model.global.posxUV + '\n';
			this.codigo += " "+"set global.posyUV = "+ this.$store.state.machine.model.global.posyUV + '\n';
			// Persistir el trazo FREEHAND (si hay uno guardado), para que sobreviva a un reinicio
			// (los movimientos del trazo ya estan en la SD: UVFreehandPath.g; solo persistimos su longitud)
			const pathLength = this.$store.state.machine.model.global.uvPathLength;
			if (pathLength !== undefined && pathLength !== null) {
				this.codigo += "set global.uvPathLength = "+ pathLength + '\n';
			}
			// Persistir el numero de puntos de CUSTOM POINT (los movimientos ya estan en la SD: UVCustomPoints.g)
			const nPts = this.$store.state.machine.model.global.uvPointsCount;
			if (nPts !== undefined && nPts !== null) {
				this.codigo += "set global.uvPointsCount = "+ nPts + '\n';
			}
			this.codigo += 'M29' + '\n';
		},
		StartUltraviolet(){
			this.dialogUV = true;
			console.info(`Run once UV`);
			this.nombreMacro = this.$t('domotek.varios.confirm_UV');
			//this.codigo = 'M98 P"/macros/Scripts/UVMacro.g"';
			this.codigo ='M32 "/gcodes/Admin/runOnce_UVMacro.g"';
		},
		StartUltravioletPausing(){
			this.dialogUV = true;
			console.info(`Run once UV`);
			this.nombreMacro = this.$t('panel.ultraviolet.uvJobInProgress');
			//this.codigo = 'M25'+'\n'+'M98 P"/macros/Scripts/UVMacro.g"'+'\n'+'M24';
			this.codigo = 'M25'+'\n'+'M32 "/gcodes/Admin/runOnce_UVMacro.g"'+'\n'+'M24';

		},
		onWindowResize() {
			this.windowHeight = window.innerHeight;
		},
		CambiaStep(newStep){
			this.pasos = newStep;
		},
		handleContinue() {
			if (this.patronUV === 2 || this.patronUV === 3) {
				this.CambiaStep('1.5');
			} else {
				this.CambiaStep('2');
			}
		},
		handleBack() {
			if (this.patronUV === 2 || this.patronUV === 3) {
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
				console.log('[UV-SYNC] download', filename, '→', typeof res, (typeof res === 'string') ? res.length + ' bytes' : res);
				return (typeof res === 'string') ? res : '';
			} catch (e) {
				console.error('[UV-SYNC] ERROR descargando', filename, e);
				return '';
			}
		},
		// Devuelve un id de revision unico (entero < 2^31) para avisar a los demas clientes de un cambio
		newRevision() {
			return Math.floor(Date.now() % 2000000000);
		},
		parsePointsFile(text) {
			const pts = [];
			const re = /^\s*G1\s+X(-?[\d.]+)\s+Y(-?[\d.]+)/i;
			text.split(/\r?\n/).forEach(line => {
				const m = re.exec(line);
				if (m) pts.push({ x: parseFloat(m[1]), y: parseFloat(m[2]) });
			});
			return pts;
		},
		// Carga la lista de puntos DESDE LA IMPRESORA (fichero UVCustomPoints.g), asi todos los clientes ven lo mismo.
		// allowLegacy: si no hay lista guardada, partir del punto unico posxUV/posyUV (solo al abrir el menu).
		async loadCustomPoints(allowLegacy = true) {
			const g = this.$store.state.machine.model.global;
			console.log('[UV-SYNC] loadCustomPoints, uvPointsCount =', g.uvPointsCount, 'allowLegacy =', allowLegacy);
			let pts = [];
			if (g.uvPointsCount > 0) {
				pts = this.parsePointsFile(await this.downloadPrinterFile('0:/macros/Scripts/Patrones/UVCustomPoints.g'));
			}
			if (pts.length === 0 && allowLegacy) {
				const sx = g.posxUV;
				const sy = g.posyUV;
				if (sx !== null && sy !== null && sx !== undefined && sy !== undefined) {
					pts = [{ x: parseFloat(sx), y: parseFloat(sy) }];
				}
			}
			console.log('[UV-SYNC] puntos cargados:', pts.length);
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
		// Mantiene posxUV/posyUV = primer punto (compatibilidad con UVMacro.g y con el modo "sin lista")
		syncFirstPointToStore() {
			if (this.customPoints.length > 0) {
				this.posxUV = this.customPoints[0].x;
				this.posyUV = this.customPoints[0].y;
			}
		},
        drawGrid() {
			const col = this.bioColores;
            if (!this.ctx) return;
            const canvas = this.$refs.gridCanvas;
			const ctx = this.ctx;
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
                // Espera un tick para que this.ctx se establezca si tuvo éxito
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
		// Escribe la lista de puntos en la impresora. Se llama automaticamente al SALIR del step 1.5 (CUSTOM POINT)
		// (con Continuar, Atras, la barra de steps o cerrando el menu).
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
				// {param.S}=tiempo por punto, {param.O}=pin on/off (los pasa Patron_CUSTOM-POINT-UV.g)
				code += 'M28 "/macros/Scripts/Patrones/UVCustomPoints.g"\n';
				code += 'M98 R1\n';		// macro pausable (la pausa no espera a que acaben todos los puntos)
				this.customPoints.forEach(p => {
					code += `G1 X${p.x.toFixed(2)} Y${p.y.toFixed(2)} F21000\n`;
					code += 'M400\n';
					code += 'M42 P{param.O} S1\n';
					code += 'G4 S{param.S}\n';
					code += 'M42 P{param.O} S0\n';
				});
				code += 'M29\n';
			}
			// Contador (0 = sin lista → la macro usa el punto unico posxUV/posyUV) y revision (avisa a los demas clientes)
			code += (g.uvPointsCount === undefined ? 'global uvPointsCount = ' : 'set global.uvPointsCount = ') + n + '\n';
			code += (g.uvPointsRev === undefined ? 'global uvPointsRev = ' : 'set global.uvPointsRev = ') + rev + '\n';
			console.log('[UV-SYNC] guardando puntos, n =', n, 'rev =', rev);
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
		parseFreehandFile(text) {
			const strokes = [];
			const fill = [];
			let cur = null;
			let inFill = false;		// dentro del bloque de relleno (G4 P1 ... G4 P2): se ignora, se regenera al guardar
			const re = /^\s*G1\s+X(-?[\d.]+)\s+Y(-?[\d.]+)\s+F\{param\.([JC])\}/i;
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
		// Carga el trazo DESDE LA IMPRESORA (fichero UVFreehandPath.g), asi todos los clientes ven lo mismo
		async loadFreehandPath() {
			const len = this.$store.state.machine.model.global.uvPathLength;
			if (len !== undefined && len !== null) {
				const text = await this.downloadPrinterFile('0:/macros/Scripts/Patrones/UVFreehandPath.g');
				if (text) {
					const parsed = this.parseFreehandFile(text);
					this.strokes = parsed.strokes;
					this.strokeFill = parsed.fill;
					this.currentStroke = [];
					this.lastSavedFreehandSignature = this.freehandSignature();
				}
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
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Rejilla
			ctx.strokeStyle = this.bioColores.rejilla;
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
			ctx.strokeStyle = this.bioColores.borde;
			ctx.lineWidth = 1;
			ctx.strokeRect(0, 0, size, size);

			// Sub-trazos ya guardados
			ctx.strokeStyle = this.bioColores.trazo;
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
				ctx.fillStyle = willClose ? this.bioColores.cierraFondo : this.bioColores.zona;
				ctx.fill();
				ctx.setLineDash([3, 3]);
				ctx.lineWidth = 1;
				ctx.strokeStyle = willClose ? this.bioColores.cierra : this.bioColores.borde;
				ctx.stroke();
				ctx.restore();

				ctx.strokeStyle = willClose ? this.bioColores.cierra : this.bioColores.abierto;
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
		// Guarda el trazo en la impresora y pasa al step 2
		confirmFreehandPath() {
			this.saveFreehandPath();
			this.CambiaStep('2');
		},
		// Escribe el trazo en la impresora. Se llama automaticamente al SALIR del step 1.5 (FREEHAND)
		// (con Continuar, Atras, la barra de steps o cerrando el menu).
		saveFreehandPath() {
			clearTimeout(this.saveFreehandTimer);
			// Evitar reescribir si el trazo no ha cambiado desde el ultimo guardado
			const signature = this.freehandSignature();
			if (signature === this.lastSavedFreehandSignature) return;
			this.lastSavedFreehandSignature = signature;

			const g = this.$store.state.machine.model.global;

			// Longitud total de los tramos de curado (sin contar saltos entre sub-trazos)
			let curingLength = 0;
			// Contenido del fichero de movimientos. {param.C}=vel. curado, {param.J}=vel. salto, {param.O}=pin on/off
			let code = 'M28 "/macros/Scripts/Patrones/UVFreehandPath.g"\nM98 R1\n';
			

			this.strokes.forEach((stroke, si) => {
				stroke.forEach((point, idx) => {
					const x = point.x.toFixed(2);
					const y = point.y.toFixed(2);
					if (idx === 0) {
						// Inicio de sub-trazo: salto con la lampara apagada y encender al llegar
						code += 'M42 P{param.O} S0\n';
						code += `G1 X${x} Y${y} F{param.J}\n`;
						code += 'M400\n';
						code += 'M42 P{param.O} S1\n';
					} else {
						const prev = stroke[idx - 1];
						curingLength += Math.hypot(point.x - prev.x, point.y - prev.y);
						code += `G1 X${x} Y${y} F{param.C}\n`;
					}
				});
				// Figura cerrada con relleno: barrido del area interior (marcado con G4 P1 ... G4 P2 para poder releerlo)
				// La lampara se queda ENCENDIDA durante todo el relleno (viene encendida del contorno).
				// Los cambios de linea van a velocidad de salto y no cuentan en el tiempo de curado.
				if (this.strokeFill[si] && this.isClosedStroke(stroke)) {
					code += 'G4 P1 ; FILL-BEGIN\n';
					this.computeFillSegments(stroke).forEach(sg => {
						code += `G1 X${sg[0].x.toFixed(2)} Y${sg[0].y.toFixed(2)} F{param.J}\n`;
						code += `G1 X${sg[1].x.toFixed(2)} Y${sg[1].y.toFixed(2)} F{param.C}\n`;
						curingLength += Math.abs(sg[1].x - sg[0].x);
					});
					code += 'G4 P2 ; FILL-END\n';
				}
			});
			code += 'M400\n';
			code += 'M29\n';

			// Longitud de curado (contorno + relleno). Si el trazo esta vacio queda a 0 y Patron_FREEHAND-UV.g avisa de que no hay trazo
			code += (g.uvPathLength === undefined ? 'global uvPathLength = ' : 'set global.uvPathLength = ') + curingLength.toFixed(2) + '\n';
			// Revision: avisa a los demas clientes de que el trazo ha cambiado
			const rev = this.newRevision();
			this.lastOwnPathRev = rev;
			code += (g.uvPathRev === undefined ? 'global uvPathRev = ' : 'set global.uvPathRev = ') + rev + '\n';

			console.log('[UV-SYNC] guardando freehand, trazos =', this.strokes.length, 'rev =', rev);
			this.sendCodeQuiet(code, 'path');
		},
		// ================== FIN FREEHAND ==================

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
		replacePoint(i, x, y) {
			this.customPoints.splice(i, 1, { x, y });
			this.scheduleSaveCustomPoints();
			this.syncFirstPointToStore();
			this.drawGrid();
		},
		removePoint(i) {
			this.customPoints.splice(i, 1);
			this.scheduleSaveCustomPoints();
			this.syncFirstPointToStore();
			this.drawGrid();
		},
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
				// Permitir solo un punto decimal
				if (value === '.' && currentVal.includes('.')) return;
		
				if (currentVal.length < 5) {
				currentVal += value;
				}
			}

			// Validación en tiempo real con decimales
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
				return; // No continuar si hay errores
			}

			// Añade el punto a la lista
			if (this.editingPointIndex >= 0) {
				this.replacePoint(this.editingPointIndex, xVal, yVal);
				this.editingPointIndex = -1;
			} else {
				this.addCustomPoint(xVal, yVal);
			}
			this.dialogManualCoords = false; // Cerrar diálogo
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
			this.manualHeightInput = (this.alturaUV).toString();
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
		
			this.sendCode(`set global.alturaUV = ${height}`);


			this.dialogManualHeight = false;
		},

		openPowerDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualPowerInput = (this.potenciaUV).toString();
			this.manualPowerError = ''; // Limpia errores previos
			this.dialogManualPower = true;
		},
		handlePowerKeyPress(key) {
			if (key === 'DEL') {
				this.manualPowerInput = this.manualPowerInput.slice(0, -1);
			} else if (key === 'CLEAR') {
				this.manualPowerInput = '';
			} else {
				if (this.manualPowerInput.length < 3) { // Límite de 4 dígitos
					this.manualPowerInput += key;
				}
			}
			// Validar después de cada pulsación
			this.validatePower();
		},
		validatePower() {
			const value = this.manualPowerInput;

			const required = this.rules.required(value);
			if (required !== true) {
				this.manualPowerError = required;
				return;
			}

			const positive = this.rules.positiveNumber(value);
			if (positive !== true) {
				this.manualPowerError = positive;
				return;
			}

			const range = this.rules.PowerRange(value);
			if (range !== true) {
				this.manualPowerError = range;
				return;
			}

			this.manualPowerError = '';
		},
		cancelManualPower() {
			this.dialogManualPower = false;
		},
		confirmManualPower() {
			this.validatePower();
			if (this.manualPowerError) return;

			const power = parseFloat(this.manualPowerInput);
		
			this.sendCode(`set global.potenciaUV = ${power}`);


			this.dialogManualPower = false;
		},

		openTimeDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualTimeInput = (this.exposicionUV / 60).toFixed(2).toString();
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
		cancelManualTime() {
			this.dialogManualTime = false;
		},
		confirmManualTime() {
			this.validateTime();
			if (this.manualTimeError) return;

			const minutes = parseFloat(this.manualTimeInput);
			const newValue = Math.round(minutes * 60); // convierte a segundos

			this.sendCode(`set global.exposicionUV = ${newValue}`);

			this.dialogManualTime = false;
		},

		openLayersDialog() {
			// Carga el valor actual en el campo de texto del diálogo
			this.manualLayersInput = (this.cadenceAmountUV).toString();
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
		
			this.sendCode(`set global.cadenceAmountUV = ${layers}`);


			this.dialogManualLayers = false;
		},

    

	},	
	mounted() {
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
		console.log('[UV-SYNC] menu UV cargado (version sincronizada)');
		this.$vuetify.goTo(0);
		if (this.patronUV === 2) {
			this.initializeCanvasAndGrid();
		} else if (this.patronUV === 3) {
			this.initializeFreehandCanvas();
		}
		
	},
	
	watch: {
		bioColores() { // domotek: al cambiar de modo claro/oscuro se vuelven a pintar los lienzos
			this.$nextTick(() => { if (this.ctx) { this.drawGrid(); } if (this.$refs.freehandCanvas) { this.drawFreehandCanvas(); } });
		},
		// Otro cliente (PC / pantalla de la impresora) ha cambiado los puntos → recargar desde la impresora
		'$store.state.machine.model.global.uvPointsRev'(newVal) {
			console.log('[UV-SYNC] cambio uvPointsRev →', newVal, '(mia:', this.lastOwnPointsRev, ')');
			if (newVal === undefined || newVal === null || newVal === this.lastOwnPointsRev) return;
			this.loadCustomPoints(false);
		},
		// Otro cliente ha cambiado el trazo FREEHAND
		'$store.state.machine.model.global.uvPathRev'(newVal) {
			console.log('[UV-SYNC] cambio uvPathRev →', newVal, '(mia:', this.lastOwnPathRev, ')');
			if (newVal === undefined || newVal === null || newVal === this.lastOwnPathRev || this.isDrawingFreehand) return;
			this.loadFreehandPath();
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
			if (oldStep === '1.5' && newStep !== '1.5' && this.patronUV === 2) {
				this.saveCustomPoints();
			}
			if (oldStep === '1.5' && newStep !== '1.5' && this.patronUV === 3) {
				this.saveFreehandPath();
			}
		},
		patronUV(newVal) {
			if (newVal === 2) {
				this.$nextTick(() => {
					this.initializeCanvasAndGrid();
				});
			} else if (newVal === 3) {
				this.$nextTick(() => {
					this.initializeFreehandCanvas();
				});
			}
		}
		// (Eliminados los watchers de posxUV / posyUV: con multipunto provocarian que la lista se reseteara)
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
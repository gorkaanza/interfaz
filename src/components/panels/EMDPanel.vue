<style>
	/* Mismo diseño que los paneles de ES y UV */
	.btnContinue {
		height: 48px;
		width: 120px;
	}
	/* Botón de 120 px con texto largo ("Disparo de prueba") en dos líneas */
	.btnContinue.btnWrap .v-btn__content {
		white-space: normal !important;
		flex: 1 1 100% !important;
		max-width: 100%;
		line-height: 1.1;
		letter-spacing: 0;
		font-size: 0.75rem;
	}
	.btnAction {
		width: 120px;
	}
	.v-stepper__step__step {
		font-size: 1rem !important;
	}
	.etiqueta {
		font-size: 1.3rem;
		color: black;
	}
	.valor {
		font-size: 1.3rem;
		font-weight: bold;
		color: #0a21ad;
	}
	.v-label {
		color: black !important;
		font-size: 1.3rem !important;
	}
	.btnInfo {
		font-size: 1.1rem !important;
	}
	.snack {
		font-size: 4rem !important;
	}
	/* Menos relleno en los pasos del stepper (evita el scroll vertical en la pantalla de la impresora) */
	.panelStepper .v-stepper__content {
		padding: 8px 12px 8px 12px !important;
	}
	.emd-table td {
		padding: 4px 12px;
		text-align: left;
		font-size: 1rem;
	}
	.emd-calib-table th, .emd-calib-table td {
		padding: 1px 14px;
		text-align: center;
	}
</style>

<template>
<div class="es-raiz">
	<!-- domotek: solenoide con el tema oscuro -->
	<div v-if="temaBio" class="bio-pp">
		<header class="bio-proc-cab">
			<button type="button" class="bio-volver" :aria-label="$t('domotek.tools.back')" @click="closeDialog"><v-icon>mdi-chevron-left</v-icon></button>
			<v-icon color="var(--bio-acento)">mdi-magnet-on</v-icon>
			<span class="bio-proc-titulo">{{ $t('domotek.proc.solenoid') }}</span>
			<div style="flex: 1"></div>
			<ol class="bio-cal-pasos">
				<li v-for="p in bioPasos" :key="p.id"><button type="button" :class="{ activo: pasos === p.id }" :aria-current="pasos === p.id ? 'step' : null" @click="CambiaStep(p.id)">{{ p.texto }}</button></li>
			</ol>
		</header>

		<!-- Resumen -->
		<main v-show="pasos === 'S'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('panel.emd.EMDSettings') }}
				<span class="bio-proc-hv" :class="calculo.ok ? 'ok' : 'mal'"><v-icon small>{{ calculo.ok ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>{{ calculo.ok ? $t('domotek.proc.calculated') : $t('panel.emd.solve_' + calculo.reason) }}</span>
			</h2>
			<div class="bio-proc-datos">
				<div v-for="p in paramsByGroup('drop')" :key="p.key"><span>{{ $t(p.label) }}</span><strong>{{ bioNum(p) }}<small v-if="p.unit"> {{ p.unit }}</small></strong></div>
				<div><span>{{ $t('panel.emd.temperature') }}</span><strong v-if="tempEnableEMD">{{ bioNum(param('tempEMD')) }}<small> °C</small></strong><strong v-else class="bio-tenue">{{ $t('domotek.proc.heatingOff') }}</strong></div>
			</div>
			<button type="button" class="bio-emd-calc" @click="dialogCalc = true">
				<div v-for="c in bioCalc" :key="c.id"><span>{{ c.texto }}</span><strong>{{ c.valor }}<small v-if="c.unidad"> {{ c.unidad }}</small></strong></div>
				<div><span>{{ $t('panel.emd.calibration') }}</span><span class="bio-emd-estado" :class="bioEstadoCalib">{{ estadoCalib.texto }}</span></div>
				<v-icon>mdi-chevron-right</v-icon>
			</button>
			<div class="bio-proc-lista">
				<div class="fila cab"><span>{{ $t('panel.emd.autoEMDMode') }}</span><span class="pildora" :class="{ on: enableEMD }">{{ enableEMD ? $t('domotek.proc.on') : $t('domotek.proc.off') }}</span></div>
				<div class="fila" :class="{ tenue: !enableEMD }"><span>{{ $t('domotek.varios.applyEvery') }} {{ g('cadenceAmountEMD') }} {{ $t('domotek.varios.layers') }}</span><span>{{ cadenceEnableEMD ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
				<div class="fila" :class="{ tenue: !enableEMD }"><span>{{ $t('panel.ultraviolet.applyWhen') }}</span><span>{{ aplicarFinEMD ? $t('domotek.varios.yes') : $t('domotek.varios.no') }}</span></div>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')"><span class="bio-cap">{{ $t('domotek.varios.change') }}</span></button>
				<button type="button" class="bio-cal-sec listo" @click="StartSaveSettings"><span class="bio-cap">{{ $t('domotek.varios.save') }}</span></button>
				<button type="button" class="bio-cal-sec" :disabled="!maquinaLibre || !calculo.ok" @click="StartTestShot"><span class="bio-cap">{{ $t('panel.emd.testShot') }}</span></button>
				<button v-if="maquinaLibre" type="button" class="bio-cal-principal ancho" :disabled="!calculo.ok" @click="StartEMD">{{ $t('domotek.proc.run') }}</button>
				<button v-else type="button" class="bio-cal-principal ancho aviso" :disabled="!calculo.ok" @click="StartEMDPausing">{{ $t('domotek.proc.pauseAndRun') }}</button>
			</footer>
		</main>

		<!-- 1 · Gota y material -->
		<main v-show="pasos === '1'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('panel.emd.dropParams') }}</h2>
			<div class="bio-proc-valores cuatro">
				<button v-for="p in paramsByGroup('drop')" :key="p.key" type="button" @click="openParamDialog(p)"><span class="ic verde"><v-icon>{{ p.icon }}</v-icon></span><span>{{ $t(p.label) }}</span><strong>{{ bioNum(p) }}<small v-if="p.unit"> {{ p.unit }}</small></strong></button>
				<button type="button" @click="openParamDialog(param('tempEMD'))"><span class="ic calor"><v-icon>{{ tempEnableEMD ? 'mdi-thermometer' : 'mdi-thermometer-off' }}</v-icon></span><span>{{ $t('panel.emd.temperature') }}</span><strong v-if="tempEnableEMD">{{ bioNum(param('tempEMD')) }}<small> °C</small></strong><strong v-else class="apagado">{{ $t('domotek.proc.heatingOff') }}</strong></button>
			</div>
			<button type="button" class="bio-emd-calc" @click="dialogCalc = true">
				<div v-for="c in bioCalc" :key="c.id"><span>{{ c.texto }}</span><strong>{{ c.valor }}<small v-if="c.unidad"> {{ c.unidad }}</small></strong></div>
				<div><span>{{ $t('panel.emd.viscAtTemp') }}</span><strong>{{ $display(viscActual, 1) }}<small> mPa·s</small></strong></div>
				<v-icon>mdi-chevron-right</v-icon>
			</button>
			<p v-if="!calculo.ok" class="bio-proc-nota bio-peligro-txt">{{ $t('panel.emd.solve_' + calculo.reason) }}</p>
			<p v-else class="bio-tenue bio-proc-nota">{{ $t('domotek.proc.tapToChange') }}</p>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('S')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" @click="CambiaStep('2')">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 2 · Calibración -->
		<main v-show="pasos === '2'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('panel.emd.calibration') }} <span class="bio-emd-estado" :class="bioEstadoCalib">{{ estadoCalib.texto }}</span></h2>
			<p class="bio-tenue bio-proc-nota">{{ $t('panel.emd.calibHint') }}</p>
			<div class="bio-emd-calib">
				<div class="bio-emd-tabla-caja">
					<table class="bio-emd-tabla">
						<thead><tr><th>#</th><th>P <small>bar</small></th><th>t <small>ms</small></th><th>V <small>nL</small></th><th></th></tr></thead>
						<tbody>
							<tr v-for="(pt, i) in calibPoints" :key="i" :class="pt.state">
								<td class="n">{{ i + 1 }}</td><td>{{ pt.P }}</td><td>{{ pt.t }}</td>
								<td>{{ pt.V !== null && pt.V !== undefined ? $display(pt.V, 1) : '—' }}</td>
								<td class="est">
									<v-progress-circular v-if="pt.state === 'running'" indeterminate size="16" width="2" color="var(--bio-acento)" />
									<v-icon v-else-if="pt.state === 'done'" small color="var(--bio-acento)">mdi-check</v-icon>
								</td>
							</tr>
							<tr v-if="!calibPoints.length"><td colspan="5" class="bio-tenue">{{ $t('panel.emd.solve_missingData') }}</td></tr>
						</tbody>
					</table>
				</div>
				<div class="bio-emd-calib-lado">
					<div class="bio-proc-valores uno">
						<button type="button" :disabled="calibRunning" @click="openParamDialog(param('calibDropsEMD'))"><span>{{ $t('panel.emd.dropsPerPoint') }}</span><strong>{{ bioNum(param('calibDropsEMD')) }}</strong></button>
					</div>
					<div class="bio-emd-resultado">
						<span class="bio-tenue">{{ $t('domotek.proc.result') }}</span>
						<template v-if="calibResult && calibResult.ok">
							<div class="vals"><span>k <strong>{{ calibResult.k }}</strong></span><span>t0 <strong>{{ calibResult.t0 }}</strong> ms</span><span>R² <strong>{{ calibResult.r2 }}</strong></span></div>
							<span v-if="calibResult.r2 < 0.95" class="bio-ambar-txt">{{ $t('panel.emd.lowR2') }}</span>
						</template>
						<span v-else-if="!calibError" class="bio-tenue">{{ $t('domotek.proc.runCalibFirst') }}</span>
						<span v-if="calibError" class="bio-peligro-txt">{{ calibError }}</span>
					</div>
				</div>
			</div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('1')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-sec" :disabled="calibRunning || !maquinaLibre || !viscRef" @click="dialogCalibConfirm = true"><span class="bio-cap">{{ $t('panel.emd.startCalib') }}</span></button>
				<button type="button" class="bio-cal-sec listo" :disabled="!calibResult || !calibResult.ok" @click="applyCalibration"><span class="bio-cap">{{ $t('panel.emd.applyCalib') }}</span></button>
				<button type="button" class="bio-cal-principal ancho" @click="CambiaStep('3')">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 3 · Punto -->
		<main v-show="pasos === '3'" class="bio-proc-cuerpo">
			<div class="bio-proc-canvas-zona">
				<div class="bio-proc-lateral">
					<span class="bio-tenue">{{ $t('domotek.proc.shotPoint') }}</span>
					<div v-if="isPointSelected" class="bio-emd-xy"><span>X <strong>{{ $display(selectedPointMm.x, 1) }}</strong> mm</span><span>Y <strong>{{ $display(selectedPointMm.y, 1) }}</strong> mm</span></div>
					<span v-else class="bio-tenue">{{ $t('domotek.proc.noPoint') }}</span>
					<div class="bio-proc-valores uno">
						<button type="button" @click="openParamDialog(param('alturaEMD'))"><span>{{ $t('panel.emd.height') }}</span><strong>{{ bioNum(param('alturaEMD')) }}<small> mm</small></strong></button>
					</div>
				</div>
				<div class="bio-proc-lienzo">
					<canvas ref="gridCanvas" :width="canvasSizePx" :height="canvasSizePx" @click="handleCanvasClick"></canvas>
					<span>{{ $t('domotek.proc.tapToPick') }} · {{ gridRealSizeMm }} × {{ gridRealSizeMm }} mm</span>
				</div>
				<div class="bio-proc-acciones">
					<button type="button" @click="centerPoint">{{ $t('domotek.varios.center', 'Centro') }}</button>
					<button type="button" @click="openManualCoordsDialog">{{ $t('domotek.varios.manual', 'Manual') }}</button>
				</div>
			</div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('2')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" :disabled="!isPointSelected" @click="CambiaStep('4')">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- 4 · Automático -->
		<main v-show="pasos === '4'" class="bio-proc-cuerpo">
			<h2 class="bio-proc-h2">{{ $t('domotek.proc.autoMode') }}</h2>
			<div class="bio-proc-lista">
				<div class="fila cab">
					<span><strong>{{ $t('panel.emd.autoEMDMode') }}</strong><small>{{ $t('domotek.proc.appliesDuringPrint') }}</small></span>
					<button type="button" class="interruptor" :class="{ on: enableEMD }" role="switch" :aria-checked="enableEMD" @click="enableEMD = !enableEMD"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableEMD }">
					<span>{{ $t('domotek.varios.applyEvery') }}</span>
					<div class="bio-proc-contador">
						<button type="button" :disabled="!enableEMD || bioCadencia <= param('cadenceAmountEMD').min" @click="setGlobal('cadenceAmountEMD', bioCadencia - 1)">−</button>
						<button type="button" class="valor" :disabled="!enableEMD" @click="openParamDialog(param('cadenceAmountEMD'))"><strong>{{ bioCadencia }}</strong> {{ $t('domotek.varios.layers') }}</button>
						<button type="button" :disabled="!enableEMD || bioCadencia >= param('cadenceAmountEMD').max" @click="setGlobal('cadenceAmountEMD', bioCadencia + 1)">+</button>
					</div>
					<button type="button" class="interruptor" :class="{ on: cadenceEnableEMD }" role="switch" :aria-checked="cadenceEnableEMD" :disabled="!enableEMD" @click="cadenceEnableEMD = !cadenceEnableEMD"><i></i></button>
				</div>
				<div class="fila" :class="{ tenue: !enableEMD }">
					<span>{{ $t('panel.ultraviolet.applyWhen') }}</span>
					<button type="button" class="interruptor" :class="{ on: aplicarFinEMD }" role="switch" :aria-checked="aplicarFinEMD" :disabled="!enableEMD" @click="aplicarFinEMD = !aplicarFinEMD"><i></i></button>
				</div>
			</div>
			<div style="flex: 1"></div>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" @click="CambiaStep('3')">{{ $t('domotek.tools.back') }}</button>
				<button type="button" class="bio-cal-principal ancho" @click="CambiaStep('S')">{{ $t('domotek.proc.seeSummary') }}</button>
			</footer>
		</main>
	</div>
	<v-row v-else class="mb-0 pb-0">
		<v-col cols="12" align="center" class="py-0">
			<v-stepper v-model="pasos" class="blue lighten-5 panelStepper">

				<!-- ===================== CABECERA ===================== -->
				<v-stepper-header class="Stephead">
					<v-btn icon style="margin: 16px 0 0 16px;" @click="closeDialog">
						<v-icon x-large>mdi-magnet-on</v-icon>
					</v-btn>
					<v-stepper-step editable step="S" color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="1" color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="2" color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="3" color="#0a21ad" class="Stephead_step" />
					<v-divider />
					<v-stepper-step editable step="4" color="#0a21ad" class="Stephead_step" />
					<v-btn icon style="margin: 18px 10px 0 0;" @click="closeDialog">
						<v-img src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>

				<v-stepper-items>

					<!-- ===================== PASO S: RESUMEN ===================== -->
					<v-stepper-content step="S">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :style="{ minHeight: (panelCardPx - 100) + 'px' }">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-0 text-center">{{ $t('panel.emd.EMDSettings') }}</p>

								<v-row style="height:30px;" class="ma-0 mt-5">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<span class="etiqueta">{{ $t('domotek.varios.heightMm') }}</span><span class="valor">{{ g('alturaEMD') }}</span>
									</v-col>
								</v-row>
								<v-row style="height:30px; margin:0px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4" class="ma-0 pa-0"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6" class="ma-0 pl-2 pt-0" align="left">
										<v-checkbox readonly v-model="enableEMD" :label="$t('panel.emd.autoEMDMode')"></v-checkbox>
									</v-col>
								</v-row>
								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6">
										<v-checkbox readonly :disabled="!enableEMD" v-model="cadenceEnableEMD" :label="$t('domotek.varios.applyEvery') + ' ' + g('cadenceAmountEMD') + ' ' + $t('domotek.varios.layers')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
								</v-row>
								<v-row style="height:30px;" class="ma-0">
									<v-col cols="2" sm="2" md="4" lg="4" xl="4"></v-col>
									<v-col cols="10" sm="10" md="6" lg="6" xl="6">
										<v-checkbox readonly :disabled="!enableEMD" v-model="aplicarFinEMD" :label="$t('panel.ultraviolet.applyWhen')" class="ml-10 mt-0 etiqueta align-center justify-center"></v-checkbox>
									</v-col>
								</v-row>

								<v-row style="height:60px;" class="ml-5 mr-5 mt-0">
									<v-col cols="12">
										<v-row class="mt-2" align="center" justify="center">
											<v-btn v-for="p in paramsByGroup('drop')" :key="p.key" class="ma-1 teal lighten-3 text-none btnInfo" @click="CambiaStep('1')">
												<v-icon left>{{ p.icon }}</v-icon><strong>{{ fmt(p) }}</strong>
											</v-btn>
											<v-btn v-if="tempEnableEMD" class="ma-1 orange lighten-3 text-none btnInfo" @click="CambiaStep('1')">
												<v-icon left>mdi-thermometer</v-icon><strong>{{ fmt(param('tempEMD')) }}</strong>
											</v-btn>
											<v-btn class="ma-1 text-none btnInfo" :class="calculo.ok ? 'teal lighten-3' : 'red lighten-3'" @click="dialogCalc = true">
												<v-icon left>mdi-calculator-variant-outline</v-icon><strong>{{ $t('panel.emd.showCalc') }}</strong>
											</v-btn>
										</v-row>
									</v-col>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="StartSaveSettings" rounded>{{ $t('domotek.varios.save') }} <v-icon class="mr-1">mdi-floppy</v-icon></v-btn>
							<v-btn class="btnContinue btnWrap mt-10 mr-5" color="indigo white--text" :disabled="!maquinaLibre || !calculo.ok" @click="StartTestShot" rounded>{{ $t('panel.emd.testShot') }}</v-btn>
							<v-btn v-if="maquinaLibre" class="btnContinue mt-10 mr-5" color="green white--text" :disabled="!calculo.ok" @click="StartEMD" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn v-else class="btnContinue mt-10 mr-5" color="#fb8c00" :disabled="!calculo.ok" @click="StartEMDPausing" rounded>{{ $t('domotek.varios.runOnce') }}</v-btn>
							<v-btn class="btnContinue mt-10" color="primary" @click="CambiaStep('1')">{{ $t('domotek.varios.change') }} <v-icon dark right>mdi-wrench-outline</v-icon></v-btn>
						</v-card>
					</v-stepper-content>

					<!-- ===================== PASO 1: GOTA Y MATERIAL ===================== -->
					<v-stepper-content step="1">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px; max-width: 100%;">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">{{ $t('panel.emd.dropParams') }}</p>
								<!-- Rejilla de dos columnas iguales: todos los botones toman el ancho del más largo -->
								<div style="display: inline-grid; grid-template-columns: 1fr 1fr; gap: 16px 16px;">
									<v-btn v-for="p in paramsByGroup('drop')" :key="p.key" x-large outlined block color="#1976d2" @click="openParamDialog(p)">
										<v-icon left>{{ p.icon }}</v-icon>
										<span class="subtitle-1">{{ $t(p.label) }}: <span class="font-weight-bold text-none">{{ fmt(p) }}</span></span>
									</v-btn>
									<v-btn x-large outlined block :color="tempEnableEMD ? 'orange darken-2' : '#1976d2'" @click="openParamDialog(param('tempEMD'))">
										<v-icon left>{{ tempEnableEMD ? 'mdi-thermometer' : 'mdi-thermometer-off' }}</v-icon>
										<span class="subtitle-1">{{ $t('panel.emd.temperature') }}: <span class="font-weight-bold" :class="{ 'text-none': tempEnableEMD }">{{ tempEnableEMD ? fmt(param('tempEMD')) : $t('panel.emd.heatingOff') }}</span></span>
									</v-btn>
									<v-btn x-large outlined color="indigo" style="grid-column: 1 / span 2; justify-self: center; width: calc(50% - 8px);" @click="dialogCalc = true">
										<v-icon left>mdi-calculator-variant-outline</v-icon>
										<span class="subtitle-1">{{ $t('panel.emd.showCalc') }}</span>
										<v-icon right small :color="calculo.ok ? 'green' : 'red'">{{ calculo.ok ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
									</v-btn>
								</div>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('S')"><v-icon dark left>mdi-arrow-left-bold-outline</v-icon>{{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" color="primary" @click="CambiaStep('2')">{{ $t('domotek.toolNames.CONTINUE') }}<v-icon dark right>mdi-arrow-right-bold-outline</v-icon></v-btn>
						</v-card>
					</v-stepper-content>

					<!-- ===================== PASO 2: CALIBRACIÓN ===================== -->
					<v-stepper-content step="2">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px; max-width: 100%;">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-0 text-center">{{ $t('panel.emd.calibration') }}</p>
								<p class="text-center mb-2" style="font-size: 0.85rem;">{{ $t('panel.emd.calibHint') }}</p>
								<div style="display: inline-grid; grid-template-columns: auto auto; align-items: center; gap: 24px;">
									<table class="emd-calib-table">
										<tr><th>#</th><th>P (bar)</th><th>t (ms)</th><th>V (nL)</th><th></th></tr>
										<tr v-for="(pt, i) in calibPoints" :key="i">
											<td>{{ i + 1 }}</td><td>{{ pt.P }}</td><td>{{ pt.t }}</td>
											<td>{{ pt.V !== null ? pt.V.toFixed(1) : '—' }}</td>
											<td style="width: 24px;">
												<v-progress-circular v-if="pt.state === 'running'" indeterminate size="16" width="2" color="primary" />
												<v-icon v-else-if="pt.state === 'done'" small color="green">mdi-check</v-icon>
											</td>
										</tr>
									</table>
									<v-btn x-large outlined color="#1976d2" :disabled="calibRunning" @click="openParamDialog(param('calibDropsEMD'))">
										<v-icon left>mdi-water</v-icon>
										<span class="subtitle-1">{{ $t('panel.emd.dropsPerPoint') }}: <span class="font-weight-bold">{{ g('calibDropsEMD') }}</span></span>
									</v-btn>
								</div>
								<p v-if="calibError" class="red--text mb-0 mt-1">{{ calibError }}</p>
								<p v-if="calibResult && calibResult.ok" class="mb-0 mt-1">
									k = <strong>{{ calibResult.k }}</strong> · t0 = <strong>{{ calibResult.t0 }} ms</strong> · R² = <strong>{{ calibResult.r2 }}</strong>
									<span v-if="calibResult.r2 < 0.95" class="orange--text"> ({{ $t('panel.emd.lowR2') }})</span>
								</p>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('1')"><v-icon dark left>mdi-arrow-left-bold-outline</v-icon>{{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10 mr-5" color="indigo white--text" :disabled="calibRunning || !maquinaLibre || !viscRef" @click="dialogCalibConfirm = true" rounded>{{ $t('panel.emd.startCalib') }}</v-btn>
							<v-btn class="btnContinue mt-10 mr-5" color="green white--text" :disabled="!calibResult || !calibResult.ok" @click="applyCalibration" rounded>{{ $t('panel.emd.applyCalib') }}</v-btn>
							<v-btn class="btnContinue mt-10" color="primary" @click="CambiaStep('3')">{{ $t('domotek.toolNames.CONTINUE') }}<v-icon dark right>mdi-arrow-right-bold-outline</v-icon></v-btn>
						</v-card>
					</v-stepper-content>

					<!-- ===================== PASO 3: PUNTO (como el punto personalizado de ES) ===================== -->
					<v-stepper-content step="3">
						<v-card class="mb-0 blue lighten-5" :height="panelCardPx">
							<v-card outlined class="blue lighten-4 d-flex flex-column" :height="panelCardPx - 20">
								<p class="mt-2 text-center" style="font-size: 1.15rem; font-weight: bold;">{{ $t('panel.emd.EMDSelectPoint') }}</p>

								<v-card-text class="pa-1 my-auto">
									<div style="position: relative; display: inline-grid; grid-template-columns: 150px auto 150px; align-items: center; gap: 15px; margin-bottom: 5px;">
										<!-- Izquierda: coordenadas y altura de disparo -->
										<div class="text-center" style="width: 150px;">
											<template v-if="isPointSelected">
												<p style="font-size: 0.9rem; margin: 0;"><strong>X:</strong> {{ selectedPointMm.x.toFixed(1) }} mm</p>
												<p style="font-size: 0.9rem; margin: 0 0 16px 0;"><strong>Y:</strong> {{ selectedPointMm.y.toFixed(1) }} mm</p>
											</template>
											<p style="font-size: 0.9rem; margin: 0 0 4px 0;"><strong>{{ $t('panel.emd.height') }}</strong></p>
											<v-btn outlined color="#1976d2" width="150" height="48" @click="openParamDialog(param('alturaEMD'))">
												<v-icon left>mdi-ruler</v-icon><span class="subtitle-1 font-weight-bold text-none">{{ fmt(param('alturaEMD')) }}</span>
											</v-btn>
										</div>
										<!-- Centro: cuadrícula -->
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
										<!-- Derecha: botones -->
										<div style="display: flex; flex-direction: column; gap: 40px; margin-left: 5px;">
											<v-btn class="btnAction" small color="primary" @click="centerPoint">{{ $t('domotek.varios.center') }}</v-btn>
											<v-btn class="btnAction" small color="primary" @click="openManualCoordsDialog">{{ $t('domotek.varios.manual') }}</v-btn>
										</div>
									</div>
								</v-card-text>

								<div class="text-center pb-2 pt-1 mt-auto">
									<v-btn class="btnContinue mr-4" color="primary" @click="CambiaStep('2')"><v-icon dark left>mdi-arrow-left-bold-outline</v-icon>{{ $t('domotek.toolNames.BACK') }}</v-btn>
									<v-btn class="btnContinue" color="primary" :disabled="!isPointSelected" @click="CambiaStep('4')">{{ $t('domotek.toolNames.CONTINUE') }}<v-icon dark right>mdi-arrow-right-bold-outline</v-icon></v-btn>
								</div>
							</v-card>
						</v-card>
					</v-stepper-content>

					<!-- ===================== PASO 4: AUTOMÁTICO ===================== -->
					<v-stepper-content step="4">
						<v-card class="mb-0 blue lighten-4" :height="panelCardPx">
							<v-card outlined class="blue lighten-4" :height="panelCardPx - 100" style="width: 800px; max-width: 100%;">
								<p style="font-size: 1.3rem; font-weight:bold;" class="mt-2 mb-5 text-center">{{ $t('panel.emd.autoParams') }}</p>
								<v-row style="height:40px; margin-left:40px;">
									<v-checkbox v-model="enableEMD" :label="$t('panel.emd.autoEMDMode')" class="etiqueta align-center justify-center"></v-checkbox>
								</v-row>
								<v-row style="height:62px; margin-left:128px;">
									<v-col cols="5">
										<v-checkbox :disabled="!enableEMD" v-model="cadenceEnableEMD" :label="$t('domotek.varios.applyEvery') + ' ' + g('cadenceAmountEMD') + ' ' + $t('domotek.varios.layers')" class="etiqueta align-center justify-center"></v-checkbox>
									</v-col>
									<v-col cols="6" v-show="enableEMD">
										<v-btn x-large outlined color="#1976d2" @click="openParamDialog(param('cadenceAmountEMD'))">
											<v-icon left>mdi-layers</v-icon>
											<span class="subtitle-1"><span class="font-weight-bold">{{ g('cadenceAmountEMD') }}</span> {{ $t('domotek.varios.layers') }}</span>
										</v-btn>
									</v-col>
								</v-row>
								<v-row style="height:40px; margin-left:140px;">
									<v-checkbox :disabled="!enableEMD" v-model="aplicarFinEMD" :label="$t('panel.ultraviolet.applyWhen')" class="etiqueta align-center justify-center"></v-checkbox>
								</v-row>
							</v-card>
							<v-btn class="btnContinue mt-10 mr-5" color="primary" @click="CambiaStep('3')"><v-icon dark left>mdi-arrow-left-bold-outline</v-icon>{{ $t('domotek.toolNames.BACK') }}</v-btn>
							<v-btn class="btnContinue mt-10" color="primary" @click="CambiaStep('S')">{{ $t('domotek.varios.settings') }}<v-icon dark right>mdi-cog</v-icon></v-btn>
						</v-card>
					</v-stepper-content>

				</v-stepper-items>
			</v-stepper>
		</v-col>
	</v-row>

		<!-- ===================== DIÁLOGO: PARÁMETROS CALCULADOS ===================== -->
		<v-dialog v-model="dialogCalc" :max-width="temaBio ? 520 : '460px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
			<!-- domotek: cálculo con el diseño nuevo -->
			<div v-if="temaBio" class="bio-emd-calculo">
				<header class="bio-teclado-cab">
					<span class="bio-teclado-icono acento"><v-icon>mdi-calculator-variant-outline</v-icon></span>
					<span class="bio-teclado-nombre">{{ $t('panel.emd.calcTitle') }}</span>
					<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.close')" @click="dialogCalc = false"><v-icon>mdi-close</v-icon></button>
				</header>
				<div v-if="calculo.ok" class="bio-proc-datos tres">
					<div v-for="c in bioCalc" :key="c.id"><span>{{ c.texto }}</span><strong>{{ c.valor }}<small> {{ c.unidad }}</small></strong></div>
				</div>
				<p v-else class="bio-peligro-txt ma-0">{{ $t('panel.emd.solve_' + calculo.reason) }}</p>
				<div class="bio-proc-lista">
					<div class="fila cab"><span>{{ $t('panel.emd.viscAtTemp') }}</span><strong>{{ $display(viscActual, 1) }} mPa·s</strong></div>
					<div class="fila"><span>{{ $t('panel.emd.calibration') }}</span><span class="bio-emd-estado" :class="bioEstadoCalib">{{ estadoCalib.texto }}</span></div>
					<div class="fila"><span>k</span><strong class="bio-blanco">{{ kActual }}</strong></div>
					<div class="fila"><span>t0</span><strong class="bio-blanco">{{ t0Actual }} ms</strong></div>
				</div>
				<div class="bio-teclado-acciones">
					<button type="button" class="bio-teclado-ok acento" @click="dialogCalc = false">{{ $t('generic.close') }}</button>
				</div>
			</div>
			<v-card v-else>
				<v-card-title class="justify-center">{{ $t('panel.emd.calcTitle') }}</v-card-title>
				<v-card-text class="pb-0">
					<table class="emd-table mx-auto">
						<template v-if="calculo.ok">
							<tr><td>{{ $t('panel.emd.pressure') }}</td><td><strong>{{ calculo.P }} bar</strong></td></tr>
							<tr><td>{{ $t('panel.emd.openTime') }}</td><td><strong>{{ calculo.t }} ms</strong></td></tr>
							<tr><td>{{ $t('panel.emd.cycleTime') }}</td><td><strong>{{ calculo.cycle }} ms</strong></td></tr>
						</template>
						<tr v-else><td colspan="2" class="red--text">{{ $t('panel.emd.solve_' + calculo.reason) }}</td></tr>
						<tr><td>{{ $t('panel.emd.viscAtTemp') }}</td><td><strong>{{ viscActual.toFixed(1) }} mPa·s</strong></td></tr>
						<tr><td>{{ $t('panel.emd.calibration') }}</td><td><v-chip small :color="estadoCalib.color" label>{{ estadoCalib.texto }}</v-chip></td></tr>
						<tr><td>k</td><td><strong>{{ kActual }}</strong></td></tr>
						<tr><td>t0</td><td><strong>{{ t0Actual }} ms</strong></td></tr>
					</table>
				</v-card-text>
				<v-card-actions class="justify-center pb-4">
					<v-btn class="btnContinue" color="primary" @click="dialogCalc = false">{{ $t('generic.close') }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- ===================== DIÁLOGO NUMÉRICO GENÉRICO ===================== -->
		<v-dialog v-model="dialogParam" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
			<!-- domotek: teclado con el diseño nuevo -->
			<div v-if="temaBio && editingParam" class="bio-teclado">
				<section class="bio-teclado-izq">
					<header class="bio-teclado-cab">
						<span class="bio-teclado-icono" :class="editingParam.key === 'tempEMD' ? '' : 'acento'"><v-icon>{{ editingParam.icon }}</v-icon></span>
						<span class="bio-teclado-nombre">{{ $t(editingParam.label) }}</span>
						<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.cancel')" @click="dialogParam = false"><v-icon>mdi-close</v-icon></button>
					</header>
					<div v-if="editingParam.key === 'tempEMD'" class="bio-teclado-fila-switch">
						<span>{{ $t('panel.emd.heating') }}</span>
						<button type="button" class="interruptor" :class="{ on: tempEnableEMD }" role="switch" :aria-checked="tempEnableEMD" @click="tempEnableEMD = !tempEnableEMD"><i></i></button>
					</div>
					<div class="bio-teclado-datos">
						<div><span>{{ $t('domotek.keypad.currentValue') }}</span><strong>{{ bioValorActual }}</strong></div>
						<div><span>{{ $t('domotek.keypad.allowed') }}</span><strong class="peq">{{ editingParam.min }} – {{ editingParam.max }}<small v-if="editingParam.unit"> {{ editingParam.unit }}</small></strong></div>
					</div>
					<div class="bio-teclado-valor acento" :class="{ fuera: !!paramError && paramInput !== '', apagado: tempOffEditing }">
						<span>{{ $t('domotek.keypad.newValue') }}</span>
						<strong>{{ tempOffEditing ? $t('domotek.keypad.off') : (paramInput === '' ? '—' : paramInput) }}</strong><small v-if="editingParam.unit && !tempOffEditing">{{ editingParam.unit }}</small>
					</div>
					<div class="bio-teclado-rango" :class="{ fuera: !!paramError && paramInput !== '' }">{{ tempOffEditing ? $t('domotek.keypad.heatingOffHint') : (paramError && paramInput !== '' ? paramError : rangoTexto(editingParam)) }}</div>
					<div v-if="bioAtajosParam.length && !tempOffEditing" class="bio-teclado-atajos">
						<button v-for="v in bioAtajosParam" :key="v" type="button" class="acento" :class="{ activo: String(v) === paramInput }" @click="paramInput = String(v), bioReemplazar = true">{{ v }}</button>
					</div>
					<div style="flex: 1"></div>
					<div class="bio-teclado-acciones">
						<button type="button" class="bio-teclado-sec" @click="dialogParam = false">{{ $t('generic.cancel') }}</button>
						<button type="button" class="bio-teclado-ok acento" :disabled="!tempOffEditing && (!!paramError || paramInput === '')" @click="confirmParam">
							{{ tempOffEditing ? $t('generic.ok') : (paramInput === '' ? $t('domotek.keypad.apply') : $t('domotek.keypad.applyValue', [paramInput + (editingParam.unit ? ' ' + editingParam.unit : '')])) }}
						</button>
					</div>
				</section>
				<section class="bio-teclado-num" :aria-label="$t('domotek.keypad.keypad')">
					<button v-for="n in ['7', '8', '9', '4', '5', '6', '1', '2', '3']" :key="n" type="button" :disabled="tempOffEditing" @click="handleParamKeyPress(n)">{{ n }}</button>
					<button v-if="editingParam.decimals > 0" type="button" :disabled="tempOffEditing" @click="handleParamKeyPress('.')">,</button>
					<button v-else type="button" class="suave" :aria-label="$t('domotek.keypad.clear')" @click="handleParamKeyPress('CLEAR')">C</button>
					<button type="button" :disabled="tempOffEditing" @click="handleParamKeyPress('0')">0</button>
					<button type="button" class="suave" :disabled="tempOffEditing" :aria-label="$t('domotek.keypad.delete')" @click="handleParamKeyPress('DEL')" @contextmenu.prevent="handleParamKeyPress('CLEAR')"><v-icon>mdi-backspace-outline</v-icon></button>
				</section>
			</div>
			<v-card v-else-if="editingParam">
				<v-card-title class="justify-center text-center" :class="{ 'pb-0': editingParam.key === 'tempEMD' }">
					<span class="headline">{{ $t(editingParam.label) }}<span v-if="editingParam.unit"> ({{ editingParam.unit }})</span></span>
					<!-- Solo para la temperatura: activar o no el calentado -->
					<v-switch v-if="editingParam.key === 'tempEMD'" v-model="tempEnableEMD" :label="$t('panel.emd.heating')" color="orange darken-2" hide-details class="mt-0 pt-0 ml-4" inset></v-switch>
				</v-card-title>
				<v-card-text class="pb-0">
					<v-container>
						<v-row justify="center">
							<v-col cols="12" class="py-1">
								<v-text-field :disabled="tempOffEditing" v-model="paramInput" @keydown="handleKeydownManualInput" outlined class="title text-center font-weight-bold" :error-messages="paramError" :hint="rangoTexto(editingParam)" persistent-hint></v-text-field>
							</v-col>
						</v-row>
						<div class="numeric-keypad text-center">
							<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
								<v-col v-for="(key, i) in row" :key="rowIndex + '-' + i" class="pa-1">
									<v-btn v-if="key.value !== 'EMPTY'" block :color="key.color || 'grey lighten-2'" :disabled="tempOffEditing || (key.value === '.' && editingParam.decimals === 0)" @click="handleParamKeyPress(key.value)">
										<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
										<span v-else class="headline">{{ key.text }}</span>
									</v-btn>
									<div v-else style="visibility: hidden; height: 36px;"></div>
								</v-col>
							</v-row>
						</div>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="dialogParam = false">{{ $t('generic.cancel') }}</v-btn>
					<v-btn color="blue darken-1" text :disabled="!tempOffEditing && (!!paramError || paramInput === '')" @click="confirmParam">{{ $t('generic.ok') }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- ===================== DIÁLOGO COORDENADAS ===================== -->
		<v-dialog v-model="dialogManualCoords" persistent :max-width="temaBio ? 760 : '380px'" :content-class="temaBio ? 'bio-teclado-dialogo' : ''">
			<!-- domotek: coordenadas con el diseño nuevo -->
			<div v-if="temaBio" class="bio-teclado">
				<section class="bio-teclado-izq">
					<header class="bio-teclado-cab">
						<span class="bio-teclado-icono acento"><v-icon>mdi-crosshairs-gps</v-icon></span>
						<span class="bio-teclado-nombre">{{ $t('panel.ultraviolet.manualEditCoordsTittle') }}</span>
						<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.cancel')" @click="dialogManualCoords = false"><v-icon>mdi-close</v-icon></button>
					</header>
					<div class="bio-teclado-coords">
						<button v-for="eje in ['x', 'y']" :key="eje" type="button" class="bio-teclado-valor acento" :class="{ inactivo: activeManualInput !== eje, fuera: !!(eje === 'x' ? manualXError : manualYError) }" @click="activeManualInput = eje">
							<span>{{ eje.toUpperCase() }}</span>
							<strong>{{ (eje === 'x' ? manualX : manualY) === '' ? '—' : (eje === 'x' ? manualX : manualY) }}</strong><small>mm</small>
						</button>
					</div>
					<div class="bio-teclado-rango" :class="{ fuera: !!(manualXError || manualYError) }">{{ manualXError || manualYError || $t('domotek.keypad.coordRange', [minCoord, maxCoord]) }}</div>
					<div class="bio-teclado-atajos">
						<button type="button" class="acento" @click="manualX = String(Math.round(maxCoord / 2)); manualY = String(Math.round(maxCoord / 2)); manualXError = ''; manualYError = ''">{{ $t('domotek.varios.center', 'Centro') }}</button>
					</div>
					<div style="flex: 1"></div>
					<div class="bio-teclado-acciones">
						<button type="button" class="bio-teclado-sec" @click="dialogManualCoords = false">{{ $t('generic.cancel') }}</button>
						<button type="button" class="bio-teclado-ok acento" :disabled="!!manualXError || !!manualYError || manualX === '' || manualY === ''" @click="confirmManualInput">{{ $t('domotek.keypad.apply') }}</button>
					</div>
				</section>
				<section class="bio-teclado-num" :aria-label="$t('domotek.keypad.keypad')">
					<button v-for="n in ['7', '8', '9', '4', '5', '6', '1', '2', '3']" :key="n" type="button" @click="handleCoordKeyPress(n)">{{ n }}</button>
					<button type="button" @click="handleCoordKeyPress('.')">,</button>
					<button type="button" @click="handleCoordKeyPress('0')">0</button>
					<button type="button" class="suave" :aria-label="$t('domotek.keypad.delete')" @click="handleCoordKeyPress('DEL')"><v-icon>mdi-backspace-outline</v-icon></button>
				</section>
			</div>
			<v-card v-else>
				<v-card-title class="justify-center text-center">
					<span class="headline">{{ $t('panel.ultraviolet.manualEditCoordsTittle') }}</span>
				</v-card-title>
				<v-card-text class="pb-0">
					<v-container>
						<v-row class="mb-1">
							<v-col cols="12" sm="6" class="py-1">
								<label class="mb-1 d-block font-weight-medium">{{ $t('panel.ultraviolet.CoordsX') }}</label>
								<v-text-field v-model="manualX" @keydown="handleKeydownManualInput" outlined dense @focus="activeManualInput = 'x'" :error-messages="manualXError" hide-details="auto"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" class="py-1">
								<label class="mb-1 d-block font-weight-medium">{{ $t('panel.ultraviolet.CoordsY') }}</label>
								<v-text-field v-model="manualY" @keydown="handleKeydownManualInput" outlined dense @focus="activeManualInput = 'y'" :error-messages="manualYError" hide-details="auto"></v-text-field>
							</v-col>
						</v-row>
						<div class="numeric-keypad text-center">
							<v-row dense v-for="(row, rowIndex) in keypadLayout" :key="rowIndex">
								<v-col v-for="(key, i) in row" :key="rowIndex + '-' + i" class="pa-1">
									<v-btn v-if="key.value !== 'EMPTY'" block :color="key.color || 'grey lighten-2'" @click="handleCoordKeyPress(key.value)">
										<v-icon v-if="key.icon">{{ key.icon }}</v-icon>
										<span v-else class="headline">{{ key.text }}</span>
									</v-btn>
									<div v-else style="visibility: hidden; height: 36px;"></div>
								</v-col>
							</v-row>
						</div>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="dialogManualCoords = false">{{ $t('generic.cancel') }}</v-btn>
					<v-btn color="blue darken-1" text :disabled="!!manualXError || !!manualYError || manualX === '' || manualY === ''" @click="confirmManualInput">{{ $t('generic.ok') }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- ===================== CONFIRMAR INICIO DE CALIBRACIÓN ===================== -->
		<v-dialog v-model="dialogCalibConfirm" max-width="500">
			<v-card>
				<v-card-title class="headline">{{ $t('panel.emd.calibConfirm') }}</v-card-title>
				<v-card-actions>
					<v-row>
						<v-col cols="6" align="center">
							<v-btn width="120" height="48" color="red lighten-3" rounded @click="dialogCalibConfirm = false">{{ $t('domotek.varios.no') }}</v-btn>
						</v-col>
						<v-col cols="6" align="center">
							<v-btn width="120" height="48" color="green lighten-3" rounded @click="dialogCalibConfirm = false; runCalibration()">{{ $t('domotek.varios.yes') }}</v-btn>
						</v-col>
					</v-row>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- ===================== CONFIRMACIÓN (guardar / disparar) ===================== -->
		<v-dialog v-model="dialogConfirm" max-width="500">
			<v-card>
				<v-card-title class="headline">{{ nombreMacro }}</v-card-title>
				<v-card-actions>
					<v-row>
						<v-col cols="6" align="center">
							<v-btn width="120" height="48" color="red lighten-3" rounded @click="dialogConfirm = false">{{ $t('domotek.varios.no') }}</v-btn>
						</v-col>
						<v-col cols="6" align="center">
							<code-btn width="120" height="48" :code="codigo" :log="false" color="green lighten-3" rounded @click.native="dialogConfirm = false">
								{{ $t('domotek.varios.yes') }}
							</code-btn>
						</v-col>
					</v-row>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar content-class="snack" v-model="snackbar" :timeout="400" absolute left top color="light-blue white--text">
			{{ snackbarValor }}
		</v-snackbar>
</div>
</template>

<script>
'use strict'
import { mapState, mapActions } from 'vuex'
import { EMD_MACHINE, viscAt, solve, fit, calibrationGrid } from './emdModel.js'
import { paletaBio } from '../../utils/temaBio.js'

/*
 * Parámetros que introduce el usuario. Todos se guardan como global.<key>.
 * La presión, la apertura y el ciclo NO se editan: los calcula emdModel.js.
 */
const EMD_PARAMS = [
	{ key: 'volDropEMD',       group: 'drop',     label: 'panel.emd.dropVolume', unit: 'nL',    min: 5,  max: 5000,   decimals: 0, icon: 'mdi-water' },
	{ key: 'viscEMD',          group: 'drop',     label: 'panel.emd.viscosity',  unit: 'mPa·s', min: 1,  max: 100000, decimals: 0, icon: 'mdi-water-opacity' },
	{ key: 'nDropsEMD',        group: 'drop',     label: 'panel.emd.drops',      unit: '',      min: 1,  max: 9999,   decimals: 0, icon: 'mdi-counter' },
	{ key: 'tempEMD',          group: 'material', label: 'panel.emd.temperature',unit: '°C',    min: 20, max: 65,     decimals: 1, icon: 'mdi-thermometer' },
	{ key: 'alturaEMD',        group: 'position', label: 'panel.emd.height', unit: 'mm',    min: 1,  max: 120,    decimals: 1, icon: 'mdi-ruler' },
	{ key: 'cadenceAmountEMD', group: 'auto',     label: 'domotek.varios.Layers',unit: '',      min: 1,  max: 10,     decimals: 0, icon: 'mdi-layers' },
	{ key: 'calibDropsEMD',    group: 'calib',    label: 'panel.emd.dropsPerPoint', unit: '',   min: 20, max: 1000,   decimals: 0, icon: 'mdi-water' },
];

// Parámetros que, al cambiar, obligan a recalcular presión y tiempos
const RECALC_KEYS = ['volDropEMD', 'viscEMD', 'tempEMD'];

// Todo lo que se persiste en el fichero de variables del EMD
const SAVE_KEYS = [
	...EMD_PARAMS.map(p => p.key),
	'pressureEMD', 'tOpenEMD', 'tCycleEMD',
	'kEMD', 't0EMD', 'calibratedEMD', 'calibViscEMD', 'calibTempEMD',
	'enableEMD', 'cadenceEnableEMD', 'aplicarFinEMD', 'tempEnableEMD',
	'posxEMD', 'posyEMD',
];

const MACROS = '0:/macros/Scripts/EMD';
const VARS_FILE = '0:/sys/declare_variablesEMD.g';

export default {
	data() {
		return {
			pasos: 'S',
			bioReemplazar: false,
			params: EMD_PARAMS,

			dialogConfirm: false,
			nombreMacro: '',
			codigo: '',

			dialogParam: false,
			editingParam: null,
			paramInput: '',
			paramError: '',

			snackbar: false,
			snackbarValor: '',

			// Ventana de cálculos
			dialogCalc: false,

			// Calibración
			dialogCalibConfirm: false,
			calibPoints: [],
			calibRunning: false,
			calibResult: null,
			calibError: '',

			// Canvas
			// --- Altura del panel: se ajusta a la pantalla (igual que ES) ---
			windowHeight: window.innerHeight,
			panelOffsetPx: 80,		// alto de la cabecera del stepper + márgenes (subir si vuelve a salir scroll)
			panelMinPx: 350,		// altura mínima de las tarjetas
			panelMaxPx: 400,		// altura máxima (para que en el PC no queden tarjetas enormes)
			canvasSizePx: 200,
			gridRealSizeMm: 142,
			cellSizeMm: 10,
			selectedPointMm: { x: null, y: null },
			selectedPointPx: { x: null, y: null },
			ctx: null,

			// Coordenadas manuales
			dialogManualCoords: false,
			manualX: '',
			manualY: '',
			manualXError: '',
			manualYError: '',
			activeManualInput: 'x',
			minCoord: 0,
			maxCoord: 142,

			keypadLayout: [
				[{ text: '7', value: '7' }, { text: '8', value: '8' }, { text: '9', value: '9' }],
				[{ text: '4', value: '4' }, { text: '5', value: '5' }, { text: '6', value: '6' }],
				[{ text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }],
				[{ text: '.', value: '.' }, { text: '0', value: '0' }, { icon: 'mdi-backspace-outline', value: 'DEL', color: 'blue lighten-4' }],
				[{ value: 'EMPTY' }, { text: 'C', value: 'CLEAR', color: 'blue lighten-4' }, { value: 'EMPTY' }],
			],
		};
	},

	computed: {
		...mapState('machine/model', {
			globals: state => state.global,
			status: state => state.state.status,
		}),

		enableEMD:        { get() { return !!this.g('enableEMD') },        set(v) { this.setGlobal('enableEMD', v) } },
		cadenceEnableEMD: { get() { return !!this.g('cadenceEnableEMD') }, set(v) { this.setGlobal('cadenceEnableEMD', v) } },
		aplicarFinEMD:    { get() { return !!this.g('aplicarFinEMD') },    set(v) { this.setGlobal('aplicarFinEMD', v) } },
		tempEnableEMD: {
			get() { return !!this.g('tempEnableEMD') },
			set(v) {
				this.setGlobal('tempEnableEMD', v);
				// La temperatura cambia la viscosidad efectiva → recalcular
				this.$nextTick(() => this.aplicarCalculo({ tempEnable: v }));
			},
		},

		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioPasos() {
			return [
				{ id: 'S', texto: this.$t('domotek.proc.summary') },
				{ id: '1', texto: `1 · ${this.$t('domotek.proc.drop')}` },
				{ id: '2', texto: `2 · ${this.$t('panel.emd.calibration')}` },
				{ id: '3', texto: `3 · ${this.$t('domotek.proc.point')}` },
				{ id: '4', texto: `4 · ${this.$t('domotek.proc.auto')}` }
			];
		},
		bioCalc() { // presión, apertura y ciclo calculados
			const ok = this.calculo.ok;
			return [
				{ id: 'P', texto: this.$t('panel.emd.pressure'), valor: ok ? this.calculo.P : '—', unidad: ok ? 'bar' : '' },
				{ id: 't', texto: this.$t('panel.emd.openTime'), valor: ok ? this.calculo.t : '—', unidad: ok ? 'ms' : '' },
				{ id: 'c', texto: this.$t('panel.emd.cycleTime'), valor: ok ? this.calculo.cycle : '—', unidad: ok ? 'ms' : '' }
			];
		},
		bioEstadoCalib() {
			if (!this.g('calibratedEMD')) { return 'no'; }
			return Number(this.g('calibViscEMD')) !== this.viscRef ? 'est' : 'ok';
		},
		bioCadencia() { return Number(this.g('cadenceAmountEMD')) || 1; },
		bioColores() {
			const c = paletaBio();
			return this.temaBio
				? { rejilla: c.linea, borde: c.linea2, punto: c.acento, puntoBorde: c.acentoBg }
				: { rejilla: '#ddd', borde: '#999', punto: 'red', puntoBorde: 'darkred' };
		},
		bioValorActual() {
			const p = this.editingParam;
			if (!p) { return '—'; }
			if (p.key === 'tempEMD' && !this.tempEnableEMD) { return this.$t('domotek.keypad.off'); }
			const v = this.g(p.key);
			if (v === undefined || v === null || v === '') { return '—'; }
			return `${Number(v).toFixed(p.decimals)}${p.unit ? ' ' + p.unit : ''}`;
		},
		bioAtajosParam() { // valores típicos de cada parámetro, solo los que caben en su rango
			const p = this.editingParam;
			if (!p) { return []; }
			const tipicos = {
				volDropEMD: [50, 100, 200, 500], viscEMD: [10, 100, 1000, 10000], nDropsEMD: [1, 10, 50, 100],
				tempEMD: [25, 30, 37, 45], cadenceAmountEMD: [1, 2, 3, 5], calibDropsEMD: [50, 100, 200, 500], alturaEMD: [5, 10, 20, 50]
			}[p.key] || [];
			return tipicos.filter(v => v >= p.min && v <= p.max);
		},
		// Editando la temperatura con el calentado apagado: no hace falta valor
		tempOffEditing() {
			return !!this.editingParam && this.editingParam.key === 'tempEMD' && !this.tempEnableEMD;
		},
		maquinaLibre() {
			return this.status === 'idle' || this.status === 'paused';
		},

		// ---------- Modelo ----------
		viscRef() {
			return Number(this.g('viscEMD')) || 0;
		},
		tempActual() {
			return this.tempEnableEMD ? Number(this.g('tempEMD')) || EMD_MACHINE.tRef : EMD_MACHINE.tRef;
		},
		viscActual() {
			return viscAt(this.viscRef, this.tempActual);
		},
		kActual() {
			return Number(this.g('kEMD')) || EMD_MACHINE.kDefault;
		},
		t0Actual() {
			const t0 = Number(this.g('t0EMD'));
			return isNaN(t0) ? EMD_MACHINE.t0Default : t0;
		},
		calculo() {
			return solve(Number(this.g('volDropEMD')), this.viscActual, this.kActual, this.t0Actual);
		},
		estadoCalib() {
			if (!this.g('calibratedEMD')) {
				return { color: 'grey lighten-2', texto: this.$t('panel.emd.notCalibrated') };
			}
			if (Number(this.g('calibViscEMD')) !== this.viscRef) {
				return { color: 'orange lighten-3', texto: this.$t('panel.emd.estimated', { visc: this.g('calibViscEMD') }) };
			}
			return { color: 'green lighten-3', texto: this.$t('panel.emd.calibrated') };
		},

		panelCardPx() {
			return Math.round(Math.min(this.panelMaxPx, Math.max(this.panelMinPx, this.windowHeight - this.panelOffsetPx)));
		},

		// ---------- Canvas ----------
		pxPerMm() {
			return this.gridRealSizeMm ? this.canvasSizePx / this.gridRealSizeMm : 1;
		},
		cellSizePx() {
			return this.cellSizeMm * this.pxPerMm;
		},
		isPointSelected() {
			return this.selectedPointMm.x !== null && this.selectedPointMm.y !== null;
		},
	},

	methods: {
		...mapActions('machine', ['sendCode']),

		// ---------- Utilidades ----------
		g(key) {
			return this.globals ? this.globals[key] : undefined;
		},
		setGlobal(key, value) {
			return this.sendCode(`set global.${key} = ${value}`);
		},
		param(key) {
			return this.params.find(p => p.key === key);
		},
		paramsByGroup(group) {
			return this.params.filter(p => p.group === group);
		},
		bioNum(p) { // valor sin unidad
			const v = this.g(p.key);
			if (v === undefined || v === null || v === '') { return '—'; }
			return Number(v).toFixed(p.decimals);
		},
		fmt(p) {
			const v = this.g(p.key);
			if (v === undefined || v === null) return '—';
			const num = Number(v).toFixed(p.decimals);
			return p.unit ? `${num} ${p.unit}` : num;
		},
		rangoTexto(p) {
			return `${p.min} – ${p.max}${p.unit ? ' ' + p.unit : ''}`;
		},
		closeDialog() {
			this.$emit('close-dialog');
		},
		CambiaStep(newStep) {
			this.pasos = newStep;
		},
		onWindowResize() {
			this.windowHeight = window.innerHeight;
			if (this.temaBio) {
				// domotek: la rejilla cabe en el hueco libre (cabecera 64 + pie 52 + márgenes y texto ≈ 190 px)
				const lado = Math.round(Math.max(160, Math.min(420, window.innerHeight - 190, (window.innerWidth - 440) * 0.9)));
				if (lado !== this.canvasSizePx) {
					this.canvasSizePx = lado;
					this.$nextTick(() => { this.updatePxFromMm(); this.drawGrid(); });
				}
			}
		},

		/*
		 * Recalcula y escribe presión, apertura y ciclo en las globals que usan las macros.
		 * `override` permite usar un valor recién enviado antes de que el object model se actualice.
		 */
		aplicarCalculo(override = {}) {
			// Sin "??" para no depender de la versión de Babel del proyecto
			const pick = (key, fallback) => (override[key] !== undefined ? override[key] : fallback);
			const vol = pick('volDropEMD', Number(this.g('volDropEMD')));
			const muRef = pick('viscEMD', this.viscRef);
			const tempOn = pick('tempEnable', this.tempEnableEMD);
			const T = tempOn ? pick('tempEMD', Number(this.g('tempEMD')) || EMD_MACHINE.tRef) : EMD_MACHINE.tRef;
			const k = pick('kEMD', this.kActual);
			const t0 = pick('t0EMD', this.t0Actual);

			const r = solve(vol, viscAt(muRef, T), k, t0);
			if (!r.ok) return r;
			this.setGlobal('pressureEMD', r.P);
			// El driver del solenoide trabaja en µs
			this.setGlobal('tOpenEMD', Math.round(r.t * 1000));
			this.setGlobal('tCycleEMD', Math.round(r.cycle * 1000));
			return r;
		},

		// ---------- Diálogo numérico genérico ----------
		openParamDialog(p) {
			this.editingParam = p;
			const v = this.g(p.key);
			this.paramInput = v === undefined || v === null ? '' : String(v);
			this.paramError = '';
			this.bioReemplazar = true; // domotek: la primera tecla sustituye el valor actual
			this.dialogParam = true;
		},
		handleParamKeyPress(key) {
			let val = this.paramInput;
			if (this.bioReemplazar && key !== 'DEL') { val = ''; }
			this.bioReemplazar = false;
			if (key === 'CLEAR') val = '';
			else if (key === 'DEL') val = val.slice(0, -1);
			else {
				if (key === '.' && (val.includes('.') || this.editingParam.decimals === 0)) return;
				if (val.length < 7) val += key;
			}
			this.paramInput = val;
		},
		validateParam() {
			const p = this.editingParam;
			const raw = this.paramInput;
			if (raw === '') { this.paramError = this.$t('domotek.varios.valorRequerido'); return false; }
			const num = Number(raw);
			if (isNaN(num)) { this.paramError = this.$t('panel.ultraviolet.invalidOrRange'); return false; }
			if (p.decimals === 0 && !Number.isInteger(num)) { this.paramError = this.$t('domotek.varios.numeroEntero'); return false; }
			if (num < p.min || num > p.max) {
				this.paramError = this.$t('panel.ultraviolet.rangeErrorDetailed', { min: p.min, max: p.max, val: raw });
				return false;
			}
			this.paramError = '';
			return true;
		},
		confirmParam() {
			if (this.tempOffEditing) { this.dialogParam = false; return; }
			if (!this.validateParam()) return;
			const p = this.editingParam;
			const value = Number(this.paramInput);
			this.setGlobal(p.key, value);
			// Con la temperatura se confirma también que el calentado está activo (el object model puede ir con retraso)
			if (RECALC_KEYS.includes(p.key)) this.aplicarCalculo(p.key === 'tempEMD' ? { tempEMD: value, tempEnable: true } : { [p.key]: value });
			if (p.key === 'viscEMD') this.prepareCalibration(value);
			this.snackbarValor = `${value.toFixed(p.decimals)}${p.unit ? ' ' + p.unit : ''}`;
			this.snackbar = true;
			this.dialogParam = false;
		},

		// ---------- Calibración ----------
		prepareCalibration(muRef = this.viscRef) {
			this.calibPoints = muRef > 0 ? calibrationGrid(viscAt(muRef, this.tempActual)) : [];
			this.calibResult = null;
			this.calibError = '';
		},
		async runCalibration() {
			if (!this.calibPoints.length) this.prepareCalibration();
			const C = Number(this.g('calibDropsEMD')) || 100;
			this.calibRunning = true;
			this.calibResult = null;
			this.calibError = '';
			this.calibPoints.forEach(pt => { pt.V = null; pt.state = 'pending'; });

			try {
				for (const pt of this.calibPoints) {
					pt.state = 'running';
					// Marca "sin resultado" y espera a que la macro escriba el volumen en la global.
					// No se usa el texto de respuesta: los echo de macros anidadas no siempre llegan en ella.
					await this.sendCode('set global.calibVolEMD = -1');
					await this.waitGlobal('calibVolEMD', v => v === -1, 5000);
					const reply = await this.sendCode(`M98 P"${MACROS}/EMDCalibPoint.g" S${pt.P} B${Math.round(pt.t * 1000)} K${C}`);
					if (typeof reply === 'string' && /Error/i.test(reply)) throw new Error(reply);
					// Tiempo máximo: gotas × (ciclo + espera del sensor) + margen
					const maxMs = C * (pt.t + 20 + 400) + 30000;
					const v = await this.waitGlobal('calibVolEMD', x => typeof x === 'number' && x >= 0, maxMs);
					if (v === undefined) throw new Error(this.$t('panel.emd.calibNoReply'));
					pt.V = v;
					pt.state = 'done';
				}
				this.calibResult = fit(this.calibPoints, this.viscActual);
				if (!this.calibResult.ok) this.calibError = this.$t('panel.emd.fit_' + this.calibResult.reason);
			} catch (e) {
				this.calibError = e.message || String(e);
				this.calibPoints.forEach(pt => { if (pt.state === 'running') pt.state = 'pending'; });
			} finally {
				this.calibRunning = false;
			}
		},
		// Espera a que una global del object model cumpla una condición; devuelve su valor o undefined si vence el tiempo
		waitGlobal(key, cond, timeoutMs) {
			return new Promise(resolve => {
				const t0 = Date.now();
				const check = () => {
					const v = this.g(key);
					if (cond(v)) return resolve(v);
					if (Date.now() - t0 > timeoutMs) return resolve(undefined);
					setTimeout(check, 250);
				};
				check();
			});
		},
		applyCalibration() {
			const r = this.calibResult;
			if (!r || !r.ok) return;
			this.setGlobal('kEMD', r.k);
			this.setGlobal('t0EMD', r.t0);
			this.setGlobal('calibratedEMD', true);
			this.setGlobal('calibViscEMD', this.viscRef);
			this.setGlobal('calibTempEMD', this.tempActual);
			this.aplicarCalculo({ kEMD: r.k, t0EMD: r.t0 });
			this.snackbarValor = 'OK';
			this.snackbar = true;
		},

		// ---------- Guardar / ejecutar ----------
		StartSaveSettings() {
			const lines = [`M28 "${VARS_FILE}"`, 'set global.variablesEMD = 1'];
			SAVE_KEYS.forEach(key => {
				const v = this.g(key);
				if (v !== undefined && v !== null) lines.push(`set global.${key} = ${v}`);
			});
			lines.push('M29');
			// Cargar los parámetros en el driver y guardarlos en su EEPROM (solo al guardar, para no desgastarla)
			lines.push(`M98 P"${MACROS}/EMDConfig.g" B${Math.round(this.g('tOpenEMD'))} C${Math.round(this.g('tCycleEMD'))} K${this.g('nDropsEMD') || 1} E1`);
			this.codigo = lines.join('\n');
			this.nombreMacro = this.$t('domotek.varios.confirm_settings');
			this.dialogConfirm = true;
		},
		StartTestShot() {
			this.codigo = `M98 P"${MACROS}/EMDTest.g"`;
			this.nombreMacro = this.$t('panel.emd.confirmTestShot');
			this.dialogConfirm = true;
		},
		StartEMD() {
			this.codigo = `M98 P"${MACROS}/EMDMacro.g"`;
			this.nombreMacro = this.$t('domotek.varios.confirm_EMD');
			this.dialogConfirm = true;
		},
		StartEMDPausing() {
			this.codigo = `M25\nM98 P"${MACROS}/EMDMacro.g"\nM24`;
			this.nombreMacro = this.$t('panel.emd.EMDJobInProgress');
			this.dialogConfirm = true;
		},

		// ---------- Canvas ----------
		initializeCanvasAndGrid() {
			this.$nextTick(() => {
				const canvas = this.$refs.gridCanvas;
				if (!canvas) return;
				this.ctx = canvas.getContext('2d');
				this.updateMarkerFromStore();
			});
		},
		updateMarkerFromStore() {
			const x = this.g('posxEMD');
			const y = this.g('posyEMD');
			if (x !== undefined && x !== null && y !== undefined && y !== null) {
				this.selectedPointMm = { x: parseFloat(x), y: parseFloat(y) };
				this.updatePxFromMm();
			} else {
				this.selectedPointMm = { x: null, y: null };
				this.selectedPointPx = { x: null, y: null };
			}
			this.drawGrid();
		},
		updatePxFromMm() {
			if (!this.isPointSelected) { this.selectedPointPx = { x: null, y: null }; return; }
			this.selectedPointPx = {
				x: this.selectedPointMm.x * this.pxPerMm,
				y: (this.gridRealSizeMm - this.selectedPointMm.y) * this.pxPerMm,
			};
		},
		drawGrid() {
			if (!this.ctx) return;
			const ctx = this.ctx;
			const size = this.canvasSizePx;
			ctx.clearRect(0, 0, size, size);
			const col = this.bioColores;
			ctx.strokeStyle = col.rejilla;
			ctx.lineWidth = 0.5;
			for (let i = 0; i <= size; i += this.cellSizePx) {
				ctx.beginPath(); ctx.moveTo(Math.round(i), 0); ctx.lineTo(Math.round(i), size); ctx.stroke();
				ctx.beginPath(); ctx.moveTo(0, Math.round(i)); ctx.lineTo(size, Math.round(i)); ctx.stroke();
			}
			ctx.strokeStyle = col.borde;
			ctx.lineWidth = 1;
			ctx.strokeRect(0, 0, size, size);
			if (this.selectedPointPx.x !== null) {
				ctx.beginPath();
				ctx.arc(this.selectedPointPx.x, this.selectedPointPx.y, this.temaBio ? 5 : 3, 0, 2 * Math.PI);
				ctx.fillStyle = col.punto;
				ctx.fill();
				ctx.strokeStyle = col.puntoBorde;
				ctx.stroke();
			}
		},
		setPoint(x, y) {
			this.selectedPointMm = { x, y };
			this.setGlobal('posxEMD', x.toFixed(2));
			this.setGlobal('posyEMD', y.toFixed(2));
			this.updatePxFromMm();
			this.drawGrid();
		},
		handleCanvasClick(event) {
			if (!this.ctx) return;
			const rect = this.$refs.gridCanvas.getBoundingClientRect();
			const px = Math.max(0, Math.min(event.clientX - rect.left, this.canvasSizePx));
			const py = Math.max(0, Math.min(event.clientY - rect.top, this.canvasSizePx));
			this.setPoint(px / this.pxPerMm, this.gridRealSizeMm - py / this.pxPerMm);
		},
		centerPoint() {
			const c = this.gridRealSizeMm / 2;
			this.setPoint(c, c);
		},

		// ---------- Coordenadas manuales ----------
		openManualCoordsDialog() {
			this.manualX = this.isPointSelected ? String(Math.round(this.selectedPointMm.x)) : '0';
			this.manualY = this.isPointSelected ? String(Math.round(this.selectedPointMm.y)) : '0';
			this.manualXError = '';
			this.manualYError = '';
			this.activeManualInput = 'x';
			this.dialogManualCoords = true;
		},
		coordError(val) {
			if (val === '') return '';
			const n = parseFloat(val);
			if (isNaN(n) || n < this.minCoord || n > this.maxCoord) {
				return this.$t('panel.ultraviolet.rangeErrorDetailed', { min: this.minCoord, max: this.maxCoord, val });
			}
			return '';
		},
		handleCoordKeyPress(key) {
			const field = this.activeManualInput === 'x' ? 'manualX' : 'manualY';
			let val = this[field];
			if (val === '0' && key !== '.' && key !== 'DEL' && key !== 'CLEAR') { val = ''; } // domotek
			if (key === 'CLEAR') val = '';
			else if (key === 'DEL') val = val.slice(0, -1);
			else {
				if (key === '.' && val.includes('.')) return;
				if (val.length < 5) val += key;
			}
			this[field] = val;
			this[field + 'Error'] = this.coordError(val);
		},
		confirmManualInput() {
			this.manualXError = this.coordError(this.manualX);
			this.manualYError = this.coordError(this.manualY);
			if (this.manualXError || this.manualYError) return;
			this.setPoint(parseFloat(this.manualX), parseFloat(this.manualY));
			this.dialogManualCoords = false;
		},

		// Filtro de teclado físico
		handleKeydownManualInput(event) {
			const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
			if (!allowed.includes(event.key)) { event.preventDefault(); return; }
			const input = event.target;
			if (event.key === '.' && input.value.includes('.')) { event.preventDefault(); return; }
			if (event.key.length === 1) {
				const newLength = input.value.length - (input.selectionEnd - input.selectionStart) + 1;
				if (newLength > 7) event.preventDefault();
			}
		},
	},

	watch: {
		bioColores() { this.$nextTick(() => this.drawGrid()); }, // domotek: repintar al cambiar de modo
		'globals.posxEMD'(v) { if (v !== this.selectedPointMm.x) this.updateMarkerFromStore(); },
		'globals.posyEMD'(v) { if (v !== this.selectedPointMm.y) this.updateMarkerFromStore(); },
		paramInput() { if (this.dialogParam) this.validateParam(); },
		pasos(v) {
			if (v === '3') this.initializeCanvasAndGrid();
			if (v === '2' && !this.calibRunning && !this.calibPoints.length) this.prepareCalibration();
		},
	},

	mounted() {
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
		this.$vuetify.goTo(0);
		this.initializeCanvasAndGrid();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onWindowResize);
	},
};
</script>
<!-- <style scoped>
	.FondoIzdaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FondoIzdaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
	.FondoDchaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FondoDchaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
	.FrenteIzdaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FrenteIzdaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
	.FrenteDchaRotDcha {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }
	.FrenteDchaRotIzda {fill-rule:evenodd;clip-rule:evenodd;fill:#0a21ad; }	
</style> -->
<template>
	<!-- domotek: calibración con el tema oscuro (3 pasos a pantalla completa) -->
	<div v-if="temaBio" class="bio-cal">
		<header class="bio-cal-cab">
			<button type="button" class="bio-volver" :aria-label="$t('domotek.tools.back')" @click="closeDialog"><v-icon>mdi-chevron-left</v-icon></button>
			<v-icon color="var(--bio-acento)">mdi-axis-arrow</v-icon>
			<span class="bio-cal-titulo">{{ $t('domotek.calibracion.calibrate_button') }}</span>
			<div style="flex: 1"></div>
			<ol class="bio-cal-pasos" :aria-label="$t('domotek.calibracion.steps')">
				<li v-for="p in pasosBio" :key="p.n">
					<button type="button" :class="{ activo: pasos == p.n, hecho: hechos[p.n] && pasos != p.n }" :aria-current="pasos == p.n ? 'step' : null" @click="pasos = p.n">
						<v-icon v-if="hechos[p.n] && pasos != p.n" small>mdi-check</v-icon>{{ p.i }} · {{ p.titulo }}
					</button>
				</li>
			</ol>
		</header>

		<!-- Paso 1: AUTO-CAL Z -->
		<main v-if="pasos == 1" class="bio-cal-cuerpo">
			<section class="bio-cal-tarjeta bio-cal-paso1">
				<svg class="bio-cal-dibujo" viewBox="0 0 220 200" aria-hidden="true">
					<rect x="10" y="168" width="200" height="12" rx="6" style="fill: var(--bio-sup2)"></rect>
					<rect x="88" y="140" width="40" height="28" rx="6" style="fill: var(--bio-sup3)"></rect>
					<rect x="84" y="18" width="48" height="70" rx="8" style="fill: var(--bio-sup3)"></rect>
					<path d="M94 88h28l-8 24h-12z" style="fill: var(--bio-linea2)"></path>
					<path d="M108 116v20M100 128l8 8 8-8" style="stroke: var(--bio-acento)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
					<circle cx="108" cy="140" r="5" style="fill: var(--bio-acento)"></circle>
					<path d="M150 36h28M150 36v130M150 166h12" style="stroke: var(--bio-apagado)" stroke-width="2" stroke-dasharray="5 5" fill="none"></path>
					<text x="162" y="106" style="fill: var(--bio-tenue)" font-size="14" font-family="IBM Plex Sans, sans-serif">Z</text>
				</svg>
				<div class="bio-cal-texto">
					<h2>{{ $t('domotek.calibracion.autoCal') }}</h2>
					<p>{{ $t('domotek.calibracion.autoCalHelp') }}</p>
					<ul class="bio-cal-check">
						<li :class="{ ok: sondaMontada }"><v-icon small>{{ sondaMontada ? 'mdi-check' : 'mdi-alert-outline' }}</v-icon>{{ sondaMontada ? $t('domotek.calibracion.probeOk') : $t('domotek.calibracion.probeMissing') }}</li>
						<li :class="{ ok: plataformaLibre }"><button type="button" class="bio-cal-marcar" @click="plataformaLibre = !plataformaLibre"><v-icon small>{{ plataformaLibre ? 'mdi-check' : 'mdi-circle-outline' }}</v-icon>{{ $t('domotek.calibracion.platformClear') }}</button></li>
					</ul>
					<button v-if="!(calibrando && numeroActual === 0)" type="button" class="bio-cal-principal" :disabled="calibrando" @click="SelectCalibration(0)">{{ $t('domotek.calibracion.startCal') }}</button>
					<div v-else class="bio-cal-progreso"><v-progress-linear indeterminate rounded height="6" color="var(--bio-acento)"></v-progress-linear><span>{{ $t('domotek.calibracion.running') }}</span></div>
				</div>
			</section>
			<footer class="bio-cal-pie">
				<button type="button" class="bio-cal-sec" :disabled="calibrando" @click="siguientePaso">{{ $t('domotek.calibracion.skip') }}</button>
				<button type="button" class="bio-cal-sec" :class="{ listo: hechos[1] }" :disabled="!hechos[1] || calibrando" @click="siguientePaso">{{ $t('domotek.calibracion.continue') }}</button>
			</footer>
		</main>

		<!-- Paso 2: Nivelado -->
		<main v-else-if="pasos == 2" class="bio-cal-cuerpo bio-cal-dos">
			<section class="bio-cal-tarjeta bio-cal-cama" :aria-label="$t('domotek.calibracion.platformLeveling')">
				<div class="bio-cal-cama-placa">
					<span class="bio-cal-lado arriba">{{ $t('domotek.calibracion.back') }}</span>
					<div v-for="e in esquinas" :key="e.id" class="bio-cal-esquina" :class="e.estado" :aria-label="e.descripcion">
						<v-icon v-if="e.icono">{{ e.icono }}</v-icon>
						<strong>{{ e.texto }}</strong>
						<span>{{ e.unidad }}</span>
					</div>
					<span class="bio-cal-lado abajo">{{ $t('domotek.calibracion.front') }}</span>
				</div>
			</section>
			<section class="bio-cal-texto">
				<h2>{{ $t('domotek.calibracion.platformLeveling') }}</h2>
				<p>{{ $t('domotek.calibracion.levelingHelp') }}</p>
				<div class="bio-cal-leyenda">
					<span><i class="verde"></i>{{ $t('domotek.calibracion.greenLegend') }}</span>
					<span><i class="rojo"></i>{{ $t('domotek.calibracion.redLegend') }}</span>
				</div>
				<div v-if="hayMedida" class="bio-cal-resumen" :class="{ ok: !porAjustar.length }">
					{{ porAjustar.length ? $tc('domotek.calibracion.cornersToAdjust', porAjustar.length, [porAjustar.length, porAjustar.join(', ')]) : $t('domotek.calibracion.allLevel') }}
				</div>
				<div style="flex: 1"></div>
				<button v-if="!calibrandoPaso2" type="button" class="bio-cal-principal" :disabled="calibrando" @click="SelectCalibration(1)">{{ hayMedida ? $t('domotek.calibracion.measureAgain') : $t('domotek.calibracion.measure') }}</button>
				<div v-else class="bio-cal-progreso"><v-progress-linear indeterminate rounded height="6" color="var(--bio-acento)"></v-progress-linear><span>{{ $t('domotek.calibracion.leveling') }}</span></div>
				<div class="bio-cal-pie dentro">
					<button type="button" class="bio-cal-sec" :disabled="calibrando" @click="pasos = 1">{{ $t('domotek.tools.back') }}</button>
					<button type="button" class="bio-cal-sec listo" :disabled="calibrando" @click="siguientePaso">{{ $t('domotek.calibracion.continue') }}</button>
				</div>
			</section>
		</main>

		<!-- Paso 3: Ajuste manual -->
		<main v-else class="bio-cal-cuerpo">
			<section class="bio-cal-mandos">
				<div class="bio-cruz">
					<div></div>
					<code-btn class="bio-flecha" :disabled="bloqueadoAjuste" :code="modeloMaquina != '2A' ? `M120\nG91\nG1 Y${pasoAjuste} F600\nG90\nM121` : `M120\nG91\nG1 Y-${pasoAjuste} F600\nG90\nM121`" no-wait><v-icon>mdi-arrow-up</v-icon>Y</code-btn>
					<div></div>
					<code-btn class="bio-flecha col" :disabled="bloqueadoAjuste" :code="modeloMaquina != '2A' ? `M120\nG91\nG1 X${pasoAjuste} F600\nG90\nM121` : `M120\nG91\nG1 X-${pasoAjuste} F600\nG90\nM121`" no-wait><v-icon>mdi-arrow-left</v-icon>X</code-btn>
					<div class="bio-cruz-centro">
						<div class="bio-segmentos" role="group" :aria-label="$t('domotek.movePanel.toolToMove')">
							<code-btn v-for="i in (modeloMaquina != '2A' ? [0, 1, 2, 3] : [0, 1])" :key="i" class="bio-seg" :class="{ activo: toolActiva === i }" :code="toolActiva === i ? 't-1' : `t${i}`" no-wait>{{ $t('domotek.tools.T' + i + 'Mini') }}</code-btn>
						</div>
					</div>
					<code-btn class="bio-flecha col" :disabled="bloqueadoAjuste" :code="boards.length > 2 ? `M120\nG91\nG1 X-${pasoAjuste} F600\nG90\nM121` : `M120\nG91\nG1 X${pasoAjuste} F600\nG90\nM121`" no-wait><v-icon>mdi-arrow-right</v-icon>X</code-btn>
					<div></div>
					<code-btn class="bio-flecha" :disabled="bloqueadoAjuste" :code="boards.length > 2 ? `M120\nG91\nG1 Y-${pasoAjuste} F600\nG90\nM121` : `M120\nG91\nG1 Y${pasoAjuste} F600\nG90\nM121`" no-wait><v-icon>mdi-arrow-down</v-icon>Y</code-btn>
					<div></div>
				</div>
				<div class="bio-z">
					<code-btn class="bio-flecha" :disabled="bloqueadoAjuste" :code="`M120\nG91\nG1 Z${pasoAjuste} F600\nG90\nM121`" no-wait><v-icon>mdi-arrow-up</v-icon></code-btn>
					<span class="bio-tenue">Z</span>
					<code-btn class="bio-flecha" :disabled="bloqueadoAjuste" :code="`M120\nG91\nG1 Z-${pasoAjuste} F600\nG90\nM121`" no-wait><v-icon>mdi-arrow-down</v-icon></code-btn>
				</div>
				<div class="bio-cal-pos">
					<span class="bio-tenue">{{ toolActiva >= 0 ? $t('domotek.calibracion.positionOf', [`T${toolActiva + 1}`]) : $t('domotek.desktop.position') }}</span>
					<span v-for="e in ejesTool" :key="e.et">{{ e.et }} <strong :class="{ 'sin-home': !e.eje.homed }">{{ e.eje.letter === 'Z' ? $displayZ(e.eje.userPosition, false) : $display(e.eje.userPosition, 1) }}</strong></span>
					<div style="flex: 1"></div>
					<template v-if="offsetZ !== null">
						<span class="bio-tenue">{{ $t('domotek.calibracion.savedOffset') }}</span>
						<span class="bio-cal-offset">{{ offsetZ }} mm</span>
					</template>
				</div>
			</section>
			<footer class="bio-cal-pie bio-cal-pie3">
				<div class="bio-segmentos bio-pasos" role="group" :aria-label="$t('domotek.movePanel.stepSize')">
					<button v-for="d in [0.1, 0.5, 1, 5, 25]" :key="d" type="button" class="bio-seg" :class="{ activo: pasoAjuste === d }" @click="pasoAjuste = d">{{ $display(d, d >= 1 ? 0 : 1) }}</button>
					<span class="bio-tenue bio-mm">mm</span>
				</div>
				<div style="flex: 1"></div>
				<button type="button" class="bio-cal-home" :class="{ ok: todosHomed }" :disabled="bloqueadoAjuste" @click="ejecutarHome">{{ $t('domotek.calibracion.homeAll') }}</button>
				<button type="button" class="bio-cal-sec" :disabled="!todosHomed || bloqueadoAjuste" @click="dialogOffset = true">{{ $t('domotek.calibracion.saveOffset') }}</button>
				<button type="button" class="bio-cal-principal corto" @click="terminar">{{ $t('domotek.calibracion.finish') }}</button>
			</footer>
		</main>

		<!-- Confirmaciones -->
		<v-dialog v-model="dialog" max-width="480">
			<v-card class="bio-cal-dialogo">
				<v-card-title>{{ nombreCal ? $t(nombreCal) : '' }}</v-card-title>
				<v-card-actions>
					<button type="button" class="bio-cal-sec" @click="dialog = false">{{ $t('generic.cancel') }}</button>
					<button type="button" class="bio-cal-principal corto" :disabled="calibrando" @click="ConfirmarCalibracion">{{ $t('domotek.varios.yes') }}</button>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogOffset" max-width="520">
			<v-card class="bio-cal-dialogo">
				<v-card-title>{{ $t('domotek.calibracion.calibrate_option') }}</v-card-title>
				<v-card-actions>
					<button type="button" class="bio-cal-sec" @click="dialogOffset = false">{{ $t('generic.cancel') }}</button>
					<button type="button" class="bio-cal-sec listo" :disabled="bloqueadoAjuste" @click="ejecutarOffset('XY')">X-Y</button>
					<button type="button" class="bio-cal-principal corto" :disabled="bloqueadoAjuste" @click="ejecutarOffset('Z')">Z</button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>

	<v-row v-else class="mb-0 pb-0"  style="background-color: #e3f2fd ;">
		<v-col class="ml-2 mt-2">
			<v-icon>mdi-axis-arrow</v-icon><span class="mt-5 ml-2">{{ $t('domotek.calibracion.calibrate_button') }}</span>
			<!-- <v-icon>mdi-radiobox-marked</v-icon><span class="mt-5 ml-2">Calibration</span> -->
		</v-col>
		<v-col cols="12" align="center">
			<v-stepper v-model="pasos" non-linear class="blue lighten-5"  >
				<v-stepper-header v-if="modeloMaquina != 'HK'">
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
						<v-icon large> mdi-axis-arrow </v-icon>
					</v-btn>
					<v-stepper-step editable step="1" color="#0a21ad">
					</v-stepper-step>

					<v-divider></v-divider>

					<v-stepper-step editable step="2" color="#0a21ad">
					</v-stepper-step>

					<v-divider></v-divider>

					<v-stepper-step editable step="3" color="#0a21ad">
					</v-stepper-step>

					<!-- <v-divider></v-divider> -->

					<!-- <v-stepper-step editable step="4" color="teal"> 
						
					</v-stepper-step> -->
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-header v-else>
					<v-btn icon style="margin: 16px 0 0 16px; background:" v-on:click="closeDialog">
						<v-icon large> mdi-axis-arrow </v-icon>
					</v-btn>
					<v-stepper-step editable step="1" color="#0a21ad">
					</v-stepper-step>

					

					<v-divider></v-divider>

					<v-stepper-step editable step="3" color="#0a21ad">
					</v-stepper-step>

					<!-- <v-divider></v-divider> -->

					<!-- <v-stepper-step editable step="4" color="teal"> 
						
					</v-stepper-step> -->
					<v-btn icon style="margin: 18px 10px 0 0;" v-on:click="closeDialog">
						<v-img  src="@/assets/exit-2860.svg" contain max-height="30" max-width="40"></v-img>
					</v-btn>
				</v-stepper-header>
				<v-stepper-items>
					<v-stepper-content step="1" class="">
						<v-card class="mb-4" color="blue lighten-4"	height="270px" elevation="0">
								<v-row class="pa-5">
									<v-col cols="12" class="mt-7">
										{{ $t('domotek.calibracion.autoCal') }}
									</v-col>
									<v-col cols="12">
										<v-btn class="mt-8 blue lighten-5" @click="SelectCalibration(0)" :disabled="calibrando" rounded block>
											<v-row>
												<v-col cols="12">
													<span>{{$t('domotek.calibracion.start')}}</span>
												</v-col>
											</v-row>
										</v-btn>
									</v-col>
								</v-row>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="2">
						<v-card class="mb-4" color="blue lighten-4"	height="270px">
							<v-row class="pt-3">
								<v-col cols="2"/>
								<v-col cols="2" class="mt-1 " >
									<icon-base v-if="valFOI == 0" width="96" height="96" icon-name="write"><icon-izquierda /></icon-base>	
									<icon-base v-if="valFOI < 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-left-left /> <icon-turn-value offsetX="75" :valor = nivelFOI /></icon-base>
									<icon-base v-if="valFOI > 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-right-left /> <icon-turn-value offsetX="75" :valor = nivelFOI /></icon-base>
								</v-col>
								<v-col cols="4" class="mt-4 text-center">
									<div style="font-size: 1.2em;">
										{{ $t('domotek.calibracion.platformLeveling') }}
									</div>
									<div class="mt-3 text-left" style="font-size: 0.85em; display: inline-block;">
										<div class="d-flex align-center mb-2">
											<div class="mr-2" style="width: 12px; height: 12px; background-color: green; border-radius: 50%;"></div>
											<span>{{ $t('domotek.calibracion.greenLegend') }}</span>
										</div>
										<div class="d-flex align-center">
											<div class="mr-2" style="width: 12px; height: 12px; background-color: red; border-radius: 50%;"></div>
											<span>{{ $t('domotek.calibracion.redLegend') }}</span>
										</div>
									</div>
								</v-col>
								<v-col cols="2" class="mt-1 ">
									<icon-base v-if="valFOD == 0" width="96" height="96" icon-name="write"><icon-derecha /></icon-base>	
									<icon-base v-if="valFOD < 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-left-right /> <icon-turn-value offsetX="145" :valor = nivelFOD /></icon-base>
									<icon-base v-if="valFOD > 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-right-right /> <icon-turn-value offsetX="145" :valor = nivelFOD /></icon-base>		
								</v-col>
								<v-col cols="2"/>
							</v-row>
							<v-row class="pb-1">
								<v-col cols="2"/>
								<v-col cols="2" class="mt-1 ">
									<icon-base v-if="valFRI == 0" width="96" height="96" icon-name="write"><icon-izquierda /></icon-base>	
									<icon-base v-if="valFRI < 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-left-left /> <icon-turn-value offsetX="75" :valor = nivelFRI /></icon-base>
									<icon-base v-if="valFRI > 0" width="96" height="96" icon-name="write"><icon-izquierda /><icon-turn-right-left /> <icon-turn-value offsetX="75" :valor = nivelFRI /></icon-base>
								</v-col>
								<v-col cols="4" class="mt-9">
									<v-btn v-if="!calibrandoPaso2" class="mt-1 blue lighten-5" @click="SelectCalibration(1)" :disabled="calibrando" rounded block>
										<v-row>
											<v-col cols="12" class="mt-1">
												<span>{{ $t('domotek.calibracion.start') }}</span>
											</v-col>
										</v-row>
									</v-btn>

									<div v-else class="mt-1">
										<v-progress-linear
											indeterminate
											rounded
											height="8"
											color="blue darken-2"
										></v-progress-linear>
										<div class="text-center mt-2" style="font-size: 0.85em;">
											{{ $t('domotek.calibracion.leveling') }}
										</div>
									</div>
								</v-col>
								<v-col cols="2" class="mt-1 ">
									<icon-base v-if="valFRD == 0" width="96" height="96" icon-name="write"><icon-derecha /></icon-base>	
									<icon-base v-if="valFRD < 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-left-right /> <icon-turn-value offsetX="145" :valor = nivelFRD /></icon-base>
									<icon-base v-if="valFRD > 0" width="96" height="96" icon-name="write"><icon-derecha /><icon-turn-right-right /> <icon-turn-value offsetX="145" :valor = nivelFRD /></icon-base>
								</v-col>
								<v-col cols="2"/>
							</v-row>	
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				<v-stepper-items>
					<v-stepper-content step="3">
						<v-card class="mb-4" color="blue lighten-4"	height="270px">
								<movement-panel-calibration :calibrando-externo="calibrando"></movement-panel-calibration>
						</v-card>
					</v-stepper-content>
				</v-stepper-items>
				
			</v-stepper>
		</v-col>
		<v-col cols="12" v-if="$store.state.nivelUsuario >= 3">
			<calibration-file-list></calibration-file-list>
		</v-col>
		<v-col class="mb-0 pb-0">
			<v-dialog v-model="dialog" max-width="500">
				<v-card>                                                                                  
					<v-card-title class="headline">
						<!-- You sure want to select {{nombreCal}} calibration? -->
						{{ $t(nombreCal) }}
					</v-card-title>
					<v-card-actions>
						<!-- <v-spacer></v-spacer> -->
						<v-row>
							<v-col cols="6" align="right">
								<v-btn width="90" height="90" color="green darken-1" text @click="dialog = false,ChangeTool(numTool),toolClick = true" outlined rounded>
									<code-btn width="90" height="90"  color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col>
								<v-btn width="90" height="90" color="green darken-1" text outlined rounded :disabled="calibrando" @click="ConfirmarCalibracion">
									<code-btn width="90" height="90" color="green lighten-3" rounded>
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

//import { registerRoute } from '..'
import { mapState } from 'vuex'

export default {
	/* install() {
		// Register a route via Files -> Macros
		registerRoute(this, {
			Files: {
				Calibration: {
					icon: 'mdi-radiobox-marked',
					caption: 'Calibración',
					path: '/Files/Calibracion',
					nivel: 0 //luis - control de usuario

				}
			}
		});
	}, */
	data(){
		return{
			dialog: false,
			codigo:null,
			nombreCal: null,
			pasos: 1,
			calibrando: false,
			numeroActual: null,
			// domotek: tema oscuro
			hechos: { 1: false, 2: false, 3: false },
			plataformaLibre: false,
			pasoAjuste: 1,
			dialogOffset: false,
			ajustando: false
			//nivelFOI: -1,
			//nivelFOD: 1,
			//nivelFRI: -1,
			//nivelFRD: 1,

		}
	},
	computed:{
		...mapState('machine/model', {
				boards: state => state.boards,
			}),
			nivelFOI: {
				get() {
					const valor_nivelFOI = this.$store.state.machine.model.global.calibrPnt0;
					return (valor_nivelFOI);
				}
			},
			valFOI: {
				get() {
					const valor_valFOI = this.$store.state.machine.model.global.calibrVal0;
					return (valor_valFOI);
				}
			},
			nivelFRI: {
				get() {
					const valor_nivelFRI = this.$store.state.machine.model.global.calibrPnt1;
					return (valor_nivelFRI);
				}
			},
			valFRI: {
				get() {
					const valor_valFRI = this.$store.state.machine.model.global.calibrVal1;
					return (valor_valFRI);
				}
			},
			nivelFRD: {
				get() {
					const valor_nivelFRD = this.$store.state.machine.model.global.calibrPnt2;
					return (valor_nivelFRD);
				}
			},
			valFRD: {
				get() {
					const valor_valFRD = this.$store.state.machine.model.global.calibrVal2;
					return (valor_valFRD);
				}
			},
			nivelFOD: {
				get() {
					const valor_nivelFOD = this.$store.state.machine.model.global.calibrPnt3;
					return (valor_nivelFOD);
				}
			},
			valFOD: {
				get() {
					const valor_valFOD = this.$store.state.machine.model.global.calibrVal3;
					return (valor_valFOD);
				}
			},
			modeloMaquina: {
				get() {
						try {
								return this.$store.state.machine.model.global.MachineModel ;
						} catch (error) {
								console.log(`error CalibrationPanel.vue modeloMaquina`);
								return "2A";
						}
				}
			},
			temaBio() { return this.$store.state.settings.temaBio; }, // domotek
			g() { return this.$store.state.machine.model.global || {}; },
			pasosBio() {
				const lista = [{ n: 1, titulo: 'AUTO-CAL Z' }];
				if (this.modeloMaquina != 'HK') { lista.push({ n: 2, titulo: this.$t('domotek.calibracion.levelingShort') }); }
				lista.push({ n: 3, titulo: this.$t('domotek.calibracion.manualShort') });
				return lista.map((p, k) => ({ ...p, i: k + 1 }));
			},
			sondaMontada() { // AUTO-CAL es el tipo de tool 15
				for (let i = 0; i < 4; i++) { if (this.g['T' + i] == 15) { return true; } }
				return false;
			},
			esquinas() {
				const def = [
					{ id: 0, nombre: this.$t('domotek.calibracion.backLeft') },
					{ id: 3, nombre: this.$t('domotek.calibracion.backRight') },
					{ id: 1, nombre: this.$t('domotek.calibracion.frontLeft') },
					{ id: 2, nombre: this.$t('domotek.calibracion.frontRight') }
				];
				// Sin valor = no existe, no es número, o 0 vueltas sin sentido de giro (valores iniciales).
				// La esquina de referencia nunca recibe número: si las demás ya tienen valor, se pinta en verde.
				const datos = def.map(e => {
					const pnt = this.g['calibrPnt' + e.id];
					const val = this.g['calibrVal' + e.id];
					const n = parseFloat(pnt);
					const conValor = pnt !== undefined && pnt !== null && pnt !== '' && !isNaN(n) && !(n === 0 && (!val || val == 0));
					return { e, n, val, conValor };
				});
				const algunaMedida = datos.some(d => d.conValor);
				return datos.map(({ e, n, val, conValor }) => {
					let estado, icono, texto;
					if (!algunaMedida) {
						estado = 'sin'; icono = ''; texto = '—';
					} else if (!conValor) {
						estado = 'ok'; icono = 'mdi-check'; texto = this.$display(0, 2);
					} else {
						estado = (val == 0 || Math.abs(n) <= 0.25) ? 'ok' : 'mal';
						icono = (val == 0) ? 'mdi-check' : (val < 0 ? 'mdi-rotate-left' : 'mdi-rotate-right');
						texto = this.$display(Math.abs(n), 2);
					}
					const unidad = this.$t('domotek.calibracion.turns');
					return { ...e, estado, icono, texto, unidad, descripcion: `${e.nombre}: ${texto} ${unidad}` };
				});
			},
			hayMedida() { return this.esquinas.some(e => e.estado !== 'sin'); },
			porAjustar() { return this.esquinas.filter(e => e.estado === 'mal').map(e => e.nombre); },
			ejesVisibles() { return (this.$store.state.machine.model.move.axes || []).filter(a => a.visible); },
			ejesTool() { // domotek: en 4A solo X, Y y Z de la tool activa (Y1..Y4; Z1 para T1-T2, Z2 para T3-T4)
				const ejes = this.ejesVisibles;
				const t = this.toolActiva;
				if (this.modeloMaquina === '4A' && t >= 0 && ejes.length >= 7) {
					const y = [1, 3, 4, 5][t], z = [2, 2, 6, 6][t];
					return [
						{ et: 'X', eje: ejes[0], real: '' },
						{ et: 'Y', eje: ejes[y], real: `Y${t + 1}` },
						{ et: 'Z', eje: ejes[z], real: t < 2 ? 'Z1' : 'Z2' }
					];
				}
				return ejes.map((eje, i) => ({ et: this.etiquetaEje(i, eje), eje, real: '' }));
			},
			todosHomed() {
				const a = this.$store.state.machine.model.move.axes || [];
				const n = (this.modeloMaquina === '2A') ? 4 : 7;
				for (let i = 0; i < n; i++) { if (!a[i] || !a[i].homed) { return false; } }
				return true;
			},
			toolActiva() {
				for (let i = 0; i < 4; i++) { if (this.g['T' + i + 'Activo']) { return i; } }
				return -1;
			},
			offsetZ() {
				const tools = this.$store.state.machine.model.tools || [];
				const t = tools[this.toolActiva];
				if (!t || !t.offsets || t.offsets.length < 3) { return null; }
				const v = t.offsets[2];
				return (v > 0 ? '+' : '') + this.$display(v, 2);
			},
			bloqueadoAjuste() { return this.calibrando || this.ajustando; },
			calibrandoPaso2() {
				return this.calibrando && this.numeroActual === 1;
			}
	},
	methods: {
		closeDialog(){
			this.$emit('close-dialog');
		},
		SelectCalibration(numero){
			this.dialog = true;
			this.numeroActual = numero;
			this.codigo = '"/calibration/';
			switch (numero) {
				case 0:
					this.codigo += '01_AUTO_CAL vs Z_endstop.g"';
					this.nombreCal = 'domotek.calibracion.dialogAutoCal';
					break;
				case 1:
					this.codigo += '02_Manual Bed Leveling Assistant.g"';
					this.nombreCal = 'domotek.calibracion.dialogPlatformLeveling';
					break;
				case 2:
					this.codigo += '04_T_izq Z offset.g"';
					this.nombreCal = "domotek.calibracion.dialogT0Z"
					break;
				case 3:
					this.codigo += '04_T_dercha Z offset.g"';
					this.nombreCal = "domotek.calibracion.dialogT1Z"
					break;
				case 4:
					this.codigo += '03_T0_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT0Z';
					break;
				case 5:
					this.codigo += '03_T1_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT1Z';
					break;
				case 6:
					this.codigo += '03_T2_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT2Z';
					break;
				case 7:
					this.codigo += '03_T3_Z_offset.g"';
					this.nombreCal = 'domotek.calibracion.dialogT3Z';
					break;
				default:
					break;
			}
			// Enviar el comando M98 a la impresora
			//this.sendGCode('M98 P"0:/macros/Pruebas_AUTO-CAL/Enable-Disable/habilitar.g"');
		},
		siguientePaso() { // domotek
			const orden = this.pasosBio.map(p => p.n);
			const k = orden.indexOf(Number(this.pasos));
			if (k >= 0 && k < orden.length - 1) { this.pasos = orden[k + 1]; }
		},
		etiquetaEje(index, axis) {
			const nombres = { '2A': ['X0', 'Y', 'Z', 'X1'], '4A': ['X', 'Y1', 'Z1', 'Y2', 'Y3', 'Y4', 'Z2'], 'HK': ['X1', 'Y1', 'Z', 'X2', 'X3', 'X4', 'Y2'] };
			const lista = nombres[this.modeloMaquina];
			return (lista && lista[index]) ? lista[index] : axis.letter;
		},
		async ejecutarHome() { // igual que MovementPanelCalibration
			this.ajustando = true;
			try { await this.$store.dispatch('machine/sendCode', { code: 'G28' }); } catch (e) { /* notificado */ } finally { this.ajustando = false; }
		},
		async ejecutarOffset(tipo) { // igual que MovementPanelCalibration
			this.dialogOffset = false;
			const archivo = (tipo === 'XY') ? '/calibration/03_XY_offset.g' : '/calibration/03_Z_offset.g';
			this.ajustando = true;
			try {
				await this.$store.dispatch('machine/sendCode', { code: `M98 P"${archivo}"` });
				this.hechos = { ...this.hechos, 3: true };
			} catch (e) { /* notificado */ } finally { this.ajustando = false; }
		},
		terminar() {
			this.closeDialog();
		},
		async ConfirmarCalibracion(){
			this.dialog = false;
			this.toolClick = false;
			this.numTool = null;

			this.calibrando = true;
			try {
			await this.$store.dispatch('machine/sendCode', { code: `M98 p${this.codigo}` });
			if (this.numeroActual === 0) { this.hechos = { ...this.hechos, 1: true }; } // domotek
			if (this.numeroActual === 1) { this.hechos = { ...this.hechos, 2: true }; }
			} catch (e) {
			console.error('Error ejecutando calibración:', e);
			// opcional: mostrar snackbar/alerta
			} finally {
			this.calibrando = false;
			}
		},
		// async sendGCode(gcode) {
		// 	try {
		// 		await fetch('/machine/code', {
		// 			method: 'POST',
		// 			headers: { 'Content-Type': 'application/json' },
		// 			body: JSON.stringify({ code: gcode })
		// 		});
		// 		console.log(`Enviado: ${gcode}`);
		// 	} catch (error) {
		// 		console.error('Error enviando GCODE:', error);
		// 	}
		// }
	},
	mounted() {
		this.$vuetify.goTo(0);
	}
}
</script>






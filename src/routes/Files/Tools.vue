<style>
.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
	height: 48px;
	min-height: 0;
	/* min-width: 110px; */
}

/*.v-btn-toggle {
  flex-direction: column;
}*/

.vbtn1 {
	max-width:150px!important;
	min-width:120px !important;
}

.v-btn--active.no-active::before {                                                                             
  opacity: 0 !important;
}

.vctCentradoBold {
	font-weight: bold;
	font-size: large;
	padding: 25px 0px 10px 0px;
}



</style>

<template>
	<v-row class="mb-0" :class="{ 'pb-10': !temaBio }">
		<!-- <v-col cols="6" class="ml-2 mt-2">
			<span> <v-icon small>mdi-screwdriver</v-icon> Tools directory</span>
		</v-col> -->
		
		
		<!-- <v-col cols="12" class="mt-10 mb-2"> -->
		<v-col cols="12" :class="temaBio ? 'mt-0 pt-0' : 'mt-5'">	
			<!-- <v-row v-if="!this.toolClick"> -->
			<v-row>	
				<v-col cols="12" :class="temaBio ? 'mt-0 pt-0' : 'mt-6'">  <!--v-show="$vuetify.breakpoint.mdAndDown"> -->
					
					<v-row class="templateSlotButtons">
						<v-col cols="12">
				<!-- domotek: Herramientas con el tema oscuro -->
				<div v-if="temaBio">
					<div class="bio-tools">
						<h1 class="bio-h1">{{ $t('domotek.tools.toolsTitle') }}</h1>
						<section class="bio-tools-grid" :style="{ gridTemplateColumns: `repeat(${bioTools.length}, minmax(0, 1fr))` }">
							<article v-for="t in bioTools" :key="t.i" class="bio-tool" :class="{ 'bio-tool--sel': ClickToolAnterior === t.i && toolClick }">
								<div class="bio-tool-cab">
									<button type="button" class="bio-punto" :class="'bio-punto--' + t.estado" :aria-label="$t('domotek.tools.toggleHeater')" @click="toolHeaterClick(nameTools[t.i], heaterTools[t.i + 1])"></button>
									<button type="button" class="bio-tool-nombre" @click="ChangeTool(t.i), camaClick = false, $vuetify.goTo(pageHeight)"><span class="bio-cap">{{ $t('domotek.tools.t' + t.i) }}</span></button>
									<button type="button" class="bio-icono" :class="t.cal ? 'ok' : 'aviso'" :aria-label="t.cal ? $t('panel.tools.calibrado') : $t('panel.tools.noCalibrado')" @click="showToolOffsets(t.i)">
										<v-icon>mdi-tune-variant</v-icon>
									</button>
								</div>
								<button type="button" class="bio-tool-tipo" :class="{ vacio: t.vacio }" @click="ChangeTool(t.i), camaClick = false, $vuetify.goTo(pageHeight)">{{ t.nombre || '—' }}</button>
								<button type="button" class="bio-tool-temp" :disabled="!t.editable" @click="bioClickTemp(t)">
									<template v-if="t.temps.length">
										<span v-for="(h, k) in t.temps" :key="k" class="bio-temp-fila" :class="{ sec: k > 0 }">
											<span class="nom">{{ h.nombre }}</span>
											<span class="val">{{ h.actual }}<small> / {{ h.objetivo }} °C</small></span>
										</span>
									</template>
									<span v-else class="bio-tenue">{{ t.vacio ? $t('domotek.tools.noTool') : $t('domotek.tools.noHeater') }}</span>
								</button>
							</article>
						</section>

						<section class="bio-tools-abajo" :class="{ 'sin-chamber': !bioChamberVisible }">
							<button type="button" class="bio-calib" @click="DialogCalibration = true">
								<v-icon size="36">mdi-axis-arrow</v-icon>
								<span class="bio-cap">{{ $t('domotek.tools.calibrationBtn') }}</span>
							</button>

							<article class="bio-tool">
								<div class="bio-tool-cab">
									<span class="bio-punto" :class="'bio-punto--' + bioEstado(heaterTools[0])"></span>
									<button type="button" class="bio-tool-nombre" @click="ChangeCama(4), camaClick = true, $vuetify.goTo(pageHeight)"><span class="bio-cap">{{ $t('domotek.tools.platform') }}</span></button>
									<span class="bio-tenue bio-chip">{{ bioNombreCama }}</span>
								</div>
								<div class="bio-fila-valor">
									<template v-if="bedSelected != 'D'">
										<span class="bio-grande">{{ bioTemp(heaterTools[0]) }} <small>°C</small></span>
										<button type="button" class="bio-objetivo" :disabled="bedSelected == 'M'" @click="(bedSelected == 'M') ? nothing(4) : keyboardScreen(4)">
											{{ $t('domotek.tools.target') }} <strong>{{ heaterTools[0] ? heaterTools[0].active : '--' }} °C</strong>
										</button>
									</template>
									<template v-else>
										<span class="bio-grande">{{ drumSpeed }} <small>rpm</small></span>
										<button type="button" class="bio-objetivo" @click="keyboardScreenDrum()">
											{{ $t('domotek.tools.target') }} <strong>{{ drumSpeedSet }} rpm</strong>
										</button>
									</template>
								</div>
							</article>

							<article v-if="bioChamberVisible" class="bio-tool">
								<div class="bio-tool-cab">
									<span class="bio-punto" :class="'bio-punto--' + bioEstado(heaterTools[20])"></span>
									<span class="bio-tool-nombre"><span class="bio-cap">{{ $t('domotek.tools.chamber') }}</span></span>
									<v-icon :color="doorStateOpen ? 'var(--bio-acento)' : 'var(--bio-tenue)'">{{ doorStateOpen ? 'mdi-door-open' : 'mdi-door-closed' }}</v-icon>
								</div>
								<div class="bio-fila-valor">
									<template v-if="miniclima_capable && modoInput === 'HUM'">
										<span class="bio-grande">{{ miniclima_rh !== undefined && miniclima_rh !== null ? Number(miniclima_rh).toFixed(1) : '--' }} <small>%</small></span>
										<button type="button" class="bio-objetivo hum" @click="keyboardScreen(20)">{{ miniclima_setPoint === 0 ? '--' : miniclima_setPoint }} %</button>
									</template>
									<template v-else>
										<span class="bio-grande">{{ bioTemp(heaterTools[20]) }} <small>°C</small></span>
										<button type="button" class="bio-objetivo" @click="keyboardScreen(20)">{{ heaterTools[20] ? heaterTools[20].active : '--' }} °C</button>
									</template>
								</div>
							</article>
						</section>
					</div>
				</div>
							<template v-if="!temaBio">
							<v-row class="pt-2 pb-4">
								<!-- TOOL1 -->
								<v-card v-if="modeloMaquina == '4A' || modeloMaquina == '2A' || modeloMaquina == 'HK' " class=" rounded-xl col blue lighten-5 pa-0 mr-1 " elevation="5">	
									<v-card-text align="center" textcolor="black" class="blue lighten-5 pa-0 pt-1 pb-0">
										<v-row class=" mt-0">
											<v-col cols=3 class="pr-0">	
												<v-btn icon elevation="1" @click="toolHeaterClick(nameTools[0], heaterTools[1])" class=" ">
													<v-icon large color="red" v-if="heaterTools[1].state == 'fault'">mdi-close-circle-outline</v-icon>
													<v-icon large color="teal" v-if="heaterTools[1].state == 'active'">mdi-power</v-icon>
													<v-icon large color="warning" v-if="heaterTools[1].state == 'standby'">mdi-power-cycle</v-icon>
													<v-icon large color="grey" v-if="heaterTools[1].state == 'off'">mdi-power-off</v-icon>
												</v-btn>
											</v-col> 
											<v-col cols=6 class="pa-2 pb-3  ">
												<!-- <v-btn style=" width:95%; " class="" color="black " text height="45px" elevation="2" @click="ChangeTool(0), camaClick = false, $vuetify.goTo(pageHeight)">
													<span ><strong>{{ $t('domotek.tools.t0') }}</strong></span>
												</v-btn> -->
												<v-btn style=" width:110%; " class="" :color="((ClickToolAnterior === 0) && toolClick) ? 'primary' : 'blue lighten-5'" height="45px" elevation="2" @click="ChangeTool(0), camaClick = false, $vuetify.goTo(pageHeight)">
													<span ><strong>{{ $t('domotek.tools.t0') }}</strong></span>
												</v-btn>
											</v-col>
											<v-col cols=3 class="pl-0">
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!--<v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn>-->
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
														<v-icon
														v-bind="attrs"
														v-on="on"
														:color="T0CAL ? 'green' : 'orange'"
														medium
														@click="showToolOffsets(0)"
														>
														{{ T0CAL ? 'mdi-tune' : 'mdi-tune' }}
														</v-icon>
													</template>
													<span>{{ T0CAL ? $t('panel.tools.calibrado') : $t('panel.tools.noCalibrado') }}</span>
												</v-tooltip>
											</v-col>
										</v-row>
									</v-card-text>
									<v-divider class="mx-1"></v-divider>
									<v-card-text align="center" class="clsDesTool blue lighten-5 pa-0 pt-2 pb-3" >
										<v-row class=" ">
											<v-col cols=12 class=" ">
												<span style="color:#0a21ad; font-size:large;"><strong>{{ T0Name }}</strong></span> 
											</v-col> 
										</v-row>
										<v-card @click="(T0 == 9)?screenMix(0):(T0 != 0 && T0 != 7 && T0 != 8 && T0 != 1 && T0 != 3 && T0 != 15 && T0 != 11)?keyboardScreen(0):nothing(0)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >
											<v-row class="pa-1 mt-0" v-if="nameTools0heaterslength > 0">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools0heaterslength > 0">{{ nameHeaters.analog[1].name }}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools0heaterslength > 0">{{heaterTools[1].current == -273.1 || heaterTools[1].current == -273.15 ? "--":heaterTools[1].current.toFixed(1)}}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools0heaterslength > 0"><strong>/ {{heaterTools[1].active}}</strong></span>
												</v-col>
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row>    
											<v-row class="pa-1 mt-0" v-if="nameTools0heaterslength > 1">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools0heaterslength > 1">{{ nameHeaters.analog[11].name }}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools0heaterslength > 1">{{heaterTools[11].current == -273.1 || heaterTools[11].current == -273.15 ? "--":heaterTools[11].current.toFixed(1)}}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools0heaterslength > 1"><strong>/ {{heaterTools[11].active}}</strong></span>
												</v-col> 
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" >&nbsp;  </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" >&nbsp;  </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" >&nbsp;  </span>
												</v-col> 
											</v-row>    
										</v-card>
									</v-card-text>
								</v-card>
								<!-- TOOL2 -->
								<v-card v-if="modeloMaquina == '4A' || modeloMaquina == '2A' || modeloMaquina == 'HK' " class=" rounded-xl col blue lighten-5 pa-0 mr-1" elevation="5">
									<v-card-text align="center" textcolor="black" class="blue lighten-5 pa-0 pt-1 pb-0">
										<v-row class=" mt-0">
											<v-col cols=3 class="pr-0">	
												<v-btn icon elevation="1" @click="toolHeaterClick(nameTools[1], heaterTools[2])" class=" ">
													<v-icon large color="red" v-if="heaterTools[2].state == 'fault'">mdi-close-circle-outline</v-icon>
													<v-icon large color="teal" v-if="heaterTools[2].state == 'active'">mdi-power</v-icon>
													<v-icon large color="warning" v-if="heaterTools[2].state == 'standby'">mdi-power-cycle</v-icon>
													<v-icon large color="grey" v-if="heaterTools[2].state == 'off'">mdi-power-off</v-icon>
												</v-btn>
											</v-col> 
											<v-col cols=6 class="pa-2 pb-3  ">
													<!-- <v-btn style=" width:95%; " class="" color="black " text height="45px" elevation="2" @click="ChangeTool(1), camaClick = false">
														<span ><strong>{{ $t('domotek.tools.t1') }}</strong></span>
													</v-btn> -->
													<v-btn style=" width:110%; " class="" :color="((ClickToolAnterior === 1) && toolClick) ? 'primary' : 'blue lighten-5'" height="45px" elevation="2" @click="ChangeTool(1), camaClick = false, $vuetify.goTo(pageHeight)">
														<span ><strong>{{ $t('domotek.tools.t1') }}</strong></span>
													</v-btn>			
											</v-col>
											<v-col cols=3 class="pl-0">
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!--<v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn>-->
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
														<v-icon
														v-bind="attrs"
														v-on="on"
														:color="T1CAL ? 'green' : 'orange'"
														medium
														@click="showToolOffsets(1)"
														>
														{{ T1CAL ? 'mdi-tune' : 'mdi-tune' }}
														</v-icon>
													</template>
													<span>{{ T1CAL ? $t('panel.tools.calibrado') : $t('panel.tools.noCalibrado') }}</span>
												</v-tooltip>
											</v-col>
										</v-row>
									</v-card-text>
									<v-divider class="mx-1"></v-divider>
									<v-card-text align="center" class="clsDesTool blue lighten-5 pa-0 pt-2 pb-3" >
										<v-row class=" ">
											<v-col cols=12 class=" ">
												<span style="color:#0a21ad;font-size:large;"><strong>{{ T1Name }}</strong></span>
											</v-col> 
										</v-row>
										<v-card @click="(T1 == 9)?screenMix(1):(T1 != 0 && T1 != 7 && T1 != 8 && T1 != 1 && T1 != 3 && T1 != 15 && T1 != 11)?keyboardScreen(1):nothing(1)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >
											<v-row class="pa-1 mt-0" v-if="nameTools1heaterslength > 0">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 0">{{ nameHeaters.analog[2].name }}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools1heaterslength > 0">{{heaterTools[2].current == -273.1 || heaterTools[2].current == -273.15 ? "--":heaterTools[2].current.toFixed(1)}}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools1heaterslength > 0"><strong>/ {{heaterTools[2].active}}</strong></span>
												</v-col>
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row> 
											<!--4A y HK --> 
											<v-row class="pa-1 mt-0" v-if="nameTools1heaterslength > 1">
												<v-col v-if="modeloMaquina != '2A'" cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 1">{{ nameHeaters.analog[12].name }}</span>
												</v-col>
												<v-col v-else cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 1">{{ nameHeaters.analog[11].name }}</span>
												</v-col>
												<v-col v-if="modeloMaquina != '2A'" cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 1">{{heaterTools[12].current == -273.1 || heaterTools[12].current == -273.15? "--":heaterTools[12].current.toFixed(1)}}</span>
												</v-col> 
												<v-col v-else cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 1">{{heaterTools[11].current == -273.1 || heaterTools[11].current == -273.15? "--":heaterTools[11].current.toFixed(1)}}</span>
												</v-col> 
												<v-col v-if="modeloMaquina != '2A'" cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 1"><strong>/ {{heaterTools[12].active}}</strong></span>
												</v-col> 
												<v-col v-else cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools1heaterslength > 1"><strong>/ {{heaterTools[11].active}}</strong></span>
												</v-col> 
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row>
										</v-card>
									</v-card-text>
								</v-card>
								<!-- TOOL3 -->
								<v-card v-if="modeloMaquina != '2A'" class=" rounded-xl col blue lighten-5 pa-0 mr-1" elevation="5">
									<v-card-text align="center" textcolor="black" class="blue lighten-5 pa-0 pt-1 pb-0">
										<v-row class=" mt-0">
											<v-col cols=3 class="pr-0">	
												<v-btn icon elevation="1" @click="toolHeaterClick(nameTools[2], heaterTools[3])" class=" ">
													<v-icon large color="red" v-if="heaterTools[3].state == 'fault'">mdi-close-circle-outline</v-icon>
													<v-icon large color="teal" v-if="heaterTools[3].state == 'active'">mdi-power</v-icon>
													<v-icon large color="warning" v-if="heaterTools[3].state == 'standby'">mdi-power-cycle</v-icon>
													<v-icon large color="grey" v-if="heaterTools[3].state == 'off'">mdi-power-off</v-icon>
												</v-btn>
											</v-col> 
											<v-col cols=6 class="pa-2 pb-3  ">
												<!-- <v-btn style=" width:95%; " class="" color="black" text height="45px" elevation="2" @click="ChangeTool(2), camaClick = false">
													<span ><strong>{{ $t('domotek.tools.t2') }}</strong></span>
												</v-btn> -->
												<v-btn style=" width:110%; " class="" :color="((ClickToolAnterior === 2) && toolClick) ? 'primary' : 'blue lighten-5'" height="45px" elevation="2" @click="ChangeTool(2), camaClick = false, $vuetify.goTo(pageHeight)">
													<span ><strong>{{ $t('domotek.tools.t2') }}</strong></span>
												</v-btn>						
											</v-col>
											<v-col cols=3 class="pl-0">
												<!-- Botón para mostrar estado de calibración y abrir offsets -->
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
														<v-icon
														v-bind="attrs"
														v-on="on"
														:color="T2CAL ? 'green' : 'orange'"
														medium
														@click="showToolOffsets(2)"
														>
														{{ T2CAL ? 'mdi-tune' : 'mdi-tune' }}
														</v-icon>
													</template>
													<span>{{ T2CAL ? $t('panel.tools.calibrado') : $t('panel.tools.noCalibrado') }}</span>
												</v-tooltip>
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!--<v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn>-->
											</v-col>
										</v-row>
									</v-card-text>
									<v-divider class="mx-1"></v-divider>
									<v-card-text align="center" class="clsDesTool blue lighten-5 pa-0 pt-2 pb-3" >
										<v-row class=" ">
											<v-col cols=12 class=" ">
												<span style="color:#0a21ad;font-size:large;"><strong>{{ T2Name }}</strong></span>
											</v-col> 
										</v-row>
										<v-card @click="(T2 == 9)?screenMix(2):(T2 != 0 && T2 != 7 && T2 != 8 && T2 != 1  && T2 != 3 && T2 != 15 && T2 != 11)?keyboardScreen(2):nothing(2)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >
											<v-row class="pa-1 mt-0" v-if="nameTools2heaterslength > 0">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools2heaterslength > 0">{{ nameHeaters.analog[3].name }}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools2heaterslength > 0">{{heaterTools[3].current == -273.1 || heaterTools[3].current == -273.15? "--":heaterTools[3].current.toFixed(1)}}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools2heaterslength > 0"><strong>/ {{heaterTools[3].active}}</strong></span>
												</v-col>
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row>    
											<v-row class="pa-1 mt-0" v-if="nameTools2heaterslength > 1">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools2heaterslength > 1">{{ nameHeaters.analog[13].name }}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools2heaterslength > 1">{{heaterTools[13].current == -273.1 || heaterTools[13].current == -273.15? "--":heaterTools[13].current.toFixed(1)}}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools2heaterslength > 1"><strong>/ {{heaterTools[13].active}}</strong></span>
												</v-col> 
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row>    
										</v-card>
									</v-card-text>
								</v-card>


								<!-- TOOL4 -->
								<v-card v-if="modeloMaquina != '2A'" class=" rounded-xl col blue lighten-5 pa-0 " elevation="5">
									<v-card-text align="center" textcolor="black" class="blue lighten-5 pa-0 pt-1 pb-0">
										<v-row class=" mt-0">
											<v-col cols=3 class="pr-0">	
												<v-btn icon elevation="1" @click="toolHeaterClick(nameTools[3], heaterTools[4])" class=" ">
													<v-icon large color="red" v-if="heaterTools[4].state == 'fault'">mdi-close-circle-outline</v-icon>
													<v-icon large color="teal" v-if="heaterTools[4].state == 'active'">mdi-power</v-icon>
													<v-icon large color="warning" v-if="heaterTools[4].state == 'standby'">mdi-power-cycle</v-icon>
													<v-icon large color="grey" v-if="heaterTools[4].state == 'off'">mdi-power-off</v-icon>
												</v-btn>
											</v-col> 
											<v-col cols=6 class="pa-2 pb-3  ">
												<!-- <v-btn style=" width:95%; " class="" color="black " text height="45px" elevation="2" @click="ChangeTool(3), camaClick = false">
													<span ><strong>{{ $t('domotek.tools.t3') }}</strong></span>
												</v-btn> -->
												<v-btn style=" width:110%; " class="" :color="((ClickToolAnterior === 3) && toolClick) ? ' primary ' : 'blue lighten-5'"  height="45px" elevation="2" @click="ChangeTool(3), camaClick = false, $vuetify.goTo(pageHeight)">
													<span ><strong>{{ $t('domotek.tools.t3') }}</strong></span>
												</v-btn>			
											</v-col>
											<v-col cols=3 class="pl-0">
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!--<v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn>-->
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
														<v-icon v-bind="attrs" v-on="on" :color="T3CAL ? 'green' : 'orange'" medium @click="showToolOffsets(3)" >
														{{ T3CAL ? 'mdi-tune' : 'mdi-tune' }}
														</v-icon>
													</template>
													<span>{{ T3CAL ? $t('panel.tools.calibrado') : $t('panel.tools.noCalibrado') }}</span>
												</v-tooltip>
											</v-col>
										</v-row>
									</v-card-text>
									<v-divider class="mx-1"></v-divider>
									<v-card-text align="center" class="clsDesTool blue lighten-5 pa-0 pt-2 pb-3" >
										<v-row class=" ">
											<v-col cols=12 class=" " >
												<span style="color:#0a21ad;font-size:large;"><strong>{{ T3Name }}</strong></span>
											</v-col> 
										</v-row>
										<v-card @click="(T3 == 9)?screenMix(3):(T3 != 0 && T3 != 7 && T3 != 8 && T3 != 1 && T3 != 3 && T3 != 15 && T3 != 11)?keyboardScreen(3):nothing(3)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >
											<v-row class="pa-1 mt-0" v-if="nameTools3heaterslength > 0">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools3heaterslength > 0">{{ nameHeaters.analog[4].name }}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools3heaterslength > 0">{{heaterTools[4].current == -273.1 || heaterTools[4].current == -273.15? "--":heaterTools[4].current.toFixed(1)}}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" v-if="nameTools3heaterslength > 0"><strong>/ {{heaterTools[4].active}}</strong></span>
												</v-col>
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row>    
											<v-row class="pa-1 mt-0" v-if="nameTools3heaterslength > 1">
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools3heaterslength > 1">{{ nameHeaters.analog[14].name }}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools3heaterslength > 1">{{heaterTools[14].current == -273.1 || heaterTools[14].current == -273.15? "--":heaterTools[14].current.toFixed(1)}}</span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" v-if="nameTools3heaterslength > 1"><strong>/ {{heaterTools[14].active}}</strong></span>
												</v-col> 
											</v-row>
											<v-row class="pa-1 mt-0" v-else>
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
											</v-row>    
										</v-card>
									</v-card-text>
								</v-card>
							</v-row>
							<v-row>
								<v-col cols=1 class="pr-0"></v-col>
								<!--boton de calibracion //-->
								<v-col cols="2" class="pl-0 pr-0" style="text-align: center;"> 
									<v-btn icon elevation="4" @click="DialogCalibration = true"  class="d-flex align-center" style="font-size: 60px; padding: 40px;  height: 100px; width: 100px; background-color: #e2f1fc;  display: block; margin: 0 auto;">
										<v-icon style="font-size: 60px;">mdi-axis-arrow</v-icon> 
									</v-btn>
									<div style="margin-top: 8px; font-size: 16px; font-weight: bold;">{{ $t('domotek.tools.calibrationBtn') }}</div>
								</v-col>
								<v-col cols=6 class="pa-2 pb-3  ">
								
								<!-- plattform -->
								<v-card class=" rounded-xl col blue lighten-5 pa-0 " elevation="5">
									<v-card-text align="center" textcolor="black" class="blue lighten-5 pa-0 pt-1 pb-0">
										<v-row class=" mt-0">
											<v-col cols=3 class="pr-0">	
												<v-btn icon elevation="1"  class=" ">
													<v-icon large color="red" v-if="heaterTools[0].state == 'fault'">mdi-close-circle-outline</v-icon>
													<v-icon large color="teal" v-if="heaterTools[0].state == 'active'">mdi-power</v-icon>
													<v-icon large color="warning" v-if="heaterTools[0].state == 'standby'">mdi-power-cycle</v-icon>
													<v-icon large color="grey" v-if="heaterTools[0].state == 'off'">mdi-power-off</v-icon>
												</v-btn>
											</v-col> 
											<v-col cols=6 class="pa-2 pb-3  ">
												<v-btn style=" width:95%; " class="" color="black " text height="45px" elevation="2" @click="ChangeCama(4), camaClick = true, $vuetify.goTo(pageHeight)">
													<span><strong>{{ $t('domotek.tools.platform') }}</strong></span>
												</v-btn>			
											</v-col>
											<!-- <v-col cols=3 class="pl-0"> -->
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!--<v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn>-->
											<!-- </v-col> -->
											<v-col cols=3 class="pl-0">
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!--<v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn>-->

												<!-- VER OFFSETS DE PLATAFORMA -->
												<!-- <v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
														<v-icon v-bind="attrs" v-on="on"  medium @click="showPlatformOffsets" >
														{{ T3CAL ? 'mdi-tune' : 'mdi-tune' }}
														</v-icon>
													</template>
												</v-tooltip> -->
											</v-col>
										</v-row>
									</v-card-text>
									<v-divider class="mx-1"></v-divider>
									<v-card-text align="center" class="clsDesTool blue lighten-5 pa-0 pt-2 pb-3" >
										<v-row class=" ">
											<v-col cols=12 class=" ">
												<span style="color:#0a21ad;font-size:large;"><strong>{{nameCama.analog[0].name}}</strong></span>
											</v-col> 
										</v-row>
										<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->
										<!-- Sacamos teclado para los tools con temperatura y selector de RPM para DRUM. Si la plataforma es Mew, se deshabilita la aparición de la ventana	  		 -->
										<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->
										<!--<v-card v-if="bedSelected != 'D'" @click="keyboardScreen(4)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >-->
										<v-card @click="(bedSelected == 'M') ? nothing(4) : keyboardScreen(4)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" v-if="bedSelected != 'D'">
											<v-row class="pa-1 mt-0" >
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" >{{heaterTools[0].current == -273.1 || heaterTools[0].current == -273.15? "--":heaterTools[0].current.toFixed(1)}}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" ><strong>/ {{heaterTools[0].active}}</strong></span>
												</v-col>
											</v-row>
										</v-card>
										<v-card v-else @click="keyboardScreenDrum()" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >
											<v-row class="pa-1 mt-0" >
												<v-col cols=6 class=" pa-1 ">
													<span class="clsHeatersMultiH2" > &nbsp; </span>
												</v-col> 
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" >{{ drumSpeed }}</span>
												</v-col>
												<v-col cols=3 class=" pa-1 ">
													<span class="clsHeatersMultiH1" ><strong>/ {{ drumSpeedSet }}</strong></span>
												</v-col>
											</v-row>
										</v-card>
									</v-card-text>
								</v-card>
								</v-col>
								<!--- CHAMBER -->
								<v-col cols=3 class="pa-2 pb-3  ">
									<v-card v-if="(modeloMaquina != '2A')&&(chamberMode == true)" class=" rounded-xl col blue lighten-5 pa-0 " elevation="5" >
									<v-card-text align="center" textcolor="black" class="blue lighten-5 pa-0 pt-1 pb-0">
										<v-row class=" mt-0">
											<v-col cols=3 class="pr-0">	
												<v-btn icon elevation="1"  class=" ">
													<v-icon large color="red" v-if="heaterTools[20].state == 'fault'">mdi-close-circle-outline</v-icon>
													<v-icon large color="light-green accent-4" v-if="heaterTools[20].state == 'active'">mdi-power</v-icon>
													<v-icon large color="warning" v-if="heaterTools[20].state == 'standby'">mdi-power-cycle</v-icon>
													<v-icon large color="grey" v-if="heaterTools[20].state == 'off'">mdi-power-off</v-icon>
												</v-btn>
											</v-col> 
											<v-col cols=6 class="pa-2 pb-3  ">
												<v-btn style=" width:95%; " class="" color="black " text height="45px" elevation="2" >
													<span><strong>{{ $t('domotek.tools.chamber') }}</strong></span>
												</v-btn>			
											</v-col>
											<v-col cols=3 class="pl-0">
												<v-btn icon elevation="1" class=" ">
													<v-icon large color="green" v-if="doorStateOpen == true">mdi-door-open</v-icon> <!--puerta chamber abierta-->
													<v-icon  large color="grey" v-if="doorStateOpen == false">mdi-door-closed</v-icon> <!--puerta chamber cerrada-->
												</v-btn>
												<!-- <v-btn icon elevation="4" @click="cambiarRuta('/Files/Calibracion')"> -->
												<!-- <v-btn icon elevation="4" @click="DialogCalibration = true" >
													<v-icon large > mdi-axis-arrow </v-icon>
												</v-btn> -->
											</v-col>
										</v-row>
									</v-card-text>
									<v-divider class="mx-1"></v-divider>
									<v-card-text align="center" class="clsDesTool blue lighten-5 pa-0 pt-2 pb-3" >
										<v-row class=" ">
											<v-col cols=12 class=" ">
												<!-- <span style="color:#0a21ad;font-size:large;"><strong>{{ $t('domotek.tools.chamber') }}</strong></span> -->
												<span style="color:#0a21ad;font-size:large;"><strong>{{ miniclima_capable ? (modoInput === 'TEMP' ? 'Heater' : 'Humidity') : 'Heater' }}</strong></span>											</v-col> 
										</v-row>
										<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->
										<!-- Sacamos teclado para los tools con temperatura y selector de RPM para DRUM		  		 -->
										<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->
										<v-card @click="keyboardScreen(20)" class="rounded-xl blue lighten-5 pa-0 pt-1 pb-0" elevation="5" >
											<!-- Con miniclima: muestra RH o Temp según modoInput -->
											<template v-if="miniclima_capable">
												<v-row class="pa-1 mt-0" v-if="modoInput === 'HUM'">
													<v-col cols=6 class="pa-1">
														<span class="clsHeatersMultiH2">{{ $t('domotek.varios.RH') }}</span>
													</v-col>
													<v-col cols=3 class="pa-1">
														<span class="clsHeatersMultiH1">{{ miniclima_rh !== undefined && miniclima_rh !== null ? Number(miniclima_rh).toFixed(1) : "--" }}</span>
													</v-col>
													<v-col cols=3 class="pa-1">
														<span class="clsHeatersMultiH1"><strong>/ {{ miniclima_setPoint === 0 ? '--' : miniclima_setPoint }}</strong></span>
													</v-col>
												</v-row>
												<v-row class="pa-1 mt-0" v-else>
													<v-col cols=6 class="pa-1">
														<span class="clsHeatersMultiH2">{{ $t('domotek.varios.temp') }}</span>
													</v-col>
													<v-col cols=3 class="pa-1">
														<span class="clsHeatersMultiH1">{{heaterTools[20].current == -273.1 || heaterTools[20].current == -273.15? "--":heaterTools[20].current.toFixed(1)}}</span>
													</v-col>
													<v-col cols=3 class="pa-1">
														<span class="clsHeatersMultiH1"><strong>/ {{heaterTools[20].active}}</strong></span>
													</v-col>
												</v-row>
											</template>
											<!-- Sin miniclima: siempre temperatura -->
											<template v-else>
												<v-row class="pa-1 mt-0">
													<v-col cols=6 class="pa-1"></v-col>
													<v-col cols=3 class="pa-1">
														<span class="clsHeatersMultiH1">{{heaterTools[20].current == -273.1 || heaterTools[20].current == -273.15? "--":heaterTools[20].current.toFixed(1)}}</span>
													</v-col>
													<v-col cols=3 class="pa-1">
														<span class="clsHeatersMultiH1"><strong>/ {{heaterTools[20].active}}</strong></span>
													</v-col>
												</v-row>
											</template>
										</v-card>
									</v-card-text>
								</v-card>	
								</v-col>	
							</v-row>
							</template>
								<v-dialog v-model="dialogOffsetsVisible" max-width="500px">
									<v-card>
										<v-card-title class="headline grey lighten-2">
										{{ offsetTitulo }}
										</v-card-title>
										<v-card-text style="white-space: pre-line;">
										{{ offsetTexto }}
										</v-card-text>
										<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" text @click="dialogOffsetsVisible = false">{{ $t('generic.close') }}</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
							<!-- </v-card> -->
						</v-col>
						<v-col cols="12" class="pa-0 ma-0">
							<v-dialog v-model="marcador" :content-class="temaBio ? 'bio-teclado-dialogo' : ''" :max-width="temaBio ? 760 : undefined">
								<!-- domotek: teclado de temperatura con el tema oscuro -->
								<div v-if="temaBio" class="bio-teclado">
									<section class="bio-teclado-izq">
										<header class="bio-teclado-cab">
											<span class="bio-teclado-icono" :class="{ hum: bioModoHum }"><v-icon>{{ bioModoHum ? 'mdi-water-percent' : 'mdi-thermometer' }}</v-icon></span>
											<span class="bio-teclado-nombre">{{ bioTecladoNombre }}</span>
											<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.close')" @click="marcador = false"><v-icon>mdi-close</v-icon></button>
										</header>
										<div v-if="modoDialog === 'HUM'" class="bio-segmentos bio-teclado-modo" role="tablist">
											<button type="button" role="tab" class="bio-seg" :class="{ activo: modoInput === 'TEMP' }" @click="switchToTemp()">{{ $t('domotek.varios.temp') }}</button>
											<button type="button" role="tab" class="bio-seg" :class="{ activo: modoInput === 'HUM' }" @click="modoInput = 'HUM'">{{ $t('domotek.varios.RH') }}</button>
										</div>
										<div class="bio-teclado-datos">
											<div><span>{{ $t('domotek.keypad.current') }}</span><strong>{{ bioTecladoActual }}</strong></div>
											<div><span>{{ $t('domotek.keypad.currentTarget') }}</span><strong :class="{ apagado: !bioTecladoObjetivo }">{{ bioTecladoObjetivo || $t('domotek.keypad.off') }}</strong></div>
										</div>
										<div class="bio-teclado-valor" :class="{ hum: bioModoHum, fuera: bioFueraRango && !bioValorVacio }">
											<span>{{ $t('domotek.keypad.newTarget') }}</span>
											<strong>{{ bioValorVacio ? '—' : (bioModoHum ? humedad : cadenaNum) }}</strong><small>{{ bioModoHum ? '%' : '°C' }}</small>
										</div>
										<div class="bio-teclado-rango" :class="{ fuera: bioFueraRango && !bioValorVacio }">{{ bioTecladoRango }}</div>
										<div class="bio-teclado-atajos">
											<button v-for="p in bioAtajos" :key="p.valor" type="button" :class="{ activo: String(p.valor) === (bioModoHum ? humedad : cadenaNum), hum: bioModoHum }" @click="bioFijar(p.valor)">{{ p.texto }}</button>
										</div>
										<div style="flex: 1"></div>
										<div class="bio-teclado-acciones">
											<template v-if="bioModoHum">
												<button type="button" class="bio-teclado-sec" :disabled="!miniclima_on" @click="stopHumedad()">{{ $t('domotek.keypad.turnOff') }}</button>
												<button type="button" class="bio-teclado-ok hum" :disabled="bioFueraRango" @click="okHumedad()">{{ bioValorVacio ? $t('domotek.keypad.set') : $t('domotek.keypad.setHumidity', [humedad]) }}</button>
											</template>
											<template v-else>
												<button v-if="bioHeaterTeclado && bioHeaterTeclado.state === 'fault'" type="button" class="bio-teclado-sec peligro" @click="handleFixButton()">{{ $t('domotek.keypad.resetFault') }}</button>
												<button v-else type="button" class="bio-teclado-sec" :disabled="!bioHeaterTeclado || bioHeaterTeclado.state === 'off'" @click="handleOffButton()">{{ $t('domotek.keypad.turnOff') }}</button>
												<button type="button" class="bio-teclado-ok" :disabled="bioFueraRango" @click="okNums()">{{ bioValorVacio ? $t('domotek.keypad.heat') : $t('domotek.keypad.heatTo', [cadenaNum]) }}</button>
											</template>
										</div>
									</section>
									<section class="bio-teclado-num" :aria-label="$t('domotek.keypad.keypad')">
										<button v-for="n in [7, 8, 9, 4, 5, 6, 1, 2, 3]" :key="n" type="button" @click="bioTecla(n)">{{ n }}</button>
										<button type="button" class="suave" :aria-label="$t('domotek.keypad.clear')" @click="bioFijar(0)">C</button>
										<button type="button" @click="bioTecla(0)">0</button>
										<button type="button" class="suave" :aria-label="$t('domotek.keypad.delete')" @click="bioModoHum ? deleteHumedad() : deleteNums()"><v-icon>mdi-backspace-outline</v-icon></button>
									</section>
								</div>
								<template v-else>
								<v-btn @click="marcador = false" x-large block class="blue lighten-3">
									<v-icon x-large>mdi-close</v-icon>
								</v-btn>
								<v-card class="blue lighten-5 mt-3 mb-3 mr-5">
									<v-row class="ma-0">
										<v-col class="ma-1" cols="12">
											<v-row class="ma-0">
												<v-col align="center" cols="12" class="ma-2 clsVcol">
													<v-row justify="center" align="center">

														<!-- Max/Min HUM o vacío -->
														<v-col cols="2" class="d-flex flex-column align-center justify-center">
															<template v-if="modoDialog === 'HUM' && modoInput === 'HUM'">
																<span>max: {{ HUMIDITY_max }}</span>
																<span>min: {{ HUMIDITY_min }}</span>
															</template>
															<template v-else-if="modoDialog === 'HUM' && modoInput === 'TEMP'">
																<span>max: {{ heaterTools[20].max - 10 }}</span>
																<span>min: {{ $t('domotek.varios.minTemp') }}</span>
															</template>
														</v-col>
														<!-- <v-col cols="2" v-else></v-col> -->

														<!-- Botón -->
														<v-col cols="2" class="d-flex align-center justify-center">
															<template v-if="modoDialog === 'HUM' && modoInput === 'HUM'">
																<v-btn width="80px" v-if="miniclima_on" @click="stopHumedad()" rounded color="red lighten-3"><v-icon>mdi-stop</v-icon></v-btn>
																<v-btn width="80px" v-else @click="startHumedad()" rounded color="green lighten-3"><v-icon>mdi-play</v-icon></v-btn>
															</template>
															<template v-else>
																<v-btn width="80px" v-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'active'" @click="handleOffButton()" rounded color="red lighten-3">
																	<v-icon>mdi-stop</v-icon>
																</v-btn>
																<v-btn width="80px" v-else-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'standby'" @click="handleOffButton()" rounded color="red lighten-3">
																	<v-icon>mdi-stop</v-icon>
																</v-btn>
																<v-btn width="80px" v-else-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'off'" @click="okNums()" rounded color="green lighten-3">
																	<v-icon>mdi-play</v-icon>
																</v-btn>
																<v-btn class="clsvbtn4" width="80px" v-else-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'fault'" @click="handleFixButton()" rounded>
																	<code-btn width="80px" rounded class="red clscodebtn4" :code="`M562 P${toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1}`">fix</code-btn>
																</v-btn>
															</template>
															
														</v-col>

														<!-- Campo de valor -->
														<v-col align="center" cols="2" class="pa-1" style="transform: translateX(30%);">
															<v-text-field v-if="modoDialog === 'HUM' && modoInput === 'HUM'"
																v-model="humedad" readonly outlined label="RH (%)"
																ref="humedadInput" input-class="text-center">
															</v-text-field>
															<v-text-field v-else
																v-model="cadenaNum" readonly outlined label="Temp (°C)"
																ref="cadenaNumInput" @keydown.enter="okNums()"
																input-class="text-center">
															</v-text-field>
														</v-col>

														<!-- Info derecha -->
														<v-col cols="6" class="clsCama">
															<v-row>
																<v-col cols="2" align="center" style="transform: translateX(25%);">
																	<template v-if="modoDialog === 'HUM'">
																		<v-icon color="teal" v-if="miniclima_on">mdi-power</v-icon>
																		<v-icon color="grey" v-else>mdi-power-off</v-icon>
																	</template>
																	<template v-else>
																		<v-icon color="red" v-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'fault'">mdi-close-circle-outline</v-icon>
																		<v-icon color="teal" v-else-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'active'">mdi-power</v-icon>
																		<v-icon color="warning" v-else-if="heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].state == 'standby'">mdi-power-cycle</v-icon>
																		<v-icon color="grey" v-else>mdi-power-off</v-icon>
																	</template>
																</v-col>
																<v-col cols="10" align="left">
																	<template v-if="modoDialog === 'HUM'">
																		<v-card elevation="1" rounded style="border: 1px solid #90CAF9;" class="pa-0 mt-n6">
																			<v-row no-gutters align="center">
																				<v-col cols="6" class="pa-1">
																					<v-card @click="modoInput = 'HUM'" class="pa-1" style="cursor: pointer;"
																						:style="modoInput === 'HUM' ? 'background-color: #E3F2FD;' : 'background-color: transparent;'"
																						elevation="0" rounded>
																						<v-row no-gutters>
																							<v-col align="center">
																								<span :style="modoInput === 'HUM' ? 'color: #1565C0; font-weight: bold;' : 'color: grey;'">{{ $t('domotek.varios.RH') }}</span>
																							</v-col>
																						</v-row>
																						<v-row no-gutters>
																							<v-col align="center">
																								<span :style="modoInput === 'HUM' ? 'color: #1565C0; font-weight: bold;' : 'color: grey;'">
																									{{ miniclima_rh !== undefined && miniclima_rh !== null ? Number(miniclima_rh).toFixed(1) : "--" }}
																								</span>
																								<strong :style="modoInput === 'HUM' ? 'color: #1565C0;' : 'color: grey;'">
																									/ {{ miniclima_setPoint === 0 ? '--' : miniclima_setPoint }}
																								</strong>
																							</v-col>
																						</v-row>
																					</v-card>
																				</v-col>
																				<v-divider vertical></v-divider>
																				<v-col cols="6" class="pa-1">
																					<v-card @click="switchToTemp()" class="pa-1" style="cursor: pointer;"
																						:style="modoInput === 'TEMP' ? 'background-color: #E3F2FD;' : 'background-color: transparent;'"
																						elevation="0" rounded>
																						<v-row no-gutters>
																							<v-col align="center">
																								<span :style="modoInput === 'TEMP' ? 'color: #1565C0; font-weight: bold;' : 'color: grey;'">
																									{{ $t('domotek.varios.temp') }}
																								</span>
																							</v-col>
																						</v-row>
																						<v-row no-gutters>
																							<v-col align="center">
																								<span :style="modoInput === 'TEMP' ? 'color: #1565C0; font-weight: bold;' : 'color: grey;'">
																									{{ heaterTools[20].current == -273.1 || heaterTools[20].current == -273.15 ? "--" : heaterTools[20].current.toFixed(1) }}
																								</span>
																								<strong :style="modoInput === 'TEMP' ? 'color: #1565C0;' : 'color: grey;'">
																									/ {{ heaterTools[20].active == 0 ? '--' : heaterTools[20].active }}
																								</strong>
																							</v-col>
																						</v-row>
																					</v-card>
																				</v-col>
																			</v-row>
																		</v-card>
																	</template>
																	<template v-else>
																		<!-- Modo HEAT normal -->
																		<v-row>
																			<v-col align="center" v-if="toolClickTemperature != 4 && toolClickTemperature != 20">Temp (°C)</v-col>
																			<v-col align="center" v-else-if="toolClickTemperature == 4">{{ nameCama.analog[0].name == "PLTF-REF" ? "PLTF-REF" : "PLTF-HT" }}</v-col>
																			<v-col align="center" v-else>Temp (°C)</v-col>
																			<v-col><span>max: {{ toolClickTemperature == 20 ? heaterTools[20].max - 10 : heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature+1].max - 10 }}</span></v-col>
																		</v-row>
																		<v-row>
																			<v-col align="center">
																				<span>{{ heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].current == -273.1 || heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].current == -273.15 ? "--" : heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].current.toFixed(1) }}</span>
																				<strong> / {{ heaterTools[toolClickTemperature == 4 ? 0 : toolClickTemperature == 20 ? 20 : toolClickTemperature+1].active }}</strong>
																			</v-col>
																			<v-col>
																				<span>min: {{ 
																					toolClickTemperature == 4 && nameCama.analog[0].name == "PLTF-REF" 
																						? getMinValue() 
																						: (NombreTool(toolClickTemperature) === 'FIL' || NombreTool(toolClickTemperature) === 'UPE' || NombreTool(toolClickTemperature) === 'FIL-HT')
																							? 60
																							: $t('domotek.varios.minTemp')
																				}}</span>
																			</v-col>
																		</v-row>
																	</template>
																</v-col>
															</v-row>
														</v-col>

													</v-row>
												</v-col>

												<!-- TECLADO -->
												<v-col align="center" cols="12" class="pa-1">
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(7) : clickNums(7)"><span>7</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(8) : clickNums(8)"><span>8</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(9) : clickNums(9)"><span>9</span></v-btn>
												</v-col>
												<v-col align="center" cols="12" class="pa-1">
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(4) : clickNums(4)"><span>4</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(5) : clickNums(5)"><span>5</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(6) : clickNums(6)"><span>6</span></v-btn>
												</v-col>
												<v-col align="center" cols="12" class="pa-1">
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(1) : clickNums(1)"><span>1</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(2) : clickNums(2)"><span>2</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(3) : clickNums(3)"><span>3</span></v-btn>
												</v-col>
												<v-col align="center" cols="12" class="pa-1 mb-3">
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? deleteHumedad() : deleteNums()"><v-icon>mdi-arrow-left</v-icon></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? clickHumedad(0) : clickNums(0)"><span>0</span></v-btn>
													<v-btn rounded height="50" width="170" class="blue lighten-4 ml-4 mr-4" @click="modoDialog === 'HUM' && modoInput === 'HUM' ? okHumedad() : okNums()"><span>OK</span></v-btn>
												</v-col>

											</v-row>
										</v-col>
									</v-row>

									<!-- Dialog temperatura fuera de rango -->

								</v-card>
								</template>
							</v-dialog>
									<v-dialog v-model="showTemperatureOutOfRangeDialog" persistent width="480">
										<v-card class="blue lighten-5">
											<v-card-title><span class="headline">{{ $t('generic.warning') }}</span></v-card-title>
											<v-card-text>{{ $t('domotek.varios.temp_out') }}</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn color="primary" @click="showTemperatureOutOfRangeDialog = false">OK</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
							<v-dialog v-model="showMiniClimaWarning" persistent width="480">
								<v-card class="blue lighten-5">
									<v-card-title>
										<span class="headline">{{ $t('generic.warning') }}</span>
									</v-card-title>
									<v-card-text>
										{{ $t('domotek.varios.RH_enabled') }}
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="red lighten-3" rounded @click="stopHumedad(); showMiniClimaWarning = false; modoInput = 'TEMP'">
											<v-icon>mdi-stop</v-icon> {{ $t('domotek.varios.OffAndContinue') }}
										</v-btn>
										<v-btn color="primary" @click="showMiniClimaWarning = false">
											{{ $t('generic.cancel') }}
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
							<!-- Dialog humedad fuera de rango -->
							<v-dialog v-model="showHumidityOutOfRangeDialog" persistent width="480">
								<v-card class="blue lighten-5 mt-3 mb-3 mr-5">
									<v-card-title>
										<span class="headline">{{ $t('generic.warning') }}</span>
									</v-card-title>
									<v-card-text>
										{{ $t('domotek.varios.hum_out') }}
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" @click="showHumidityOutOfRangeDialog = false">OK</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
							<v-dialog v-model="marcadorDrum">
								<v-btn @click="marcadorDrum = false" large block class="blue lighten-3">
									<v-icon large>mdi-close</v-icon>
								</v-btn>
								<v-card class="blue lighten-5 mt-2 mb-2 mr-3">
									<v-row class="ma-0">
										<v-col class="ma-1" cols="12">
											<v-row class="ma-0">
												<v-col align="center" cols="20" class="ma-1 clsVcol">
													<v-row>
														<v-col cols="4" class="mt-2 clsTools">
															
															<v-btn v-if="getDrumSpeedSet() !== 0" class="clsvbtn2" width="70px" @click="stopDrum()" rounded color="red lighten-3">
																<v-icon>mdi-stop</v-icon>
															</v-btn>
															<v-btn v-else class="clsvbtn2" width="70px" @click="onPlayRPM()" rounded color="green lighten-3">
																<v-icon>mdi-play</v-icon>
															</v-btn>
														</v-col>
														
														<v-col cols="4" class="pa-1">
															<v-text-field v-model="cadenaNum" readonly outlined dense label="RPM" ref="cadenaNumInput" @keydown.enter="onChangeRPM(cadenaNum)"></v-text-field>
														</v-col>
														<v-col cols="4" class="mt-2 clsTools">
															<v-row>
																<!-- <v-col cols="12" class="text-center"> -->
																	<!-- {{ $display(drumSpeed, 0, $t('generic.rpm')) }} -->
																<!-- </v-col> -->
																<v-col cols="12" class="text-center">
																	<span>max: {{ this.RPM_max }}</span>
																</v-col>
																<v-col cols="12" class="text-center">
																	<span>min: {{ this.RPM_min }}</span>
																</v-col>
															</v-row>
														</v-col>
													</v-row>
												</v-col>												
												<v-col align="center" cols="12" class="pa-1">
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(7)">
														<span>7</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(8)">
														<span>8</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(9)">
														<span>9</span>
													</v-btn>
												</v-col>
												<v-col align="center" cols="12" class="pa-1">
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(4)">
														<span>4</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(5)">
														<span>5</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(6)">
														<span>6</span>
													</v-btn>
												</v-col>
												<v-col align="center" cols="12" class="pa-1">
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(1)">
														<span>1</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(2)">
														<span>2</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(3)">
														<span>3</span>
													</v-btn>
												</v-col>												
												<v-col align="center" cols="12" class="pa-1 mb-3">
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="deleteNums()">
														<v-icon>mdi-arrow-left</v-icon>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="clickNums(0)">
														<span>0</span>
													</v-btn>
													<v-btn rounded height="40" width="140" class="blue lighten-4 mx-2" @click="onChangeRPM(cadenaNum)">
														<code-btn rounded height="40" width="140" class="blue lighten-4" :disabled="isNaN(parseInt(cadenaNum)) || parseInt(cadenaNum) < this.RPM_min || parseInt(cadenaNum) > this.RPM_max">
															<span>OK</span>
														</code-btn>
													</v-btn>
												</v-col>
											</v-row>
										</v-col>
									</v-row>
								</v-card>
							</v-dialog>

							<v-dialog v-model="showRPMOutOfRangeDialog" persistent width="480">
								<v-card class="blue lighten-5 mt-3 mb-3 mr-5">
								<v-card-title>
									<span class="headline">{{ $t('generic.warning') }}</span>
								</v-card-title>
								<v-card-text>
									{{ $t('domotek.varios.rpm_out') }}
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="primary" @click="showRPMOutOfRangeDialog = false">OK</v-btn>
								</v-card-actions>
								</v-card>
							</v-dialog>
							<!-- fullscreen hide-overlay> -->
							<!-- domotek: coaxial con el diseño nuevo -->
							<v-dialog v-if="temaBio" v-model="marcadorMix" max-width="760" content-class="bio-teclado-dialogo">
								<coaxial-panel v-if="marcadorMix" v-on:close-dialog="closeDialog"></coaxial-panel>
							</v-dialog>
							<v-dialog v-else v-model="marcadorMix"> 
								<v-col cols="12" align="center" class="ma-0 pa-0">
									<coaxial-panel v-on:close-dialog="closeDialog"></coaxial-panel> 
								</v-col>
							</v-dialog>

							<v-dialog v-model="showPltfRefUnreachableDialog" persistent width="480">
								<v-card class="blue lighten-5 mt-3 mb-3 mr-5">
									<v-card-title>
										<span class="headline">{{ $t('generic.warning') }}</span>
									</v-card-title>
									<v-card-text style="white-space: pre-line;">
										{{ pltfRefUnreachableMsg }}
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="grey" text @click="cancelarPltfRefUnreachable()">
											{{ $t('generic.cancel') }}
										</v-btn>
										<v-btn color="primary" @click="setPltfRefToMinReachable()">
											{{ $t('domotek.varios.cool_to_minimum', { min: pltfRefMinReachable }) }}
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>

							
						</v-col>
					</v-row>
				<!-- de slot-btns-->
				</v-col>
			</v-row>
		</v-col>


		<!-- <v-col cols="12" align="center" class="mt-0"> -->

		<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->
		<!--																						 -->
		<!-- Con ChangeTool escogemos el Slot de Tool a configurar segun modelo de la maquina        -->
		<!-- 	MODELO 2A Slot 0 Slot 1 y Slot Cama        											 -->
		<!-- 	MODELO 4A Slot 0 Slot 1 Slot 2 Slot 3 y Slot Cama        							 -->
		<!-- 	MODELO HK Slot 0 Slot 1 Slot 2 Slot 3 y Slot Cama        							 -->
		<!--																						 -->
		<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->

		<v-col v-if="!temaBio" cols="12" align="center" class="mt-2">	
			<!-- <v-btn-toggle class="blue lighten-4" v-model="numTool" color="teal" rounded>
				<v-btn v-if="nameTools.length > 0" :value="0" class=" ma-2 blue lighten-5" @click="ChangeTool(0), camaClick = false">{{ $t('domotek.tools.t0') }}</v-btn>
				<v-btn v-if="nameTools.length > 1" :value="1" class=" ma-2 blue lighten-5" @click="ChangeTool(1), camaClick = false">{{ $t('domotek.tools.t1') }}</v-btn>
				<v-btn v-if="nameTools.length > 2" :value="2" class=" ma-2 blue lighten-5" @click="ChangeTool(2), camaClick = false">{{ $t('domotek.tools.t2') }}</v-btn>
				<v-btn v-if="nameTools.length > 3" :value="3" class=" ma-2 blue lighten-5" @click="ChangeTool(3), camaClick = false">{{ $t('domotek.tools.t3') }}</v-btn>
				<v-btn :value="4" class=" ma-2 blue lighten-5" @click="ChangeCama(4), camaClick = true">{{ $t('domotek.tools.platform') }}</v-btn>
			</v-btn-toggle> -->
			<v-divider></v-divider>
		</v-col>
		<!-- domotek: elegir tool con el tema oscuro (pantalla completa) -->
		<div v-if="temaBio && toolClick" class="bio-elegir">
			<header class="bio-elegir-cab">
				<button type="button" class="bio-volver" :aria-label="$t('domotek.tools.back')" @click="toolClick = false"><v-icon>mdi-chevron-left</v-icon></button>
				<h1 class="bio-h1" style="flex: 1; margin: 0">{{ camaClick ? $t('domotek.tools.whichPlatform') : $t('domotek.tools.whichTool') }}</h1>
				<div class="bio-segmentos" role="tablist">
					<button v-for="t in bioTools" :key="t.i" type="button" role="tab" class="bio-seg" :class="{ activo: !camaClick && ClickToolAnterior === t.i }" :aria-selected="!camaClick && ClickToolAnterior === t.i" @click="bioElegirTab(t.i)">{{ $t('domotek.tools.T' + t.i + 'Mini') }}</button>
					<button type="button" role="tab" class="bio-seg" :class="{ activo: camaClick }" :aria-selected="camaClick" @click="bioElegirTab(4)">{{ $t('domotek.tools.platformMini') }}</button>
				</div>
			</header>
			<div v-if="!camaClick" class="bio-elegir-grid" role="radiogroup">
				<button v-for="registro in filterPadresPorTool" :key="registro.idPadre + registro.idHijo + registro.titulo" type="button" role="radio"
					class="bio-opcion" :class="{ actual: registro.idTool !== -1 && registro.idHijo === '', carpeta: registro.idTool === -1 && registro.idHijo !== '' }"
					:aria-checked="registro.idTool !== -1 && registro.idHijo === ''"
					@click="ChangeSelectedFam(registro.idTool, registro.idHijo)">
					<v-icon>{{ bioIconoTool(registro) }}</v-icon>
					<span v-html="replaceFilter(registro.titulo)"></span>
				</button>
			</div>
			<div v-else class="bio-elegir-grid" role="radiogroup">
				<button type="button" class="bio-opcion" @click="ChangeBed(0)"><v-icon>mdi-radiator</v-icon><span>PLTF-HP</span></button>
				<button type="button" class="bio-opcion" @click="ChangeBed(1)"><v-icon>mdi-snowflake</v-icon><span>PLTF-REF</span></button>
				<button v-if="MewCapable" type="button" class="bio-opcion" @click="ChangeBed(2)"><v-icon>mdi-grid</v-icon><span>PLTF-MEW</span></button>
				<button v-if="DrumCapable" type="button" class="bio-opcion" @click="ChangeBed(3)"><v-icon>mdi-rotate-3d-variant</v-icon><span>DRUM-COLL</span></button>
			</div>
			<footer class="bio-elegir-pie">
				<span class="bio-tenue" style="flex: 1">
					{{ $t('domotek.tools.nowIn', [camaClick ? $t('domotek.tools.platform') : $t('domotek.tools.T' + ClickToolAnterior + 'Mini')]) }}
					<strong style="color: var(--bio-texto); font-weight: 500">{{ camaClick ? bioNombreCama : (bioTools[ClickToolAnterior] ? bioTools[ClickToolAnterior].nombre : '') }}</strong>
				</span>
				<button type="button" class="bio-btn-sec" @click="toolClick = false">{{ $t('domotek.tools.back') }}</button>
			</footer>
		</div>

		<v-col cols="12" v-show="toolClick && !temaBio" align="center">
			<v-btn-toggle v-model="numSelected" color="teal" mandatory>
				<v-row class="vrcl1 blue lighten-4" style="width:80%">
		<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->
		<!--																						 -->
		<!-- Con ChangeSelected escogemos Tool para el Slot de Tool previamente Seleccionado  		 -->
		<!-- 	Actualmente hay 9 de 15 modelos de Tool definidos					 				 -->
		<!--																						 -->
		<!-- Con ChangeBed escogemos Tipo de Plataforma  que usará la maquina						 -->
		<!-- 	Actualmente hay 2 Tipos de Plataformas Caliente y Refrigerada						 -->
		<!--																						 -->
		<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK -->

					<!-- <v-col cols="12" align="center" class="blue lighten-4" v-if="!camaClick">
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(0)" rounded>Empty</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(1)" rounded>SYR</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(2)" rounded>SYR-HEAT</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(3)" rounded>SYR-ES</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(4)" rounded>FIL</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(5)" rounded>FIL-HT</v-btn> 
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(6)" rounded>UPE</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(7)" rounded>UV-365</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(8)" rounded>UV-405</v-btn>
						<v-btn class=" ma-2 blue lighten-5" @click="ChangeSelected(15)" rounded>AUTO-CAL</v-btn>
					</v-col> -->
					<!-- <v-btn v-show="!camaClick" v-for="registro in jTools" :key="registro.idFam" class="vbtn1 ma-2 blue lighten-5" @click="ChangeSelected(registro.idTool)" rounded>{{registro.nombreTool}}</v-btn>	 -->
					
					
					<v-btn :color="(registro.idTool === -1) ? 'blue lighten-5' : 'primary'" active-class="no-active" v-show="!camaClick" v-for="registro in filterPadresPorTool" :key="registro.idPadre" class="vbtn1 ma-1" @click="ChangeSelectedFam(registro.idTool, registro.idHijo)" rounded>
						<!-- <div>{{registro.titulo}}</div> -->
						<!-- <span style="white-space: normal;">{{registro.titulo}}</span>-->
						<span v-html="replaceFilter(registro.titulo)"></span>
					</v-btn>
					<!-- <v-col class="blue lighten-4 vccl1" cols="2" v-for="registro in jFamilia" :key="registro.idFam" >
						<v-btn v-if="!camaClick" class="vbtn1 ma-2 blue lighten-5" @click="ChangeSelected(index)" rounded>{{registro.nombreFam}}</v-btn>	
					</v-col> -->
					

					<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK	-->
					<!--																							-->
					<!--	2024/07/08  Jon Ander, 		DWC v1.8.2 → DWC v1.8.4										-->
					<!--	He vuelto al modo viejo de seleccionar las plataformas, 								-->
					<!--	en vez de usar el "v-for", se define cada una de las plataformas independientemente.	-->
					<!--	He hecho esto para poder poner un "v-if" a cada uno y de esta manera poder				-->
					<!--	configurar, sin cambiar DWC, las opciones de plataformas que se presentan al usuario	-->
					<!--	usando las variables globales definidas en 	0:/sys/domoBIO/Variables_T1/DWC_Menus.g		-->
					<!--																							-->
					<!-- DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK DOMOTEK	-->

					<!-- <v-btn color="blue lighten-5" v-show="camaClick" v-for="registro in jBeds" :key="registro.idBed" class="vbtn1 ma-2" @click="ChangeBed(registro.idBed)" rounded>
						<div>{{registro.nombreBed}}	</div>
					</v-btn> -->
					<v-col cols="12" align="center" class="blue lighten-4" v-if="camaClick">
						<v-btn class="ma-2 blue lighten-5" @click="ChangeBed(0)" rounded					>PLTF-HP</v-btn>
						<v-btn class="ma-2 blue lighten-5" @click="ChangeBed(1)" rounded					>PLTF-REF</v-btn>
						<v-btn class="ma-2 blue lighten-5" @click="ChangeBed(2)" rounded v-if=MewCapable	>PLTF-MEW</v-btn>
						<v-btn class="ma-2 blue lighten-5" @click="ChangeBed(3)" rounded v-if=DrumCapable	>DRUM-COLL </v-btn>

					</v-col>
				</v-row>
			</v-btn-toggle>
				<v-row class="red">

				</v-row>
		</v-col>
		<v-col cols="12" v-if="$store.state.nivelUsuario >= 3">
			<tools-file-list></tools-file-list>
		</v-col>
		<v-col cols="12" class="red pa-0 ma-0">
			<v-dialog v-model="dialogBed" max-width="500" content-class="clsDialogBed">
				<v-card class="text-center">
					<v-card-text>
						<div class="vctCentradoBold">{{  $t('domotek.varios.confirm_bed_change') }}</div>
					</v-card-text>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="right">
								<v-btn width="90" height="90" color="green darken-1" text @click="dialogBed = false" outlined rounded>
									<code-btn width="90" height="90" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
								
							</v-col>
							<v-col>
								<v-btn width="90" height="90" color="green darken-1" text @click="dialogBed = false, AceptaTool(numTool,numCodigo), toolClick = false, numTool = null" outlined rounded>
									<code-btn width="90" height="90" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }} 
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="dialogTemp" content-class="clsDialogTemp ">
				<v-btn @click="dialogTemp = false" x-large block class="blue lighten-3">
					<!-- <v-icon x-large> mdi-close </v-icon> -->
					<v-icon x-large>mdi-close</v-icon>
				</v-btn>
				<v-col cols="12" align="center" class="mt-0">
					<!--<tools-panel></tools-panel> -->
					<!-- <temperatura-btn></temperatura-btn> -->
					<!-- <calibration-file-list></calibration-file-list> -->
				</v-col>
			</v-dialog>
			<v-dialog v-model="dialog" max-width="500" content-class="clsDialogTools">
				<v-card>
					<v-card-text class="text-center">
					<!-- You sure want to change the tool {{numTool}}? -->
						<div class="vctCentradoBold"> {{ $t( 'domotek.tools.confirm_change' )  }} </div>
					</v-card-text>
					<v-card-actions>
						<v-row>
							<v-col cols="6" align="right">
								<v-btn width="90" height="90" color="green darken-3" text @click="dialog = false, ChangeTool(numTool),toolClick = true" outlined rounded>
									<code-btn width="90" height="90" color="red lighten-3" rounded>
										{{ $t('domotek.varios.no') }}
									</code-btn>
								</v-btn>
							</v-col>
							<v-col>
								<v-btn width="90" height="90" color="green darken-3" text @click="dialog = false, AceptaTool(numTool,numCodigo), toolClick = false, numTool = null" outlined rounded>
									<code-btn width="90" height="90" color="green lighten-3" rounded>
										{{ $t('domotek.varios.yes') }} 
									</code-btn>
								</v-btn>
							</v-col>
						</v-row>

					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="DialogCalibration" fullscreen hide-overlay>
				<v-col cols="12" align="center" class="ma-0 pa-0">
					<calibration-panel v-on:close-dialog="closeDialog"></calibration-panel>
				</v-col>
			</v-dialog>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { registerRoute } from '..'
import i18n from '../../i18n'
import { mapState, mapGetters,mapMutations, mapActions } from 'vuex'
import { HeaterState} from '@/store/machine/modelEnums'
// import CodeBtn from '../../components/buttons/CodeBtn.vue'
// import JsonData from '../../assets/data/jsonDatabase.json'
export default {
	// components: { CodeBtn },
	install() {
		// Register a route via Files -> Macros
		registerRoute(this, {
			Files: {
				Tools: {
					icon: 'mdi-screwdriver',
					caption: 'menu.files.tools',
					path: '/Files/tools',
					nivel: 0 //luis - control de usuario
				}
			}
		});
	},
	data(){
		return{
			numCama: 0,
			numTool: null,
			numSelected: 0,
			tempAmbiente: 20,
			arrayNameTools: this.nameTool0,
			toolClick: false,
			camaClick: false,
			chamberTimeout: null,
			ClickToolAnterior: 0,
			dialog: false,
			dialogBed: false,
			codigo: null,
			numCodigo: null,
			secuencia: null,
			dialogTemp: false,
			DialogCalibration: false,
			cadenaNum: "0",
			numeros: null,
			marcador: false,
			marcadorDrum: false,
			marcadorMix: false,
			showTemperatureOutOfRangeDialog: false,
			showRPMOutOfRangeDialog : false,
			RPM_min: 0,
			RPM_max: 4000,
			toolCalibrado: {},   
			dialogOffsetsVisible: false, 
			offsetTexto: '',  
			offsetTitulo: '',
			currentTool: null ,
			toolClickTemperature: null,
			marcadorHumedad: false,
			humedad: "0",
			HUMIDITY_min: 15,
			HUMIDITY_max: 85,
			showHumidityOutOfRangeDialog: false,
			humedadEncendida: false,
			//humedadSetPoint: "--",
			controlHumedadActivo: false,
			controlHumedadInterval: null,
			controlHumedadTimeout: null,
			showMiniClimaWarning: false,
			modoInput: 'HUM', // 'HUM' o 'TEMP'
			modoDialog: 'HEAT', // 'HEAT' o 'HUM'
			// --- Potencia PLTF-REF según conexión a Chamber ---
			pltfRefPowerFull: 1,      // M307 H0 S1  (100%)
			pltfRefPowerHalf: 0.5,    // M307 H0 S0.5 (50%)
			pltfRefPowerDelay: 3000,  // ms de espera antes de aplicar la potencia (ajustable)
			// --- Deltas alcanzables (temperatura Chamber - delta), confirmados ---
			pltfRefDeltaConnected: 21, // delta a 100% (conectada a Chamber)
			pltfRefDeltaCell: 18,      // delta a 50% (modo célula, no conectada a Chamber)

			// --- Dialog de aviso "temperatura no alcanzable" ---
			showPltfRefUnreachableDialog: false,
			pltfRefUnreachableMsg: '',
			pltfRefMinOverride: null, // mínimo temporal tras pulsar Cancelar en el aviso; null = usa el valor de hardware (~5°C)
			sHijo: "",
			filterBy: [""],
			retTool0name: "",
			retTool1name: "",
			retTool2name: "",
			retTool3name: "",
			rpmOptions: ['300', '400', '500', '1000', '1500', '2000', '2500', '3000', '3500', '4000'],
			item: null,
			//slider: 0.50,
			
			jTree: [
				{idPadre: "",idHijo: "EMPTY", titulo: i18n.t('domotek.toolNames.EMPTY'), idTool: 0 },
				{idPadre: "",idHijo: "SYRINGE", titulo: i18n.t('domotek.toolNames.SYRINGE'), idTool: -1 },
				{idPadre: "SYRINGE",idHijo: "SYR", titulo: i18n.t('domotek.toolNames.SYRINGE_STD'), idTool: -1 },
				{idPadre: "SYRINGE",idHijo: "SYR-HEAT", titulo: i18n.t('domotek.toolNames.SYRINGE_HEAT'), idTool: -1 },
				{idPadre: "SYRINGE",idHijo: "SYR-ES", titulo: i18n.t('domotek.toolNames.SYRINGE_ES'), idTool: -1 },
				{idPadre: "SYRINGE",idHijo: "COAX", titulo: i18n.t('domotek.toolNames.SYRINGE_COAX'), idTool: -1 },	//	2026/10/08 Gorka, Lo he escondido
				//{idPadre: "SYRINGE",idHijo: "", titulo:i18n.t('domotek.toolNames.SYRINGE_EMD'), idTool: 11 },		//	2026/02/19 Gorka, Lo he escondido
				//{idPadre: "SYR-EMD",idHijo: "", titulo:i18n.t('domotek.toolNames.SYRINGE_EMD'), idTool: 11 },		//	2026/02/19 Gorka, Lo he escondido
				//{idPadre: "SYR-EMD",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },			//	2026/02/19 Gorka, Lo he escondido
				{idPadre: "SYRINGE",idHijo: "", titulo: i18n.t('domotek.toolNames.BACK'), idTool: -1 },
				{idPadre: "SYR",idHijo: "SYR 10ML", titulo: i18n.t('domotek.toolNames.SYRINGE_STD')+ " 10ML", idTool: 1 },
				{idPadre: "SYR 10ML",idHijo: "", titulo: i18n.t('domotek.toolNames.SYRINGE_STD')+ " 10ML", idTool: 1 },
				{idPadre: "SYR 10ML",idHijo: "", titulo: i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				//{idPadre: "SYR",idHijo: "", titulo:  i18n.t('domotek.toolNames.SYRINGE_STD')+" 3ML", idTool: -1 },		//	2025/01/13 Gorka, Lo he escondido 
				{idPadre: "SYR",idHijo: "", titulo: i18n.t('domotek.toolNames.BACK'), idTool: -1 },
				{idPadre: "SYR-HEAT",idHijo: "SYR-HEAT 10ML", titulo:  i18n.t('domotek.toolNames.SYRINGE_HEAT')+" 10ML", idTool: 2 },	
				{idPadre: "SYR-HEAT 10ML",idHijo: "", titulo:  i18n.t('domotek.toolNames.SYRINGE_HEAT')+" 10ML", idTool: 2 },	
				{idPadre: "SYR-HEAT 10ML",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				//{idPadre: "SYR-HEAT",idHijo: "", titulo:  i18n.t('domotek.toolNames.SYRINGE_HEAT') +" 3ML", idTool: -1 },		//	2025/01/13 Gorka, Lo he escondido
				{idPadre: "SYR-HEAT",idHijo: "", titulo: i18n.t('domotek.toolNames.BACK'), idTool: -1 },	
				{idPadre: "SYR-ES",idHijo: "SYR-ES 10ML", titulo:  i18n.t('domotek.toolNames.SYRINGE_ES')+" 10ML", idTool: 3 },	
				{idPadre: "SYR-ES 10ML",idHijo: "", titulo: i18n.t('domotek.toolNames.SYRINGE_ES')+" 10ML", idTool: 3 },	
				{idPadre: "SYR-ES 10ML",idHijo: "", titulo: i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				//{idPadre: "SYR-ES",idHijo: "", titulo: i18n.t('domotek.toolNames.SYRINGE_ES')+" 3ML", idTool: -1 },	 //	2025/01/13 Gorka, Lo he escondido
				{idPadre: "SYR-ES",idHijo: "", titulo: i18n.t('domotek.toolNames.BACK'), idTool: -1 },	
				{idPadre: "COAX",idHijo: "COAX 10ML", titulo:  i18n.t('domotek.toolNames.SYRINGE_COAX')+" 10ML", idTool: 9 },		//	2026/10/08 Gorka, Lo he escondido
				{idPadre: "COAX 10ML",idHijo: "", titulo: i18n.t('domotek.toolNames.SYRINGE_COAX')+" 10ML", idTool: 9 },		//	2026/10/08 Gorka, Lo he escondido	
				{idPadre: "COAX",idHijo: "", titulo: i18n.t('domotek.toolNames.BACK'), idTool: -1 },		//	2026/10/08 Gorka, Lo he escondido
				{idPadre: "",idHijo: "FILAMENT", titulo: i18n.t('domotek.toolNames.THERMOPLASTICS')+ "", idTool: -1 },
				{idPadre: "FILAMENT",idHijo: "FIL", titulo: i18n.t('domotek.toolNames.FIL'), idTool: 4 },
				{idPadre: "FIL",idHijo: "", titulo: i18n.t('domotek.toolNames.FIL'), idTool: 4 },
				{idPadre: "FIL",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				//{idPadre: "FILAMENT",idHijo: "FIL-HT", titulo: i18n.t('domotek.toolNames.FIL-HT'), idTool: 5 },	//	2026/10/08 Gorka, Lo he escondido
				//{idPadre: "FIL-HT",idHijo: "", titulo: i18n.t('domotek.toolNames.FIL-HT'), idTool: 5 },	//	2026/10/08 Gorka, Lo he escondido
				//{idPadre: "FIL-HT",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },	//	2026/10/08 Gorka, Lo he escondido
				{idPadre: "FILAMENT",idHijo: "UPE", titulo: i18n.t('domotek.toolNames.UPE'), idTool: 6 },
				{idPadre: "UPE",idHijo: "", titulo: i18n.t('domotek.toolNames.UPE'), idTool: 6 },
				{idPadre: "UPE",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				// {idPadre: "FILAMENT",idHijo: "UPE-ADV", titulo: i18n.t('domotek.toolNames.UPEADV'), idTool: 10 },		//	2024/07/08 Jon Ander, Lo he escondido 
				// {idPadre: "UPE-ADV",idHijo: "", titulo: i18n.t('domotek.toolNames.UPEADV'), idTool: 10 },				//	2024/07/08 Jon Ander, Lo he escondido 
				// {idPadre: "UPE-ADV",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },						//	2024/07/08 Jon Ander, Lo he escondido 
				{idPadre: "FILAMENT",idHijo: "", titulo: i18n.t('domotek.toolNames.BACK'), idTool: -1 },
				{idPadre: "",idHijo: "UV", titulo:i18n.t('domotek.toolNames.UV'), idTool: -1 },
				{idPadre: "UV",idHijo: "UV-365", titulo:i18n.t('domotek.toolNames.UV')+"-365", idTool: 7 },
				{idPadre: "UV-365",idHijo: "", titulo:i18n.t('domotek.toolNames.UV')+"-365", idTool: 7 },
				{idPadre: "UV-365",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				{idPadre: "UV",idHijo: "UV-405", titulo: i18n.t('domotek.toolNames.UV')+"-405", idTool: 8 },
				{idPadre: "UV-405",idHijo: "", titulo:i18n.t('domotek.toolNames.UV')+"-405", idTool: 8 },
				{idPadre: "UV-405",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				{idPadre: "UV",idHijo: "", titulo:i18n.t('domotek.toolNames.BACK'), idTool: -1 },
				// {idPadre: "",idHijo: "UTILITY", titulo:i18n.t('domotek.toolNames.UTILITY'), idTool: -1 },
				// {idPadre: "UTILITY",idHijo: "AUTOCAL", titulo: i18n.t('domotek.toolNames.AUTOCAL'), idTool: 15 },
				// {idPadre: "AUTOCAL",idHijo: "", titulo:i18n.t('domotek.toolNames.AUTOCAL'), idTool: 15 },
				// {idPadre: "AUTOCAL",idHijo: "", titulo:i18n.t('domotek.toolNames.CHANGE'), idTool: -1 },
				// {idPadre: "UTILITY",idHijo: "", titulo:i18n.t('domotek.toolNames.BACK'), idTool: -1 },
				{idPadre: "",idHijo: "AUTOCAL", titulo:i18n.t('domotek.toolNames.AUTOCAL'), idTool: 15 },

			],
			
			jBeds: [
				{idBed: 0, nombreBed: "PLTF-HP", finalNode: true },
				{idBed: 1, nombreBed: "PLTF-REF", finalNode: true },
				{idBed: 2, nombreBed: "PLTF-MEW", finalNode: true },
				{idBed: 3, nombreBed: "DRUM-COLL", finalNode: true },
			] 


		}
	},
	computed:{
		...mapMutations(['cambiarMenu']),
		...mapState({
			nameCama: state => state.machine.model.sensors,
			nameTools: state => state.machine.model.tools,
			heaterTools: state => state.machine.model.heat.heaters,
			//miMachineModel: state => state.machine.model.global.machineModel,
			nameHeaters: state => state.machine.model.sensors,
			move: state => state.machine.model.move,
		}),
		...mapState('machine/model', {
			boards: state => state.boards,
		}),
		...mapState('settings', ['temaBio']), // domotek
		bioTools() { // domotek: datos de las tarjetas del tema oscuro
			const n = (this.modeloMaquina == '2A') ? 2 : 4;
			const out = [];
			for (let i = 0; i < n; i++) {
				const tipo = this['T' + i];
				const nh = this['nameTools' + i + 'heaterslength'] || 0;
				const temps = [];
				[[i + 1, 0], [i + 11, 1]].forEach(([hi, k]) => {
					if (nh > k && this.heaterTools && this.heaterTools[hi]) {
						const sensor = this.nameHeaters && this.nameHeaters.analog && this.nameHeaters.analog[hi];
						temps.push({ nombre: sensor ? sensor.name : '', actual: this.bioTemp(this.heaterTools[hi]), objetivo: this.heaterTools[hi].active });
					}
				});
				out.push({
					i,
					tipo,
					nombre: this['T' + i + 'Name'],
					cal: !!this['T' + i + 'CAL'],
					vacio: tipo == 0 || tipo === undefined,
					estado: this.bioEstado(this.heaterTools && this.heaterTools[i + 1]),
					editable: tipo == 9 || (tipo != 0 && tipo != 7 && tipo != 8 && tipo != 1 && tipo != 3 && tipo != 15 && tipo != 11),
					temps
				});
			}
			return out;
		},
		bioModoHum() { return this.modoDialog === 'HUM' && this.modoInput === 'HUM'; }, // domotek: teclado
		bioIndiceTeclado() { const t = this.toolClickTemperature; return t == 4 ? 0 : (t == 20 ? 20 : t + 1); },
		bioHeaterTeclado() { return this.heaterTools ? this.heaterTools[this.bioIndiceTeclado] : null; },
		bioTecladoNombre() {
			const t = this.toolClickTemperature;
			if (t == 4) { return this.$t('domotek.tools.platform').replace(/^./, c => c.toUpperCase()) + (this.bioNombreCama ? ` · ${this.bioNombreCama}` : ''); }
			if (t == 20) { return 'Chamber'; }
			const nombre = this['T' + t + 'Name'];
			return `T${t + 1}` + (nombre ? ` · ${nombre}` : '');
		},
		bioTecladoActual() {
			if (this.bioModoHum) {
				return (this.miniclima_rh !== undefined && this.miniclima_rh !== null && this.miniclima_rh !== '--') ? `${Number(this.miniclima_rh).toFixed(1)} %` : '—';
			}
			const v = this.bioTemp(this.bioHeaterTeclado);
			return v === '--' ? '—' : `${v} °C`;
		},
		bioTecladoObjetivo() {
			if (this.bioModoHum) { return (this.miniclima_on && this.miniclima_setPoint) ? `${this.miniclima_setPoint} %` : ''; }
			const h = this.bioHeaterTeclado;
			return (h && h.state !== 'off' && h.active) ? `${h.active} °C` : '';
		},
		bioRango() {
			if (this.bioModoHum) { return { min: this.HUMIDITY_min, max: this.HUMIDITY_max }; }
			if (!this.bioHeaterTeclado) { return { min: 0, max: 0 }; }
			let min = 0, max = 0;
			try { min = this.getMinValue(); max = this.getMaxValue(); } catch (e) { /* sin datos */ }
			return { min, max };
		},
		bioValorVacio() { return (this.bioModoHum ? this.humedad : this.cadenaNum) === '0'; },
		bioFueraRango() {
			const v = parseInt(this.bioModoHum ? this.humedad : this.cadenaNum, 10);
			return isNaN(v) || v < this.bioRango.min || v > this.bioRango.max;
		},
		bioTecladoRango() {
			const { min, max } = this.bioRango;
			if (this.bioModoHum) { return this.$t('domotek.keypad.rangeHum', [min, max]); }
			return this.$t('domotek.keypad.range', [`${Math.round(min)} °C`, Math.round(max)]);
		},
		bioAtajos() {
			const { min, max } = this.bioRango;
			if (this.bioModoHum) {
				return [40, 50, 60, 70, 80, 90].filter(v => v >= min && v <= max).slice(0, 4).map(v => ({ valor: v, texto: `${v} %` }));
			}
			const lista = [];
			[4, 25, 37, 45, 60, 80, 120, 180, 220].forEach(v => {
				if (v >= min && v <= max && lista.length < 4 && !lista.some(p => p.valor === v)) { lista.push({ valor: v, texto: String(v) }); }
			});
			return lista;
		},
		bioChamberVisible() {
			return (this.modeloMaquina != '2A') && (this.chamberMode == true) && !!(this.heaterTools && this.heaterTools[20]);
		},
		bioNombreCama() {
			try { return this.nameCama.analog[0].name; } catch (e) { return ''; }
		},


		...mapGetters('isConnected', 'machine/model', ['global']),
		filterPadres() {
			//console.log("filterPadres");
			//console.log(this.jTree.filter(p => p.idPadre in this.filterBy));
			//console.log(this.jTree.filter(p => this.filterBy.includes(p.idPadre)));
			//console.log(this.jTree.filter(p => !this.filterBy.includes(p.idPadre)));
			//return this.jTree.filter(p => p.idPadre in this.filterBy);
			return this.jTree.filter(p => this.filterBy.includes(p.idPadre));
		},
		
		filterPadresPorTool() {
			return this.filterPadres.filter(registro => {
				// Solenoide oculto en T1 y T2 con chamber
				if (
					this.chamberMode === true &&
					registro.idTool === 11 &&
					(this.ClickToolAnterior === 1 || this.ClickToolAnterior === 2)
				) {
					return false
				}
				// Coaxial no disponible en T1 y T2
				if (
					registro.idHijo === 'COAX' &&
					(this.ClickToolAnterior === 1 || this.ClickToolAnterior === 2)
				) {
					return false
				}
				return true
			})
		},
		
		pageHeight () {
			return document.body.scrollHeight;
		},
		// machineModel: {
		// 	get() { 
		// 		if (this.$store.state.machine.model.global.machineModel === null || this.$store.state.machine.model.global.machineModel === undefined) {
		// 			console.log("ERROR NO DEFINIDA machineModel");
		// 		}	
		// 		else
		// 		{
		// 			console.log(this.$store.state.machine.model.global.machineModel);
		// 		}
		// 		return (this.$store.state.machine.model.global.machineModel);},
		// },
		T0: {
			get() { return (this.$store.state.machine.model.global.T0);},
		},
		T1: {
			get() { return (this.$store.state.machine.model.global.T1);},
		},
		T2: {
			get() { return (this.$store.state.machine.model.global.T2);},
		},
		T3: {
			get() { return (this.$store.state.machine.model.global.T3);},
		},
		Bed: {
			get() { return (this.$store.state.machine.model.global.Bed);},
		},
	
		SecuenciaT0: {
			get() { return (this.$store.state.machine.model.global.SecuenciaT0);},
		},
		SecuenciaT1: {
			get() { return (this.$store.state.machine.model.global.SecuenciaT1);},
		},
		SecuenciaT2: {
			get() { return (this.$store.state.machine.model.global.SecuenciaT2);},
		},
		SecuenciaT3: {
			get() { return (this.$store.state.machine.model.global.SecuenciaT3);},
		},
		SecuenciaBed: {
			get() { return (this.$store.state.machine.model.global.SecuenciaBed);},
		},
		T0CAL() {
			return this.$store.state.machine.model.global.T0CAL;
		},
		T1CAL() {
			return this.$store.state.machine.model.global.T1CAL;
		},
		 T2CAL() {
			return this.$store.state.machine.model.global.T2CAL;
		},
		T3CAL() {
			return this.$store.state.machine.model.global.T3CAL;
		},
	// nameTools[0].name
	nameTools0name: {
			get() {
				try {
					return this.$store.state.machine.model.tools[0].name; //nameTools[0].name
				} catch (error) {
					console.log(`error nameTools[0].name`);
					return "";
				}
			},
		},
	// nameTools[1].name
	nameTools1name: {
			get() {
				
				try {
					return this.$store.state.machine.model.tools[1].name; //nameTools[1].name
				} catch (error) {
					console.log(`error nameTools[1].name`);
					return "";
				}
			},
		},
	// nameTools[2].name
	nameTools2name: {
			get() {
				
				try {
					return this.$store.state.machine.model.tools[2].name; //nameTools[2].name
				} catch (error) {
					console.log(`error nameTools[2].name`);
					return "";
				}
			},
		},
		// nameTools[3].name
		nameTools3name: {
				get() {
					
					try {
						return this.$store.state.machine.model.tools[3].name; //nameTools[3].name
					} catch (error) {
						console.log(`error nameTools[3].name`);
						return "";
					}
				},
		},		
		//nameTools[0].heaters.length
		nameTools0heaterslength: {
				get() {
					
					try {
						//return this.$store.state.machine.model.tools[0].heaters.length; //nameTools[0].heaters.length
						return this.$store.state.machine.model.global.T0Heaters ;
					} catch (error) {
						console.log(`error nameTools[0].heaters.length`);
						return 0;
					}
				},
		},	
		//nameTools[1].heaters.length
		nameTools1heaterslength: {
				get() {
					
					try {
						//return this.$store.state.machine.model.tools[1].heaters.length; //nameTools[1].heaters.length
						return this.$store.state.machine.model.global.T1Heaters ;
					} catch (error) {
						console.log(`error nameTools[1].heaters.length`);
						return 0;
					}
				},
		},	
		//nameTools[2].heaters.length
		nameTools2heaterslength: {
				get() {
					
					try {
						//return this.$store.state.machine.model.tools[2].heaters.length; //nameTools[2].heaters.length
						return this.$store.state.machine.model.global.T2Heaters ;
					} catch (error) {
						console.log(`error nameTools[2].heaters.length`);
						return 0;
					}
				},
		},	
		//nameTools[3].heaters.length
		nameTools3heaterslength: {
				get() {
					
					try {
						//return this.$store.state.machine.model.tools[3].heaters.length; //nameTools[0].heaters.length
						return this.$store.state.machine.model.global.T3Heaters ;
					} catch (error) {
						console.log(`error nameTools[3].heaters.length`);
						return 0;
					}
				},
		},	
		modeloMaquina: {
			get() {
					try {
							return this.$store.state.machine.model.global.MachineModel ;
					} catch (error) {
							console.log(`error Tools.vue modeloMaquina`);
							return "2A";
					}
			}
		},
		chamberMode: {
			get() {
					try {
							return this.$store.state.machine.model.global.ChamberMode ;
					} catch (error) {
							console.log(`error Tools.vue ChamberMode`);
							return "2A";
					}
			}
		},
		miniclima_capable: {
			get() {
				try {
					return this.$store.state.machine.model.global.miniclima_capable;
				} catch {
					return false;
				}
			}
		},
		doorStateOpen: {
			get() {
					try {
							return this.$store.state.machine.model.global.doorStateOpen ;
					} catch (error) {
							console.log(`error Tools.vue doorStateOpen`);
							return "2A";
					}
			}
		},
		bedSelected: {
			get() {
					try {
							return this.$store.state.machine.model.global.bedSelected ;
					} catch (error) {
							console.log(`error Tools.vue bedSelected`);
							return "M";
					}
			}
		},
		drumSpeed: {
			get() {
					try {
							return this.$store.state.machine.model.global.rpmRodillo ;
					} catch (error) {
							console.log(`error Tools.vue drumSpeed`);
							return 0;
					}
			}
		},
		drumSpeedSet: {
			get() {
					try {
							return this.$store.state.machine.model.global.rpmRodilloSet ;
					} catch (error) {
							console.log(`error Tools.vue drumSpeedSet`);
							return 0;
					}
			}
		},
		
		T0Name: {
			get() {
					try {
							return this.$store.state.machine.model.global.T0Name ;
					} catch (error) {
							console.log(`error Tools.vue T0Name`);
							return "Empty";
					}
			}
		},
		T1Name: {
			get() {
					try {
							return this.$store.state.machine.model.global.T1Name ;
					} catch (error) {
							console.log(`error Tools.vue T1Name`);
							return "Empty";
					}
			}
		},
		T2Name: {
			get() {
					try {
							return this.$store.state.machine.model.global.T2Name ;
					} catch (error) {
							console.log(`error Tools.vue T2Name`);
							return "Empty";
					}
			}
		},
		T3Name: {
			get() {
					try {
							return this.$store.state.machine.model.global.T3Name ;
					} catch (error) {
							console.log(`error Tools.vue T3Name`);
							return "Empty";
					}
			}
		},
		DrumCapable: {			//	2024/07/08  Jon Ander, 		DWC v1.8.2 → DWC v1.8.4
			get() {
				return this.$store.state.machine.model.global.Drum_Capable},
		},
		MewCapable: {			//	2024/07/08  Jon Ander, 		DWC v1.8.2 → DWC v1.8.4
			get() {
				return this.$store.state.machine.model.global.Mew_Capable},
		},
		miniclima_rh: {
			get() {
				try {
					return this.$store.state.machine.model.global.miniclima_rh;
				} catch (error) {
					return "--";
				}
			}
		},
		chamberTemp: {
			get() {
				try {
					return this.$store.state.machine.model.heat.heaters[20].current;
				} catch { return 20; }
			}
		},
		miniclima_on: {
			get() {
				try {
					return this.$store.state.machine.model.global.miniclima_on;
				} catch {
					return false;
				}
			}
		},
		miniclima_setPoint: {
			get() {
				try {
					return this.$store.state.machine.model.global.miniclima_setPoint;
				} catch {
					return 0;
				}
			}
		},

		// Temperatura mínima realmente alcanzable ahora mismo, según sensor de Chamber
		// Delta aplicable según si está o no conectada al Chamber
		pltfRefDelta: {
			get() {
				return this.chamberMode ? this.pltfRefDeltaConnected : this.pltfRefDeltaCell;
			}
		},

		// Temperatura mínima realmente alcanzable ahora mismo, según sensor de Chamber
		pltfRefMinReachable: {
			get() {
				return Math.ceil(this.chamberTemp - this.pltfRefDelta);   // <-- CAMBIADO: Math.ceil en vez de Math.round(...*10)/10
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

		

	},
	methods: {
		bioElegirTab(i) { // domotek: cambiar de posición sin cerrar la pantalla
			if (i === 4) {
				if (!this.camaClick || this.ClickToolAnterior !== 4) { this.camaClick = true; this.ChangeCama(4); }
				this.toolClick = true;
				return;
			}
			if (this.camaClick || this.ClickToolAnterior !== i) { this.camaClick = false; this.ChangeTool(i); }
			this.toolClick = true;
		},
		bioIconoTool(r) { // domotek: icono para cada opción del árbol de tools
			if (r.titulo === this.$t('domotek.toolNames.BACK')) { return 'mdi-arrow-left'; }
			if (r.titulo === this.$t('domotek.toolNames.CHANGE')) { return 'mdi-swap-horizontal'; }
			const k = (r.idHijo || r.idPadre || '').toUpperCase();
			if (k.startsWith('EMPTY') || r.idTool === 0) { return 'mdi-close-circle-outline'; }
			if (k.startsWith('SYR-HEAT')) { return 'mdi-thermometer'; }
			if (k.startsWith('SYR-ES')) { return 'mdi-flash-outline'; }
			if (k.startsWith('COAX')) { return 'mdi-circle-double'; }
			if (k.startsWith('SYR')) { return 'mdi-needle'; }
			if (k.startsWith('FIL')) { return 'mdi-printer-3d-nozzle-outline'; }
			if (k.startsWith('UPE')) { return 'mdi-cube-outline'; }
			if (k.startsWith('UV')) { return 'mdi-white-balance-sunny'; }
			if (k.startsWith('AUTOCAL') || r.idTool === 15) { return 'mdi-axis-arrow'; }
			return 'mdi-tools';
		},
		bioTecla(n) { // domotek: teclado sin campo de texto
			if (this.bioModoHum) { this.clickHumedad(n); return; }
			if (this.cadenaNum === '0') { this.cadenaNum = ''; }
			if (this.cadenaNum.length >= 3) { return; }
			this.cadenaNum = `${this.cadenaNum}${n}`;
		},
		bioFijar(v) {
			if (this.bioModoHum) { this.humedad = String(v); } else { this.cadenaNum = String(v); }
		},
		bioTemp(h) { // domotek
			if (!h || h.current === undefined || h.current <= -273) { return '--'; }
			return h.current.toFixed(1);
		},
		bioEstado(h) { // domotek: off / active / standby / fault
			return (h && h.state) ? h.state : 'off';
		},
		bioClickTemp(t) { // domotek: misma lógica que las tarjetas antiguas
			if (t.tipo == 9) { this.screenMix(t.i); }
			else if (t.editable) { this.keyboardScreen(t.i); }
			else { this.nothing(t.i); }
		},
		...mapActions('machine', ['sendCode']),
		closeDialog(){
			this.DialogCalibration = false;
			this.marcadorMix = false;
			this.marcador = false;
			this.cadenaNum = "0";
		},
		  
		StartSaveSettings(){
			//this.dialogCL_SAV = true;
			//console.info(`Grabamos config CL`);
			//this.nombreMacro = 'Please, confirm settings';
			//this.codigo = '';
			//this.codigo += 'M28 "/sys/declare_variablesCL.g"' + '\n';
			//this.codigo += "global variablesCL = 1" + '\n';
			//this.codigo += "global enableCL = "+ this.$store.state.machine.model.global.enableCL + '\n';
			
			//this.codigo += 'M29' + '\n';
		},
		
		async showToolOffsets(toolNumber) {
			try {
				const response = await this.sendCode({ code: `G10 P${toolNumber}` });

				// Mapeo de etiquetas y ejes
				const toolAxisMap = {
				0: { label2: 'Y1: ', label3: 'Z1: ', secondAxisKey: 'Y', zOrAKey: 'Z' },
				1: { label2: 'Y2: ', label3: 'Z1: ', secondAxisKey: 'U', zOrAKey: 'Z' },
				2: { label2: 'Y3: ', label3: 'Z2: ', secondAxisKey: 'V', zOrAKey: 'A' },
				3: { label2: 'Y4: ', label3: 'Z2: ', secondAxisKey: 'W', zOrAKey: 'A' }
				};

				const axisConfig = toolAxisMap[toolNumber];

				const x = response.match(/X(-?\d+\.\d+)/)?.[1];
				const secondAxis = response.match(new RegExp(`${axisConfig.secondAxisKey}(-?\\d+\\.\\d+)`))?.[1];
				const zOrA = response.match(new RegExp(`${axisConfig.zOrAKey}(-?\\d+\\.\\d+)`))?.[1];

				const displayText =
				`X: ${x ?? 'N/A'}\n` +
				`${axisConfig.label2} ${secondAxis ?? 'N/A'}\n` +
				`${axisConfig.label3} ${zOrA ?? 'N/A'}`;

				// ✅ Usar directamente T0CAL, T1CAL, etc.
				const calibrado = this[`T${toolNumber}CAL`];

				this.offsetTitulo = calibrado
				? this.$t('panel.tools.toolCalibrado')
				: this.$t('panel.tools.toolNoCalibrado');

				this.offsetTexto = displayText;
			} catch (err) {
				this.offsetTitulo = '❌ Error al obtener offsets';
				this.offsetTexto = '';
			}

			this.dialogOffsetsVisible = true;
		},
		
		async showPlatformOffsets() {
			try {
				const response = await this.sendCode({ code: 'M208' });

				// Extrae los límites para Z y A
				const zMatch = response.match(/Z(-?\d+\.?\d*):(-?\d+\.?\d*)/);
				const aMatch = response.match(/A(-?\d+\.?\d*):(-?\d+\.?\d*)/);

				const zMin = zMatch ? zMatch[1] : 'N/A';
				const zMax = zMatch ? zMatch[2] : 'N/A';
				const aMin = aMatch ? aMatch[1] : 'N/A';
				const aMax = aMatch ? aMatch[2] : 'N/A';

				// const displayText =
				// `Puente izquierdo (Z):\nMínimo: ${zMin}\nMáximo: ${zMax}\n\n` +
				// `Puente derecho (A):\nMínimo: ${aMin}\nMáximo: ${aMax}`;
				const displayText = this.$t('panel.tools.platformOffsetsText', {
					zMin,
					zMax,
					aMin,
					aMax,
					});

				this.offsetTitulo = this.$t('panel.tools.platformOffsets'); // o un texto como "Offsets de la plataforma"
				this.offsetTexto = displayText;
			} catch (err) {
				this.offsetTitulo = '❌ Error al obtener offsets de la plataforma';
				this.offsetTexto = '';
			}

			this.dialogOffsetsVisible = true;
		},

		
		NombreTool(numeroTool){
			if(numeroTool === 0) {
				try {
						return this.$store.state.machine.model.global.T0Name; 
					} catch (error) {
						console.log(`error T0Name`);
						return "";
					}
			}
			if(numeroTool === 1) {
				try {
						return this.$store.state.machine.model.global.T1Name; 
					} catch (error) {
						console.log(`error T1Name`);
						return "";
					}
			}
			if(numeroTool === 2) {
				try {
						return this.$store.state.machine.model.global.T2Name; 
					} catch (error) {
						console.log(`error T2Name`);
						return "";
					}
			}
			if(numeroTool === 3) {
				try {
						return this.$store.state.machine.model.global.T3Name; 
					} catch (error) {
						console.log(`error T3Name`);
						return "";
					}
			}
			
			
		}, 
		ChangeTool(numero){
			this.filterBy =[""];
			console.log("ChangeTool");
			console.log(this.filterBy);
			this.numTool=numero;
			if (numero == this.ClickToolAnterior) {
				this.toolClick = !this.toolClick;
			}else{
				this.toolClick = true;
			}
			this.ClickToolAnterior = numero;
			switch (numero) {
				case 0:
					//this.numSelected = this.tool0;
					//this.ToolSelect(this.nameTools[0].name);
					this.ToolSelect(this.NombreTool(0));
					
					break;
				case 1:
					//this.numSelected = this.tool1;
					//this.ToolSelect(this.nameTools[1].name);
					this.ToolSelect(this.NombreTool(1));
					break;
				case 2:
					//this.numSelected = this.tool2;
					//this.ToolSelect(this.nameTools[2].name);
					this.ToolSelect(this.NombreTool(2));
					break;
				case 3:
					//this.numSelected = this.tool3;
					//this.ToolSelect(this.nameTools[3].name);
					this.ToolSelect(this.NombreTool(3));
					break;
				case 4:
					this.CamaSelected(this.nameCama.analog[0].name)
					break;
				default:
					break;
			}
		},
		ChangeCama(numero){
			
			if (numero == this.ClickToolAnterior) {
				this.toolClick = !this.toolClick;
				}else{
					
					this.toolClick = true;
					
			}
			this.ClickToolAnterior = numero;

			switch (numero) {
				case 4:
					this.CamaSelected(this.nameCama.analog[0].name)
					break;
				default:
					break;
			}
		},
		ToolSelect(toolS){
			//console.log(toolS);
			//console.log("ToolSelect");
			//console.log(toolS);	
			//console.log(this.filterBy);	
			switch (toolS) {
					//Empty
				case "Empty":
					this.numSelected = 0;
					break;
					//Jeringa
				case "SYR":
					this.numSelected = 1;
					this.numSelected = 0;
					this.filterBy =["SYR 10ML"];
					break;
					//Jeringa calor
				case "SYR-HEAT":
					this.numSelected = 2;
					this.numSelected = 0;
					this.filterBy =["SYR-HEAT 10ML"];
					break;
					//Electrospining
				case "SYR-ES":
					this.numSelected = 3;
					this.numSelected = 0;
					this.filterBy =["SYR-ES 10ML"];
					break;
				
					//solenoide - Electro Magnetic Droplet
				case "SYR-EMD":
					this.numSelected = 11;
					this.numSelected = 0;
					this.filterBy =["SYR-EMD"];
					break;
					//Filamento
				case "FIL":
					this.numSelected = 4;
					this.numSelected = 0;
					this.filterBy =["FIL"];
					break;
					//Filamento
				case "FIL-HT":
					this.numSelected = 5;
					this.numSelected = 0;
					this.filterBy =["FIL-HT"];
					break;
					//UPE
				case "UPE":
					this.numSelected = 6;
					this.numSelected = 0;
					this.filterBy =["UPE"];
					break;
				case "UPE-ADV":
					this.numSelected = 10;
					this.numSelected = 0;
					this.filterBy =["UPE-ADV"];
					break;	
				case "UV-365":
					this.numSelected = 7;
					this.numSelected = 0;
					this.filterBy =["UV-365"];
					break;
				case "UV-405":
					this.numSelected = 8;
					this.numSelected = 0;
					this.filterBy =["UV-405"];
					break;
					//BL_touch
				case "COAX":
					this.numSelected = 9;
					this.numSelected = 0;
					this.filterBy =["COAX"];
					break;
					//BL_touch	
				case "AUTO-CAL":
					this.numSelected = 15;
					this.numSelected = 1;
					this.filterBy =["AUTOCAL"];
					break;
				default:
					this.filterBy =[""];
					break;
			}
			//console.log("ToolSelect");
			//console.log(this.filterBy);	
			//this.codigo = "Su resolución es de: " + screen.availWidth + "x" + screen.availHeight;
		},
		CamaSelected(camaS){
			switch (camaS) {
				case "PLTF-HP":
					this.numSelected = 0;
					break;
				case "PLTF-REF":
					this.numSelected = 1;
					break;
				
				default:
					break;
			}
			//this.codigo = "Su resolución es de: " + screen.availWidth + "x" + screen.availHeight;
		},
		ChangeSelected(numero){
			this.dialog = true;
			this.codigo = "";
			this.numCodigo=numero;
			switch (numero) {
				case 0:
					this.codigo += '"/tools/T'+ this.numTool +'/00_Empty.g"';
					break;
				case 1:
					this.codigo += '"/tools/T'+ this.numTool +'/01_Syringe_Extruder.g"';
					break;
				case 2:
					this.codigo += '"/tools/T'+ this.numTool +'/02_Heated_Syringe_Extruder.g"';
					break;
				case 3:
					this.codigo += '"/tools/T'+ this.numTool +'/03_Sol_Electrospinning_Extruder.g"';
					break;
				case 4:
					this.codigo += '"/tools/T'+ this.numTool +'/04_Filament_Extruder.g"';
					break;
				case 5:
					this.codigo += '"/tools/T'+ this.numTool +'/05_High_Temperature_Filament_Extruder.g"';
					break;
				case 6:
					this.codigo += '"/tools/T'+ this.numTool +'/06_Pellet_Extruder.g"';
					break;
				case 7:
					this.codigo += '"/tools/T'+ this.numTool +'/07_UV_365.g"';
					break;
				case 8:
					this.codigo += '"/tools/T'+ this.numTool +'/08_UV_405.g"';
					break;
				case 9:
					this.codigo += '"/tools/T'+ this.numTool +'/09_Coaxial.g"';
					break;	
				case 10:
					this.codigo += '"/tools/T'+ this.numTool +'/10_UPE_ADV.g"';
					break;	
				case 11:
					this.codigo += '"/tools/T'+ this.numTool +'/11_Electro_Magnetic_Droplet.g"';
					break;	
				case 15:
					this.codigo += '"/tools/T'+ this.numTool +'/15_Automatic_Calibration_Module.g"';
					break;
				default:
					this.filterBy.length[1];
					console.log("ChangeSelected");
					console.log(this.filterBy);
					break;

			}
		},

		replaceFilter: function(string) {
			var vNuevo="";
			if (string.indexOf(' ') > 1) {
				vNuevo+="<span>"+string.substring(0,string.indexOf(' '))+"</span>";
				vNuevo+="<br />"
				vNuevo+="<span>"+string.substring(string.indexOf(' ')+1)+"</span>";
			}
			else {
				vNuevo+="<span>"+string+"</span>";
			}	
			return vNuevo;
		},
		ChangeSelectedFam( numero , hijo){
			//console.log("ChangeSelectedFam");
			
			if (numero == -1) {
				this.sHijo="";
				this.sHijo=hijo;
				this.filterBy=[this.sHijo];
			}
			else
			{
				this.ChangeSelected(numero);
			}
			
		},

		ChangeBed(numero){
			this.dialogBed = true;
			this.numCodigo=numero;
			switch (numero) {
				case 0:
					this.codigo='"/tools/Bed/Caliente.g"';
					break;
				case 1:
					this.codigo='"/tools/Bed/Frio.g"';
					this.setPltfRefPower(); 
					break;
				case 2:
					this.codigo='"/tools/Bed/MEW.g"';
					break;	
				case 3:
					this.codigo='"/tools/Bed/DRUM.g"';
					break;		
				default:
					break;
			}
		},
		cambiarRuta(ruta){
			this.$router.push(ruta)
		},
		ToolsEncender(){

		},
		AceptaTool(pnumero,pnumcodigo){
			if (pnumcodigo == 9) {
				if (!this.allAxesHomed) {
					const msg = this.$t('domotek.varios.axesNotHomed');
					const title = this.$t('domotek.varios.axesNotHomedTitle');
					this.sendCode({ code: `M291 P"${msg}" R"${title}" S1` });
					return;
				}
				this.sendCode({ code: `M98 P"/tools/T${pnumero}/09_Coaxial.g"`, log: true });
				return;
			}
			/* console.info(`Aceptamos el Tool`);
			*/
			switch (pnumero) {
				case 0:
					this.sendCode({code: `set global.T0 = ${pnumcodigo}`, log: true});
					this.sendCode({code: `set global.SecuenciaT0 = ${this.codigo}`, log: true});
					// console.info(`------> Tool 0:`);
					break;
				case 1:
					this.sendCode({code: `set global.T1 = ${pnumcodigo}`, log: true});
					this.sendCode({code: `set global.SecuenciaT1 = ${this.codigo}`, log: true});
					// console.info(`------> Tool 1:`);
					break;
				case 2:
					this.sendCode({code: `set global.T2 = ${pnumcodigo}`, log: true});
					this.sendCode({code: `set global.SecuenciaT2 = ${this.codigo}`, log: true});
					// console.info(`------> Tool 2:`);
					break;
				case 3:
					this.sendCode({code: `set global.T3 = ${pnumcodigo}`, log: true});
					this.sendCode({code: `set global.SecuenciaT3 = ${this.codigo}`, log: true});
					// console.info(`------> Tool 3:`);
					break;
				case 4:
					// console.info(`------> Bed:`);
					this.sendCode({code: `set global.Bed = ${pnumcodigo}`, log: true});
					this.sendCode({code: `set global.SecuenciaBed = ${this.codigo}`, log: true});
					break;
				
			}
			/* console.info(`Aceptamos el Tool`);
			console.info(`-> Tool`+pnumero);
			console.info(`-> Tool`+pnumcodigo);
			console.info(`-> codigo:`+this.codigo); */
			

			this.secuencia = '';
			this.secuencia += 'M28 "/sys/selectedTools.g"' + '\n';
			this.secuencia += "; Configured tool "+ '\n';
			this.secuencia += "set global.Bed = "
			if(pnumero==4){
				this.secuencia += pnumcodigo + '\n';	
			}
			else{
				this.secuencia +=  this.Bed + '\n';	
			}
			this.secuencia += "set global.SecuenciaBed = "
			if(pnumero==4){
				this.secuencia += this.codigo + '\n';	
			}
			else{
				this.secuencia +=  '"' + this.SecuenciaBed + '"' +'\n';	
			}
			//tool 0
			this.secuencia += "set global.T0  = "
			if(pnumero==0){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 11){
					this.secuencia += "0" + '\n';	
				}
				else{
					this.secuencia += pnumcodigo + '\n';	
				}
			}
			else{
				this.secuencia +=  this.T0 + '\n';	
			}
			this.secuencia += "set global.SecuenciaT0  = "
			if(pnumero==0){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 11){
					this.secuencia += '"/tools/T'+ pnumero +'/00_Empty.g"'+ '\n';	
				}
				else{
					this.secuencia += this.codigo + '\n';	
				}
			}
			else{
				this.secuencia +=  '"' +this.SecuenciaT0 + '"' + '\n';	
			}
			//tool 1
			this.secuencia += "set global.T1  = "
			if(pnumero==1){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 11){
					this.secuencia += "0" + '\n';	
				}
				else{
					this.secuencia += pnumcodigo + '\n';	
				}
			}
			else{
				this.secuencia +=  this.$store.state.machine.model.global.T1 + '\n';	
			}
			this.secuencia += "set global.SecuenciaT1  = "
			if(pnumero==1){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 11){
					this.secuencia += '"/tools/T'+ pnumero +'/00_Empty.g"'+ '\n';	
				}
				else{
					this.secuencia += this.codigo + '\n';	
				}
			}
			else{
				this.secuencia +=  '"' +this.SecuenciaT1 + '"' + '\n';	
			}
			//tool 2
			this.secuencia += "set global.T2  = "
			if(pnumero==2){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 11){
					this.secuencia += "0" + '\n';	
				}
				else{
					this.secuencia += pnumcodigo + '\n';	
				}
			}
			else{
				this.secuencia +=  this.T2 + '\n';	
			}
			this.secuencia += "set global.SecuenciaT2  = "
			if(pnumero==2){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 11){
					this.secuencia += '"/tools/T'+ pnumero +'/00_Empty.g"'+ '\n';	
				}
				else{
					this.secuencia += this.codigo + '\n';	
				}
			}
			else{
				this.secuencia +=  '"' +this.SecuenciaT2 + '"' + '\n';	
			}
			//tool 3
			this.secuencia += "set global.T3  = "
			if(pnumero==3){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 6 && pnumcodigo != 11){
					this.secuencia += "0" + '\n';	
				}
				else{
					this.secuencia += pnumcodigo + '\n';	
				}
			}
			else{
				this.secuencia +=  this.T3 + '\n';	
			}
			this.secuencia += "set global.SecuenciaT3  = "
			if(pnumero==3){
				if (pnumcodigo != 15 && pnumcodigo != 3 && pnumcodigo != 7 && pnumcodigo != 8 && pnumcodigo != 6 && pnumcodigo != 11){
					this.secuencia += '"/tools/T'+ pnumero +'/00_Empty.g"'+ '\n';	
				}
				else{
					this.secuencia += this.codigo + '\n';	
				}
			}
			else{
				this.secuencia +=  '"' +this.SecuenciaT3 + '"' + '\n';	
			}
			this.secuencia += 'M29' + '\n';
			console.log(`-> Secuencia: ${this.secuencia}`);
			console.log(`-> Codigo: ${this.codigo}`);
			this.sendCode({ code: `${this.secuencia}`, log: false });
			this.sendCode({ code: `M98 P${this.codigo}`, log: true });
		},
		change(){
			this.cambiarMenu;
		},
		// Funcion para obtener el valor mas alto de la temperatura permitida
		getMaxValue() {
			return this.heaterTools[this.toolClickTemperature === 4 ? 0 : this.toolClickTemperature === 20 ? 20 : this.toolClickTemperature + 1].max - 10;
		},
		getMinValue() {
			if (this.toolClickTemperature == 4 && this.nameCama.analog[0].name == "PLTF-REF") {
				return this.pltfRefMinOverride !== null ? this.pltfRefMinOverride : (this.heaterTools[0].min + 278.1);
			}
			const toolName = this.NombreTool(this.toolClickTemperature);
			if (toolName === 'FIL' || toolName === 'UPE' || toolName === 'FIL-HT') {
				return 60;
			}
			return this.tempAmbiente;
		},

		clickNums(num) {
			const inputField = this.$refs.cadenaNumInput.$el.querySelector('input');

			// Detectar si es un dispositivo táctil
			const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

			// Determinar posición del cursor
			let cursorPosition = isTouch ? this.cadenaNum.length : inputField.selectionStart;

			if (this.cadenaNum === "0") {
				this.cadenaNum = "";
				cursorPosition = 0; // reset si estaba solo un cero
			}

			const beforeCursor = this.cadenaNum.slice(0, cursorPosition);
			const afterCursor = this.cadenaNum.slice(cursorPosition);

			// Insertar el número
			this.cadenaNum = `${beforeCursor}${num}${afterCursor}`;

			// Ajustar el cursor
			this.$nextTick(() => {
				const newPos = cursorPosition + 1;
				inputField.setSelectionRange(newPos, newPos);
				inputField.focus(); // Asegura que el cursor se vea en touch
			});
		},
		
		//Funcion para borrar con el boton de la pantalla
		deleteNums() {
			this.cadenaNum = this.cadenaNum.substring(0, this.cadenaNum.length - 1); // Elimina el último carácter
			if (this.cadenaNum.length === 0) {
				this.cadenaNum = "0"; // Si está vacío, reinicia a "0"
			}
		},
		// Función para borrar el carácter a la izquierda del cursor (con Backspace)
		deletePrevChar(event) {
			const cursorPos = event.target.selectionStart;
			//const inputField = event.target;

			if (cursorPos > 0) {
				this.cadenaNum = this.cadenaNum.substring(0, cursorPos - 1) + this.cadenaNum.substring(cursorPos);

				if (this.cadenaNum.length === 0) {
				this.cadenaNum = "0";
				}

				// Ajusta la posición del cursor
				//this.$nextTick(() => {
				//	inputField.setSelectionRange(cursorPos -1 , cursorPos - 1);
				//});
				
			}
		},
		   
		//Funcion para eliminar el siguiente caracter (pulsacion tecla SUPR)
		
		deleteNextChar(event) {
			const cursorPos = event.target.selectionStart;
			const inputField = event.target;

			if (cursorPos < this.cadenaNum.length) {
				// Elimina el carácter después del cursor
				this.cadenaNum = this.cadenaNum.substring(0, cursorPos) + this.cadenaNum.substring(cursorPos + 1);

				// Si la cadena queda vacía, establece "0"
				if (this.cadenaNum.length === 0) {
				this.cadenaNum = "0";
				}

				// Ajusta la posición del cursor
				this.$nextTick(() => {
				inputField.setSelectionRange(cursorPos, cursorPos);
				});
			}
		},
		handleOffButton() {
			const tool = this.toolClickTemperature;

			if (tool === 4) {
				this.sendCode({ code: `M140 S0 R0` });
				setTimeout(() => {
					this.sendCode({ code: `M140 S-273.15` });
				}, 100);

			} else if (tool === 20) {
				this.sendCode({ code: `M141 S0 R0` });
				setTimeout(() => {
					this.sendCode({ code: `M141 S-273.15` });
					this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/off.g"` });
				}, 100);

			} else {
				this.sendCode({ code: `G10 P${tool} S0 R0` });
				setTimeout(() => {
					this.sendCode({ code: `M568 P${tool} A0` });
				}, 100);
			}

			const index = tool === 4 ? 0 : tool === 20 ? 20 : tool + 1;

			// Actualización local en Vue para que la interfaz cambie al instante
			if (this.heaterTools[index]) {
				this.$set(this.heaterTools, index, {
					...this.heaterTools[index],
					active: 0,
					standby: 0,
					state: 'off'
				});
			}

			if (this.chamberTimeout) {
				clearTimeout(this.chamberTimeout);
				this.chamberTimeout = null;
			}

			this.marcador = false;
			this.marcadorDrum = false;
			this.marcadorMix = false;
			this.cadenaNum = "0";
		},
		handleFixButton() {
			const tool = this.toolClickTemperature;
			const heaterIndex = tool === 4 ? 0 : tool === 20 ? 20 : tool + 1;

			this.sendCode({ code: `M562 P${heaterIndex}` });

			// Actualización local en Vue para que la interfaz cambie al instante
			if (this.heaterTools[heaterIndex]) {
				this.$set(this.heaterTools, heaterIndex, {
					...this.heaterTools[heaterIndex],
					active: 0,
					standby: 0,
					state: 'off'
				});
			}

			this.marcador = false;
			this.marcadorDrum = false;
			this.marcadorMix = false;
			this.cadenaNum = "0";
		},
		

		okNums() {
			const value = parseInt(this.cadenaNum, 10); // Convierte la cadena a número

			// Verifica si el valor es un número válido
			if (isNaN(value)) {
				this.sendCode({ code: `M118 P0 S"Valor no válido"` });
				return;
			}

			// Verifica si el valor está dentro del rango
			if (value < this.getMinValue() || value > this.getMaxValue()) {
				this.showTemperatureOutOfRangeDialog = true;
				const msg = this.$t('domotek.varios.temp_out');
				this.sendCode({ code: `M118 P0 S"${msg}" L1` });
				return;
			}

			// --- AÑADIDO: comprobación de alcanzabilidad real para PLTF-REF ---
			if (this.toolClickTemperature === 4 && this.nameCama.analog[0].name === "PLTF-REF") {
				if (value < this.pltfRefMinReachable) {
					this.pltfRefUnreachableMsg = this.$t('domotek.varios.pltfref_unreachable', {
						value: value,
						ambient: this.chamberTemp.toFixed(1),
						min: this.pltfRefMinReachable
					});
					this.showPltfRefUnreachableDialog = true;
					this.sendCode({ code: `M118 P0 S"${this.pltfRefUnreachableMsg}" L1` });
					return; // no se envía el comando, igual que en el aviso de rango
				}
			}
			// --- FIN AÑADIDO ---

			// Si es la chamber (tool 20), prepara timeout cancelable
			if (this.toolClickTemperature === 20) {
				const startTemp = this.heaterTools[20].current;

				// Cancela timeout previo si existía
				if (this.chamberTimeout) {
				clearTimeout(this.chamberTimeout);
				this.chamberTimeout = null;
				}

				// Crea un nuevo timeout
				this.chamberTimeout = setTimeout(() => {
				const currentTemp = this.heaterTools[20].current;

				if (currentTemp < startTemp + 1) {
					const msg = this.$t('panel.tools.chamberNotHeating');
					this.sendCode({ code: `M291 P"${msg}" R"Chamber" S2` });
					this.sendCode({ code: `M118 P0 S"${msg}"` });
				}

				this.chamberTimeout = null; // limpia referencia
				}, 60000); // 1 minuto
			}

			// Continuar con flujo normal
			this.sendTempKeyboard();
			this.marcador = false;
			this.marcadorDrum = false;
			this.marcadorMix = false;
			this.cadenaNum = "0";
		},

		sendTempKeyboard() {
			const num = parseInt(this.cadenaNum);
			
			if (this.toolClickTemperature === 4) {
				this.sendCode({code: `M140 S${num} R${num}`});
			} else if (this.toolClickTemperature === 20) {
				this.sendCode({code:`M141 S${num} R${num}`});
				this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/on.g"` });
			} else {
				this.sendCode({code:`M104 S${num} T${this.toolClickTemperature}`});
			}	
		},

		handleKeyPress(event) {
			const key = event.key;
			if (this.temaBio) { // domotek: teclado físico con el tema oscuro (no hay campo de texto)
				if (!this.marcador) { return; }
				if (!isNaN(key) && key !== ' ' && key >= 0 && key <= 9) { this.bioTecla(parseInt(key, 10)); }
				else if (key === 'Backspace') { if (this.bioModoHum) { this.deleteHumedad(); } else { this.deleteNums(); } }
				else if (key === 'Enter') { if (this.bioModoHum) { this.okHumedad(); } else if (!this.bioFueraRango) { this.okNums(); } }
				return;
			}
			if (this.marcador && this.modoInput === 'HUM') {
				const key = event.key;
				if (!isNaN(key) && key >= 0 && key <= 9) {
					this.clickHumedad(parseInt(key));
				} else if (key === "Backspace") {
					this.deleteHumedad();
				} else if (key === "Enter") {
					this.okHumedad();
				}
				return;
			}
			const inputField = this.$refs.cadenaNumInput.$el.querySelector('input'); // Referencia al campo de texto
			const cursorPosition = inputField.selectionStart; // Obtener la posición del cursor

			if (key === "ArrowLeft" || key === "ArrowRight") {
				return; 
			}
			// Solo permitir entrada de dígitos
			if (!isNaN(key) && key >= 0 && key <= 9) {
				//event.preventDefault(); 

				if (this.cadenaNum === "0") {
				this.cadenaNum = ""; // Elimina el cero inicial
				}

				const beforeCursor = this.cadenaNum.slice(0, cursorPosition);
				const afterCursor = this.cadenaNum.slice(cursorPosition);

				// Inserta el número en la posición del cursor
				this.cadenaNum = `${beforeCursor}${key}${afterCursor}`;

				// Ajusta el cursor después de la inserción
				this.$nextTick(() => {
				inputField.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
				});
			} else if (key === "Backspace") {
				///event.preventDefault();
				this.deletePrevChar(event);
				return;
			} else if (key === "Delete") {
				//event.preventDefault();
				this.deleteNextChar(event);
				return;
			} else if (key === "Enter") {
				const value = parseInt(this.cadenaNum, 10);

				// Verifica si el valor está dentro del rango permitido
				if (value >= this.getMinValue() && value <= this.getMaxValue()) {
				this.sendTempKeyboard();
				}
			}
			//event.preventDefault();
		},


		keyboardScreen(toolTemperature){
			if (toolTemperature === 20 && this.miniclima_capable) {
				this.modoDialog = 'HUM';
			} else {
				this.modoDialog = 'HEAT';
			}
			this.cadenaNum = "0";
			this.sendCode({code: `set global.TSeleccionado = ${toolTemperature}`, log: false});
			this.toolClickTemperature = toolTemperature;
			this.marcador = true;
		},
		nothing(toolTemperature){
			this.sendCode({code: `set global.TSeleccionado = ${toolTemperature}`, log: false});			
			this.toolClickTemperature = toolTemperature;
		},

		screenMix(toolTemperature){
			this.sendCode({code: `set global.TSeleccionado = ${toolTemperature}`, log: false});			
			this.toolClickTemperature = toolTemperature;
			this.marcadorMix = true;
		},
		keyboardScreenDrum(){  //toolTemperature
			//this.toolClickTemperature = toolTemperature;
			this.marcadorDrum = true;
		},
		async linkStart() {
			
		},	



		toolHeaterClick(toolP, heaterP) {
			//console.log(`toolHeaterClick-> toolP.name: ${toolP.name}`); 
			//console.log(`toolHeaterClick-> heaterP.state: ${heaterP.state}`); 
			//console.log(`toolHeaterClick-> HeaterState.off: ${HeaterState.off}`); 
			//console.log(`toolHeaterClick-> this.isConnected: ${this.isConnected}`); 
			
			
			/* if (!this.isConnected) {
				console.log(`toolHeaterClick-> if !this.isConnected: ${this.isConnected}`); 
				return;
			}
			else {
				console.log(`toolHeaterClick-> else !this.isConnected: ${this.isConnected}`); 
			} */
			
			
			let offTemps;
			switch (heaterP.state) {
				case HeaterState.off:		// Off -> Active
					console.log(`toolHeaterClick-> Off -> Active`); 
					this.sendCode(`T${toolP.number}`);
					break;

				case HeaterState.standby:	// Standby -> Off
					console.log(`toolHeaterClick-> Standby -> Off`); 
					offTemps = toolP.active.map(() => '-273.15').join(':');
					this.sendCode(`G10 P${toolP.number} S${offTemps} R${offTemps}`);
					//this.sendCode(`echo ${toolP.number}`);
					break;

				case HeaterState.active:	// Active -> Standby
					console.log(`toolHeaterClick-> Active -> Standby`); 
					this.sendCode('T-1');
					break;

				case HeaterState.fault:		// Fault -> Ask for reset
					console.log(`toolHeaterClick-> Fault -> Ask for reset`); 
					this.faultyHeater = this.heat.heaters.indexOf(heaterP);
					this.resetHeaterFault = true;
					break;
			}
		},
		getDrumSpeed() {
			return this.$store.state.machine.model.global.rpmRodillo ;
		},
		getDrumSpeedSet() {
			return this.$store.state.machine.model.global.rpmRodilloSet ;
		},
		
		validateKeydown(event) {
			const keyCode = event.keyCode;
			// Permitir: backspace, delete, tab, enter y flechas
			if (
				keyCode === 8 || // backspace
				keyCode === 46 || // delete
				keyCode === 9 || // tab
				keyCode === 13 || // enter
				(keyCode >= 37 && keyCode <= 40) // flechas
			) {
				return;
			}
			// Permitir solo números
			if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
				event.preventDefault();
			}
		},// Bloquear teclas no numéricas
	  
		onChangeRPM(entry) {
			// Verifica que el valor sea una cadena válida y que no esté vacío
			if (typeof entry === 'string' && entry.trim()) {
				let rpmValue = parseInt(entry);
				if (rpmValue < this.RPM_min || rpmValue > this.RPM_max) {
				this.showRPMOutOfRangeDialog = true;
				this.sendCode({ code: `M118 P0 S"RPM out of range" L1` });
				} else {
				this.sendCode(`set global.rpmRodillo = 0`);
				this.sendCode(`set global.rpmRodilloSet = ${rpmValue}`);
				this.sendCode(`M118 P2 L1 S"##R#${rpmValue}##"`);
				}
			}
		},		
		onPlayRPM() {
			const input = this.cadenaNum?.toString().trim();
			const rpmValue = parseInt(input);

			if (!input || isNaN(rpmValue)) {
				this.sendCode({ code: `M118 P0 S"RPM inválido o vacío" L1` });
				return;
			}

			if (rpmValue < this.RPM_min || rpmValue > this.RPM_max) {
				this.sendCode({ code: `M118 P0 S"RPM fuera de rango" L1` });
				this.showRPMOutOfRangeDialog = true;
				return;
			}

			this.sendCode(`set global.rpmRodillo = ${rpmValue}`);
			this.sendCode(`set global.rpmRodilloSet = ${rpmValue}`);
			this.sendCode(`M118 P2 L1 S"##R#${rpmValue}##"`);
		},

		stopDrum() {
			this.sendCode(`set global.rpmRodillo = 0`);
			this.sendCode(`set global.rpmRodilloSet = 0`);
			this.sendCode(`M118 P2 L1 S"##S#500##"`);
			//this.$refs.RPMS.reset()
		},
		clickHumedad(num) {
			if (this.humedad === "0") this.humedad = "";
			this.humedad = `${this.humedad}${num}`;
		},

		deleteHumedad() {
			this.humedad = this.humedad.substring(0, this.humedad.length - 1);
			if (this.humedad.length === 0) this.humedad = "0";
		},
		startHumedad() {
			this.okHumedad();
		},

		okHumedad() {
			const value = parseInt(this.humedad, 10);
			if (isNaN(value) || value < this.HUMIDITY_min || value > this.HUMIDITY_max) {
				this.showHumidityOutOfRangeDialog = true;
				return;
			}

			this.sendCode({ code: `set global.miniclima_setPoint = ${value}` });

			if (!this.miniclima_on) {
				this.sendCode({ code: `set global.miniclima_on = true` });
				this.sendCode({ code: `M118 S"HUM:start"` });
			}
			this.sendCode({ code: `M118 S"HUM:#setPoint00${value}"` });

			this.controlHumedadActivo = true;
			if (this.controlHumedadInterval) clearInterval(this.controlHumedadInterval);
			if (this.controlHumedadTimeout) clearTimeout(this.controlHumedadTimeout);

			this.controlHumedadTimeout = setTimeout(() => {
				if (!this.controlHumedadActivo) return;
				this.controlHumedad();
				this.controlHumedadInterval = setInterval(() => {
					if (!this.controlHumedadActivo) return;
					this.controlHumedad();
				}, 30000);
			}, 5000);

			this.marcador = false;
			this.humedad = "0";
		},

		stopHumedad() {
			// Parar timeout inicial
			if (this.controlHumedadTimeout) {
				clearTimeout(this.controlHumedadTimeout);
				this.controlHumedadTimeout = null;
			}
			// Parar intervalo
			if (this.controlHumedadInterval) {
				clearInterval(this.controlHumedadInterval);
				this.controlHumedadInterval = null;
			}
			this.controlHumedadActivo = false;

			// Apagar miniclima
			this.sendCode({ code: `M118 S"HUM:stop"` });
			//this.humedadEncendida = false;
			//this.humedadSetPoint = "--";
			this.sendCode({ code: `set global.miniclima_on = false` });
			this.sendCode({ code: `set global.miniclima_setPoint = 0` });

			// Apagar chamber
			this.sendCode({ code: `M141 S0 R0` });
			setTimeout(() => { this.sendCode({ code: `M141 S-273.15` }); }, 100);

			this.marcador = false;
			this.humedad = "0";
			
			// Restaurar ventilador a estado por defecto (encendido)
			this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/on.g"` });
		},

		calcularTempChamberParaHR(hrTarget) {
			const hrActual = parseFloat(this.miniclima_rh);
			const tActual = parseFloat(this.chamberTemp);

			console.log(`calcularTempChamberParaHR → hrActual: ${hrActual}, tActual: ${tActual}, hrTarget: ${hrTarget}`);

			if (isNaN(hrActual) || isNaN(tActual) || hrActual <= 0 || hrTarget <= 0) {
				console.log('calcularTempChamberParaHR → datos no válidos, return null');
				return null;
			}

			const psatActual = 6.1078 * Math.exp(17.27 * tActual / (tActual + 237.3));
			const pAbs = (hrActual / 100) * psatActual;
			const psatTarget = pAbs / (hrTarget / 100);
			const logVal = Math.log(psatTarget / 6.1078);
			const tNecesaria = 237.3 * logVal / (17.27 - logVal);

			console.log(`calcularTempChamberParaHR → tNecesaria: ${Math.round(tNecesaria)}°C`);

			return Math.round(tNecesaria);
		},
		controlHumedad() {
			const hrTarget = parseInt(this.miniclima_setPoint);
			const hrActual = parseFloat(this.miniclima_rh);
			if (isNaN(hrTarget) || isNaN(hrActual)) return;
			const margen = 2;

			if (hrActual > hrTarget + margen) {
				// HR demasiado alta → bajar con chamber
				const tempNecesaria = this.calcularTempChamberParaHR(hrTarget);
				if (tempNecesaria === null) return;
				if (tempNecesaria >= 20 && tempNecesaria <= 55) {
					this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/on.g"` });
					if (Math.abs(this.chamberTemp - tempNecesaria) > 2) {
						this.sendCode({ code: `M141 S${tempNecesaria} R${tempNecesaria}` });
					}
				} else if (tempNecesaria < 20) {
					this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/off.g"` });
					this.sendCode({ code: `M141 S0 R0` });
					setTimeout(() => { this.sendCode({ code: `M141 S-273.15` }); }, 100);
				} else {
					this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/on.g"` });
					this.sendCode({ code: `M141 S55 R55` });
				}

			} else if (hrActual < hrTarget - margen) {
				// HR demasiado baja → ventilador apagado, chamber apagada, dejar subir sola
				this.sendCode({ code: `M98 P"0:/macros/On-Off_CHAMBER_FAN/off.g"` });
				this.sendCode({ code: `M141 S0 R0` });
				setTimeout(() => { this.sendCode({ code: `M141 S-273.15` }); }, 100);

			}
			// Dentro del margen → no hacer nada en ningún caso
		},
		switchToTemp() {
			if (this.miniclima_on) {
				this.showMiniClimaWarning = true;
			} else {
				this.modoInput = 'TEMP';
			}
		},
		// Aplica la potencia de la PLTF-REF de forma INMEDIATA, sin espera.
		// Se usa cuando se detecta un cambio de conexión a Chamber (punto 6).
		applyPltfRefPower() {
			const s = this.chamberMode ? this.pltfRefPowerFull : this.pltfRefPowerHalf;
			this.sendCode({ code: `M307 H0 S${s}`, log: true });
		},

		// Programa el cambio de potencia CON ESPERA (pltfRefPowerDelay).
		// Se usa al configurar/seleccionar la plataforma PLTF-REF (punto 4).
		setPltfRefPower() {
			// Si ya había un cambio de potencia pendiente, lo cancelamos y reprogramamos
			if (this.pltfRefPowerTimeout) {
				clearTimeout(this.pltfRefPowerTimeout);
				this.pltfRefPowerTimeout = null;
			}

			this.pltfRefPowerTimeout = setTimeout(() => {
				this.applyPltfRefPower();
				this.pltfRefPowerTimeout = null;
			}, this.pltfRefPowerDelay);
		},
		// Aplica directamente la temperatura mínima alcanzable calculada, y cierra los diálogos
		setPltfRefToMinReachable() {
			this.cadenaNum = String(this.pltfRefMinReachable);
			this.sendTempKeyboard();
			this.showPltfRefUnreachableDialog = false;
			this.marcador = false;
			this.marcadorDrum = false;
			this.marcadorMix = false;
			this.cadenaNum = "0";
		},
		cancelarPltfRefUnreachable() {
			this.pltfRefMinOverride = this.pltfRefMinReachable; // el mínimo pasa a ser el real (delta), no el de hardware
			this.showPltfRefUnreachableDialog = false;
		},
	},
	mounted() {
		this.$vuetify.goTo(0);
		window.addEventListener("keydown", this.handleKeyPress); // Agregar listener de teclado -- 

	},
	watch: {
		marcador(val) {
			if (!val) {
				this.cadenaNum = "0";
				this.pltfRefMinOverride = null; // vuelve a 5 al cerrar
			}
		},
		chamberMode: {
			handler(newVal) {
				console.log(`ChamberMode cambió a: ${newVal}. Plataforma actual: ${this.bedSelected}`);	
				// CORRECCIÓN: Si la cama seleccionada es 'C', aplicamos el cambio de potencia
				if (this.bedSelected === 'C') {
					this.applyPltfRefPower(newVal); 
				}
			},
			deep: true
		},
	},
	beforeDestroy() {
		window.removeEventListener("keydown", this.handleKeyPress);
		if (this.controlHumedadTimeout) clearTimeout(this.controlHumedadTimeout);
		if (this.controlHumedadInterval) clearInterval(this.controlHumedadInterval);
		if (this.pltfRefPowerTimeout) clearTimeout(this.pltfRefPowerTimeout); // <-- AÑADIDO
	},
}
</script>




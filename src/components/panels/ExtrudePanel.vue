<template>
	<!-- domotek: extruir con el diseño nuevo (diálogo del panel de movimiento) -->
	<div v-if="temaBio" class="bio-ex">
		<header class="bio-teclado-cab">
			<span class="bio-teclado-icono acento"><v-icon>mdi-printer-3d-nozzle-outline</v-icon></span>
			<span class="bio-teclado-nombre">{{ $t('domotek.extrude.title') }}</span>
			<span v-if="bioTool" class="bio-ex-tool">
				<strong>{{ bioTool }}</strong>
				<span v-if="bioTemp" :class="{ frio: bioFrio }">{{ bioTemp }}</span>
			</span>
			<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.close')" @click="$emit('cerrar')"><v-icon>mdi-close</v-icon></button>
		</header>

		<div class="bio-ex-cuerpo">
			<section class="bio-ex-ajustes">
				<div v-if="currentTool && currentTool.extruders.length > 1" class="bio-ex-grupo">
					<span class="et">{{ $t('panel.extrude.mixRatio') }}</span>
					<div class="bio-ex-chips">
						<button type="button" :class="{ activo: mixValue.indexOf('mix') !== -1 }" :disabled="uiFrozen" @click="mix = ['mix']">{{ $t('panel.extrude.mix') }}</button>
						<button v-for="e in currentTool.extruders" :key="e" type="button" :class="{ activo: mixValue.indexOf(e) !== -1 }" :disabled="uiFrozen" @click="bioAlternarMezcla(e)">E{{ e }}</button>
					</div>
				</div>
				<div class="bio-ex-grupo">
					<span class="et">{{ $t('domotek.extrude.amount') }} <small>mm</small></span>
					<div class="bio-ex-chips">
						<button v-for="(v, i) in extruderAmounts" :key="'a' + i" type="button" :class="{ activo: amount === v }" :disabled="uiFrozen" @click="amount = v" @contextmenu.prevent="editAmount(i)">{{ v }}</button>
					</div>
				</div>
				<div class="bio-ex-grupo">
					<span class="et">{{ $t('domotek.extrude.speed') }} <small>mm/s</small></span>
					<div class="bio-ex-chips">
						<button v-for="(v, i) in currentFeedrates" :key="'f' + i" type="button" :class="{ activo: feedrate === v }" :disabled="uiFrozen" @click="feedrate = v" @contextmenu.prevent="editFeedrate(i)">{{ v }}</button>
					</div>
				</div>
				<p class="bio-ex-nota" :class="{ aviso: !!bioAviso }">{{ bioAviso || $t('domotek.extrude.hint') }}</p>
			</section>

			<section class="bio-ex-botones">
				<button type="button" class="bio-ex-btn" :disabled="uiFrozen || !canRetract || busy" @click="buttonClicked(false)">
					<v-icon>mdi-arrow-up-bold</v-icon>
					<strong>−{{ amount }} mm</strong>
					<span>{{ $t('panel.extrude.retract') }}</span>
				</button>
				<button type="button" class="bio-ex-btn principal" :disabled="uiFrozen || !canExtrude || busy" @click="buttonClicked(true)">
					<v-progress-circular v-if="busy" indeterminate size="28" width="3"></v-progress-circular>
					<v-icon v-else>mdi-arrow-down-bold</v-icon>
					<strong>+{{ amount }} mm</strong>
					<span>{{ $t('panel.extrude.extrude') }} · {{ feedrate }} mm/s</span>
				</button>
			</section>
		</div>

		<input-dialog :shown.sync="editAmountDialog.shown" :title="$t('dialog.editExtrusionAmount.title')" :prompt="$t('dialog.editExtrusionAmount.prompt')" :preset="editAmountDialog.preset" is-numeric-value @confirmed="setAmount"></input-dialog>
		<input-dialog :shown.sync="editFeedrateDialog.shown" :title="$t('dialog.editExtrusionFeedrate.title')" :prompt="$t('dialog.editExtrusionFeedrate.prompt')" :preset="editFeedrateDialog.preset" is-numeric-value @confirmed="setFeedrate"></input-dialog>
	</div>
	<v-card v-else class="blue lighten-4">
		<v-card-title class="pb-0">
			<v-row>
				<v-col cols="4">
					<v-icon small class="mr-1">mdi-opacity</v-icon> {{ $t('panel.extrude.caption') }}
				</v-col>
				<template>
					<v-col cols="4">
						<!-- {{nameTools[0].name}} -->
							<!-- {{nameTool.name}} -->
							{{toolsActiveName}}
					</v-col>
					<v-col cols="4" v-if="toolsActiveHeater1Index!=-1">
						{{heaterTools[toolsActiveHeater1Index].current == -273.1 || heaterTools[toolsActiveHeater1Index].current == -273.15 ? "--":heaterTools[toolsActiveHeater1Index ].current}}<strong> / {{heaterTools[toolsActiveHeater1Index ].active}}</strong>
						<!-- {{heaterTools[index + 1].current == -273.1 ? "--":heaterTools[index + 1].current}}<strong> / {{heaterTools[index + 1].active}}</strong> -->
					</v-col>
				</template>
				<!-- <template v-for="(nameTool, index) in nameTools">
					<v-col cols="4" >
						{{toolsActiveName}}
							
					</v-col>
					<v-col cols="4">
						{{heaterTools[index + 1].current == -273.1 ? "--":heaterTools[index + 1].current}}<strong> / {{heaterTools[index + 1].active}}</strong>
					</v-col>
				</template> -->
				


			</v-row>
		</v-card-title>

		<v-card-text class="pb-0">
			<v-row class="pb-1" align="center" justify="center">
				<v-col v-if="currentTool && currentTool.extruders.length > 1" cols="auto">
					<p class="mb-1">
					{{ $t('panel.extrude.mixRatio') }}
					</p>
					<v-btn-toggle v-model="mix" mandatory multiple color="green">
						<v-btn text value="mix" :disabled="uiFrozen" color="primary">
							{{ $t('panel.extrude.mix') }}
						</v-btn>
						<v-btn text v-for="extruder in currentTool.extruders" :key="extruder" :value="extruder" :disabled="uiFrozen" color="primary">
							{{ `E${extruder}` }}
						</v-btn>
					</v-btn-toggle>
				</v-col>
				<v-col>
					<p class="mb-1">
					{{ $t('panel.extrude.amount', ['mm']) }}
					</p>
					<v-btn-toggle v-model="amount" mandatory class="d-flex blue lighten-5" rounded color="teal">
						<v-btn v-for="(savedAmount, index) in extruderAmounts" :key="index" :value="savedAmount" :disabled="uiFrozen" @contextmenu.prevent="editAmount(index)" class="flex-grow-1">
							{{ savedAmount }}
						</v-btn>
					</v-btn-toggle>
				</v-col>
				<v-col>
					<p class="mb-1">
					{{ $t('panel.extrude.feedrate', ['mm/s']) }}
					</p>
					<v-btn-toggle v-model="feedrate" mandatory class="d-flex blue lighten-5" rounded color="teal">
						<v-btn v-for="(savedFeedrate, index) in currentFeedrates" :key="index" :value="savedFeedrate" :disabled="uiFrozen" @contextmenu.prevent="editFeedrate(index)" class="flex-grow-1">
							{{ savedFeedrate }}
						</v-btn>
					</v-btn-toggle>
				</v-col>
				<v-col cols="12" class="flex-shrink-1 pb-0">
					<v-btn block :disabled="uiFrozen || !canRetract" :elevation="1" :loading="busy" @click="buttonClicked(false)" rounded height="70px">
						<v-icon>mdi-arrow-up-bold</v-icon> {{ $t('panel.extrude.retract') }}
					</v-btn>
				</v-col>
				<v-col cols="12" class="flex-shrink-1">
					<v-btn block :disabled="uiFrozen || !canExtrude" :elevation="1" :loading="busy" @click="buttonClicked(true)" rounded height="70px">
						<v-icon>mdi-arrow-down-bold</v-icon> {{ $t('panel.extrude.extrude') }}
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>

		<input-dialog :shown.sync="editAmountDialog.shown" :title="$t('dialog.editExtrusionAmount.title')" :prompt="$t('dialog.editExtrusionAmount.prompt')" :preset="editAmountDialog.preset" is-numeric-value @confirmed="setAmount"></input-dialog>
		<input-dialog :shown.sync="editFeedrateDialog.shown" :title="$t('dialog.editExtrusionFeedrate.title')" :prompt="$t('dialog.editExtrusionFeedrate.prompt')" :preset="editFeedrateDialog.preset" is-numeric-value @confirmed="setFeedrate"></input-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { StatusType } from "@/store/machine/modelEnums";

export default {
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', ['heat', 'sensors', 'state']),
		...mapGetters('machine/model', ['currentTool']),
		...mapState('machine/settings', ['extruderAmounts', 'extruderFeedrates', 'syrFeedrates']),
		...mapState({
			nameCama: state => state.machine.model.sensors,
			nameTools: state => state.machine.model.tools,
			heaterTools: state => state.machine.model.heat.heaters,
		}),
		canExtrude() {
			return (this.state.status !== StatusType.off &&
					this.state.status !== StatusType.pausing &&
					this.state.status !== StatusType.processing &&
					this.state.status !== StatusType.resuming &&
					this.currentTool && this.currentTool.extruders.length > 0 &&
					!this.currentTool.heaters.some(heaterNumber => {
						if (heaterNumber >= 0 && heaterNumber < this.heat.heaters.length) {
							const heaterSensor = this.heat.heaters[heaterNumber].sensor;
							if (heaterSensor >= 0 && heaterSensor < this.sensors.analog.length) {
								const sensor = this.sensors.analog[heaterSensor];
								return !sensor || sensor.lastReading < this.heat.coldExtrudeTemperature;
							}
						}
						return true;
					}, this));
		},
		canRetract() {
			return (this.state.status !== StatusType.off &&
					this.state.status !== StatusType.pausing &&
					this.state.status !== StatusType.processing &&
					this.state.status !== StatusType.resuming &&
					this.currentTool && this.currentTool.extruders.length > 0 &&
					!this.currentTool.heaters.some(heaterNumber => {
						if (heaterNumber >= 0 && heaterNumber < this.heat.heaters.length) {
							const heaterSensor = this.heat.heaters[heaterNumber].sensor;
							if (heaterSensor >= 0 && heaterSensor < this.sensors.analog.length) {
								const sensor = this.sensors.analog[heaterSensor];
								return !sensor || sensor.lastReading < this.heat.coldRetractTemperature;
							}
						}
						return true;
					}, this));
		},
		mix: {
			get() { return this.mixValue; },
			set(value) {
				if (value.length > 1) {
					if (this.mixValue.indexOf('mix') !== value.indexOf('mix')) {
						// Mix is being toggled
						if (value.indexOf('mix') !== -1) {
							this.mixValue = ['mix'];
						} else {
							this.mixValue = value.filter(item => item !== 'mix');
						}
					} else {
						// Selecting another E drive
						this.mixValue = value.filter(item => item !== 'mix');
					}
				} else {
					// One value - OK
					this.mixValue = value;
				}
			}
		},

		toolsActiveName: {
			get() {
					try {
							if(this.$store.state.machine.model.global.T0Activo){
								return  this.$store.state.machine.model.global.T0Name;
							}
							else
							if(this.$store.state.machine.model.global.T1Activo){
								return  this.$store.state.machine.model.global.T1Name;
							}
							else
							if(this.$store.state.machine.model.global.T2Activo){
								return  this.$store.state.machine.model.global.T2Name;
							}
							if(this.$store.state.machine.model.global.T3Activo){
								return  this.$store.state.machine.model.global.T3Name;
							}
							else
							{
								return "None";
							}
					} catch (error) {
							console.log(`error toolsActive0state`);
							return "active";							
					}
			}
		}, 
		toolsActiveHeater1Index: {
			get() {
					try {
							if(this.$store.state.machine.model.global.T0Activo){
								return  this.$store.state.machine.model.global.T0NHeater1;
							}
							else
							if(this.$store.state.machine.model.global.T1Activo){
								return  this.$store.state.machine.model.global.T1NHeater1;
							}
							else
							if(this.$store.state.machine.model.global.T2Activo){
								return  this.$store.state.machine.model.global.T2NHeater1;
							}
							if(this.$store.state.machine.model.global.T3Activo){
								return  this.$store.state.machine.model.global.T3NHeater1;
							}
							else
							{
								return -1;
							}
					} catch (error) {
							console.log(`error toolsActive0state`);
							return "active";							
					}
			}
		}, 

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

/* 		toogleToolState: {
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
 */

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
							console.log(`error toolsActive3state`);
							return "active";							
					}
			}
		}, 
		temaBio() { return this.$store.state.settings.temaBio; }, // domotek
		bioTool() {
			const n = this.toolsActiveName;
			if (n && n !== 'None' && n !== 'active') { return n; }
			return this.currentTool ? (this.currentTool.name || `T${this.currentTool.number}`) : '';
		},
		bioHeater() {
			const i = this.toolsActiveHeater1Index;
			return (typeof i === 'number' && i >= 0 && this.heaterTools && this.heaterTools[i]) ? this.heaterTools[i] : null;
		},
		bioTemp() {
			const h = this.bioHeater;
			if (!h) { return ''; }
			const actual = (h.current <= -273) ? '—' : this.$display(h.current, 1);
			return `${actual} / ${this.$display(h.active || 0, 0)} °C`;
		},
		bioFrio() {
			const h = this.bioHeater;
			return !!h && h.current < (this.heat.coldExtrudeTemperature || 0);
		},
		bioAviso() { // por qué no se puede extruir
			if (!this.currentTool) { return this.$t('domotek.extrude.noTool'); }
			if (!this.currentTool.extruders.length) { return this.$t('domotek.extrude.noExtruder'); }
			if (!this.canExtrude && this.state.status === StatusType.processing) { return this.$t('domotek.extrude.printing'); }
			if (!this.canExtrude) { return this.$t('domotek.extrude.cold', [this.$display(this.heat.coldExtrudeTemperature || 0, 0)]); }
			return '';
		},
		currentFeedrates() {
			const syrTools = ["SYR-ES", "SYR", "SYR-HEAT", "COAX(P)"];
			if (syrTools.includes(this.toolsActiveName)) {
				return this.syrFeedrates; // usamos los nuevos valores
			} else {
				return this.extruderFeedrates; // valores normales
			}
		}


	},
	data() {
		return {
			busy: false,
			mixValue: ['mix'],
			amount: 10,
			feedrate: 5,
			editAmountDialog: {
				shown: false,
				index: 0,
				preset: 0
			},
			editFeedrateDialog: {
				shown: false,
				index: 0,
				preset: 0
			}
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		...mapMutations('machine/settings', ['setExtrusionAmount', 'setExtrusionFeedrate']),
		async buttonClicked(extrude) {
			if (!this.currentTool.extruders.length) {
				return;
			}

			let amounts;
			if (this.mixValue[0] === 'mix') {
				// Split total amount to extrude evenly
				amounts = [this.amount];
			} else {
				// Extrude given amount via each selected extruder drive
				amounts = this.currentTool.extruders.map(extruder => (this.mix.indexOf(extruder) !== -1) ? this.amount : 0);
			}

			this.busy = true;
			try {
				const amount = amounts.map(amount => extrude ? amount : -amount).join(':');
				await this.sendCode(`M120\nM83\nG1 E${amount} F${this.feedrate * 60}\nM121`);
			} catch (e) {
				// handled before we get here
			}
			this.busy = false;
		},
		bioAlternarMezcla(e) {
			const sel = this.mixValue.filter(x => x !== 'mix');
			const i = sel.indexOf(e);
			if (i === -1) { sel.push(e); } else if (sel.length > 1) { sel.splice(i, 1); }
			this.mixValue = sel;
		},
		editAmount(index) {
			this.editAmountDialog.index = index;
			this.editAmountDialog.preset = this.extruderAmounts[index];
			this.editAmountDialog.shown = true;
		},
		setAmount(value) {
			this.setExtrusionAmount({ index: this.editAmountDialog.index, value });
			this.amount = value;
		},
		editFeedrate(index) {
			this.editFeedrateDialog.index = index;
			this.editFeedrateDialog.preset = this.extruderFeedrates[index];
			this.editFeedrateDialog.shown = true;
		},
		setFeedrate(value) {
			this.setExtrusionFeedrate({ index: this.editFeedrateDialog.index, value });
			this.feedrate = value;
		}
	},
	mounted() {
		this.amount = this.extruderAmounts[3];
		this.feedrate = this.extruderFeedrates[3];
	},
	watch: {
		currentTool(to) {
			if (!to || to.extruders.length <= 1) {
				// Switch back to mixing mode if the selection panel is hidden
				this.mix = ['mix'];
			}
		},
		extruderAmounts() {
			this.amount = this.extruderAmounts[3];
		},
		extruderFeedrates() {
			this.feedrate = this.extruderFeedrates[3];
		}
	}
}
</script>

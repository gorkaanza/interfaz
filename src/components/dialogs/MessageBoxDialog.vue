<template>
	<v-dialog v-model="shown" :persistent="persistent" content-class="clsMessageBoxDialog" max-width="500">
		<v-card>
			<v-card-title class="headline">
				{{ messageBox ? messageBox.title : $t('generic.noValue') }}
			</v-card-title>
			<v-card-text class="title">
				<!-- Main message -->
				<div class="text-center" :class="{ 'mb-6': displayedAxes.length }" v-html="displayedMessage"></div>
				<!-- Jog control -->
				<!-- TODO Replace the following and the content in MovementPanel with an own component -->
				<v-row v-for="axis in displayedAxes" :key="axis.letter" dense align="center">
					<!-- Decreasing movements -->
					<v-col>
						<v-row no-gutters>
							<v-col v-for="index in numMoveSteps" :key="index" :class="getMoveCellClass(index - 1)">
								<code-btn :code="getMoveCode(axis, index - 1, true)" :disabled="!canMove(axis)" no-wait block tile class="move-btn">
									<v-icon>mdi-chevron-left</v-icon> {{ axis.letter + showSign(-moveSteps(axis.letter)[index - 1]) }}
								</code-btn>
							</v-col>
						</v-row>
					</v-col>
					<!-- Current position -->
					<v-col cols="auto" class="px-3">
						<strong>
							{{ axis.letter + ' = ' + displayAxisPosition(axis) }}
						</strong>
					</v-col>
					<!-- Increasing movements -->
					<v-col>
						<v-row no-gutters>
							<v-col v-for="index in numMoveSteps" :key="index" :class="getMoveCellClass(numMoveSteps - index)">
								<code-btn :code="getMoveCode(axis, numMoveSteps - index, false)" :disabled="!canMove(axis)" no-wait block tile class="move-btn">
									{{ axis.letter + showSign(moveSteps(axis.letter)[numMoveSteps - index]) }} <v-icon>mdi-chevron-right</v-icon>
								</code-btn>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card-text>

			<v-card-actions v-if="messageBox && messageBox.mode !== 0">
				<v-spacer></v-spacer>
				<v-btn width="120" height="48" color="green darken-1" text @click="ok" outlined rounded>
					{{ $t(messageBox.mode === 1 ? 'generic.close' : 'generic.ok') }}
				</v-btn>
				<v-btn width="120" height="48" v-if="messageBox && messageBox.mode === 3" color="green darken-1" text outlined rounded @click="cancel">
					{{ $t('generic.cancel') }}
				</v-btn>
				<v-spacer></v-spacer>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
'use strict'
import i18n from '@/i18n'
import { mapState, mapGetters, mapActions } from 'vuex'
import { MessageBoxMode } from "@/store/machine/modelEnums";

export default {
	computed: {
		...mapState('machine', ['isReconnecting']),
		...mapState('machine/model', {
			messageBox: state => state.state.messageBox,
			move: state => state.move,
			tools: state => state.tools || [],
			filamentMonitors: state => (state.sensors && state.sensors.filamentMonitors) ? state.sensors.filamentMonitors : []
		}),
		// Estado del sensor del extrusor cuyo aviso se ha cerrado (null si no hay ninguno silenciado)
		silencedMonitorStatus() {
			if (this.silencedExtruder === null) return null;
			const fm = this.filamentMonitors[this.silencedExtruder];
			return fm ? fm.status : null;
		},
		...mapState('machine/settings', ['moveFeedrate']),
		...mapGetters('machine/settings', ['moveSteps', 'numMoveSteps']),
		displayedAxes() {
			const axisControls = this.messageBox ? this.messageBox.axisControls : 0;
			return this.move.axes.filter((axis, index) => axis.visible && ((axisControls & (1 << index)) !== 0));
		},
		// Texto mostrado: se traduce aquí, sin modificar el store
		displayedMessage() {
			if (!this.messageBox) {
				return this.$t('generic.noValue');
			}
			const msg = this.messageBox.message || '';
			const extruder = this.getFilamentErrorExtruder(this.messageBox);
			if (extruder === null) {
				return msg;
			}
			// Buscar qué tool usa ese extrusor
			const tool = this.tools.find(t => t && t.extruders && t.extruders.includes(extruder));
			// Numeración para el usuario: T0 → Tool 1, T1 → Tool 2...
			const toolNumber = tool ? tool.number + 1 : extruder + 1;
			return `<strong>Tool ${toolNumber}</strong><br>${i18n.t('domotek.error.toolAgotado')}`;
		}
	},
	data() {
		return {
			shown: false,
			persistent: false,
			dismissedKey: null,
			silencedExtruder: null
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		// Identifica un mensaje concreto. Usa seq si existe; si no, título + texto.
		// Devuelve el número de extrusor si es un aviso de filamento, o null
		getFilamentErrorExtruder(box) {
			if (!box || !box.message) return null;
			const m = /^Filament error on extruder (\d+)/.exec(box.message);
			return m ? parseInt(m[1], 10) : null;
		},
		// Al cerrar un aviso de filamento, se silencian los siguientes de ese extrusor
		// hasta que el sensor vuelva a detectar material
		rememberDismissed(box) {
			this.dismissedKey = this.getMessageKey(box);
			const extruder = this.getFilamentErrorExtruder(box);
			if (extruder !== null) {
				this.silencedExtruder = extruder;
			}
		},
		getMessageKey(box) {
			if (!box) return null;
			return (box.seq !== undefined && box.seq !== null)
				? `seq:${box.seq}`
				: `txt:${box.title}|${box.message}`;
		},
		canMove(axis) {
			return axis.homed || !this.move.noMovesBeforeHoming;
		},
		displayAxisPosition(axis) {
			let position = NaN;
			if (this.displayToolPosition) {
				if (axis.drives.length > 0) {
					position = this.move.drives[axis.drives[0]].position;
				}
			} else {
				position = axis.machinePosition;
			}
			return (axis.letter === 'Z') ? this.$displayZ(position, false) : this.$display(position, 1);
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
		async ok() {
			this.shown = false;
			if (!this.messageBox) return;
			this.rememberDismissed(this.messageBox);
			if (this.messageBox.mode === MessageBoxMode.closeOnly ||
				this.messageBox.mode === MessageBoxMode.okOnly ||
				this.messageBox.mode === MessageBoxMode.okCancel) {
				try {
					await this.sendCode('M292');
				} catch (e) {
					console.warn('MessageBoxDialog: M292 falló', e);
				}
			}
		},
		async cancel() {
			this.shown = false;
			if (!this.messageBox) return;
			this.rememberDismissed(this.messageBox);
			if (this.messageBox.mode === MessageBoxMode.okCancel) {
				await this.sendCode('M292 P1');
			}
		}
	},
	watch: {
		isReconnecting(to) {
			if (to) {
				this.shown = false;
			}
		},
		// Cuando el sensor silenciado vuelve a detectar material, se reactivan sus avisos
		silencedMonitorStatus(to) {
			if (this.silencedExtruder !== null && to !== 'noFilament') {
				this.silencedExtruder = null;
			}
		},
		messageBox: {
			deep: true,
			handler(to) {
				if (!to || to.mode === null) {
					this.shown = false;
					this.dismissedKey = null;
					return;
				}

				const key = this.getMessageKey(to);

				// No reabrir un mensaje que ya se ha cerrado
				if (key === this.dismissedKey) {
					return;
				}

				// No reabrir avisos de filamento de un extrusor ya avisado
				// mientras su sensor siga sin detectar material
				const extruder = this.getFilamentErrorExtruder(to);
				if (extruder !== null && extruder === this.silencedExtruder) {
					return;
				}

				this.shown = true;
				this.persistent = (to.mode !== 0);
			}
		}
	}
}
</script>
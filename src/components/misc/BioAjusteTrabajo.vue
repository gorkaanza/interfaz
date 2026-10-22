<template>
	<!-- domotek: ajustes del trabajo en curso (Ajuste Z, velocidad y extrusión) con el tema oscuro -->
	<div class="bio-aj">
		<header class="bio-teclado-cab">
			<span class="bio-teclado-icono" :class="tipo === 'z' ? 'acento' : (tipo === 'velocidad' ? 'hum' : '')"><v-icon>{{ icono }}</v-icon></span>
			<span class="bio-teclado-nombre">{{ titulo }}</span>
			<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.close')" @click="$emit('cerrar')"><v-icon>mdi-close</v-icon></button>
		</header>

		<!-- Ajuste Z -->
		<template v-if="tipo === 'z'">
			<div class="bio-aj-datos">
				<div v-for="z in ejesZ" :key="z.id"><span>{{ z.nombre }}</span><strong>{{ z.valor }}<small> mm</small></strong></div>
				<div class="paso">
					<span>{{ $t('domotek.ajuste.step') }}</span>
					<div class="bio-aj-pasos" role="radiogroup">
						<button v-for="p in pasosZ" :key="p" type="button" role="radio" :aria-checked="paso === p" :class="{ activo: paso === p }" @click="paso = p">{{ $display(p, 2) }}</button>
					</div>
				</div>
			</div>
			<div class="bio-aj-z">
				<code-btn class="bio-aj-zbtn" :code="`M290 R1 Z${-paso}`" no-wait :disabled="uiFrozen">
					<v-icon>mdi-arrow-collapse-down</v-icon>
					<strong>−{{ $display(paso, 2) }} mm</strong>
					<span>{{ $t('domotek.ajuste.closer') }}</span>
				</code-btn>
				<code-btn class="bio-aj-zbtn" :code="`M290 R1 Z${paso}`" no-wait :disabled="uiFrozen">
					<v-icon>mdi-arrow-expand-up</v-icon>
					<strong>+{{ $display(paso, 2) }} mm</strong>
					<span>{{ $t('domotek.ajuste.farther') }}</span>
				</code-btn>
			</div>
			<p class="bio-aj-nota">{{ $t('domotek.ajuste.zHint') }}</p>
			<div class="bio-aj-pie">
				<code-btn class="bio-teclado-sec" code="M290 R0 Z0" no-wait :disabled="uiFrozen || babystepZ === 0">{{ $t('domotek.ajuste.resetZ') }}</code-btn>
				<button type="button" class="bio-teclado-ok acento" @click="$emit('cerrar')">{{ $t('domotek.ajuste.done') }}</button>
			</div>
		</template>

		<!-- Velocidad y extrusión -->
		<template v-else>
			<p class="bio-aj-nota arriba">{{ tipo === 'velocidad' ? $t('domotek.ajuste.speedHint') : $t('domotek.ajuste.extrusionHint') }}</p>
			<!-- Extrusión: el usuario elige a qué tool (o a todos) se aplica el deslizador -->
			<div v-if="tipo === 'extrusion' && extrusores.length > 1" class="bio-aj-tools" role="radiogroup" :aria-label="$t('domotek.ajuste.applyTo')">
				<button v-for="e in opcionesTool" :key="e.id" type="button" role="radio" :aria-checked="seleccion === e.id" :class="{ activo: seleccion === e.id }" @click="seleccion = e.id">
					<span class="nom">{{ e.nombre }}</span>
					<span class="val" :class="{ cambiado: e.valor !== null && e.valor !== 100 }">{{ e.valor === null ? $t('domotek.ajuste.mixed') : e.valor + ' %' }}</span>
				</button>
			</div>
			<div class="bio-aj-filas">
				<div v-for="f in filas" :key="f.id" class="bio-aj-fila">
					<span class="nombre">{{ f.nombre }}</span>
					<button type="button" class="menos" :disabled="uiFrozen || f.valor <= minimo" :aria-label="`${f.nombre} −${salto} %`" @click="fijar(f, f.valor - salto)">−</button>
					<input type="range" :min="minimo" :max="maximo" step="1" :value="f.valor" :disabled="uiFrozen" :aria-label="f.nombre" :style="{ '--pct': ((f.valor - minimo) / (maximo - minimo) * 100) + '%' }" @input="arrastrar(f, $event.target.value)" @change="fijar(f, $event.target.value)">
					<button type="button" class="mas" :disabled="uiFrozen || f.valor >= maximo" :aria-label="`${f.nombre} +${salto} %`" @click="fijar(f, f.valor + salto)">+</button>
					<strong class="valor" :class="{ cambiado: f.valor !== 100 }">{{ f.valor }}<small> %</small></strong>
				</div>
				<p v-if="tipo === 'extrusion' && seleccion === 'todos' && valoresDistintos" class="bio-aj-nota centro">{{ $t('domotek.ajuste.mixedHint') }}</p>
				<p v-if="!filas.length" class="bio-aj-nota">{{ $t('panel.extrusionFactors.noExtruders') }}</p>
			</div>
			<div v-if="filas.length" class="bio-aj-atajos">
				<button v-for="v in atajos" :key="v" type="button" :class="{ activo: objetivos.every(f => f.valor === v) }" :disabled="uiFrozen" @click="filas.forEach(f => fijar(f, v))">{{ v }} %</button>
			</div>
			<div class="bio-aj-pie">
				<button type="button" class="bio-teclado-sec" :disabled="uiFrozen || objetivos.every(f => f.valor === 100)" @click="filas.forEach(f => fijar(f, 100))">{{ $t('domotek.ajuste.reset') }}</button>
				<button type="button" class="bio-teclado-ok" :class="tipo === 'velocidad' ? 'hum' : ''" @click="$emit('cerrar')">{{ $t('domotek.ajuste.done') }}</button>
			</div>
		</template>
	</div>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	props: {
		tipo: { type: String, required: true }	// 'z' · 'velocidad' · 'extrusion'
	},
	data() {
		return {
			paso: 0.02,
			pasosZ: [0.01, 0.02, 0.05, 0.1],
			salto: 5,
			minimo: 10,
			maximo: 200,
			seleccion: null,		// extrusión: id del extrusor elegido ('e0', 'e1'…) o 'todos'
			pendientes: {},		// valores enviados que el object model aún no ha devuelto
			temporizadores: {}
		}
	},
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', ['move', 'tools']),
		...mapState('machine/settings', ['babystepAmount']),
		titulo() {
			return { z: this.$t('domotek.ajuste.zTitle'), velocidad: this.$t('domotek.ajuste.speedTitle'), extrusion: this.$t('domotek.ajuste.extrusionTitle') }[this.tipo];
		},
		icono() {
			return { z: 'mdi-format-vertical-align-center', velocidad: 'mdi-speedometer', extrusion: 'mdi-water-outline' }[this.tipo];
		},
		babystepZ() {
			const ax = this.move.axes || [];
			return (ax.length >= 3 && ax[2]) ? (ax[2].babystep || 0) : 0;
		},
		ejesZ() {
			const ax = this.move.axes || [];
			const fmt = v => (v > 0 ? '+' : '') + this.$display(v || 0, 2);
			// Máquinas con dos Z (4 tools): Z1 en el eje 2 y Z2 en el eje 6, como en ZBabystepPanel
			if (ax.length >= 7 && ax[6]) {
				return [
					{ id: 'z1', nombre: this.$t('domotek.ajuste.offsetOf', ['Z1']), valor: fmt(this.babystepZ) },
					{ id: 'z2', nombre: this.$t('domotek.ajuste.offsetOf', ['Z2']), valor: fmt(ax[6].babystep) }
				];
			}
			return [{ id: 'z1', nombre: this.$t('domotek.ajuste.current'), valor: fmt(this.babystepZ) }];
		},
		extrusores() {
			return (this.move.extruders || []).map((e, i) => {
				const tool = (this.tools || []).find(t => t && (t.extruders || []).includes(i));
				const id = 'e' + i;
				return {
					id, extrusor: i,
					nombre: tool ? (tool.name || `T${tool.number}`) : this.$t('panel.extrusionFactors.extruder', [i + 1]),
					valor: this.pendientes[id] !== undefined ? this.pendientes[id] : Math.round((e && e.factor !== undefined ? e.factor : 1) * 100)
				};
			});
		},
		valoresDistintos() {
			return new Set(this.extrusores.map(e => e.valor)).size > 1;
		},
		opcionesTool() {
			return [
				{ id: 'todos', nombre: this.$t('domotek.ajuste.allTools'), valor: this.valoresDistintos ? null : (this.extrusores[0] || {}).valor },
				...this.extrusores
			];
		},
		objetivos() { // valores a los que afectan los atajos y el botón de restablecer
			return (this.tipo === 'extrusion' && this.filas.length && this.filas[0].todos) ? this.extrusores : this.filas;
		},
		atajos() {
			return [50, 75, 100, 125, 150];
		},
		filas() {
			if (this.tipo === 'velocidad') {
				const v = this.pendientes.vel !== undefined ? this.pendientes.vel : Math.round((this.move.speedFactor || 1) * 100);
				return [{ id: 'vel', nombre: this.$t('domotek.jobs.speed'), valor: v }];
			}
			// Extrusión: un único deslizador para el tool elegido (o para todos)
			if (!this.extrusores.length) { return []; }
			if (this.extrusores.length === 1) { return this.extrusores; }
			if (this.seleccion === 'todos' || !this.seleccion) {
				const v = this.pendientes.todos !== undefined ? this.pendientes.todos : this.extrusores[0].valor;
				return [{ id: 'todos', nombre: this.$t('domotek.ajuste.allTools'), valor: v, todos: true }];
			}
			return this.extrusores.filter(e => e.id === this.seleccion);
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		limitar(v) {
			return Math.max(this.minimo, Math.min(this.maximo, Math.round(Number(v))));
		},
		recordar(f, v) {
			this.$set(this.pendientes, f.id, v);
			clearTimeout(this.temporizadores[f.id]);
			this.temporizadores[f.id] = setTimeout(() => { this.$delete(this.pendientes, f.id); }, 2000);
		},
		arrastrar(f, v) {
			this.recordar(f, this.limitar(v));
		},
		fijar(f, v) {
			const valor = this.limitar(v);
			this.recordar(f, valor);
			if (this.tipo === 'velocidad') {
				this.sendCode(`M220 S${valor}`);
			} else if (f.todos) {
				this.extrusores.forEach(e => this.recordar(e, valor));
				this.sendCode(this.extrusores.map(e => `M221 D${e.extrusor} S${valor}`).join('\n'));
			} else {
				this.sendCode(`M221 D${f.extrusor} S${valor}`);
			}
		}
	},
	mounted() {
		// Extrusión: empieza en el tool seleccionado ahora, si tiene extrusor
		if (this.tipo === 'extrusion') {
			const m = this.$store.state.machine.model;
			const actual = (m.tools || [])[m.state.currentTool];
			const ext = actual && (actual.extruders || [])[0];
			this.seleccion = (ext !== undefined && this.extrusores.some(e => e.extrusor === ext)) ? 'e' + ext : 'todos';
		}
		if (this.babystepAmount && !this.pasosZ.includes(this.babystepAmount)) {
			this.pasosZ = [...this.pasosZ, this.babystepAmount].sort((a, b) => a - b);
		}
		if (this.babystepAmount) { this.paso = this.babystepAmount; }
	},
	beforeDestroy() {
		Object.values(this.temporizadores).forEach(clearTimeout);
	}
}
</script>

<template>
	<!-- domotek: teclado numérico con el diseño nuevo, para los diálogos de valores de UV / ES.
	     No guarda estado propio: envía las teclas al panel ('7', '.', 'DEL', 'CLEAR') y el panel
	     sigue validando y guardando con sus métodos de siempre. -->
	<div class="bio-teclado">
		<section class="bio-teclado-izq">
			<header class="bio-teclado-cab">
				<span class="bio-teclado-icono" :class="color"><v-icon>{{ icono }}</v-icon></span>
				<span class="bio-teclado-nombre">{{ titulo }}</span>
				<button type="button" class="bio-teclado-cerrar" :aria-label="$t('generic.cancel')" @click="$emit('cancelar')"><v-icon>mdi-close</v-icon></button>
			</header>

			<template v-if="campos">
				<div class="bio-teclado-coords">
					<button v-for="c in campos" :key="c.id" type="button" class="bio-teclado-valor" :class="[color, { inactivo: activo !== c.id, fuera: !!c.error }]" @click="$emit('activar', c.id)">
						<span>{{ c.etiqueta }}</span>
						<strong>{{ c.valor === '' ? '—' : c.valor }}</strong><small v-if="unidad">{{ unidad }}</small>
					</button>
				</div>
				<div class="bio-teclado-rango" :class="{ fuera: !!errorCampos }">{{ errorCampos || rango }}</div>
			</template>
			<template v-else>
				<div v-if="actual !== null && actual !== undefined && actual !== ''" class="bio-teclado-datos">
					<div><span>{{ $t('domotek.keypad.currentValue') }}</span><strong>{{ actual }}<small v-if="unidad" class="bio-tenue"> {{ unidad }}</small></strong></div>
					<div v-if="permitido"><span>{{ $t('domotek.keypad.allowed') }}</span><strong class="peq">{{ permitido }}</strong></div>
				</div>
				<div class="bio-teclado-valor" :class="[color, { fuera: !!error && valor !== '' }]">
					<span>{{ $t('domotek.keypad.newValue') }}</span>
					<strong>{{ valor === '' ? '—' : valor }}</strong><small v-if="unidad">{{ unidad }}</small>
				</div>
				<div class="bio-teclado-rango" :class="{ fuera: !!error && valor !== '' }">{{ (error && valor !== '') ? error : rango }}</div>
			</template>

			<div v-if="atajos && atajos.length" class="bio-teclado-atajos">
				<button v-for="a in atajos" :key="String(a.valor)" type="button" :class="[color, { activo: !campos && String(a.valor) === valor }]" @click="$emit('atajo', a.valor), reemplazar = true">{{ a.texto || a.valor }}</button>
			</div>
			<div style="flex: 1"></div>
			<div class="bio-teclado-acciones">
				<button type="button" class="bio-teclado-sec" @click="$emit('cancelar')">{{ $t('generic.cancel') }}</button>
				<button type="button" class="bio-teclado-ok" :class="color" :disabled="!valido" @click="$emit('aceptar')">{{ textoAceptar }}</button>
			</div>
		</section>
		<section class="bio-teclado-num" :aria-label="$t('domotek.keypad.keypad')">
			<button v-for="n in ['7', '8', '9', '4', '5', '6', '1', '2', '3']" :key="n" type="button" @click="tecla(n)">{{ n }}</button>
			<button v-if="decimales" type="button" @click="tecla('.')">,</button>
			<button v-else type="button" class="suave" :aria-label="$t('domotek.keypad.clear')" @click="tecla('CLEAR')">C</button>
			<button type="button" @click="tecla('0')">0</button>
			<button type="button" class="suave" :aria-label="$t('domotek.keypad.delete')" @click="tecla('DEL')" @contextmenu.prevent="tecla('CLEAR')"><v-icon>mdi-backspace-outline</v-icon></button>
		</section>
	</div>
</template>

<script>
'use strict'

export default {
	props: {
		abierto: { type: Boolean, default: false },	// para que la primera tecla sustituya el valor al abrir
		titulo: String,
		icono: { type: String, default: 'mdi-numeric' },
		color: { type: String, default: 'acento' },		// acento (verde) · lila · azul · ambar
		valor: { type: String, default: '' },
		unidad: String,
		error: String,
		rango: String,
		actual: [String, Number],
		permitido: String,
		decimales: { type: Boolean, default: true },
		atajos: Array,									// [{ valor, texto? }]
		textoOk: String,
		campos: Array,									// modo de dos campos: [{ id, etiqueta, valor, error }]
		activo: String
	},
	data() {
		return { reemplazar: true };
	},
	computed: {
		errorCampos() {
			const c = (this.campos || []).find(x => x.error);
			return c ? c.error : '';
		},
		valido() {
			if (this.campos) { return this.campos.every(c => c.valor !== '' && !c.error); }
			return this.valor !== '' && !this.error;
		},
		textoAceptar() {
			if (this.textoOk) { return this.textoOk; }
			if (this.campos || this.valor === '') { return this.$t('domotek.keypad.apply'); }
			return this.$t('domotek.keypad.applyValue', [this.valor + (this.unidad ? ' ' + this.unidad : '')]);
		}
	},
	methods: {
		tecla(k) {
			// La primera tecla numérica sustituye el valor que había al abrir
			if (this.reemplazar && !this.campos && k !== 'DEL' && k !== 'CLEAR') { this.$emit('tecla', 'CLEAR'); }
			this.reemplazar = false;
			this.$emit('tecla', k);
		}
	},
	watch: {
		abierto(v) { if (v) { this.reemplazar = true; } },
		activo() { this.reemplazar = true; }
	}
}
</script>

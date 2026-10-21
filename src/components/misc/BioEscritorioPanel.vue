<style lang="scss">
// domotek: panel de control del modo escritorio (según la maqueta Escritorio_Panel)
.bio-esc {
	/* Ocupa la ventana sin estirarse sin límite en monitores grandes */
	height: min(calc(100vh - 64px - 40px), 760px); min-height: 560px;
	max-width: 1640px; margin: 0 auto;
	display: grid; gap: 16px;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	grid-template-rows: 250px minmax(0, 1fr);
	font-size: 14px;
	button { font-family: inherit; color: inherit; border: none; cursor: pointer; }
}
.bio-esc-card { background: #1E2328; border-radius: 16px; padding: 18px 20px; min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box; }
.bio-esc-card h2 { margin: 0; font-size: 13px; color: #9AA5AF; font-weight: 500; }
.bio-esc-trabajo { grid-column: 1 / span 2; display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 20px; }
.bio-esc-info { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.bio-esc-fila { display: flex; align-items: baseline; gap: 12px; }
.bio-esc-archivo { flex: 1; min-width: 0; font-size: 20px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bio-esc-pct { font-size: 28px; font-weight: 600; color: #3CC9B0; line-height: 1; }
.bio-esc-datos { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; color: #9AA5AF; font-size: 13px; }
.bio-esc-datos div div { color: #E8EDF1; font-size: 17px; font-weight: 500; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bio-esc-acciones { display: flex; gap: 10px; align-items: center; }
.bio-esc-btn, .v-btn.bio-esc-btn {
	height: 40px !important; padding: 0 18px !important; border-radius: 10px !important; background: #262C33 !important;
	color: #E8EDF1 !important; font-size: 14px; font-weight: 400; box-shadow: none !important; letter-spacing: 0; text-transform: none;
	&.peligro { background: #3A1D1C !important; color: #F08A83 !important; }
	&.acento { background: #3CC9B0 !important; color: #0E1013 !important; font-weight: 600; }
	&.v-btn--disabled { opacity: .5; }
	&.ancho { width: 100%; }
}
.bio-esc-resumen { font-size: 13px; color: #9AA5AF; white-space: nowrap; strong { color: #E8EDF1; } }
.bio-esc-pos { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px 8px; }
.bio-esc-pos .et { font-size: 12px; color: #9AA5AF; }
.bio-esc-pos .vl { font-size: 20px; font-weight: 500; }
.bio-esc-pos .vl.sin-home { color: #F2A65A; }
.bio-esc-tabla-cab, .bio-esc-tabla-fila { display: grid; grid-template-columns: 40px minmax(0, 1fr) 78px 70px; align-items: center; padding: 0 6px; }
.bio-esc-tabla-cab { font-size: 12px; color: #9AA5AF; }
.bio-esc-tabla-fila { height: 40px; border-radius: 10px; font-size: 14px; white-space: nowrap; }
.bio-esc-tabla-fila > span { overflow: hidden; text-overflow: ellipsis; }
.bio-esc-tabla-fila .t { font-weight: 600; color: #9AA5AF; }
.bio-esc-tabla-fila.activa { background: #1F3B37; .t { color: #3CC9B0; } }
.bio-esc-tabla-fila .tenue { color: #9AA5AF; }
.bio-esc-tabla-fila .obj { color: #F2A65A; }
.bio-esc-sep { height: 1px; background: #2A3138; flex: none; }
.bio-esc-graf-cab { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #9AA5AF; }
.bio-esc-graf-cab h2 { flex: 1; }
.bio-esc-leyenda { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.bio-esc-leyenda i { width: 14px; height: 3px; border-radius: 2px; display: inline-block; }
.bio-esc-graf { flex: 1; min-height: 0; width: 100%; position: relative; }
.bio-esc-graf svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.bio-esc-graf-et { position: absolute; left: 0; transform: translateY(-50%); font-size: 11px; color: #9AA5AF; }
.bio-esc-proc { display: flex; align-items: center; gap: 12px; min-height: 52px; border-radius: 12px; background: #262C33; padding: 6px 14px; text-align: left; width: 100%; box-sizing: border-box; }
.bio-esc-proc .punto { width: 10px; height: 10px; border-radius: 50%; flex: none; }
.bio-esc-proc .nom { flex: 1; font-size: 14px; min-width: 0; }
.bio-esc-proc .det { font-size: 13px; color: #9AA5AF; white-space: nowrap; }
.bio-esc-proc:hover { background: #2C333B; }
.bio-esc-vacio { color: #9AA5AF; font-size: 13px; padding: 4px 0; }
</style>

<template>
	<div class="bio-esc">
		<!-- Trabajo en curso -->
		<section class="bio-esc-card bio-esc-trabajo" :aria-label="$t('domotek.desktop.jobRunning')">
			<bio-vista-trabajo :modos="['webcam', 'capas', 'figura']"></bio-vista-trabajo>
			<div class="bio-esc-info">
				<h2>{{ imprimiendo ? $t('domotek.desktop.jobRunning') : $t('domotek.jobs.noJob') }}</h2>
				<div class="bio-esc-fila">
					<span class="bio-esc-archivo">{{ imprimiendo ? archivo : (ultimoArchivo || '—') }}</span>
					<span v-if="imprimiendo" class="bio-esc-pct">{{ Math.round(jobProgress * 100) }} %</span>
				</div>
				<div class="bio-barra"><div :style="{ width: (imprimiendo ? jobProgress * 100 : 0) + '%' }"></div></div>
				<div class="bio-esc-datos">
					<div>{{ $t('domotek.jobs.layer') }}<div>{{ imprimiendo && job.file && job.file.numLayers ? `${job.layer || 0} / ${job.file.numLayers}` : '—' }}</div></div>
					<div>{{ $t('domotek.jobs.elapsed') }}<div>{{ imprimiendo ? $displayTime(job.duration) : '—' }}</div></div>
					<div>{{ $t('domotek.jobs.remaining') }}<div>{{ imprimiendo && queda ? $displayTime(queda) : '—' }}</div></div>
					<div>Tool<div :title="toolActual">{{ toolActual }}</div></div>
				</div>
				<div style="flex: 1"></div>
				<div class="bio-esc-acciones">
					<template v-if="imprimiendo">
						<code-btn class="bio-esc-btn" :code="pausado ? 'M24' : 'M25'" no-wait>{{ pausado ? $t('domotek.jobs.resume') : $t('domotek.jobs.pause') }}</code-btn>
						<code-btn class="bio-esc-btn peligro" :code="cancelCode" :disabled="!pausado" no-wait>{{ $t('domotek.jobs.cancel') }}</code-btn>
					</template>
					<template v-else>
						<button type="button" class="bio-esc-btn acento" @click="$router.push('/Files/Jobs')">{{ $t('domotek.jobs.chooseFile') }}</button>
						<code-btn v-if="repetirCode" class="bio-esc-btn" :code="repetirCode" no-wait>{{ $t('domotek.jobs.repeat') }}</code-btn>
					</template>
					<div style="flex: 1"></div>
					<span class="bio-esc-resumen">{{ $t('domotek.jobs.speed') }} <strong>{{ velocidad }} %</strong> · Z <strong>{{ babystep }}</strong></span>
				</div>
			</div>
		</section>

		<!-- Posición -->
		<section class="bio-esc-card" :aria-label="$t('domotek.desktop.position')">
			<h2>{{ $t('domotek.desktop.position') }}</h2>
			<div class="bio-esc-pos">
				<div v-for="(eje, i) in ejes" :key="i">
					<div class="et">{{ etiquetaEje(i, eje) }}</div>
					<div class="vl" :class="{ 'sin-home': !eje.homed }">{{ eje.letter === 'Z' ? $displayZ(eje.userPosition, false) : $display(eje.userPosition, 1) }}</div>
				</div>
			</div>
			<div style="flex: 1"></div>
			<div class="bio-esc-resumen">{{ $t('domotek.desktop.requestedSpeed') }} <strong>{{ $display(move.currentMove && move.currentMove.requestedSpeed, 0, 'mm/s') }}</strong> · {{ $t('domotek.desktop.topSpeed') }} <strong>{{ $display(move.currentMove && move.currentMove.topSpeed, 0, 'mm/s') }}</strong></div>
		</section>

		<!-- Tools y calentadores -->
		<section class="bio-esc-card" :aria-label="$t('domotek.desktop.tools')">
			<h2>{{ $t('domotek.desktop.tools') }}</h2>
			<div class="bio-esc-tabla-cab"><span></span><span>Tool</span><span>{{ $t('domotek.desktop.current') }}</span><span>{{ $t('domotek.tools.target') }}</span></div>
			<div v-for="f in filasTools" :key="f.et" class="bio-esc-tabla-fila" :class="{ activa: f.activa }">
				<span class="t">{{ f.et }}</span>
				<span :class="{ tenue: f.vacio }">{{ f.nombre }}</span>
				<span :class="{ tenue: f.actual === '—' }">{{ f.actual }}</span>
				<span :class="f.objetivo === '—' ? 'tenue' : 'obj'">{{ f.objetivo }}</span>
			</div>
			<div class="bio-esc-sep"></div>
			<div v-for="f in filasCalor" :key="f.nombre" class="bio-esc-tabla-fila">
				<span></span>
				<span>{{ f.nombre }}</span>
				<span :class="{ tenue: f.actual === '—' }">{{ f.actual }}</span>
				<span :class="f.objetivo === '—' ? 'tenue' : 'obj'">{{ f.objetivo }}</span>
			</div>
		</section>

		<!-- Gráfica de temperatura -->
		<section class="bio-esc-card" :aria-label="$t('domotek.desktop.chart')">
			<div class="bio-esc-graf-cab">
				<h2>{{ $t('domotek.desktop.chartLast10') }}</h2>
				<span v-for="s in series" :key="s.nombre" class="bio-esc-leyenda"><i :style="{ background: s.color }"></i>{{ s.nombre }}</span>
			</div>
			<div class="bio-esc-graf">
				<span v-for="l in lineasY" :key="'e' + l.v" class="bio-esc-graf-et" :style="{ top: (l.y / 300 * 100) + '%' }">{{ l.v }}</span>
				<svg role="img" :aria-label="descripcionGrafica" viewBox="0 0 380 300" preserveAspectRatio="none">
					<path v-for="l in lineasY" :key="l.v" :d="`M30 ${l.y}H380`" stroke="#262C33" stroke-width="1" vector-effect="non-scaling-stroke"></path>
					<path v-for="s in series" :key="'p' + s.nombre" :d="s.d" :stroke="s.color" stroke-width="2.5" fill="none" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"></path>
				</svg>
			</div>
		</section>

		<!-- Procesos de este trabajo -->
		<section class="bio-esc-card" :aria-label="$t('domotek.desktop.processes')">
			<h2>{{ $t('domotek.desktop.processes') }}</h2>
			<button v-for="p in procesos" :key="p.id" type="button" class="bio-esc-proc" @click="$router.push({ path: '/Job/Status', query: { abrir: p.id } })">
				<span class="punto" :style="{ background: p.color }"></span>
				<span class="nom">{{ p.texto }}</span>
				<span class="det">{{ p.detalle }}</span>
			</button>
			<span v-if="!procesos.length" class="bio-esc-vacio">{{ $t('domotek.desktop.noProcesses') }}</span>
			<div style="flex: 1"></div>
			<button type="button" class="bio-esc-btn ancho" @click="$router.push({ path: '/Job/Status', query: { pestana: 'procesos' } })">{{ $t('domotek.desktop.openProcesses') }}</button>
		</section>
	</div>
</template>

<script>
'use strict'

import { mapState, mapGetters } from 'vuex'
import { isPrinting, isPaused } from '../../store/machine/modelEnums.js'
import { extractFileName } from '../../utils/path.js'
import { historial, iniciarHistorial } from '../../utils/historialTemp.js'

const COLORES = { tool: '#3CC9B0', cama: '#F2A65A', chamber: '#6CB8E6' };

export default {
	computed: {
		...mapState('machine/model', {
			job: state => state.job,
			move: state => state.move,
			status: state => state.state.status,
			heaters: state => state.heat.heaters,
			tools: state => state.tools,
			global: state => state.global
		}),
		...mapGetters('machine/model', ['jobProgress']),
		g() { return this.global || {}; },
		imprimiendo() { return isPrinting(this.status); },
		pausado() { return isPaused(this.status); },
		archivo() { return (this.job.file && this.job.file.fileName) ? extractFileName(this.job.file.fileName) : ''; },
		ultimoArchivo() { return this.job.lastFileName ? extractFileName(this.job.lastFileName) : ''; },
		queda() { const t = this.job.timesLeft || {}; return t.file || t.slicer || t.filament || null; },
		modelo() { return this.g.MachineModel; },
		velocidad() { return Math.round((this.move.speedFactor || 1) * 100); },
		babystep() {
			const ax = this.move.axes || [];
			const v = (ax.length >= 3 && ax[2].babystep) ? ax[2].babystep : 0;
			return (v > 0 ? '+' : '') + v.toFixed(2);
		},
		cancelCode() {
			return this.g.notifyPrintCanceled
				? 'set global.jobWasCancelled = true\nM1212\nM0 H1'
				: 'set global.jobWasCancelled = true\nM0 H1';
		},
		repetirCode() {
			if (!this.job.lastFileName) { return ''; }
			return this.job.lastFileSimulated ? `M37 P"${this.job.lastFileName}"` : `M32 "${this.job.lastFileName}"`;
		},
		ejes() { return (this.move.axes || []).filter(a => a.visible); },
		toolActiva() {
			for (let i = 0; i < 4; i++) { if (this.g['T' + i + 'Activo']) { return i; } }
			return -1;
		},
		toolActual() {
			const i = this.toolActiva;
			return (i >= 0) ? `T${i + 1} · ${this.g['T' + i + 'Name'] || ''}` : '—';
		},
		filasTools() {
			const h = this.heaters || [];
			const n = Math.min((this.tools || []).length, 4);
			const filas = [];
			for (let i = 0; i < n; i++) {
				const tipo = this.g['T' + i];
				filas.push({
					et: `T${i + 1}`, nombre: this.g['T' + i + 'Name'] || '—', vacio: !tipo,
					actual: this.temp(h[i + 1]), objetivo: this.obj(h[i + 1]), activa: this.toolActiva === i
				});
			}
			return filas;
		},
		filasCalor() {
			const h = this.heaters || [];
			const filas = [{ nombre: this.$t('domotek.tools.platform').replace(/^./, c => c.toUpperCase()), actual: this.temp(h[0]), objetivo: this.obj(h[0]) }];
			if (h[20] && this.g.ChamberMode) {
				const rh = (this.g.miniclima_rh !== undefined && this.g.miniclima_rh !== null) ? ` · ${Number(this.g.miniclima_rh).toFixed(0)} % HR` : '';
				filas.push({ nombre: 'Chamber' + rh, actual: this.temp(h[20]), objetivo: this.obj(h[20]) });
			}
			return filas;
		},
		// --- gráfica ---
		indicesSeries() {
			const lista = [];
			const t = this.toolActiva >= 0 ? this.toolActiva : 0;
			if ((this.tools || []).length) { lista.push({ nombre: `T${t + 1}`, i: t + 1, color: COLORES.tool }); }
			lista.push({ nombre: this.$t('domotek.tools.platform').replace(/^./, c => c.toUpperCase()), i: 0, color: COLORES.cama });
			if (this.heaters && this.heaters[20] && this.g.ChamberMode) { lista.push({ nombre: 'Chamber', i: 20, color: COLORES.chamber }); }
			return lista;
		},
		rango() {
			let min = Infinity, max = -Infinity;
			historial.muestras.forEach(m => this.indicesSeries.forEach(s => {
				const v = m.v[s.i];
				if (v !== null && v !== undefined) { min = Math.min(min, v); max = Math.max(max, v); }
			}));
			if (!isFinite(min)) { return { min: 20, max: 50 }; }
			const lo = Math.floor((min - 3) / 5) * 5, hi = Math.ceil((max + 3) / 5) * 5;
			return { min: lo, max: Math.max(hi, lo + 15) };
		},
		lineasY() {
			const { min, max } = this.rango;
			const pasos = 3, out = [];
			for (let k = 0; k <= pasos; k++) {
				const v = Math.round(max - (max - min) * k / pasos);
				out.push({ v, y: 20 + (260 - 20) * k / pasos });
			}
			return out;
		},
		series() {
			const m = historial.muestras;
			const { min, max } = this.rango;
			const x = k => 30 + (350 * k / Math.max(1, 299));
			const y = v => 20 + (max - v) / (max - min) * 240;
			const desplaz = 300 - m.length;		// las muestras nuevas entran por la derecha
			return this.indicesSeries.map(s => {
				let d = '', abierto = false;
				m.forEach((p, k) => {
					const v = p.v[s.i];
					if (v === null || v === undefined) { abierto = false; return; }
					d += `${abierto ? 'L' : 'M'}${x(k + desplaz).toFixed(1)} ${y(v).toFixed(1)}`;
					abierto = true;
				});
				return { ...s, d };
			});
		},
		descripcionGrafica() {
			return this.series.map(s => {
				const ult = historial.muestras.length ? historial.muestras[historial.muestras.length - 1].v[s.i] : null;
				return `${s.nombre} ${ult !== null && ult !== undefined ? ult.toFixed(1) + ' °C' : '—'}`;
			}).join(', ');
		},
		// --- procesos ---
		procesos() {
			const g = this.g, out = [];
			const prog = id => {
				if (!g['enable' + id]) { return ''; }
				if (g['cadenceEnable' + id]) { return this.$t('domotek.jobs.everyNLayers', [g['cadenceAmount' + id] || 1]); }
				if (g['aplicarFin' + id]) { return this.$t('domotek.jobs.atEnd'); }
				return this.$t('domotek.jobs.scheduled');
			};
			const proxima = id => {
				const n = g['cadenceAmount' + id];
				if (!g['cadenceEnable' + id] || !n || !this.imprimiendo) { return ''; }
				const capa = this.job.layer || 0;
				return this.$t('domotek.desktop.nextLayer', [Math.floor(capa / n) * n + n]);
			};
			if (g.ES_Capable && prog('ES')) { out.push({ id: 'ES', color: '#F2D35A', texto: `${this.$t('domotek.jobs.electrospinning')} ${prog('ES')}`, detalle: proxima('ES') }); }
			if (g.UV_Capable && prog('UV')) { out.push({ id: 'UV', color: '#B49CF2', texto: `${this.$t('domotek.jobs.ultraviolet')} ${prog('UV')}`, detalle: proxima('UV') }); }
			if (g.EMD_Capable && prog('EMD')) {
				const det = g.calibratedEMD ? this.$t('panel.emd.calibrated') : this.$t('panel.emd.notCalibrated');
				const vol = g.volDropEMD ? ` · ${g.volDropEMD} nL` : '';
				out.push({ id: 'EMD', color: '#3CC9B0', texto: `${this.$t('domotek.jobs.EMD')}${vol} ${prog('EMD')}`, detalle: det });
			}
			if (g.CL_Capable && prog('CL')) { out.push({ id: 'CL', color: '#6CB8E6', texto: `${this.$t('domotek.jobs.clean')} ${prog('CL')}`, detalle: proxima('CL') }); }
			return out;
		}
	},
	methods: {
		temp(x) { return (!x || x.current === undefined || x.current <= -273) ? '—' : `${x.current.toFixed(1)} °C`; },
		obj(x) { return (x && x.state === 'active' && x.active) ? `${x.active} °C` : '—'; },
		etiquetaEje(index, axis) {
			const nombres = { '2A': ['X0', 'Y', 'Z', 'X1'], '4A': ['X', 'Y1', 'Z1', 'Y2', 'Y3', 'Y4', 'Z2'], 'HK': ['X1', 'Y1', 'Z', 'X2', 'X3', 'X4', 'Y2'] };
			const lista = nombres[this.modelo];
			return (lista && lista[index]) ? lista[index] : axis.letter;
		}
	},
	mounted() {
		iniciarHistorial(this.$store);
	}
}
</script>

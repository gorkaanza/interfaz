<style lang="scss">
// domotek: panel de control del modo escritorio
.bio-esc {
	display: grid; gap: 12px; max-width: 1400px;
	grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr) minmax(0, 1fr);
	grid-template-rows: auto auto;
	font-size: 13px;
	button { font-family: inherit; color: inherit; border: none; cursor: pointer; }
}
.bio-esc-card { background: #1E2328; border-radius: 12px; padding: 14px; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
.bio-esc-card h2 { margin: 0; font-size: 13px; font-weight: 600; }
.bio-esc-trabajo { grid-column: 1 / span 2; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 18px; }
.bio-esc-cam { background: #14171A; border-radius: 10px; min-height: 180px; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #5A6670; }
.bio-esc-cam .v-card { background: transparent !important; }
.bio-esc-fila { display: flex; align-items: baseline; gap: 10px; }
.bio-esc-archivo { flex: 1; min-width: 0; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bio-esc-pct { font-size: 22px; font-weight: 600; color: #3CC9B0; }
.bio-esc-datos { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; color: #9AA5AF; font-size: 12px; }
.bio-esc-datos div div { color: #E8EDF1; font-size: 13.5px; font-weight: 500; margin-top: 2px; }
.bio-esc-acciones { display: flex; gap: 10px; align-items: center; margin-top: auto; flex-wrap: wrap; }
.bio-esc-btn, .v-btn.bio-esc-btn {
	height: 32px !important; padding: 0 12px !important; border-radius: 8px !important; background: #262C33 !important;
	color: #E8EDF1 !important; font-size: 13px; font-weight: 500; box-shadow: none !important; letter-spacing: 0;
	&.peligro { background: #3A1D1C !important; color: #F08A83 !important; }
	&.acento { background: #3CC9B0 !important; color: #0E1013 !important; font-weight: 600; }
}
.bio-esc-pos { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.bio-esc-pos .et { font-size: 12px; color: #9AA5AF; }
.bio-esc-pos .vl { font-size: 16px; font-weight: 500; }
.bio-esc-pos .vl.sin-home { color: #F2A65A; }
.bio-esc-tabla { width: 100%; border-collapse: collapse; font-size: 13px; }
.bio-esc-tabla th { text-align: left; font-weight: 500; color: #9AA5AF; font-size: 12px; padding: 4px 6px; }
.bio-esc-tabla td { padding: 5px 6px; border-top: 1px solid #262C33; white-space: nowrap; }
.bio-esc-tabla td.num { text-align: right; font-variant-numeric: tabular-nums; }
.bio-esc-tabla .obj { color: #F2A65A; }
.bio-esc-grafica { grid-column: 2 / span 2; min-height: 260px; }
.bio-esc-grafica .v-card, .bio-esc-grafica .v-sheet { background: transparent !important; box-shadow: none !important; }
.bio-esc-consola { grid-column: 1; }
.bio-esc-consola-lista { flex: 1; min-height: 140px; max-height: 220px; overflow-y: auto; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 12px; display: flex; flex-direction: column; gap: 4px; }
.bio-esc-consola-lista .msg { color: #E8EDF1; white-space: pre-wrap; word-break: break-word; }
.bio-esc-consola-lista .msg.tipo-error { color: #F08A83; }
.bio-esc-consola-lista .msg.tipo-warning { color: #F2A65A; }
.bio-esc-consola-lista .cuando { color: #5A6670; margin-right: 8px; }
</style>

<template>
	<div class="bio-esc">
		<section class="bio-esc-card bio-esc-trabajo" :aria-label="$t('domotek.desktop.job')">
			<div class="bio-esc-cam">
				<webcam-panel v-if="webcamActiva" class="pa-0"></webcam-panel>
				<span v-else>{{ $t('domotek.desktop.noWebcam') }}</span>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; min-width: 0">
				<h2>{{ imprimiendo ? $t('domotek.desktop.jobRunning') : $t('domotek.jobs.noJob') }}</h2>
				<div class="bio-esc-fila">
					<span class="bio-esc-archivo">{{ imprimiendo ? archivo : (ultimoArchivo || '—') }}</span>
					<span v-if="imprimiendo" class="bio-esc-pct">{{ Math.round(jobProgress * 100) }} %</span>
				</div>
				<div class="bio-barra"><div :style="{ width: (imprimiendo ? jobProgress * 100 : 0) + '%' }"></div></div>
				<div class="bio-esc-datos">
					<div>{{ $t('domotek.jobs.layer') }}<div>{{ job.file && job.file.numLayers ? `${job.layer || 0} / ${job.file.numLayers}` : '—' }}</div></div>
					<div>{{ $t('domotek.jobs.elapsed') }}<div>{{ imprimiendo ? $displayTime(job.duration) : '—' }}</div></div>
					<div>{{ $t('domotek.jobs.remaining') }}<div>{{ imprimiendo && queda ? $displayTime(queda) : '—' }}</div></div>
					<div>Tool<div>{{ toolActual }}</div></div>
				</div>
				<div class="bio-esc-acciones">
					<template v-if="imprimiendo">
						<code-btn class="bio-esc-btn" :code="pausado ? 'M24' : 'M25'" no-wait>
							<v-icon left small>{{ pausado ? 'mdi-play' : 'mdi-pause' }}</v-icon>{{ pausado ? $t('domotek.jobs.resume') : $t('domotek.jobs.pause') }}
						</code-btn>
						<code-btn class="bio-esc-btn peligro" :code="cancelCode" :disabled="!pausado" no-wait>
							<v-icon left small>mdi-stop</v-icon>{{ $t('domotek.jobs.cancel') }}
						</code-btn>
					</template>
					<template v-else>
						<button type="button" class="bio-esc-btn acento" @click="$router.push('/Files/Jobs')">{{ $t('domotek.jobs.chooseFile') }}</button>
						<code-btn v-if="repetirCode" class="bio-esc-btn" :code="repetirCode" no-wait><v-icon left small>mdi-restart</v-icon>{{ $t('domotek.jobs.repeat') }}</code-btn>
					</template>
					<div style="flex: 1"></div>
					<span class="bio-tenue">{{ $t('panel.speedFactor.caption') }} <strong style="color: #E8EDF1">{{ Math.round((move.speedFactor || 1) * 100) }} %</strong></span>
				</div>
			</div>
		</section>

		<section class="bio-esc-card" :aria-label="$t('domotek.desktop.tools')">
			<h2>{{ $t('domotek.desktop.tools') }}</h2>
			<table class="bio-esc-tabla">
				<thead><tr><th></th><th>Tool</th><th style="text-align: right">{{ $t('domotek.desktop.current') }}</th><th style="text-align: right">{{ $t('domotek.tools.target') }}</th></tr></thead>
				<tbody>
					<tr v-for="f in filasTools" :key="f.et">
						<td class="bio-tenue">{{ f.et }}</td>
						<td style="overflow: hidden; text-overflow: ellipsis; max-width: 140px"><span :class="{ 'bio-cap': !f.et }">{{ f.nombre }}</span></td>
						<td class="num">{{ f.actual }}</td>
						<td class="num obj">{{ f.objetivo }}</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="bio-esc-card bio-esc-consola" :aria-label="$t('domotek.desktop.console')">
			<div style="display: flex; align-items: center; gap: 10px">
				<h2 style="flex: 1">{{ $t('domotek.desktop.position') }}</h2>
				<code-btn code="G28" class="bio-esc-btn" no-wait><v-icon left small>mdi-home-outline</v-icon>{{ $t('button.home.captionAll') }}</code-btn>
			</div>
			<div class="bio-esc-pos">
				<div v-for="(eje, i) in ejes" :key="i">
					<div class="et">{{ etiquetaEje(i, eje) }}</div>
					<div class="vl" :class="{ 'sin-home': !eje.homed }">{{ eje.letter === 'Z' ? $displayZ(eje.userPosition, false) : $display(eje.userPosition, 1) }}</div>
				</div>
			</div>
			<h2 class="mt-2">{{ $t('domotek.desktop.console') }}</h2>
			<code-input></code-input>
			<div class="bio-esc-consola-lista">
				<div v-for="(m, i) in ultimosMensajes" :key="i" class="msg" :class="'tipo-' + m.type"><span class="cuando">{{ hora(m.date) }}</span>{{ m.title }}{{ m.message ? ' ' + m.message : '' }}</div>
				<span v-if="!ultimosMensajes.length" class="bio-tenue">{{ $t('domotek.desktop.noMessages') }}</span>
			</div>
		</section>

		<section class="bio-esc-card bio-esc-grafica" :aria-label="$t('domotek.desktop.chart')">
			<div style="flex: 1; min-height: 240px; position: relative">
				<temperature-chart></temperature-chart>
			</div>
		</section>
	</div>
</template>

<script>
'use strict'

import { mapState, mapGetters } from 'vuex'
import { isPrinting, isPaused } from '../../store/machine/modelEnums.js'
import { extractFileName } from '../../utils/path.js'

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
		...mapState('machine', ['events']),
		...mapState('settings', ['webcam']),
		...mapGetters('machine/model', ['jobProgress']),
		imprimiendo() { return isPrinting(this.status); },
		pausado() { return isPaused(this.status); },
		archivo() { return (this.job.file && this.job.file.fileName) ? extractFileName(this.job.file.fileName) : ''; },
		ultimoArchivo() { return this.job.lastFileName ? extractFileName(this.job.lastFileName) : ''; },
		queda() { const t = this.job.timesLeft || {}; return t.file || t.slicer || t.filament || null; },
		webcamActiva() { return !!(this.webcam && this.webcam.url); },
		modelo() { return this.global ? this.global.MachineModel : undefined; },
		cancelCode() {
			return (this.global && this.global.notifyPrintCanceled)
				? 'set global.jobWasCancelled = true\nM1212\nM0 H1'
				: 'set global.jobWasCancelled = true\nM0 H1';
		},
		repetirCode() {
			if (!this.job.lastFileName) { return ''; }
			return this.job.lastFileSimulated ? `M37 P"${this.job.lastFileName}"` : `M32 "${this.job.lastFileName}"`;
		},
		ejes() { return (this.move.axes || []).filter(a => a.visible); },
		toolActual() {
			const g = this.global || {};
			for (let i = 0; i < 4; i++) {
				if (g['T' + i + 'Activo']) { return `T${i + 1} · ${g['T' + i + 'Name'] || ''}`; }
			}
			return '—';
		},
		filasTools() {
			const h = this.heaters || [];
			const g = this.global || {};
			const t = x => (!x || x.current === undefined || x.current <= -273) ? '—' : `${x.current.toFixed(1)} °C`;
			const o = x => (x && x.state === 'active' && x.active) ? `${x.active} °C` : '—';
			const filas = [];
			const n = Math.min((this.tools || []).length, 4);
			for (let i = 0; i < n; i++) {
				filas.push({ et: `T${i + 1}`, nombre: g['T' + i + 'Name'] || '—', actual: t(h[i + 1]), objetivo: o(h[i + 1]) });
			}
			filas.push({ et: '', nombre: this.$t('domotek.tools.platform'), actual: t(h[0]), objetivo: o(h[0]) });
			if (h[20] && g.ChamberMode) {
				filas.push({ et: '', nombre: 'Chamber', actual: t(h[20]), objetivo: o(h[20]) });
			}
			return filas;
		},
		ultimosMensajes() {
			return (this.events || []).slice(-30).reverse();
		}
	},
	methods: {
		etiquetaEje(index, axis) {
			const nombres = { '2A': ['X0', 'Y', 'Z', 'X1'], '4A': ['X', 'Y1', 'Z1', 'Y2', 'Y3', 'Y4', 'Z2'], 'HK': ['X1', 'Y1', 'Z', 'X2', 'X3', 'X4', 'Y2'] };
			const lista = nombres[this.modelo];
			return (lista && lista[index]) ? lista[index] : axis.letter;
		},
		hora(t) {
			try { return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
		}
	}
}
</script>

'use strict'

// domotek: historial ligero de temperaturas para la gráfica del modo escritorio.
// Toma una muestra cada 2 s de los calentadores y guarda los últimos 10 minutos.

import Vue from 'vue'

const PERIODO_MS = 2000;
const MUESTRAS = 300;			// 300 × 2 s = 10 min

export const historial = Vue.observable({ muestras: [] });

let temporizador = null;

export function iniciarHistorial(store) {
	if (temporizador) { return; }
	const tomar = () => {
		const heaters = (store.state.machine.model.heat && store.state.machine.model.heat.heaters) || [];
		const actual = heaters.map(h => (h && h.current > -273) ? h.current : null);
		historial.muestras.push({ t: Date.now(), v: actual });
		if (historial.muestras.length > MUESTRAS) { historial.muestras.splice(0, historial.muestras.length - MUESTRAS); }
	};
	tomar();
	temporizador = setInterval(tomar, PERIODO_MS);
}

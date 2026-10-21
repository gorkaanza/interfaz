'use strict'

/*
 * Modelo de dispensado del solenoide (EMD).
 *
 *   V[nL] = k · P[bar] · (tOpen[ms] − t0[ms]) / μ(T)[mPa·s]
 *
 * - k y t0 dependen de la válvula y la boquilla (fijas) y se obtienen calibrando.
 * - μ(T) corrige la viscosidad introducida por el usuario (a TREF) con Arrhenius.
 * Todos los límites son PROVISIONALES: ajústalos a la válvula y al motor reales.
 */
export const EMD_MACHINE = {
	pMin: 0.05,       // bar, presión mínima estable
	pMax: 4,          // bar, presión máxima que puede generar el motor sin riesgo
	tMin: 0.3,        // ms, apertura mínima del driver/válvula (el driver trabaja en µs)
	tMax: 200,        // ms, apertura máxima antes de que deje de ser una gota
	tRecov: 20,       // ms, margen entre gotas (tiempo de ciclo = apertura + tRecov)
	B: 2000,          // K, sensibilidad de la viscosidad a la temperatura (agua ≈ 1800)
	tRef: 25,         // °C, temperatura a la que el usuario da la viscosidad
	kDefault: 300,    // valor de arranque mientras no haya calibración (nL·mPa·s / (bar·ms))
	t0Default: 0.2,   // ms
};

const toK = c => c + 273.15;
const round2 = x => Math.round(x * 100) / 100;

// Viscosidad a la temperatura T a partir de la de referencia
export function viscAt(muRef, T, m = EMD_MACHINE) {
	return muRef * Math.exp(m.B * (1 / toK(T) - 1 / toK(m.tRef)));
}

// Presión de partida según viscosidad: fluidos fluidos → presión baja para gotas estables
export function startPressure(mu) {
	if (mu < 10) return 0.2;
	if (mu < 100) return 0.5;
	if (mu < 1000) return 1;
	if (mu < 10000) return 2;
	return 3;
}

/*
 * Cálculo inverso: dado un volumen por gota, devuelve presión, apertura y ciclo.
 * Prioriza la presión de partida y solo la mueve si el tiempo se sale de rango.
 */
export function solve(V, mu, k, t0, m = EMD_MACHINE) {
	if (!(V > 0) || !(mu > 0) || !(k > 0)) return { ok: false, reason: 'missingData' };

	let t = t0 + (V * mu) / (k * startPressure(mu));
	// Resolución de 10 µs: el driver acepta µs enteros
	t = Math.min(m.tMax, Math.max(m.tMin, round2(t)));
	if (t <= t0) t = round2(t0 + m.tMin);

	const P = (V * mu) / (k * (t - t0));
	if (P < m.pMin) return { ok: false, reason: 'tooSmall' };
	if (P > m.pMax) return { ok: false, reason: 'tooLarge' };

	return { ok: true, P: round2(P), t, cycle: round2(t + m.tRecov) };
}

/*
 * Ajuste de calibración. Con y = V·μ/P la relación es lineal en t:
 *   y = k·t − k·t0   →   pendiente = k, ordenada = −k·t0
 */
export function fit(points, mu) {
	const pts = points.filter(p => p.V > 0);
	if (pts.length < 2 || new Set(pts.map(p => p.t)).size < 2) return { ok: false, reason: 'notEnoughPoints' };

	const xs = pts.map(p => p.t);
	const ys = pts.map(p => (p.V * mu) / p.P);
	const n = xs.length;
	const mx = xs.reduce((a, b) => a + b, 0) / n;
	const my = ys.reduce((a, b) => a + b, 0) / n;
	let sxy = 0, sxx = 0, syy = 0;
	for (let i = 0; i < n; i++) {
		sxy += (xs[i] - mx) * (ys[i] - my);
		sxx += (xs[i] - mx) ** 2;
		syy += (ys[i] - my) ** 2;
	}
	const k = sxy / sxx;
	if (!(k > 0)) return { ok: false, reason: 'badFit' };
	const b = my - k * mx;
	const t0 = Math.max(0, -b / k);
	const r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
	return { ok: true, k: Math.round(k * 10) / 10, t0: Math.round(t0 * 100) / 100, r2: Math.round(r2 * 1000) / 1000 };
}

// Puntos de calibración: 3 aperturas a la presión de partida y 1 a presión mayor
export function calibrationGrid(mu, m = EMD_MACHINE) {
	const P0 = startPressure(mu);
	const P1 = Math.min(m.pMax, round2(P0 * 1.5));
	return [
		{ P: P0, t: 1 }, { P: P0, t: 2 }, { P: P0, t: 4 }, { P: P1, t: 2 },
	].map(p => ({ ...p, V: null, state: 'pending' }));
}